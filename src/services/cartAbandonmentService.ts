/**
 * cartAbandonmentService.ts
 * 
 * Logs cart abandonment events when users leave items in their cart.
 * The `abandoned-cart` edge function runs on a schedule to pick up
 * logs older than 10 minutes and send recovery emails.
 */

import { supabase } from "@/integrations/supabase/client";

interface CartItem {
  id: string;
  title: string;
  price: number;
}

/**
 * Records a cart abandonment event in the database.
 * Call this when the user logs out, navigates away from checkout,
 * or session ends while items remain in the cart.
 */
export async function logCartAbandonment(items: CartItem[]): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return; // Only track authenticated users

    const totalValue = items.reduce((sum, i) => sum + i.price, 0);

    await supabase.from("cart_abandonment_logs").insert({
      user_id: user.id,
      user_email: user.email,
      user_name:
        user.user_metadata?.first_name ||
        (user.user_metadata?.name || "").split(" ")[0] ||
        user.email.split("@")[0],
      item_ids: items.map(i => i.id),
      item_titles: items.map(i => i.title),
      item_prices: items.map(i => i.price),
      total_value: totalValue,
    });
  } catch {
    // Non-fatal — don't disrupt the user flow
  }
}

/**
 * Marks a cart as recovered (user returned and purchased).
 * Call this after a successful order is placed.
 */
export async function markCartRecovered(userEmail: string): Promise<void> {
  try {
    await supabase
      .from("cart_abandonment_logs")
      .update({ recovered_at: new Date().toISOString() })
      .eq("user_email", userEmail)
      .is("recovered_at", null)
      .is("email_sent_at", null);
  } catch {
    // Non-fatal
  }
}
