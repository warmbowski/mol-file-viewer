import { useMutation, useQueryClient } from "@tanstack/react-query";
import { readMolFile } from "@utils";

export function useUploadMolecule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const molFile = await file.text();
      return readMolFile(molFile);
    },
    onSuccess: (molecule) => {
      queryClient.setQueryData(["molecule", "name", "custom"], molecule);
    },
  });
}
