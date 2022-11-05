<script lang="ts" setup>
import { PropType, ref } from "vue";

interface MenuOptions {
  label: string;
  icon: string;
  click: () => void;
}

defineProps({
  value: {
    type: Boolean,
  },
  options: {
    type: [] as PropType<MenuOptions[]>,
  },
});

const emits = defineEmits<{
  (event: "update:value", value: boolean): void;
}>();

const menuPositionX = ref("0");
const menuPositionY = ref("0");

const close = () => emits("update:value", false);
</script>

<template>
  <view class="mask" @click="close"></view>
  <view class="menu" v-if="value">
    <view v-for="(item, i) in options" :key="i" class="menu-item" hover-class="menu-item--active" @click.stop="item.click">
      <x-icon :name="item.icon" :size="32" />
      <text class="menu-item__text">{{ item.label }}</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}
.menu {
  position: fixed;
  left: v-bind(menuPositionX);
  top: v-bind(menuPositionY);
  z-index: 1000;

  display: flex;
  justify-content: center;
  flex-direction: column;

  min-width: 200rpx;
  background: var(--menu-bg-color);
  border-radius: 24rpx;
  overflow: hidden;
  &-item {
    padding: 20rpx 40rpx 20rpx 30rpx;
    &:not(:last-child) {
      border-bottom: 2rpx solid var(--gray-divider-color);
    }

    &__text {
      margin-left: 20rpx;
    }

    &--active {
      background: var(--gray-bg-color);
    }
  }
}
</style>
