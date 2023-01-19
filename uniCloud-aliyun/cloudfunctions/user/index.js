"use strict";
const { response, config } = require("../common");

const { APPID, SECRET } = config;

const db = uniCloud.database();
const user = db.collection("user");

const controllers = {
  async login(event, context) {
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
  },

  async getUserSyncStatus(event, context) {
    const { id } = event;
    const queryResult = await user.where({ _id: id }).get();
    const resultUser = queryResult?.data?.[0] || {};

    console.log(resultUser);

    if (resultUser._id) {
      if (resultUser.is_sync === undefined) {
        resultUser.is_sync = false;
        await user.where({ _id: id }).update({ is_sync: false });
      }

      return response.success({ synced: resultUser.is_sync });
    }
    return response.error("未找到该用户");
  },

  async setUserSyncStatus(event, context) {
    const { id, synced } = event;
    const queryResult = await user.where({ _id: id }).get();
    const resultUser = queryResult?.data?.[0] || {};

    console.log(resultUser);

    if (resultUser._id) {
      const updateResult = await user.where({ _id: id }).update({ is_sync: synced });

      return updateResult.updated ? response.success() : response.error("更新失败");
    }
    return response.error("未找到该用户");
  },
};

exports.main = (event, context) => {
  return controllers[event.eventName](event, context);
};
