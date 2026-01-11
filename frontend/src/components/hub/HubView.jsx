import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DAG_STRUCTURE } from '../../data/dagStructure';
import { PROBLEMS_DB } from '../../data/problemsDB';
import { useMastery } from '../../hooks/useMastery';
import { useAuth } from '../../hooks/useAuth';
import { chatWithArchitect } from '../../services/aiService';

export default function HubView() {
  const { topicKey } = useParams();
  const navigate = useNavigate();
  const { mastery } = useMastery();
  const { logout } = useAuth();
  const chatEndRef = useRef(null);

  const topic = DAG_STRUCTURE[topicKey];
  const problems = PROBLEMS_DB[topicKey] || [];
  const topicMastery = mastery[topicKey] || { confidence: 0, solved: [] };

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' or 'problems'
  const [expandedModules, setExpandedModules] = useState(new Set([0])); // First module expanded by default
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleModule = (index) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedModules(newExpanded);
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Topic not found</div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    try {
      setIsLoading(true);
      const response = await chatWithArchitect(topicKey, userMessage);
      setChatMessages((prev) => [...prev, { role: 'assistant', content: response.response }]);
    } catch (error) {
      console.error('Chat failed:', error);
      setChatMessages((prev) => [
        ...prev,
        { role: 'system', content: 'Failed to get response. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-500/30">
      {/* Compact Header */}
      <div className="sticky top-0 z-20 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto py-3 px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`block h-0.5 w-6 bg-white transition-all ${sidebarOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-white transition-all ${sidebarOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-white transition-all ${sidebarOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
            <h1 className="text-lg font-bold text-white">
              {topic.label}
            </h1>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm text-gray-400">{topicMastery.solved.length}/3 solved</div>
            </div>
            <div className="relative w-12 h-12">
              <svg className="transform -rotate-90 w-12 h-12">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-slate-700"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 20}`}
                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - topicMastery.confidence / 100)}`}
                  className="text-blue-500 transition-all duration-1000"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{topicMastery.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-700 z-30 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <span className="text-white text-xl">×</span>
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                navigate('/');
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all text-left"
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => {
                navigate('/tree');
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-800 rounded-lg transition-all text-left"
            >
              <span>🌳</span>
              <span>Skill Tree</span>
            </button>

            <div className="my-4 border-t border-slate-700"></div>

            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Topic</h3>
              <p className="text-white font-semibold mb-1">{topic.label}</p>
              <p className="text-gray-400 text-sm mb-3">{topic.desc}</p>

              <div className="bg-slate-800 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-400">Progress</span>
                  <span className="text-sm font-bold text-blue-400">{topicMastery.confidence}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${topicMastery.confidence}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {topicMastery.solved.length}/3 problems solved
                </div>
              </div>
            </div>

            {topic.youtube && (
              <>
                <div className="my-4 border-t border-slate-700"></div>
                <a
                  href={`https://www.youtube.com/watch?v=${topic.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-all text-left border border-red-600/30"
                >
                  <span>▶️</span>
                  <span>Watch Video</span>
                </a>
              </>
            )}

            <div className="my-4 border-t border-slate-700"></div>

            <button
              onClick={() => {
                logout();
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-300 hover:text-white bg-red-900/20 hover:bg-red-900/30 rounded-lg transition-all text-left border border-red-700/30"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - AI Chat (Fixed) */}
        <div className="lg:col-span-1">
          <div className="glass-panel rounded-2xl border border-white/5 shadow-2xl flex flex-col h-[calc(100vh-140px)] sticky top-20">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 border-b border-slate-700/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                  AI
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">{topic.label} Architect</h2>
                  <p className="text-gray-400 text-xs">Ask conceptual questions</p>
                </div>
                {isLoading && (
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages with Auto-scroll */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4" style={{ minHeight: 0 }}>
              {chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="text-5xl">💭</div>
                    <p className="text-gray-400 text-sm">Start a conversation with the AI Architect</p>
                    <div className="grid grid-cols-1 gap-2 mt-4">
                      <button
                        onClick={() => {
                          setChatInput("What's the key intuition behind " + topic.label + "?");
                        }}
                        className="px-3 py-2 bg-slate-800/50 text-gray-300 rounded-lg hover:bg-slate-700/50 transition-all text-xs border border-slate-700/50"
                      >
                        "What's the key intuition?"
                      </button>
                      <button
                        onClick={() => {
                          setChatInput("When should I use " + topic.label + "?");
                        }}
                        className="px-3 py-2 bg-slate-800/50 text-gray-300 rounded-lg hover:bg-slate-700/50 transition-all text-xs border border-slate-700/50"
                      >
                        "When should I use this?"
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">
                          AI
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-2xl shadow-lg text-sm ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-sm'
                            : msg.role === 'system'
                            ? 'bg-red-900/30 text-red-300 border border-red-700/50'
                            : 'bg-slate-800/80 text-gray-100 rounded-bl-sm backdrop-blur-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-white text-xs font-bold ml-2 flex-shrink-0">
                          You
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Modern Chat Input */}
            <div className="p-3 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700/50 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 bg-slate-800/50 text-white text-sm rounded-xl border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 backdrop-blur-sm transition-all"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !chatInput.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/50 font-medium text-sm"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </span>
                  ) : (
                    '→'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tabbed Content (Learning Modules & Problems) */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-2xl border border-white/5 shadow-2xl flex flex-col h-[calc(100vh-140px)]">
            {/* Tab Header */}
            <div className="flex items-center border-b border-slate-700/50 flex-shrink-0">
              <button
                onClick={() => setActiveTab('modules')}
                className={`px-6 py-4 font-semibold transition-all relative ${
                  activeTab === 'modules'
                    ? 'text-white bg-slate-800/50'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/30'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-blue-400">📚</span>
                  Learning Modules
                </span>
                {activeTab === 'modules' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab('problems')}
                className={`px-6 py-4 font-semibold transition-all relative ${
                  activeTab === 'problems'
                    ? 'text-white bg-slate-800/50'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/30'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-purple-400">💪</span>
                  Problems
                  <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">
                    {topicMastery.solved.length}/{problems.length}
                  </span>
                </span>
                {activeTab === 'problems' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ minHeight: 0 }}>
              {activeTab === 'modules' ? (
                /* Learning Modules Content */
                topic.modules ? (
                  <div className="p-6 space-y-3">
                    {topic.modules.map((module, idx) => (
                      <div
                        key={idx}
                        className="backdrop-blur-sm bg-slate-800/40 rounded-xl border border-slate-700/50 overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleModule(idx)}
                          className="w-full flex items-center justify-between p-4 hover:bg-slate-700/30 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                              expandedModules.has(idx)
                                ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg'
                                : 'bg-slate-700 text-gray-400 group-hover:bg-slate-600'
                            }`}>
                              {idx + 1}
                            </div>
                            <h3 className={`font-semibold transition-colors ${
                              expandedModules.has(idx) ? 'text-white' : 'text-gray-300 group-hover:text-white'
                            }`}>
                              {module.title}
                            </h3>
                          </div>
                          <span className={`text-sm transition-transform ${
                            expandedModules.has(idx) ? 'rotate-180' : ''
                          }`}>
                            ▼
                          </span>
                        </button>

                        {expandedModules.has(idx) && (
                          <div className="px-4 pb-4 animate-fadeIn">
                            <div className="pl-11 pr-4">
                              <div className="prose prose-invert max-w-none">
                                {module.content.split('\n\n').map((paragraph, pIdx) => {
                                  // Check if paragraph is a header (starts with **)
                                  if (paragraph.startsWith('**') && paragraph.includes(':**')) {
                                    const parts = paragraph.split(':**');
                                    const header = parts[0].replace(/\*\*/g, '');
                                    const content = parts[1];
                                    return (
                                      <div key={pIdx} className="mb-3">
                                        <p className="text-blue-400 font-semibold mb-1">{header}:</p>
                                        <p className="text-gray-300 leading-relaxed">{content}</p>
                                      </div>
                                    );
                                  }
                                  // Regular paragraph
                                  return (
                                    <p key={pIdx} className="text-gray-300 leading-relaxed mb-3">
                                      {paragraph.split('**').map((part, i) =>
                                        i % 2 === 0 ? part : <strong key={i} className="text-white font-semibold">{part}</strong>
                                      )}
                                    </p>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 animate-fadeIn">
                    <p className="text-gray-300 leading-relaxed text-lg">{topic.theory}</p>
                  </div>
                )
              ) : (
                /* Problems Content */
                <div className="p-6 space-y-4">
                  {problems.map((problem, idx) => {
                    const isSolved = topicMastery.solved.includes(problem.id);
                    return (
                      <button
                        key={problem.id}
                        onClick={() => navigate(`/ide/${topicKey}/${problem.id}`)}
                        className="group w-full text-left p-5 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-600/50 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 transform hover:-translate-y-1"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1 w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-bold text-sm border border-slate-500/50">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                                {problem.title}
                              </h3>
                              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                {problem.description.substring(0, 120)}...
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2 ml-4">
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                problem.diff === 'Easy'
                                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/50'
                                  : problem.diff === 'Medium'
                                  ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700/50'
                                  : 'bg-red-900/30 text-red-400 border border-red-700/50'
                              }`}
                            >
                              {problem.diff}
                            </span>
                            {isSolved && (
                              <div className="flex items-center gap-1 bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded-full text-xs border border-emerald-700/50">
                                <span>✓</span>
                                <span>Solved</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 bg-blue-950/30 rounded-lg border border-blue-800/30">
                          <span className="text-blue-400 text-xs">💡</span>
                          <p className="text-blue-300 text-sm font-mono">{problem.invariant}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
