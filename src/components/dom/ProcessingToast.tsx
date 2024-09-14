import { processingWorkerAtom } from "@state";
import { useAtom } from "jotai";

export function ProcessingToast() {
  const [processing] = useAtom(processingWorkerAtom);

  return (
    processing > 0 && (
      <div className="processing">
        <div>Calculating Van der Waals cloud...</div>
        <progress value={processing} max="100" style={{ width: "100%" }} />
      </div>
    )
  );
}
