import http, { getBaseUrl } from '../http';
import config from '../config';
import { encodeURL } from '../utils';

const getLikeList = async (page, size) => {
    let url = await getBaseUrl('get', config.like.list);
    url += '&page=' + page;
    url += '&size=' + size;
    return http(url, 'get');
};
const postLike = async (data) => {
    let url = await getBaseUrl('post', config.like.post_like);
    return http(url, 'post', data);
};

const getMyLikeList = async (page, size) => {
    let url = await getBaseUrl('get', config.like.my_like);
    url += '&page=' + page;
    url += '&size=' + size;
    return http(url, 'get');
};
export default {
    getLikeList,
    postLike,
    getMyLikeList
};