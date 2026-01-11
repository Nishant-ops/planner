import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DAG_STRUCTURE } from '../../data/dagStructure';
import { PROBLEMS_DB } from '../../data/problemsDB';
import { useMastery } from '../../hooks/useMastery';
import { judgeCode, analyzeComplexity } from '../../services/aiService';
import { calculateConfidence } from '../../utils/dagLogic';

export default function IDEView() {
  const { topicKey, problemId } = useParams();
  const navigate = useNavigate();
  const { mastery, refreshMastery } = useMastery();

  const topic = DAG_STRUCTURE[topicKey];
  const problems = PROBLEMS_DB[topicKey] || [];
  const problem = problems.find((p) => p.id === problemId);

  const [code, setCode] = useState('// Write your solution here...\n\n');
  const [judgeResult, setJudgeResult] = useState(null);
  const [complexity, setComplexity] = useState(null);
  const [isJudging, setIsJudging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-700 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate(`/hub/${topicKey}`)}
              className="text-gray-400 hover:text-white mb-2 text-sm"
            >
              ← Back to {topic.label}
            </button>
            <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
            <div className="flex items-center gap-4 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  problem.diff === 'Easy'
                    ? 'bg-green-900/50 text-green-300'
                    : 'bg-yellow-900/50 text-yellow-300'
                }`}
              >
                {problem.diff}
              </span>
              <span className="text-blue-400 text-sm font-mono">{problem.invariant}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left - Problem Description */}
        <div className="bg-slate-900 p-6 overflow-y-auto border-r border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Problem Description</h2>
          <p className="text-gray-300 mb-6">{problem.description}</p>

          {problem.examples.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Examples</h3>
              {problem.examples.map((ex, idx) => (
                <div key={idx} className="bg-slate-800 p-4 rounded-lg mb-3">
                  <div className="mb-2">
                    <span className="text-gray-400">Input: </span>
                    <span className="text-white font-mono">{ex.input}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-gray-400">Output: </span>
                    <span className="text-white font-mono">{ex.output}</span>
                  </div>
                  {ex.explain && (
                    <div>
                      <span className="text-gray-400">Explanation: </span>
                      <span className="text-gray-300">{ex.explain}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {problem.constraints.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Constraints</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {problem.constraints.map((constraint, idx) => (
                  <li key={idx}>{constraint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right - Code Editor & Results */}
        <div className="flex flex-col">
          {/* Code Editor */}
          <div className="flex-1 p-6 bg-slate-950">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Code Editor</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleComplexityAnalysis}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Complexity'}
                </button>
                <button
                  onClick={handleJudge}
                  disabled={isJudging}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
                >
                  {isJudging ? 'Judging...' : 'Submit & Judge'}
                </button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 p-4 bg-slate-900 text-white font-mono text-sm rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 resize-none"
              spellCheck={false}
            />
          </div>

          {/* Results */}
          {(judgeResult || complexity) && (
            <div className="p-6 bg-slate-900 border-t border-slate-700 space-y-4">
              {/* Judge Result */}
              {judgeResult && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    judgeResult.verdict === 'ADVANCE' || judgeResult.verdict === 'Optimal'
                      ? 'bg-emerald-950/30 border-emerald-700'
                      : 'bg-red-950/30 border-red-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold">
                      {judgeResult.verdict === 'ADVANCE' || judgeResult.verdict === 'Optimal' ? (
                        <span className="text-emerald-500">✓ ADVANCE</span>
                      ) : (
                        <span className="text-red-500">✗ REPEAT</span>
                      )}
                    </span>
                  </div>
                  <p className="text-gray-300">{judgeResult.feedback}</p>
                </div>
              )}

              {/* Complexity Analysis */}
              {complexity && (
                <div className="p-4 bg-slate-800 rounded-lg border border-purple-700">
                  <h3 className="text-purple-400 font-semibold mb-2">Complexity Analysis</h3>
                  <div className="text-gray-300 whitespace-pre-wrap">{complexity}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
