/*
 * @Author: Se7enElk
 * @Date: 2022-04-07 16:48:31
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-21 14:44:24
 * @FilePath: /yaame-h5/src/lib/request/contribution.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import config from '../config';
import { encodeURL } from '../utils';

const getContributeRank = async (params) => {
    let url = await getBaseUrl('get', config.contribution.list);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};
const getContributeCPRank = async (params) => {
    let url = await getBaseUrl('get', config.contribution.cp);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};

const getContributeRankRooms = async (params) => {
    let url = await getBaseUrl('get', config.contribution.rooms);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};


const getRoomUserRank = async (params) => {
    let url = await getBaseUrl('get', config.contribution.user);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};

const getAllGuildsRoom = async (params) => {
    let url = await getBaseUrl('get', config.guilds.rooms);
    url = `${url}`;
    return http(url, 'get');
};

const getContributeRewards = async (params) => {
    let url = await getBaseUrl('get', config.contribution.rewards);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};

const getIncomeConfig = async (params) => {
    let url = await getBaseUrl('get', config.guilds.income.config);
    return http(url, 'get');
};

const getIncomeDaily = async (params) => {
    let url = await getBaseUrl('get', config.guilds.income.daily);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

const getIncomeRearDaily = async (params) => {
    let url = await getBaseUrl('get', config.guilds.income.users);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

const getIncomeFlows = async (params) => {
    let url = await getBaseUrl('get', config.guilds.income.flows);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

const getIncomeMonth = async (params) => {
    let url = await getBaseUrl('get', config.guilds.income.month);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
}

const getRoomActiveRank = async () => {
    let url = await getBaseUrl('get', config.contribution.rooms.rank);
    return http(url, 'get');
};

const getRoomActiveRules = async () => {
    let url = await getBaseUrl('get', config.contribution.rooms.rule);
    return http(url, 'get');
};
// 公会会长查看收益
const getChairmanDaily = async (params) => {
    let url = await getBaseUrl('get', config.guilds.chairman.daily);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};
const getChairmanSettlements = async (params) => {
    let url = await getBaseUrl('get', config.guilds.chairman.settlements);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};
const getChairmanMonth = async (params) => {
    let url = await getBaseUrl('get', config.guilds.chairman.month);
    url = `${url}&${encodeURL(params)}`;
    return http(url, 'get');
};

const getCPRewards = async () => {
    let url = await getBaseUrl('get', config.contribution.cpRewards);
    return http(url, 'get');
};

export default {
    getContributeRank,
    getContributeRankRooms,
    getRoomUserRank,
    getAllGuildsRoom,

    getContributeRewards,

    getIncomeConfig,
    getIncomeDaily,
    getIncomeRearDaily,
    getIncomeMonth,
    getIncomeFlows,

    getRoomActiveRank,
    getRoomActiveRules,

    getChairmanDaily,
    getChairmanMonth,
    getChairmanSettlements,

    getContributeCPRank,

    getCPRewards,
};