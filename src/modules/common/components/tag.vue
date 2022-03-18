<template>
  <view :class="['tag', `tag--${color}`]">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
defineProps({
  color: { type: String, default: 'green' },
});
</script>

<style scoped>
.tag {
  vertical-align: top;
  display: inline-block;
  padding: 6rpx 14rpx;
  border-radius: 100px;
  font-size: 20rpx;
}

.tag--green {
  color: var(--primary-color);
  background: var(--primary-bg-color);
}
</style>
