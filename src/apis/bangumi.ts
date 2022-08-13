import { animeDetailFormatter, get } from "@/utils";

const BaseUrl = "https://api.bgm.tv";
function bgm(rawUrl: string) {
  const url = rawUrl.slice(0, 1) === "/" ? rawUrl : `/${rawUrl}`;
  return `${BaseUrl}${url}`;
}

export function calendar() {
  return get<CalendarDTO[]>(bgm("calendar"));
}

export function search(keywords: string, start: number = 0) {
  return get<SearchDTO>(bgm(`search/subject/${encodeURIComponent(keywords)}`), {
    type: 2,
    responseGroup: "medium",
    start,
  });
}

export function animeDetail(id: number) {
  return get<AnimeDTO>(bgm(`v0/subjects/${id}`));
}

export async function getInfo(id: number, other?: any) {
  console.log(id, other);
  const data = await get<any>(bgm(`v0/subjects/${id}`));

  return animeDetailFormatter(data, other);
}
