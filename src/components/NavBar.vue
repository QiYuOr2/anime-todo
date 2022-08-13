<script lang="ts" setup>
import { Path } from "@/constants/path";
import { computed } from "vue";
import XIcon from "./Icon.vue";

const statusBarHeight = computed(() => `${uni.getSystemInfoSync().statusBarHeight}px`);
const back = () =>
  uni.navigateBack({
    fail() {
      uni.switchTab({ url: Path.List });
    },
  });
</script>

<template>
  <view class="nav-bar">
    <view class="back" @click="back">
      <x-icon name="arrow-right" :size="46" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  display: flex;
  align-items: center;

  height: 80rpx;
  margin-top: v-bind(statusBarHeight);
}
.back {
  display: inline-block;
  transform: rotateY(180deg);
  margin-left: 20rpx;
  padding: 0 14rpx;
  cursor: pointer;
}
</style>
