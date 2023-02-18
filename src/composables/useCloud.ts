import { record } from "@/apis/cloud";

export function useCloud() {
  /**
   * 云端 -> 本地
   */
  const download = async () => {
    const {} = await record.getList({ type: "all" });
  };

  /**
   * 本地 -> 云端
   */
  const upload = () => {};

  return { download, upload };
}
