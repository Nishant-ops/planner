import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DAG_STRUCTURE } from '../../data/dagStructure';
import { PROBLEMS_DB } from '../../data/problemsDB';
import { useMastery } from '../../hooks/useMastery';
import { chatWithArchitect } from '../../services/aiService';

export default function HubView() {
  const { topicKey } = useParams();
  const navigate = useNavigate();
  const { mastery } = useMastery();

  const topic = DAG_STRUCTURE[topicKey];
  const problems = PROBLEMS_DB[topicKey] || [];
  const topicMastery = mastery[topicKey] || { confidence: 0, solved: [] };

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        { role: 'assistant', content: 'Failed to get response. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate('/tree')}
              className="text-gray-400 hover:text-white mb-2 text-sm"
            >
              ← Back to Skill Tree
            </button>
            <h1 className="text-3xl font-bold text-white">{topic.label}</h1>
            <p className="text-gray-400">{topic.desc}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{topicMastery.confidence}%</div>
            <div className="text-gray-400 text-sm">
              {topicMastery.solved.length}/3 problems solved
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Theory & Chat */}
        <div className="space-y-6">
          {/* Theory Section */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">Theory</h2>
            <p className="text-gray-300 mb-4">{topic.theory}</p>
            {topic.youtube && (
              <a
                href={`https://www.youtube.com/watch?v=${topic.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Watch YouTube Tutorial
              </a>
            )}
          </div>

          {/* Architect Chat */}
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">Architect Chat</h2>
            <p className="text-gray-400 text-sm mb-4">
              Ask the {topic.label} Architect for conceptual guidance. No code, just intuition.
            </p>

            {/* Chat Messages */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block px-4 py-2 rounded-lg max-w-[80%] ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-gray-300'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask a conceptual question..."
                className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Problems */}
        <div>
          <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">Problems</h2>
            <div className="space-y-4">
              {problems.map((problem) => {
                const isSolved = topicMastery.solved.includes(problem.id);
                return (
                  <button
                    key={problem.id}
                    onClick={() => navigate(`/ide/${topicKey}/${problem.id}`)}
                    className="w-full text-left p-4 bg-slate-800 rounded-lg border border-slate-600 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-white font-semibold">{problem.title}</h3>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            problem.diff === 'Easy'
                              ? 'bg-green-900/50 text-green-300'
                              : 'bg-yellow-900/50 text-yellow-300'
                          }`}
                        >
                          {problem.diff}
                        </span>
                        {isSolved && <span className="text-emerald-500">✓</span>}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{problem.description.substring(0, 100)}...</p>
                    <p className="text-blue-400 text-sm font-mono">{problem.invariant}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
