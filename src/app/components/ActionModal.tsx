import { useState, useRef } from "react";
import type { FormEvent } from "react";
import { Plus, Check, X, Pencil, Trash2 } from "lucide-react";
import { usePostHog } from "@posthog/react";
import type { Action, ActionType } from "../types";

type GhostItem = { id: string; ghost: true };
type DisplayItem = Action | GhostItem;

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
  const posthog = usePostHog();
  const [isEditing, setIsEditing] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");
  const [displaySlots, setDisplaySlots] = useState<DisplayItem[]>([]);
  const addNameRef = useRef<HTMLInputElement>(null);

  const isGood = type === "good";
  const colorClass = isGood ? "text-emerald-500" : "text-rose-500";
  const bgClass = isGood ? "bg-emerald-50 hover:bg-emerald-100" : "bg-rose-50 hover:bg-rose-100";
  const btnClass = isGood ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600";
  const ghostBorderClass = isGood ? "border-emerald-300" : "border-rose-300";
  const ghostTextClass = isGood ? "text-emerald-400" : "text-rose-400";

  const slots: DisplayItem[] = isEditing ? displaySlots : actions;

  const handleToggleEdit = () => {
    if (!isEditing) {
      setDisplaySlots([...actions]);
    } else {
      setDisplaySlots([]);
      cancelEdit();
    }
    setIsEditing(!isEditing);
  };

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (customName && customValue) {
      const newAction: Action = {
        id: Math.random().toString(36).substr(2, 9),
        name: customName,
        value: parseInt(customValue, 10),
        type,
      };
      if (isEditing) {
        posthog?.capture("action_preset_added", {
          action_name: customName,
          action_value: newAction.value,
          action_type: type,
        });
        onUpdateActions([...actions, newAction]);
        setDisplaySlots(prev => {
          const ghostIdx = prev.findIndex(item => "ghost" in item);
          if (ghostIdx >= 0) {
            return prev.map((item, i) => i === ghostIdx ? newAction : item);
          }
          return [...prev, newAction];
        });
      } else {
        onAction({ name: customName, value: newAction.value, type });
      }
      setCustomName("");
      setCustomValue("");
    }
  };

  const startEdit = (action: Action) => {
    setEditingActionId(action.id);
    setEditName(action.name);
    setEditValue(action.value.toString());
  };

  const cancelEdit = () => {
    setEditingActionId(null);
    setEditName("");
    setEditValue("");
  };

  const handleEditSave = (id: string) => {
    if (!editName || !editValue) return;
    posthog?.capture("action_preset_edited", {
      action_id: id,
      action_name: editName,
      action_value: parseInt(editValue, 10),
      action_type: type,
    });
    onUpdateActions(actions.map(a =>
      a.id === id ? { ...a, name: editName, value: parseInt(editValue, 10) } : a
    ));
    setDisplaySlots(prev => prev.map(item =>
      !("ghost" in item) && item.id === id
        ? { ...item, name: editName, value: parseInt(editValue, 10) }
        : item
    ));
    cancelEdit();
  };

  const handleDelete = (id: string) => {
    const action = actions.find(a => a.id === id);
    posthog?.capture("action_preset_deleted", {
      action_name: action?.name,
      action_value: action?.value,
      action_type: type,
    });
    onUpdateActions(actions.filter(a => a.id !== id));
    setDisplaySlots(prev => prev.map(item =>
      !("ghost" in item) && item.id === id ? { id: `ghost-${id}`, ghost: true } : item
    ));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className={`text-3xl font-black ${colorClass}`}>{title}</h2>
          <button
            onClick={handleToggleEdit}
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

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
        {slots.map((item) =>
          "ghost" in item ? (
            <button
              key={item.id}
              onClick={() => addNameRef.current?.focus()}
              className={`w-full h-20 sm:h-24 rounded-2xl border-2 border-dashed ${ghostBorderClass} flex flex-col items-center justify-center gap-1 transition-colors hover:bg-slate-50`}
            >
              <Plus size={16} className={ghostTextClass} />
              <span className={`text-xs font-bold ${ghostTextClass}`}>Add new preset</span>
            </button>
          ) : editingActionId === item.id ? (
            <div key={item.id} className={`w-full p-3 rounded-2xl flex flex-col gap-1.5 h-20 sm:h-24 ${bgClass} ring-2 ${isGood ? 'ring-emerald-400' : 'ring-rose-400'}`}>
              <input
                autoFocus
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="w-full bg-white/70 rounded-lg px-2 py-0.5 text-sm font-bold text-slate-700 focus:outline-none min-w-0"
                onKeyDown={e => { if (e.key === 'Enter') handleEditSave(item.id); if (e.key === 'Escape') cancelEdit(); }}
              />
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="1"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="w-14 bg-white/70 rounded-lg px-2 py-0.5 text-sm font-black text-center text-slate-700 focus:outline-none"
                  onKeyDown={e => { if (e.key === 'Enter') handleEditSave(item.id); if (e.key === 'Escape') cancelEdit(); }}
                />
                <button onClick={() => handleEditSave(item.id)} disabled={!editName || !editValue} className={`flex-1 rounded-lg text-white font-black text-xs transition-colors disabled:opacity-40 flex items-center justify-center ${btnClass}`}>
                  <Check size={14} strokeWidth={3} />
                </button>
                <button onClick={cancelEdit} className="flex-1 rounded-lg bg-slate-200 text-slate-600 font-black text-xs flex items-center justify-center hover:bg-slate-300">
                  <X size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              className={`w-full p-3 sm:p-4 rounded-2xl text-left transition-all flex flex-col justify-between h-20 sm:h-24 ${bgClass} ${isEditing ? 'ring-2 ring-slate-200' : 'active:scale-95 cursor-pointer'}`}
              onClick={() => !isEditing && onAction(item)}
            >
              <span className="font-bold text-slate-700 leading-tight text-sm sm:text-base">{item.name}</span>
              {isEditing ? (
                <div className="flex items-center justify-between">
                  <span className={`font-black text-lg sm:text-xl ${colorClass}`}>
                    {isGood ? "+" : "-"}{item.value}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={e => { e.stopPropagation(); startEdit(item); }}
                      className="p-1.5 rounded-lg bg-white/60 text-slate-500 hover:bg-white hover:text-slate-700 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(item.id); }}
                      className="p-1.5 rounded-lg bg-white/60 text-rose-400 hover:bg-white hover:text-rose-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ) : (
                <span className={`font-black text-lg sm:text-xl ${colorClass}`}>
                  {isGood ? "+" : "-"}{item.value}
                </span>
              )}
            </div>
          )
        )}
        {slots.length === 0 && (
          <div className="col-span-2 text-center py-6 text-slate-400 font-bold bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            No presets yet!
          </div>
        )}
      </div>

      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 font-bold text-sm uppercase flex items-center gap-1">
          {isEditing ? (
            <><Plus size={16} /> Add New Preset</>
          ) : "Or create custom"}
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          ref={addNameRef}
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
