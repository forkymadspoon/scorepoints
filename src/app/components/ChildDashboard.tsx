import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { Star } from "lucide-react";
import { usePostHog } from "@posthog/react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { REWARD_TYPES, DEFAULT_GOOD_ACTIONS, DEFAULT_BAD_ACTIONS } from "../constants";
import { FigmaHistoryIcon, FigmaSettingsIcon, FigmaChevronIcon, FigmaMinusIcon, FigmaPlusIcon } from "./icons";
import { ModalOverlay } from "./ModalOverlay";
import { ActionModal } from "./ActionModal";
import { GoalSettingsModal } from "./GoalSettingsModal";
import { HistoryModal } from "./HistoryModal";
import { CelebrationModal } from "./CelebrationModal";
import { ChildSelectorModal } from "./ChildSelectorModal";
import svgPaths from "@/imports/PointSystemMobileApp-2/svg-yqa9jeu4lt";
import type { Action, ActionType, RewardType, Transaction, ChildProfile } from "../types";

export function ChildDashboard({
  child,
  childrenList,
  setChildren,
  setActiveChildId
}: {
  child: ChildProfile,
  childrenList: ChildProfile[],
  setChildren: (c: ChildProfile[]) => void,
  setActiveChildId: (id: string) => void
}) {
  const posthog = usePostHog();
  const keyPrefix = child.id === 'default' ? 'app' : `app-${child.id}`;

  const [points, setPoints] = useLocalStorage<number>(`${keyPrefix}-points`, 0);
  const [goal, setGoal] = useLocalStorage<number>(`${keyPrefix}-goal`, 100);
  const [rewardText, setRewardText] = useLocalStorage<string>(`${keyPrefix}-reward-text`, "A Special Treat!");
  const [rewardType, setRewardType] = useLocalStorage<RewardType>(`${keyPrefix}-reward-type`, "trophy");
  const [hasCelebrated, setHasCelebrated] = useLocalStorage<boolean>(`${keyPrefix}-has-celebrated`, false);

  // Custom action lists (shared across all children)
  const [goodActions, setGoodActions] = useLocalStorage<Action[]>("app-good-actions", DEFAULT_GOOD_ACTIONS);
  const [badActions, setBadActions] = useLocalStorage<Action[]>("app-bad-actions", DEFAULT_BAD_ACTIONS);

  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    `${keyPrefix}-transactions`,
    []
  );

  const [activeModal, setActiveModal] = useState<"add" | "deduct" | "goal" | "history" | "celebration" | "switch-child" | null>(null);

  const progressPercentage = Math.max(0, Math.min((points / goal) * 100, 100));
  const isGoalReached = points >= goal;

  const currentRewardConfig = REWARD_TYPES.find(r => r.id === rewardType) || REWARD_TYPES[0];
  const CurrentRewardIcon = currentRewardConfig.icon;

  // Trigger celebration when goal is reached
  useEffect(() => {
    if (isGoalReached && points > 0 && !hasCelebrated) {
      triggerConfetti();
      setActiveModal("celebration");
      setHasCelebrated(true);
    } else if (!isGoalReached && points < goal) {
      setHasCelebrated(false);
    }
  }, [isGoalReached, points, hasCelebrated, goal, setHasCelebrated]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleTransaction = (action: Action | { name: string; value: number; type: ActionType }) => {
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      actionId: "id" in action ? action.id : "custom",
      name: action.name,
      value: action.value,
      type: action.type,
      timestamp: Date.now(),
    };

    setTransactions((prev) => [transaction, ...prev]);

    const newPoints = action.type === "good" ? points + action.value : points - action.value;

    if (action.type === "good") {
      posthog?.capture("points_earned", {
        action_name: action.name,
        points_value: action.value,
        child_id: child.id,
        child_name: child.name,
        is_preset: "id" in action,
        total_points_after: newPoints,
      });
      setPoints((prev) => prev + action.value);
    } else {
      posthog?.capture("points_deducted", {
        action_name: action.name,
        points_value: action.value,
        child_id: child.id,
        child_name: child.name,
        is_preset: "id" in action,
        total_points_after: newPoints,
      });
      setPoints((prev) => prev - action.value);
    }

    if (action.type === "good" && newPoints >= goal && points < goal) {
      posthog?.capture("goal_reached", {
        child_id: child.id,
        child_name: child.name,
        goal,
        reward_text: rewardText,
        reward_type: rewardType,
      });
    }

    setActiveModal(null);
  };

  const handleCashIn = () => {
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      actionId: "cash-in",
      name: `Cashed in: ${rewardText}`,
      value: points,
      type: "cash-in",
      timestamp: Date.now(),
    };
    setTransactions((prev) => [tx, ...prev]);
    posthog?.capture("reward_cashed_in", {
      child_id: child.id,
      child_name: child.name,
      reward_text: rewardText,
      reward_type: rewardType,
      points_at_cash_in: points,
      goal,
    });
    setPoints(0);
    setActiveModal(null);
  };

  const undoTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    posthog?.capture("transaction_undone", {
      child_id: child.id,
      child_name: child.name,
      action_name: tx.name,
      points_value: tx.value,
      transaction_type: tx.type,
    });

    if (tx.type === "good") {
      setPoints((prev) => prev - tx.value);
    } else if (tx.type === "bad" || tx.type === "cash-in") {
      setPoints((prev) => prev + tx.value);
    }

    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetPoints = () => {
    const tx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      actionId: "reset",
      name: "Points Reset",
      value: points,
      type: "cash-in", // reusing cash-in type for visual formatting in history
      timestamp: Date.now(),
    };
    setTransactions((prev) => [tx, ...prev]);
    posthog?.capture("points_reset", {
      child_id: child.id,
      child_name: child.name,
      points_at_reset: points,
    });
    setPoints(0);
  };

  const handleSaveSettings = (newGoal: number, newReward: string, newType: RewardType) => {
    posthog?.capture("goal_settings_saved", {
      child_id: child.id,
      child_name: child.name,
      new_goal: newGoal,
      new_reward_text: newReward,
      new_reward_type: newType,
      previous_goal: goal,
    });
    if (newGoal > 0) setGoal(newGoal);
    if (newReward) setRewardText(newReward);
    setRewardType(newType);
    setActiveModal(null);
  };

  return (
    <div className="h-[100dvh] w-full bg-white flex items-center justify-center text-[#1d293d] overflow-hidden" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="w-full max-w-md bg-white h-full sm:h-[812px] sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col p-4 sm:p-5">

        {/* Header */}
        <div className="w-full flex justify-between items-center shrink-0 mb-4 sm:mb-6 z-10">
          <button
            onClick={() => setActiveModal("history")}
            className="w-[44px] h-[44px] bg-[#f1f5f9] rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-95"
          >
            <FigmaHistoryIcon />
          </button>
          <button
            onClick={() => setActiveModal("switch-child")}
            className="flex items-center gap-2 hover:bg-slate-50 py-1 px-4 rounded-full transition-colors active:scale-95"
          >
            <h1 className="text-[22px] font-black tracking-[-0.5px] truncate max-w-[150px]">{child.name}</h1>
            <FigmaChevronIcon />
          </button>
          <button
            onClick={() => setActiveModal("goal")}
            className="w-[44px] h-[44px] bg-[#f1f5f9] rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors active:scale-95"
          >
            <FigmaSettingsIcon />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center w-full relative min-h-0 z-0">

          {/* Goal Indicator Ring */}
          <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-square flex items-center justify-center shrink">
            <svg className="absolute inset-0 size-full transform -rotate-90" fill="none" viewBox="0 0 403.406 403.406">
              <path d={svgPaths.p5d4a100} stroke="#F1F5F9" strokeLinecap="round" strokeWidth="28.0143" />
              <motion.path
                d={svgPaths.p5d4a100}
                stroke={isGoalReached ? "#00bc7d" : points < 0 ? "#FF2056" : "#3B82F6"}
                strokeLinecap="round"
                strokeWidth="28.0143"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: points < 0 ? 0 : progressPercentage / 100 }}
                transition={{ duration: 1, type: "spring", bounce: 0.2 }}
              />
            </svg>

            {/* Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-1">
              <div className="text-[16px] sm:text-[18px] font-bold text-[#90a1b9] uppercase tracking-[2px] mb-[-5px] z-10">Total Points</div>
              <motion.div
                key={points}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="flex flex-col items-center justify-center"
              >
                <div className={`text-[80px] sm:text-[96px] font-black tabular-nums leading-none tracking-[-4px] ${points < 0 ? 'text-[#FF2056]' : 'text-[#1d293d]'}`}>
                  {points}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Goal Tracker */}
          <div className="w-full max-w-[360px] bg-white drop-shadow-[0px_1.3px_2px_rgba(0,0,0,0.1),0px_1.3px_1.3px_rgba(0,0,0,0.1)] rounded-[24px] p-4 mt-4 shrink-0 z-10 border-[1.66px] border-[#f1f5f9]">
            <div className="flex justify-between items-center mb-[10px]">
              <div className="flex items-center gap-[10px]">
                <div className={`w-[46px] h-[46px] rounded-full flex items-center justify-center ${isGoalReached ? 'bg-[#d0fae5] text-[#096]' : `${currentRewardConfig.bg} ${currentRewardConfig.color}`}`}>
                  <CurrentRewardIcon size={24} />
                </div>
                <div className="text-[18px] font-bold text-[#62748e]">Goal Progress</div>
              </div>
              <div className="text-[20px] font-black">{points} / {goal}</div>
            </div>

            <div className="h-[20px] w-full bg-[#f1f5f9] rounded-full overflow-hidden shadow-[inset_0px_2.6px_5px_0px_rgba(0,0,0,0.05)] relative">
              <motion.div
                className={`absolute top-0 left-0 h-full rounded-full ${isGoalReached ? 'bg-[#00bc7d]' : 'bg-[#2b7fff]'}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ type: "spring", bounce: 0, duration: 0.5 }}
              />
            </div>
          </div>

          {!isGoalReached ? (
            <div className="mt-3 sm:mt-4 text-center shrink-0">
              <span className="font-bold text-[#2b7fff] text-[18px]">{goal - points}</span>
              <span className="font-bold text-[#90a1b9] text-[18px]"> more points to go!</span>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-3 sm:mt-4 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform shrink-0"
              onClick={() => setActiveModal("celebration")}
            >
              <div className="text-center font-bold text-[#00bc7d] flex items-center gap-2 text-[18px]">
                <Star fill="currentColor" size={20} /> Goal Reached! <Star fill="currentColor" size={20} />
              </div>
              <div className={`text-center font-black text-[18px] ${currentRewardConfig.color} mt-1 drop-shadow-sm`}>
                Reward: {rewardText}
              </div>
            </motion.div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 shrink-0 pb-1 pt-2 mt-auto w-full max-w-[400px] mx-auto z-10">
          <button
            onClick={() => setActiveModal("deduct")}
            className="flex-1 h-[60px] bg-[#ffe4e6] rounded-[24px] relative overflow-hidden flex items-center justify-center group active:scale-95 transition-transform"
          >
            <div className="absolute inset-x-0 bottom-0 h-[60px] bg-[#FF2056] opacity-10" />
            <div className="flex items-center gap-[8px] z-10">
              <FigmaMinusIcon />
              <span className="font-bold text-[#FF2056] text-[20px]">Lose</span>
            </div>
          </button>
          <button
            onClick={() => setActiveModal("add")}
            className="flex-1 h-[60px] bg-[#d0fae5] rounded-[24px] relative overflow-hidden flex items-center justify-center group active:scale-95 transition-transform"
          >
            <div className="absolute inset-x-0 bottom-0 h-[60px] bg-[#00bc7d] opacity-10" />
            <div className="flex items-center gap-[8px] z-10">
              <FigmaPlusIcon />
              <span className="font-bold text-[#096] text-[20px]">Earn</span>
            </div>
          </button>
        </div>

        <p className="text-center text-[11px] text-[#90a1b9] pb-3 shrink-0">
          Built by <a href="mailto:madelkoh@hotmail.com" className="underline hover:text-[#62748e] transition-colors">Madeleine Koh</a>
        </p>

        {/* Modals */}
        <AnimatePresence>
          {activeModal && (
            <ModalOverlay onClose={() => setActiveModal(null)}>
              {activeModal === "add" && (
                <ActionModal
                  type="good"
                  title="Earn Points"
                  actions={goodActions}
                  onAction={handleTransaction}
                  onClose={() => setActiveModal(null)}
                  onUpdateActions={setGoodActions}
                />
              )}
              {activeModal === "deduct" && (
                <ActionModal
                  type="bad"
                  title="Lose Points"
                  actions={badActions}
                  onAction={handleTransaction}
                  onClose={() => setActiveModal(null)}
                  onUpdateActions={setBadActions}
                />
              )}
              {activeModal === "goal" && (
                <GoalSettingsModal
                  currentGoal={goal}
                  currentRewardText={rewardText}
                  currentRewardType={rewardType}
                  onSave={handleSaveSettings}
                  onClose={() => setActiveModal(null)}
                  onResetPoints={handleResetPoints}
                />
              )}
              {activeModal === "history" && (
                <HistoryModal
                  transactions={transactions}
                  onUndo={undoTransaction}
                  onClose={() => setActiveModal(null)}
                />
              )}
              {activeModal === "switch-child" && (
                <ChildSelectorModal
                  childrenList={childrenList}
                  activeChildId={child.id}
                  onSelect={(id) => {
                    setActiveChildId(id);
                    setActiveModal(null);
                  }}
                  onAdd={(name) => {
                    const newId = Math.random().toString(36).substr(2, 9);
                    setChildren([...childrenList, { id: newId, name }]);
                    setActiveChildId(newId);
                    setActiveModal(null);
                  }}
                  onClose={() => setActiveModal(null)}
                />
              )}
              {activeModal === "celebration" && (
                <CelebrationModal
                  rewardText={rewardText}
                  rewardType={rewardType}
                  onClose={() => setActiveModal(null)}
                  onReset={handleCashIn}
                />
              )}
            </ModalOverlay>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
