import { supabase } from "@/integrations/supabase/client";

export interface Conversation {
  id: string;
  listing_id: string | null;
  buyer_id: string;
  seller_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  listing?: {
    id: string;
    title: string;
    price: number;
    image_url: string;
    front_cover: string | null;
  };
  buyer?: { id: string; first_name: string | null; last_name: string | null; email: string | null };
  seller?: { id: string; first_name: string | null; last_name: string | null; email: string | null };
  last_message?: ChatMessage;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string | null;
  is_flagged: boolean;
  read_at: string | null;
  created_at: string;
}

const PERSONAL_INFO_PATTERNS = [
  /\b\d{10,13}\b/g,
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  /\b\d{6,}\b/g,
];

export function checkForPersonalInfo(content: string): boolean {
  return PERSONAL_INFO_PATTERNS.some(pattern => {
    pattern.lastIndex = 0;
    return pattern.test(content);
  });
}

export async function getOrCreateConversation(
  listingId: string,
  buyerId: string,
  sellerId: string
): Promise<Conversation> {
  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("*")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .eq("status", "active")
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing as Conversation;

  const { data: created, error: createError } = await supabase
    .from("conversations")
    .insert({ listing_id: listingId, buyer_id: buyerId, seller_id: sellerId })
    .select()
    .single();

  if (createError) throw createError;
  return created as Conversation;
}

export async function getUserConversations(userId: string, includeArchived = false): Promise<Conversation[]> {
  let query = supabase
    .from("conversations")
    .select("*")
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order("updated_at", { ascending: false });

  if (!includeArchived) {
    query = query.eq("status", "active");
  }

  const { data, error } = await query;
  if (error) throw error;

  const conversations = data as Conversation[];
  const enriched = await Promise.all(
    conversations.map(async (conv) => {
      const [listingResult, buyerResult, sellerResult, lastMsgResult] = await Promise.allSettled([
        conv.listing_id
          ? supabase.from("books").select("id, title, price, image_url, front_cover").eq("id", conv.listing_id).maybeSingle()
          : Promise.resolve({ data: null, error: null }),
        supabase.from("profiles").select("id, first_name, last_name, email").eq("id", conv.buyer_id).maybeSingle(),
        supabase.from("profiles").select("id, first_name, last_name, email").eq("id", conv.seller_id).maybeSingle(),
        supabase.from("messages").select("*").eq("conversation_id", conv.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);

      const getResult = (result: PromiseSettledResult<any>) =>
        result.status === 'fulfilled' ? result.value.data || undefined : undefined;

      return {
        ...conv,
        listing: getResult(listingResult),
        buyer: getResult(buyerResult),
        seller: getResult(sellerResult),
        last_message: getResult(lastMsgResult),
      } as Conversation;
    })
  );

  return enriched;
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch messages:", error);
      return [];
    }
    return (data || []) as ChatMessage[];
  } catch (err) {
    console.error("Error in getMessages:", err);
    return [];
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  mediaUrl?: string,
  mediaType?: string
): Promise<ChatMessage> {
  const isFlagged = checkForPersonalInfo(content);

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      media_url: mediaUrl || null,
      media_type: mediaType || null,
      is_flagged: isFlagged,
    })
    .select()
    .single();

  if (error) throw new Error("Failed to send message: " + error.message);

  // Also update conversation updated_at
  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return data as ChatMessage;
}

export async function reportConversation(
  conversationId: string,
  reportedBy: string,
  reason: string
): Promise<void> {
  const { error } = await supabase
    .from("chat_reports")
    .insert({ conversation_id: conversationId, reported_by: reportedBy, reason });
  if (error) throw error;
}

export async function archiveConversation(conversationId: string): Promise<void> {
  const { error } = await supabase
    .from("conversations")
    .update({ status: "archived" })
    .eq("id", conversationId);
  if (error) throw error;
}
