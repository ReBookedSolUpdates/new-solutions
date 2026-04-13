import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('[check-expired-orders] Starting cleanup of expired orders...');

    // 1. Call the stored procedure to cancel expired orders and notify users
    const { error: rpcError } = await supabase.rpc('auto_cancel_expired_orders');

    if (rpcError) {
      console.error('[check-expired-orders] RPC Error:', rpcError);
      throw rpcError;
    }

    // 2. Additional cleanup: Ensure items associated with cancelled orders are marked as available
    // We fetch orders that were cancelled in the last 10 minutes (to avoid processing everything)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { data: cancelledOrders, error: fetchError } = await supabase
      .from('orders')
      .select('id, item_id, item_type')
      .eq('status', 'cancelled')
      .gte('cancelled_at', tenMinutesAgo);

    if (fetchError) {
      console.error('[check-expired-orders] Error fetching cancelled orders:', fetchError);
    } else if (cancelledOrders && cancelledOrders.length > 0) {
      console.log(`[check-expired-orders] Found ${cancelledOrders.length} recently cancelled orders to reconcile inventory.`);
      
      for (const order of cancelledOrders) {
        if (!order.item_id || !order.item_type) continue;
        
        const tableMap: Record<string, string> = {
          'book': 'books',
          'uniform': 'uniforms',
          'school_supply': 'school_supplies',
          'stationery': 'school_supplies'
        };
        
        const tableName = tableMap[order.item_type] || order.item_type;
        
        console.log(`[check-expired-orders] Reconciling item ${order.item_id} in table ${tableName}`);
        
        const { error: updateError } = await supabase
          .from(tableName)
          .update({ sold: false })
          .eq('id', order.item_id);
          
        if (updateError) {
          console.error(`[check-expired-orders] Failed to reconcile item ${order.item_id}:`, updateError);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Expired orders processed and inventory reconciled' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[check-expired-orders] Fatal error:', errorMessage);
    
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
