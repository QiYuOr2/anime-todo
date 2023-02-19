import { Local } from "@/utils";
import csv from "papaparse";

export function useAnime() {
  const v2Formatter = (data: LocalList) => {
    const { list, finishList } = data;

    const setIsFinish = (value: boolean) => (anime: Anime) => ({ ...anime, is_finish: value });

    return list.map(setIsFinish(false))
      .concat(finishList.map(setIsFinish(true))) as Anime[];
  };

  const readFromLocal = () => {
    const [err, data] = Local.create().read();
    if (err) {
      return;
    }
    return v2Formatter(JSON.parse(data) as LocalList);
  };

  const toCSV = () => {
    const data = readFromLocal();
    if (!data) {
      return ''
    }
    return csv.unparse(data);
  };



  return { toCSV };
}