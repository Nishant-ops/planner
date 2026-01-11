import GoogleLoginButton from '../auth/GoogleLoginButton';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-6xl font-bold text-white mb-6">
          Master DSA Through <span className="text-blue-500">Dependencies</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          SkillTree is a gamified DSA learning platform that enforces prerequisites.
          Master foundational concepts before unlocking advanced topics.
        </p>
        <p className="text-lg text-gray-400 mb-12">
          22 topics • 66 problems • AI-powered learning
        </p>

        {user ? (
          <button
            onClick={() => navigate('/tree')}
            className="px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-xl text-lg"
          >
            Continue Learning →
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <GoogleLoginButton />
            <p className="text-sm text-gray-500">Free forever • No credit card required</p>
          </div>
        )}

        <div className="mt-16 grid grid-cols-3 gap-8 text-left max-w-3xl mx-auto">
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-2">🌳</div>
            <h3 className="text-white font-semibold mb-2">DAG Architecture</h3>
            <p className="text-gray-400 text-sm">
              8-tier dependency graph ensures you build a solid foundation
            </p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-white font-semibold mb-2">AI Architect</h3>
            <p className="text-gray-400 text-sm">
              Socratic guidance from topic-specific AI mentors
            </p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-white font-semibold mb-2">Pattern Mastery</h3>
            <p className="text-gray-400 text-sm">
              Learn the invariants, not just the solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
