import GoogleLoginButton from '../auth/GoogleLoginButton';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[128px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-5xl mx-auto text-center relative z-10 font-sans">
         <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 font-mono text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            System Online v2.0
         </div>

        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-8 tracking-tight">
          Master DSA Through <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-glow">
            Neural Dependencies
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
          Unlock the full potential of your problem-solving skills with a gamified, dependency-enforced learning graph.
        </p>
        
        <div className="flex items-center justify-center gap-8 mb-12 text-gray-400 font-mono text-sm">
           <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 22 Topics</span>
           <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span> 66 Problems</span>
           <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> AI Guided</span>
        </div>

        {user ? (
          <button
            onClick={() => navigate('/tree')}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(37,99,235,0.6)] text-lg transform hover:-translate-y-1"
          >
            Access Mainframe →
          </button>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="transform hover:scale-105 transition-transform duration-300">
               <GoogleLoginButton />
            </div>
            <p className="text-xs text-gray-500 font-mono tracking-wide uppercase opacity-70">Secure Authorization • Free Tier Access</p>
          </div>
        )}

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
          <div className="glass-card p-8 rounded-2xl group hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🌳
            </div>
            <h3 className="text-white font-bold mb-2 text-lg">DAG Architecture</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              8-tier dependency graph ensures maximum efficiency by enforcing prerequisite mastery.
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-2xl group hover:bg-white/5 transition-colors">
             <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                🧠
            </div>
            <h3 className="text-white font-bold mb-2 text-lg">AI Architect</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Socratic guidance from topic-specific AI mentors that explain the 'why', not just the 'how'.
            </p>
          </div>
          
          <div className="glass-card p-8 rounded-2xl group hover:bg-white/5 transition-colors">
             <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                ⚡
            </div>
            <h3 className="text-white font-bold mb-2 text-lg">Pattern Mastery</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Internalize the invariants and core patterns that govern algorithmic problem solving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
