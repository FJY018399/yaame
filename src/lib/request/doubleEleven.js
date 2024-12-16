import http, { getBaseUrl } from '../http';
import config from '../config';

 
// 活动v2榜单
const collectionRankList = async (options)=>{
  let url = await getBaseUrl('get', config.halloween.rank);
  url += '&id=' + 7; 
  url += '&type=' + options.type; 
  url += '&page=' + options.page; 
  url += '&size=' + options.size;
  return http(url, 'get');

}
 

 

 

 

 

 
 

export default {
  collectionRankList
};