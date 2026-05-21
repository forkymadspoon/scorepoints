import { Gamepad2, Coins, Gift, Ticket, IceCream } from "lucide-react";
import { FigmaTrophyIcon } from "./components/icons";
import type { Action } from "./types";

export const REWARD_TYPES = [
  { id: "trophy", icon: FigmaTrophyIcon, label: "Prize", color: "text-[#F0B100]", bg: "bg-[#fef9c2]", buttonBg: "bg-[#d4920a]", hover: "hover:ring-yellow-400" },
  { id: "gamepad", icon: Gamepad2, label: "Screen Time", color: "text-indigo-500", bg: "bg-indigo-100", buttonBg: "bg-indigo-500", hover: "hover:ring-indigo-400" },
  { id: "coins", icon: Coins, label: "Allowance", color: "text-emerald-500", bg: "bg-emerald-100", buttonBg: "bg-emerald-500", hover: "hover:ring-emerald-400" },
  { id: "gift", icon: Gift, label: "Toy", color: "text-pink-500", bg: "bg-pink-100", buttonBg: "bg-pink-500", hover: "hover:ring-pink-400" },
  { id: "ticket", icon: Ticket, label: "Outing", color: "text-orange-500", bg: "bg-orange-100", buttonBg: "bg-orange-500", hover: "hover:ring-orange-400" },
  { id: "icecream", icon: IceCream, label: "Treat", color: "text-cyan-500", bg: "bg-cyan-100", buttonBg: "bg-cyan-500", hover: "hover:ring-cyan-400" },
] as const;

export const DEFAULT_GOOD_ACTIONS: Action[] = [
  { id: "g1", name: "Cleaned Room", value: 10, type: "good" },
  { id: "g2", name: "Did Homework", value: 15, type: "good" },
  { id: "g3", name: "Ate Veggies", value: 5, type: "good" },
  { id: "g4", name: "Helped Out", value: 5, type: "good" },
];

export const DEFAULT_BAD_ACTIONS: Action[] = [
  { id: "b1", name: "Not Listening", value: 5, type: "bad" },
  { id: "b2", name: "Tantrum", value: 10, type: "bad" },
  { id: "b3", name: "Hitting", value: 15, type: "bad" },
  { id: "b4", name: "Refused Bedtime", value: 5, type: "bad" },
];
