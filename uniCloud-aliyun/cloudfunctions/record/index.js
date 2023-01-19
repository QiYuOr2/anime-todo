"use strict";
const { response } = require("../common");

const db = uniCloud.database();
const user = db.collection("user");
const record = db.collection("record");

const controllers = {
  async getOne(event) {
    const { id } = event;

    const queryResult = await record.where({ id }).get();
    const targetRecord = queryResult?.data?.[0] || {};
    if (!targetRecord._id) {
      response.error("记录不存在");
    }
    return response.success(targetRecord);
  },

  async getList(event) {
    const { type, openid } = event;
    let { uid } = event;
    try {
      if (openid) {
        const queryResult = await user.where({ openid }).get();
        const targetUser = queryResult?.data?.[0] || {};
        uid = targetUser._id;
      }
      const queryOptions = { user_id: uid };
      if (type !== "all") {
        queryOptions.is_finish = type === "doing" ? false : true;
      }

      const queryResult = await record.where(queryOptions).get();
      return response.success(queryResult.data);
    } catch (error) {
      return response.error(JSON.stringify(error));
    }
  },

  async addRecord(event) {
    const { record: data, uid } = event;
    try {
      const addResult = await record.add({ ...data, user_id: uid });
      return response.success({ id: addResult._id });
    } catch (error) {
      return response.error(JSON.stringify(error));
    }
  },

  async removeRecord(event) {
    const { id } = event;
    try {
      const removeResult = await record.where({ _id: id }).remove();
      return removeResult.deleted ? response.success() : response.error("删除失败");
    } catch (error) {
      return response.error(JSON.stringify(error));
    }
  },

  async modifyRecord(event) {
    const { id, record: data } = event;
    try {
      const modifyResult = await record.where({ id }).update(data);
      return modifyResult.updated ? response.success() : response.error("更新失败");
    } catch (error) {
      return response.error(JSON.stringify(error));
    }
  },

  async modifyProgress(event) {
    const { id, progress, type } = event;

    const queryResult = await record.where({ id }).get();
    const targetRecord = queryResult?.data?.[0] || {};
    if (!targetRecord._id) {
      response.error("记录不存在");
    }

    if (type === "add") {
      targetRecord.cur = targetRecord.cur + progress;
    } else {
      targetRecord.cur = progress;
    }

    return controllers.modifyRecord({ id, record: targetRecord });
  },

  async moveToTop(event) {
    const { id } = event;

    const queryResult = await record.where({ id }).get();
    const targetRecord = queryResult?.data?.[0] || {};
    if (!targetRecord._id) {
      response.error("记录不存在");
    }

    const removeResult = await controllers.removeRecord({ id });
    if (removeResult.code === 0) {
      return controllers.addRecord({ record: targetRecord, uid: targetRecord.user_id });
    }
    return response.error(removeResult);
  },
};

exports.main = (event, context) => {
  return controllers[event.eventName](event, context);
};
