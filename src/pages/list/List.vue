<script setup lang="ts">
import { ref } from "vue";
import { onShow, onShareAppMessage } from "@dcloudio/uni-app";
import { get, set } from "@vueuse/core";
import { removeOne, Local } from "@/utils";
import { Path } from "@/constants/path";
import { EventName } from "@/constants/event";

import AnimeCard from "./components/AnimeCard.vue";
import TabBar from "./components/TabBar.vue";
import Modal from "@/components/Modal.vue";
import XButton from "@/components/Button.vue";
import XIcon from "@/components/Icon.vue";

onShareAppMessage(() => ({ title: "追番计划" }));
const list = ref<Anime[]>([]);

const finishList = ref<Anime[]>([]);

const writeToLocal = () => {
  Local.create().write(
    JSON.stringify({
      list: list.value,
      finishList: finishList.value,
    })
  );
};

onShow(() => {
  const fs = Local.create();
  const [err, data] = fs.read();
  if (err) {
    // uni.showToast({ icon: 'none', title: '数据读取错误' });
    return;
  }
  const dataStr = JSON.parse(data);
  list.value = dataStr.list;
  finishList.value = dataStr.finishList;
});

const currentTab = ref(0);
const tabs = ["观看中", "已看完"];
const toAdd = () => {
  uni.navigateTo({ url: Path.Search });
};

const isMenuVisible = ref(false);

const indexScrollHandler = () => {
  isMenuVisible.value = false;
};

const menuPositionX = ref("0");
const menuPositionY = ref("0");

const awakeMenuHandler = (values: { cur: string | number; total: string | number; $event: any }, index: number) => {
  uni.vibrateShort({});

  currentEditIndex.value = index;
  currentEditCur.value = Number(values.cur);
  totalNum.value = Number(values.total);

  if (!values.$event) {
    return;
  }

  const touched = values.$event.changedTouches[0];

  // 防止菜单超出边界
  let x = touched.clientX;
  let y = touched.clientY;
  if (x + 100 > 375) {
    x -= 100;
  }

  menuPositionX.value = `${x}px`;
  menuPositionY.value = `${y}px`;
  isMenuVisible.value = true;
};

const clickIndexHandler = () => {
  isMenuVisible.value = false;
};

const remove = () => {
  uni.vibrateShort({});
  const source = get(list);
  uni.showModal({
    title: "警告",
    content: "确定要删除该记录吗？",
    success(res) {
      if (res.confirm) {
        set(list, removeOne(source, currentEditIndex.value));
        writeToLocal();
      } else if (res.cancel) {
        console.log("取消删除");
      }
    },
  });
};

//#region 修改已看级数
const addOne = (index: number) => {
  const source = list.value;

  source[index].cur = source[index].cur + 1;
  const cur = source[index].cur;

  if (cur === source[index].total) {
    const currentItem = source[index];

    uni.showToast({ title: "看完这部番啦！", icon: "none" });

    list.value = source.filter((_, i) => i !== index);
    finishList.value = [...finishList.value, currentItem];

    writeToLocal();
    return;
  }
  list.value = source;
  writeToLocal();
};

const addModealVisible = ref(false);
const totalNum = ref(0);
const currentEditIndex = ref(0);
const currentEditCur = ref(0);

const clickMore = (values: { cur: string | number; total: string | number; $event: Event }, index: number) => {
  awakeMenuHandler(values, index);
};
const addMore = () => {
  uni.vibrateShort({});
  isMenuVisible.value = false;
  addModealVisible.value = true;
};
const selectNumHandler = (num: number) => {
  addModealVisible.value = false;

  const source = list.value;
  source[currentEditIndex.value].cur = num;

  const cur = source[currentEditIndex.value].cur;

  if (cur === source[currentEditIndex.value].total) {
    const currentItem = source[currentEditIndex.value];

    uni.showToast({ title: "看完这部番啦！", icon: "none" });

    list.value = source.filter((_, i) => i !== currentEditIndex.value);
    finishList.value = [...finishList.value, currentItem];

    writeToLocal();
    return;
  }
  list.value = source;
  writeToLocal();
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
</script>

<template>
  <view class="index fixed-page" @click="clickIndexHandler" @touchmove="indexScrollHandler">
    <view class="index__header">
      <tab-bar v-model:current="currentTab" :tabs="tabs" />
      <view class="plus-icon" @click="toAdd">
        <x-icon name="add-circle" :size="36" />
      </view>
    </view>

    <view v-if="currentTab === 0" class="list">
      <view v-if="list.length === 0" class="empty">还没有正在看的番剧哦~</view>
      <view class="item" v-for="(item, i) in list" :key="i">
        <anime-card
          :info="item"
          @single="addOne(i)"
          @more="clickMore($event, i)"
          @detail="toDetail(item)"
          @longpress="awakeMenuHandler($event, i)"
        />
      </view>
    </view>
    <view v-if="currentTab === 1" class="list">
      <view v-if="finishList.length === 0" class="empty"> 还没有已经看完的番剧哦~ </view>
      <block v-else>
        <view class="tips">共记录了 {{ finishList.length }} 部已看完的动画</view>
        <view class="item" v-for="(item, i) in finishList" :key="i">
          <anime-card :info="item" @detail="toDetail(item)" hideActions />
        </view>
      </block>
    </view>

    <view class="menu" v-if="isMenuVisible">
      <view class="menu-item" hover-class="menu-item--active" @click="remove">
        <x-icon name="ashbin" :size="32" />
        <text class="menu-item__text">删除</text>
      </view>
      <view class="menu-item" hover-class="menu-item--active" @click="addMore">
        <x-icon name="modular" :size="32" />
        <text class="menu-item__text">进度</text>
      </view>
    </view>

    <modal v-model:visible="addModealVisible" title="选择集数">
      <view class="modal-content">
        <x-button custom-class="select-button" v-for="i in totalNum" :key="i" @click="selectNumHandler(i)" :plain="currentEditCur < i">
          {{ i }}
        </x-button>
      </view>
    </modal>
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

.menu {
  position: fixed;
  left: v-bind(menuPositionX);
  top: v-bind(menuPositionY);
  z-index: 1000;

  display: flex;
  justify-content: center;
  flex-direction: column;

  min-width: 200rpx;
  background: var(--menu-bg-color);
  border-radius: 24rpx;
  overflow: hidden;
  &-item {
    padding: 20rpx 40rpx 20rpx 30rpx;
    &:not(:last-child) {
      border-bottom: 2rpx solid var(--gray-divider-color);
    }

    &__text {
      margin-left: 20rpx;
    }

    &--active {
      background: var(--gray-bg-color);
    }
  }
}
</style>
