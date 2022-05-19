const cloud = require('wx-server-sdk');
const axios = require('axios');

cloud.init();

const BaseUrl = `https://api.bgm.tv/`;

const headers = {
  'User-Agent': 'Y-Anime v1.0.0',
};

const calendar = async () => {
  const { data } = await axios.get(`${BaseUrl}calendar`, {
    headers,
  });
  return { data, api: 'calendar' };
};

const search = async ({ keywords, start }) => {
  const { data } = await axios.get(
    `${BaseUrl}search/subject/${encodeURIComponent(keywords)}`,
    {
      headers,
      params: {
        type: 2,
        responseGroup: 'medium',
        start,
      },
    }
  );
  return { data, api: 'search' };
};

const getInfo = async ({ id, other }) => {
  const { data } = await axios.get(`${BaseUrl}v0/subjects/${id}`, { headers });
  const infoBox = data.infobox.reduce((result, current) => {
    switch (current.key) {
      case '话数':
        result['total'] = Number(current.value) || other.eps;
        break;
      case '放送开始':
        result['start'] = current.value;
      case '上映年度':
        result['start'] = current.value;
      case '放送星期':
        result['weekday'] = current.value;
        break;
      default:
        break;
    }
    return result;
  }, {});

  let tags = [];
  data.tags[0] && tags.push(data.tags[0].name);
  data.tags[1] && tags.push(data.tags[2].name);

  return {
    data: {
      ...infoBox,
      thumb: data.images.common,
      title: data.name_cn || data.name,
      time:
        infoBox.weekday && Number(infoBox.total) !== 1
          ? `每${infoBox.weekday.replace('星期', '周')}更新`
          : '',
      desc: data.summary.trim().slice(0, 200) + '...',
      tags,
    },
    api: 'getInfo',
  };
};

const APIMap = {
  calendar: calendar,
  search: search,
  getInfo: getInfo,
};

exports.main = async (event, context) => {
  console.log(event);
  const { api, data } = event;
  const result = await APIMap[api](data);
  return result;
};
