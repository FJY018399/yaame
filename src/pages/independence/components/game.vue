<template>
  <div class="game box" :data-bg="lazyImg[language].game">
    <!-- 国旗 -->
    <div class="pole box" :data-bg="lazyImg[language].pole">
      <div class="ensign box" :class="{ 'ensign-two': flutter }" :data-bg="lazyImg[language].ensign"></div>
    </div>

    <!-- 大烟花 -->
    <div v-show="bigFireworks" class="big-fireworks"></div>

    <!-- 小烟花 -->
    <div v-show="littleFireworks" class="little-fireworks"></div>

    <!-- 建筑 -->
    <div class="build box" :data-bg="lazyImg[language].build"></div>

    <!-- 弹幕 -->
    <vue-danmaku v-if="screenList.length" class="vueDanmaku" ref="danmaku" v-model="screenList" randomChannel use-slot loop
                 :speeds="40" :channels="3">
      <template slot="dm" slot-scope="{ index, danmu }">
        <div class="strip">
          <div class="img"></div>
          {{ $t('flag_raising_success', {0: danmu.nick_name, 1: danmu.flag_times}) }}
        </div>
      </template>
    </vue-danmaku>

    <!-- 游戏格子 -->
    <div class="lattice box" ref="board" :data-bg="lazyImg[language].lattice">
      <!-- 格子 -->
      <div class="cells" ref="cells" v-for="(item, index) in latticeList" :key="index">
        <!-- 礼物盒子 -->
        <img v-if="index === 3 || index === 7 || index === 12 || index === 18" class="gift box"
             :style="{ zIndex: currentCellIndex === index ? 3 : 2 }" :data-bg="lazyImg[language].gift" src="" alt=""
             @click="giftWin">
        <!-- 钻石 -->
        <div v-if="index === 2 || index === 10 || index === 13 || index === 17" class="diamond"
             :style="{ zIndex: currentCellIndex === index ? 3 : 2 }">
          <img class="box" :data-bg="lazyImg[language].diamond" src="" alt="">
          <div class="mark">{{ index === 2 ? 3 : index === 10 ? 2 : index === 13 ? 2 : 5 }}</div>
        </div>
        <!-- 终点旗子 -->
        <div v-if="index === latticeList.length - 1" class="terminus">
          <img v-show="currentCellIndex !== latticeList.length - 1" class="box" :data-bg="lazyImg[language].terminus" src="" alt="">
          <img class="box" :class="{ 'short': language !== 'id' }" :data-bg="lazyImg[language].titik" src="" alt="">
        </div>
      </div>
      <!-- 用户棋子 -->
      <div class="piece box" ref="piece" :data-bg="lazyImg[language].piece"
           :style="{ top: offset_y + 'rem', left: offset_X + 'rem'}">
        <img :src="props.gameData.avatar" alt="">
      </div>
    </div>

    <!-- 骰子 -->
    <div class="dice">
      <img v-if="hide" class="game-dice box" :data-bg="lazyImg[language]['game-dice']" src="" alt=""/>
      <canvas class="game-dice" id="dice"></canvas>
    </div>

    <!-- 奖品记录 -->
    <div class="record box" :data-bg="lazyImg[language].record" @click="recordWin"></div>

    <!-- 按钮 -->
    <div class="button">
      <div class="tab box" :style="{ opacity: typeButton === item.type ? '0' : '1' }" v-for="(item, index) in drawImg"
           :key="index" :data-bg="lazyImg[language][item.type]" @click="begin(item.type)"></div>
      <div class="frame">
        <div class="tabs box" :style="{ opacity: typeButton === item.type ? '1' : '0' }"
             v-for="(item, index) in drawImg" :key="index+3" :data-bg="lazyImg[language][item.sign]"></div>
      </div>
    </div>

    <span class="integral">{{ $t('points_per_throw', {msg: 300}) }}</span>
    <span class="integral">{{ $t('current_points', {msg: diceNum}) }}</span>

    <!--奖池弹窗-->
    <popup class="popup" v-show="awardWin" :visible="awardWin" @cancel="awardWin = !awardWin">
      <div class="award-win" :style="{ backgroundImage: `url(${lazyImg[language]['award-win']})` }">
        <p>{{ $t('random_rewards') }}</p>
        <div class="gifts" v-for="(item, index) in awardWinList" :key="index">
          <div class="icon">
            <div v-if="item.object_type !== 'DIAMOND'" class="day">{{ item.reward_diamond_worth }}</div>
            <img :src="item.icon" alt="">
          </div>
          <div v-if="item.object_type !== 'DIAMOND'" class="name">{{ item.reward_name }}</div>
          <div v-if="item.object_type === 'DIAMOND'" class="diamond">
            <img src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png" alt="">
            {{ item.reward_diamond_worth }}
          </div>
        </div>
      </div>
      <div class="rule-page-close" @click="awardWin = !awardWin"></div>
    </popup>

    <!--四次抽奖弹窗-->
    <popup v-show="diceOn" :visible="diceOn" @cancel="diceOn = !diceOn">
      <div class="dice-on">
        <p>{{ $t('total_rewards') }}</p>
        <div class="gifts" v-for="(item, index) in rewardItem" :key="index">
          <div class="icon">
            <div v-if="item.object_type !== 'DIAMOND'" class="day">{{ item.reward_diamond_worth }}</div>
            <img :src="item.icon" alt="">
          </div>
          <div v-if="item.object_type !== 'DIAMOND'" class="name">{{ item.reward_name }}</div>
          <div v-if="item.object_type === 'DIAMOND'" class="diamond">
            <img src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png" alt="">
            {{ item.reward_diamond_worth }}
          </div>
        </div>
        <div class="button-win" @click="diceOn = false"></div>
      </div>
    </popup>

    <!--大于十次奖励小于等于4抽奖弹窗-->
    <popup class="popup-ten" v-show="diceTen" :visible="diceTen" @cancel="diceTen = !diceTen">
      <div class="bg"></div>
      <div class="dice-ten">
        <div class="head" v-if="hoistFlag">{{ $t('congratulations_flag', { msg: hoistFlag }) }}</div>
        <p>{{ $t('total_rewards') }}</p>
        <div class="ensign"></div>
        <div class="gifts" v-for="(item, index) in rewardItem" :key="index">
          <div class="icon">
            <div v-if="item.object_type !== 'DIAMOND'" class="day">{{ item.reward_diamond_worth }}</div>
            <img :src="item.icon" alt="">
          </div>
          <div v-if="item.object_type !== 'DIAMOND'" class="name">{{ item.reward_name }}</div>
          <div v-if="item.object_type === 'DIAMOND'" class="diamond">
            <img src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png" alt="">
            {{ item.reward_diamond_worth }}
          </div>
        </div>
        <div class="button-win" @click="diceTen = false"></div>
      </div>
    </popup>

    <!--五十抽抽奖弹窗-->
    <popup class="popup-ten" v-show="diceFifty" :visible="diceFifty" @cancel="diceFifty = !diceFifty">
      <div class="bg"></div>
      <div class="dice-ten dice-fifty">
        <div class="head" v-if="hoistFlag">{{ $t('congratulations_flag', {msg: hoistFlag}) }}</div>
        <p>{{ $t('total_rewards') }}</p>
        <div class="ensign"></div>
        <div class="frame">
          <div class="gifts" v-for="(item, index) in rewardItem" :key="index">
            <div class="icon">
              <div v-if="item.object_type !== 'DIAMOND'" class="day">{{ item.reward_diamond_worth }}</div>
              <img :src="item.icon" alt="">
            </div>
            <div v-if="item.object_type !== 'DIAMOND'" class="name">{{ item.reward_name }}</div>
            <div v-if="item.object_type === 'DIAMOND'" class="diamond">
              <img src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png" alt="">
              {{ item.reward_diamond_worth }}
            </div>
          </div>
          <div class="button-win" @click="diceFifty = false"></div>
        </div>
      </div>
    </popup>

    <!--奖励记录页-->
    <popup v-show="historyWin" :visible="historyWin" @cancel="historyWin = false">
      <div class="history" :style="{ backgroundImage: `url(${lazyImg[language].history})` }">
        <div v-if="historyList.length" class="frame">
          <div class="item" v-for="(item, index) in historyList" :key="index">
            <span>{{ formatDate(item.create_time, 'yyyy.MM.dd hh:mm') }}(UTC+0)</span>
            <span>{{ $t('dice_rolls') }}{{ item.roll_times }}</span>
            <div class="gifts" v-for="(ite, inx) in item.reward_item_list" :key="inx">
              <div class="icon">
                <div v-if="ite.object_type !== 'DIAMOND'" class="day">{{ ite.reward_diamond_worth }}</div>
                <img :src="ite.icon" alt="">
              </div>
              <div v-if="ite.object_type !== 'DIAMOND'" class="name">{{ ite.name }}</div>
              <div v-if="ite.object_type === 'DIAMOND'" class="diamond">
                <img src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png" alt="">
                {{ ite.reward_diamond_worth }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="deficiency">
          <p>{{ $t('no_record_yet') }}</p>
        </div>
      </div>
      <div class="rule-page-close" @click="historyWin = false"></div>
    </popup>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance, nextTick, onActivated, onDeactivated, onMounted, ref, watch} from "vue";
import {Downloader, Parser, Player} from 'svga.lite'
import DB from 'svga.lite/db'
import {Toast} from "vant";
import vueDanmaku from "vue-danmaku";
import {getLightenHomeApi, rankRuledApi} from "@/pages/independence/api";
import popup from "@/components/common/pop_up.vue";
import {burialPointFun, formatDate} from '@/lib/utils';
import {getLanguage} from "@/lib/device";

// 获取语言
let language = computed(() => {
  let locale = getLanguage() || "en";
  if (["zh-hk", "zh-tw", "zh-mo", "zh-cn", "zh_cn"].indexOf(locale) > -1) {
    let localEnum = {
      "zh-hk": "zh-tw",
      "zh-tw": "zh-tw",
      "zh-mo": "zh-tw",
      "zh-cn": "zh-cn",
      zh_cn: "zh-cn",
    };

    locale = localEnum[locale];
  }
  return locale;
});

// 获取国际化函数
const root = getCurrentInstance();
const t = (val, msg) => {
  return root.proxy.$i18n.t(val, msg);
};

// 外层dom
const props = defineProps(['main', 'gameData']);

// 控制筛子图片
const hide = ref(true);
// svga
const svgaImg = ref([
  "https://yaame-static.yaame.io/admin/abeb8b89372ea8375ba0351c37bb8bb2.svga",
  "https://yaame-static.yaame.io/admin/b7081f9ac11272faa889044241092766.svga",
  "https://yaame-static.yaame.io/admin/2d7fffaa26a460c28c24c4f044f19c03.svga",
  "https://yaame-static.yaame.io/admin/05ff91665a29c687e5b2c3f55f9f0b1e.svga",
  "https://yaame-static.yaame.io/admin/5bcea05ca89ce57838df47f5ae9b3ca7.svga",
  "https://yaame-static.yaame.io/admin/f486b79b61c61136366357c19dc07d39.svga",
  "https://yaame-static.yaame.io/admin/7090e1aa768941072a0331bfa31782c9.svga",
]);
const svgaSave = ref({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
});
// 存储svag
const storage = async (svgaFile, canvas, index) => {
  try {
    let data = void 0
    let db = void 0

    try {
      db = new DB()
    } catch (error) {
      console.error(error)
    }

    if (db) {
      data = await db.find(svgaFile)
    }

    if (!data) {
      const downloader = new Downloader()
      const fileData = await downloader.get(svgaFile)
      const parser = new Parser()

      data = await parser.do(fileData)

      // 插入数据
      db && (await db.insert(svgaFile, data))
    }

    svgaSave.value[index] = new Player(canvas)
    await svgaSave.value[index].mount(data)

    svgaSave.value[index].set({loop: 1});
    svgaSave.value[index].start();
    hide.value = false;
  } catch (err) {
    console.error(err);
  }
}

// 抽奖按钮图片
const drawImg = ref([
  {
    icon: 'https://yaame-static.yaame.io/admin/85e9556bc326edf2e9a6802eafe42edb.png',
    type: 1,
    sign: 'one'
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/3e6842e996213734986a64d07a1d57ce.png',
    type: 10,
    sign: 'ten'
  },
  {
    icon: 'https://yaame-static.yaame.io/admin/f0a928559098c0b991d2ee2779612ec2.png',
    type: 50,
    sign: 'fifty'
  },
])

// 记录当前在那个位置
let currentCellIndex = ref(0);

// 用户走的位置
let offset_X = ref(0); // left
let offset_y = ref(0); // top

// 奖励盒子dom  父盒子dom
const cells = ref(null);
const board = ref(null);

// 获取根元素字体大小
const getRootFontSize = () => {
  return parseFloat(window.getComputedStyle(document.documentElement).fontSize);
}

// 将像素值转换为rem
const pxToRem = (px) => {
  const rootFontSize = getRootFontSize();
  return px / rootFontSize;
}

// 用户棋子
const piece = ref(null);

// 用户首次页面进来确定当前位置
const offset = (index) => {
  // 获取当前处于格子位置
  const targetCell = cells.value[index];
  // 获取盒子在页面距离
  const boardRect = board.value.getBoundingClientRect();
  const targetRect = targetCell.getBoundingClientRect();
  // 转换当前数值
  offset_X.value = pxToRem(targetRect.left - boardRect.left);
  offset_y.value = pxToRem(targetRect.top - boardRect.top);
}

// 前进方法
const movePiece = () => {
  const targetCellIndex = (currentCellIndex.value + 1) % cells.value.length;
  const targetCell = cells.value[targetCellIndex];
  const boardRect = board.value.getBoundingClientRect();
  const targetRect = targetCell.getBoundingClientRect();
  offset_X.value = pxToRem(targetRect.left - boardRect.left);
  offset_y.value = pxToRem(targetRect.top - boardRect.top);
  // 记录当前位置
  currentCellIndex.value = targetCellIndex;
}

// 倒退方法
const minus = () => {
  const targetCellIndex = (currentCellIndex.value - 1 + cells.value.length) % cells.value.length;
  const targetCell = cells.value[targetCellIndex];
  const boardRect = board.value.getBoundingClientRect();
  const targetRect = targetCell.getBoundingClientRect();
  offset_X.value = pxToRem(targetRect.left - boardRect.left);
  offset_y.value = pxToRem(targetRect.top - boardRect.top);
  // 更新当前单元格索引
  currentCellIndex.value = targetCellIndex;
}

// 前进异步
const delayAdvance = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      movePiece();
      resolve(true);
    }, 500)
  });
}
// 后退异步
const delayRetreat = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      minus();
      resolve(true);
    }, 500)
  });
}

// 控制旗子飘动
const flutter = ref(false);
// 操作倒退前进操作
const logWithDelay = async (value, result) => {
  /*
    value: 筛子点数
    result: 实际走到位置
   */
  let reality = value + currentCellIndex.value;
  // 判断是否会超过最终格子
  if (reality >= 19) {
    for (let i = currentCellIndex.value; i < 19; i++) {
      await delayAdvance();
    }
    Toast(t('congrats_finish'));
    // 走到终点 播放飘旗动画
    flutter.value = true;
    bigFireworks.value = true;
    setTimeout(() => {
      // 延迟小烟花播放
      littleFireworks.value = true;
    }, 1000)
    // 恢复点击
    throttle.value = false;
    return;
  }
  for (let i = 0; i < value; i++) {
    await delayAdvance();
  }
  // 如果和当前位置相同不用做前进和后退动作
  if (reality === result) {
    if (rewardItem.value.length) {
      // 延迟拉起等待动画完毕
      setTimeout(() => {
        diceOn.value = true; // 拉起奖励弹窗
      }, 500)
    }
    // 恢复点击
    throttle.value = false;
    return;
  }
  // 添加画面延迟
  setTimeout(async () => {
    if (reality > result) {
      Toast(t('move_backward', {msg: reality - result}));
      // 如果当前点数大于实际位置  进行后退操作
      for (let i = result; i < reality; i++) {
        await delayRetreat();
      }
      if (rewardItem.value.length) diceOn.value = true; // 拉起奖励弹窗
      // 恢复点击
      throttle.value = false;
    } else {
      Toast(t('move_forward', {msg: result - reality}));
      // 如果当前点数小于实际位置  进行前进操作
      for (let i = reality; i < result; i++) {
        await delayAdvance();
      }
      if (rewardItem.value.length) diceOn.value = true; // 拉起奖励弹窗
      // 恢复点击
      throttle.value = false;
    }
  }, 500)
}

// 当次抽奖获得的奖励
const rewardItem = ref([]);
// 单次抽奖弹窗
const diceOn = ref(false);
const diceTen = ref(false);
const diceFifty = ref(false);
// 大小烟花控制
const bigFireworks = ref(false);
const littleFireworks = ref(false);
// 升旗次数
const hoistFlag = ref(0);
// 点击效果
const typeButton = ref(0);
// 节流阀
const throttle = ref(false);
// 开始抽奖
const begin = async (type) => {
  try {
    // 重置动画
    flutter.value = false;
    bigFireworks.value = false;
    littleFireworks.value = false;
    // 判断当前是否已经到达终点重置位置
    if (currentCellIndex.value >= 19) {
      currentCellIndex.value = 0;
      offset(0);
    }
    // 防重设置
    if (throttle.value) return;
    throttle.value = true;
    typeButton.value = type;
    // 埋点
    burialPointFun({
      event_name: "dice_btn_click",
      cid: -1000,
      md: 3,
      args_name: "dice_btn_click",
      args: {
        which: type === 1 ? 'dice_once' : type === 50 ? 'dice_10times' : 'dice_50times',
      },
    });
    const res = await getLightenHomeApi({
      roll_times: type
    })
    // 接口成功回调接触防重
    typeButton.value = 0;
    if (res.status !== 1000) {
      Toast(res.desc);
      throttle.value = false;
      // 埋点
      burialPointFun({
        event_name: "dice_btn_click",
        cid: -1000,
        md: 3,
        args_name: "dice_btn_click",
        args: {
          type: 'fail',
        },
      });
      return;
    }
    // 埋点
    burialPointFun({
      event_name: "dice_btn_click",
      cid: -1000,
      md: 3,
      args_name: "dice_btn_click",
      args: {
        type: 'success',
      },
    });
    // 筛子点数
    const diceNumber = res.data.dice_num;
    // 当前走到位置
    const raisingNum = latticeList.value.findIndex(item => item.flag_raising_ceremony_enum === res.data.flag_raising_ceremony_enum);
    // 获取当前获得奖励数据
    rewardItem.value = res.data.reward_item_vos ? res.data.reward_item_vos : [];
    // 更新当前积分
    diceNum.value = res.data.remain_points;
    // 获取升旗次数
    hoistFlag.value = res.data.raising_sum;

    // 多次清空
    if (type > 1) {
      await storage(svgaImg.value[6], '#dice', 6);
      setTimeout(() => {
        if (!hoistFlag.value) return;
        // 走到终点 播放飘旗动画
        flutter.value = true;
        bigFireworks.value = true;
        setTimeout(() => {
          // 延迟小烟花播放
          littleFireworks.value = true;
        }, 1000)
        // 打开对应奖励弹窗
        if (rewardItem.value.length <= 4) diceTen.value = true;
        else diceFifty.value = true;
        // 更新本地记录时间
        currentCellIndex.value = raisingNum;
        // 定位到当前位置
        offset(raisingNum);
        // 恢复点击
        throttle.value = false;
      }, 3600)
      return;
    }
    // 播放筛子动画
    await storage(svgaImg.value[diceNumber - 1], '#dice', diceNumber - 1);
    setTimeout(() => {
      // 等待动画完成提示
      Toast(t('congrats_roll', {0: diceNumber}));
      // 开始移动
      logWithDelay(diceNumber, raisingNum)
    }, 1500)
  } catch (err) {
    console.log(err)
  }
}

const lazyImg = ref({
  "zh-cn": {
    'game': 'https://yaame-static.yaame.io/admin/281880d02c296bffb88f191f99512546.png',
    'build': 'https://yaame-static.yaame.io/admin/58dbaccacfcba28d7ca1b637ea688220.png',
    'pole': 'https://yaame-static.yaame.io/admin/e989ed3a3929f80abf3eabdf3678f36e.png',
    'ensign': 'https://yaame-static.yaame.io/admin/8625cf412cc409510e102352ae21a307.png',
    '1': 'https://yaame-static.yaame.io/admin/440e08a2a95279279761e0e1fb68c147.png',
    '10': 'https://yaame-static.yaame.io/admin/9ce723d44a82c91c3100980a5f6ad9cd.png',
    '50': 'https://yaame-static.yaame.io/admin/6fb71fa2b00c9aa0876362518a243a1b.png',
    'game-dice': 'https://yaame-static.yaame.io/admin/f9c8d12dad64e168b6fc0e097f91953f.png',
    'lattice': 'https://yaame-static.yaame.io/admin/21d28f40dd38ad205d56896f94b60046.png',
    'piece': 'https://yaame-static.yaame.io/admin/204a352b64777afe1a60fd160d535ec3.png',
    'record': 'https://yaame-static.yaame.io/admin/30ac2c6268c6315de99e1218c5a2c83a.png',
    'gift': 'https://yaame-static.yaame.io/admin/563e17356901fe077d9932bd85691835.png',
    'terminus': 'https://yaame-static.yaame.io/admin/e4bf12f57c8e23f9b0012138a22c1d86.png',
    'titik': 'https://yaame-static.yaame.io/admin/d6a55d9e7084535c4438da80b518f1da.png',
    'diamond': 'https://yaame-static.yaame.io/admin/e77ad509cc1eb9a36683614aa7b32877.png',
    'one': 'https://yaame-static.yaame.io/admin/e352e339309a4f1096ee1d97bc641b73.png',
    'ten': 'https://yaame-static.yaame.io/admin/9c2f7010a43cf55ee17e2a348f6c39e9.png',
    'fifty': 'https://yaame-static.yaame.io/admin/8b6784cbf8c3d1b78b1e91ac244c2282.png',
    'award-win': 'https://yaame-static.yaame.io/admin/09d0585d704fe8124bf7614d9702b57a.png',
    'history': 'https://yaame-static.yaame.io/admin/19d529f88e7d3271a2fd99b6c21d0b87.png'
  },
  "zh-tw": {
    'game': 'https://yaame-static.yaame.io/admin/281880d02c296bffb88f191f99512546.png',
    'build': 'https://yaame-static.yaame.io/admin/58dbaccacfcba28d7ca1b637ea688220.png',
    'pole': 'https://yaame-static.yaame.io/admin/e989ed3a3929f80abf3eabdf3678f36e.png',
    'ensign': 'https://yaame-static.yaame.io/admin/8625cf412cc409510e102352ae21a307.png',
    '1': 'https://yaame-static.yaame.io/admin/440e08a2a95279279761e0e1fb68c147.png',
    '10': 'https://yaame-static.yaame.io/admin/9ce723d44a82c91c3100980a5f6ad9cd.png',
    '50': 'https://yaame-static.yaame.io/admin/6fb71fa2b00c9aa0876362518a243a1b.png',
    'game-dice': 'https://yaame-static.yaame.io/admin/f9c8d12dad64e168b6fc0e097f91953f.png',
    'lattice': 'https://yaame-static.yaame.io/admin/21d28f40dd38ad205d56896f94b60046.png',
    'piece': 'https://yaame-static.yaame.io/admin/204a352b64777afe1a60fd160d535ec3.png',
    'record': 'https://yaame-static.yaame.io/admin/30ac2c6268c6315de99e1218c5a2c83a.png',
    'gift': 'https://yaame-static.yaame.io/admin/563e17356901fe077d9932bd85691835.png',
    'terminus': 'https://yaame-static.yaame.io/admin/e4bf12f57c8e23f9b0012138a22c1d86.png',
    'titik': 'https://yaame-static.yaame.io/admin/d6a55d9e7084535c4438da80b518f1da.png',
    'diamond': 'https://yaame-static.yaame.io/admin/e77ad509cc1eb9a36683614aa7b32877.png',
    'one': 'https://yaame-static.yaame.io/admin/e352e339309a4f1096ee1d97bc641b73.png',
    'ten': 'https://yaame-static.yaame.io/admin/9c2f7010a43cf55ee17e2a348f6c39e9.png',
    'fifty': 'https://yaame-static.yaame.io/admin/8b6784cbf8c3d1b78b1e91ac244c2282.png',
    'award-win': 'https://yaame-static.yaame.io/admin/09d0585d704fe8124bf7614d9702b57a.png',
    'history': 'https://yaame-static.yaame.io/admin/19d529f88e7d3271a2fd99b6c21d0b87.png'
  },
  "en": {
    'game': 'https://yaame-static.yaame.io/admin/281880d02c296bffb88f191f99512546.png',
    'build': 'https://yaame-static.yaame.io/admin/58dbaccacfcba28d7ca1b637ea688220.png',
    'pole': 'https://yaame-static.yaame.io/admin/e989ed3a3929f80abf3eabdf3678f36e.png',
    'ensign': 'https://yaame-static.yaame.io/admin/8625cf412cc409510e102352ae21a307.png',
    '1': 'https://yaame-static.yaame.io/admin/c8018353882d31f69193c4491b8f6093.png',
    '10': 'https://yaame-static.yaame.io/admin/90d66b9e91e915a08d5cd543726a1efb.png',
    '50': 'https://yaame-static.yaame.io/admin/4d3b503fe706752ade7c3f75f8e8855b.png',
    'game-dice': 'https://yaame-static.yaame.io/admin/f9c8d12dad64e168b6fc0e097f91953f.png',
    'lattice': 'https://yaame-static.yaame.io/admin/a555e9b236580025bb34acd71f109da9.png',
    'piece': 'https://yaame-static.yaame.io/admin/204a352b64777afe1a60fd160d535ec3.png',
    'record': 'https://yaame-static.yaame.io/admin/e7f147bbd26d4825bc85d29813b03c8e.png',
    'gift': 'https://yaame-static.yaame.io/admin/563e17356901fe077d9932bd85691835.png',
    'terminus': 'https://yaame-static.yaame.io/admin/e4bf12f57c8e23f9b0012138a22c1d86.png',
    'titik': 'https://yaame-static.yaame.io/admin/0e5e7ee61988894c798c3acabaefb8f0.png',
    'diamond': 'https://yaame-static.yaame.io/admin/e77ad509cc1eb9a36683614aa7b32877.png',
    'one': 'https://yaame-static.yaame.io/admin/a024b86d4a9b1da08ef8844da2398f31.png',
    'ten': 'https://yaame-static.yaame.io/admin/545bbc6f76d7469a67289c10d7a6f6b1.png',
    'fifty': 'https://yaame-static.yaame.io/admin/6aec5b8294ec89628d1eef240c2251fd.png',
    'award-win': 'https://yaame-static.yaame.io/admin/0fdc82a5f3d654bdcf862adc650ce370.png',
    'history': 'https://yaame-static.yaame.io/admin/7b8a79eb366e40ade07c8a95edc5e8a6.png'
  },
  "id": {
    'game': 'https://yaame-static.yaame.io/admin/281880d02c296bffb88f191f99512546.png',
    'build': 'https://yaame-static.yaame.io/admin/58dbaccacfcba28d7ca1b637ea688220.png',
    'pole': 'https://yaame-static.yaame.io/admin/e989ed3a3929f80abf3eabdf3678f36e.png',
    'ensign': 'https://yaame-static.yaame.io/admin/8625cf412cc409510e102352ae21a307.png',
    '1': 'https://yaame-static.yaame.io/admin/c8018353882d31f69193c4491b8f6093.png',
    '10': 'https://yaame-static.yaame.io/admin/90d66b9e91e915a08d5cd543726a1efb.png',
    '50': 'https://yaame-static.yaame.io/admin/4d3b503fe706752ade7c3f75f8e8855b.png',
    'game-dice': 'https://yaame-static.yaame.io/admin/f9c8d12dad64e168b6fc0e097f91953f.png',
    'lattice': 'https://yaame-static.yaame.io/admin/a555e9b236580025bb34acd71f109da9.png',
    'piece': 'https://yaame-static.yaame.io/admin/204a352b64777afe1a60fd160d535ec3.png',
    'record': 'https://yaame-static.yaame.io/admin/e7f147bbd26d4825bc85d29813b03c8e.png',
    'gift': 'https://yaame-static.yaame.io/admin/563e17356901fe077d9932bd85691835.png',
    'terminus': 'https://yaame-static.yaame.io/admin/e4bf12f57c8e23f9b0012138a22c1d86.png',
    'titik': 'https://yaame-static.yaame.io/admin/0e5e7ee61988894c798c3acabaefb8f0.png',
    'diamond': 'https://yaame-static.yaame.io/admin/e77ad509cc1eb9a36683614aa7b32877.png',
    'one': 'https://yaame-static.yaame.io/admin/a024b86d4a9b1da08ef8844da2398f31.png',
    'ten': 'https://yaame-static.yaame.io/admin/545bbc6f76d7469a67289c10d7a6f6b1.png',
    'fifty': 'https://yaame-static.yaame.io/admin/6aec5b8294ec89628d1eef240c2251fd.png',
    'award-win': 'https://yaame-static.yaame.io/admin/0fdc82a5f3d654bdcf862adc650ce370.png',
    'history': 'https://yaame-static.yaame.io/admin/7b8a79eb366e40ade07c8a95edc5e8a6.png'
  },
  "ar": {
    'game': 'https://yaame-static.yaame.io/admin/281880d02c296bffb88f191f99512546.png',
    'build': 'https://yaame-static.yaame.io/admin/58dbaccacfcba28d7ca1b637ea688220.png',
    'pole': 'https://yaame-static.yaame.io/admin/e989ed3a3929f80abf3eabdf3678f36e.png',
    'ensign': 'https://yaame-static.yaame.io/admin/8625cf412cc409510e102352ae21a307.png',
    '1': 'https://yaame-static.yaame.io/admin/c8018353882d31f69193c4491b8f6093.png',
    '10': 'https://yaame-static.yaame.io/admin/90d66b9e91e915a08d5cd543726a1efb.png',
    '50': 'https://yaame-static.yaame.io/admin/4d3b503fe706752ade7c3f75f8e8855b.png',
    'game-dice': 'https://yaame-static.yaame.io/admin/f9c8d12dad64e168b6fc0e097f91953f.png',
    'lattice': 'https://yaame-static.yaame.io/admin/a555e9b236580025bb34acd71f109da9.png',
    'piece': 'https://yaame-static.yaame.io/admin/204a352b64777afe1a60fd160d535ec3.png',
    'record': 'https://yaame-static.yaame.io/admin/e7f147bbd26d4825bc85d29813b03c8e.png',
    'gift': 'https://yaame-static.yaame.io/admin/563e17356901fe077d9932bd85691835.png',
    'terminus': 'https://yaame-static.yaame.io/admin/e4bf12f57c8e23f9b0012138a22c1d86.png',
    'titik': 'https://yaame-static.yaame.io/admin/0e5e7ee61988894c798c3acabaefb8f0.png',
    'diamond': 'https://yaame-static.yaame.io/admin/e77ad509cc1eb9a36683614aa7b32877.png',
    'one': 'https://yaame-static.yaame.io/admin/a024b86d4a9b1da08ef8844da2398f31.png',
    'ten': 'https://yaame-static.yaame.io/admin/545bbc6f76d7469a67289c10d7a6f6b1.png',
    'fifty': 'https://yaame-static.yaame.io/admin/6aec5b8294ec89628d1eef240c2251fd.png',
    'award-win': 'https://yaame-static.yaame.io/admin/0fdc82a5f3d654bdcf862adc650ce370.png',
    'history': 'https://yaame-static.yaame.io/admin/7b8a79eb366e40ade07c8a95edc5e8a6.png'
  },
})
// 图片懒加载
const lazyLoadImages = () => {
  const lazyImages = document.querySelectorAll('.box');
  const loadImages = () => {
    lazyImages.forEach(image => {
      if (isInViewport(image)) {
        const bgImage = image.getAttribute('data-bg');
        if (bgImage) {
          if (image.tagName.toLowerCase() === 'img') {
            image.src = bgImage;
          } else {
            image.style.backgroundImage = `url(${bgImage})`;
          }
          image.classList.remove('box');
        }
      }
    });
  };

  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.bottom >= 0 &&  // 图片底部进入视口
      rect.right >= 0 &&   // 图片右侧进入视口
      rect.top <= window.innerHeight &&  // 图片顶部进入视口
      rect.left <= window.innerWidth     // 图片左侧进入视口
    );
  };

  window.addEventListener('scroll', loadImages);
  window.addEventListener('resize', loadImages);

  loadImages();
};

// 页面格子列表
const latticeList = ref([]);
const screenList = ref([]);
// 当前积分
const diceNum = ref(0);
watch(() => props.gameData, (newValue) => {
  if (newValue) {
    // 获取格子数据
    latticeList.value = newValue.flag_raising_ceremony_list;
    // 获取奖池数据
    awardWinList.value = newValue.pool_reward_list;
    // 页面初始化定位所在位置
    currentCellIndex.value = newValue.flag_raising_ceremony_enum ? latticeList.value.findIndex(item => item.flag_raising_ceremony_enum === newValue.flag_raising_ceremony_enum) : 0;
    // 积分
    diceNum.value = newValue.dice_num;
    nextTick(() => {
      // 弹幕数据
      screenList.value = newValue.screen_list;
      // 重置动画
      flutter.value = false;
      bigFireworks.value = false;
      littleFireworks.value = false;
      // 定位到当前位置
      offset(currentCellIndex.value);
      lazyLoadImages();
    })
  }
})

// 奖励弹窗
const awardWin = ref(false);
const awardWinList = ref([]);
// 奖励弹窗
const giftWin = () => {
  awardWin.value = true;
}
// 历史弹窗
const historyWin = ref(false);
const historyList = ref([]);
const recordWin = async () => {
  try {
    historyWin.value = true;
    const res = await rankRuledApi();
    if (res.status !== 1000) return;
    historyList.value = res.data.reward_log_history_vo_list ? res.data.reward_log_history_vo_list : [];
  } catch (err) {
    console.log(err);
  }
}

onDeactivated(() => {
  screenList.value = [];
})
onMounted(() => {
  // 监听元素位置
  document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
  });
})
</script>

<style lang="less" scoped>
.game {
  position: relative;
  width: 7.1rem;
  height: 15.30rem;
  margin: 0 auto .13rem;
  background-repeat: no-repeat;
  background-size: contain;

  .pole {
    position: absolute;
    top: .93rem;
    left: 50%;
    transform: translateX(-50%);
    width: .2rem;
    height: 2.76rem;
    background-repeat: no-repeat;
    background-size: contain;

    .ensign {
      position: absolute;
      top: .14rem;
      left: .05rem;
      width: 1.68rem;
      height: 1.12rem;
      background-repeat: no-repeat;
      background-size: contain;
    }

    .ensign-two {
      background-image: url("https://yaame-static.yaame.io/admin/dce3632d55f4981faefd28c031e696d3.webp") !important;
    }
  }

  .big-fireworks {
    position: absolute;
    top: .53rem;
    left: .32rem;
    width: 3rem;
    height: 3rem;
    background: url("https://yaame-static.yaame.io/admin/94a88028b63edc2fcc5c2cdfe4a5eb14.webp") no-repeat;
    background-size: contain;
  }

  .little-fireworks {
    position: absolute;
    top: 1.91rem;
    right: .13rem;
    width: 1.7rem;
    height: 1.7rem;
    background: url("https://yaame-static.yaame.io/admin/3b00a896966e14880f3f699a5598db8b.webp") no-repeat;
    background-size: contain;
  }

  .build {
    position: absolute;
    top: 3.18rem;
    left: 50%;
    transform: translateX(-50%);
    width: 6.73rem;
    height: 2.89rem;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .vueDanmaku {
    position: absolute;
    top: 3.18rem;
    left: .19rem;
    width: 6.73rem;
    height: 2.5rem;

    .strip {
      display: flex;
      align-items: center;
      justify-content: center;
      height: .54rem;
      padding: 0 .24rem;
      background: linear-gradient( 180deg, #6E8DFA 0%, #3958D9 100%);
      border-radius: .27rem;
      border: .02rem solid #FCDC87;
      font-size: .20rem;
      color: #FFF2B3;

      .img {
        width: .28rem;
        height: .23rem;
        margin-right: .14rem;
        background: url("https://yaame-static.yaame.io/admin/341ff330a26e9b6423429d52cbeab569.png") no-repeat;
        background-size: contain;
      }
    }
  }

  .lattice {
    position: absolute;
    top: 6.06rem;
    left: .78rem;
    width: 5.58rem;
    height: 6.56rem;
    background-repeat: no-repeat;
    background-size: contain;

    .piece {
      position: absolute;
      width: .74rem;
      height: .87rem;
      background-repeat: no-repeat;
      background-size: contain;
      transition-duration: .5s;
      z-index: 2;

      img {
        position: absolute;
        top: .09rem;
        left: 50%;
        transform: translateX(-50%);
        width: .56rem;
        height: .56rem;
        border-radius: 50%;
      }
    }

    .cells {
      position: absolute;
      width: .74rem;
      height: .87rem;

      .gift {
        position: absolute;
        top: .4rem;
        left: .1rem;
        width: .6rem;
        height: .66rem;
        z-index: 2;
      }

      .terminus {
        position: absolute;
        left: .2rem;
        width: .75rem;
        height: .93rem;
        z-index: 3;

        .short {
          left: -0.08rem !important;
          width: .41rem !important;
          height: .2rem !important;
        }

        img {
          width: 100%;
          height: 100%;
        }

        img:nth-child(2) {
          position: absolute;
          left: -.36rem;
          bottom: -0.08rem;
          width: 1.07rem;
          height: .2rem;
        }
      }

      .diamond {
        position: absolute;
        bottom: 0;
        left: .2rem;
        width: .39rem;
        height: .33rem;
        z-index: 2;

        img {
          width: 100%;
          height: 100%;
        }

        .mark {
          position: absolute;
          top: -0.02rem;
          left: .22rem;
          min-width: .31rem;
          height: .16rem;
          line-height: .16rem;
          padding: 0 .1rem;
          background: rgba(237, 156, 57, 0.8);
          border-radius: .15rem;
          border: .01rem solid #FFEA8C;
          font-size: .16rem;
          color: #FFFFFF;
        }
      }
    }

    .cells:nth-child(1) {
      top: 3.55rem !important;
      left: 4.6rem !important;
    }

    .cells:not(:last-child) {
      top: -0.19rem;
      left: 2.44rem;
    }

    .loop(@i) when (@i > 1) {
      // 第一段
      .cells:nth-child(@{i}) when (@i <= 4) {
        top: 4.1rem + ((@i - 2) * 0.36rem);
        left: 3.76rem - ((@i - 2) * 0.69rem);
      }
      // 第二段
      .cells:nth-child(@{i}) when (@i > 4) and (@i <= 7) {
        top: 4.46rem - ((@i - 5) * 0.36rem);
        left: 1.72rem - ((@i - 5) * 0.69rem);
      }
      // 第三段
      .cells:nth-child(@{i}) when (@i > 7) and (@i <= 12) {
        top: 3.37rem - ((@i - 8) * 0.36rem);
        left: 1.03rem + ((@i - 8) * 0.69rem);
      }
      // 第四段
      .cells:nth-child(@{i}) when (@i > 12) and (@i <= 17) {
        top: 1.57rem - ((@i - 13) * 0.36rem);
        left: 3.11rem - ((@i - 13) * 0.69rem);
      }
      // 第五段
      .cells:nth-child(@{i}) when (@i > 17) and (@i <= 19) {
        top: -0.2rem - ((@i - 18) * 0.36rem);
        left: 1.04rem + ((@i - 18) * 0.69rem);
      }

      .loop(@i - 1);
    }
    .loop(19);
  }

  .dice {
    position: absolute;
    bottom: 1.68rem;
    left: 50%;
    transform: translateX(-50%);
    width: 1.4rem;
    height: 1.46rem;

    .game-dice {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }

  .record {
    position: absolute;
    right: 0.19rem;
    bottom: 2.38rem;
    width: 1.73rem;
    height: 1.22rem;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .button {
    position: absolute;
    bottom: 1.08rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 6rem;
    height: .92rem;

    .tab {
      position: relative;
      width: 1.8rem;
      height: .92rem;
      background-repeat: no-repeat;
      background-size: contain;
      z-index: 1;
    }

    .frame {
      position: absolute;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 100%;
      height: 100%;

      .tabs {
        width: 1.8rem;
        height: .86rem;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
  }

  .integral {
    position: absolute;
    left: .54rem;
    bottom: .63rem;
    height: .26rem;
    line-height: .26rem;
    font-weight: 600;
    font-size: .26rem;
    color: #5756FF;
  }

  .integral:last-of-type {
    left: auto;
    right: .55rem;
  }


  // 弹窗公共奖励样式
  .gifts {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1.4rem;
    font-size: .22rem;
    color: #FFF2B3;

    .icon {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.4rem;
      height: 1.4rem;
      margin-bottom: .11rem;
      background: #FFEAE5;
      border-radius: .16rem;
      border: .04rem solid #FAD884;
      font-size: .2rem;
      color: #FFFFFF;

      .day {
        position: absolute;
        top: -0.04rem;
        right: -0.04rem;
        min-width: .93rem;
        height: .33rem;
        padding: 0 .19rem;
        line-height: .33rem;
        background: #E99F44;
        border-radius: 0 .16rem 0 .16rem;
        text-align: center;
      }

      .number {
        position: absolute;
        bottom: -0.04rem;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 1.44rem;
        height: .26rem;
        background: #E3716F;
        border-radius: 0 0 .16rem .16rem;
      }

      img {
        width: .9rem;
        height: .9rem;
      }
    }

    .diamond {
      display: flex;
      justify-content: center;
      align-items: center;
      height: .22rem;
      margin: .14rem auto .08rem;

      img {
        width: .24rem;
        height: .18rem;
      }
    }

    .name {
      width: 100%;
      height: .44rem;
      line-height: .22rem;
      text-align: center;
    }
  }

  .award-win {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    width: 6.8rem;
    height: 9.94rem;
    padding-top: 2.23rem;
    margin: 2.23rem auto 0;
    background-repeat: no-repeat;
    background-size: contain;

    .gifts {
      .diamond {
        margin: 0;
      }
      .name {
        height: auto;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 0 .12rem;
      }
    }

    p {
      position: absolute;
      top: 1.65rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      width: 5.53rem;
      height: .3rem;
      font-weight: 500;
      font-size: .22rem;
      color: #FFF2B3;
    }
  }

  .rule-page-close {
    width: .5rem;
    height: .5rem;
    margin: .6rem auto 0;
    background: url("https://yaame-static.yaame.io/admin/8bb8a71cdeb8d963c0094bdb4c11fc03.png") no-repeat;
    background-size: contain;
  }

  // 单次抽奖弹窗
  .dice-on {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: 6.8rem;
    height: 5.52rem;
    padding-top: 1.71rem;
    margin: 3.36rem auto 0;
    background: url("https://yaame-static.yaame.io/admin/ee240710279248648350bb348b718380.png") no-repeat;
    background-size: contain;

    p {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: .94rem;
      left: 50%;
      transform: translateX(-50%);
      width: 5.81rem;
      height: .45rem;
      font-weight: 600;
      font-size: .32rem;
      color: #FFF2B3;
    }

    .name {
      margin-top: .1rem;
    }
  }

  // 大于十次奖励 <= 4
  .popup-ten {
    .bg {
      position: absolute;
      top: 2.12rem;
      left: 50%;
      transform: translateX(-50%);
      width: 5.32rem;
      height: 5.32rem;
      background: url("https://yaame-static.yaame.io/admin/8a92047873f02672b4dc11e62983038e.png") no-repeat;
      background-size: contain;
      z-index: -1;
    }

    .dice-ten {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      position: absolute;
      top: 4.48rem;
      left: 50%;
      transform: translateX(-50%);
      width: 6.83rem;
      height: 5.62rem;
      padding-top: 2rem;
      background-image: url("https://yaame-static.yaame.io/admin/4ad69040f787dedb2ee28a21ab8b0184.png");
      background-repeat: no-repeat;
      background-size: contain;

      .head {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: .09rem;
        left: 50%;
        transform: translateX(-50%);
        width: 4.51rem;
        height: .72rem;
        font-weight: 600;
        font-size: .28rem;
        color: #FFF2B3;
        line-height: .28rem;
        text-align: center;
      }

      p {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 1.34rem;
        left: 50%;
        transform: translateX(-50%);
        width: 4.72rem;
        height: .37rem;
        font-weight: 600;
        font-size: .26rem;
        color: #FFF2B3;
        line-height: .37rem;
      }

      .ensign {
        position: absolute;
        bottom: 5.3rem;
        left: 3.25rem;
        width: 1.14rem;
        height: 1.58rem;
        background: url("https://yaame-static.yaame.io/admin/8e4fa54ec968a4718df31a3ca40b52c3.webp") no-repeat;
        background-size: contain;
      }
    }
  }

  // 五十次弹窗
  .dice-fifty {
    height: 8.03rem !important;
    background-image: url("https://yaame-static.yaame.io/admin/21f510acf107f05a4325f5e0dfdbbb1a.png") !important;

    .head {
      top: .19rem !important;
    }

    .frame {
      display: flex;
      flex-direction: row;
      align-content: flex-start;
      flex-wrap: wrap;
      justify-content: space-evenly;
      width: 6.33rem;
      height: 4.5rem;
      overflow: auto;

      .gifts:nth-child(n+5) {
        margin-top: .26rem;
      }
    }

    .ensign {
      bottom: 7.61rem !important;
    }

    .name {
      margin-top: .1rem;
    }
  }


  // 奖励历史弹窗
  .history {
    position: relative;
    width: 6.8rem;
    height: 9.94rem;
    margin: 2.23rem auto 0;
    padding-top: 1.75rem;
    background-repeat: no-repeat;
    background-size: contain;

    .frame {
      width: 5.96rem;
      height: 8.11rem;
      margin: 0 auto;
      overflow-x: hidden;
      overflow-y: auto;

      .item {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        position: relative;
        width: 100%;
        padding-top: .39rem;
        margin-bottom: .34rem;

        span {
          position: absolute;
          top: 0;
          left: 0;
          font-size: .2rem;
          color: #F5C3C2;
        }

        span:nth-child(2) {
          left: auto;
          right: 0;
        }

        .gifts {
          width: 1rem;
          margin-right: .24rem;

          .icon {
            width: 1rem;
            height: 1rem;
            background: #FFE4DA;
            border-radius: .08rem;
            border: .01rem solid #F6D076;
            .day {
              top: -0.01rem;
              right: -0.01rem;
              min-width: .65rem;
              height: .26rem;
              line-height: .26rem;
              padding: 0 .04rem;
              border-radius: 0 0.08rem 0 0.08rem
            }

            img {
              width: .8rem;
              height: .8rem;
            }
            .number {
              width: 1.02rem;
              bottom: -0.01rem;
              border-radius: 0 0 0.08rem 0.08rem;
            }
          }

          .name {
            height: auto;
            overflow-wrap: break-word;
          }

          .diamond {
            margin: 0;
          }
        }

        .gifts:nth-child(5n+2) {
          margin-right: 0;
        }

        .gifts:nth-child(n+8) {
          .icon {
            margin-top: .1rem;
          }
        }
      }
    }

    .deficiency {
      position: absolute;
      top: 4.09rem;
      left: 50%;
      transform: translateX(-50%);
      width: .84rem;
      height: 1rem;
      background: url("https://yaame-static.yaame.io/admin/5b8c5313fe3d87e4ef39e6a7ef6bfc05.png") no-repeat;
      background-size: contain;

      p {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 1.4rem;
        left: 50%;
        transform: translateX(-50%);
        width: 5.64rem;
        height: .2rem;
        line-height: .2rem;
        font-weight: normal;
        font-size: .2rem;
        color: #FFF2B3;
      }
    }
  }

  // 关闭按钮统一样式
  .button-win {
    position: absolute;
    bottom: .63rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2rem;
    height: .8rem;
    background: url("https://yaame-static.yaame.io/admin/bfecdf396a36c314e1243110d3490ba6.png") no-repeat;
    background-size: contain;
  }
}
</style>