<template>
  <view class="settings">
    <x-section title="基础设置">
      <view class="settings-item" @click="alert">
        <text>主题色</text>
        <view :class="`theme-color theme-color--${colors[currentColor]}`"></view>
      </view>
    </x-section>
    <x-section title="数据">
      <view class="settings-item" @click="beforeToggleCloudSync">
        <text>云同步</text>
        <switch
          :checked="isCloudSync"
          color="var(--primary-color)"
          style="height: 44rpx; transform: scale(0.7); transform-origin: right top"
          disabled
        />
      </view>

      <view :class="['settings-item', { 'settings-item--disabled': isCloudSync }]" @click="toLocalData">
        <text>本地数据管理</text>
        <x-icon name="arrow-right" color="currentColor" />
      </view>
    </x-section>

    <x-section title="其他">
      <view class="settings-item" @click="toAbout">
        <text>关于</text>
        <x-icon name="arrow-right" />
      </view>
    </x-section>
  </view>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import XSection from "./components/Section.vue";
import XIcon from "@/components/Icon.vue";
import { Local } from "@/utils";
import { Path } from "@/constants/path";
import { useToggle } from "@vueuse/core";
import { user } from "@/apis/cloud";
import { SYNC_STATUS, UID } from "@/constants/storage";

const currentColor = ref(0);
const colors = ["green"];
const dataModalVisible = ref(false);
const json = ref("");

const [isCloudSync, _toggleCloudSync] = useToggle(uni.getStorageSync(SYNC_STATUS));

const toggleCloudSync = (value: boolean) =>
  user.setUserSyncStatus(uni.getStorageSync(SYNC_STATUS), value).then(() => {
    _toggleCloudSync(value);
    uni.setStorageSync(SYNC_STATUS, value);
  });

const beforeToggleCloudSync = () => {
  if (isCloudSync.value) {
    return uni.showModal({
      title: "云同步关闭确认",
      content: "关闭云同步后数据将仅在本地保存，并且云同步时不会存入本地",
      confirmText: "确认关闭",
      success(result) {
        if (result.cancel) {
          return;
        }
        if (result.confirm) {
          toggleCloudSync(false);
        }
      },
    });
  }

  uni.showLoading({ title: isCloudSync.value ? "关闭中" : "开启中" });

  const toggle = (value: boolean) => toggleCloudSync(value).then(() => uni.hideLoading());

  !uni.getStorageSync(UID)
    ? uni.login({
        async success(result) {
          if (!result.code) {
            uni.showToast({ icon: "none", title: "开启失败" });
            return;
          }
          user.login(result.code).then(() => toggle(true));
        },
      })
    : toggle(true);
};

const alert = () => {
  uni.showToast({
    icon: "none",
    title: "抱歉，更换主题色功能正在开发中，暂时无法使用",
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
    uni.showToast({ icon: "none", title: "请填入数据" });
    return;
  }
  Local.create().write(json.value);
  dataModalVisible.value = false;
};

const exportJson = () => {
  const [err, data] = Local.create().read();

  if (err) {
    uni.showToast({
      icon: "none",
      title: err,
    });
    return;
  }
  if (data) {
    uni.setClipboardData({
      data,
      success() {
        uni.showToast({
          icon: "none",
          title: "数据已复制到剪切板，请尽快粘贴保存",
        });
      },
      fail(result) {
        uni.showToast({
          icon: "none",
          title: result.errMsg,
        });
      },
    });
  }
};

const example = () => {
  json.value = JSON.stringify({
    list: [
      {
        id: 326895,
        total: 25,
        start: "2022年4月14日",
        weekday: "星期四",
        thumb: "https://lain.bgm.tv/pic/cover/c/d9/f5/326895_S66Uq.jpg",
        title: "夏日重现",
        time: "每周四更新",
        desc: "“潮死了——”\r\n听闻青梅竹马・小船潮讣告的网代慎平，时隔2年回到了故乡和歌山市・日都岛。\r\n家人和朋友再会，葬礼也顺利进行。然而，好友菱形窗却告诉慎平“潮的死存在可疑之处，有他杀的可能性”。\r\n第二天又发生了邻居一家突然全部消失的事件。随着时间的推移，慎平又听到了一个不祥的传闻。\r\n“看到与自己一样的影子的人会死。会被影子杀死——”并且，潮的妹妹・澪说“姐姐去世前3天看到了影子”……\r\n纪淡海峡...",
        tags: ["悬疑", "漫画改"],
        cur: 10,
        img: "https://lain.bgm.tv/pic/cover/c/d9/f5/326895_S66Uq.jpg",
      },
    ],
    finishList: [
      {
        id: 219200,
        total: 12,
        start: "2018年1月8日",
        weekday: "星期一",
        thumb: "https://lain.bgm.tv/pic/cover/c/09/16/219200_wFT9i.jpg",
        title: "擅长捉弄的高木同学",
        time: "每周一更新",
        desc: "“今天一定要捉弄高木同学，让她害羞！”\r\n某所中学，在各种方面都被邻座的女生高木同学捉弄的男生西片。\r\n他为了对此反击而每天奋斗，但……？\r\n这样的高木同学与西片带来的全力“捉弄”青春大战开始了！...",
        tags: ["恋爱", "狗粮"],
        cur: 12,
        img: "https://lain.bgm.tv/pic/cover/c/09/16/219200_wFT9i.jpg",
      },
    ],
  });
};

const clearJson = () => {
  uni.showModal({
    title: "警告",
    content: "确定要清除数据吗？",
    success(res) {
      if (res.confirm) {
        Local.create().write(
          JSON.stringify({
            list: [],
            finishList: [],
          })
        );
        uni.showToast({ icon: "none", title: "数据已清除" });
      } else if (res.cancel) {
        console.log("用户点击取消");
      }
    },
  });
};

const toAbout = () => {
  uni.navigateTo({ url: Path.About });
};

const toLocalData = () => {
  isCloudSync.value ? uni.showToast({ icon: "none", title: "开启云同步后无法使用本地数据" }) : uni.navigateTo({ url: Path.LocalData });
};
</script>

<style>
.textarea {
  margin: 26rpx 0;
  max-height: 300rpx;
  border-radius: 4rpx;
  padding: 10rpx;
  border: 2rpx solid var(--gray2-text-color);
  overflow: hidden;
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

<style lang="scss" scoped>
.settings-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22rpx 32rpx;

  &::after {
    content: "";

    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;

    height: 2rpx;
    margin: 0 32rpx;
    background: var(--gray-divider-color);
  }

  &:last-child::after {
    display: none;
  }

  &--disabled {
    color: var(--gray-text-color);
  }
}
/* .settings-item:hover {
  background: var(--gray-divider-color);
} */

.theme-color {
  width: 54rpx;
  height: 30rpx;
  border-radius: 4rpx;
}
.theme-color--green {
  background: var(--green-color);
}
</style>
