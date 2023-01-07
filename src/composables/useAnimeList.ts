import { Local, switchValue } from "@/utils";
import { onShow } from "@dcloudio/uni-app";
import { get, set } from "@vueuse/core";
import { computed, ref } from "vue";

export enum AnimeLocalSource {
  Doing,
  Done,
}

export function useAnimeList(source: AnimeLocalSource) {
  const list = ref<Anime[]>([]);

  const readFromLocal: () => LocalList = () => {
    const fs = Local.create();
    const [err, data] = fs.read();
    if (err) {
      // uni.showToast({ icon: 'none', title: '数据读取错误' });
      return;
    }
    return JSON.parse(data);
  };

  onShow(() => {
    const localList = readFromLocal();
    set(
      list,
      switchValue(source, {
        [AnimeLocalSource.Doing]: localList.list,
        [AnimeLocalSource.Done]: localList.finishList,
      })
    );
  });

  const modify = (id: number, anime: Anime | ((prev: Anime) => Anime)) => {
    set(
      list,
      get(list).map((item) => {
        if (item.id === id) {
          return typeof anime === "function" ? anime(item) : anime;
        }
        return item;
      })
    );
    save();
  };

  const modifyProgress = (id: number, progress: number, type: "add" | "modify" = "add") => {
    const anime = getOne(id);
    if (type === "add") {
      anime.cur = anime.cur + progress;
    } else {
      anime.cur = progress;
    }
    modify(id, anime);

    return anime;
  };

  const remove = (id: number) => {
    set(
      list,
      get(list).filter((item) => item.id !== id)
    );

    save();
  };

  const save = () => {
    const current = readFromLocal();

    const updatedValue = switchValue<AnimeLocalSource, LocalList>(source, {
      [AnimeLocalSource.Doing]: { list: get(list), finishList: current.finishList },
      [AnimeLocalSource.Done]: { list: current.list, finishList: get(list) },
    })!;

    Local.create().write(JSON.stringify(updatedValue));
  };

  const getOne = (id: number) => {
    return get(list).filter((item) => item.id === id)?.[0];
  };

  const add = (anime: Anime) => {
    const oldList = list.value.slice(0);
    oldList.push(anime);
    list.value = oldList;

    save();
  };

  return { value: list, add, modify, save, remove, getOne, modifyProgress };
}
