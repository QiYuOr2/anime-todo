export function request<T>(url: string, options?: Partial<UniApp.RequestOptions>): Promise<T> {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      url,
      // 小程序不支持修改user agent
      // header: {
      //   "User-Agent": "Y-Anime v1.0.0",
      // },
      success(response) {
        resolve(response.data as T);
      },
      fail: reject,
    });
  });
}

export function get<T>(url: string, params?: Record<string, unknown>) {
  return request<T>(url, { method: "GET", data: params });
}

export function post<T>(url: string, params?: Record<string, unknown>) {
  return request<T>(url, { method: "POST", data: params });
}
