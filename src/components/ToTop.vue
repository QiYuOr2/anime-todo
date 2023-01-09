<script setup lang="ts">
import XIcon from "@/components/Icon.vue";

const toTop = () => {
  console.log("to top");

  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300,
  });
};
</script>

<template>
  <view class="to-top" @click.prevent="toTop">
    <x-icon class="top-icon" name="arrow-right" color="var(--gray-text-color)" />
  </view>
</template>

<style lang="scss" scoped>
.to-top {
  position: fixed;
  bottom: 160rpx;
  right: 30rpx;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 60rpx;
  height: 60rpx;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0rpx 8rpx 2rpx rgba(0, 0, 0, 0.06);

  .top-icon {
    transform: rotateZ(270deg);
  }
}
</style>
