<template>
  <view
    :class="['button', `button--${type}`, `${customClass}`]"
    @click="clickHanlder"
  >
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: 'primary',
  },
  customClass: String,
});

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
  border-radius: 20rpx;
  font-size: 24rpx;
  box-shadow: 4rpx 4rpx 10rpx 1rpx rgba(49, 154, 100, 0.25);
}

.button--primary {
  background: var(--primary-color);
  color: var(--white-text-color);
}
</style>
