export type ActionType = "good" | "bad" | "cash-in";
export type RewardType = "trophy" | "gamepad" | "coins" | "gift" | "ticket" | "icecream";

export interface Action {
  id: string;
  name: string;
  value: number;
  type: ActionType;
}

export interface Transaction {
  id: string;
  actionId: string;
  name: string;
  value: number;
  type: ActionType;
  timestamp: number;
}

export interface ChildProfile {
  id: string;
  name: string;
}
