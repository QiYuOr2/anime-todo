import { UID } from "@/constants/storage";

export async function login(code: string): Promise<{ id: string }> {
  const { result } = await uniCloud.callFunction({
    name: "user",
    data: {
      eventName: "login",
      code,
    },
  });

  if (result.id) {
    uni.setStorageSync(UID, result.id);
  }

  return result;
}
