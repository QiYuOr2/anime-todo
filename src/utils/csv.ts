export const csv = {
  /**
   * ```
   * 'a','b','c'
   * 'abc','bcd','def'
   * ‘1’,'2','3'
   * ```
   * 转化为
   * ```
   * [
   *    {
   *      "a": "abc",
   *      "b": "bcd",
   *      "c": "def"
   *    },
   *    {
   *      "a": "1",
   *      "b": "2",
   *      "c": "3"
   *    }
   * ]
   * ```
   */
  toJson(data: string) {
    const lines = data.split("\n");
    const keys = lines[0].split(",");

    return lines.slice(1).reduce<Record<string, string>[]>((result, current) => {
      result.push(
        current.split(",").reduce<Record<string, string>>((formattedItem, currentValue, index) => {
          formattedItem[keys[index]] = currentValue;
          return formattedItem;
        }, {})
      );

      return result;
    }, []);
  },

  /**
   * ```
   * [
   *    {
   *      "a": "abc",
   *      "b": "bcd",
   *      "c": "def"
   *    },
   *    {
   *      "a": "1",
   *      "b": "2",
   *      "c": "3"
   *    }
   * ]
   * ```
   * 转化为
   * ```
   * 'a','b','c'
   * 'abc','bcd','def'
   * ‘1’,'2','3'
   * ```
   */
  toCSV(data: string | Record<string, string>[]) {
    const source: Record<string, string>[] = typeof data === "string" ? JSON.parse(data) : data;

    const keys = Object.keys(data[0]).join(",");
    const values = source.map((item) => Object.values(item).join(","));
    return [keys, ...values].join("\n");
  },
};
