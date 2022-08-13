<template>
  <text
    :class="`iconfont icon-${name}`"
    :style="`color: ${color}; font-size: ${size}rpx`"
  ></text>
</template>

<script setup lang="ts">
defineProps({
  name: { type: String, required: true },
  color: { type: String, default: 'var(--primary-text-color)' },
  size: { type: Number, default: 32 },
});
</script>
