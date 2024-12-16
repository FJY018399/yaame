/*
 * @Author: ZhaoZhiqi
 * @Date: 2022-09-26 19:53:14
 * @LastEditors: ZhaoZhiqi
 * @LastEditTime: 2022-09-27 16:04:55
 * @Description: 欢乐游乐园活动API
 * @FilePath: \peanut-h5\src\lib\request\happyCarnie.js
 */
import http, { getBaseUrl } from '../http';
import config from '../config';

/**
 * @description: 查询盖楼活动详情
 * @param {number} id 盖楼活动id
 * @return {*}
 */
export const getCarnieDetailAPI = async (data) => {
    let url = await getBaseUrl('get', `${config.carnie.detail}/${data.id}`);
    for (let key in data) {
        url += `&${key}=` + data[key];
    }
    return http(url, 'get');
};

/**
 * @description: 查询盖楼活动任务记录
 * @param {number} id 盖楼活动id
 * @param {number} task_id 任务id
 * @param {number} page 页码
 * @param {number} size 每页数量
 * @return {*}
 */
export const getCarnieRecordsAPI = async (data) => {
    let url = await getBaseUrl('get', config.carnie.records);
    for (let key in data) {
        url += `&${key}=` + data[key];
    }
    return http(url, 'get');
};

/**
 * @description: 查询活动v2榜单
 * @param {number} id 盖楼活动id
 * @param {number} type 榜单类型,可用值:SEND,RECEIVE
 * @param {number} page 页码
 * @param {number} size 每页数量
 * @return {*}
 */
export const getActivityRankAPI = async (data) => {
    let url = await getBaseUrl('get', config.carnie.v2rank);
    for (let key in data) {
        url += `&${key}=` + data[key];
    }
    return http(url, 'get');
};

/**
 * @description: 查询语音房状态
 * @param {number} id 房间id
 * @return {*}
 */
export const getRoomStatusAPI = async (data) => {
    let url = await getBaseUrl('get', config.carnie.room);
    for (let key in data) {
        url += `&${key}=` + data[key];
    }
    return http(url, 'get');
};