<template>
  <view class="doing-card" @click="clickDetailHandler">
    <image v-if="info.img" class="thumb" :src="info.img" mode="aspectFill" />
    <view v-else class="thumb thumb--empty">
      <x-icon name="picture" :size="40" />
    </view>
    <view class="info">
      <view class="title">{{ info.title }}</view>
      <view class="status">
        <text>第 {{ info.cur }}/{{ info.total }} 话</text>
        <text class="divider">|</text>
        <text v-if="info.time">{{ info.time }} 更新</text>
        <text v-else>已完结</text>
      </view>
      <view class="tags">
        <tag v-for="(t, i) in info.tags" :key="i" random>{{ t }}</tag>
      </view>
      <view v-if="!hideActions" class="footer">
        <x-button @click="clickOneHandler">看一话</x-button>
        <x-button @click="clickMoreHandler">选择</x-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Tag from '../../common/components/tag.vue';
import XButton from '../../common/components/button.vue';
import { PropType } from 'vue';
import { Anime } from '../../common/types';
import XIcon from '../../common/components/icon.vue';

const props = defineProps({
  info: { type: Object as PropType<Anime>, required: true },
  hideActions: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (event: 'single'): void;
  (event: 'more', value: { cur: number | string; total: number | string }): void;
  (event: 'detail', value: Anime): void;
}>();

const clickOneHandler = () => {
  emit('single');
};
const clickMoreHandler = () => {
  emit('more', { cur: props.info.cur, total: props.info.total });
};
const clickDetailHandler = () => {
  emit('detail', props.info);
};
</script>

<style scoped>
.divider {
  display: inline-block;
  margin: 0 10rpx;
}
.doing-card {
  box-sizing: border-box;
  display: flex;

  height: 240rpx;
  padding: 20rpx;
  border-radius: 36rpx;
  box-shadow: 0 0rpx 32rpx 5rpx rgba(0, 0, 0, 0.06);
}
.thumb {
  width: 140rpx;
  height: 200rpx;
  margin-right: 24rpx;
  background: #f1f1f1;
  border-radius: 24rpx;
}
.thumb--empty {
  display: flex;
  align-items: center;
  justify-content: center;
}
.info {
  flex: 1;

  display: flex;
  flex-direction: column;
}
.info .title {
  color: var(--primary-text-color);
}

.info .status {
  margin: 10rpx 0;

  color: var(--gray-text-color);
  font-size: 24rpx;
}

.info .tags > tag {
  margin-right: 10rpx;
}
.info .tags > tag:last-child {
  margin-right: 0;
}

.info .footer {
  margin-top: auto;
  text-align: right;
}
.info .footer > x-button {
  margin-right: 18rpx;
}
.info .footer > x-button:last-child {
  margin-right: 0;
}
</style>
