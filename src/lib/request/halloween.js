import http, { getBaseUrl } from "../http";
import config from "../config";
import { encodeURL } from "../utils";

// 奖盘信息
export const getHalloweenInfo = async () => {
	let url = await getBaseUrl("get", config.halloween.info);
	return http(url, "get");
};

// 抽奖
export const getHalloweenDraw = async (data) => {
    let url = await getBaseUrl("post", config.halloween.lottery);
    return http(url, 'post', data);
};

// 轮播信息
export const getHalloweenNotice = async () => {
    let url = await getBaseUrl("get", config.halloween.popupInfo);
    return http(url, 'get');
};

// 万圣节rank列表接口
export const getHalloweenRankList = async (params) => {
    let url = await getBaseUrl("get", config.halloween.rank);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};

// 用户中奖信息
export const getHalloweenUserLottery = async () => {
    let url = await getBaseUrl("get", config.halloween.userWinInfo);
    return http(url, 'get');
};


export default {
	getHalloweenInfo,
    getHalloweenDraw,
    getHalloweenNotice,
    getHalloweenRankList,
    getHalloweenUserLottery
};
