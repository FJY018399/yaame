/*
 * @Author: Elk
 * @Date: 2024-08-23 18:20:41
 * @FilePath: /yaame-h5/src/lib/request/draw.js
 * @Description: 
 */
import http, { getBaseUrl } from "../http";
import config from "../config";
import { encodeURL } from "../utils";

// 奖盘信息
export const getPolLotteryInfo = async (params) => {
	let url = await getBaseUrl("get", config.draw.home);
    url = `${url}&${encodeURL(params)}`;
	return http(url, "get");
};
// 抽奖操作
export const postPolLottery = async (params) => {
    let url = await getBaseUrl("post", config.draw.lottery);
    return http(url, "post", params);
};
// 必赚抽奖操作
export const postPolLotterySure = async (params) => {
    let url = await getBaseUrl("post", config.draw.sure);
    return http(url, "post", params);
};

export const getPolLotteryLog = async (params) => {
	let url = await getBaseUrl("get", config.draw.log);
    url = `${url}&${encodeURL(params)}`;
	return http(url, "get");
};

export const getPolLotteryTop = async (params) => {
    let url = await getBaseUrl("get", config.draw.rank);
    url = `${url}&${encodeURL(params)}`;
    return http(url, "get");
}

// ============================== 大魔王=================================
// 获取首页信息
export  const getDemonKingInfo = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/monster/home');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

// 抽奖奖品数据
export const getDemonKingReward = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/monster/rewards');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

// 武器列表

export const getDemonKingWeapon = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/monster/weapons');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

// 英雄榜
export const getDemonKingHero = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/monster/hero/rank');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

// 伤害榜
export const getDemonKingDamage = async (params) => {
    let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/monster/harm/rank');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

// 攻击魔王
export const postDemonKingAttack = async (params) => {
    let url = await getBaseUrl('post', '/yaame/api/h5/auth/activity/monster/attack');
    return http(url, 'post', params);
}
// ============================== 大魔王 End=================================


export const getPolLotteryTaskList = async () => {
    let url = await getBaseUrl("get", '/yaame/api/h5/auth/activity/invite/task');
    return http(url, "get");
}


// 查询条件弹框接口
export const getCommonDialog = async (params) => {
    let url = await getBaseUrl("get", '/yaame/api/h5/common/criteria/dialog');
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

export default {
	getPolLotteryInfo,
    postPolLottery,
    postPolLotterySure, 
    getPolLotteryLog,
    getPolLotteryTop,

    // 大魔王
    getDemonKingInfo,
    getDemonKingReward,
    getDemonKingWeapon,
    getDemonKingHero,
    getDemonKingDamage,
    postDemonKingAttack,

    getPolLotteryTaskList,

    getCommonDialog
};
