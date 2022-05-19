<template>
  <view v-if="selfVisible" class="mask">
    <view class="modal" :style="props.width ? `width: ${width}` : ''">
      <text
        class="iconfont icon-close close"
        @click="selfVisible = false"
      ></text>
      <view class="title">{{ title }}</view>
      <view class="content">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  visible: { type: Boolean, required: true },
  title: String,
  width: String,
});

const emit = defineEmits<{
  (event: 'update:visible', value: boolean): void;
}>();

const selfVisible = computed({
  get() {
    return props.visible;
  },
  set(val: boolean) {
    emit('update:visible', val);
  },
});
</script>

<style scoped>
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);

  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  position: relative;
  box-sizing: border-box;
  width: 520rpx;
  min-height: 100rpx;
  padding: 1rem;
  background: #fff;
  border-radius: 20rpx;
}

.close {
  position: absolute;
  right: 0;
  top: 0;
  padding: 30rpx;
}

.title {
  width: 100%;
  text-align: center;
  font-weight: bold;
}
</style>
