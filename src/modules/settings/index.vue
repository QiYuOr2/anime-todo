<template>
  <view class="settings">
    <settings-card title="基础设置">
      <view class="settings-item">
        <text>主题色</text>
      </view>
    </settings-card>
    <settings-card title="数据">
      <view class="settings-item">
        <text>导入数据</text>
        <x-icon name="arrow-right" />
      </view>
      <view class="settings-item">
        <text>导出数据</text>
        <x-icon name="arrow-right" />
      </view>
    </settings-card>

    <settings-card title="其他">
      <view class="settings-item">
        <text>关于</text>
        <x-icon name="arrow-right" />
      </view>
    </settings-card>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SettingsCard from './components/settings-card.vue';
import XIcon from '../common/components/icon.vue';
</script>

<style scoped>
.settings-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22rpx 32rpx;
}
.settings-item:hover {
  background: var(--gray-divider-color);
}
.settings-item::after {
  content: '';

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  height: 2rpx;
  margin: 0 32rpx;
  background: var(--gray-divider-color);
}

.settings-item:last-child::after {
  display: none;
}
</style>
