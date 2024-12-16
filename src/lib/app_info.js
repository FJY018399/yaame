/*
 * @Author: lianxiaoxia@weli.cn
 * @Date: 2023-02-01 15:36:32
 * @LastEditors: Please set LastEditors
 * @Description:
 * @FilePath: /yaame_h5/src/lib/app_info.js
 */
import { getAppType, getVerCode, getChannel } from './device';
import {
  getQueryString,
  getStrBeforeNum,
  getStrBeforeStrikethrough,
} from './utils.js';

// 公司主体
const company_subject = {
  yongle: {
    company_name: '涌乐',
    full_company_name: '北京涌乐科技有限公司',
    company_address: '北京市丰台区金泽路161号院1号楼-4至43层101内10层01B单元',
    telephone: '010-84719868',
    location: '北京市丰台区',
  },
  huanxinliyue: {
    company_name: '欢欣鲤跃',
    full_company_name: '北京欢欣鲤跃科技有限公司',
    company_address: '北京市丰台区金泽路161号院1号楼-4至43层101内10层02B单元',
    telephone: '010-64742391',
    location: '北京市丰台区',
  },
  zhongxuanwenhua: {
    company_name: '沈阳中轩文化',
    full_company_name: '沈阳中轩文化科技有限公司',
    company_address: '辽宁省沈阳市浑南区新隆街1-26号（2105）',
    telephone: '010-64739846',
    location: '辽宁省沈阳市浑南区',
  },
  liyuehudong: {
    company_name: '鲤跃互动',
    full_company_name: '北京鲤跃互动文化科技有限公司',
    company_address: '北京市丰台区金泽路161号院1号楼-4至43层101内10层01C单元',
    telephone: '010-64742391',
    location: '北京市丰台区',
  },
};

// app主体
const subject = {
  yaame: {
    app_name: '蘑菇语音',
    company_id: 'yongle',
    email: 'moguyuyin@yonglekj.com',
    theme: 'default',
  },
  sweet: {
    app_name: '西柚',
    company_id: 'huanxinliyue',
    email: 'xiyou@hxlyapp.net',
    theme: 'default',
    channels: ['vivo'],
    channel_details: {
      vivo: {
        app_name: '欢欣西柚',
        company_id: 'huanxinliyue',
        email: 'xiyou@hxlyapp.net',
        theme: 'default',
      },
    },
  },
  cu: {
    app_name: 'CU语音',
    company_id: 'huanxinliyue',
    email: 'xiyou@hxlyapp.net',
    theme: 'default',
  },
  planet: {
    app_name: '蘑咕咕',
    company_id: 'zhongxuanwenhua',
    email: 'moguyuyin@yonglekj.com',
    theme: 'default',
    channels: ['appstore', 'bizhi', 'tutu'],
    // ios包，公司主体与安卓不一样，用c=appstore区分
    channel_details: {
      appstore: {
        app_name: 'TuTu',
        company_id: 'liyuehudong',
        email: 'moguyuyin@yonglekj.comt',
        theme: 'dark',
      },
      bizhi: {
        app_name: 'TuTu壁纸',
        company_id: 'liyuehudong',
        email: 'moguyuyin@yonglekj.comt',
        theme: 'dark',
      },
      tutu: {
        app_name: 'TuTu',
        company_id: 'liyuehudong',
        email: 'moguyuyin@yonglekj.comt',
        theme: 'dark',
      },
    },
  },
};

const getAppInfo = () => {
  /**
   * a_type: url参数，用于应用商店申请
   * app_type: user_agent里面的参数
   * a_type、app_type都为空时默认 'yaame'
   *
   */
  let app_type = getQueryString('app_type').trim() || getAppType() || 'yaame';
  let channel = getQueryString('c') || getChannel() || 'default';
  let app = subject[app_type] || subject['yaame'];
  // 获取渠道开头，比如vivo就获取到vivo，如果是miyuding01-01就获取到miyuding（第一个数字前的渠道号）
  let match_channel = getStrBeforeNum(channel);
  match_channel = getStrBeforeStrikethrough(match_channel);
  if (app.channels && app.channels.indexOf(match_channel) > -1) {
    let app_channel = app.channel_details[match_channel];
    return Object.assign(app_channel, company_subject[app_channel.company_id]);
  }
  return Object.assign(app, company_subject[app.company_id]);
};

export default {
  app_info: getAppInfo(),
};
