import { useState } from "react";
import type { FormEvent } from "react";
import { Plus, Check, X, Pencil, Trash2 } from "lucide-react";
import type { Action, ActionType } from "../types";

export function ActionModal({
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

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (customName && customValue) {
      if (isEditing) {
        onUpdateActions([...actions, {
          id: Math.random().toString(36).substr(2, 9),
          name: customName,
          value: parseInt(customValue, 10),
          type
        }]);
        setCustomName("");
        setCustomValue("");
      } else {
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
