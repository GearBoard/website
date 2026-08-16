import useSWRMutation from "swr/mutation";
import { client, unwrap } from "../libs/api-client";

export function useCreateReply(commentId: string) {
  return useSWRMutation(
    ["comment-replies", commentId],
    (_key: unknown, { arg }: { arg: { content: string; images?: string } }) =>
      unwrap(client.api.comments[":commentId"].replies.$post({ param: { commentId }, json: arg }))
  );
}

export function useDeleteComment(commentId: string) {
  return useSWRMutation(["comment", commentId], () =>
    unwrap(client.api.comments[":commentId"].$delete({ param: { commentId } }))
  );
}

export function useLikeComment(commentId: string) {
  return useSWRMutation(["comment-like", commentId], () =>
    unwrap(client.api.comments[":commentId"].like.$post({ param: { commentId } }))
  );
}

export function useUnlikeComment(commentId: string) {
  return useSWRMutation(["comment-like", commentId], () =>
    unwrap(client.api.comments[":commentId"].like.$delete({ param: { commentId } }))
  );
}
