/*
 * @Author: Se7enElk
 * @Date: 2022-01-14 19:05:11
 * @LastEditors: Do not edit
 * @LastEditTime: 2022-02-22 18:55:17
 * @FilePath: /peanut_h5/src/lib/request/upload_music.js
 * @Description: 
 */
import http, { getBaseUrl } from '../http';
import axios from 'axios';


// 获取音乐文件列表
export const getMusicListApi = async (roomId, page, size) => {
    let url = await getBaseUrl('get', '/peanut/api/h5/auth/voice/rooms/music');
    url += '&page=' + page;
    url += '&size=' + size;
    url += '&roomId=' + roomId;
    return http(url, 'get');
};

// 获取签名
export const getSignApi = async (content_md5, type) => {
    let url = await getBaseUrl('post', '/peanut/api/h5/ufile/applyAuth');
    return http(url, 'post', {
        bucket_type: 'AUDIO',
        content_md5,
        content_type: type
    });
};

// 添加音乐
export const addMusicApi = async (roomId, contentMd5, name, musicUrl, songName, singer, contentSize, uploader) => {
    let url = await getBaseUrl('post', '/peanut/api/h5/auth/voice/rooms/music');
    url += '&roomId=' + roomId;
    url += '&contentMd5=' + contentMd5;
    url += '&name=' + name;
    url += '&url=' + musicUrl;
    url += '&songName=' + songName;
    url += '&singer=' + singer;
    url += '&contentSize=' + contentSize;
    url += '&uploader=' + uploader;
    return http(url, 'post');
};

// 上传音乐
export const uploadMusicApi = (authorization, file, md5, host_url) => {
    const bodyFormData = new FormData();
    bodyFormData.append('FileName', host_url.replace('http://peanut-oss.cn-bj.ufileos.com/', ''));
    bodyFormData.append('Authorization', authorization);
    bodyFormData.append('Content-Type', file.type);
    bodyFormData.append('file', file);
    return axios({
        method: 'post',
        url: host_url.replace('http://', 'https://'),
        data: bodyFormData
    }).then(res => {
        if (!res) {
            return {
                status: 1000
            };
        } else {
            return {
                status: 1007
            };
        }
    });
};
