<template>
  <view class="settings-card">
    <view class="title">{{ title }}</view>
    <view class="content">
      <view class="content__header"></view>
      <view class="content__main">
        <slot></slot>
      </view>
      <view class="content__footer"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
defineProps({
  title: String,
});
</script>

<style scoped>
.settings-card {
  padding: 1rem;
  padding-bottom: 0;
}

.settings-card .title {
  color: var(--gray-text-color);
  margin-left: 14rpx;
  margin-bottom: 20rpx;
}

.settings-card .content {
  border-radius: 24rpx;
  box-shadow: 0 0rpx 32rpx 5rpx rgba(0, 0, 0, 0.06);
}

.settings-card .content__header {
  height: 14rpx;
  border-radius: 24rpx 24rpx 0 0;
}

.settings-card .content__footer {
  height: 14rpx;
  border-radius: 0 0 24rpx 24rpx;
}
</style>
