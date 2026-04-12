const STATS = [
  { label: "Heart Rate", value: "72", unit: "bpm", icon: "favorite", color: "text-red-500", bg: "bg-red-50" },
  { label: "Blood Pressure", value: "120/80", unit: "mmHg", icon: "water_drop", color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Sleep", value: "7h 45m", unit: "avg", icon: "bedtime", color: "text-indigo-500", bg: "bg-indigo-50" },
  { label: "Steps Today", value: "8,432", unit: "steps", icon: "directions_walk", color: "text-green-500", bg: "bg-green-50" },
];

const PatientAnalytics = () => {
  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface">Health Analytics</h1>
        <p className="text-on-surface-variant font-body mt-1">Track your health metrics and progress over time.</p>
      </div>

      {/* Real-time Stats Quick Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest p-5 md:p-6 rounded-2xl border border-outline-variant/20 shadow-sm">
             <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-4`}>
                <span className="material-symbols-outlined text-[24px]" style={{fontVariationSettings: "'FILL' 1"}}>{stat.icon}</span>
             </div>
             <p className="text-[10px] font-bold text-outline-variant uppercase tracking-widest mb-1">{stat.label}</p>
             <div className="flex items-baseline gap-1">
                <span className="text-xl md:text-2xl font-headline font-extrabold text-on-surface">{stat.value}</span>
                <span className="text-xs font-bold text-on-surface-variant uppercase">{stat.unit}</span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 shadow-sm relative overflow-hidden min-h-[400px]">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="font-headline font-bold text-on-surface">Weekly Progress</h3>
                 <p className="text-xs text-on-surface-variant font-medium">Activity level & sleep quality</p>
              </div>
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 bg-surface text-xs font-bold rounded-lg border border-outline-variant/30 text-on-surface-variant">Weekly</button>
                 <button className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">Monthly</button>
              </div>
           </div>

           {/* Simple Chart Visualization (Mock) */}
           <div className="absolute inset-x-8 bottom-8 top-28 flex items-end justify-between gap-1 md:gap-4 px-4 overflow-hidden">
              {[65, 45, 80, 55, 95, 70, 85, 50, 60, 75, 90, 40, 65, 85].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                   <div 
                     className={`w-full max-w-[12px] rounded-t-full transition-all duration-500 ${i % 3 === 0 ? 'bg-primary' : 'bg-primary-fixed/30'} group-hover:bg-primary-container`} 
                     style={{ height: `${h}%` }}
                   ></div>
                   <span className="text-[8px] font-bold text-outline-variant mt-2 hidden md:block">{i+1} Oct</span>
                </div>
              ))}
           </div>
        </div>

        {/* Sidebar Widgets - Health Status */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-gradient-to-br from-secondary-container to-secondary-fixed p-6 rounded-3xl text-on-secondary-container border border-white/20 shadow-lg shadow-secondary-container/10">
              <h3 className="font-headline font-extrabold text-lg mb-2">BMI Index</h3>
              <p className="text-sm font-medium opacity-80 mb-6">Your weight is in the healthy range.</p>
              
              <div className="flex items-center justify-between mb-4">
                 <span className="text-3xl font-headline font-extrabold">22.4</span>
                 <span className="px-3 py-1 bg-white/30 rounded-full text-[10px] font-extrabold border border-white/40 uppercase tracking-widest">Normal</span>
              </div>

              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                 <div className="h-full bg-white rounded-full" style={{ width: '45%' }}></div>
              </div>
           </div>

           <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-sm">
              <h3 className="font-headline font-bold text-on-surface text-base mb-4">Health Recommendations</h3>
              <div className="space-y-4">
                 <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                       <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <p className="text-xs font-medium text-on-surface-variant leading-relaxed">Increase your water intake to 2.5L daily.</p>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                       <span className="material-symbols-outlined text-[18px]">verified</span>
                    </div>
                    <p className="text-xs font-medium text-on-surface-variant leading-relaxed">Consider a cardiac screening next month.</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PatientAnalytics;
