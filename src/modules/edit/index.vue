<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onReachBottom } from '@dcloudio/uni-app';

import { watchDebounced } from '@vueuse/core';

import { calendar, search, getInfo } from '../common/api';

import AnimeCard from './components/anime-card.vue';
import Modal from '../common/components/modal.vue';
import XButton from '../common/components/button.vue';
import { Local } from '../common/local';

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

//#region 详情弹框
const detailModalVisible = ref(false);
const currentAnime = ref<Record<string, string | boolean | null>>({});
const setCurrentAnime = async (anime: any) => {
  detailModalVisible.value = true;
  uni.showLoading({ title: '加载中' });
  const { data } = await getInfo(anime.id, anime);
  currentAnime.value = data;
  uni.hideLoading();
};
//#endregion

const addToList = () => {
  const fs = Local.create();
  const [, dataStr] = fs.read();
  const data = JSON.parse(dataStr);
  data.list.every((item: any) => item.title !== currentAnime.value.title) &&
    data.list.push({
      ...currentAnime.value,
      cur: 0,
      total: Number(currentAnime.value.total),
      img: currentAnime.value.thumb,
    });
  console.log(data);
  fs.write(JSON.stringify(data));
  uni.switchTab({ url: '/modules/index/index' });
};

watchDebounced(
  keyword,
  () => {
    searchAnime();
  },
  { debounce: 800, maxWait: 1000 }
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
      <view
        class="calendar-item"
        v-for="(item, i) in list"
        :key="i"
        @click="setCurrentAnime(item)"
      >
        <anime-card :anime="item" />
      </view>
    </view>
    <view class="is-bottom">到底了</view>
  </view>
  <modal v-model:visible="detailModalVisible" title="详情" width="600rpx">
    <view class="wrapper">
      <view class="detail">
        <view>
          <image
            v-if="currentAnime.thumb"
            class="thumb"
            :src="currentAnime.thumb"
            mode="widthFix"
          />
          <view v-else class="thumb thumb--empty">
            <x-icon name="picture" :size="40" />
          </view>
        </view>
        <view class="info">
          <view>{{ currentAnime.title }}</view>
          <view class="start">{{ currentAnime.start }}开始放送</view>
          <view class="time">
            <text v-if="currentAnime.total">
              共 {{ currentAnime.total }} 话
            </text>
            <text v-if="currentAnime.time">
              {{ currentAnime.time }}
            </text>
          </view>
        </view>
      </view>
      <view class="desc">{{ currentAnime.desc }}</view>
      <view>
        <x-button custom-class="add-to-btn" @click="addToList">
          添加至列表
        </x-button>
      </view>
    </view>
  </modal>
</template>

<style>
.add-to-btn {
  box-sizing: border-box;
  width: 100%;
  text-align: center;
}
</style>

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

.detail {
  padding: 20rpx 0 0;
  display: flex;
  color: var(--primary-text-color);
}

.detail .thumb {
  width: 170rpx;
  border-radius: 14rpx;
  margin-right: 20rpx;
}

.detail .thumb--empty {
  width: 170rpx;
  height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f1f1;
}

.detail .time {
  font-size: 26rpx;
  color: var(--gray-text-color);
}
.detail .start {
  padding: 8rpx 0;
  font-size: 26rpx;
}
.desc {
  padding: 10rpx 0;
}
</style>
