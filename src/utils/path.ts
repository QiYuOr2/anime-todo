export function setQueryString(url: string, options: Record<string, string | number | boolean> = {}) {
  const optionsStr = Object.keys(options).reduce((result, key) => {
    const kv = `${key}=${options[key]}`;
    return result + `&${kv}`;
  }, "?");
  return `${url}${optionsStr}`;
}
