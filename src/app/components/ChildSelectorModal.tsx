import { useState } from "react";
import type { FormEvent } from "react";
import { X, Check, UserPlus } from "lucide-react";
import { usePostHog } from "@posthog/react";
import type { ChildProfile } from "../types";

export function ChildSelectorModal({
  childrenList,
  activeChildId,
  onSelect,
  onAdd,
  onClose
}: {
  childrenList: ChildProfile[];
  activeChildId: string;
  onSelect: (id: string) => void;
  onAdd: (name: string) => void;
  onClose: () => void;
}) {
  const posthog = usePostHog();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const handleAddSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      posthog?.capture("child_profile_added", {
        child_name: newName.trim(),
        total_profiles: childrenList.length + 1,
      });
      onAdd(newName.trim());
    }
  };

  const handleSelect = (id: string) => {
    if (id !== activeChildId) {
      const selected = childrenList.find((c) => c.id === id);
      posthog?.capture("child_profile_switched", {
        to_child_id: id,
        to_child_name: selected?.name,
      });
    }
    onSelect(id);
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
              onClick={() => handleSelect(c.id)}
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
