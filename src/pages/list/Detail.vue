<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { onLoad, onShareAppMessage } from "@dcloudio/uni-app";

import { animeDetail, search } from "@/apis/bangumi";
import { useEventChannel } from "@/composables";
import { Local, animeDetailFormatter, setQueryString } from "@/utils";

import { EventName } from "@/constants/event";
import { Path } from "@/constants/path";

import NavBar from "@/components/NavBar.vue";
import Tag from "@/components/Tag.vue";
import XButton from "@/components/Button.vue";

const eventChannel = useEventChannel();
const anime = ref<AnimeDTO>();
const formattedAnime = ref<Anime>();
const tags = ref<string[]>([]);
const isAddBtnVisible = ref(false);
const queryId = ref("");

onShareAppMessage(() => ({
  title: `追番计划 | ${formattedAnime.value?.title}`,
  path: setQueryString(Path.Detail, { id: formattedAnime.value!.id, willAdd: true }),
}));
onLoad((query) => {
  queryId.value = query.id || "";
  isAddBtnVisible.value = query.willAdd === "true";

  if (queryId.value) {
    getDetail(Number(queryId.value));
  }
});

onMounted(() => {
  uni.showLoading({ title: "加载中" });
  eventChannel.on(EventName.GetDetail, (data: Anime) => {
    tags.value = data.tags;
    if (!data.id) {
      fixId(data.title).then(getDetail);
    } else {
      getDetail(data.id);
    }
  });
});

const fixId = async (title: string) => {
  const data = await search(title);
  if (data.list[0]) return data.list[0].id;
  throw "1";
};

const getDetail = (id: number) => {
  animeDetail(id)
    .then((info) => {
      anime.value = info;
      formattedAnime.value = animeDetailFormatter(info, {});
    })
    .then(() => {
      if (!tags.value.length) tags.value = formattedAnime.value?.tags || [];
    })
    .then(() => uni.hideLoading());
};

const calcRatingCountHeight = (count: number, total: number) => {
  return `${(count / total) * 80}rpx`;
};

const addToList = () => {
  const fs = Local.create();
  const [, dataStr] = fs.read();
  const data = JSON.parse(dataStr);

  if (formattedAnime.value) {
    data.list.every((item: any) => item.title !== formattedAnime.value?.title) &&
      data.list.push({
        ...formattedAnime.value,
        cur: 0,
        total: Number(formattedAnime.value.total),
        img: formattedAnime.value.thumb,
      });
  }
  fs.write(JSON.stringify(data));
  uni.switchTab({ url: Path.List });
};
</script>

<template>
  <nav-bar />
  <view class="detail" v-if="anime">
    <view class="thumb">
      <image v-if="anime.images.large" class="thumb__img" :src="anime.images.large" mode="widthFix" />
      <view v-else class="thumb__img thumb__img--empty">
        <x-icon name="picture" :size="40" />
      </view>
    </view>
    <view class="info">
      <view class="info__header"></view>
      <view class="info__content">
        <view class="base">
          <view class="base__cn">{{ anime.name_cn }}</view>
          <view class="base__name">{{ anime.name }}</view>
          <view v-if="formattedAnime" class="base__status">
            <text>共 {{ formattedAnime.total }} 话</text>
            <template v-if="formattedAnime.time">
              <text class="divider">/</text>
              <text>{{ formattedAnime.time }}</text>
            </template>
          </view>
        </view>

        <view v-if="isAddBtnVisible" class="add">
          <x-button block @click="addToList">添加至列表</x-button>
        </view>

        <view class="rating">
          <view class="rating__score">
            {{ anime.rating.score }}
          </view>
          <view class="divider"></view>
          <view class="rating__count">
            <view class="item" v-for="i in Object.keys(anime.rating.count)" :key="i">
              <view class="inner" :style="`--inner-height:${calcRatingCountHeight(anime.rating.count[Number(i)], anime.rating.total)}`">
              </view>
              <text>{{ i }}</text>
            </view>
          </view>
        </view>
        <view class="desc">
          <view class="h2">作品简介</view>
          <view>{{ anime.summary }}</view>
        </view>

        <view class="tags">
          <tag v-for="(t, i) in tags.slice(0, 4)" :key="i" random>
            {{ t }}
          </tag>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.detail {
  max-height: 100vh;
  overflow: auto;
}

.thumb {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  z-index: -1;
  &__img {
    width: 100%;
    &--empty {
      width: 170rpx;
      height: 300rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f1f1f1;
    }
  }
}
.info {
  margin-top: 60vh;

  .h2 {
    font-size: 36rpx;
    margin-bottom: 10rpx;
  }
  &__header {
    padding-top: 50rpx;
    border-radius: 100rpx 100rpx 0 0;
    background: #fff;
    transform: translateY(10rpx);
  }
  &__content {
    background: #fff;
    .base {
      padding: 0 1.4rem 1.4rem;
      &__cn {
        font-size: 48rpx;
        margin-bottom: 5rpx;
      }
      &__name {
        font-size: 30rpx;
        color: var(--gray-text-color);
        margin-bottom: 5rpx;
      }

      &__status {
        color: var(--gray-text-color);
        font-size: 24rpx;
        .divider {
          display: inline-block;
          margin: 0 10rpx;
        }
      }
    }

    .add {
      padding: 0 1.2rem 1.2rem;
    }

    .rating {
      display: flex;
      align-items: center;
      padding: 1rem 1.4rem;
      margin: 0 1.4rem;
      border-radius: 14rpx;
      background: rgba(0, 0, 0, 0.05);

      &__score {
        width: 100rpx;
        height: 100rpx;
        line-height: 100rpx;
        font-size: 42rpx;
        text-align: center;
      }
      .divider {
        width: 2rpx;
        height: 50rpx;
        margin: 0 1.4rem;
        background: var(--gray2-text-color);
      }

      &__count {
        display: flex;
        .item {
          width: 20rpx;
          height: 80rpx;
          background: #fff;
          margin-right: 20rpx;
          transform: translateY(-8rpx);
          .inner {
            position: absolute;
            bottom: 0;
            width: 20rpx;
            height: var(--inner-height);
            background: var(--gray-text-color);
          }
          text {
            position: absolute;
            bottom: -30rpx;
            display: inline-block;
            width: 100%;
            text-align: center;
            font-size: 20rpx;
            color: var(--gray-text-color);
          }
        }
      }
    }

    .desc {
      padding: 1.4rem;
      color: var(--primary-text-color);
    }
    .tags {
      padding: 0 1.4rem 1.4rem;
      display: flex;
      > tag {
        margin-right: 14rpx;
      }
    }
  }
}
</style>
