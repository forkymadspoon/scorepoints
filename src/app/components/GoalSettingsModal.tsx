import { useState } from "react";
import { X } from "lucide-react";
import { REWARD_TYPES } from "../constants";
import type { RewardType } from "../types";

export function GoalSettingsModal({
  currentGoal,
  currentRewardText,
  currentRewardType,
  onSave,
  onClose,
  onResetPoints
}: {
  currentGoal: number;
  currentRewardText: string;
  currentRewardType: RewardType;
  onSave: (g: number, r: string, t: RewardType) => void;
  onClose: () => void;
  onResetPoints: () => void;
}) {
  const [val, setVal] = useState(currentGoal.toString());
  const [reward, setReward] = useState(currentRewardText);
  const [type, setType] = useState<RewardType>(currentRewardType);

  return (
    <div>
      <div className="sticky top-0 z-20 bg-white flex justify-between items-center pb-4 mb-2 pt-1">
        <h2 className="text-3xl font-black text-blue-500">Settings</h2>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
          <X size={20} />
        </button>
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl mb-4">
        <div className="text-center mb-2 font-bold text-blue-400">Target Points</div>
        <input
          type="number"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-full bg-transparent text-6xl font-black text-center text-blue-600 outline-none placeholder-blue-200"
          placeholder="100"
        />
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl mb-6">
        <div className="text-center mb-4 font-bold text-slate-400">Reward Details</div>

        <div className="flex flex-wrap gap-3 mb-6">
          {REWARD_TYPES.map((rt) => {
            const Icon = rt.icon;
            const isSelected = type === rt.id;
            return (
              <button
                key={rt.id}
                onClick={() => setType(rt.id as RewardType)}
                className={`flex-1 min-w-[80px] w-full aspect-square flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? `border-transparent ${rt.bg} ${rt.color} scale-105 shadow-md`
                    : `border-slate-100 bg-white text-slate-400 hover:bg-slate-50`
                }`}
              >
                <Icon size={24} />
                <span className="text-xs font-bold">{rt.label}</span>
              </button>
            )
          })}
        </div>

        <input
          type="text"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          className="w-full bg-white text-xl font-black text-center text-slate-700 outline-none placeholder-slate-300 p-4 rounded-2xl border-2 border-slate-100 focus:border-blue-400 transition-colors"
          placeholder="What is the exact reward?"
        />
      </div>

      <button
        onClick={() => onSave(parseInt(val, 10), reward, type)}
        className="w-full py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black text-xl transition-colors shadow-lg shadow-blue-500/30 mb-3"
      >
        Save Settings
      </button>

      <button
        onClick={() => {
          if (confirm("Are you sure you want to completely reset all points to 0? This cannot be undone.")) {
            onResetPoints();
            onSave(parseInt(val, 10), reward, type);
          }
        }}
        className="w-full py-4 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-2xl font-bold text-lg transition-colors border border-rose-100"
      >
        Reset Points to Zero
      </button>
    </div>
  );
}
