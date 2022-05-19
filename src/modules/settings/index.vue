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
      <view class="settings-item" @click="clearJson">
        <text>清除数据</text>
        <x-icon name="arrow-right" />
      </view>
    </settings-card>

    <settings-card title="其他">
      <view class="settings-item" @click="toAbout">
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
  json.value = JSON.stringify({
    list: [
      {
        start: '2022年6月10日',
        weekday: '2022年6月10日',
        total: 1,
        thumb: 'https://lain.bgm.tv/pic/cover/c/fd/00/347888_8tn9r.jpg',
        title: '擅长捉弄的高木同学 剧场版',
        time: '',
        desc: 'とある中学校、隣の席になった女の子・高木さんに、何かとからかわれる男の子・西片。\r\nどうにかして高木さんをからかい返そうと策を練るも、いつも高木さんに見透かされてしまう。\r\n季節はめぐり、3年生に進級した2人。周囲は将来を考え始め、不安と期待が入り混じる中、高木さんと西片の距離は未だ変わらぬまま。そして、中学最後の夏がはじまろうとしていた——\r\n\r\n夏休みが始まる前日、2人は帰り道で偶然ちいさな子...',
        tags: ['剧场版', '恋爱'],
        cur: 0,
        img: 'https://lain.bgm.tv/pic/cover/c/fd/00/347888_8tn9r.jpg',
      },
    ],
    finishList: [
      {
        total: 12,
        start: '2019年7月7日',
        weekday: '星期日',
        thumb: 'https://lain.bgm.tv/pic/cover/c/f5/c8/271151_UB2n6.jpg',
        title: '擅长捉弄的高木同学 第二季',
        time: '每周日更新',
        desc: '某所初中学校，男生西片总是被邻座的女生高木同学捉弄。他为了对此反击而用尽计策，却总是被高木同学看透。\r\n季节轮回，西片升入2年级，这一次他是否能够顺利反击高木同学呢……？...',
        tags: ['恋爱', '狗粮'],
        cur: 12,
        img: 'https://lain.bgm.tv/pic/cover/c/f5/c8/271151_UB2n6.jpg',
      },
      {
        total: 12,
        start: '2022年1月7日',
        weekday: '星期五',
        thumb: 'https://lain.bgm.tv/pic/cover/c/2d/ad/347887_5BuT8.jpg',
        title: '擅长捉弄的高木同学 第三季',
        time: '每周五更新',
        desc: '“捉弄”缩短了二人的距离，\r\n2022年想要守候的初恋就在这里。\r\n\r\n在一所初中里，有一个叫做西片的男生，他时不时就会遭到同桌女生高木的捉弄。\r\n西片每次思考对策，想要捉弄回高木，都会被高木看透。\r\n\r\n于是西片每天都绞尽脑汁，想要扳回一城…\r\n然而随着时间变化的不止是季节，还有西片的心境？\r\n看似占据优势的高木似乎也发生了让她动摇的事情？\r\n\r\n是看对方喜欢自己，还是将喜欢展现给对方看——\r\n...',
        tags: ['恋爱', '2022年1月'],
        cur: 12,
        img: 'https://lain.bgm.tv/pic/cover/c/2d/ad/347887_5BuT8.jpg',
      },
      {
        total: 12,
        start: '2018年1月8日',
        weekday: '星期一',
        thumb: 'https://lain.bgm.tv/pic/cover/c/09/16/219200_wFT9i.jpg',
        title: '擅长捉弄的高木同学',
        time: '每周一更新',
        desc: '“今天一定要捉弄高木同学，让她害羞！”\r\n某所中学，在各种方面都被邻座的女生高木同学捉弄的男生西片。\r\n他为了对此反击而每天奋斗，但……？\r\n这样的高木同学与西片带来的全力“捉弄”青春大战开始了！...',
        tags: ['恋爱', '狗粮'],
        cur: 12,
        img: 'https://lain.bgm.tv/pic/cover/c/09/16/219200_wFT9i.jpg',
      },
    ],
  });
};

const clearJson = () => {
  uni.showModal({
    title: '警告',
    content: '确定要清除数据吗？',
    success(res) {
      if (res.confirm) {
        Local.create().write(
          JSON.stringify({
            list: [],
            finishList: [],
          })
        );
        uni.showToast({ icon: 'none', title: '数据已清除' });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
  });
};

const toAbout = () => {
  uni.navigateTo({ url: '/modules/settings/about' });
};
</script>

<style>
.textarea {
  margin: 26rpx 0;
  max-height: 300rpx;
  border-radius: 4rpx;
  padding: 10rpx;
  border: 2rpx solid var(--gray2-text-color);
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
