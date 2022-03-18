<template>
  <view class="button" @click="clickHanlder">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'click'): void;
}>();

const clickHanlder = () => {
  uni.vibrateShort({});
  emit('click');
};
</script>

<style scoped>
.button {
  vertical-align: top;
  display: inline-block;
  padding: 10rpx 16rpx;
  border-radius: 10rpx;
  background: #4e99ee;
  font-size: 24rpx;
}
</style>
