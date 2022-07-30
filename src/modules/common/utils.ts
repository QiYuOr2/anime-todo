export const fork = <T>(value: T) => JSON.parse(JSON.stringify(value)) as T;

export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

export const removeOne = <T>(arr: Array<T>, index: number) => {
  const source = fork(arr);
  source.splice(index, 1);
  return source;
};
