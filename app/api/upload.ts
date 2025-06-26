import axios from "axios";
import { useMutation } from "@tanstack/react-query";

export const useUploadAssetsToS3 = () => {
  const { ...res } = useMutation({
    mutationKey: ["uploadAssetsToS3"],
    mutationFn: async (body: FormData) => {
      return await axios.post("https://prod.zocket.com//engine/ads/api/v1/upload_template_S3", body);
    },
  });

  return {
    ...res,
  };
};
