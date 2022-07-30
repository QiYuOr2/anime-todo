<template>
  <view class="edit">
    <doing-card :info="info" hide-actions />
    <view class="form">
      <view>
        <text class="title">标题</text>
        <input v-model="info.title" placeholder="标题" />
      </view>
      <view>
        <text class="title">封面地址</text>
        <input v-model="info.img" placeholder="封面地址" />
      </view>
      <view>
        <text class="title">简介</text>
        <input v-model="info.desc" placeholder="简介" />
      </view>
      <view>
        <text class="title">播出时间</text>
        <input placeholder="播出时间" />
      </view>
      <input v-model="info.total" type="number" placeholder="总集数" />
      <view>
        <text class="title">选择已看</text>
        <view class="modal-content">
          <x-button custom-class="select-button" v-for="i in Number(info.total)" :key="i">
            {{ i }}
          </x-button>
        </view>
      </view>
    </view>
    <view class="confirm">确定</view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Anime } from "../common/types";
import { search } from "../common/api";
import XButton from "../common/components/button.vue";
import DoingCard from "../index/components/doing-card.vue";

const info = reactive<Anime>({
  title: "请输入标题",
  img: "",
  desc: "请输入简介",
  time: "请输入时间",
  total: 12,
  cur: 0,
  tags: ["默认tag"],
});
</script>

<style scoped lang="scss">
.edit {
  padding: 1rem 1rem 5rem;
}

.form {
  margin-top: 1rem;

  .title {
    color: var(--gray-text-color);
    font-size: 28rpx;
    margin: 0 0 0 10rpx;
  }

  input {
    padding: 10rpx 32rpx;
    margin: 14rpx 0 20rpx;
    border-radius: 20rpx;
    background: var(--gray-bg-color);

    font-size: 30rpx;
  }
}

.confirm {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 1rem;
  padding: 20rpx 30rpx;
  border-radius: 100rpx;
  box-shadow: 4rpx 4rpx 10rpx 1rpx rgba(49, 154, 100, 0.25);
  background: var(--primary-color);
  color: var(--white-text-color);
  text-align: center;
}
</style>
