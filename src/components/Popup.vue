<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import { computed } from "vue";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (event: "update:visible", value: boolean): void;
}>();

const selfVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    return emit("update:visible", value);
  },
});

const [isLeave, toggleIsLeave] = useToggle(false);

const close = () => {
  toggleIsLeave(true);
  setTimeout(() => {
    toggleIsLeave(false);
    emit("update:visible", false);
  }, 300);
};
</script>

<template>
  <div v-if="selfVisible" :class="['mask', { 'mask--leave': isLeave }]" @click="close" @touchmove.prevent=""></div>
  <div v-if="selfVisible" :class="['popup', { 'popup--leave': isLeave }]">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);

  animation: fade-in 0.3s ease forwards;
  &--leave {
    animation: fade-out 0.3s ease forwards;
  }
}

.popup {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2001;
  max-height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  border-radius: 16px 16px 0 0;
  background: #fff;

  animation: enter 0.3s ease forwards;
  &--leave {
    animation: leave 0.3s ease forwards;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes enter {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes leave {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
}
</style>
