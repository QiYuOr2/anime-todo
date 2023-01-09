<template>
  <text :class="`iconfont icon-${name}`" :style="`color: ${color}; font-size: ${size}rpx`"></text>
</template>

<script setup lang="ts">
type IconName = "picture" | "close" | "arrow-right" | "add-circle" | "ashbin" | "modular";

withDefaults(
  defineProps<{
    name: IconName;
    color?: string;
    size?: number;
  }>(),
  {
    color: "var(--primary-text-color)",
    size: 32,
  }
);
</script>
