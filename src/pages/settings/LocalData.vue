<template>
  <view>
    <button @click="copy">复制</button>
  </view>
</template>

<script lang="ts" setup>
import { useAnime } from "@/composables";

const { readFromLocal } = useAnime();

const copy = () => {
  console.log(readFromLocal())
}
</script>