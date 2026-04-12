export default function Footer() {
  return (
    <footer className="w-full rounded-t-[1.5rem] mt-20">
      <div className="w-full py-16 px-8 flex flex-col items-center gap-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-4">
          <div className="font-headline font-black text-blue-900 dark:text-blue-500 text-2xl">The Clinical Atelier</div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <a className="text-slate-500 hover:text-blue-700 dark:hover:text-blue-300 transition-opacity duration-300 font-body text-sm leading-relaxed" href="#">Privacy Policy</a>
            <a className="text-slate-500 hover:text-blue-700 dark:hover:text-blue-300 transition-opacity duration-300 font-body text-sm leading-relaxed" href="#">Terms of Service</a>
            <a className="text-slate-500 hover:text-blue-700 dark:hover:text-blue-300 transition-opacity duration-300 font-body text-sm leading-relaxed" href="#">HIPAA Compliance</a>
            <a className="text-slate-500 hover:text-blue-700 dark:hover:text-blue-300 transition-opacity duration-300 font-body text-sm leading-relaxed" href="#">Contact Support</a>
          </div>
        </div>
        <div className="h-px w-full bg-slate-200/40 dark:bg-slate-800/40"></div>
        <div className="text-slate-500 font-body text-sm leading-relaxed">© 2024 The Clinical Atelier. All rights reserved.</div>
      </div>
    </footer>
  );
}
