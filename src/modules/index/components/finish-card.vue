<template>
  <view class="finish-card" @click="clickDetailHandler">
    <text class="content">
      {{ info.title }}
    </text>
  </view>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Anime } from '../../common/types';

const props = defineProps({
  info: { type: Object as PropType<Anime>, required: true },
});

const emit = defineEmits<{
  (event: 'detail', value: Anime): void;
}>();

const clickDetailHandler = () => {
  emit('detail', props.info);
};
</script>

<style scoped>
.finish-card {
  padding: 20rpx 30rpx;
  border-radius: 36rpx;
  box-shadow: 0 0rpx 32rpx 5rpx rgba(0, 0, 0, 0.06);
  border: 2rpx solid var(--primary-color);
  font-size: 24rpx;
}

.content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
</style>
