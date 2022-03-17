<script setup lang="ts">
import Tabbar from './modules/common/components/tabbar.vue';
</script>

<template>
  <router-view></router-view>
  <tabbar />
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
