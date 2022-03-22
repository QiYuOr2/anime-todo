const BaseUrl = `https://api.bgm.tv/`;

const request = (url: string, options?: any) =>
  new Promise((resolve, reject) => {
    uni.request({
      url: `${BaseUrl}${url}`,
      method: 'GET',
      
      data: options.data,
      success(data) {
        resolve(data);
      },
      fail(err) {
        reject(err);
      },
    });
  });

export const search = (keywords: string) => {
  return request(`search/subject/${encodeURIComponent(keywords)}`, {
    data: {
      type: 2,
      responseGroup: 'medium',
    },
  });
};
