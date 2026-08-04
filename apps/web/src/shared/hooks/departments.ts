import useSWR from "swr";
import { client, unwrap } from "@/shared/libs/api-client";

export function useGetDepartments() {
  return useSWR("departments", () => unwrap(client.api.departments.$get()));
}
