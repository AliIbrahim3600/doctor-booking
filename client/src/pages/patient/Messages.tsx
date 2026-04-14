import useDataContext from "../../hooks/useDataContext";

const PatientMessages = () => {
  const { searchQuery, setSearchQuery } = useDataContext();

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] overflow-hidden">
      
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-outline-variant/20 bg-surface flex flex-col hidden md:flex">
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
        
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/10 text-center p-8 flex flex-col items-center justify-center text-outline-variant">
           <span className="material-symbols-outlined text-4xl mb-4">chat_bubble_outline</span>
           <p className="text-sm">No messages available.</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-surface-container-lowest relative">
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
             <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center mb-6 text-outline-variant">
                <span className="material-symbols-outlined text-[48px]">chat_bubble</span>
             </div>
             <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-2">Your Inbox</h2>
             <p className="text-on-surface-variant font-body max-w-sm">No medical conversations founded. Wait until a doctor reaches out, or schedule a visit.</p>
          </div>
      </div>
    </div>
  );
};

export default PatientMessages;
