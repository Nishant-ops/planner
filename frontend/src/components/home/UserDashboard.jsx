import { useMastery } from '../../hooks/useMastery';
import { useNavigate } from 'react-router-dom';
import { DAG_STRUCTURE } from '../../data/dagStructure';

export default function UserDashboard() {
  const { mastery, loading } = useMastery();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-display tracking-widest text-sm uppercase opacity-70">Loading Interface...</p>
        </div>
      </div>
    );
  }

  const totalTopics = Object.keys(DAG_STRUCTURE).length;
  const masteredCount = Object.values(mastery).filter((m) => m.confidence >= 100).length;
  const inProgressCount = Object.values(mastery).filter(
    (m) => m.confidence > 0 && m.confidence < 100
  ).length;

  const masteredTopics = Object.entries(mastery)
    .filter(([_, data]) => data.confidence >= 100)
    .map(([key]) => DAG_STRUCTURE[key]?.label);

  const lastTopic = Object.entries(mastery)
    .filter(([_, data]) => data.confidence > 0 && data.confidence < 100)
    .sort((a, b) => b[1].confidence - a[1].confidence)[0];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
              Command Center
            </h1>
            <p className="text-gray-400 font-light">Welcome back, Operator.</p>
          </div>
          <div className="hidden md:block">
            <div className="px-4 py-2 glass rounded-full text-xs font-mono text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              SYSTEM ONLINE
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Mastered Card */}
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl">🏆</span>
            </div>
            <div className="relative z-10">
              <div className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2">Topics Mastered</div>
              <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600">
                {masteredCount}<span className="text-2xl text-gray-600 font-light">/{totalTopics}</span>
              </div>
            </div>
          </div>

          {/* In Progress Card */}
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl">⚡</span>
            </div>
            <div className="relative z-10">
              <div className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2">Active Protocols</div>
               <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-600">
                {inProgressCount}
              </div>
            </div>
          </div>

          {/* Completion Card */}
          <div className="glass-card p-8 rounded-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl">📊</span>
            </div>
            <div className="relative z-10">
              <div className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-2">System Sync</div>
               <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-amber-600">
                {Math.round((masteredCount / totalTopics) * 100)}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            {lastTopic ? (
               <div className="glass p-8 rounded-2xl border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-500/10 to-transparent relative group">
                 <div className="absolute top-4 right-4 animate-pulse">
                   <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#3b82f6]"></div>
                 </div>
                 <h3 className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-3">Resuming Session</h3>
                 <h2 className="text-3xl font-display font-bold text-white mb-2">{DAG_STRUCTURE[lastTopic[0]]?.label}</h2>
                 <p className="text-gray-400 mb-6 font-light">Current proficiency level at <span className="text-white font-mono">{lastTopic[1].confidence}%</span>. Continue your training to unlock new nodes.</p>
                 
                 <div className="w-full bg-slate-800/50 rounded-full h-2 mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full" style={{ width: `${lastTopic[1].confidence}%` }}></div>
                 </div>

                 <button
                   onClick={() => navigate(`/hub/${lastTopic[0]}`)}
                   className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all font-semibold flex items-center gap-2 group-hover:translate-x-1"
                 >
                   Initialize Environment <span className="text-xl">→</span>
                 </button>
               </div>
            ) : (
              <div className="glass p-8 rounded-2xl border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-500/10 to-transparent">
                  <h2 className="text-2xl font-bold text-white mb-2">Ready to Start</h2>
                  <p className="text-gray-400 mb-6">Select a node from the Skill Tree to begin your journey.</p>
                  <button
                    onClick={() => navigate('/tree')}
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-semibold"
                  >
                    Open Skill Tree
                  </button>
              </div>
            )}
            
            {/* Mastered Topics List */}
            {masteredTopics.length > 0 && (
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">Acquired Competencies</h3>
                <div className="flex flex-wrap gap-3">
                  {masteredTopics.map((topic) => (
                    <span
                      key={topic}
                      className="px-4 py-2 bg-emerald-900/30 text-emerald-400 rounded-lg text-sm border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] flex items-center gap-2"
                    >
                      <span>✓</span> {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Side Panel / Quick Links */}
          <div className="space-y-6">
             <div className="glass-card p-6 rounded-2xl text-center">
                <div className="w-16 h-16 mx-auto bg-slate-800 rounded-2xl flex items-center justify-center text-3xl mb-4 text-purple-400 shadow-inner">
                  🌳
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Neural Network</h3>
                <p className="text-gray-400 text-sm mb-6">Visualize the full dependency graph and unlock new paths.</p>
                <button
                  onClick={() => navigate('/tree')}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white rounded-xl transition-all font-medium border border-white/5"
                >
                  Access Skill Tree
                </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
