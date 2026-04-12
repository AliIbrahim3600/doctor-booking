import { useState, useMemo } from "react";
import useDataContext from "../../hooks/useDataContext";

const CHATS_MOCK = [
  {
    id: "1",
    doctorName: "Dr. Sarah Jenkins",
    image: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random",
    lastMessage: "The blood test results look normal. You can continue...",
    time: "10:45 AM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    image: "https://ui-avatars.com/api/?name=Michael+Chen&background=random",
    lastMessage: "Please remember to bring your previous lens prescription.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    doctorName: "Dr. Elena Rodriguez",
    image: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random",
    lastMessage: "I've sent the immunization schedule. Let me know if...",
    time: "2 days ago",
    unread: 0,
    online: true,
  },
  {
    id: "4",
    doctorName: "Dr. James Wilson",
    image: "https://ui-avatars.com/api/?name=James+Wilson&background=random",
    lastMessage: "The EKG looks stable. We will keep monitoring.",
    time: "Oct 01",
    unread: 0,
    online: false,
  },
];

const MESSAGES_MOCK = [
  { id: 1, sender: "doctor", text: "Hello! I've reviewed your latest lab results.", time: "10:30 AM" },
  { id: 2, sender: "patient", text: "Thank you doctor. Is there anything concerning?", time: "10:35 AM" },
  { id: 3, sender: "doctor", text: "The blood test results look normal. You can continue with your current medication. We'll check again in 3 months.", time: "10:45 AM" },
  { id: 4, sender: "patient", text: "That is great news. Should I set a reminder for the update?", time: "10:50 AM" },
  { id: 5, sender: "doctor", text: "Yes, please do. We will send a notification a week before.", time: "11:00 AM" },
];

const PatientMessages = () => {
  const { searchQuery, setSearchQuery } = useDataContext();
  const [selectedChat, setSelectedChat] = useState(CHATS_MOCK.length > 0 ? CHATS_MOCK[0] : null);
  const [message, setMessage] = useState("");

  const filteredChats = useMemo(() => {
    return CHATS_MOCK.filter(chat => 
      chat.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-outline-variant/20 bg-surface flex flex-col ${selectedChat && 'hidden md:flex'}`}>
        <div className="p-6 border-b border-outline-variant/20">
          <h1 className="text-xl font-headline font-extrabold text-on-surface mb-4">Messages</h1>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border-0 rounded-xl py-2.5 pl-10 pr-4 text-sm font-body outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/10">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full p-4 flex gap-4 hover:bg-surface-container-low transition-colors text-left ${selectedChat?.id === chat.id ? 'bg-surface-container-low' : ''}`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant/20">
                  <img src={chat.image} alt={chat.doctorName} />
                </div>
                {chat.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="font-bold text-on-surface text-sm truncate">{chat.doctorName}</h4>
                  <span className="text-[10px] font-medium text-outline-variant">{chat.time}</span>
                </div>
                <p className="text-xs text-on-surface-variant truncate pr-4">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-1">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-surface-container-lowest relative ${!selectedChat && 'hidden md:flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 md:px-8 md:py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button onClick={() => setSelectedChat(null as any)} className="md:hidden p-2 -ml-2 text-on-surface">
                   <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20">
                  <img src={selectedChat.image} alt={selectedChat.doctorName} />
                </div>
                <div>
                  <h3 className="font-bold text-on-surface text-sm md:text-base leading-none mb-1">{selectedChat.doctorName}</h3>
                  <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                     Active Now
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                 <button className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                 </button>
                 <button className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                 </button>
                 <button className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                 </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              <div className="flex justify-center">
                 <span className="px-3 py-1 bg-surface-container rounded-full text-[10px] font-bold text-outline-variant uppercase tracking-widest">Today</span>
              </div>
              {MESSAGES_MOCK.map((m) => (
                <div key={m.id} className={`flex ${m.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] md:max-w-md p-4 rounded-2xl shadow-sm ${
                    m.sender === 'patient' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-surface-container-low text-on-surface rounded-tl-none border border-outline-variant/10'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{m.text}</p>
                    <p className={`text-[10px] mt-2 font-bold ${m.sender === 'patient' ? 'text-white/60' : 'text-outline-variant'}`}>
                      {m.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 md:p-6 border-t border-outline-variant/20 bg-surface">
               <div className="flex items-center gap-3 bg-surface-container-low rounded-2xl p-2 pl-4 border border-outline-variant/20">
                  <button className="p-1.5 text-outline-variant hover:text-primary transition-colors cursor-pointer">
                     <span className="material-symbols-outlined text-[24px]">add_circle</span>
                  </button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-0 py-2.5 text-sm font-body outline-none"
                  />
                  <button className="p-2 bg-primary text-white rounded-xl shadow-md hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center">
                     <span className="material-symbols-outlined text-[20px]">send</span>
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
             <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-6 text-outline-variant">
                <span className="material-symbols-outlined text-[48px]">chat_bubble</span>
             </div>
             <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-2">Your Inbox</h2>
             <p className="text-on-surface-variant font-body max-w-sm">Select a doctor from the list on the left to start or continue a conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientMessages;
