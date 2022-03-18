<template>
  <view class="index">
    <doing-card title="擅长捉弄的高木同学3" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DoingCard from './components/doing-card.vue';
const title = ref('Hello');
</script>

<style scoped>
.index {
  padding: 1rem;
}
</style>
