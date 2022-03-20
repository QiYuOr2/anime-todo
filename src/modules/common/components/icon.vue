<template>
  <text
    :class="`iconfont icon-${name}`"
    :style="`color: ${color}; font-size: ${size}rpx`"
  ></text>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';

defineProps({
  name: { type: String, required: true },
  color: { type: String, default: 'var(--primary-text-color)' },
  size: { type: Number, default: 32 },
});

onLoad(() => {
  console.log('icon load');
});
</script>
