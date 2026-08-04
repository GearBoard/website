import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import useSWRMutation from "swr/mutation";
import { client, unwrap } from "../libs/api-client";

export function useGetPostById(id: string) {
  return useSWR(["post", id], () => unwrap(client.api.posts[":id"].$get({ param: { id } })));
}

export function useGetPostList(query?: {
  page?: string;
  limit?: string;
  search?: string;
  tag?: string;
  userId?: string;
}) {
  return useSWR(["posts", query], () => unwrap(client.api.posts.$get({ query: query ?? {} })));
}

export function useGetInfinitePostList(limit = 10, search?: string) {
  return useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && pageIndex >= previousPageData.totalPages) return null;
      return [
        "posts",
        { page: String(pageIndex + 1), limit: String(limit), ...(search ? { search } : {}) },
      ] as const;
    },
    ([, query]) => unwrap(client.api.posts.$get({ query })),
    { revalidateFirstPage: false }
  );
}

export function useGetPostComments(postId: string) {
  return useSWR(["post-comments", postId], () =>
    unwrap(client.api.posts[":postId"].comments.$get({ param: { postId } }))
  );
}

export function useCreatePost() {
  return useSWRMutation(
    "posts",
    (
      _key: string,
      { arg }: { arg: { title: string; description: string; tagIds?: string[]; images?: string[] } }
    ) => unwrap(client.api.posts.$post({ json: arg }))
  );
}

export function useUpdatePost(id: string) {
  return useSWRMutation(
    ["post", id],
    (
      _key: unknown,
      {
        arg,
      }: { arg: { title?: string; description?: string; tags?: string[]; isClosed?: boolean } }
    ) => unwrap(client.api.posts[":id"].$patch({ param: { id }, json: arg }))
  );
}

export function useDeletePost(id: string) {
  return useSWRMutation(["post", id], () =>
    unwrap(client.api.posts[":id"].$delete({ param: { id } }))
  );
}

export function useCreateComment(postId: string) {
  return useSWRMutation(
    ["post-comments", postId],
    (_key: unknown, { arg }: { arg: { content: string; images?: string } }) =>
      unwrap(client.api.posts[":postId"].comment.$post({ param: { postId }, json: arg }))
  );
}
