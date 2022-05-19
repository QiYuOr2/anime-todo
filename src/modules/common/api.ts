export const search = async (keywords: string, start: number = 0) => {
  const { result } = await wx.cloud.callFunction({
    name: 'bgm',
    data: {
      api: 'search',
      data: {
        keywords,
        start,
      },
    },
  });
  return result;
};

export const calendar = async () => {
  const { result } = await wx.cloud.callFunction({
    name: 'bgm',
    data: { api: 'calendar' },
  });
  return result;
};

export const getInfo = async (id: number, anime: any) => {
  const { result } = await wx.cloud.callFunction({
    name: 'bgm',
    data: {
      api: 'getInfo',
      data: {
        id,
        other: anime,
      },
    },
  });
  return result;
};
