<script setup lang="ts">
import { ref } from "vue";
import { onShareAppMessage } from "@dcloudio/uni-app";
import { Path } from "@/constants/path";
import { EventName } from "@/constants/event";

import AnimeCard from "./components/AnimeCard.vue";
import TabBar from "./components/TabBar.vue";
import XIcon from "@/components/Icon.vue";
import { AnimeLocalSource, useAnimeList } from "@/composables";
import { useToggle } from "@vueuse/core";

onShareAppMessage(() => ({ title: "追番计划" }));

const [modifyVisible, toggleModifyVisible] = useToggle(false)

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

const selectedId = ref(-1);

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
          break;
        case 3:
          remove();
          break;
      }
    },
    fail() {
      console.log("cancel");
    },
  });
};

const remove = () => {
  uni.showModal({
    title: "警告",
    content: "确定要删除该记录吗？",
    success(res) {
      if (res.confirm) {
        actions().remove(selectedId.value);
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

const addModalVisible = ref(false);
const totalNum = ref(0);
const currentEditIndex = ref(0);
const currentEpisode = ref(0);

const clickMoreHandler = (event: Event, item: Anime) => {
  selectedId.value = item.id;
  const { total, cur } = actions().getOne(selectedId.value);
  totalNum.value = total;
  currentEpisode.value = cur;
  awakeMenuHandler(event as TouchEvent, item);
};

const selectNumHandler = (num: number) => {
  // addModalVisible.value = false;
  // const source = list.value;
  // source[currentEditIndex.value].cur = num;
  // const cur = source[currentEditIndex.value].cur;
  // if (cur === source[currentEditIndex.value].total) {
  //   const currentItem = source[currentEditIndex.value];
  //   uni.showToast({ title: "看完这部番啦！", icon: "none" });
  //   list.value = source.filter((_, i) => i !== currentEditIndex.value);
  //   finishList.value = [...finishList.value, currentItem];
  //   writeToLocal();
  //   return;
  // }
  // list.value = source;
  // writeToLocal();
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
  <view class="index fixed-page">
    <view class="index__header">
      <tab-bar v-model:current="currentTab" :tabs="tabs" />
      <view class="plus-icon" @click="toAdd">
        <x-icon name="add-circle" :size="36" />
      </view>
    </view>

    <view v-if="currentTab === Tabs.Doing" class="list">
      <view v-if="doingAnimes.length === 0" class="empty">还没有正在看的番剧哦~</view>
      <view class="item" v-for="(item, i) in reverse(doingAnimes)" :key="i">
        <anime-card
          :info="item"
          @single="addOne(item)"
          @more="clickMoreHandler($event, item)"
          @detail="toDetail(item)"
          @longpress="awakeMenuHandler($event, item)"
        />
      </view>
    </view>
    <view v-if="currentTab === Tabs.Done" class="list">
      <view v-if="doneAnimes.length === 0" class="empty">还没有已经看完的番剧哦~</view>
      <block v-else>
        <view class="tips">共记录了 {{ doneAnimes.length }} 部已看完的动画</view>
        <view class="item" v-for="(item, i) in reverse(doneAnimes)" :key="i">
          <anime-card :info="item" @detail="toDetail(item)" hideActions />
        </view>
      </block>
    </view>

    <!-- <van-popup :show="modifyVisible">123</van-popup> -->
  </view>
</template>

<style>
.select-button {
  min-width: 50rpx;
  margin: 10rpx;
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

.modal-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  max-height: 600rpx;
  margin-top: 20rpx;
  overflow-y: auto;
}

.desc {
  padding: 10rpx 0;
}
</style>
