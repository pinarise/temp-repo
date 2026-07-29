import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import { reactionService } from "@/services/reaction.service";
import type { ReactionSummary, ReactionType, ReactionResource } from "@/types/reaction";

export function useArticleReactions(articleId: string) {
  return useQuery({
    queryKey: queryKeys.reactions.article(articleId),
    queryFn: ({ signal }) => reactionService.listArticleReactions(articleId, signal),
    enabled: !!articleId,
  });
}

export function useCommentReactions(commentId: string) {
  return useQuery({
    queryKey: queryKeys.reactions.comment(commentId),
    queryFn: ({ signal }) => reactionService.listCommentReactions(commentId, signal),
    enabled: !!commentId,
  });
}

export function useToggleArticleReaction(articleId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.reactions.article(articleId);

  return useMutation({
    mutationFn: (reactionType: ReactionType) =>
      reactionService.toggleArticleReaction(articleId, { reaction_type: reactionType }),
    
    // Optimistic Update
    onMutate: async (reactionType) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousReactions = queryClient.getQueryData<ReactionSummary>(queryKey);

      // Optimistically update to the new value
      if (previousReactions) {
        const counts = { ...previousReactions.counts };
        let userReaction: ReactionResource | null = null;
        let totalOffset = 0;

        const prevUserReaction = previousReactions.user_reaction;

        if (prevUserReaction) {
          // User already reacted
          if (prevUserReaction.reaction_type === reactionType) {
            // Toggling off same reaction
            counts[reactionType] = Math.max(0, (counts[reactionType] || 0) - 1);
            userReaction = null;
            totalOffset = -1;
          } else {
            // Changing reaction type
            counts[prevUserReaction.reaction_type] = Math.max(0, (counts[prevUserReaction.reaction_type] || 0) - 1);
            counts[reactionType] = (counts[reactionType] || 0) + 1;
            userReaction = {
              ...prevUserReaction,
              reaction_type: reactionType,
            };
            totalOffset = 0;
          }
        } else {
          // Brand new reaction
          counts[reactionType] = (counts[reactionType] || 0) + 1;
          userReaction = {
            id: "optimistic-id",
            reaction_type: reactionType,
            user: { id: "current-user-id" } as any, // Mock current user for UI
          };
          totalOffset = 1;
        }

        queryClient.setQueryData<ReactionSummary>(queryKey, {
          counts,
          total_reactions: Math.max(0, previousReactions.total_reactions + totalOffset),
          user_reaction: userReaction,
        });
      }

      // Return context containing previous value to rollback if failed
      return { previousReactions };
    },

    // Rollback on error
    onError: (err, reactionType, context) => {
      if (context?.previousReactions) {
        queryClient.setQueryData(queryKey, context.previousReactions);
      }
    },

    // Refetch on settlement to make sure we're in sync with backend
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useToggleCommentReaction(commentId: string) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.reactions.comment(commentId);

  return useMutation({
    mutationFn: (reactionType: ReactionType) =>
      reactionService.toggleCommentReaction(commentId, { reaction_type: reactionType }),
    
    // Optimistic Update
    onMutate: async (reactionType) => {
      await queryClient.cancelQueries({ queryKey });

      const previousReactions = queryClient.getQueryData<ReactionSummary>(queryKey);

      if (previousReactions) {
        const counts = { ...previousReactions.counts };
        let userReaction: ReactionResource | null = null;
        let totalOffset = 0;

        const prevUserReaction = previousReactions.user_reaction;

        if (prevUserReaction) {
          if (prevUserReaction.reaction_type === reactionType) {
            counts[reactionType] = Math.max(0, (counts[reactionType] || 0) - 1);
            userReaction = null;
            totalOffset = -1;
          } else {
            counts[prevUserReaction.reaction_type] = Math.max(0, (counts[prevUserReaction.reaction_type] || 0) - 1);
            counts[reactionType] = (counts[reactionType] || 0) + 1;
            userReaction = {
              ...prevUserReaction,
              reaction_type: reactionType,
            };
            totalOffset = 0;
          }
        } else {
          counts[reactionType] = (counts[reactionType] || 0) + 1;
          userReaction = {
            id: "optimistic-id",
            reaction_type: reactionType,
            user: { id: "current-user-id" } as any,
          };
          totalOffset = 1;
        }

        queryClient.setQueryData<ReactionSummary>(queryKey, {
          counts,
          total_reactions: Math.max(0, previousReactions.total_reactions + totalOffset),
          user_reaction: userReaction,
        });
      }

      return { previousReactions };
    },

    onError: (err, reactionType, context) => {
      if (context?.previousReactions) {
        queryClient.setQueryData(queryKey, context.previousReactions);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
