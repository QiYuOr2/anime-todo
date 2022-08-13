<script setup lang="ts">
import { computed, PropType } from "vue";

const props = defineProps({
  current: { type: Number, required: true },
  tabs: Array as PropType<string[]>,
});

const emit = defineEmits<{
  (event: "update:current", value: number): void;
}>();

const selfCurrent = computed({
  get() {
    return props.current;
  },
  set(val: number) {
    emit("update:current", val);
  },
});

const clickHander = (index: number) => {
  selfCurrent.value = index;
};
</script>

<template>
  <view class="tab-bar">
    <view v-for="(tab, i) in tabs" :key="i" :class="['tab', { active: selfCurrent === i }]" @click="clickHander(i)">
      {{ tab }}
    </view>
  </view>
</template>

<style lang="scss" scoped>
.tab-bar {
  display: flex;
  align-items: center;

  .tab {
    padding: 10rpx 20rpx;
    font-size: 28rpx;
    margin-right: 20rpx;
    font-weight: bold;
    color: var(--primary-dark2-color);
  }

  .tab.active {
    background: var(--primary-bg-color);
    color: var(--primary-dark-color);
    border-radius: 10rpx;
  }
}
</style>
