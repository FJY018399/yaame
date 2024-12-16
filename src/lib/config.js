const checkIsProd = () => {
  const support_domain = [
    '//yaame.yaame.net',
    '//sweet.feidemai.com',
    '//tutu-h5.wemogu.com',
  ];
  let res = support_domain.filter(item => {
    return window.location.origin.indexOf(item) > 0;
  });
  return res.length > 0;
};

const is_prod = checkIsProd();

const config = {
  base_url: 'https://test-yamme-api.yaame.net',
  // base_url: 'https://api.yaame.net',
  recharge: {
    check: '/yaame/api/h5/auth/order/check',
    payment: '/yaame/api/h5/auth/order/payment',

    chargeRebate: '/yaame/api/h5/auth/activity/charge_rebate/info',
    receiveRebate: '/yaame/api/h5/auth/activity/charge_rebate/receive',
  },
  halloween: {
    info: '/yaame/api/h5/auth/halloween/award/plate/info',
    lottery: '/yaame/api/h5/auth/halloween/lottery',
    popupInfo: '/yaame/api/h5/auth/halloween/popup/info',
    rank: '/yaame/api/h5/auth/halloween/rank',
    userWinInfo: '/yaame/api/h5/auth/halloween/user/win/info'
  },
  violation: {
    info: '/maybe/api/h5/ban/notice',
    blacklist: '/yaame/api/h5/user/blacklist',
  },
  dress_up: {
    type: '/yaame/api/h5/store/types',
    list: '/yaame/api/h5/store/list',
    order: '/yaame/api/h5/store/order/create',
    list_v2: '/yaame/api/h5/store/list/v2',
  },
  saw: {
    list: '/yaame/api/h5/auth/user/visitors',
    attentions: '/yaame/api/h5/auth/attentions',
  },
  withdraw: {
    account: '/yaame/api/h5/auth/wallet/account',
    progress: '/yaame/api/h5/auth/withdraw/progress',
    detail: '/yaame/api/h5/auth/withdraw',
    post_withdraw: '/yaame/api/h5/auth/withdraw/order',
    post_withdraw_custom: '/yaame/api/h5/auth/withdraw/order/custom',
    bind: '/yaame/api/h5/auth/withdraw/bind',
    check: '/yaame/api/h5/auth/withdraw/check',
    has_third_account: '/yaame/api/h5/auth/withdraw/has/third/account',
    record: '/yaame/api/h5/auth/withdraw/order',
    cancel: '/yaame/api/h5/auth/withdraw/order/cancel',
    exchange: '/yaame/api/h5/auth/withdraw/exchange/diamonds',
    bank: '/yaame/api/h5/auth/withdraw/bank',
    sms: '/yaame/api/h5/auth/withdraw/sms',
  },
  diamond: {
    list: '/yaame/api/h5/auth/wallet/flow/diamonds',
    money: '/yaame/api/h5/auth/wallet/flow/money',
    crystal: '/yaame/api/h5/auth/wallet/flow/crystal'
  },
  login: {
    login: '/yaame/api/h5/login/login',
    code: '/yaame/api/h5/login/ticket',
  },
  lucky_rewards: {
    info: '/yaame/api/h5/auth/activity/diamond_lottery',
    record: '/yaame/api/h5/auth/activity/diamond_lottery/record/event',
    post_diamond: '/yaame/api/h5/auth/activity/diamond_lottery',
    free: '/yaame/api/h5/auth/activity/diamond_lottery/free',
    ticket: '/yaame/api/h5/auth/activity/diamond_lottery/ticket',
    rank: '/yaame/api/h5/auth/activity/diamond_lottery/lucky/rank',
    secretarea: {
      overview: '/yaame/api/h5/auth/activity/secretarea/overview',
      lottery: '/yaame/api/h5/auth/activity/secretarea/lottery',
      record: '/yaame/api/h5/auth/activity/secretarea/record',
    },
  },
  contribution: {
    list: '/yaame/api/h5/rank',
    cp: '/yaame/api/h5/rank/cp',
    cpRewards: '/yaame/api/h5/rank/cp/rewards',
    // rooms: '/yaame/api/h5/rank/rooms',
    user: '/yaame/api/h5/room/rank',
    rewards: '/yaame/api/h5/rank/rewards',
    rooms: {
      rank: '/yaame/api/h5/rank/room/active',
      rule: '/yaame/api/h5/rank/room/active/rules',
    },
  },
  notice: {
    list: '/yaame/api/h5/common/board/home',
    gift: '/yaame/api/h5/common/board/record/gift',
    lottery: '/yaame/api/h5/common/board/record/lottery',
  },
  blindBox: {
    index: '/yaame/api/h5/auth/gifts/boxes',
    list: '/yaame/api/h5/auth/gifts/boxes/records',
  },
  wealthLevel: {
    list: '/yaame/api/h5/auth/user_level/info',
  },
  box_lottery: {
    index: '/yaame/api/h5/auth/activity/box_lottery',
    list: '/yaame/api/h5/auth/activity/box_lottery/record',
    free: '/yaame/api/h5/auth/activity/box_lottery/free',
  },
  activity: {
    vipHome: '/yaame/api/h5/auth/vip/home',
    vipReward: '/yaame/api/h5/auth/vip/reward',
    halloween: '/yaame/api/h5/auth/activity/halloween/index',
    doubleEleven: '/yaame/api/h5/auth/activity/double11/index',
    thanksgiving: '/yaame/api/h5/auth/activity/thankful/index',
    thanksgiving_gashapon: '/yaame/api/h5/auth/activity/thankful/gashapon',
    weekStar: '/yaame/api/h5/auth/activity/week/star/index',
    christmas: '/yaame/api/h5/auth/christmas/info',
    christmasRank: '/yaame/api/h5/rank/activity/time/frame',
    christmasBuy: '/yaame/api/h5/auth/christmas/purchase',
    newYears: '/yaame/api/h5/auth/activity/yuandan/info',
    newYearsAvatar: '/yaame/api/h5/auth/activity/yuandan/free/avatarDress',
    newYearsGift: '/yaame/api/h5/auth/activity/yuandan/free/gift',
    annual: '/yaame/api/h5/auth/activity/annual/index',
    higherup: '/yaame/api/h5/auth/activity/higherup/info',
    tigerSend: '/yaame/api/h5/auth/activity/benefits/receive',
    tigerSendIndex: '/yaame/api/h5/auth/activity/benefits/index',
    nianshou: '/yaame/api/h5/auth/activity/nianshou/overview',
    nianshou_attack: '/yaame/api/h5/auth/activity/nianshou/attack',
    nianshou_record: '/yaame/api/h5/auth/activity/nianshou/attack/record',
    nianshou_damage: '/yaame/api/h5/auth/activity/nianshou/rank/damage',
    nianshou_hero: '/yaame/api/h5/auth/activity/nianshou/rank/hero',
    nianshou_reward: '/yaame/api/h5/auth/activity/nianshou/reward',
    nianshou_reward_list: '/yaame/api/h5/auth/activity/nianshou/reward/list',
    nianshou_weapon: '/yaame/api/h5/auth/activity/nianshou/weapon',
    valentine: '/yaame/api/h5/auth/activity/valentine/index',
    collection: '/yaame/api/h5/auth/gifts/collection',
    mushroomIndex: '/yaame/api/h5/auth/activity/mushroom/overview',
    mushroomAttack: '/yaame/api/h5/auth/activity/mushroom/attack',
    mushroomAttackRecord: '/yaame/api/h5/auth/activity/mushroom/attack/record',
    mushroomWeapon: '/yaame/api/h5/auth/activity/mushroom/weapon',
    mushroomRankDamage: '/yaame/api/h5/auth/activity/mushroom/rank/damage',
    mushroomRankHero: '/yaame/api/h5/auth/activity/mushroom/rank/hero',
    mushroomMagicGiftList:
      '/yaame/api/h5/auth/activity/mushroom/magic/gift/list',
    mushroomMagicSmelt: '/yaame/api/h5/auth/activity/mushroom/magic/smelt',
    mushroomRewardList: '/yaame/api/h5/auth/activity/mushroom/reward/list',
    mushroomReward: '/yaame/api/h5/auth/activity/mushroom/reward',
    fool: '/yaame/api/h5/auth/act/raffle',
    shot: '/yaame/api/h5/auth/activity/shoot',
    constellation: {
      achievement: '/yaame/api/h5/auth/constellation/achievement/details',
      achievement_v2: '/yaame/api/h5/auth/constellation/achievement/details/V2',
      astrolabe: '/yaame/api/h5/auth/constellation/astrolabe/details',
      rank: '/yaame/api/h5/auth/constellation/rank/details',
      rank_v2: '/yaame/api/h5/auth/constellation/rank/details/V2',
      welfare: '/yaame/api/h5/auth/constellation/welfare/details',
    },
     // 邀请有礼
  invite: {
    home: '/yaame/api/h5/auth/activity/invite/home',
    info: '/yaame/api/h5/auth/activity/invite/info',
    record: '/yaame/api/h5/auth/activity/invite/record',
    bind: '/yaame/api/h5/auth/activity/invite/bind'
  },
    boat: '/yaame/api/h5/auth/activity/dragon/index',
    star_prayer: {
      index: '/yaame/api/h5/auth/activity/stars/overview',
      record: '/yaame/api/h5/auth/activity/stars/record',
      magic_smelt: '/yaame/api/h5/auth/activity/stars/magic/smelt',
      gift_list: '/yaame/api/h5/auth/activity/stars/magic/gift/list',
      lottery: '/yaame/api/h5/auth/activity/stars/lottery',
    },
    dream: {
      index: '/yaame/api/h5/auth/activity/dream/overview',
      record: '/yaame/api/h5/auth/activity/dream/record',
      magic_smelt: '/yaame/api/h5/auth/activity/dream/magic/smelt',
      gift_list: '/yaame/api/h5/auth/activity/dream/magic/gift/list',
      lottery: '/yaame/api/h5/auth/activity/dream/lottery',
    },
    dayCharge: {
      index: '/yaame/api/h5/auth/activity/daycharge/overview',
      record: '/yaame/api/h5/auth/activity/daycharge/record',
    },
    singer: '/yaame/api/h5/auth/activity/singger/index',
    sevenCp: {
      diary: '/yaame/api/h5/auth/group/cp/diary',
      invitation: '/yaame/api/h5/auth/group/cp/handle/invitation',
      lottery: '/yaame/api/h5/auth/group/cp/lottery',
      rank: '/yaame/api/h5/auth/group/cp/rank',
      sendInvitation: '/yaame/api/h5/auth/group/cp/send/invitation',
      travel: '/yaame/api/h5/auth/group/cp/travel/details',
      user: '/yaame/api/h5/auth/group/cp/user',
      inviteRecord: '/yaame/api/h5/auth/group/cp/invite/record',
      lotteryRecord: '/yaame/api/h5/auth/group/cp/lottery/record',
    },
    crystal: {
      giftList: '/yaame/api/h5/auth/activity/crystal/gift/list',
      compose: '/yaame/api/h5/auth/activity/crystal/compose',
      shop: '/yaame/api/h5/auth/activity/crystal/shop',
      exchange: '/yaame/api/h5/auth/activity/crystal/exchange',
    },
    mid_autumn: {
      collection: '/yaame/api/h5/auth/v2/activity/collection',
      gift: '/yaame/api/h5/auth/v2/activity',
      rank: '/yaame/api/h5/auth/v2/activity/rank',
      task: '/yaame/api/h5/auth/v2/activity/collection/tasks',
      records: '/yaame/api/h5/auth/v2/activity/collection/records',
      report: '/yaame/api/h5/auth/activity/annual/report',
      welfare: '/yaame/api/h5/auth/activity/annual/welfare',
      send: '/yaame/api/h5/auth/v2/activity/collection/send',
      exchange: '/yaame/api/h5/auth/v2/activity/collection/box/exchange',
      divide: '/yaame/api/h5/auth/v2/activity/collection/box/divide',
    },
    world_cup: {
      index: '/yaame/api/h5/auth/activity/world/cup/index',
      guess: '/yaame/api/h5/auth/activity/world/cup/guessing',
      account: '/yaame/api/h5/auth/activity/world/cup/account',
      guessing: '/yaame/api/h5/auth/activity/world/cup/guessing',
      daily: '/yaame/api/h5/auth/activity/world/cup/rank/daily',
      rank: '/yaame/api/h5/auth/activity/world/cup/rank',
    },
    zootopia: '/yaame/api/h5/auth/activity/animal/match',
    activity_center: '/yaame/api/h5/auth/activity/center',
    year_beats: {
      index: '/yaame/api/h5/auth/activity/year/monster/home',
      attack: '/yaame/api/h5/auth/activity/year/monster/attack',
      reward: '/yaame/api/h5/auth/activity/year/monster/reward/list',
      hero: '/yaame/api/h5/auth/activity/year/monster/hero/rank',
      harm: '/yaame/api/h5/auth/activity/year/monster/hero/harm',
      get: '/yaame/api/h5/auth/activity/year/monster/hero/reward',
      history: '/yaame/api/h5/auth/activity/year/monster/reward/history',
    },
    new_year_task: {
      index: '/yaame/api/h5/auth/activity/clock/task/index',
      ex: '/yaame/api/h5/auth/activity/clock/ex',
      record: '/yaame/api/h5/auth/activity/clock/record',
      shop: '/yaame/api/h5/auth/activity/clock/shop',
      anchor: '/yaame/api/h5/auth/activity/clock/task/anchor',
      receive: '/yaame/api/h5/auth/activity/clock/task/receive',
    },
    lantern: {
      home: '/yaame/api/h5/auth/activity/lantern/festival/home',
      rank: '/yaame/api/h5/auth/activity/lantern/festival/rank',
      exchange: '/yaame/api/h5/auth/activity/lantern/festival/exchange',
    },
    group: '/yaame/api/h5/auth/v2/activity/group',
    goldenegg: '/yaame/api/h5/auth/activity/goldenegg',
    fruit: '/yaame/api/h5/auth/activity/fruit',
    act_rank: '/yaame/api/h5/auth/act/rank',
    payment: '/yaame/api/h5/auth/act/payment',

    indonesiaNational: {
      gift: '/yaame/api/h5/auth/activity/indonesia/national/day/config/gift',
      reward:
        '/yaame/api/h5/auth/activity/indonesia/national/day/config/reward',
      rank: '/yaame/api/h5/auth/activity/indonesia/national/day/rank',
    },
    activityRank: '/yaame/api/h5/rank/activity',
    onePiece: '/yaame/api/h5/rank/onepiece/info',
  },
  goods: {
    first: '/yaame/api/h5/auth/goods/first/charge',
  },
  guilds: {
    list: '/yaame/api/h5/auth/guilds/applies',
    users: '/yaame/api/h5/auth/guild/user',
    quit: '/yaame/api/h5/auth/guild/user/quit',
    delete: '/yaame/api/h5/auth/guild/user/delete',
    query: '/yaame/api/h5/auth/guild/user/query',
    invite: '/yaame/api/h5/auth/guild/user/invite',
    inviteList: '/yaame/api/h5/auth/guild/user/invite/list',
    verification: '/yaame/api/h5/auth/guild/user/invite/verification',
    getOut: '/yaame/api/h5/auth/guilds',
    messages: '/yaame/api/h5/auth/guilds/users/messages',
    flows: '/yaame/api/h5/auth/guilds/rooms/flows',
    rooms: '/yaame/api/h5/auth/guilds/rooms',

    income: {
      config: '/yaame/api/h5/auth/guilds/settlements/configs',
      daily: '/yaame/api/h5/auth/user/statistic/income/daily',
      month: '/yaame/api/h5/auth/user/statistic/income/month',
      users: '/yaame/api/h5/auth/guilds/settlements/users',
      flows: '/yaame/api/h5/auth/guilds/settlements/users/flows'
    },
    chairman: {
      daily: '/yaame/api/h5/auth/guild/statistic/income/daily',
      month: '/yaame/api/h5/auth/guild/statistic/income/month',
      settlements: '/yaame/api/h5/auth/guilds/settlements'
    }
  },
  family: {
    rule: '/yaame/api/h5/auth/family/rule',
    rank: '/yaame/api/h5/auth/family/rank',
    rankMember: '/yaame/api/h5/auth/family/rank/member',
    new: '/yaame/api/h5/auth/family/rank/new/info',
    check: '/yaame/api/h5/auth/family/rank/create/check'
  },
  statistic: {
    charge: '/yaame/api/h5/statistic/charge',
  },
  noble: {
    info: '/yaame/api/h5/auth/nobles',
  },
  cupid: {
    activity: '/yaame/api/h5/auth/activity/love/rank',
  },
  room: {
    heart: {
      details: '/yaame/api/h5/auth/blind/heart/details',
    },
    wall: '/yaame/api/h5/auth/blind/hand/wall',
    match: '/yaame/api/h5/auth/voice/rooms/match',
  },
  carnie: {
    detail: '/yaame/api/h5/auth/v2/activity/building',
    records: '/yaame/api/h5/auth/v2/activity/building/records',
    v2rank: '/yaame/api/h5/auth/v2/activity/rank',
    room: '/yaame/api/h5/auth/voice/rooms/live',
  },
  commonActivity: {
    rocket: {
      index: '/yaame/api/h5/auth/act/rocket',
    },
  },
  redEnvelope: {
    result: '/yaame/api/h5/activity/red/pack/result',
  },
  // 大赢家榜单
  slots_rank: {
    rank: '/yaame/api/h5/slots/rank',
    reward: '/yaame/api/h5/slots/rewards',
  },
  //超级幸运星
  superLuckyStar: {
    list: '/yaame/api/h5/super/lucky/star',
    receive: '/yaame/api/h5/super/lucky/star/receive',
    rank: '/yaame/api/h5/super/lucky/star/rank',
  },

  // 公共抽奖
  draw: {
    home: '/yaame/api/h5/auth/activity/pool_lottery/home',
    log: '/yaame/api/h5/auth/activity/pool_lottery/log',
    lottery: '/yaame/api/h5/auth/activity/pool_lottery/lottery',

    rank: '/yaame/api/h5/rank/activity',
    sure: '/yaame/api/h5/auth/activity/pool_lottery/lottery/must/win'
  },

  // Yaame充值返利
  rechargeBonus: {
    list: '/yaame/api/h5/auth/activity/charge_rebate/info',
    receive: '/yaame/api/h5/auth/activity/charge_rebate/receive'
  },
  // GreedyKing活动
  greedyKing: {
    home: '/yaame/api/h5/auth/activity/greedy_baby_week/home',
    my: '/yaame/api/h5/auth/activity/greedy_baby_week/my_rank'
  },
  // 最强家族活动
  forteFamilyRank : {
    rank: '/yaame/api/h5/auth/strongest/family/rank',
    prize:'/yaame/api/h5/auth/strongest/family/reward/info'
  },
  // 情人节活动
  loverFestival: {
    lover: '/yaame/api/h5/auth/activity/valentine/home/lover',
    bestie: '/yaame/api/h5/auth/activity/valentine/home/bestie'
  },
  // 水果机大赢家
  fruitsWinner: {
    simple: '/yaame/api/h5/rank/simple',
    bigwinner: '/yaame/api/h5/auth/activity/fruit/match/bigwinner',
  },
  dialog: '/yaame/api/h5/common/criteria/dialog'
};

if (is_prod) {
  config.base_url = 'https://api.yaame.net';
}

export default (() => {
  return config;
})();
