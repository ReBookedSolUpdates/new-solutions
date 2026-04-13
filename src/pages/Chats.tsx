import { useState } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import ChatList from "@/components/chat/ChatList";
import ChatView from "@/components/chat/ChatView";
import { Conversation } from "@/services/chatService";
import { useIsMobile } from "@/hooks/use-mobile";

const Chats = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const isMobile = useIsMobile();
  const [listRefreshKey, setListRefreshKey] = useState(0);

  const showList = !isMobile || !selectedConversation;
  const showChat = !isMobile || !!selectedConversation;

  const handleArchived = () => {
    setSelectedConversation(null);
    setListRefreshKey(k => k + 1);
  };

  return (
    <Layout>
      <SEO
        title="My Chats – ReBooked Solutions"
        description="Chat with buyers and sellers on ReBooked Solutions"
        url="https://www.rebookedsolutions.co.za/chats"
      />
      <div className="container mx-auto max-w-6xl h-[calc(100vh-8rem)]">
        <div className="flex h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
          {/* Chat List */}
          {showList && (
            <div className={`${isMobile ? "w-full" : "w-[340px] border-r border-gray-200"} flex-shrink-0`}>
              <ChatList
                key={listRefreshKey}
                onSelectConversation={setSelectedConversation}
                selectedId={selectedConversation?.id}
              />
            </div>
          )}

          {/* Chat View */}
          {showChat && selectedConversation ? (
            <div className="flex-1">
              <ChatView
                conversation={selectedConversation}
                onBack={() => setSelectedConversation(null)}
                onArchived={handleArchived}
              />
            </div>
          ) : (
            !isMobile && (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Select a conversation to start chatting</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chats;
