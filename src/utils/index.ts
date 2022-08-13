export * from "./local";
export * from "./request";
export * from "./path";

export const fork = <T>(value: T) => JSON.parse(JSON.stringify(value)) as T;

export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const removeOne = <T>(arr: Array<T>, index: number) => {
  const source = fork(arr);
  source.splice(index, 1);
  return source;
};

export function animeDetailFormatter(anime: any, preview: any) {
  const infoBox = anime.infobox.reduce((result: Record<string, any>, current: any) => {
    switch (current.key) {
      case "话数":
        result["total"] = Number(current.value) || preview.eps || 1;
        break;
      case "放送开始":
        result["start"] = current.value;
      case "上映年度":
        result["start"] = current.value;
      case "放送星期":
        result["weekday"] = current.value;
        break;
      default:
        break;
    }
    return result;
  }, {});

  let tags = [];
  anime.tags[0] && tags.push(anime.tags[0].name);
  anime.tags[1] && tags.push(anime.tags[2].name);

  return {
    ...infoBox,
    id: anime.id,
    thumb: anime.images.common,
    title: anime.name_cn || anime.name,
    time: infoBox.weekday && Number(infoBox.total) !== 1 ? `每${infoBox.weekday.replace("星期", "周")}更新` : "",
    desc: anime.summary.trim().slice(0, 200) + "...",
    tags,
  };
}
