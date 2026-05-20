import { motion } from "motion/react";
import { REWARD_TYPES } from "../constants";
import type { RewardType } from "../types";

export function CelebrationModal({
  rewardText,
  rewardType,
  onClose,
  onReset
}: {
  rewardText: string;
  rewardType: RewardType;
  onClose: () => void;
  onReset: () => void
}) {
  const currentRewardConfig = REWARD_TYPES.find(r => r.id === rewardType) || REWARD_TYPES[0];
  const Icon = currentRewardConfig.icon;

  return (
    <div className="text-center pb-2">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.6 }}
        className={`mx-auto w-28 h-28 ${currentRewardConfig.bg} ${currentRewardConfig.color} rounded-full flex items-center justify-center mb-6 shadow-inner`}
      >
        <Icon size={56} />
      </motion.div>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-4xl font-black text-slate-800 mb-2"
      >
        Goal Reached!
      </motion.h2>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 mt-4">Reward Unlocked</div>
        <div className={`text-3xl font-black ${currentRewardConfig.color} leading-tight`}>{rewardText}</div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        <button onClick={onReset} className={`w-full py-4 text-white rounded-2xl font-black text-xl transition-colors shadow-lg opacity-90 hover:opacity-100 ${currentRewardConfig.bg.replace('100', '500')}`}>
          Cash In & Start Over
        </button>
        <button onClick={onClose} className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-xl transition-colors">
          Keep Saving Points
        </button>
      </motion.div>
    </div>
  );
}
