import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DAG_STRUCTURE } from '../../data/dagStructure';
import { PROBLEMS_DB } from '../../data/problemsDB';
import { useMastery } from '../../hooks/useMastery';
import { useAuth } from '../../hooks/useAuth';
import { judgeCode, analyzeComplexity } from '../../services/aiService';
import { calculateConfidence } from '../../utils/dagLogic';

export default function IDEView() {
  const { topicKey, problemId } = useParams();
  const navigate = useNavigate();
  const { mastery, refreshMastery } = useMastery();
  const { logout } = useAuth();

  const topic = DAG_STRUCTURE[topicKey];
  const problems = PROBLEMS_DB[topicKey] || [];
  const problem = problems.find((p) => p.id === problemId);
  const topicMastery = mastery[topicKey] || { confidence: 0, solved: [] };

  const [code, setCode] = useState('// Write your solution here...\n\n');
  const [judgeResult, setJudgeResult] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [isJudging, setIsJudging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Problem not found</div>
      </div>
    );
  }

  const handleJudge = async () => {
    try {
      setIsJudging(true);
      setJudgeResult(null);
      const result = await judgeCode(topicKey, problemId, code);
      setJudgeResult(result);

      // If verdict is ADVANCE, refresh mastery
      if (result.verdict === 'ADVANCE' || result.verdict === 'Optimal') {
        setTimeout(() => {
          refreshMastery();
        }, 1000);
      }
    } catch (error) {
      console.error('Judge failed:', error);
      setJudgeResult({ verdict: 'ERROR', feedback: 'Failed to judge code. Please try again.' });
    } finally {
      setIsJudging(false);
    }
  };

  const handleComplexityAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      setComplexity(null);
      const result = await analyzeComplexity(code);
      setComplexity(result.analysis);
    } catch (error) {
      console.error('Analysis failed:', error);
      setComplexity('Failed to analyze complexity. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-200 font-sans selection:bg-purple-500/30">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '7s' }} />
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
              <h1 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                {problem.title}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${
                  problem.diff === 'Easy' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  {problem.diff}
                </span>
                <span className="text-blue-400 text-xs font-mono font-medium tracking-tight px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 hidden sm:inline-block">
                  {problem.invariant}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-widest">Topic Mastery</div>
              <div className="text-sm font-bold text-white">{topicMastery.solved.length}/3 Solved</div>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="transform -rotate-90 w-full h-full drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-800" />
                <circle
                  cx="24" 
                  cy="24" 
                  r="20" 
                  stroke="url(#progressGradient)" 
                  strokeWidth="3" 
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - topicMastery.confidence / 100)}`}
                  className="transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute text-[10px] font-bold text-white font-mono">{topicMastery.confidence}%</span>
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
            <button onClick={() => { navigate(`/hub/${topicKey}`); setSidebarOpen(false); }} className="w-full group flex items-center gap-4 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/5">
              <span className="text-xl group-hover:scale-110 transition-transform duration-300">📚</span>
              <span className="font-medium">Back to {topic.label}</span>
            </button>

            <div className="my-6 border-t border-white/5"></div>

            <div className="px-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Current Session</h3>
              <div className="glass p-4 rounded-2xl border-l-2 border-l-blue-500 bg-gradient-to-br from-blue-500/5 to-transparent">
                <p className="text-white font-semibold mb-1 truncate">{problem.title}</p>
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Progress</span>
                    <span className="text-xs font-bold text-blue-400 font-mono">{topicMastery.confidence}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${topicMastery.confidence}%` }}></div>
                  </div>
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
        
        {/* Left: Problem & Context */}
        <div className="flex flex-col border-r border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
            
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
            {/* Description Card */}
            <div className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3">
                <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 text-lg">💡</span>
                Problem Description
              </h2>
              <div className="text-gray-300 leading-relaxed text-lg font-light glass p-6 rounded-2xl border-none">
                {problem.description}
              </div>
            </div>

            {/* Examples */}
            {problem.examples.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span>
                  Examples
                </h3>
                {problem.examples.map((ex, idx) => (
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
            {problem.constraints.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-6">
                <h3 className="text-amber-400 font-semibold mb-4 flex items-center gap-2">
                  <span className="text-lg">⚠️</span> Constraints
                </h3>
                <ul className="space-y-3">
                  {problem.constraints.map((constraint, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-amber-200/80">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shadow-[0_0_5px_#fbbf24]"></span>
                      <span className="font-mono">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right: Editor & Tools */}
        <div className="flex flex-col bg-[#050510] relative">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none"></div>
            
            {/* Editor Toolbar */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0a0a15]">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-gray-500">main.py</span>
                </div>
                <div className="flex gap-3">
                    <button
                      onClick={handleComplexityAnalysis}
                      disabled={isAnalyzing}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {isAnalyzing ? <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"/> : '📊'}
                            Analyze
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                    
                    <button
                      onClick={handleJudge}
                      disabled={isJudging}
                      className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                    >
                       {isJudging ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                            Running Tests...
                        </div>
                       ) : (
                        <div className="flex items-center gap-2">
                            <span>⚡</span> Run & Judge
                        </div>
                       )}
                    </button>
                </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 relative group">
                <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full p-6 bg-transparent text-gray-300 font-mono text-[14px] leading-relaxed resize-none focus:outline-none focus:bg-white/[0.02] transition-colors custom-scrollbar"
                spellCheck={false}
                />
            </div>

            {/* Context/Results Panel - Floating or Fixed bottom */}
            {(judgeResult || complexity) && (
                <div className="h-[35%] bg-[#0a0a15] border-t border-white/10 flex flex-col animate-slideIn shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-20">
                    <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Execution Results</h3>
                        <button onClick={() => {setJudgeResult(null); setComplexity(null);}} className="text-gray-500 hover:text-white transition-colors">&times;</button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                        {judgeResult && (
                            <div className={`p-6 rounded-xl border ${
                                judgeResult.verdict === 'ADVANCE' || judgeResult.verdict === 'Optimal'
                                ? 'bg-emerald-500/5 border-emerald-500/20' 
                                : 'bg-red-500/5 border-red-500/20'
                            }`}>
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-full ${
                                        judgeResult.verdict === 'ADVANCE' || judgeResult.verdict === 'Optimal'
                                        ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                        : 'bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                    }`}>
                                        <span className="text-2xl block leading-none">
                                            {judgeResult.verdict === 'ADVANCE' || judgeResult.verdict === 'Optimal' ? '✓' : '✕'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className={`text-xl font-bold mb-1 ${
                                            judgeResult.verdict === 'ADVANCE' || judgeResult.verdict === 'Optimal' ? 'text-emerald-400' : 'text-red-400'
                                        }`}>
                                            {judgeResult.verdict === 'ADVANCE' || judgeResult.verdict === 'Optimal' ? 'Passed' : 'Failed'}
                                        </h4>
                                        <p className="text-gray-300 leading-relaxed text-sm opacity-90">{judgeResult.feedback}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {complexity && (
                            <div className="mt-6 p-6 rounded-xl bg-purple-500/5 border border-purple-500/20">
                                <h4 className="flex items-center gap-2 text-purple-400 font-bold mb-4 text-sm uppercase tracking-wider">
                                    <span className="text-lg">📊</span> Analysis Report
                                </h4>
                                <pre className="font-mono text-xs text-purple-200/80 whitespace-pre-wrap leading-relaxed">
                                    {complexity}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
