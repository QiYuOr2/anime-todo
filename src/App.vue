<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { Local } from './modules/common/local';

wx.cloud.init();

onLaunch(() => {
  console.log('App Launch');
  Local.create(uni.getFileSystemManager);
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>
<style>
@import './modules/common/styles/theme.css';
</style>
