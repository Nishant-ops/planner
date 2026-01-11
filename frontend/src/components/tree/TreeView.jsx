import { useMastery } from '../../hooks/useMastery';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getTopicsByTier, getStatus, getStatusColor } from '../../utils/dagLogic';
import { useContext } from 'react';
import { CheckpointContext } from '../../contexts/CheckpointContext';
import CheckpointGate from '../checkpoint/CheckpointGate';

export default function TreeView() {
  const { mastery } = useMastery();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { checkpoints } = useContext(CheckpointContext);
  const tiers = getTopicsByTier();

  const handleTopicClick = (topicKey, status) => {
    if (status !== 'LOCKED' && status !== 'CHECKPOINT_BLOCKED') {
      navigate(`/hub/${topicKey}`);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12 glass p-6 rounded-2xl">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">Skill Tree</h1>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Neural Dependency Graph
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-xl transition-all border border-white/5 font-medium flex items-center gap-2"
            >
              <span>🏠</span> Dashboard
            </button>
            <button
              onClick={logout}
              className="px-6 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/20 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-12 flex flex-wrap gap-6 text-sm glass-panel p-4 rounded-xl inline-flex">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
            <span className="text-gray-300 font-medium">Mastered</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
            <span className="text-gray-300 font-medium">In Progress</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-slate-500"></div>
            <span className="text-gray-300 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_#eab308]"></div>
            <span className="text-gray-300 font-medium">Gate Blocked</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-900 border border-red-500/30"></div>
            <span className="text-gray-500 font-medium">Locked</span>
          </div>
        </div>

        {/* Tiers */}
        <div className="space-y-16 relative">
          {/* Central Line Connector */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent -translate-x-1/2 hidden md:block z-0"></div>

          {Object.keys(tiers)
            .sort((a, b) => Number(a) - Number(b))
            .map((tierNum) => (
              <div key={tierNum} className="relative z-10 group">
                
                {/* Tier Label - Floating */}
                <div className="flex justify-center mb-6">
                  <div className="glass px-6 py-2 rounded-full border border-blue-500/30 text-blue-300 font-mono text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(59,130,246,0.2)] bg-[#030712]">
                    TIER {tierNum} • {tierNum === '0' ? 'FOUNDATION' : tierNum === '7' ? 'MASTERY' : `LEVEL ${tierNum}`}
                  </div>
                </div>

                {/* Tier Content */}
                <div className="glass-panel p-8 rounded-3xl border border-white/5 relative bg-[#0a0a15]/40 backdrop-blur-md">
                   {/* Background Glow */}
                   <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tiers[tierNum].map((topic) => {
                      const status = getStatus(topic.key, mastery, checkpoints);
                      const topicMastery = mastery[topic.key] || { confidence: 0, solved: [] };

                      // Dynamic Styles based on Status
                      let cardStyle = "bg-slate-900/40 border-slate-700/50 hover:border-slate-500/50";
                      let glowColor = "group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]";
                      let icon = "⚡";

                      if (status === 'MASTERED') {
                        cardStyle = "bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/60";
                        glowColor = "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]";
                        icon = "✓";
                      } else if (status === 'IN_PROGRESS') {
                        cardStyle = "bg-blue-950/20 border-blue-500/30 hover:border-blue-500/60";
                        glowColor = "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]";
                        icon = "⚡";
                      } else if (status === 'CHECKPOINT_BLOCKED') {
                        cardStyle = "bg-yellow-950/20 border-yellow-500/30 opacity-75 cursor-not-allowed";
                        icon = "🔒";
                      } else if (status === 'LOCKED') {
                        cardStyle = "bg-red-950/10 border-red-900/30 opacity-50 grayscale cursor-not-allowed";
                        icon = "🔒";
                      }

                      return (
                        <button
                          key={topic.key}
                          onClick={() => handleTopicClick(topic.key, status)}
                          disabled={status === 'LOCKED' || status === 'CHECKPOINT_BLOCKED'}
                          className={`
                            relative overflow-hidden p-6 rounded-2xl border-2 text-left transition-all duration-300 group
                            ${cardStyle} ${glowColor}
                            transform hover:-translate-y-1 hover:scale-[1.01]
                          `}
                        >
                          {/* Inner Content */}
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className={`text-lg font-bold ${status === 'LOCKED' ? 'text-gray-500' : 'text-white'}`}>
                                {topic.label}
                              </h3>
                              <div className={`
                                w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                                ${status === 'MASTERED' ? 'bg-emerald-500/20 text-emerald-400' : 
                                  status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' : 
                                  'bg-white/5 text-gray-400'}
                              `}>
                                {icon}
                              </div>
                            </div>
                            
                            <p className="text-gray-400 text-sm mb-6 line-clamp-2 min-h-[40px]">
                              {topic.desc}
                            </p>

                            {/* Progress or Status Footer */}
                            {status === 'CHECKPOINT_BLOCKED' ? (
                              <div className="flex items-center gap-2 text-yellow-500/80 text-xs font-mono py-2 px-3 bg-yellow-950/30 rounded-lg border border-yellow-500/10">
                                <span>🚧</span> Gate Locked
                              </div>
                            ) : status !== 'LOCKED' ? (
                              <div>
                                <div className="flex justify-between text-xs mb-1.5 font-mono">
                                  <span className={status === 'MASTERED' ? 'text-emerald-400' : 'text-blue-400'}>
                                    {status === 'MASTERED' ? 'MAXIMIZED' : 'PROFICIENCY'}
                                  </span>
                                  <span className="text-white">{topicMastery.confidence}%</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-1000 ${
                                      status === 'MASTERED' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-blue-500 shadow-[0_0_10px_#3b82f6]'
                                    }`}
                                    style={{ width: `${topicMastery.confidence}%` }}
                                  ></div>
                                </div>
                              </div>
                            ) : (
                                <div className="text-red-500/50 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                                    <span>🔒</span> Locked
                                </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Checkpoint Gate - After each tier except tier 7 */}
                {Number(tierNum) < 7 && (
                    <div className="relative mt-12 mb-12 flex justify-center">
                        <CheckpointGate tier={Number(tierNum)} />
                    </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
