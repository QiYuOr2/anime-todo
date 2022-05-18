const BaseUrl = `https://api.bgm.tv/`;

const request: <T = any>(url: string, options?: any) => Promise<T> = (
  url,
  options
) =>
  new Promise((resolve, reject) => {
    uni.request({
      url: `${BaseUrl}${url}`,
      method: 'GET',

      data: options?.data,
      success(data) {
        resolve(data as any);
      },
      fail(err) {
        reject(err);
      },
    });
  });

export const search = (keywords: string, start: number = 0) => {
  return request(`search/subject/${encodeURIComponent(keywords)}`, {
    data: {
      type: 2,
      responseGroup: 'medium',
      start,
    },
  });
};

export const calendar = () => {
  return request(`calendar`);
};
