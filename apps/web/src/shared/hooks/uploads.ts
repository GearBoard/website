import useSWRMutation from "swr/mutation";
import { client, unwrap } from "../libs/api-client";

export function useUploadImage() {
  return useSWRMutation("upload-image", async (_key: string, { arg }: { arg: File }) => {
    return unwrap(
      client.api.uploads.image.$post({
        form: { file: arg },
      })
    );
  });
}
