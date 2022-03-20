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
        <doing-card :info="item" @single="addOne" @more="addMore" />
      </view>
    </view>
    <view v-if="currentTab === 1" class="list--finish">
      <view v-if="finishList.length === 0" class="empty">
        还没有已经看完的番剧哦~
      </view>
      <block v-else>
        <view class="left">
          <block v-for="(fItem, i) in finishList" :key="i">
            <view class="item" v-if="i % 2 !== 0">
              <finish-card :title="fItem.title" />
            </view>
          </block>
        </view>
        <view class="right">
          <block v-for="(fItem, i) in finishList" :key="i">
            <view class="item" v-if="i % 2 === 0">
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
import { onMounted, ref } from 'vue';
import DoingCard from './components/doing-card.vue';
import Modal from '../common/components/modal.vue';
import XButton from '../common/components/button.vue';
import TabBar from './components/tab-bar.vue';
import XIcon from '../common/components/icon.vue';
import FinishCard from './components/finish-card.vue';
import { Local } from '../common/local';

type Anime = {
  title: string;
  img: string;
  time: string;
  total: number;
  cur: number;
  tags: string[];
};

const list = ref<Anime[]>([
  // {
  //   title: '擅长捉弄的高木同学3',
  //   img: 'https://cdn.jsdelivr.net/gh/qiyuor2/blog-image/img/20220318-takagi17.jpeg',
  //   time: '每周六 01:30',
  //   total: 12,
  //   cur: 4,
  //   tags: ['校园', '恋爱'],
  // },
  // {
  //   title: '擅长捉弄的高木同学3',
  //   img: 'https://cdn.jsdelivr.net/gh/qiyuor2/blog-image/img/20220318-takagi17.jpeg',
  //   time: '每周六 01:30',
  //   total: 12,
  //   cur: 4,
  //   tags: ['校园', '恋爱'],
  // },
]);

const finishList = ref<Anime[]>([
  // { title: 'JOJO的奇妙冒险-星尘远征军' },
  // { title: '曾几何时沦为天魔的黑兔' },
  // { title: '魔法少女小圆 正篇' },
  // { title: 'Fate Zero' },
  // { title: 'Fate Stay Night' },
  // { title: '鬼灭之刃' },
]);

onMounted(() => {
  const fs = Local.create();
  console.log(fs.read());
});

const currentTab = ref(0);
const tabs = ['观看中', '已看完'];
const toAdd = () => {
  uni.navigateTo({ url: '/modules/edit/index' });
};

const addModealVisible = ref(false);
const totalNum = ref(0);

const addOne = () => {};
const addMore = (values: { cur: string | number; total: string | number }) => {
  totalNum.value = Number(values.total);
  addModealVisible.value = true;
};
const selectNumHandler = (num: number) => {
  addModealVisible.value = false;
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
