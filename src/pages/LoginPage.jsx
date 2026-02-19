import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // HCI Feedback: පරිශීලකයාට පද්ධතිය ක්‍රියාත්මක වන බවට සහතිකයක් ලබා දීම
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans bg-[#020617]">
      
      {/* Background with subtle branding */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
          alt="Modern Interior" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/20 via-slate-950 to-black" />
      </div>

      {/* Main Grid Container: Image and Form together in a small box */}
      <div className="relative z-10 w-full max-w-[850px] mx-4 grid grid-cols-1 md:grid-cols-2 bg-slate-900/40 backdrop-blur-3xl rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Left Side: Visual Content (Image) */}
        <div className="relative hidden md:block h-full min-h-[450px]">
          <img 
           src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
            alt="Interior Showcase" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Green Overlay on Image */}
          <div className="absolute inset-0 bg-emerald-950/40" />
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-2xl font-bold text-white leading-tight">
              Design Excellence <br /> <span className="text-emerald-400 text-lg font-medium">Starts Here.</span>
            </h2>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <header className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-xl mb-4 border border-emerald-500/20">
               <span className="text-2xl">📐</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Designer Login</h1>
            <p className="text-emerald-400/50 text-[10px] font-bold uppercase tracking-[3px] mt-1">Interior Studio Pro</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-1 group-focus-within:text-emerald-400 transition-colors">
                Personnel ID
              </label>
              <input 
                type="text" 
                required
                className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-white text-sm"
                placeholder="ID-00234"
              />
            </div>

            <div className="space-y-1.5 group">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest ml-1 group-focus-within:text-emerald-400 transition-colors">
                Security Key
              </label>
              <input 
                type="password" 
                required
                className="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all text-white text-sm"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-900/40 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              <span className="flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Validating...
                  </>
                ) : "Launch System"}
              </span>
            </button>
          </form>

          
        </div>
      </div>

      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/5 blur-[120px] pointer-events-none" />
    </div>
  );
};

export default LoginPage;