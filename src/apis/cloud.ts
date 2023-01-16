import { UID } from "@/constants/storage";

export async function login(code: string): Promise<{ id: string }> {
  const { result } = await uniCloud.callFunction({
    name: "user",
    data: {
      eventName: "login",
      code,
    },
  });

  if (result.data.id) {
    uni.setStorageSync(UID, result.data.id);
  }

  return result;
}

export async function getUserSyncStatus(id: string) {
  const { result } = await uniCloud.callFunction({
    name: "user",
    data: {
      eventName: "getUserSyncStatus",
      id,
    },
  });

  return result;
}

export async function setUserSyncStatus(id: string, synced: boolean) {
  const { result } = await uniCloud.callFunction({
    name: "user",
    data: {
      eventName: "setUserSyncStatus",
      id,
      synced,
    },
  });

  return result;
}
