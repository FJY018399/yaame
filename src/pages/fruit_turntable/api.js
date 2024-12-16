/*
 * @Author: ZhaoZhiqi
 * @Date: 2023-06-26 10:45:05
 * @LastEditors: ZhaoZhiqi
 * @LastEditTime: 2023-06-28 17:37:33
 * @Description: API
 * @FilePath: \yaame-h5\src\pages\fruit_turntable\api.js
 */
import http, { getBaseUrl } from '../../lib/http';

/**
 * @description: 获取游戏信息
 * @return {*}
 */
export const getGameInfoAPI = async () => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/fruit/match');
	return http(url, 'get');
};

/**
 * @description: 加入游戏
 * @return {*}
 */
export const joinGameAPI = async () => {
	let url = await getBaseUrl('post', '/yaame/api/h5/auth/activity/fruit/match');
	return http(url, 'post');
};

/**
 * @description: 押注
 * @return {*}
 */
export const bettingAPI = async (data) => {
	let url = await getBaseUrl('put', '/yaame/api/h5/auth/activity/fruit/match');
	url += '&uid=' + data.uid;
	url += '&bean=' + data.bean;
	url += '&match_id=' + data.match_id;
	url += '&type=' + data.type;
	return http(url, 'put', data);
};

/**
 * @description: 押注记录
 * @return {*}
 */
export const getRecordsAPI = async () => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/fruit/match/betting/records');
	return http(url, 'get');
};

/**
 * @description: 排行榜
 * @return {*}
 */
export const getRankAPI = async (data) => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/fruit/match/ranking');
	url += '&startTime=' + data.startTime;
	url += '&endTime=' + data.endTime;
	url += '&uid=' + data.uid;
	return http(url, 'get');
};

/**
 * @description: 比赛记录
 * @return {*}
 */
export const getWinnerRecordsAPI = async () => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/fruit/match/records');
	return http(url, 'get');
};

/**
 * @description: 获取机器人
 * @return {*}
 */
export const getRobotsAPI = async (data) => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/fruit/match/robot');
	url += '&num=' + data.num;
	url += '&type=' + data.type;
	return http(url, 'get', data);
};

/**
 * @description: 获取服务器时间
 * @return {*}
 */
export const getCurrentTimeAPI = async () => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/fruit/match/current/time');
	return http(url, 'get');
};