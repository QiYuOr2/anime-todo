<template>
  <view class="index">
    <view class="item" v-for="(item, i) in list" :key="i">
      <doing-card :info="item" @single="addOne" @more="addMore" />
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

const list = ref([
  {
    title: '擅长捉弄的高木同学3',
    img: 'https://cdn.jsdelivr.net/gh/qiyuor2/blog-image/img/20220318-takagi17.jpeg',
    time: '每周六 01:30',
    total: 12,
    cur: 4,
    tags: ['校园', '恋爱'],
  },
  {
    title: '擅长捉弄的高木同学3',
    img: 'https://cdn.jsdelivr.net/gh/qiyuor2/blog-image/img/20220318-takagi17.jpeg',
    time: '每周六 01:30',
    total: 12,
    cur: 4,
    tags: ['校园', '恋爱'],
  },
]);

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
