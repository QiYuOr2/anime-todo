<script setup lang="ts">
import { onMounted, ref } from "vue";
import { onReachBottom } from "@dcloudio/uni-app";

import { useToggle, watchDebounced } from "@vueuse/core";

import { calendar, search } from "@/apis/bangumi";

import PreviewCard from "./components/PreviewCard.vue";

import { Path } from "@/constants/path";
import { setQueryString } from "@/utils";

const keyword = ref("");

const list = ref<AnimeDTO[]>([]);
const getCalendar = async () => {
  uni.showLoading({ title: "加载中" });
  const data = await calendar();
  const day = new Date().getDay();
  list.value = data[day === 0 ? 6 : day - 1].items;
  uni.hideLoading();
};

const isBottom = ref(false);

const searchAnime = async (start?: number) => {
  !start && (list.value = []);

  uni.showLoading({ title: "加载中" });
  try {
    const data = await search(keyword.value, start);
    list.value = [...list.value, ...data.list];
    isBottom.value = list.value.length === data.results;
  } catch (error) {
  } finally {
    uni.hideLoading();
  }
};

watchDebounced(
  keyword,
  () => {
    keyword.value ? searchAnime() : getCalendar();
  },
  { debounce: 800, maxWait: 1000 }
);

onReachBottom(() => {
  keyword.value && !isBottom.value && searchAnime(list.value.length);
});

onMounted(() => {
  getCalendar();
});

const [isFocus, toggleIsFocus] = useToggle(false);

const toDetail = (id: number) =>
  uni.navigateTo({
    url: setQueryString(Path.Detail, { id, willAdd: true }),
  });
</script>

<template>
  <view class="search" @click="toggleIsFocus(true)">
    <input
      type="text"
      class="text-center"
      v-model="keyword"
      placeholder="搜索番剧"
      confirm-type="search"
      :focus="isFocus"
      @blur="toggleIsFocus(false)"
    />
  </view>
  <view class="list">
    <view class="title">
      <view>{{ keyword ? "搜索结果" : "今日放送" }}</view>
      <view class="sub">数据来自bangumi</view>
    </view>
    <view class="calendar">
      <view class="calendar-item" v-for="(item, i) in list" :key="i" @click="toDetail(item.id)">
        <preview-card :anime="item" />
      </view>
    </view>
    <view class="is-bottom">{{ list.length === 0 ? "暂无数据" : "到底了" }}</view>
  </view>
</template>

<style>
.add-to-btn {
  box-sizing: border-box;
  width: 100%;
  text-align: center;
}
</style>

<style scoped lang="scss">
.search {
  padding: 10rpx 14rpx;

  input {
    padding: 14rpx 32rpx;
    margin: 14rpx 0 20rpx;
    border-radius: 100rpx;
    background: var(--gray-bg-color);

    font-size: 30rpx;
  }
}

.title {
  padding: 0 32rpx 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .sub {
    font-size: 20rpx;
    color: var(--gray2-text-color);
    padding-left: 20rpx;
  }
}
.list {
  height: calc(100vh - 60rpx - 60rpx);
  overflow: auto;
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
  margin-bottom: 10px;
  text-align: center;

  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.detail {
  padding: 20rpx 0 0;
  display: flex;
  color: var(--primary-text-color);

  & .thumb {
    width: 170rpx;
    border-radius: 14rpx;
    margin-right: 20rpx;
  }

  & .thumb--empty {
    width: 170rpx;
    height: 300rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f1f1;
  }

  & .time {
    font-size: 26rpx;
    color: var(--gray-text-color);
  }
  & .start {
    padding: 8rpx 0;
    font-size: 26rpx;
  }
}
.desc {
  padding: 10rpx 0;
}

.text-center {
  text-align: center;
}
</style>
