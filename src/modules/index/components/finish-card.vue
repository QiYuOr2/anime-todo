<template>
  <view class="finish-card">
    <text class="content">
      {{ title }}
    </text>
  </view>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
});
</script>

<style scoped>
.finish-card {
  padding: 20rpx 30rpx;
  border-radius: 36rpx;
  box-shadow: 0 0rpx 32rpx 5rpx rgba(0, 0, 0, 0.06);
  font-size: 24rpx;
}

.content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
