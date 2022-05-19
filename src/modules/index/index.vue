<template>
  <view class="index">
    <view class="index__header">
      <tab-bar v-model:current="currentTab" :tabs="tabs" />
      <view class="plus-icon" @click="toAdd">
        <x-icon name="add-circle" :size="36" />
      </view>
    </view>

    <view v-if="currentTab === 0">
      <view v-if="list.length === 0" class="empty">还没有正在看的番剧哦~</view>
      <view class="item" v-for="(item, i) in list" :key="i">
        <doing-card
          :info="item"
          @single="addOne(i)"
          @more="addMore($event, i)"
          @detail="showDetail(item)"
        />
      </view>
    </view>
    <view v-if="currentTab === 1" class="list--finish">
      <view v-if="finishList.length === 0" class="empty">
        还没有已经看完的番剧哦~
      </view>
      <block v-else>
        <view class="left">
          <block v-for="(fItem, i) in finishList" :key="i">
            <view class="item" v-if="i % 2 === 0">
              <finish-card :info="fItem" @detail="showDetail(fItem)" />
            </view>
          </block>
        </view>
        <view class="right">
          <block v-for="(fItem, i) in finishList" :key="i">
            <view class="item" v-if="i % 2 !== 0">
              <finish-card :info="fItem" @detail="showDetail(fItem)" />
            </view>
          </block>
        </view>
      </block>
    </view>

    <modal v-model:visible="addModealVisible" title="选择集数">
      <view class="modal-content">
        <x-button
          custom-class="select-button"
          v-for="i in totalNum"
          :key="i"
          @click="selectNumHandler(i)"
          :plain="currentEditCur < i"
        >
          {{ i }}
        </x-button>
      </view>
    </modal>

    <modal v-model:visible="detailModalVisible" title="详情" width="600rpx">
      <view class="wrapper">
        <view class="detail">
          <view>
            <image
              v-if="currentAnime.img"
              class="thumb"
              :src="currentAnime.img"
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
      </view>
    </modal>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import { Local } from '../common/local';

import DoingCard from './components/doing-card.vue';
import Modal from '../common/components/modal.vue';
import XButton from '../common/components/button.vue';
import TabBar from './components/tab-bar.vue';
import XIcon from '../common/components/icon.vue';
import FinishCard from './components/finish-card.vue';
import { Anime } from '../common/types';

const list = ref<Anime[]>([]);

const finishList = ref<Anime[]>([]);

const writeToLocal = () => {
  Local.create().write(
    JSON.stringify({
      list: list.value,
      finishList: finishList.value,
    })
  );
};

onShow(() => {
  const fs = Local.create();
  const [err, data] = fs.read();
  if (err) {
    // uni.showToast({ icon: 'none', title: '数据读取错误' });
    return;
  }
  const dataStr = JSON.parse(data);
  list.value = dataStr.list;
  finishList.value = dataStr.finishList;
});

const currentTab = ref(0);
const tabs = ['观看中', '已看完'];
const toAdd = () => {
  uni.navigateTo({ url: '/modules/edit/index' });
};

//#region 修改已看级数
const addOne = (index: number) => {
  const source = list.value;

  source[index].cur = source[index].cur + 1;
  const cur = source[index].cur;

  if (cur === source[index].total) {
    const currentItem = source[index];

    uni.showToast({ title: '看完这部番啦！', icon: 'none' });

    list.value = source.filter((_, i) => i !== index);
    finishList.value = [...finishList.value, currentItem];

    writeToLocal();
    return;
  }
  list.value = source;
  writeToLocal();
};

const addModealVisible = ref(false);
const totalNum = ref(0);
const currentEditIndex = ref(0);
const currentEditCur = ref(0);

const addMore = (
  values: { cur: string | number; total: string | number },
  index: number
) => {
  currentEditIndex.value = index;
  currentEditCur.value = Number(values.cur);
  totalNum.value = Number(values.total);
  addModealVisible.value = true;
};
const selectNumHandler = (num: number) => {
  addModealVisible.value = false;

  const source = list.value;
  source[currentEditIndex.value].cur = num;

  const cur = source[currentEditIndex.value].cur;

  if (cur === source[currentEditIndex.value].total) {
    const currentItem = source[currentEditIndex.value];

    uni.showToast({ title: '看完这部番啦！', icon: 'none' });

    list.value = source.filter((_, i) => i !== currentEditIndex.value);
    finishList.value = [...finishList.value, currentItem];

    writeToLocal();
    return;
  }
  list.value = source;
  writeToLocal();
};

//#endregion

const detailModalVisible = ref(false);
const currentAnime = ref<Record<string, any>>({});
const showDetail = (detail: Anime) => {
  console.log(detail);
  detailModalVisible.value = true;
  currentAnime.value = detail;
};
</script>

<style>
.select-button {
  min-width: 50rpx;
  margin: 10rpx;
  text-align: center;
}
</style>

<style scoped>
.index {
  padding: 1rem;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500rpx;
  width: 100%;
  color: var(--gray-text-color);
}

.index__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-bottom: 30rpx;
  padding-right: 20rpx;
}

.index__header .plus-icon {
  padding: 10rpx;
}

.list--finish {
  display: flex;
}

.left,
.right {
  flex: 1;
}

.left {
  margin-right: 30rpx;
}

.index .item {
  margin-bottom: 1rem;
}

.modal-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  max-height: 600rpx;
  margin-top: 20rpx;
  overflow-y: auto;
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
