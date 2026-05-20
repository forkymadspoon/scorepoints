import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { 
  Plus, Minus, Trophy, Star, Settings, X, Check, History, Undo,
  Gamepad2, Coins, Gift, Ticket, IceCream, Pencil, Trash2, ChevronDown, UserPlus
} from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import svgPaths from "@/imports/PointSystemMobileApp-2/svg-yqa9jeu4lt";

// Figma Icons
const FigmaHistoryIcon = () => (
  <div className="relative size-[22px] text-[#62748E]">
    <div className="absolute inset-[12.5%]">
      <svg className="block size-full" fill="none" viewBox="0 0 18.2666 18.2666">
        <path d={svgPaths.p37c04c00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.82666" />
      </svg>
    </div>
    <div className="absolute inset-[12.5%_66.67%_66.67%_12.5%]">
      <svg className="block size-full" fill="none" viewBox="0 0 6.39331 6.39331">
        <path d={svgPaths.p38bec100} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.82666" />
      </svg>
    </div>
    <div className="absolute bottom-[41.67%] left-[45%] right-[33.33%] top-[29.17%]">
      <svg className="block size-full" fill="none" viewBox="0 0 5.48018 8.22017">
        <path d={svgPaths.p29503900} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.82666" />
      </svg>
    </div>
  </div>
);

const FigmaSettingsIcon = () => (
  <div className="relative size-[22px] text-[#62748E]">
    <div className="absolute inset-[8.33%_12.43%]">
      <svg className="block size-full" fill="none" viewBox="0 0 18.2987 20.0932">
        <path d={svgPaths.p130c9380} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.82666" />
      </svg>
    </div>
    <div className="absolute inset-[37.5%]">
      <svg className="block size-full" fill="none" viewBox="0 0 7.30664 7.30664">
        <path d={svgPaths.p26d96f80} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.82666" />
      </svg>
    </div>
  </div>
);

const FigmaChevronIcon = () => (
  <div className="relative size-[18px] shrink-0 text-[#62748E]">
    <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 18.2727 18.2727">
      <path d={svgPaths.p37d4bd00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.52273" />
    </svg>
  </div>
);

const FigmaTrophyIcon = () => (
  <div className="relative size-[26px]">
    <svg className="absolute block inset-0 size-full text-[#F0B100]" fill="none" viewBox="0 0 25.7124 25.7124">
      <path d={svgPaths.p75e3500} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1427" />
      <path d={svgPaths.p20868d00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1427" />
      <path d="M4.28546 23.5697H21.4271" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1427" />
      <path d={svgPaths.p15df0e00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1427" />
      <path d={svgPaths.p2484b480} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1427" />
      <path d={svgPaths.p15fdf500} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1427" />
    </svg>
  </div>
);

const FigmaMinusIcon = () => (
  <div className="relative size-[24px]">
    <svg className="absolute block inset-0 size-full text-[#FF2056]" fill="none" viewBox="0 0 23.9887 23.9887">
      <path d="M4.99765 11.9944H18.9911" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.99812" />
    </svg>
  </div>
);

const FigmaPlusIcon = () => (
  <div className="relative size-[24px]">
    <svg className="absolute block inset-0 size-full text-[#009966]" fill="none" viewBox="0 0 23.9887 23.9887">
      <path d="M4.99765 11.9944H18.9911" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.99812" />
      <path d="M11.9944 4.99765V18.9911" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.99812" />
    </svg>
  </div>
);

// Types
type ActionType = "good" | "bad" | "cash-in";
type RewardType = "trophy" | "gamepad" | "coins" | "gift" | "ticket" | "icecream";

interface Action {
  id: string;
  name: string;
  value: number;
  type: ActionType;
}

interface Transaction {
  id: string;
  actionId: string;
  name: string;
  value: number;
  type: ActionType;
  timestamp: number;
}

const REWARD_TYPES = [
  { id: "trophy", icon: FigmaTrophyIcon, label: "Prize", color: "text-[#F0B100]", bg: "bg-[#fef9c2]", hover: "hover:ring-yellow-400" },
  { id: "gamepad", icon: Gamepad2, label: "Screen Time", color: "text-indigo-500", bg: "bg-indigo-100", hover: "hover:ring-indigo-400" },
  { id: "coins", icon: Coins, label: "Allowance", color: "text-emerald-500", bg: "bg-emerald-100", hover: "hover:ring-emerald-400" },
  { id: "gift", icon: Gift, label: "Toy", color: "text-pink-500", bg: "bg-pink-100", hover: "hover:ring-pink-400" },
  { id: "ticket", icon: Ticket, label: "Outing", color: "text-orange-500", bg: "bg-orange-100", hover: "hover:ring-orange-400" },
  { id: "icecream", icon: IceCream, label: "Treat", color: "text-cyan-500", bg: "bg-cyan-100", hover: "hover:ring-cyan-400" },
] as const;

const DEFAULT_GOOD_ACTIONS: Action[] = [
  { id: "g1", name: "Cleaned Room", value: 10, type: "good" },
  { id: "g2", name: "Did Homework", value: 15, type: "good" },
  { id: "g3", name: "Ate Veggies", value: 5, type: "good" },
  { id: "g4", name: "Helped Out", value: 5, type: "good" },
];

const DEFAULT_BAD_ACTIONS: Action[] = [
  { id: "b1", name: "Not Listening", value: 5, type: "bad" },
  { id: "b2", name: "Tantrum", value: 10, type: "bad" },
  { id: "b3", name: "Hitting", value: 15, type: "bad" },
  { id: "b4", name: "Refused Bedtime", value: 5, type: "bad" },
];

export default function App() {
  const [children, setChildren] = useLocalStorage<{id: string, name: string}[]>("app-children-list", [{id: "default", name: "My Child"}]);
  const [activeChildId, setActiveChildId] = useLocalStorage<string>("app-active-child", "default");

  const activeChild = children.find(c => c.id === activeChildId) || children[0];

  return (
    <ChildDashboard
      key={activeChild.id}
      child={activeChild}
      childrenList={children}
      setChildren={setChildren}
      setActiveChildId={setActiveChildId}
    />
  );
}

function ChildDashboard({ 
  child, 
  childrenList, 
  setChildren, 
  setActiveChildId 
}: { 
  child: {id: string, name: string}, 
  childrenList: {id: string, name: string}[], 
  setChildren: (c: {id: string, name: string}[]) => void,
  setActiveChildId: (id: string) => void
}) {
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

    if (action.type === "good") {
      setPoints((prev) => prev + action.value);
    } else {
      setPoints((prev) => prev - action.value);
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
    setPoints(0);
    setActiveModal(null);
  };

  const undoTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

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
    setPoints(0);
  };

  const handleSaveSettings = (newGoal: number, newReward: string, newType: RewardType) => {
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
        <div className="flex gap-4 shrink-0 pb-4 pt-2 mt-auto w-full max-w-[400px] mx-auto z-10">
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

// Subcomponents

function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-h-[90%] sm:max-h-[85%] bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 pb-12 sm:pb-6 shadow-2xl overflow-y-auto pointer-events-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden shrink-0" />
        <div className="flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

function ActionModal({
  type,
  title,
  actions,
  onAction,
  onClose,
  onUpdateActions,
}: {
  type: ActionType;
  title: string;
  actions: Action[];
  onAction: (a: Action | { name: string; value: number; type: ActionType }) => void;
  onClose: () => void;
  onUpdateActions: (actions: Action[]) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customValue, setCustomValue] = useState("");

  const isGood = type === "good";
  const colorClass = isGood ? "text-emerald-500" : "text-rose-500";
  const bgClass = isGood ? "bg-emerald-50 hover:bg-emerald-100" : "bg-rose-50 hover:bg-rose-100";
  const btnClass = isGood ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600";

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName && customValue) {
      if (isEditing) {
        // In edit mode, add to the preset list instead of transacting
        onUpdateActions([...actions, {
          id: Math.random().toString(36).substr(2, 9),
          name: customName,
          value: parseInt(customValue, 10),
          type
        }]);
        setCustomName("");
        setCustomValue("");
      } else {
        // Normal mode, just do the transaction
        onAction({ name: customName, value: parseInt(customValue, 10), type });
        setCustomName("");
        setCustomValue("");
      }
    }
  };

  const handleDelete = (id: string) => {
    onUpdateActions(actions.filter(a => a.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className={`text-3xl font-black ${colorClass}`}>{title}</h2>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2.5 rounded-full transition-colors ${isEditing ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            title={isEditing ? "Done Editing" : "Edit Presets"}
          >
            {isEditing ? <Check size={16} strokeWidth={3} /> : <Pencil size={16} />}
          </button>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
        {actions.map((action) => (
          <div key={action.id} className="relative group flex-[1_1_45%] sm:flex-1 sm:min-w-[140px]">
            <button
              onClick={() => !isEditing && onAction(action)}
              disabled={isEditing}
              className={`w-full p-3 sm:p-4 rounded-2xl text-left transition-all flex flex-col justify-between h-20 sm:h-24 ${bgClass} ${isEditing ? 'opacity-60 cursor-default scale-95 ring-2 ring-slate-200' : 'active:scale-95'}`}
            >
              <span className="font-bold text-slate-700 leading-tight text-sm sm:text-base">{action.name}</span>
              <span className={`font-black text-lg sm:text-xl ${colorClass}`}>
                {isGood ? "+" : "-"}{action.value}
              </span>
            </button>
            
            {isEditing && (
              <button
                onClick={() => handleDelete(action.id)}
                className="absolute -top-2 -right-2 p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-md z-10 hover:scale-110 transition-transform"
                title="Delete this preset"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        {actions.length === 0 && (
          <div className="w-full text-center py-6 text-slate-400 font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            No presets yet!
          </div>
        )}
      </div>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 font-bold text-sm uppercase flex items-center gap-1">
          {isEditing ? (
            <>
              <Plus size={16} /> Add New Preset
            </>
          ) : "Or create custom"}
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          placeholder="What did they do?"
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="w-full bg-slate-100 border-none rounded-2xl px-4 py-3 sm:py-4 font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-0"
        />
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <input
            type="number"
            placeholder="0"
            min="1"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            className="flex-1 sm:w-20 bg-slate-100 border-none rounded-2xl px-2 py-3 sm:py-4 font-black text-center text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-0"
          />
          <button
            type="submit"
            disabled={!customName || !customValue}
            className={`px-6 sm:px-6 flex-none rounded-2xl text-white font-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${btnClass} ${isEditing ? 'bg-slate-800 hover:bg-slate-700' : ''}`}
            title={isEditing ? "Save as preset" : "Apply now"}
          >
            {isEditing ? <Plus size={24} /> : <Check size={24} />}
          </button>
        </div>
      </form>
    </div>
  );
}

function GoalSettingsModal({ 
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

function HistoryModal({ transactions, onUndo, onClose }: { transactions: Transaction[]; onUndo: (id: string) => void; onClose: () => void }) {
  return (
    <div className="flex flex-col max-h-[70vh]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-3xl font-black text-slate-800">History</h2>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
          <X size={20} />
        </button>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-10 text-slate-400 font-bold">
          No activities yet!
        </div>
      ) : (
        <div className="overflow-y-auto pr-2 space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <div className="font-bold text-slate-700">{tx.name}</div>
                <div className="text-sm font-medium text-slate-400">
                  {new Date(tx.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`font-black text-xl ${
                  tx.type === "good" ? "text-emerald-500" : 
                  tx.type === "bad" ? "text-rose-500" : 
                  "text-slate-500"
                }`}>
                  {tx.type === "good" ? "+" : "-"}{tx.value}
                </div>
                <button
                  onClick={() => onUndo(tx.id)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  title="Undo"
                >
                  <Undo size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CelebrationModal({ 
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

function ChildSelectorModal({
  childrenList,
  activeChildId,
  onSelect,
  onAdd,
  onClose
}: {
  childrenList: {id: string, name: string}[];
  activeChildId: string;
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
  onClose: () => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName.trim());
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-black text-slate-800">Profiles</h2>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200">
          <X size={20} />
        </button>
      </div>

      {!isAdding ? (
        <div className="space-y-3">
          {childrenList.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={`w-full p-4 rounded-2xl flex items-center justify-between transition-all ${
                c.id === activeChildId 
                  ? "bg-blue-500 text-white shadow-md scale-[1.02]" 
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="font-bold text-lg">{c.name}</span>
              {c.id === activeChildId && <Check size={20} strokeWidth={3} />}
            </button>
          ))}
          
          <button
            onClick={() => setIsAdding(true)}
            className="w-full mt-4 p-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <UserPlus size={20} />
            <span>Add Child</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleAddSubmit} className="space-y-4 bg-slate-50 p-6 rounded-3xl">
          <div className="text-center font-bold text-slate-500 mb-2">New Child Profile</div>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Child's Name"
            className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-4 font-bold text-slate-700 placeholder-slate-300 focus:border-blue-400 focus:outline-none transition-colors text-center text-xl"
            autoFocus
          />
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 py-4 bg-white text-slate-500 rounded-2xl font-bold border border-slate-200 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newName.trim()}
              className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 disabled:opacity-50"
            >
              Add Profile
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
