import { csv, Local } from "@/utils";

export function useAnime() {
  const readFromLocal = () => {
    const [err, data] = Local.create().read();
    if (err) {
      return;
    }

    return csv.toCSV(data);
  };

  return { readFromLocal };
}