<template>
  <view :class="['tag', `tag--${selfColor}`]">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { random } from '../utils';

const colorEnum = ['green', 'blue', 'pink'];

const props = defineProps({
  color: { type: String, default: 'green' },
  random: { type: Boolean, default: false },
});

const selfColor = computed(() => {
  if (!props.random) {
    return props.color;
  }
  const r = random(0, 2);
  return colorEnum[r];
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

.tag--blue {
  color: var(--blue-text-color);
  background: var(--blue-color);
}

.tag--pink {
  color: var(--pink-text-color);
  background: var(--pink-color);
}
</style>
