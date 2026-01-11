import { useMastery } from '../../hooks/useMastery';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getTopicsByTier, getStatus, getStatusColor } from '../../utils/dagLogic';

export default function TreeView() {
  const { mastery } = useMastery();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const tiers = getTopicsByTier();

  const handleTopicClick = (topicKey, status) => {
    if (status !== 'LOCKED') {
      navigate(`/hub/${topicKey}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Skill Tree</h1>
            <p className="text-gray-400">Master DSA through dependencies</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-900/50 text-red-300 rounded-lg hover:bg-red-900 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-8 flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-600"></div>
            <span className="text-gray-300">Mastered (100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-600"></div>
            <span className="text-gray-300">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-600"></div>
            <span className="text-gray-300">Unlocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-900"></div>
            <span className="text-gray-300">Locked</span>
          </div>
        </div>

        {/* Tiers */}
        <div className="space-y-8">
          {Object.keys(tiers)
            .sort((a, b) => Number(a) - Number(b))
            .map((tierNum) => (
              <div key={tierNum} className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Tier {tierNum}
                  {tierNum === '0' && ' - Roots'}
                  {tierNum === '7' && ' - Endgame'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tiers[tierNum].map((topic) => {
                    const status = getStatus(topic.key, mastery);
                    const color = getStatusColor(status);
                    const topicMastery = mastery[topic.key] || { confidence: 0, solved: [] };

                    return (
                      <button
                        key={topic.key}
                        onClick={() => handleTopicClick(topic.key, status)}
                        disabled={status === 'LOCKED'}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          status === 'LOCKED'
                            ? 'bg-red-950/30 border-red-900 cursor-not-allowed opacity-50'
                            : status === 'MASTERED'
                            ? 'bg-emerald-950/30 border-emerald-700 hover:border-emerald-500'
                            : status === 'IN_PROGRESS'
                            ? 'bg-blue-950/30 border-blue-700 hover:border-blue-500'
                            : 'bg-slate-800 border-slate-600 hover:border-slate-400'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-white font-semibold">{topic.label}</h3>
                          {status === 'MASTERED' && <span className="text-emerald-500">✓</span>}
                          {status === 'LOCKED' && <span className="text-red-500">🔒</span>}
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{topic.desc}</p>
                        {status !== 'LOCKED' && (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-slate-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  status === 'MASTERED' ? 'bg-emerald-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${topicMastery.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-400">{topicMastery.confidence}%</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
