import { X, Undo } from "lucide-react";
import type { Transaction } from "../types";

export function HistoryModal({ transactions, onUndo, onClose }: { transactions: Transaction[]; onUndo: (id: string) => void; onClose: () => void }) {
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
