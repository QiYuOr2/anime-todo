declare interface Anime {
  id: number;
  title: string;
  img: string;
  desc: string;
  time: string;
  total: number;
  cur: number;
  thumb: string;
  tags: string[];
}

declare interface LocalList {
  list: Anime[];
  finishList: Anime[];
}

declare interface AnimeDTO {
  air_date?: string;
  date?: string;
  platform?: string;
  air_weekday?: number;
  id: number;
  images: {
    common: string;
    grid: string;
    large: string;
    medium: string;
    small: string;
  };
  infobox?: { key: string; value: string | { v: string }[] }[];
  name: string;
  name_cn: string;
  summary: string;
  type: number;
  url: string;
  eps: number;
  rating: {
    score: number;
    count: Record<number, number>;
    total: number;
  };
}

declare interface CalendarDTO {
  items: AnimeDTO[];
  weekday: {
    cn: string;
    en: string;
    id: number;
    ja: string;
  };
}

declare interface SearchDTO {
  list: AnimeDTO[];
  results: number;
}
