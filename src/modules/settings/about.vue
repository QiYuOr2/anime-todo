<template>
  <view class="about">
    <view class="logo">
      <image src="../../static/logo.png" mode="widthFix" />
    </view>
    <view class="content">
      <view class="title">
        <text>追番列表</text>
        <text class="version">v1.0.0</text>
      </view>
      <view class="p"> 追番列表是一个用来记录个人动画观看情况的小程序。 </view>
      <view class="p">
        本项目的所有用户数据均保存在本地，因此当进行更换设备、删除小程序等操作时需要在设置界面导出数据进行备份。
      </view>

      <view class="divider"></view>

      <view class="p from">
        问题反馈邮箱<br />
        <text class="link" @click="copy(mail)">{{ mail }}</text>
        「点击复制」
      </view>
      <view class="p from">
        动画数据来源<br />
        <text class="link" @click="copy(from)">
          {{ from }}
        </text>
      </view>
      <view class="p from">
        项目开源地址<br />
        <text class="link" @click="copy(opensource)">
          {{ opensource }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const from = 'https://github.com/bangumi/api/';
const opensource = 'https://github.com/QiYuOr2/anime-todo';
const mail = 'qiyuor2@foxmail.com';

const copy = (text: string) => {
  uni.setClipboardData({
    data: text,
    success() {
      uni.showToast({
        icon: 'none',
        title: '复制成功',
      });
    },
    fail(result) {
      uni.showToast({
        icon: 'none',
        title: result.errMsg,
      });
    },
  });
};
</script>

<style scoped>
.divider {
  width: 100%;
  margin: 50rpx 0;
  height: 2rpx;
  background: var(--gray-bg-color);
}
.logo {
  width: 100%;
  display: flex;
  justify-content: center;
}
.logo image {
  width: 300rpx;
}

.content {
  padding: 0 70rpx;
}

.content .title {
  text-align: center;
  margin-bottom: 40rpx;
}
.content .version {
  margin-left: 10rpx;
  font-size: 24rpx;
  color: var(--gray-text-color);
  vertical-align: bottom;
}

.content .p {
  margin-bottom: 20rpx;
}

.content .from {
  color: var(--gray-text-color);
  font-size: 24rpx;
}

.content .link {
  color: var(--blue-text-color);
}
</style>
