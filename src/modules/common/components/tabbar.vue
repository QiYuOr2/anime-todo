<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Router } from '../constants';

const r = useRouter();

const isActive = (name: string) => {
  return r.currentRoute.value.name === name;
};

const to = (name: string) => {
  r.push({ name });
};
</script>

<template>
  <div class="tabbar">
    <div
      :class="['item', { active: isActive(Router.Home) }]"
      @click="to(Router.Home)"
    >
      <home size="26" />
    </div>
    <div class="plus" @click="to(Router.Add)">
      <plus />
    </div>
    <div
      :class="['item', { active: isActive(Router.Settings) }]"
      @click="to(Router.Settings)"
    >
      <settings size="26" />
    </div>
  </div>
</template>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  padding-bottom: 20px;
  background: #fff;
  box-shadow: 0 -1px 5px 0px rgba(0, 0, 0, 0.12);
}
.item {
  flex: 1;
  height: 50px;
  text-align: center;
  color: var(--gray-text-color);
  line-height: 60px;
}
.plus {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 60px;
  height: 60px;
  background: var(--primary-color);
  color: var(--white-text-color);
  border-radius: 50%;
  transform: translateY(-10px);
  box-shadow: 0 0px 12px 0px rgba(0, 0, 0, 0.12);
}
.active {
  color: var(--primary-color);
}
</style>
