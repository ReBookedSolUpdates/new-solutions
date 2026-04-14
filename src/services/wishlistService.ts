import { supabase } from "@/integrations/supabase/client";

export async function getWishlistIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("wishlists")
    .select("listing_id")
    .eq("user_id", userId);
  if (error) throw error;
  return (data || []).map((row: any) => row.listing_id);
}

export async function toggleWishlistItem(userId: string, listingId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userId)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase.from("wishlists").delete().eq("id", existing.id);
    if (error) throw error;
    return false;
  }

  const { error } = await supabase
    .from("wishlists")
    .insert({ user_id: userId, listing_id: listingId });
  if (error) throw error;
  return true;
}
