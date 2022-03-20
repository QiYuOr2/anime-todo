<template>
  <view class="settings">
    <settings-card title="基础设置">
      <view class="settings-item" @click="alert">
        <text>主题色</text>
        <view
          :class="`theme-color theme-color--${colors[currentColor]}`"
        ></view>
      </view>
    </settings-card>
    <settings-card title="数据">
      <view class="settings-item" @click="openDataModal">
        <text>导入数据</text>
        <x-icon name="arrow-right" />
      </view>
      <view class="settings-item" @click="exportJson">
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

    <modal v-model:visible="dataModalVisible" title="粘贴要导入的数据">
      <view class="textarea">
        <textarea
          :value="json"
          @input="jsonInputHandler"
          class="textarea__core"
          auto-height
        />
      </view>
      <view class="actions">
        <x-button @click="importJson">确定导入</x-button>
        <x-button @click="example">示例数据</x-button>
      </view>
    </modal>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SettingsCard from './components/settings-card.vue';
import XIcon from '../common/components/icon.vue';
import Modal from '../common/components/modal.vue';
import XButton from '../common/components/button.vue';
import { Local } from '../common/local';

const currentColor = ref(0);
const colors = ['green'];
const dataModalVisible = ref(false);
const json = ref('');

const alert = () => {
  uni.showToast({
    icon: 'none',
    title: '抱歉，更换主题色功能正在开发中，暂时无法使用',
  });
};

const openDataModal = () => {
  dataModalVisible.value = true;
};

const jsonInputHandler = (e: any) => {
  json.value = e.detail.value;
};

const importJson = () => {
  if (!json.value) {
    uni.showToast({ icon: 'none', title: '请填入数据' });
    return;
  }
  Local.create().write(json.value);
  dataModalVisible.value = false;
};

const exportJson = () => {
  const [err, data] = Local.create().read();

  if (err) {
    uni.showToast({
      icon: 'none',
      title: err,
    });
    return;
  }
  if (data) {
    uni.setClipboardData({
      data,
      success() {
        uni.showToast({
          icon: 'none',
          title: '数据已复制到剪切板，请尽快粘贴保存',
        });
      },
      fail(result) {
        uni.showToast({
          icon: 'none',
          title: result.errMsg,
        });
      },
    });
  }
};

const example = () => {
  json.value = '测试';
};
</script>

<style>
.textarea {
  margin: 26rpx 0;
  max-height: 300rpx;
  border-radius: 4rpx;
  padding: 10rpx;
  border: 2rpx solid var(--gray-text-color);
}
textarea {
  width: 100%;
}
.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}
</style>

<style scoped>
.settings-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22rpx 32rpx;
}
/* .settings-item:hover {
  background: var(--gray-divider-color);
} */
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
.theme-color {
  width: 54rpx;
  height: 30rpx;
  border-radius: 4rpx;
}
.theme-color--green {
  background: var(--green-color);
}
</style>
