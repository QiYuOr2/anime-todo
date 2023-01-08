<script setup lang="ts">
import pkg from "../../../package.json";
const from = "https://github.com/bangumi/api/";
const opensource = "https://github.com/QiYuOr2/anime-todo";
const mail = "qiyuor2@foxmail.com";

const copy = (text: string) => {
  uni.setClipboardData({
    data: text,
    success() {
      uni.showToast({
        icon: "none",
        title: "复制成功",
      });
    },
    fail(result) {
      uni.showToast({
        icon: "none",
        title: result.errMsg,
      });
    },
  });
};
</script>

<template>
  <view class="about fixed-page">
    <view class="logo">
      <image src="../../static/logo.png" mode="widthFix" />
    </view>
    <view class="content">
      <view class="title">
        <text>{{ pkg.displayName }}</text>
        <text class="version">v{{ pkg.version }}</text>
      </view>
      <view class="p"> 追番列表是一个用来记录个人动画观看情况的小程序。 </view>
      <view class="p"> 本项目的所有用户数据均保存在本地，因此当进行更换设备、删除小程序等操作时需要在设置界面导出数据进行备份。 </view>

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

      <view class="divider"></view>

      <ul class="p">
        <li class="change-log">
          <view>v1.4.0</view>
          <view class="change-log__text">增加「移至顶部」功能</view>
          <view class="change-log__text">交互 & UI优化</view>
        </li>
        <li class="change-log">
          <view>v1.3.1 [Bugfix]</view>
          <view class="change-log__text">修复无数据时添加失败</view>
        </li>
        <li class="change-log">
          <view>v1.3.0</view>
          <view class="change-log__text">支持分享卡片一键添加追番</view>
        </li>
        <li class="change-log">
          <view>v1.2.0</view>
          <view class="change-log__text">[Break Change]数据新增了id字段</view>
          <view class="change-log__text change-log__text--not-list">详情数据可能出错，需要手动删除重新添加</view>
          <view class="change-log__text">详情从弹窗改为页面</view>
        </li>
        <li class="change-log">
          <view>v1.1.0</view>
          <view class="change-log__text">可以删除正在追的番剧了</view>
          <view class="change-log__text">调整了部分UI</view>
        </li>
        <li class="change-log">
          <view>v1.0.0</view>
          <view class="change-log__text">记录追番情况的一些基础功能</view>
        </li>
      </ul>
    </view>
  </view>
</template>

<style scoped lang="scss">
.about {
  padding-bottom: 3rem;
}
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
  image {
    width: 300rpx;
  }
}

.content {
  padding: 0 70rpx;

  .title {
    text-align: center;
    margin-bottom: 40rpx;
  }
  .version {
    margin-left: 10rpx;
    font-size: 24rpx;
    color: var(--gray-text-color);
    vertical-align: bottom;
  }

  .p {
    margin-bottom: 20rpx;
  }

  .from {
    color: var(--gray-text-color);
    font-size: 24rpx;
  }

  .link {
    color: var(--blue-text-color);
  }

  .change-log {
    margin-bottom: 1rem;
    &__text {
      display: flex;
      align-items: center;
      color: var(--gray-text-color);
      font-size: 30rpx;

      &::before {
        content: "";
        display: inline-block;
        width: 8rpx;
        height: 8rpx;
        margin-left: 10rpx;
        margin-right: 0.5rem;
        border-radius: 8rpx;
        background: var(--gray-text-color);
      }

      &--not-list {
        &::before {
          background: #fff;
        }
      }
    }
  }
}
</style>
