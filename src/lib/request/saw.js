import http, { getBaseUrl } from '../http';
import config from '../config';
import { encodeURL } from '../utils';

const getSawList = async (page, size) => {
    let url = await getBaseUrl('get', config.saw.list);
    url += '&page=' + page;
    url += '&size=' + size;
    return http(url, 'get');
};

const payAttention = async (target_uid) => {
    let url = await getBaseUrl('post', config.saw.attentions);
    // url += '&target_uid=' + target_uid;
    return http(url, 'post', target_uid);
};

const cancelAttention = async (target_uid) => {
    let url = await getBaseUrl('delete', config.saw.attentions);
    // url += '&target_uid=' + target_uid;
    return http(url, 'delete', target_uid);
};

const getRoomBlindHeartDetails = async (params) => {
    let url = await getBaseUrl('get', config.room.heart.details);
    url += '&live_record_id=' + params.live_record_id;
    url += '&mike=' + params.mike;
    return http(url, 'get');
};

const getRoomBlindHandWall = async () => {
    let url = await getBaseUrl('get', config.room.wall);
    return http(url, 'get');
};

export default {
    getSawList,
    payAttention,
    cancelAttention,
    getRoomBlindHeartDetails,
    getRoomBlindHandWall
};