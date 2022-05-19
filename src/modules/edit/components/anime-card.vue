<template>
  <view class="anime-card">
    <view>
      <image
        v-if="anime?.images?.common"
        class="thumb"
        :src="anime?.images?.common"
        mode="aspectFill"
      />
      <view v-else class="thumb thumb--empty">
        <x-icon name="picture" :size="40" />
      </view>
    </view>
    <view class="title">
      {{ anime?.name_cn || anime?.name }}
    </view>
  </view>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import XIcon from '../../common/components/icon.vue';

type Anime = {
  images: Record<string, string>;
  name: string;
  name_cn: string;
};

const { anime } = defineProps({
  anime: {
    type: Object as PropType<Anime>,
  },
});
</script>

<style scoped>
.anime-card {
  /* box-sizing: border-box; */
  display: inline-flex;
  flex-direction: column;

  /* height: 240rpx; */
  padding: 20rpx;
  border-radius: 14rpx;
  box-shadow: 0 0rpx 32rpx 5rpx rgba(0, 0, 0, 0.06);
}

.anime-card .thumb {
  width: 280rpx;
  max-height: 396rpx;
  border-radius: 14rpx;
}

.anime-card .thumb--empty {
  width: 280rpx;
  height: 396rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f1f1;
}

.anime-card .title {
  margin-top: 10rpx;
  text-align: center;
  width: 280rpx;

  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
