import http, { getBaseUrl } from '../http';
import config from '../config';
import { encodeURL } from '../utils';
// const getDragonBoatList = (type, page, size) => {
//     let url = await getBaseUrl('get', config.dragon_boat.activity);
//     url += '&page=' + page;
//     url += '&size=' + size;
//     url += '&type=' + type;
//     return http(url, 'get');
// };

const getNewcomerInfo = async () => {
  let url = await getBaseUrl('get', config.newcomer.info);
  return http(url, 'get');
};

// VIP落地页
const getVIPHome = async () => {
  let url = await getBaseUrl('get', config.activity.vipHome);
  return http(url, 'get');
};
// 领取VIP礼物
const getVipReward = async data => {
  let url = await getBaseUrl('post', config.activity.vipReward);
  return http(url, 'post', data);
};

// 万圣节活动
const getHalloweenInfo = async () => {
  let url = await getBaseUrl('get', config.activity.halloween);
  return http(url, 'get');
};

// 双十一
const getDoubleElevenInfo = async () => {
  let url = await getBaseUrl('get', config.activity.doubleEleven);
  return http(url, 'get');
};

// 感恩节
const getThanksgivingInfo = async () => {
  let url = await getBaseUrl('get', config.activity.thanksgiving);
  return http(url, 'get');
};

const getThanksgivingGashapon = async () => {
  let url = await getBaseUrl('get', config.activity.thanksgiving_gashapon);
  return http(url, 'get');
};

const getWeekStarIndex = async () => {
  let url = await getBaseUrl('get', config.activity.weekStar);
  return http(url, 'get');
};

const getChristmasIndex = async () => {
  let url = await getBaseUrl('get', config.activity.christmas);
  return http(url, 'get');
};

const getChristmasRank = async (params) => {
    let url = await getBaseUrl('get', config.activity.christmasRank);
  return http(`${url}&${encodeURL(params)}`, 'get');
};

const buyChristmasCar = async (params) => {
    let url = await getBaseUrl('post', config.activity.christmasBuy);
  return http(`${url}&${encodeURL(params)}`, 'post');
}

const getNewYearsIndex = async () => {
  let url = await getBaseUrl('get', config.activity.newYears);
  return http(url, 'get');
};
const getNewYearsAvatar = async data => {
  let url = await getBaseUrl('post', config.activity.newYearsAvatar);
  return http(url, 'post', data);
};

const getNewYearsGift = async data => {
  let url = await getBaseUrl('post', config.activity.newYearsGift);
  url += '&gift_id=' + data.gift_id;
  return http(url, 'post', data);
};

const getAnnualIndex = async () => {
  let url = await getBaseUrl('get', config.activity.annual);
  return http(url, 'get');
};

const getHigherupInfo = async () => {
  let url = await getBaseUrl('get', config.activity.higherup);
  return http(url, 'get');
};

const getTigerSend = async () => {
  let url = await getBaseUrl('get', config.activity.tigerSend);
  return http(url, 'get');
};

const getTigerSendInfo = async options => {
  let url = await getBaseUrl('get', config.activity.tigerSendIndex);
  // url += '&uid=' + options.uid;
  return http(url, 'get');
};

const getNianShouInfo = async () => {
  let url = await getBaseUrl('get', config.activity.nianshou);
  return http(url, 'get');
};

const postNianShouAttack = async data => {
  let url = await getBaseUrl('post', config.activity.nianshou_attack);
  return http(url, 'post', JSON.stringify(data));
};

const getNianShouRecord = async data => {
  let url = await getBaseUrl('get', config.activity.nianshou_record);
  url += '&page=' + data.page;
  url += '&page_size=' + data.page_size;
  return http(url, 'get');
};

const getNianShouDamage = async () => {
  let url = await getBaseUrl('get', config.activity.nianshou_damage);
  return http(url, 'get');
};

const getNianShouHero = async data => {
  let url = await getBaseUrl('get', config.activity.nianshou_hero);
  url += '&page=' + data.page;
  url += '&size=' + data.size;
  // url += '&total=' + data.total;
  return http(url, 'get');
};

const getNianShouReward = async data => {
  let url = await getBaseUrl('post', config.activity.nianshou_reward);
  url += '&no=' + data.no;
  return http(url, 'post');
};
const getNianShouRewardList = async () => {
  let url = await getBaseUrl('get', config.activity.nianshou_reward_list);
  return http(url, 'get');
};

const getNianShouWeapon = async () => {
  let url = await getBaseUrl('get', config.activity.nianshou_weapon);
  return http(url, 'get');
};

const getValentineHome = async ofTab => {
  let url = await getBaseUrl('get', config.activity.valentine);
  url += '&ofTab=' + ofTab;
  return http(url, 'get');
};

const getGiftBoxContent = async id => {
  let url = await getBaseUrl('get', config.activity.collection);
  url += '&id=' + id;
  return http(url, 'get');
};

const getMushroomIndex = async () => {
  let url = await getBaseUrl('get', config.activity.mushroomIndex);
  return http(url, 'get');
};

const postMushroomAttack = async data => {
  let url = await getBaseUrl('post', config.activity.mushroomAttack);
  return http(url, 'post', data);
};

const getMushroomAttackRecords = async data => {
  let url = await getBaseUrl('get', config.activity.mushroomAttackRecord);
  url += '&page=' + data.page;
  url += '&page_size=' + data.page_size;
  return http(url, 'get');
};

const getMushroomWeapon = async () => {
  let url = await getBaseUrl('get', config.activity.mushroomWeapon);
  return http(url, 'get');
};

const getMushroomDamage = async () => {
  let url = await getBaseUrl('get', config.activity.mushroomRankDamage);
  return http(url, 'get');
};

const getMushroomRankHero = async data => {
  let url = await getBaseUrl('get', config.activity.mushroomRankHero);
  url += '&page=' + data.page;
  url += '&size=' + data.size;
  return http(url, 'get');
};

const getMushroomMagicGiftList = async () => {
  let url = await getBaseUrl('get', config.activity.mushroomMagicGiftList);
  return http(url, 'get');
};

const postMushroomMagicSmelt = async data => {
  let url = await getBaseUrl('post', config.activity.mushroomMagicSmelt);
  return http(url, 'post', data);
};

const getMushroomRewardList = async () => {
  let url = await getBaseUrl('get', config.activity.mushroomRewardList);
  return http(url, 'get');
};

const postMushroomReward = async () => {
  let url = await getBaseUrl('post', config.activity.mushroomReward);
  return http(url, 'post');
};

// 愚人节活动
const getFoolHome = async options => {
  let url = await getBaseUrl('get', `${config.activity.fool}`);
  url += '&aid=' + options.aid;
  return http(url, 'get');
};

const turnPoker = async options => {
  let url = await getBaseUrl('post', `${config.activity.fool}`);
  return http(url, 'post', options);
};

const getFoolRecords = async options => {
  let url = await getBaseUrl('get', `${config.activity.fool}/records`);
  url += '&aid=' + options.aid;
  url += '&page=' + options.page;
  url += '&size=' + options.size;

  return http(url, 'get');
};

const getFoolRankList = async data => {
  let url = await getBaseUrl('get', `${config.activity.act_rank}`);
  url += '&id=' + data.id;
  url += '&type=' + data.type;
  return http(url, 'get');
};

// 星座成就查询
const getConstellationAchievement = async () => {
  let url = await getBaseUrl('get', config.activity.constellation.achievement);
  return http(url, 'get');
};

const getConstellationAchievementV2 = async () => {
  let url = await getBaseUrl('get', config.activity.constellation.achievement_v2);
  return http(url, 'get');
};

// 12星盘内容查询
const getConstellationAstrolabe = async () => {
  let url = await getBaseUrl('get', config.activity.constellation.astrolabe);
  return http(url, 'get');
};

// 星座荣耀TAB=星座宫主守护排名
const getConstellationRank = async options => {
  let url = await getBaseUrl('get', config.activity.constellation.rank);
  url += '&anEnum=' + options.anEnum;
  return http(url, 'get');
};

const getConstellationRankV2 = async options => {
  let url = await getBaseUrl('get', config.activity.constellation.rank_v2);
  url += '&star_type=' + options.star_type;
  url += '&rank_type=' + options.rank_type;
  return http(url, 'get');
};

// 星座福利查询
const getConstellationWelfare = async () => {
  let url = await getBaseUrl('get', config.activity.constellation.welfare);
  return http(url, 'get');
};

const getStarPrayerIndex = async () => {
  let url = await getBaseUrl('get', config.activity.star_prayer.index);
  return http(url, 'get');
};

const getStarPrayerRecord = async data => {
  let url = await getBaseUrl('get', config.activity.star_prayer.record);
  url += '&page=' + data.page;
  url += '&page_size=' + data.page_size;
  return http(url, 'get');
};

const getStarPrayerGiftList = async () => {
  let url = await getBaseUrl('get', config.activity.star_prayer.gift_list);
  return http(url, 'get');
};

const postStarPrayerLuckDraw = async data => {
  let url = await getBaseUrl('post', config.activity.star_prayer.lottery);
  return http(url, 'post', data);
};

const postStarPrayerMagicSmelt = async data => {
  let url = await getBaseUrl('post', config.activity.star_prayer.magic_smelt);
  return http(url, 'post', data);
};

const getInviteHome = async () => {
  let url = await getBaseUrl('get', config.activity.invite.home);
  return http(url, 'get');
};

const getInviteRecord = async (page, size, pageCursor, dimension_type) => {
  let url = await getBaseUrl('get', config.activity.invite.record);
  url += '&page=' + page;
  url += '&size=' + size;
  url += '&pageCursor=' + pageCursor;
  url += '&dimension_type=' + dimension_type;
  return http(url, 'get');
}

const getInviteInfo = async () => {
  let url = await getBaseUrl('get', config.activity.invite.info);
  return http(url, 'get');
};

const postInviteBind = async data => {
  let url = await getBaseUrl('post', config.activity.invite.bind);
  return http(url, 'post', data);
};

const getDragonBoatList = async () => {
  let url = await getBaseUrl('get', config.activity.boat);
  return http(url, 'get');
};

const getDayChargeIndex = async () => {
  let url = await getBaseUrl('get', config.activity.dayCharge.index);
  return http(url, 'get');
};

const getDayChargeRecord = async data => {
  let url = await getBaseUrl('get', config.activity.dayCharge.record);
  url += '&page=' + data.page;
  url += '&page_size=' + data.page_size;
  return http(url, 'get');
};

const getSingerIndex = async data => {
  let url = await getBaseUrl('get', config.activity.singer);
  url += '&type=' + data.type;
  return http(url, 'get');
};

const getGroupCpDiary = async () => {
  let url = await getBaseUrl('get', config.activity.sevenCp.diary);
  return http(url, 'get');
};

const postGroupCpHandleInvitation = async data => {
  let url = await getBaseUrl('post', config.activity.sevenCp.invitation);
  url += '&invite_id=' + data.invite_id;
  url += '&from_uid=' + data.from_uid;
  url += '&confirm=' + data.confirm;
  return http(url, 'post');
};

const postGroupCpLottery = async data => {
  let url = await getBaseUrl('post', config.activity.sevenCp.lottery);
  url += '&mode=' + data.mode;
  return http(url, 'post');
};

const getGroupCpRank = async data => {
  let url = await getBaseUrl('get', config.activity.sevenCp.rank);
  url += '&type=' + data.type;
  return http(url, 'get');
};

const postGroupCpSendInvitation = async data => {
  let url = await getBaseUrl('post', config.activity.sevenCp.sendInvitation);
  url += '&to_uid=' + data.to_uid;
  return http(url, 'post');
};

const getGroupCpTravelDetails = async () => {
  let url = await getBaseUrl('get', config.activity.sevenCp.travel);
  return http(url, 'get');
};

const getGroupCpUser = async data => {
  let url = await getBaseUrl('get', config.activity.sevenCp.user);
  url += '&peanut_id=' + data.peanut_id;
  return http(url, 'get');
};

const getGroupCpInviteRecord = async data => {
  let url = await getBaseUrl('get', config.activity.sevenCp.inviteRecord);
  url += '&type=' + data.type;
  return http(url, 'get');
};

const getGroupCpLotteryRecord = async () => {
  let url = await getBaseUrl('get', config.activity.sevenCp.lotteryRecord);
  return http(url, 'get');
};

const getCrystalGiftList = async () => {
  let url = await getBaseUrl('get', config.activity.crystal.giftList);
  return http(url, 'get');
};

const postCrystalCompose = async data => {
  let url = await getBaseUrl('post', config.activity.crystal.compose);
  return http(url, 'post', data);
};

const postCrystalShop = async () => {
  let url = await getBaseUrl('post', config.activity.crystal.shop);
  return http(url, 'post');
};

const postCrystalExchange = async data => {
  let url = await getBaseUrl('post', config.activity.crystal.exchange);
  return http(url, 'post', data);
};

const getMidAutumnCollection = async data => {
  let url = await getBaseUrl('get', config.activity.mid_autumn.collection);
  url += '&collection_id=' + data.collection_id;
  return http(url, 'get');
};

const postMidAutumnCollection = async data => {
  let url = await getBaseUrl('post', config.activity.mid_autumn.collection);
  url += '&collection_id=' + data.collection_id;
  url += '&times=' + data.times;
  if (data.type) {
    url += '&type=' + data.type;
  }
  return http(url, 'post', data);
};

const putMidAutumnCollection = async data => {
  let url = await getBaseUrl('put', config.activity.mid_autumn.collection);
  url += '&collection_id=' + data.collection_id;
  return http(url, 'put', data);
};

const getMidAutumnGift = async data => {
  let url = await getBaseUrl('get', config.activity.mid_autumn.gift);
  url += '&id=' + data.id;
  return http(url, 'get');
};

const getMidAutumnRank = async data => {
  let url = await getBaseUrl('get', config.activity.mid_autumn.rank);
  url += '&id=' + data.id;
  url += '&type=' + data.type;
  url += '&page=' + data.page;
  url += '&size=' + data.size;
  return http(url, 'get');
};

const putMidAutumnTasks = async data => {
  let url = await getBaseUrl('put', config.activity.mid_autumn.task);
  url += '&collection_id=' + data.collection_id;
  url += '&type=' + data.type;
  return http(url, 'put');
};

const getMidAutumnExchangeLog = async data => {
  let url = await getBaseUrl('get', config.activity.mid_autumn.records);
  url += '&collection_id=' + data.collection_id;
  url += '&type=' + data.type;
  url += '&page=' + data.page;
  url += '&size=' + data.size;
  return http(url, 'get');
};

const getActivityAnnualReport = async () => {
  let url = await getBaseUrl('get', config.activity.mid_autumn.report);
  return http(url, 'get');
};

const getActivityAnnualWelfare = async () => {
  let url = await getBaseUrl('get', config.activity.mid_autumn.welfare);
  return http(url, 'get');
};

const postMidAutumnCollectionSend = async data => {
  let url = await getBaseUrl('post', config.activity.mid_autumn.send);
  url += '&collection_id=' + data.collection_id;
  url += '&id=' + data.id;
  url += '&number=' + data.number;
  url += '&target_id=' + data.target_id;
  return http(url, 'post', data);
};

const postMidAutumnCollectionBox = async data => {
  let url = await getBaseUrl('post', config.activity.mid_autumn.exchange);
  // url += '&collection_id=' + data.collection_id;
  // url += '&id=' + data.id;
  // url += '&type=' + data.type;
  return http(url, 'post', data);
};

const postActivityCollectionBoxDivide = async data => {
  let url = await getBaseUrl('post', config.activity.mid_autumn.divide);
  url += '&collection_id=' + data.collection_id;
  return http(url, 'post', data);
};

const getDreamPrayerIndex = async () => {
  let url = await getBaseUrl('get', config.activity.dream.index);
  return http(url, 'get');
};

const getDreamRecord = async data => {
  let url = await getBaseUrl('get', config.activity.dream.record);
  url += '&page=' + data.page;
  url += '&page_size=' + data.page_size;
  return http(url, 'get');
};

const getDreamGiftList = async () => {
  let url = await getBaseUrl('get', config.activity.dream.gift_list);
  return http(url, 'get');
};

const postDreamLuckDraw = async (data, form) => {
  let url = await getBaseUrl('post', config.activity.dream.lottery);
  url += '&n=' + data.n;
  url += '&type=' + data.type;
  return http(url, 'post', data);
};

const postDreamMagicSmelt = async data => {
  let url = await getBaseUrl('post', config.activity.dream.magic_smelt);
  return http(url, 'post', data);
};

const getWorldCupIndex = async () => {
  let url = await getBaseUrl('get', config.activity.world_cup.index);
  return http(url, 'get');
};

const postWorldCupIndex = async data => {
  let url = await getBaseUrl('post', config.activity.world_cup.guess);
  return http(url, 'post', data);
};

const getWorldCupAccount = async data => {
  let url = await getBaseUrl('get', config.activity.world_cup.account);
  url += '&page=' + data.page;
  url += '&size=' + data.size;
  return http(url, 'get');
};
const getWorldCupGuessing = async () => {
  let url = await getBaseUrl('get', config.activity.world_cup.guessing);
  return http(url, 'get');
};

const getWorldCupRankDaily = async () => {
  let url = await getBaseUrl('get', config.activity.world_cup.daily);
  return http(url, 'get');
};

const getWorldCupRank = async data => {
  let url = await getBaseUrl('get', config.activity.world_cup.rank);
  url += '&page=' + data.page;
  url += '&size=' + data.size;
  url += '&type=' + data.type;
  return http(url, 'get');
};

// 世界杯疯狂射门活动
const getCrazyShotHome = async () => {
  let url = await getBaseUrl('get', config.activity.shot);
  return http(url, 'get');
};

const postCrazyShot = async params => {
  let url = await getBaseUrl('post', config.activity.shot);
  return http(`${url}&${encodeURL(params)}`, 'post');
};

const getCrazyShotRecord = async params => {
  let url = await getBaseUrl('get', `${config.activity.shot}/record`);
  return http(`${url}&${encodeURL(params)}`, 'get');
};

// 疯狂动物园
const joinZootopia = async () => {
  let url = await getBaseUrl('post', config.activity.zootopia);
  return http(url, 'post');
};

const getZootopiaInfo = async () => {
  let url = await getBaseUrl('get', config.activity.zootopia);
  return http(url, 'get');
};

const bettingZootopia = async data => {
  let url = await getBaseUrl('put', config.activity.zootopia);
  return http(url, 'put', data);
};

const getZootopiaRecords = async () => {
  let url = await getBaseUrl('get', `${config.activity.zootopia}/records`);
  return http(url, 'get');
};
const getZootopiaJoinRecords = async () => {
  let url = await getBaseUrl('get', `${config.activity.zootopia}/betting/records`);
  return http(url, 'get');
};

const getActivityCenterList = async data => {
  let url = await getBaseUrl('get', config.activity.activity_center);
  return http(url, 'get');
};

const getYearBeatsInfo = async data => {
  let url = await getBaseUrl('get', config.activity.year_beats.index);
  return http(url, 'get');
};

const postYearBeatsAttack = async data => {
  let url = await getBaseUrl('post', config.activity.year_beats.attack);
  return http(url, 'post', data);
};

const getYearBeatsRewardList = async data => {
  let url = await getBaseUrl('get', config.activity.year_beats.reward);
  url += '&weaponType=' + data.weaponType;
  return http(url, 'get');
};

const getYearBeatsHeroList = async data => {
  let url = await getBaseUrl('get', config.activity.year_beats.hero);
  url += '&page=' + data.page;
  url += '&size=' + data.size;
  return http(url, 'get');
};

const getYearBeatsHarmList = async data => {
  let url = await getBaseUrl('get', config.activity.year_beats.harm);
  return http(url, 'get');
};

const postYearBeatsMonsterReward = async data => {
  let url = await getBaseUrl('post', config.activity.year_beats.get);
  return http(url, 'post', data);
};

const getYearBeatsHistoryList = async data => {
  let url = await getBaseUrl('get', config.activity.year_beats.history);
  url += '&page=' + data.page;
  url += '&size=' + data.size;
  return http(url, 'get');
};

const getActivityClockEx = async data => {
  let url = await getBaseUrl('get', config.activity.new_year_task.ex);
  url += '&good_id=' + data.good_id;
  return http(url, 'get');
};

const getActivityClockRecord = async data => {
  let url = await getBaseUrl('get', config.activity.new_year_task.record);
  url += '&operation=' + data.operation;
  return http(url, 'get');
};

const getActivityClockShop = async data => {
  let url = await getBaseUrl('get', config.activity.new_year_task.shop);
  return http(url, 'get');
};

const getActivityClockAnchor = async data => {
  let url = await getBaseUrl('get', config.activity.new_year_task.anchor);
  return http(url, 'get');
};

const getActivityClockIndex = async data => {
  let url = await getBaseUrl('get', config.activity.new_year_task.index);
  return http(url, 'get');
};

const getActivityClockReceive = async data => {
  let url = await getBaseUrl('get', config.activity.new_year_task.receive);
  url += '&task=' + data.task;
  return http(url, 'get');
};

const getActivityLanternHome = async data => {
  let url = await getBaseUrl('get', config.activity.lantern.home);
  return http(url, 'get');
};

const getActivityLanternRank = async data => {
  let url = await getBaseUrl('get', config.activity.lantern.rank);
  return http(url, 'get');
};

const postActivityLanternExchange = async data => {
  let url = await getBaseUrl('post', config.activity.lantern.exchange);
  return http(url, 'post', data);
};

const getActivityGroupIndex = async data => {
  let url = await getBaseUrl('get', `${config.activity.group}/${data}`);
  return http(url, 'get');
};

const getActivityGroupRecords = async data => {
  let url = await getBaseUrl('get', `${config.activity.group}/records`);
  url += '&page=' + data.page;
  url += '&size=' + data.size;
  url += '&type=' + data.type;
  url += '&id=' + data.id;
  return http(url, 'get');
};

const getActivityGroupRank = async data => {
  let url = await getBaseUrl('get', `${config.activity.group}/rank`);
  url += '&page=' + data.page;
  url += '&size=' + data.size;
  url += '&id=' + data.id;
  return http(url, 'get');
};

const postActivityGroupRecords = async data => {
  let url = await getBaseUrl('post', `${config.activity.group}/records/${data.id}`);
  return http(url, 'post');
};

const putActivityGroupRecords = async data => {
  let url = await getBaseUrl('put', `${config.activity.group}/records/${data.id}`);
  return http(url, 'put');
};
// 欢乐砸金蛋
const getGoldeneggHome = async () => {
  let url = await getBaseUrl('get', `${config.activity.goldenegg}/overview`);
  return http(url, 'get');
};

const lotteryGoldenegg = async data => {
  let url = await getBaseUrl('post', `${config.activity.goldenegg}/lottery`);
  url += '&n=' + data.n;
  url += '&type=' + data.type;
  return http(url, 'post');
};

const getGoldeneggRecords = async data => {
  let url = await getBaseUrl('get', `${config.activity.goldenegg}/record`);
  url += '&page=' + data.page;
  url += '&page_size=' + data.page_size;
  return http(url, 'get');
};

// 水果机
const getFruitHome = async () => {
  let url = await getBaseUrl('get', `${config.activity.fruit}/overview`);
  return http(url, 'get');
};

const getFruitRecords = async data => {
  let url = await getBaseUrl('get', `${config.activity.fruit}/record`);
  url += '&page=' + data.page;
  url += '&page_size=' + data.page_size;
  return http(url, 'get');
};

const drawFruit = async data => {
  let url = await getBaseUrl('post', config.activity.fruit);
  url += '&n=' + data.n;
  url += '&type=' + data.type;
  url += '&use_spar=' + data.use_spar;
  return http(url, 'post');
};

// 打榜活动-女神节
const getActRankIndex = async data => {
  let url = await getBaseUrl('get', `${config.activity.act_rank}/index`);
  url += '&id=' + data.id;
  return http(url, 'get');
};

const getActRank = async data => {
  let url = await getBaseUrl('get', config.activity.act_rank);
  url += '&id=' + data.id;
  url += '&type=' + data.type;
  return http(url, 'get');
};

const getRoomsMatchRank = async data => {
  let url = await getBaseUrl('get', config.room.match);
  url += '&type=' + data.type;
  return http(url, 'get');
};

// 限时充值活动
const getActPaymentIndex = async data => {
  let url = await getBaseUrl('get', `${config.activity.payment}/index`);
  url += '&id=' + data.id;
  return http(url, 'get');
};

const receiveActPayment = async data => {
  let url = await getBaseUrl('post', config.activity.payment);
  return http(url, 'post', data);
};

// 儿童节
const getChildrenRank = async options => {
  let url = await getBaseUrl('get', config.children.rank);
  url += '&id=' + options.id;
  url += '&type=' + options.type;
  url += '&page=' + 1;
  url += '&size=' + 30;
  return http(url, 'get');
};

const getIndonesiaNationalGift = async () => {
  let url = await getBaseUrl('get', config.activity.indonesiaNational.gift);
  return http(url, 'get');
};

const getIndonesiaNationalReward = async params => {
  let url = await getBaseUrl('get', config.activity.indonesiaNational.reward);
  url = `${url}&${encodeURL(params)}`;
  return http(url, 'get');
};

const getIndonesiaNationalRank = async params => {
  let url = await getBaseUrl('get', config.activity.indonesiaNational.rank);
  url = `${url}&${encodeURL(params)}`;
  return http(url, 'get');
};

const getActivityRank = async params => {
  let url = await getBaseUrl('get', config.activity.activityRank);
  url = `${url}&${encodeURL(params)}`;
  return http(url, 'get');
};

const getSlotsRankList = async params => {
  let url = await getBaseUrl('get', config.slots_rank.rank);
  // url = `${url}&${encodeURL(params)}`;
  return http(url, 'get');
};

const getSlotsRewardList = async params => {
  let url = await getBaseUrl('get', config.slots_rank.reward);
  // url = `${url}&${encodeURL(params)}`;
  return http(url, 'get');
};

const getOnePieceIndex = async params => {
  let url = await getBaseUrl('get', config.activity.onePiece);
  return http(url, 'get');
};

// 超级幸运星
const getSuperLuckyStarList = async () => {
  let url = await getBaseUrl('get', config.superLuckyStar.list);
  return http(url, 'get');
};

const receiveSuperLuckyStar = async data => {
  let url = await getBaseUrl('post', config.superLuckyStar.receive);
  return http(url, 'post', data);
};

// 超级幸运星rank
const getStarRankList = async () => {
  let url = await getBaseUrl('get', config.superLuckyStar.rank);
  return http(url, 'get');
};

// Yaame送福利
export const getRechargeBonus = async (params) => {
  let url = await getBaseUrl('get',config.rechargeBonus.list);
  if (params.group_flag) {
    url += '&group_flag=' + params.group_flag;
  }
  return http(url, 'get');
}
// Yaame送福利领取奖励
export const postClaimRechargeBonus = async data => {
  let url = await getBaseUrl('post',config.rechargeBonus.receive)
  return http(url, 'post', data);
}
// Greedy King活动接口
export const getGreedyKingHome = async () => {
  let url = await getBaseUrl('get', config.greedyKing.home);
  return http(url, 'get');
};
export const getGreedyKingMy = async () => {
  let url = await getBaseUrl('get', config.greedyKing.my);
  return http(url, 'get');
};
// 最强家族活动接口
export const getRank = async (params) => {
  let url = await getBaseUrl('get', config.forteFamilyRank.rank);
  url = `${url}&${encodeURL(params)}`;
  return http(url, 'get');
}
export const getPrize = async (params) => {
  let url = await getBaseUrl('get',config.forteFamilyRank.prize);
  url = `${url}&${encodeURL(params)}`;
  return http(url, 'get');
}
// 情人节活动接口
export const getLover = async (params) => {
  let url = await getBaseUrl('get', config.loverFestival.lover);
  return http(url, 'get');
}
export const getBestie = async (params) => {
  let url = await getBaseUrl('get',config.loverFestival.bestie);
  return http(url, 'get');
}
// 水果机大赢家
export const getFruitsRank = async (params) => {
  let url = await getBaseUrl('get', config.fruitsWinner.simple);
  url = `${url}&${encodeURL(params)}`;
  return http(url, 'get');
}

export const getFruitsAward = async () => {
  let url = await getBaseUrl('get',config.fruitsWinner.bigwinner);
  return http(url, 'get');
}
// Slots Lucky Time接口

export default {
  getStarRankList,
  getSuperLuckyStarList,
  receiveSuperLuckyStar,
  getSlotsRankList,
  getSlotsRewardList,
  getChildrenRank,
  getVIPHome,
  getVipReward,
  getFoolHome,
  turnPoker,
  getFoolRecords,
  getFoolRankList,
  getDragonBoatList,
  getNewcomerInfo,
  getHalloweenInfo,
  getDoubleElevenInfo,
  getThanksgivingInfo,
  getThanksgivingGashapon,
  getWeekStarIndex,
  getChristmasIndex,
  getChristmasRank,
  buyChristmasCar,
  getNewYearsIndex,
  getNewYearsAvatar,
  getNewYearsGift,
  getAnnualIndex,
  getHigherupInfo,
  getTigerSend,
  getTigerSendInfo,
  getNianShouInfo,
  postNianShouAttack, // 攻击年兽
  getNianShouRecord, // 打年兽活动-中奖记录
  getNianShouDamage, // 打年兽活动-伤害榜
  getNianShouHero, // 打年兽活动-英雄榜
  getNianShouReward, // 打年兽活动-年兽福袋
  getNianShouRewardList, // 打年兽活动-奖品展示
  getNianShouWeapon, // 打年兽活动-武器界面
  getValentineHome, // 情人节
  getGiftBoxContent,

  getMushroomIndex,
  postMushroomAttack,
  getMushroomAttackRecords,
  getMushroomWeapon,
  getMushroomDamage,
  getMushroomRankHero,
  getMushroomMagicGiftList,
  postMushroomMagicSmelt,
  getMushroomRewardList,
  postMushroomReward,

  getConstellationAchievement,
  getConstellationAchievementV2,
  getConstellationAstrolabe,
  getConstellationRank,
  getConstellationRankV2,
  getConstellationWelfare,

  getInviteHome,
  getInviteInfo,
  getInviteRecord,
  postInviteBind,

  getStarPrayerIndex,
  getStarPrayerRecord,
  getStarPrayerGiftList,
  postStarPrayerLuckDraw,
  postStarPrayerMagicSmelt,

  getDayChargeIndex,
  getDayChargeRecord,
  getSingerIndex,

  getGroupCpDiary,
  postGroupCpHandleInvitation,
  postGroupCpLottery,
  getGroupCpRank,
  postGroupCpSendInvitation,
  getGroupCpTravelDetails,
  getGroupCpUser,
  getGroupCpInviteRecord,
  getGroupCpLotteryRecord,

  getCrystalGiftList,
  postCrystalCompose,
  postCrystalShop,
  postCrystalExchange,

  // 中秋
  getMidAutumnCollection,
  postMidAutumnCollection,
  putMidAutumnCollection,
  getMidAutumnGift,
  getMidAutumnRank,
  putMidAutumnTasks,
  getMidAutumnExchangeLog,

  getActivityAnnualReport,
  getActivityAnnualWelfare,
  postMidAutumnCollectionSend,
  postMidAutumnCollectionBox,
  postActivityCollectionBoxDivide,

  getDreamPrayerIndex,
  getDreamRecord,
  getDreamGiftList,
  postDreamLuckDraw,
  postDreamMagicSmelt,

  getWorldCupIndex,
  postWorldCupIndex,
  getWorldCupAccount,
  getWorldCupGuessing,
  getWorldCupRankDaily,
  getWorldCupRank,
  getCrazyShotHome,
  postCrazyShot,
  getCrazyShotRecord,

  // 疯狂动物城
  joinZootopia,
  getZootopiaInfo,
  bettingZootopia,
  getZootopiaRecords,
  getZootopiaJoinRecords,
  getActivityCenterList,

  getYearBeatsInfo,
  postYearBeatsAttack,
  getYearBeatsRewardList,
  getYearBeatsHeroList,
  getYearBeatsHarmList,
  postYearBeatsMonsterReward,
  getYearBeatsHistoryList,

  getActivityClockEx,
  getActivityClockRecord,
  getActivityClockShop,
  getActivityClockAnchor,
  getActivityClockIndex,
  getActivityClockReceive,

  getActivityLanternHome,
  getActivityLanternRank,
  postActivityLanternExchange,

  getActivityGroupIndex,
  getActivityGroupRecords,
  getActivityGroupRank,
  postActivityGroupRecords,
  putActivityGroupRecords,

  getGoldeneggHome,
  lotteryGoldenegg,
  getGoldeneggRecords,

  getFruitHome,
  getFruitRecords,
  drawFruit,

  getActRankIndex,
  getActRank,

  getRoomsMatchRank,
  getActPaymentIndex,
  receiveActPayment,

  getIndonesiaNationalGift,
  getIndonesiaNationalReward,
  getIndonesiaNationalRank,

  getActivityRank,

  getOnePieceIndex,
  getRechargeBonus, // Yaame送福利

  // GreedyKin活动
  getGreedyKingHome,
  getGreedyKingMy
};
