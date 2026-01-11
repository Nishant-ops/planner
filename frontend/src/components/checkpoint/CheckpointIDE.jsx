import { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCheckpointByTier } from '../../data/checkpointsDB';
import { attemptCheckpoint } from '../../services/checkpointService';
import { CheckpointContext } from '../../contexts/CheckpointContext';
import { useAuth } from '../../hooks/useAuth';

export default function CheckpointIDE() {
  const { tier } = useParams();
  const navigate = useNavigate();
  const { refreshCheckpoints, getCheckpointByTier: getCheckpointStatus } = useContext(CheckpointContext);
  const { logout } = useAuth();

  const tierNum = parseInt(tier);
  const checkpoint = getCheckpointByTier(tierNum);
  const checkpointStatus = getCheckpointStatus(tierNum);

  const [code, setCode] = useState('// Write your solution here...\n// Remember to use ALL required patterns!\n\n');
  const [judgeResult, setJudgeResult] = useState(null);
  const [isJudging, setIsJudging] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!checkpoint) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-white text-xl font-display">Checkpoint not found</div>
      </div>
    );
  }

  const handleJudge = async () => {
    try {
      setIsJudging(true);
      setJudgeResult(null);
      const result = await attemptCheckpoint(tierNum, code);
      setJudgeResult(result);

      // If verdict is ADVANCE (checkpoint passed), refresh checkpoint data
      if (result.verdict === 'ADVANCE') {
        setTimeout(() => {
          refreshCheckpoints();
        }, 1000);
      }
    } catch (error) {
      console.error('Judge failed:', error);
      setJudgeResult({
        verdict: 'ERROR',
        feedback: 'Failed to judge checkpoint. Please try again.',
        patterns_found: [],
        missing_patterns: checkpoint.requiredPatterns
      });
    } finally {
      setIsJudging(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-200 font-sans selection:bg-yellow-500/30">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-yellow-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* Compact Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-[1920px] mx-auto py-3 px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="group p-2 hover:bg-white/5 rounded-lg transition-all active:scale-95"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-4 flex flex-col justify-between relative">
                <span className={`block h-0.5 w-6 bg-white/80 rounded-full transition-all duration-300 group-hover:bg-white ${sidebarOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                <span className={`block h-0.5 w-4 bg-white/80 rounded-full transition-all duration-300 group-hover:bg-white group-hover:w-6 ${sidebarOpen ? 'opacity-0 translate-x-3' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-white/80 rounded-full transition-all duration-300 group-hover:bg-white ${sidebarOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
              </div>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏆</span>
                <h1 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                  Tier {tier} Checkpoint
                </h1>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border bg-red-500/10 border-red-500/20 text-red-400">
                  {checkpoint.difficulty}
                </span>
                <span className="text-yellow-400/80 text-xs font-mono font-medium tracking-tight hidden sm:inline-block">
                  {checkpoint.title}
                </span>
              </div>
            </div>
          </div>

          {/* Checkpoint Status Indicator */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Status</div>
               <div className={`text-sm font-bold ${checkpointStatus?.is_passed ? 'text-emerald-400' : 'text-yellow-500'}`}>
                 {checkpointStatus?.is_passed ? 'PASSED' : `${checkpointStatus?.attempts || 0} Attempts`}
               </div>
            </div>
            <div className={`relative w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] border border-white/10 ${
              checkpointStatus?.is_passed 
                ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                : 'bg-yellow-500/20 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
            }`}>
              <span className="text-2xl">
                {checkpointStatus?.is_passed ? '✓' : '⚡'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-80 glass-panel z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${sidebarOpen ? 'translate-x-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]' : '-translate-x-full'}`}>
        <div className="p-8 h-full flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">Menu</h2>
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
              <span className="block text-2xl leading-none">&times;</span>
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            <button onClick={() => { navigate('/'); setSidebarOpen(false); }} className="w-full group flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5">
              <span className="text-xl group-hover:scale-110 transition-transform duration-300">🏠</span>
              <span className="font-medium">Dashboard</span>
            </button>
            <button onClick={() => { navigate('/tree'); setSidebarOpen(false); }} className="w-full group flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5">
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">🌳</span>
                <span className="font-medium">Skill Tree</span>
            </button>

            <div className="my-6 border-t border-white/5"></div>

            <div className="px-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Checkpoint Info</h3>
              <p className="text-yellow-400 font-semibold mb-1">Tier {tier} Gate</p>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed font-light">{checkpoint.invariant}</p>

              <div className="glass p-4 rounded-2xl border-l-2 border-l-yellow-500 bg-gradient-to-br from-yellow-500/5 to-transparent">
                <div className="flex justify-between items-center">
                   <span className="text-xs text-gray-400 uppercase tracking-wider">Status</span>
                   <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                     checkpointStatus?.is_passed 
                       ? 'bg-emerald-500/20 text-emerald-400' 
                       : 'bg-yellow-500/20 text-yellow-500'
                   }`}>
                     {checkpointStatus?.is_passed ? 'Passed' : 'Active'}
                   </span>
                </div>
                <div className="mt-2 text-xs text-gray-500 font-mono">
                  Total Attempts: {checkpointStatus?.attempts || 0}
                </div>
              </div>
            </div>
          </nav>

          <button onClick={() => { logout(); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-white hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 mt-auto">
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-500" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Main Content Split */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 h-[calc(100vh-73px)]">
        
        {/* Left - Problem Description */}
        <div className="flex flex-col border-r border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
            
            {/* Challenge Banner */}
            <div className="glass p-6 rounded-2xl border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-500/5 to-transparent">
               <h3 className="text-xl font-display font-bold text-yellow-400 mb-2">{checkpoint.title}</h3>
               <p className="text-gray-300 leading-relaxed font-light text-lg">{checkpoint.description}</p>
            </div>

            {/* Invariant Strategy */}
            <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/10">
              <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                <span>🎯</span> Invariant Strategy
              </h3>
              <p className="text-blue-200/90 font-mono text-sm leading-relaxed">{checkpoint.invariant}</p>
            </div>

            {/* Required Patterns - Critical! */}
            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20">
              <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                <span>⚠️</span> Required Patterns
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {checkpoint.requiredPatterns.map((pattern, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-red-500/5 p-3 rounded-lg border border-red-500/10">
                    <span className="text-red-400">▸</span>
                    <span className="font-semibold text-gray-200">{pattern}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Examples */}
            {checkpoint.examples.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                  Examples
                </h3>
                  {checkpoint.examples.map((ex, idx) => (
                    <div key={idx} className="group glass-card rounded-xl p-5 hover:bg-white/5 transition-colors border border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Input</span>
                          <div className="font-mono text-sm bg-black/40 p-3 rounded-lg text-emerald-400 border border-white/5">
                            {ex.input}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-mono text-gray-500 uppercase tracking-widest block mb-2">Output</span>
                          <div className="font-mono text-sm bg-black/40 p-3 rounded-lg text-blue-400 border border-white/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                            {ex.output}
                          </div>
                        </div>
                      </div>
                      {ex.explain && (
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <p className="text-sm text-gray-400 italic">"{ex.explain}"</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {/* Constraints */}
            {checkpoint.constraints.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-6">
                <h3 className="text-amber-400 font-semibold mb-4 flex items-center gap-2">
                  <span className="text-lg">⚠️</span> Constraints
                </h3>
                <ul className="space-y-3">
                  {checkpoint.constraints.map((constraint, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-amber-200/80">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_5px_#fbbf24]"></span>
                      <span className="font-mono">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hint */}
            {checkpoint.hint && (
              <div className="bg-purple-500/5 p-6 rounded-2xl border border-purple-500/20">
                <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <span>💭</span> Hint
                </h3>
                <p className="text-purple-200/80 text-sm leading-relaxed">{checkpoint.hint}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right - Code Editor & Results */}
        <div className="flex flex-col bg-[#050510] relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none"></div>

          {/* Code Editor Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0a0a15]">
            <div className="flex items-center gap-2">
               <span className="text-sm font-mono text-gray-500">checkpoint.py</span>
            </div>
            <button
                onClick={handleJudge}
                disabled={isJudging}
                className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
              >
                {isJudging ? (
                  <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      Validating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                      <span>⚡</span> Submit Checkpoint
                  </div>
                )}
              </button>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 relative group">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-6 bg-transparent text-gray-300 font-mono text-[14px] leading-relaxed resize-none focus:outline-none focus:bg-white/[0.02] transition-colors custom-scrollbar"
              style={{ height: 'calc(100vh - 400px)' }}
              spellCheck={false}
              placeholder="// Write your checkpoint solution here...
// Remember: ALL required patterns must be present!
// This is a comprehensive test - demonstrate mastery!
"
            />
          </div>

          {/* Results */}
          {judgeResult && (
             <div className="h-[40%] bg-[#0a0a15] border-t border-white/10 flex flex-col animate-slideIn shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
                <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Judge Verdict</h3>
                    <button onClick={() => setJudgeResult(null)} className="text-gray-500 hover:text-white transition-colors">&times;</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className={`p-6 rounded-xl border ${
                        judgeResult.verdict === 'ADVANCE'
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : 'bg-red-500/5 border-red-500/20'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full ${
                            judgeResult.verdict === 'ADVANCE' 
                            ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                            : 'bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                          }`}>
                            <span className="text-2xl block leading-none">
                              {judgeResult.verdict === 'ADVANCE' ? '✓' : '✕'}
                            </span>
                          </div>
                          <div>
                            <span className={`text-xl font-bold mb-1 block ${
                                judgeResult.verdict === 'ADVANCE' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {judgeResult.verdict === 'ADVANCE' ? (
                                <span>CHECKPOINT PASSED!</span>
                              ) : (
                                <span>REPEAT - Missing Patterns</span>
                              )}
                            </span>
                            <p className="text-gray-300 leading-relaxed text-sm opacity-90 mb-1">{
                              judgeResult.verdict === 'ADVANCE'
                                ? 'Tier unlocked! You can now proceed to the next tier.'
                                : 'Review the feedback and implement missing patterns'
                            }</p>
                            <p className="text-gray-400 text-xs italic opacity-70 mt-2 border-t border-white/10 pt-2">{judgeResult.feedback}</p>
                          </div>
                        </div>

                        {/* Pattern Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          {judgeResult.patterns_found && judgeResult.patterns_found.length > 0 && (
                            <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
                              <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-3">✓ Patterns Found</h4>
                              <ul className="space-y-2">
                                {judgeResult.patterns_found.map((pattern, idx) => (
                                  <li key={idx} className="text-emerald-300/80 text-sm flex items-center gap-2">
                                    <span className="text-[10px]">●</span>
                                    <span>{pattern}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {judgeResult.missing_patterns && judgeResult.missing_patterns.length > 0 && (
                            <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                              <h4 className="text-red-400 font-bold text-xs uppercase tracking-wider mb-3">✕ Missing Patterns</h4>
                              <ul className="space-y-2">
                                {judgeResult.missing_patterns.map((pattern, idx) => (
                                  <li key={idx} className="text-red-300/80 text-sm flex items-center gap-2">
                                    <span className="text-[10px]">●</span>
                                    <span>{pattern}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
