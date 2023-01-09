<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { onPageScroll, onShareAppMessage } from "@dcloudio/uni-app";
import { Path } from "@/constants/path";
import { EventName } from "@/constants/event";
import { AnimeLocalSource, useAnimeList } from "@/composables";
import { useToggle } from "@vueuse/core";

import AnimeCard from "./components/AnimeCard.vue";
import TabBar from "./components/TabBar.vue";
import XIcon from "@/components/Icon.vue";
import XButton from "@/components/Button.vue";
import Popup from "@/components/Popup.vue";
import ToTop from "@/components/ToTop.vue";

onShareAppMessage(() => ({ title: "追番计划" }));

const [toTopVisible, toggleToTopVisible] = useToggle(false);
onPageScroll(({ scrollTop }) => {
  toggleToTopVisible(scrollTop > 50);
});

const [modifyVisible, toggleModifyVisible] = useToggle(false);

watchEffect(() => {
  modifyVisible.value ? uni.hideTabBar() : uni.showTabBar();
});

const Tabs = {
  Doing: 0,
  Done: 1,
};
const tabs = ["观看中", "已看完"];
const currentTab = ref(0);
const toAdd = () => {
  uni.navigateTo({ url: Path.Search });
};

const { value: doingAnimes, ...doingAnimesActions } = useAnimeList(AnimeLocalSource.Doing);
const { value: doneAnimes, ...doneAnimesActions } = useAnimeList(AnimeLocalSource.Done);

const actions = () => (currentTab.value === Tabs.Doing ? doingAnimesActions : doneAnimesActions);

const awakeMenuHandler = (event: TouchEvent, item: Anime) => {
  wx.vibrateShort({ type: "heavy" });

  uni.showActionSheet({
    itemList: ["移至顶部", "查看详情", "修改进度", "删除"],
    success({ tapIndex }) {
      switch (tapIndex) {
        case 0:
          actions().moveToTop(item.id);
          break;
        case 1:
          toDetail(item);
          break;
        case 2:
          toggleModifyVisible(true);
          break;
        case 3:
          remove(item.id);
          break;
      }
    },
    fail() {
      console.log("cancel");
    },
  });
};

const remove = (id: number) => {
  uni.showModal({
    title: "警告",
    content: "确定要删除该记录吗？",
    success(res) {
      if (res.confirm) {
        actions().remove(id);
      } else if (res.cancel) {
        console.log("取消删除");
      }
    },
  });
};

//#region 修改已看级数
const addOne = (item: Anime) => {
  const modified = actions().modifyProgress(item.id, 1);

  if (modified.cur === modified.total) {
    uni.showToast({ title: "看完这部番啦！", icon: "none" });

    doingAnimesActions.remove(modified.id);
    doneAnimesActions.add(modified);
  }
};

const selectedItem = ref<Anime>();

const clickMoreHandler = (event: Event, item: Anime) => {
  selectedItem.value = actions().getOne(item.id);
  awakeMenuHandler(event as TouchEvent, item);
};

const selectNumHandler = (num: number) => {
  toggleModifyVisible(false);
  const modified = actions().modifyProgress(selectedItem.value!.id, num, "modify");

  if (modified.cur === modified.total) {
    uni.showToast({ title: "看完这部番啦！", icon: "none" });

    doingAnimesActions.remove(modified.id);
    doneAnimesActions.add(modified);
  }
};
//#endregion

const toDetail = (detail: Anime) => {
  uni.navigateTo({
    url: Path.Detail,
    success(res) {
      res.eventChannel.emit(EventName.GetDetail, detail);
    },
  });
};

const reverse = <T>(list: T[]) => {
  return list.slice().reverse();
};
</script>

<template>
  <view class="index">
    <view class="index__header">
      <tab-bar v-model:current="currentTab" :tabs="tabs" />
      <view class="plus-icon" @click="toAdd">
        <x-icon name="add-circle" :size="36" />
      </view>
    </view>

    <view v-show="currentTab === Tabs.Doing" class="list">
      <view v-if="doingAnimes.length === 0" class="empty">还没有正在看的番剧哦~</view>
      <view class="item" v-for="(item, i) in reverse(doingAnimes)" :key="i">
        <anime-card
          :info="item"
          @single="addOne(item)"
          @more="clickMoreHandler($event, item)"
          @detail="toDetail(item)"
          @longpress="clickMoreHandler($event, item)"
        />
      </view>
    </view>

    <view v-show="currentTab === Tabs.Done" class="list">
      <view v-if="doneAnimes.length === 0" class="empty">还没有已经看完的番剧哦~</view>
      <block v-else>
        <view class="tips">共记录了 {{ doneAnimes.length }} 部已看完的动画</view>
        <view class="item" v-for="(item, i) in reverse(doneAnimes)" :key="i">
          <anime-card :info="item" @detail="toDetail(item)" hideActions />
        </view>
      </block>
    </view>

    <to-top v-if="toTopVisible" />

    <popup v-model:visible="modifyVisible">
      <view class="progress-edit" v-if="selectedItem?.id">
        <view class="progress-edit__title">{{ selectedItem!.title }}进度修改</view>
        <view class="progress-edit__content">
          <x-button custom-class="select-button" @click="selectNumHandler(0)">未开始</x-button>
          <x-button
            custom-class="select-button"
            v-for="i in selectedItem!.total"
            :key="i"
            @click="selectNumHandler(i)"
            :plain="selectedItem!.cur < i"
          >
            {{ i }}
          </x-button>
        </view>
      </view>
    </popup>
  </view>
</template>

<style lang="scss">
.select-button {
  min-width: 80rpx;
  padding-top: 16rpx !important;
  padding-bottom: 16rpx !important;
  text-align: center;
}
</style>

<style scoped lang="scss">
.index {
  padding: 1rem;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 30rpx;
    padding-right: 20rpx;
  }

  &__header .plus-icon {
    padding: 10rpx;
  }

  .item {
    margin-bottom: 1rem;
  }

  .tips {
    padding: 0 0 20rpx 10rpx;
    font-size: 24rpx;
    color: var(--gray-text-color);
  }
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 500rpx;
  width: 100%;
  color: var(--gray-text-color);
}

.list {
  &--finish {
    display: flex;
  }
}

.left,
.right {
  flex: 1;
}

.left {
  margin-right: 30rpx;
}

.desc {
  padding: 10rpx 0;
}

.progress-edit {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  &__title {
    padding: 22rpx 32rpx 16rpx;
    font-weight: bold;
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(5, 1fr);

    max-height: 800rpx;
    overflow-y: auto;

    padding: 0 32rpx 16rpx;

    x-button {
      padding: 10rpx;
      // &:last-child {
      //   margin-right: auto;
      // }
    }
  }
}
</style>
