import type { User } from "./auth";

export type ReactionType = "like" | "love" | "angry" | "wow" | "sad";

export interface ReactionResource {
  id: string;
  reaction_type: ReactionType;
  user: User;
  created_at?: string;
}

export interface ReactionSummary {
  counts: Record<ReactionType, number>;
  total_reactions: number;
  user_reaction: ReactionResource | null;
}

export interface StoreReactionPayload {
  reaction_type: ReactionType;
}
