/*
 * @Author: ZhaoZhiqi
 * @Date: 2023-06-26 10:45:05
 * @LastEditors: ZhaoZhiqi
 * @LastEditTime: 2023-11-30 15:09:40
 * @Description: API
 * @FilePath: \yaame-h5\src\pages\greedy\api.js
 */
import http, { getBaseUrl } from '../../lib/http';

/**
 * @description: 获取游戏信息
 * @return {*}
 */
export const getGameInfoAPI = async (data) => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/stake/home');
	url += `&languageType=${data.languageType}`;
	url += '&activityType=GREEDY_BABY';
	return http(url, 'get');
};

/**
 * @description: 加入游戏
 * @return {*}
 */
export const joinGameAPI = async (data) => {
	let url = await getBaseUrl('post', '/yaame/api/h5/auth/activity/stake/join');
	return http(url, 'post', data);
};

/**
 * @description: 押注
 * @return {*}
 */
export const bettingAPI = async (data) => {
	let url = await getBaseUrl('post', '/yaame/api/h5/auth/activity/stake/betting');
	return http(url, 'post', data);
};

/**
 * @description: 比赛记录
 * @return {*}
 */
export const getRecordsAPI = async (data) => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/stake/enroll/records');
	url += `&languageType=${data.languageType}`;
	url += '&activityType=GREEDY_BABY';
	url += '&page=1';
	url += '&size=100';
	return http(url, 'get');	
};

/**
 * @description: 获取服务器时间
 * @return {*}
 */
export const getCurrentTimeAPI = async () => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/stake/current/time');
	return http(url, 'get');
};

/**
 * @description: 查看中奖结果
 * @return {*}
 */
export const getResultAPI = async (data) => {
	let url = await getBaseUrl('get', '/yaame/api/h5/auth/activity/stake/match');
	url += `&languageType=${data.languageType}`;
	url += `&activityType=GREEDY_BABY`;
	url += `&matchRecordId=${data.match_record_id}`;
	return http(url, 'get');
}