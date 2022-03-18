<template>
  <view class="doing-card">
    <image
      class="thumb"
      src="https://cdn.jsdelivr.net/gh/qiyuor2/blog-image/img/20220318-takagi17.jpeg"
      mode="heightFix"
    />
    <view class="info">
      <view class="title">{{ title }}</view>
      <view class="status">
        <text>看到第 4 话</text>
        <text class="divider">|</text>
        <text>每周六 01:30 更新</text>
      </view>
      <view class="tags">
        <tag>恋爱</tag>
      </view>
      <view class="footer">
        <x-button>看了1话</x-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Tag from '../../common/components/tag.vue';
import XButton from '../../common/components/button.vue';

defineProps({
  title: String,
});
</script>

<style scoped>
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
}
.thumb {
  width: 150rpx;
  height: 200rpx;
  margin-right: 24rpx;
  background: #f1f1f1;
  border-radius: 24rpx;
}
.info {
  flex: 1;

  display: flex;
  flex-direction: column;
}
.info .title {
  color: var(--primary-text-color);
}

.info .status {
  margin: 10rpx 0;

  color: var(--gray-text-color);
  font-size: 28rpx;
}

.info .footer {
  margin-top: auto;
}
</style>
