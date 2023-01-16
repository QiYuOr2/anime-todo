"use strict";
const { response } = require("../common");

const db = uniCloud.database();
const user = db.collection("user");
const record = db.collection("record");

const getList = async (event) => {
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
};

const addRecord = async (event) => {
  const { record: data, uid } = event;
  try {
    const addResult = await record.add({ ...data, user_id: uid });
    return response.success({ id: addResult._id });
  } catch (error) {
    return response.error(JSON.stringify(error));
  }
};

const removeRecord = async (event) => {
  const { id } = event;
  try {
    const removeResult = await record.where({ _id: id }).remove();
    return removeResult.deleted ? response.success() : response.error("删除失败");
  } catch (error) {
    return response.error(JSON.stringify(error));
  }
};

const modifyRecord = async (event) => {
  const { id, record: data } = event;
  try {
    const modifyResult = await record.where({ id }).update(data);
    return modifyResult.updated ? response.success() : response.error("更新失败");
  } catch (error) {
    return response.error(JSON.stringify(error));
  }
};

exports.main = async (event, context) => {
  const { eventName } = event;

  switch (eventName) {
    case "getList":
      return await getList(event);
    case "addRecord":
      return await addRecord(event);
    case "removeRecord":
      return await removeRecord(event);
    case "modifyRecord":
      return await modifyRecord(event);
  }
};
