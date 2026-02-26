export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 py-24 px-6 flex flex-col items-center justify-center text-center">
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_60%)] z-0" />

      <div className="relative z-10 w-full max-w-[800px]">
        <div className="mx-auto w-full max-w-[600px] h-80 bg-white rounded-2xl shadow-lg border border-slate-200 flex items-center justify-center">
          <svg className="w-16 h-16 fill-slate-400" viewBox="0 0 24 24">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
        </div>
      </div>
    </section>
  );
};
