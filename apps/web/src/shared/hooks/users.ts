import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { client, unwrap } from "../libs/api-client";

export function useGetMe(enabled = true) {
  return useSWR(enabled ? "me" : null, () => unwrap(client.api.users.me.$get()));
}

export function useGetUserList(query?: {
  page?: string;
  limit?: string;
  search?: string;
  role?: "USER" | "ADMIN";
  departmentId?: string;
}) {
  return useSWR(["users", query], () => unwrap(client.api.users.$get({ query: query ?? {} })));
}

export function useGetUserById(id: string) {
  return useSWR(["user", id], () => unwrap(client.api.users[":id"].$get({ param: { id } })));
}

export function useUpdateUser(id?: string) {
  return useSWRMutation(
    id ? ["user", id] : null,
    (
      _key: unknown,
      {
        arg,
      }: {
        arg: {
          name?: string;
          image?: string;
          description?: string;
          departmentId?: string | null;
        };
      }
    ) => {
      if (!id) {
        throw new Error("User ID is required");
      }

      return unwrap(client.api.users[":id"].$patch({ param: { id }, json: arg }));
    }
  );
}

export function useDeleteUser(id: string) {
  return useSWRMutation(["user", id], () =>
    unwrap(client.api.users[":id"].$delete({ param: { id } }))
  );
}
