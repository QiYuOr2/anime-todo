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
              <finish-card :title="fItem.title" />
            </view>
          </block>
        </view>
        <view class="right">
          <block v-for="(fItem, i) in finishList" :key="i">
            <view class="item" v-if="i % 2 !== 0">
              <finish-card :title="fItem.title" />
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
        >
          {{ i }}
        </x-button>
      </view>
    </modal>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DoingCard from './components/doing-card.vue';
import Modal from '../common/components/modal.vue';
import XButton from '../common/components/button.vue';
import TabBar from './components/tab-bar.vue';
import XIcon from '../common/components/icon.vue';
import FinishCard from './components/finish-card.vue';
import { Local } from '../common/local';
import { onShow } from '@dcloudio/uni-app';

type Anime = {
  title: string;
  img: string;
  time: string;
  total: number;
  cur: number;
  tags: string[];
};

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

const addMore = (
  values: { cur: string | number; total: string | number },
  index: number
) => {
  currentEditIndex.value = index;
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
</style>
