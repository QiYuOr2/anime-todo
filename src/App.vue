<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { user } from "./apis/cloud";
import { SYNC_STATUS, UID } from "./constants/storage";
import { Local } from "./utils/local";

onLaunch(async () => {
  console.log("App Launch");
  Local.create(uni.getFileSystemManager);

  // check Sync Config
  const uid = uni.getStorageSync(UID);

  const result = await user.getUserSyncStatus(uid);
  if (typeof result.data.synced !== "undefined") {
    uni.setStorageSync(SYNC_STATUS, result.data.synced);
  }
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
@import "./styles/theme.css";

.fixed-page {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;
}
</style>
