"use strict";
const APPID = "wx29813b3365938a41";
const SECRET = "61f0e2826c395e26b9b338dbbe3ce751";

const db = uniCloud.database();
const user = db.collection("user");

const response = {
  error(message) {
    return { code: 1, message, data: null };
  },
  success(data) {
    return { code: 0, message: "success", data };
  },
};

const login = async (event, context) => {
  const { code } = event;
  const URL = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`;
  const result = await uniCloud.httpclient.request(URL, {
    method: "GET",
    dataType: "json",
  });
  console.log(result);

  if (result.status === 200) {
    const { openid } = result.data;
    const queryResult = await user.where({ openid }).limit(1).get();
    const maybeUser = queryResult?.data?.[0] || {};

    if (!maybeUser._id) {
      const addResult = await user.add({ openid });
      return response.success({ id: addResult._id });
    }
    return response.success({ id: maybeUser._id });
  }

  return response.error("请求错误");
};

exports.main = async (event, context) => {
  //event为客户端上传的参数
  console.log("event : ", event);
  const { eventName } = event;

  switch (eventName) {
    case "login":
      return await login(event, context);
  }
};
