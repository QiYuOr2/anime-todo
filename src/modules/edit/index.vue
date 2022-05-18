<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onReachBottom } from '@dcloudio/uni-app';

import { watchDebounced } from '@vueuse/core';

import { calendar, search } from '../common/api';

import AnimeCard from './components/anime-card.vue';
import Modal from '../common/components/modal.vue';

const detailModalVisible = ref(true);

const keyword = ref('');

const list = ref<any>([]);
const getCalendar = async () => {
  uni.showLoading({ title: '加载中' });
  const { data } = await calendar();
  list.value = data[new Date().getDay() - 1].items;
  uni.hideLoading();
};

const isBottom = ref(false);

const searchAnime = async (start?: number) => {
  !start && (list.value = []);

  uni.showLoading({ title: '加载中' });
  const { data } = await search(keyword.value, start);
  list.value = [...list.value, ...data.list];
  isBottom.value = list.value.length === data.results;
  uni.hideLoading();
};

const currentAnime = ref<Record<string, string>>({});

watchDebounced(
  keyword,
  () => {
    searchAnime();
  },
  { debounce: 500, maxWait: 1000 }
);

onReachBottom(() => {
  keyword.value && !isBottom.value && searchAnime(list.value.length);
});

onMounted(() => {
  getCalendar();
});
</script>

<template>
  <view class="search">
    <input v-model="keyword" placeholder="搜索番剧" />
  </view>
  <view>
    <view class="title">
      <view>{{ keyword ? '搜索结果' : '今日放送' }}</view>
      <view class="sub">数据来自bangumi</view>
    </view>
    <view class="calendar">
      <view class="calendar-item" v-for="(item, i) in list" :key="i">
        <anime-card :anime="item" />
      </view>
    </view>
    <view class="is-bottom">到底了</view>
  </view>
  <modal v-model:visible="detailModalVisible" title="详情">
    <view>
      <view>
        <image :src="currentAnime.thumb" />
      </view>
      <view>
        <view>{{ currentAnime.title }}</view>
        <view>{{ currentAnime.desc }}</view>
        <view>{{ currentAnime.time }}</view>
      </view>
    </view>
  </modal>
</template>

<style scoped>
.search {
  padding: 10rpx 14rpx;
}

.search input {
  padding: 10rpx 32rpx;
  margin: 14rpx 0 20rpx;
  border-radius: 100rpx;
  background: var(--gray-bg-color);

  font-size: 30rpx;
}
.title {
  padding: 0 32rpx 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.title .sub {
  font-size: 20rpx;
  color: var(--gray2-text-color);
  padding-left: 20rpx;
}
.calendar {
  padding: 0 32rpx 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 28rpx;
}
.is-bottom {
  font-size: 34rpx;
  color: var(--gray-text-color);
  padding: 10rpx 0;
  text-align: center;
}
</style>
