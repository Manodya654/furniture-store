import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    
    setTimeout(() => {
      setLoading(false);
      const id = e.target[0].value;
      if (id.length < 3) {
        setError('Invalid Identifier. Please check your credentials.');
      } else {
        
        onLogin();
      }
    }, 1200);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans bg-[#020617]">
      
      {/* Dynamic Background - රූපය පැහැදිලිව පෙනෙන ලෙස සකසා ඇත */}
<div className="absolute inset-0 z-0">
  <img 
    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
    alt="Modern Interior" 
    className="w-full h-full object-cover opacity-60 transition-transform duration-[5000ms] hover:scale-105"
  />
  {/* Overlay: රූපය මත ඇති අඳුරු ගතිය අඩු කර අකුරු වල contrast එක රැකගෙන ඇත */}
  <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-[#020617]/40 to-transparent" />
  <div className="absolute inset-0 bg-black/20" /> 
</div>

      {/* Main Container - HCI: Efficiency via Split Layout */}
      <div className="relative z-10 w-full max-w-[900px] mx-4 grid grid-cols-1 md:grid-cols-2 bg-slate-900/40 backdrop-blur-3xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
        
        {/* Left Side: Brand & Context Visualization */}
        <div className="relative hidden md:flex flex-col justify-end p-10 min-h-[500px] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"  
            alt="Interior Showcase" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/20 to-transparent opacity-80" />
          
          <div className="relative z-10">
            <div className="inline-block px-3 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30 mb-4">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[3px]">HCI Prototype v2.0</span>
            </div>
            <h2 className="text-3xl font-black text-white leading-tight">
              Visualize <br /> <span className="text-emerald-400">Geometry.</span>
            </h2>
            <p className="text-slate-300 text-sm mt-4 leading-relaxed opacity-80">
              Interactive 3D environment for professional furniture placement and lighting configuration.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Login Form */}
        <div className="p-10 md:p-14 flex flex-col justify-center bg-slate-950/30">
          <header className="mb-10 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-500/10 rounded-2xl mb-6 border border-emerald-500/20 shadow-inner">
               <span className="text-3xl">🏗️</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Access Portal</h1>
            <p className="text-slate-500 text-sm mt-2">Enter credentials to launch workspace</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message Display - HCI: Visibility of System Status */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3 animate-shake">
                <span className="text-red-400 text-xs font-medium">{error}</span>
              </div>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[2px] ml-1 group-focus-within:text-emerald-400 transition-colors">
                Personnel Identifier
              </label>
              <input 
                type="text" 
                required
                className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all text-white text-sm placeholder:text-slate-700"
                placeholder="ID-00234"
              />
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-[2px] ml-1 group-focus-within:text-emerald-400 transition-colors">
                Security Key
              </label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-900/50 border border-slate-800 p-4 rounded-2xl focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 outline-none transition-all text-white text-sm placeholder:text-slate-700"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 overflow-hidden relative"
            >
              <span className="flex items-center justify-center gap-3 text-sm uppercase tracking-widest relative z-10">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : "Launch System"}
              </span>
              {/* Button Hover Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </form>

         
        </div>
      </div>

      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] pointer-events-none" />
    </div>
  );
};

export default LoginPage;