import useSWR from "swr";
import { client, unwrap } from "@/shared/libs/api-client";

export type TagOption = {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
};

export function useGetTags() {
  return useSWR<TagOption[]>("tags", () => unwrap(client.api.tags.$get()));
}
