import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? '';

interface CreateOrderRequest {
  buyer_id: string;
  seller_id: string;
  book_id: string;
  delivery_option: string;
  shipping_address_encrypted?: string;
  payment_reference?: string;
  selected_courier_slug?: string;
  selected_service_code?: string;
  selected_courier_name?: string;
  selected_service_name?: string;
  selected_shipping_cost?: number;
  pickup_type?: 'door' | 'locker';
  pickup_locker_data?: any;
  pickup_locker_location_id?: number;
  pickup_locker_provider_slug?: string;
  delivery_type?: 'door' | 'locker';
  delivery_locker_data?: any;
  delivery_locker_location_id?: number;
  delivery_locker_provider_slug?: string;
  seller_preferred_pickup_method?: 'locker' | 'pickup';
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: CreateOrderRequest = await req.json();

    // Validate required fields
    if (!requestData.buyer_id || !requestData.seller_id || !requestData.book_id || !requestData.delivery_option) {
      console.error("❌ Missing required fields");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields: buyer_id, seller_id, book_id, delivery_option"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // If a payment_reference was provided, check for existing order (idempotency)
    if (requestData.payment_reference) {
      const { data: existingByRef, error: existingRefError } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_reference', requestData.payment_reference)
        .maybeSingle();

      if (existingRefError) {
        console.warn('⚠️ Failed to query existing order by payment_reference:', existingRefError);
      }

      if (existingByRef) {
        console.log('ℹ️ Existing order found by payment_reference. Returning existing order.');
        return new Response(
          JSON.stringify({ success: true, message: 'Order already exists', order: existingByRef }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check for existing active order for this buyer/seller/book combination
    console.log('🔎 Checking for existing active order for buyer/seller/book');
    const { data: existingCombo, error: existingComboError } = await supabase
      .from('orders')
      .select('*')
      .eq('buyer_id', requestData.buyer_id)
      .eq('seller_id', requestData.seller_id)
      .eq('book_id', requestData.book_id)
      .in('status', ['pending_payment', 'pending', 'pending_commit', 'paid', 'committed'])
      .maybeSingle();

    if (existingComboError) {
      console.warn('⚠️ Failed to query existing order by combo:', existingComboError);
    }

    if (existingCombo) {
      console.log('ℹ️ Existing active order found for combo. Returning existing order.');
      return new Response(
        JSON.stringify({ success: true, message: 'Order already exists', order: existingCombo }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Helper to find item across all tables
    const findItem = async (id: string) => {
      const tables = ['books', 'uniforms', 'school_supplies'];
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("id", id)
          .maybeSingle();
        
        if (data) return { data, table };
      }
      return { data: null, table: null };
    };

    // Fetch buyer, seller, and item info
    const [buyerResult, sellerResult, { data: book, table: itemTable }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, name, first_name, last_name, email, phone_number, preferred_delivery_locker_data, preferred_delivery_locker_location_id, preferred_delivery_locker_provider_slug, preferred_pickup_locker_data, preferred_pickup_locker_location_id, preferred_pickup_locker_provider_slug, shipping_address_encrypted")
        .eq("id", requestData.buyer_id)
        .single(),
      supabase
        .from("profiles")
        .select("id, full_name, name, first_name, last_name, email, phone_number, pickup_address_encrypted, preferred_pickup_locker_data, preferred_pickup_locker_location_id, preferred_pickup_locker_provider_slug, preferred_delivery_locker_data, preferred_delivery_locker_location_id, preferred_delivery_locker_provider_slug, is_away")
        .eq("id", requestData.seller_id)
        .single(),
      findItem(requestData.book_id)
    ]);

    const buyer = buyerResult.data;
    const seller = sellerResult.data;

    if (buyerResult.error || !buyer) {
      console.error("❌ Buyer fetch error:", buyerResult.error);
      return new Response(
        JSON.stringify({ success: false, error: "Buyer not found: " + (buyerResult.error?.message || "Not found") }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (sellerResult.error || !seller) {
      console.error("❌ Seller fetch error:", sellerResult.error);
      return new Response(
        JSON.stringify({ success: false, error: "Seller not found: " + (sellerResult.error?.message || "Not found") }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (seller.is_away) {
      return new Response(
        JSON.stringify({ success: false, error: "Seller is currently away and not accepting new orders" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!book) {
      console.error("❌ Item not found in any table:", requestData.book_id);
      return new Response(
        JSON.stringify({ success: false, error: "Item not found in any inventory" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if book is available (NOT sold yet)
    if (book.sold || book.available_quantity < 1) {
      console.error("❌ Book is not available");
      return new Response(
        JSON.stringify({ success: false, error: "Book is not available - it may have been purchased by someone else" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // NOTE: We do NOT mark the book as sold here anymore.
    // The book will only be marked as sold when payment is confirmed (via webhook).
    console.log("📝 Creating order WITHOUT marking book as sold (deferred until payment confirmation)...");

    // Determine pickup type based on seller's preference
    let pickupType: 'door' | 'locker' = 'door';
    let pickupLockerData = null;
    let pickupLockerLocationId = null;
    let pickupLockerProviderSlug = null;

    if (requestData.seller_preferred_pickup_method === 'locker') {
      console.log('📍 Seller preferred pickup method: locker');
      pickupType = 'locker';
      pickupLockerData = requestData.pickup_locker_data || seller.preferred_pickup_locker_data || seller.preferred_delivery_locker_data;
      pickupLockerLocationId = requestData.pickup_locker_location_id || seller.preferred_pickup_locker_location_id || seller.preferred_delivery_locker_location_id;
      pickupLockerProviderSlug = requestData.pickup_locker_provider_slug || seller.preferred_pickup_locker_provider_slug || seller.preferred_delivery_locker_provider_slug;

      if (!pickupLockerLocationId) {
        console.error("❌ Locker pickup selected but seller has no locker location saved");
        return new Response(
          JSON.stringify({ success: false, error: "Seller locker pickup selected but no locker location is configured. Please contact the seller." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (requestData.seller_preferred_pickup_method === 'pickup' || seller.pickup_address_encrypted) {
      console.log('🚪 Seller preferred pickup method: door');
      pickupType = 'door';
    } else {
      console.error("❌ No valid pickup method available");
      return new Response(
        JSON.stringify({ success: false, error: "Seller has not configured a pickup method (locker or address). Please contact the seller." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine delivery type and data
    const deliveryType = requestData.delivery_type || 'door';
    let deliveryLockerData = null;
    let deliveryLockerLocationId = null;
    let deliveryLockerProviderSlug = null;
    let shippingAddressEncrypted = requestData.shipping_address_encrypted;

    if (deliveryType === 'locker') {
      deliveryLockerData = requestData.delivery_locker_data || buyer.preferred_delivery_locker_data;
      deliveryLockerLocationId = requestData.delivery_locker_location_id || buyer.preferred_delivery_locker_location_id || buyer.preferred_pickup_locker_location_id;
      deliveryLockerProviderSlug = requestData.delivery_locker_provider_slug || buyer.preferred_delivery_locker_provider_slug || buyer.preferred_pickup_locker_provider_slug;
    } else {
      shippingAddressEncrypted = shippingAddressEncrypted || buyer.shipping_address_encrypted;
    }

    // Validate pickup address for door pickup
    if (pickupType === 'door' && !seller.pickup_address_encrypted) {
      console.error("❌ Door pickup selected but seller has no pickup address");
      return new Response(
        JSON.stringify({ success: false, error: "Seller door pickup selected but seller has no pickup address configured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate delivery info
    if (deliveryType === 'locker' && !deliveryLockerLocationId) {
      console.error("❌ Locker delivery selected but no locker location provided");
      return new Response(
        JSON.stringify({ success: false, error: "Locker delivery requires locker location" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (deliveryType === 'door' && !shippingAddressEncrypted) {
      console.error("❌ Door delivery selected but no address provided");
      return new Response(
        JSON.stringify({ success: false, error: "Door delivery requires shipping address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate unique order_id
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Prepare denormalized data
    const buyerFullName = buyer.full_name || buyer.name || `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim() || 'Unknown Buyer';
    const sellerFullName = seller.full_name || seller.name || `${seller.first_name || ''} ${seller.last_name || ''}`.trim() || 'Unknown Seller';
    const buyerEmail = buyer.email || '';
    const sellerEmail = seller.email || '';
    const buyerPhone = buyer.phone_number || '';
    const sellerPhone = seller.phone_number || '';
    const pickupAddress = pickupType === 'door' ? seller.pickup_address_encrypted : '';

    // Resolve item_type from which table it was found in
    const itemTypeMap: Record<string, string> = {
      books: 'book',
      uniforms: 'uniform',
      school_supplies: 'school_supply',
    };
    const resolvedItemType = itemTypeMap[itemTable!] || 'book';

    // Create order with status "pending_payment" - item is NOT marked sold yet
    const orderData = {
      order_id: orderId,
      buyer_id: requestData.buyer_id,
      seller_id: requestData.seller_id,
      book_id: requestData.book_id,    // kept for backwards compat
      item_id: requestData.book_id,    // generic alias
      item_type: resolvedItemType,     // 'book' | 'uniform' | 'school_supply'
      buyer_full_name: buyerFullName,
      seller_full_name: sellerFullName,
      buyer_email: buyerEmail,
      seller_email: sellerEmail,
      buyer_phone_number: buyerPhone,
      seller_phone_number: sellerPhone,
      pickup_address_encrypted: pickupAddress,
      shipping_address_encrypted: shippingAddressEncrypted,
      delivery_option: requestData.delivery_option,
      pickup_type: pickupType,
      pickup_locker_data: pickupLockerData,
      pickup_locker_location_id: pickupLockerLocationId,
      pickup_locker_provider_slug: pickupLockerProviderSlug,
      delivery_type: deliveryType,
      delivery_locker_data: deliveryLockerData,
      delivery_locker_location_id: deliveryLockerLocationId,
      delivery_locker_provider_slug: deliveryLockerProviderSlug,
      delivery_data: {
        delivery_option: requestData.delivery_option,
        delivery_type: deliveryType,
        pickup_type: pickupType,
        requested_at: new Date().toISOString(),
        selected_courier_slug: requestData.selected_courier_slug,
        selected_service_code: requestData.selected_service_code,
        selected_courier_name: requestData.selected_courier_name,
        selected_service_name: requestData.selected_service_name,
        selected_shipping_cost: requestData.selected_shipping_cost,
      },
      payment_reference: requestData.payment_reference,
      paystack_reference: requestData.payment_reference,
      selected_courier_slug: requestData.selected_courier_slug,
      selected_service_code: requestData.selected_service_code,
      selected_courier_name: requestData.selected_courier_name,
      selected_service_name: requestData.selected_service_name,
      selected_shipping_cost: requestData.selected_shipping_cost,
      // CRITICAL: Order starts as pending_payment - not yet paid
      status: "pending_payment",
      payment_status: "pending",
      amount: Math.round(book.price * 100),
      total_amount: book.price,
      items: [{
        item_id: book.id,
        book_id: book.id,       // backwards compat
        item_type: resolvedItemType,
        title: book.title,
        name: book.name || book.title,
        author: book.author,
        price: book.price,
        condition: book.condition,
      }]
    };


    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error("❌ Failed to create order:", orderError);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create order: " + orderError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("✅ Order created successfully (pending payment). Book NOT marked as sold yet.");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Order created successfully - awaiting payment",
        order: {
          id: order.id,
          order_id: order.order_id,
          status: order.status,
          payment_status: order.payment_status,
          total_amount: order.total_amount,
          buyer_email: order.buyer_email,
          seller_email: order.seller_email,
          pickup_type: order.pickup_type,
          delivery_type: order.delivery_type
        }
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error creating order:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace');
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
