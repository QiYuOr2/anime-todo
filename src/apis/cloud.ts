import { UID } from "@/constants/storage";

async function cloud<T = any>(url: CloudAPI, data: Record<string, any>): Promise<CloudResponse<T>> {
  const [scope, event] = url.split("/");

  const { result } = await uniCloud.callFunction({
    name: scope,
    data: {
      eventName: event,
      uid: uni.getStorageSync(UID),
      ...data,
    },
  });

  return result;
}

export const user = {
  async login(code: string) {
    const result = await cloud<{ id: string }>("user/login", { code });

    if (result.data.id) {
      uni.setStorageSync(UID, result.data.id);
    }

    return result;
  },
  getUserSyncStatus(id: string) {
    return cloud("user/getUserSyncStatus", { id });
  },
  setUserSyncStatus(id: string, synced: boolean) {
    return cloud("user/setUserSyncStatus", { id, synced });
  },
};

export const record = {
  getOne(id: number) {
    return cloud("record/getOne", { id });
  },
  getList({ type, openid }: { openid?: string; type: "all" | "doing" | "done" } = { type: "all" }) {
    return cloud("record/getList", { openid, type });
  },
  add(anime: Anime) {
    return cloud("record/addRecord", { record: anime });
  },
  remove(id: number) {
    return cloud("record/removeRecord", { id });
  },
  modify(id: number, anime: Anime) {
    return cloud("record/modifyRecord", { id, record: anime });
  },
  modifyProgress(id: number, progress: number, type: "add" | "modify" = "add") {
    return cloud("record/modifyProgress", { id, progress, type });
  },
  moveToTop(id: number) {
    return cloud("record/moveToTop", { id });
  },
};
