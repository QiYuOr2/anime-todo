<template>
  <view
    :class="['button', `button--${type}`, { [`button--${type}--plain`]: plain }, `${customClass}`]"
    @click.stop="clickHanlder"
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
  plain: { type: Boolean, default: false },
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
  padding: 9rpx 15rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  box-shadow: 4rpx 4rpx 10rpx 1rpx rgba(49, 154, 100, 0.25);
}

.button--primary {
  background: var(--primary-color);
  color: var(--white-text-color);
  border: 2rpx solid var(--primary-color);
}

.button--primary--plain {
  background: #fff;
  color: var(--primary-text-color);
  border: 2rpx solid var(--primary-color);
}
</style>
