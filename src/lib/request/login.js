import http, { getBaseUrl } from '../http';
import config from '../config';
import { getDevid } from '../../lib/device';

const getVerifycode = async (phone) => {
    let url = await getBaseUrl('get', config.login.code);
    url += '&phone=' + phone;
    url += '&area_code=86';
    url += '&type=sms';
    url += '&device_id=' + getDevid();
    return http(url, 'get');
};

const login = async (data) => {
    let url = await getBaseUrl('post', config.login.login);
    return http(url, 'post', data);
};
export default {
    login,
    getVerifycode
};