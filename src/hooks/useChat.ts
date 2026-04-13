import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Conversation,
  ChatMessage,
  getUserConversations,
  getMessages,
  sendMessage,
  getOrCreateConversation,
} from "@/services/chatService";
import { toast } from "sonner";

export function useConversations(includeArchived = false) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      const data = await getUserConversations(user.id, includeArchived);
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, includeArchived]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel("conversations-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => { load(); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => { load(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id, load]);

  return { conversations, isLoading, refresh: load };
}

export function useChatMessages(conversationId: string | null) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      setIsLoading(true);
      const data = await getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  // Real-time: INSERT new messages
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const updated = payload.new as ChatMessage;
          setMessages((prev) => prev.map(m => m.id === updated.id ? updated : m));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  const send = useCallback(
    async (content: string, mediaUrl?: string, mediaType?: string) => {
      if (!conversationId || !user?.id) return;
      try {
        setIsSending(true);
        const sent = await sendMessage(conversationId, user.id, content, mediaUrl, mediaType);
        // Optimistically add if not already added by realtime
        setMessages((prev) => {
          if (prev.some(m => m.id === sent.id)) return prev;
          return [...prev, sent];
        });
        // Fire-and-forget notification
        supabase.functions.invoke("chat-notification", {
          body: { conversation_id: conversationId, sender_id: user.id, content },
        }).catch(() => {});
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to send message";
        toast.error(errorMessage);
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, user?.id]
  );

  return { messages, isLoading, isSending, send, refresh: loadMessages };
}

export function useStartConversation() {
  const { user } = useAuth();
  const [isStarting, setIsStarting] = useState(false);

  const startConversation = useCallback(
    async (listingId: string, sellerId: string): Promise<string | null> => {
      if (!user?.id) {
        toast.error("Please log in to chat with sellers");
        return null;
      }
      if (user.id === sellerId) {
        toast.error("You can't chat with yourself");
        return null;
      }
      try {
        setIsStarting(true);
        const conversation = await getOrCreateConversation(listingId, user.id, sellerId);
        return conversation.id;
      } catch (err) {
        console.error("Failed to start conversation:", err);
        toast.error("Failed to start conversation");
        return null;
      } finally {
        setIsStarting(false);
      }
    },
    [user?.id]
  );

  return { startConversation, isStarting };
}
