const PatientAnalytics = () => {
  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface">Health Analytics</h1>
        <p className="text-on-surface-variant font-body mt-1">Track your health metrics and progress over time.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/20 overflow-hidden shadow-sm">
        <div className="divide-y divide-outline-variant/10">
            <div className="py-20 text-center flex flex-col items-center">
               <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">monitoring</span>
               <p className="text-on-surface-variant font-body mb-2">No health data available.</p>
               <p className="text-xs text-on-surface-variant/80 max-w-sm">Please connect a health device or wait for your provider to log lab metrics.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientAnalytics;
