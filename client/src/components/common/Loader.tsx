const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 z-[9999] gap-7">
      {/* Icon wrapper */}
      <div className="relative flex items-center justify-center w-[90px] h-[90px]">
        {/* Pulse ring */}
        <div className="absolute w-[120px] h-[120px] rounded-full bg-sky-400/8 animate-pulse-ring" />

        {/* Orbiting dots */}
        <div className="absolute w-[90px] h-[90px] animate-orbit">
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-sky-500 opacity-100" />
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-sky-500 opacity-40" />
          <span className="absolute top-1/2 left-0 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-sky-500 opacity-70" />
        </div>

        {/* Medical cross */}
        <div className="relative w-10 h-10 animate-cross-fade before:content-[''] before:absolute before:bg-sky-500 before:rounded before:w-2.5 before:h-10 before:top-0 before:left-[15px] after:content-[''] after:absolute after:bg-sky-500 after:rounded after:w-10 after:h-2.5 after:top-[15px] after:left-0" />
      </div>

      {/* Loading text */}
      <p className="font-['Inter',system-ui,sans-serif] text-lg font-medium text-blue-700 tracking-wide animate-text-pulse">
        Loading
        <span className="inline-flex gap-1 ml-1">
          <span className="w-[5px] h-[5px] rounded-full bg-blue-700 inline-block animate-dot-bounce" />
          <span className="w-[5px] h-[5px] rounded-full bg-blue-700 inline-block animate-dot-bounce [animation-delay:0.2s]" />
          <span className="w-[5px] h-[5px] rounded-full bg-blue-700 inline-block animate-dot-bounce [animation-delay:0.4s]" />
        </span>
      </p>
    </div>
  );
};

export default Loader;
