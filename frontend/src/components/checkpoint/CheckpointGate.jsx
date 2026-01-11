import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MasteryContext } from '../../contexts/MasteryContext';
import { CheckpointContext } from '../../contexts/CheckpointContext';
import { canAttemptCheckpoint, getCheckpointStatus } from '../../utils/dagLogic';
import { getCheckpointByTier } from '../../data/checkpointsDB';

export default function CheckpointGate({ tier }) {
  const navigate = useNavigate();
  const { mastery } = useContext(MasteryContext);
  const { checkpoints } = useContext(CheckpointContext);

  const checkpointData = getCheckpointByTier(tier);
  const checkpointStatus = getCheckpointStatus(tier, checkpoints);
  const canAttempt = canAttemptCheckpoint(tier, mastery);

  if (!checkpointData) return null;

  const handleAttemptClick = () => {
    if (canAttempt && !checkpointStatus.passed) {
      navigate(`/checkpoint/${tier}`);
    }
  };

  // Determine the display state
  const isPassed = checkpointStatus.passed;
  const isLocked = !canAttempt && !isPassed;
  const isAvailable = canAttempt && !isPassed;

  return (
    <div className="w-full max-w-2xl mx-auto my-8 font-sans">
      
      {/* Decorative Connector */}
      <div className="flex flex-col items-center mb-2 opacity-50">
        <div className="w-px h-8 bg-gradient-to-b from-transparent to-yellow-600/50"></div>
        <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-yellow-500 animate-pulse' : 'bg-gray-700'}`}></div>
      </div>

      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-500 group ${
          isPassed
            ? 'bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/30'
            : isAvailable
            ? 'bg-gradient-to-r from-yellow-950/40 to-slate-900 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.15)] cursor-pointer hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(234,179,8,0.25)]'
            : 'bg-slate-900/40 border-slate-800 opacity-60 grayscale'
        }`}
        onClick={isAvailable ? handleAttemptClick : undefined}
      >
        {/* Animated Background for Available */}
        {isAvailable && (
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 animate-pulse-slow"></div>
        )}

        <div className="relative p-6 px-8 flex items-center justify-between gap-6">
          
          {/* Left Icon Area */}
          <div className={`
             flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5
             ${isPassed ? 'bg-emerald-500/20 text-emerald-400' : isAvailable ? 'bg-yellow-500/20 text-yellow-400 animate-bounce-slow' : 'bg-slate-800 text-gray-600'}
          `}>
             {isPassed ? '🏆' : isLocked ? '🔒' : '⚡'}
          </div>

          {/* Center Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-lg font-bold tracking-wide ${isPassed ? 'text-emerald-400' : isAvailable ? 'text-yellow-400' : 'text-gray-500'}`}>
                TIER {tier} GATE
              </h3>
              {isAvailable && (
                <span className="px-2 py-0.5 bg-yellow-500 text-black text-[10px] font-bold uppercase rounded-sm animate-pulse">
                  Unsealed
                </span>
              )}
            </div>
            
            <p className="text-white font-medium text-xl mb-1">{checkpointData.title}</p>
            
            <p className="text-sm text-gray-400 line-clamp-1">
              {isPassed 
                ? 'Proficiency Demonstrated. Gate Cleared.' 
                : isAvailable 
                  ? 'Prove your mastery to advance.' 
                  : `Complete prior modules to unlock.`}
            </p>
          </div>

          {/* Right Action */}
          <div className="flex-shrink-0">
             {isPassed ? (
                <button
                  onClick={() => navigate(`/checkpoint/${tier}`)} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg transition-colors"
                >
                  Review
                </button>
             ) : isAvailable ? (
                <button className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.4)] transition-all flex items-center gap-2 group-hover:gap-3">
                  <span>ENTER</span>
                  <span>→</span>
                </button>
             ) : (
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                </div>
             )}
          </div>
        </div>
      </div>
       
       {/* Decorative Connector Bottom */}
       <div className="flex flex-col items-center mt-2 opacity-50">
        <div className={`w-2 h-2 rounded-full ${isPassed ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-gray-700'}`}></div>
        <div className="w-px h-8 bg-gradient-to-b from-yellow-600/50 to-transparent"></div>
      </div>

    </div>
  );
}
