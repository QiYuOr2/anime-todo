<template>
  <view
    :class="['button', `button--${type}`, { [`button--${type}--plain`]: plain, [`button--block`]: block }, `${customClass}`]"
    @click.stop="clickHanlder"
  >
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
defineProps({
  type: {
    type: String,
    default: "primary",
  },
  customClass: String,
  plain: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (event: "click", $event: Event): void;
}>();

const clickHanlder = (event: Event) => {
  uni.vibrateShort({});
  emit("click", event);
};
</script>

<style scoped lang="scss">
.button {
  vertical-align: top;
  display: inline-block;
  padding: 9rpx 15rpx;
  border-radius: 16rpx;
  font-size: 24rpx;
  /* box-shadow: 4rpx 4rpx 10rpx 1rpx rgba(49, 154, 100, 0.25); */

  &--primary {
    background: var(--primary-color);
    color: var(--white-text-color);
    border: 2rpx solid var(--primary-color);
  }

  &--primary--plain {
    background: #fff;
    color: var(--primary-text-color);
    border: 2rpx solid var(--primary-color);
  }

  &--other {
    --other-padding-x: 10rpx;
    padding-left: var(--other-padding-x);
    padding-right: var(--other-padding-x);
    background: #fff;
    color: var(--gray-text-color);
    border: 2rpx solid #fff;
  }

  &--block {
    display: block;
    text-align: center;
    padding: 15rpx;
  }
}
</style>
