import { useMastery } from '../../hooks/useMastery';
import { useNavigate } from 'react-router-dom';
import { DAG_STRUCTURE } from '../../data/dagStructure';

export default function UserDashboard() {
  const { mastery, loading } = useMastery();
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-white">Loading progress...</div>;
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
    <div className="min-h-screen bg-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8">Your Progress</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-emerald-500 text-4xl font-bold mb-2">
              {masteredCount}/{totalTopics}
            </div>
            <div className="text-gray-400">Topics Mastered</div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-blue-500 text-4xl font-bold mb-2">{inProgressCount}</div>
            <div className="text-gray-400">In Progress</div>
          </div>

          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <div className="text-yellow-500 text-4xl font-bold mb-2">
              {Math.round((masteredCount / totalTopics) * 100)}%
            </div>
            <div className="text-gray-400">Overall Progress</div>
          </div>
        </div>

        {lastTopic && (
          <div className="bg-blue-900/30 border border-blue-700 p-6 rounded-lg mb-8">
            <h3 className="text-white font-semibold mb-2">Continue Learning</h3>
            <p className="text-gray-300 mb-4">
              Pick up where you left off: <span className="font-bold">{DAG_STRUCTURE[lastTopic[0]]?.label}</span> ({lastTopic[1].confidence}% complete)
            </p>
            <button
              onClick={() => navigate(`/hub/${lastTopic[0]}`)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue →
            </button>
          </div>
        )}

        {masteredTopics.length > 0 && (
          <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Mastered Topics</h3>
            <div className="flex flex-wrap gap-2">
              {masteredTopics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-sm border border-emerald-700"
                >
                  ✓ {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/tree')}
            className="px-8 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            View Full Skill Tree
          </button>
        </div>
      </div>
    </div>
  );
}
