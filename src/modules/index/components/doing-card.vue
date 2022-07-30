<template>
  <view class="doing-card" @click="clickDetailHandler" @longpress="longpressHandler">
    <image v-if="info.img" class="thumb" :src="info.img" mode="aspectFill" />
    <view v-else class="thumb thumb--empty">
      <x-icon name="picture" :size="40" />
    </view>
    <view class="info">
      <view class="title">{{ info.title }}</view>
      <view class="status">
        <text>第 {{ info.cur }}/{{ info.total }} 话</text>
        <template v-if="info.time">
          <text class="divider">|</text>
          <text>{{ info.time }}</text>
        </template>
      </view>
      <view class="tags">
        <tag v-for="(t, i) in info.tags.slice(0, 2)" :key="i" random>
          {{ t }}
        </tag>
      </view>
      <view v-if="!hideActions" class="footer">
        <x-button @click="clickOneHandler">看一话</x-button>
        <x-button type="other" @click="clickMoreHandler">更多</x-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { PropType, getCurrentInstance, ref } from "vue";
import { Anime } from "../../common/types";
import Tag from "../../common/components/tag.vue";
import XButton from "../../common/components/button.vue";
import XIcon from "../../common/components/icon.vue";

const props = defineProps({
  info: { type: Object as PropType<Anime>, required: true },
  hideActions: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (event: "single"): void;
  (event: "more", value: { cur: number | string; total: number | string; $event: Event }): void;
  (event: "detail", value: Anime): void;
  (event: "longpress", value: { cur: number | string; total: number | string; $event: Event }): void;
}>();

const clickOneHandler = () => {
  emit("single");
};
const clickMoreHandler = (event: Event) => {
  emit("more", { cur: props.info.cur, total: props.info.total, $event: event });
};
const clickDetailHandler = () => {
  emit("detail", props.info);
};

const longpressHandler = (event: Event) => {
  emit("longpress", { cur: props.info.cur, total: props.info.total, $event: event });
};
</script>

<style scoped lang="scss">
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
  .thumb {
    min-width: 140rpx;
    width: 140rpx;
    height: 200rpx;
    margin-right: 24rpx;
    background: #f1f1f1;
    border-radius: 24rpx;
    &--empty {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .info {
    flex: 1;
    max-width: calc(100% - 165rpx);

    display: flex;
    flex-direction: column;
    .title {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      color: var(--primary-text-color);
    }

    .status {
      margin: 10rpx 0;

      color: var(--gray-text-color);
      font-size: 24rpx;
    }

    .tags > tag {
      margin-right: 10rpx;
    }
    .tags > tag:last-child {
      margin-right: 0;
    }

    .footer {
      margin-top: auto;
      text-align: right;
    }
    .footer > x-button {
      margin-right: 10rpx;
    }
    .footer > x-button:last-child {
      margin-right: 0;
    }
  }
}
</style>
