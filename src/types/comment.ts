import type { User } from "./auth";

export type CommentStatus = "visible" | "hidden" | "flagged";

export interface CommentResource {
  id: string;
  content: string;
  status: CommentStatus;
  is_approved: boolean;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  replies: CommentResource[];
  reactions_count: number;
}

export interface ListCommentsResponse {
  data: CommentResource[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: unknown[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface CreateCommentPayload {
  content: string;
  parent_id?: string | null;
}

export interface UpdateCommentPayload {
  content: string;
}

export interface ModerateCommentPayload {
  status: CommentStatus;
  is_approved: boolean;
}
