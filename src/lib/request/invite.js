import http, { getBaseUrl } from '../http';
import config from '../config';

const getInviteHome = async (languageType) => {
    let url = await getBaseUrl('get', config.invite.home);
    url += '&languageType=' + languageType;
    return http(url, 'get');
};

const getInviteInfo = async (languageType) => {
    let url = await getBaseUrl('get', config.invite.info);
    url += '&languageType=' + languageType;
    return http(url, 'get');
}

const getInviteRecord = async (languageType, page, size, timestamp, pageCursor) => {
    let url = await getBaseUrl('get', config.invite.record);
    url += '&languageType=' + languageType;
    url += '&page=' + page;
    url += '&size=' + size;
    url += '&timestamp=' + timestamp;
    url += '&pageCursor=' + pageCursor;
    return http(url, 'get');
}

const inviteCodeBind = async (data) => {
    let url = await getBaseUrl('get', config.invite.info);
    return http(url, 'get', data);
}

export {
    getInviteHome,
    getInviteInfo,
    getInviteRecord,
    inviteCodeBind
}