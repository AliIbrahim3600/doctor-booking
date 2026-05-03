import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "../../store/store";
import { messageService } from "../../services/messageService";
import Swal from "sweetalert2";

interface Conversation {
  userId: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  _id: string;
  senderId: { _id: string; name: string; avatar?: string };
  content: string;
  createdAt: string;
}

const PatientMessages = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationSearch, setConversationSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conv: Conversation) => {
    try {
      const data = await messageService.getMessages(conv.userId);
      setMessages(data);
      setSelectedConversation(conv);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      await messageService.sendMessage({
        receiverId: selectedConversation.userId,
        receiverRole: "doctor",
        content: newMessage.trim(),
      });
      setNewMessage("");
      await fetchMessages(selectedConversation);
      await fetchConversations();
    } catch {
      Swal.fire("Error", "Failed to send message.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-outline-variant/20 bg-surface flex flex-col ${selectedConversation ? "hidden md:flex" : "flex"}`}>
        <div className="p-6 border-b border-outline-variant/20">
          <h1 className="text-xl font-headline font-extrabold text-on-surface mb-4">Messages</h1>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={conversationSearch}
              onChange={(e) => setConversationSearch(e.target.value)}
              className="w-full bg-surface-container-low border-0 rounded-xl py-2.5 pl-10 pr-4 text-sm font-body outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/10">
          {loading ? (
            <div className="p-8 text-center text-outline-variant">Loading...</div>
          ) : conversations.filter(c => c.name.toLowerCase().includes(conversationSearch.toLowerCase())).length > 0 ? (
            conversations.filter(c => c.name.toLowerCase().includes(conversationSearch.toLowerCase())).map((conv) => (
              <button
                key={conv.userId}
                onClick={() => fetchMessages(conv)}
                className={`w-full p-4 text-left hover:bg-surface-container-low transition-colors ${selectedConversation?.userId === conv.userId ? "bg-surface-container-low" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
                    {conv.avatar ? (
                      <img src={conv.avatar} alt={conv.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-white">person</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-on-surface truncate">{conv.name}</p>
                      <span className="text-xs text-on-surface-variant shrink-0 ml-2">
                        {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center flex flex-col items-center text-outline-variant">
              <span className="material-symbols-outlined text-4xl mb-4">chat_bubble_outline</span>
              <p className="text-sm">No conversations yet.</p>
              <p className="text-xs mt-1">Book an appointment to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-surface-container-lowest relative">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-outline-variant/20 bg-surface flex items-center gap-3">
              <button 
                onClick={() => setSelectedConversation(null)} 
                className="md:hidden p-2 hover:bg-surface-container rounded-lg"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
                {selectedConversation.avatar ? (
                  <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-white">person</span>
                )}
              </div>
              <div>
                <p className="font-bold text-on-surface">{selectedConversation.name}</p>
                <p className="text-xs text-on-surface-variant">Doctor</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isMe = msg.senderId._id === user?._id;
                return (
                  <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-2xl p-3 ${isMe ? "bg-primary text-white" : "bg-surface-container-low text-on-surface"}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${isMe ? "text-white/70" : "text-on-surface-variant"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-outline-variant/20 bg-surface">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-surface-container-low rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-6 text-outline-variant">
              <span className="material-symbols-outlined text-[48px]">chat_bubble</span>
            </div>
            <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-2">Your Inbox</h2>
            <p className="text-on-surface-variant font-body max-w-sm">Select a conversation to start messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientMessages;