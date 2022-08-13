<script setup lang="ts">
defineProps({
  title: String,
});
</script>

<template>
  <view class="section">
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

<style lang="scss" scoped>
.section {
  padding: 1rem;
  padding-bottom: 0;

  .title {
    color: var(--gray-text-color);
    margin-left: 14rpx;
    margin-bottom: 20rpx;
  }

  .content {
    border-radius: 24rpx;
    box-shadow: 0 0rpx 32rpx 5rpx rgba(0, 0, 0, 0.06);

    &__header {
      height: 14rpx;
      border-radius: 24rpx 24rpx 0 0;
    }

    &__footer {
      height: 14rpx;
      border-radius: 0 0 24rpx 24rpx;
    }
  }
}
</style>
