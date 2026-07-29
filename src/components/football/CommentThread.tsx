import { useState } from "react";
import { ThumbsUp, MessageCircle, Edit2, Trash2, Shield, Loader2, CornerDownRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/stores/auth-store";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import {
  useComments,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  useModerateComment,
} from "@/hooks/comments/use-comments";
import { useToggleCommentReaction, useCommentReactions } from "@/hooks/reactions/use-reactions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CommentResource } from "@/types/comment";

// Legacy mock types for backward compatibility
export type Comment = {
  author: string;
  ago: string;
  text: string;
  avatarColor?: "green" | "blue";
  replies?: Comment[];
};

// ---- Interactive Comment Node Component ----
interface CommentNodeProps {
  articleId: string;
  comment: CommentResource;
  isReply?: boolean;
}

function Avatar({ name, isStaff }: { name: string; isStaff?: boolean }) {
  const initial = name ? name[0].toUpperCase() : "?";
  return (
    <div
      className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border shrink-0",
        isStaff
          ? "bg-brand text-brand-foreground border-brand"
          : "bg-brand-soft text-brand border-brand-soft"
      )}
    >
      {initial}
    </div>
  );
}

function InteractiveCommentNode({ articleId, comment, isReply = false }: CommentNodeProps) {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const isOwner = user?.id === comment.user.id;
  const isStaff = user?.role?.name ? ["admin", "editor", "moderator"].includes(user.role.name) : false;

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const updateCommentMutation = useUpdateComment(articleId, comment.id);
  const deleteCommentMutation = useDeleteComment(articleId);
  const createCommentMutation = useCreateComment(articleId);
  const moderateCommentMutation = useModerateComment(articleId);
  
  // Fetch reactions and mutation for likes on comment
  const { data: reactionsData } = useCommentReactions(comment.id);
  const toggleReactionMutation = useToggleCommentReaction(comment.id);

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to react to comments.");
      return;
    }
    toggleReactionMutation.mutate("like");
  };

  const handleUpdate = () => {
    if (!editContent.trim()) return;
    updateCommentMutation.mutate(
      { content: editContent },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Comment updated successfully.");
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(comment.id, {
        onSuccess: () => {
          toast.success("Comment deleted successfully.");
        },
      });
    }
  };

  const handleReply = () => {
    if (!replyContent.trim()) return;
    createCommentMutation.mutate(
      { content: replyContent, parent_id: comment.id },
      {
        onSuccess: () => {
          setIsReplying(false);
          setReplyContent("");
          toast.success("Reply added successfully.");
        },
      }
    );
  };

  const handleModerate = (status: "visible" | "hidden") => {
    moderateCommentMutation.mutate(
      { commentId: comment.id, status, is_approved: status === "visible" },
      {
        onSuccess: () => {
          toast.success(`Comment status updated to ${status}.`);
        },
      }
    );
  };

  const userHasLiked = reactionsData?.user_reaction?.reaction_type === "like";
  const likesCount = reactionsData?.counts?.like ?? comment.reactions_count;

  return (
    <div className={cn("mt-4 p-3 bg-white dark:bg-card rounded-lg border border-border shadow-2xs", isReply && "ml-8 border-l-2 border-l-brand-soft")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={comment.user.full_name} isStaff={comment.user.role !== null} />
          <div className="flex flex-col">
            <span className="text-sm font-semibold flex items-center gap-1">
              {comment.user.full_name}
              {comment.user.role && (
                <span className="text-[10px] bg-brand/10 text-brand px-1.5 py-0.2 rounded font-medium">
                  {comment.user.role.display_name}
                </span>
              )}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {isOwner && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-muted-foreground hover:text-brand hover:bg-secondary rounded transition"
              title="Edit comment"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
          {(isOwner || isStaff) && (
            <button
              onClick={handleDelete}
              className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition"
              title="Delete comment"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          {isStaff && (
            <div className="flex gap-1 border-l pl-1.5 ml-1">
              {comment.status !== "visible" ? (
                <button
                  onClick={() => handleModerate("visible")}
                  className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded"
                >
                  Approve
                </button>
              ) : (
                <button
                  onClick={() => handleModerate("hidden")}
                  className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.5 rounded"
                >
                  Hide
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comment Body / Edit Form */}
      {isEditing ? (
        <div className="mt-2 ml-10 space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-brand outline-none"
            rows={2}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-2.5 py-1 text-xs border rounded-md hover:bg-secondary transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={updateCommentMutation.isPending}
              className="px-2.5 py-1 text-xs bg-brand text-brand-foreground rounded-md hover:bg-brand/90 transition flex items-center gap-1"
            >
              {updateCommentMutation.isPending && <Loader2 className="h-3 w-3 animate-spin" />}
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-foreground mt-2 ml-10 break-words whitespace-pre-line">
          {comment.status === "hidden" && !isStaff ? (
            <span className="italic text-muted-foreground">This comment has been hidden by moderators.</span>
          ) : (
            comment.content
          )}
        </p>
      )}

      {/* Node Actions */}
      <div className="ml-10 mt-2 flex items-center gap-4 text-xs text-muted-foreground">
        <button
          onClick={handleLike}
          className={cn(
            "inline-flex items-center gap-1 hover:text-brand transition",
            userHasLiked && "text-brand font-bold"
          )}
        >
          <ThumbsUp className="h-3.5 w-3.5" /> {likesCount} Likes
        </button>
        {!isReply && isAuthenticated && (
          <button
            onClick={() => setIsReplying(!isReplying)}
            className="inline-flex items-center gap-1 hover:text-brand transition"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Reply
          </button>
        )}
      </div>

      {/* Inline Reply input */}
      {isReplying && (
        <div className="mt-3 ml-10 pl-3 border-l-2 border-brand-soft space-y-2 animate-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <CornerDownRight className="h-3 w-3" /> Replying to {comment.user.full_name}
          </div>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            className="w-full border rounded-md p-2 text-xs focus:ring-1 focus:ring-brand outline-none"
            rows={2}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setIsReplying(false)}
              className="px-2 py-1 text-[10px] border rounded-md hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleReply}
              disabled={createCommentMutation.isPending}
              className="px-2 py-1 text-[10px] bg-brand text-brand-foreground rounded-md hover:bg-brand/90 transition flex items-center gap-1"
            >
              {createCommentMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Post Reply
            </button>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-1">
          {comment.replies.map((reply) => (
            <InteractiveCommentNode
              key={reply.id}
              articleId={articleId}
              comment={reply}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Main Component exported for Articles ----
export function CommentThread({ articleId, allowComments }: { articleId: string; allowComments: boolean }) {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const [commentText, setCommentText] = useState("");
  const [page, setPage] = useState(1);

  const { data: commentsData, isLoading, error } = useComments(articleId, { page, per_page: 15 });
  const createCommentMutation = useCreateComment(articleId);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    createCommentMutation.mutate(
      { content: commentText },
      {
        onSuccess: () => {
          setCommentText("");
          toast.success("Comment posted successfully.");
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to post comment.");
        },
      }
    );
  };

  if (!allowComments) {
    return (
      <div className="bg-muted/40 p-4 rounded-lg text-center text-sm text-muted-foreground border">
        Comments are disabled for this article.
      </div>
    );
  }

  const comments = commentsData?.data?.data ?? [];
  const pagination = commentsData?.data ? {
    current_page: commentsData.data.meta?.current_page ?? 1,
    last_page: commentsData.data.meta?.last_page ?? 1,
    total: commentsData.data.meta?.total ?? 0
  } : null;

  return (
    <div className="space-y-6">
      <div className="border-l-4 border-brand pl-4">
        <h3 className="text-lg font-bold border-b-2 border-brand pb-1 inline-block">
          Comments ({pagination?.total ?? 0})
        </h3>
      </div>

      {/* Add comment box */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="bg-card p-4 rounded-lg border border-border space-y-3">
          <div className="flex gap-3">
            <Avatar name={user.full_name} isStaff={user.role !== null} />
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What are your thoughts on this story? Share your opinion..."
              className="w-full border border-border bg-background rounded-lg p-3 text-sm focus:ring-1 focus:ring-brand outline-none"
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createCommentMutation.isPending || !commentText.trim()}
              className="bg-brand text-brand-foreground px-4 py-2 rounded-md hover:bg-brand/90 transition text-sm font-semibold shadow flex items-center gap-1.5 disabled:opacity-50"
            >
              {createCommentMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Post Comment
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-brand-soft/30 p-5 rounded-lg border text-center space-y-2">
          <p className="text-sm font-medium text-foreground">Have something to say?</p>
          <p className="text-xs text-muted-foreground">Log in to your account to join the discussion and share your views.</p>
          <div className="pt-2">
            <Link
              to="/login"
              search={{ redirect: window.location.pathname }}
              className="inline-block bg-brand text-brand-foreground text-xs font-semibold px-4 py-2 rounded-md hover:bg-brand/95 transition shadow-sm"
            >
              Login to Comment
            </Link>
          </div>
        </div>
      )}

      {/* Comment List */}
      {isLoading ? (
        <div className="py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-4 divide-y divide-border/50">
          {comments.map((comment) => (
            <InteractiveCommentNode
              key={comment.id}
              articleId={articleId}
              comment={comment}
            />
          ))}

          {/* Simple comments pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex justify-center gap-4 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border text-xs rounded hover:bg-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-muted-foreground self-center">
                Page {page} of {pagination.last_page}
              </span>
              <button
                disabled={page >= pagination.last_page}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border text-xs rounded hover:bg-secondary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 border border-dashed rounded-lg text-center text-sm text-muted-foreground">
          No comments yet. Be the first to start the discussion!
        </div>
      )}
    </div>
  );
}

// ---- Legacy Mock UI for backward compatibility ----
function LegacyAvatar({ color = "green" }: { color?: "green" | "blue" }) {
  const cls = color === "blue" ? "bg-blue-100 text-blue-600 border-blue-500" : "bg-brand-soft text-brand border-brand";
  return (
    <div className={`h-7 w-7 rounded-full border flex items-center justify-center text-[10px] font-bold ${cls}`}>
      ●
    </div>
  );
}

function LegacyCommentNode({ c, depth = 0 }: { c: Comment; depth?: number }) {
  return (
    <div className={depth ? "pl-5 border-l border-border ml-3 mt-3" : "mt-3"}>
      <div className="flex items-center gap-2">
        <LegacyAvatar color={c.avatarColor} />
        <span className="text-sm font-semibold">{c.author}</span>
        <span className="text-xs text-muted-foreground">• {c.ago}</span>
      </div>
      <p className="text-sm text-foreground mt-1.5 ml-9">{c.text}</p>
      <div className="ml-9 flex items-center gap-4 text-xs text-muted-foreground mt-1">
        <button className="inline-flex items-center gap-1 hover:text-foreground"><ThumbsUp className="h-3.5 w-3.5" /> Likes</button>
        <button className="inline-flex items-center gap-1 hover:text-foreground"><MessageCircle className="h-3.5 w-3.5" /> Reply</button>
      </div>
      {c.replies?.map((r, i) => <LegacyCommentNode key={i} c={r} depth={depth + 1} />)}
    </div>
  );
}

export function CommentList({ comments }: { comments: Comment[] }) {
  return (
    <div className="border-l-4 border-brand pl-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold border-b-2 border-brand pb-1 inline-block">Comments</h3>
      </div>
      {comments.map((c, i) => <LegacyCommentNode key={i} c={c} />)}
    </div>
  );
}
