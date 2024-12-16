import http, { getBaseUrl } from '../http';
import config from '../config';
import { encodeURL } from '../utils';

const getAccountInfo = async (p_index, p_size) => {
    let url = await getBaseUrl('get', config.withdraw.account);
    url += '&p_index=' + p_index;
    url += '&p_size=' + p_size;
    return http(url, 'get');
};

const getWithDrawProgress = async () => {
    let url = await getBaseUrl('get', config.withdraw.progress);
    return http(url, 'get');
};

const getWithDrawDetail = async () => {
    let url = await getBaseUrl('get', config.withdraw.detail);
    return http(url, 'get');
};

const postWithdraw = async (data) => {
    let url = await getBaseUrl('post', config.withdraw.post_withdraw);
    return http(url, 'post', data);
};

const postWithdrawCustom = async (data) => {
    let url = await getBaseUrl('post', config.withdraw.post_withdraw_custom);
    return http(url, 'post', data);
};

const checkWithdraw = async () => {
    let url = await getBaseUrl('get', config.withdraw.check);
    return http(url, 'get');
};
const bindAccount = async (data) => {
    let url = await getBaseUrl('post', config.withdraw.bind);
    return http(url, 'post', data);
};

const getBankInfo = async (account) => {
    let url = await getBaseUrl('get', config.withdraw.bank);
    url += '&account=' + account;
    return http(url, 'get');
};

const getWithdrawcode = async () => {
    let url = await getBaseUrl('get', config.withdraw.sms);
    return http(url, 'get');
};

const hasThirdAccount = async () => {
    let url = await getBaseUrl('get', config.withdraw.has_third_account);
    return http(url, 'get');
};
const auth = async () => {
    let auth_api_url = 'https://cloud-server.weli010.cn/api/wx/info/wlkk?forward=' + encodeURIComponent(`${location.href}`);
    let encode_redirect_url = encodeURIComponent(auth_api_url);
    let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb682537790841859&redirect_uri=' + encode_redirect_url + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
    location.href = url;
};

const getWithDrawRecord = async () => {
    let url = await getBaseUrl('get', config.withdraw.record);
    return http(url, 'get');
};

const withdrawal = async (id) => {
    let url = await getBaseUrl('get', config.withdraw.cancel);
    url += '&order_id=' + id;
    return http(url, 'get');
};

const exchangeDiamonds = async (diamonds) => {
    let url = await getBaseUrl('get', config.withdraw.exchange);
    url += '&diamonds=' + diamonds;
    return http(url, 'get');
};

const getGuildsApplies = async (page, size, request_from) => {
    let url = await getBaseUrl('get', config.guilds.list);
    url += '&page=' + page;
    url += '&size=' + size;
    url += '&request_from=' + size;
    return http(url, 'get');
};

const postGuildsApplies = async (data) => {
    let url = await getBaseUrl('post', config.guilds.list);
    return http(url, 'post', data);
};

const putGuildsApplies = async (id, status) => {
    let url = await getBaseUrl('put', `${config.guilds.list}/${id}`);
    url += '&status=' + status;
    return http(url, 'put');
};

const getStatisticChargeList = async () => {
    let url = await getBaseUrl('get', `${config.statistic.charge}`);
    return http(url, 'get');
};

const getGuildsUsersList = async (params) => {
    let url = await getBaseUrl('get', config.guilds.users);
    return http(`${url}&${encodeURL(params)}`, 'get');
};

const getGuildsInviteList = async (page, size) => {
    let url = await getBaseUrl('get', config.guilds.inviteList);
    url += '&page=' + page;
    url += '&size=' + size;
    return http(url, 'get');
};

const quitGuildsUsers = async (data) => {
    let url = await getBaseUrl('post', config.guilds.quit);
    return http(url, 'post', data);
};

const deleteGuildsUsers = async (data) => {
    let url = await getBaseUrl('post', config.guilds.delete);
    return http(url, 'post', data);
};

const queryGuildsUserInfo = async (yaame_id) => {
    let url = await getBaseUrl('get', config.guilds.query);
    url += '&yaame_id=' + yaame_id;
    return http(url, 'get');
};

const inviteGuildsUser = async (data) => {
    let url = await getBaseUrl('post', config.guilds.invite);
    return http(url, 'post', data);
};

const inviteVerification = async (data) => {
    let url = await getBaseUrl('post', config.guilds.verification);
    return http(url, 'post', data);
};

const deleteGuildsUsersListItem = async (uid) => {
    let url = await getBaseUrl('delete', `${config.guilds.users}/${uid}`);
    return http(url, 'delete');
};

const deleteGuildsUsersForced = async (uid) => {
    let url = await getBaseUrl('delete', `${config.guilds.getOut}`);
    url += '&uid=' + uid;
    return http(url, 'delete');
};

const getGuildsUserDetails = async (uid, daily, end) => {
    let url = await getBaseUrl('get', `${config.guilds.messages}`);
    url += '&target_uid=' + uid;
    url += '&daily=' + daily;
    url += '&end=' + end;
    return http(url, 'get');
};

const getGuildsRoomsFlows = async (daily, type) => {
    let url = await getBaseUrl('get', `${config.guilds.flows}`);
    url += '&daily=' + daily;
    url += '&type=' + type;
    return http(url, 'get');
};

export default {
    getAccountInfo,
    getWithDrawProgress,
    getWithDrawDetail,
    postWithdraw,
    postWithdrawCustom,
    bindAccount,
    getBankInfo,
    getWithdrawcode,
    auth,
    checkWithdraw,
    hasThirdAccount,
    getWithDrawRecord,
    exchangeDiamonds,
    withdrawal,
    getGuildsApplies,
    postGuildsApplies,
    putGuildsApplies,
    getStatisticChargeList,
    getGuildsUsersList,
    deleteGuildsUsersListItem,
    deleteGuildsUsersForced,
    getGuildsUserDetails,
    getGuildsRoomsFlows,

    quitGuildsUsers,
    deleteGuildsUsers,
    queryGuildsUserInfo,
    inviteGuildsUser,
    getGuildsInviteList,
    inviteVerification
};