import { computed, getCurrentInstance, onMounted, ref } from "vue";

export function useEventChannel() {
  const ins = ref<any>(null);

  onMounted(() => {
    ins.value = getCurrentInstance()?.proxy;
  });

  const eventChannel = computed(() => ins.value.getOpenerEventChannel());

  const emit = <T>(name: string, data: T) => eventChannel.value.emit(name, data);

  const on = <T>(name: string, listener: (data: T) => void) => eventChannel.value.on(name, listener);

  return { emit, on };
}
