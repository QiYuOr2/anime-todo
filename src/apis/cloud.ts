import { UID } from "@/constants/storage";

async function cloud(url: CloudAPI, data: Record<string, any>) {
  const [scope, event] = url.split("/");

  const { result } = await uniCloud.callFunction({
    name: scope,
    data: {
      eventName: event,
      ...data,
    },
  });

  return result;
}

export async function login(code: string): Promise<{ id: string }> {
  const result = await cloud("user/login", { code });

  if (result.data.id) {
    uni.setStorageSync(UID, result.data.id);
  }

  return result;
}

export function getUserSyncStatus(id: string) {
  return cloud("user/getUserSyncStatus", { id });
}

export function setUserSyncStatus(id: string, synced: boolean) {
  return cloud("user/setUserSyncStatus", { id, synced });
}
