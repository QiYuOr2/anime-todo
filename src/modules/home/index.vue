<script setup lang="ts">
import { ref } from 'vue';
import DoingCard from './components/doing-card.vue';

const test = ref('test');
</script>

<template>
  <div>
    <doing-card />
  </div>
</template>
