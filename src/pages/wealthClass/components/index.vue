<template>
  <div class="main" ref="main">
    <div class="frame" :style="{ backgroundImage: `url(${bgImg[tabBgIndex]})` }">
      <!--标题-->
      <custom-header class="header" color="white" :apparentTitle="t('wealth_level')" :headStyle="headStyle"
                     :dom-main="main" :custom_back="true" @onCustomBack="back">
        <template v-slot:default>
          <div class="header-title">{{ $t('wealth_level') }}</div>
        </template>
      </custom-header>

      <!--规则-->
      <div @click="cutRule" class="rule" :class="{ 'blank': status }" :style="{ top: safe_height, right: language === 'ar' ? '' : '0.3rem', left: language === 'ar' ? '0.3rem' : '' }"></div>
      <!-- tab -->
      <van-swipe class="tab" @change="onChange" :show-indicators="false" :loop="false" :width="htmlSize"
                 :initial-swipe="tabIndex">
        <van-swipe-item v-for="(item, index) in levelRanges" :key="index">
          <!-- 勋章 -->
          <canvas v-if="iosStatus < 15" class="medal" :id="`svga${index}`"></canvas>
          <img v-else-if="item.status" class="medal" :src="item.level_webp_url" alt=""></img>
          <!-- 当前处于档位 -->
          <div
            v-if="myData.user_level >= item.min_level && myData.user_level < item.max_level"
            class="tabs" :class="`tabs${index}`">
            <!-- 头部信息 -->
            <div class="head">
              <div class="avatar">
                <img :src="myData.avatar" alt="">
              </div>
              <div class="info">
                <div class="name">{{ myData.nick_name }}</div>
                <div class="grade">Lv.{{ myData.user_level }}</div>
              </div>
            </div>
            <!-- 进度信息 -->
            <div class="schedule">
              <span>Lv.{{ myData.user_level + 1 > 200 ? 199 : myData.user_level }}</span>
              <span>Lv.{{ myData.user_level + 1 > 200 ? 200 : myData.user_level + 1 }}</span>
              <div class="value" :style="{ width: experience + 'rem' }"></div>
              <p>{{ $t('next_level_exp_requirement', {0: myData.current_level_end_point - myData.level_point}) }}</p>
            </div>
          </div>
          <!-- 未达到档位 -->
          <div v-else-if="myData.user_level < item.min_level" class="tabs-no" :class="`tabs${index}`">
            <span>{{ $t('not_reached_level') }}</span>
            <p v-if="item.max_level !== 200">{{ $t('level_display',{0: item.min_level + 1 + '-' + item.max_level}) }}</p>
            <p v-else>{{ $t('level_display',{0: 200}) }}</p>
          </div>
          <!-- 以超过档位 -->
          <div v-else class="tabs" :class="`tabs${index}`">
            <!-- 头部信息 -->
            <div class="head">
              <div class="avatar">
                <img :src="myData.avatar" alt="">
              </div>
              <div class="info">
                <div class="name">{{ myData.nick_name }}</div>
                <div class="grade">Lv.{{ myData.user_level }}</div>
              </div>
            </div>
            <!-- 进度信息 -->
            <div class="schedule">
              <span>Lv.{{ item.min_level + 1 }}</span>
              <span>Lv.{{ item.max_level }}</span>
              <div class="value" :style="{ width: '4.3rem' }"></div>
              <p v-if="item.max_level !== 200">{{ $t('all_rewards_obtained', {msg: item.min_level + 1, 0: item.max_level}) }}</p>
              <p v-else>{{ $t('all_rewards_obtained_single_level', {xx: item.max_level}) }}</p>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>

      <!-- 内容 -->
      <div v-if="levelReward && levelReward.new_wealth_level_reward_vos" class="content" :style="{ backgroundImage: `url(${contentImg[tabBgIndex]})` }">
        <div v-if="statusImg" class="content-item" v-for="(item, index) in levelReward.new_wealth_level_reward_vos" :key="index">
          <!-- 两个情况 -->
          <div v-if="item.level_rewards.length !== 1 && item.level_rewards.length" class="content-item-two">
            <div :style="{opacity: myData.user_level < item.level_tip.split('.')[1] && index !== levelReward.new_wealth_level_reward_vos.length - 1 ? 1 : '0.1'}" class="long"></div>
            <span class="lock">
              <img v-if="myData.user_level >= item.level_tip.split('.')[1]" class="open"
                   src="https://yaame-static.yaame.io/admin/6cc7c24a9a23bb58d430df92046f524d.png" alt="">
              <img v-else class="close" src="https://yaame-static.yaame.io/admin/3101c22f372bb8b4d79d534bd145ed21.png"
                   alt="">
              <span>{{ item.level_tip }}</span>
            </span>
            <div class="info" v-for="(ite, inx) in  item.level_rewards" :key="inx">
              <span>{{ ite.reward_tip }}
                <img v-if="ite.reward_desc" src="https://yaame-static.yaame.io/admin/69d5eac149b5e06da4939127d0080816.png" alt="" @click="openRuleWin(ite.reward_desc)">
              </span>
              <div class="icon" :class="ite.css">
                <img :src="ite.reward_icon" alt="">
              </div>
            </div>
          </div>
          <!-- 单个情况 -->
          <div v-if="item.level_rewards.length === 1" class="content-item-one">
            <div :style="{opacity: myData.user_level < item.level_tip.split('.')[1] && index !== levelReward.new_wealth_level_reward_vos.length - 1 ? 1 : '0.1'}" class="short"></div>
            <span class="lock">
              <img v-if="myData.user_level >= item.level_tip.split('.')[1]" class="open"
                   src="https://yaame-static.yaame.io/admin/6cc7c24a9a23bb58d430df92046f524d.png" alt="">
              <img v-else class="close" src="https://yaame-static.yaame.io/admin/3101c22f372bb8b4d79d534bd145ed21.png"
                   alt="">
              <span>{{ item.level_tip }}</span>
            </span>
            <div class="info" v-for="(ite, inx) in  item.level_rewards" :key="inx">
              <span>{{ ite.reward_tip }}
                <img v-if="ite.reward_desc"  src="https://yaame-static.yaame.io/admin/69d5eac149b5e06da4939127d0080816.png" alt="" @click="openRuleWin(ite.reward_desc)">
              </span>
              <div class="icon" :class="ite.css">
                <img :src="ite.reward_icon" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 提示弹窗 -->
      <popup class="popup" v-show="ruleWin" @cancel="ruleWin = false">
        <div class="hint">
          <div class="head">{{ $t('tip_description') }}</div>
          <div class="tip" style="white-space: pre-line;">{{ txt }}</div>
          <div class="button" @click="ruleWin = false">OK</div>
        </div>
      </popup>
      <img class="lazy" :src="item" v-for="(item ,index) in bgImg" :key="index" alt=""></img>
      <img class="lazy" :src="item" v-for="(item ,index) in contentImg" :key="index + contentImg.length" alt=""></img>
    </div>
  </div>
</template>

<script setup>
import customHeader from "@/components/common/cs_header";
import {computed, getCurrentInstance, nextTick, onActivated, onMounted, ref, set} from "vue";
import {getUserLevelApi} from "@/pages/wealthClass/api";
import {Toast} from "vant";
import popup from "@/components/common/pop_up.vue";
import {getLanguage, getSafeHeight, IosVersion} from "@/lib/device";
import {burialPointFun} from "@/lib/utils";
import {Downloader, Parser, Player} from "svga.lite";
import DB from 'svga.lite/db'

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

const main = ref(null);

// 获取国际化函数
const root = getCurrentInstance();
const t = (val, msg) => {
  return root.proxy.$i18n.t(val, msg);
};

// 头部背景
const bgImg = ref([
  require('../../../assets/img/wealthClass/1bg.png'),
  require('../../../assets/img/wealthClass/2bg.png'),
  require('../../../assets/img/wealthClass/3bg.png'),
  require('../../../assets/img/wealthClass/4bg.png'),
  require('../../../assets/img/wealthClass/5bg.png'),
  require('../../../assets/img/wealthClass/6bg.png'),
  require('../../../assets/img/wealthClass/7bg.png'),
  require('../../../assets/img/wealthClass/8bg.png'),
  require('../../../assets/img/wealthClass/9bg.png'),
  require('../../../assets/img/wealthClass/10bg.png'),
  require('../../../assets/img/wealthClass/11bg.png'),
]);

const contentImg = ref([
  require('../../../assets/img/wealthClass/1head.png'),
  require('../../../assets/img/wealthClass/2head.png'),
  require('../../../assets/img/wealthClass/3head.png'),
  require('../../../assets/img/wealthClass/4head.png'),
  require('../../../assets/img/wealthClass/5head.png'),
  require('../../../assets/img/wealthClass/6head.png'),
  require('../../../assets/img/wealthClass/7head.png'),
  require('../../../assets/img/wealthClass/8head.png'),
  require('../../../assets/img/wealthClass/9head.png'),
  require('../../../assets/img/wealthClass/10head.png'),
  require('../../../assets/img/wealthClass/11head.png'),
])

// 头部样式
const headStyle = ref({
  color: '#FFF !important',
  fontSize: '.32rem',
  fontWeight: '600',
})

// 控制背景tab标识
const tabBgIndex = ref(0)
// 控制图片重新渲染
const statusImg = ref(true);
// 切换tab触发
const onChange = (value) => {
  statusImg.value = false;
  tabBgIndex.value = value;
  levelReward.value = levelRanges.value[value];
  // 资源控制
  resourceControl(value);
  // 添加对应class
  setClassName(levelReward.value.new_wealth_level_reward_vos);
  nextTick(() => {
    statusImg.value = true;
  })
  // 判断当前iOS版本加载svga
  if (iosStatus.value < 15) storage(levelReward.value.level_svga_url,`#svga${value}`,value);
}
// 控制勋章资源加载
const resourceControl = (inx) => {
  levelRanges.value.forEach((item, index) => {
    if (inx === index) item.status = true
    else if (inx-1 === index) item.status = true
    else if (inx+1 === index) item.status = true
    else item.status = false
  })
}
// 默认宽度
const htmlSize = ref(0);
// 规则弹窗
const cutRule = () => {
  root.proxy.$router.push('rule');
}
// 更改当前宽度
const updateWindowSize = () => {
  // 获取动态的字体大小
  htmlSize.value = parseFloat(getComputedStyle(document.documentElement).fontSize) * 6.9;
}
// 获取安全高度
const safe_area = getSafeHeight() || 0;
const safe_height = ref((safe_area * 2) / 100 + 0.22 + 'rem');

// tab
let levelRanges = ref([]);
// 所属信息
const levelReward = ref([]);
// 用户数据
let myData = ref({});
// 当前用户经验进度
let experience = ref(0);
// 定位所属tab
let tabIndex = ref(0);
// 页面数据
const getHomeData = async () => {
  try {
    const res = await getUserLevelApi({
      levelType: 'wealth'
    })
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    myData.value = res.data;
    levelRanges.value = res.data.level_ranges ? res.data.level_ranges : [];
    // 单独处理区间
    levelRanges.value.forEach((item, index) => {
        item.min_level--;
        if (index === levelRanges.value.length - 1) {
          item.min_level--;
        }
    })
    // 处理下标
    setTabIndex(res.data.user_level);
    // 计算进度条
    experience.value = 4.3 / (res.data.current_level_end_point - res.data.current_level_start_point) * (res.data.level_point - res.data.current_level_start_point);
    if (experience.value > 4.3) experience.value = 4.3;
  } catch (err) {
    console.log(err);
  }
}

// 降维操作减少一次循环
const flatten = (arr, key) => {
  return arr.reduce((acc, item) => acc.concat(item[key]), []);
}

// 添加claa
const setClassName = (value) => {
  const allRewards = flatten(value, 'level_rewards');
  allRewards.forEach(ite => {
    // 在这个位置添加判断条件
    if (ite && (ite.reward_type === 'FUNCTION_WORLD_BROADCAST' || ite.reward_type === 'LEVEL_UP_NOTICE')) set(ite, 'css', 'flutter');
    else if (ite) set(ite, 'css', 'general');
  });
}

// 下标获取
const setTabIndex = (user_level) => {
  let inx = levelRanges.value.findIndex((item, index) => {
    if (user_level > item.min_level && user_level < item.max_level) return true;
    if (user_level === item.max_level) return true;
  });
  if (inx < 0) inx = 0;
  if (user_level === 200) inx = levelRanges.value.length - 1;
  // 添加判断是否和当前最大值相等
  if (user_level === levelRanges.value[inx].max_level && user_level !== 200) inx += 1;
  // 获取当前所属tab
  tabIndex.value = inx
  tabBgIndex.value = inx;
  // 获取当前tab下数据
  levelReward.value = levelRanges.value[inx];

  levelRanges.value.forEach((item, index) => {
    if (inx === index) set(item, 'status', true);
    else if (inx-1 === index) set(item, 'status', true);
    else if (inx+1 === index) set(item, 'status', true);
    else set(item, 'status', false);
  })

  // 添加对应class
  setClassName(levelReward.value.new_wealth_level_reward_vos);

  // 判断当前iOS版本加载svga
  if (iosStatus.value < 15) storage(levelReward.value.level_svga_url,`#svga${inx}`,inx);
}

// 说明弹窗
const ruleWin = ref(false);
const txt = ref('');
const openRuleWin = (value) => {
  txt.value = value;
  ruleWin.value = true;
}

// 规则跟随
const status = ref(false);
const pageChange = () => {
  const scroll_top = main.value.scrollTop;
  status.value = scroll_top > 10;
}

// 此函数因为老版本财富页面判断字段跳转回退有问题得直接跳转到我的页面
const back = () => {
  window.location.href = `wlyaame://webview/pop`;
}
// 获取默认tab
const urlParams = new URLSearchParams(window.location.search);
let from = null;
if (urlParams.has('from')) {  // 有参数
  from = urlParams.get('from');
} else { // 无参
  from = 'other';
}

// 判断是否是不支持的ios版本
const iosStatus = ref(Number(IosVersion()) || 999);

// 存储svga
const svgaSave = ref({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
  8: null,
  9: null,
  10: null,
});

// 存储 SVGA
const storage = async (svgaFile, canvas, index) => {
  let data = null;
  let db;

  // 检查是否已经存在 SVGA 实例
  if (svgaSave.value[index]) {
    return;
  }

  try {
    db = new DB();
  } catch (error) {
    console.error("Failed to initialize DB:", error);
    return;
  }

  // 从 IndexedDB 查找数据
  try {
    data = await db.find(svgaFile);
  } catch (error) {
    console.error("Failed to find data in DB:", error);
  }

  // 如果 IndexedDB 中没有数据，则从网络下载
  if (!data) {
    console.log(123)
    try {
      const downloader = new Downloader();
      const fileData = await downloader.get(svgaFile);
      const parser = new Parser();

      data = await parser.do(fileData);

      // 插入数据到 IndexedDB
      try {
        await db.insert(svgaFile, data);
      } catch (insertError) {
        console.error("Failed to insert data into DB:", insertError);
      }
    } catch (networkError) {
      console.error("Failed to download or parse SVGA file:", networkError);
      return;
    }
  }

  // 创建和初始化 Player 实例
  try {
    const player = new Player(canvas);
    await player.mount(data);
    player.set({ loop: 0 });
    player.start();

    // 缓存 Player 实例
    svgaSave.value[index] = player;

  } catch (renderError) {
    console.error("Failed to mount or start SVGA Player:", renderError);
  }
};

onActivated(() => {
  // 任务退回定位当前tab
  tabIndex.value = tabBgIndex.value;
})
onMounted(async () => {
  // 监听手机屏幕尺寸大小
  window.addEventListener('resize', updateWindowSize);
  updateWindowSize();
  main.value.addEventListener('scroll', pageChange, false);
  await getHomeData();

  // 埋点任务点击
  burialPointFun({
    event_name: "view_wealth_level_details",
    cid: -1001,
    md: 120,
    args_name: "",
    args: {
      from: from,
    },
  });
})
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;

  .frame {
    min-height: 7.5rem;
    background-image: url(../../../assets/img/wealthClass/3bg.png);
    background-repeat: no-repeat;
    background-size: contain;
    transition-duration: .3s;
    overflow: hidden;

    .lazy {
      position: fixed;
      opacity: 0;
      width: .1rem;
      height: .1rem;
      z-index: -6;
    }

    .rule {
      position: fixed;
      right: .32rem;
      width: .48rem;
      height: .48rem;
      background-image: url("https://yaame-static.yaame.io/admin/723610fa08958f12d511b10814514ba1.png");
      background-repeat: no-repeat;
      background-size: contain;
      z-index: 1000;
    }

    .blank {
      background-image: url(https://yaame-static.yaame.io/admin/5e6c9a762b1e21ebb933d1b8b032ec53.png);
    }

    .header-title {
      font-size: .32rem;
      font-weight: 600;
    }

    .tab {
      margin-left: .4rem !important;
      overflow: visible !important;
      margin-top: 2.44rem;

      .van-swipe-item {
        position: relative;

        .medal {
          position: absolute;
          top: 0;
          right: 0.2rem;
          width: 1.9rem;
          height: 1.9rem;
          z-index: 6;
        }

        .tabs,
        .tabs-no {
          width: 6.7rem;
          height: 2.76rem;
          background-image: url(../../../assets/img/wealthClass/1.png);
          background-repeat: no-repeat;
          background-size: contain;
        }

        .tabs {
          padding: .3rem;

          .head {
            display: flex;

            .avatar {
              display: flex;
              justify-content: center;
              align-items: center;
              width: .89rem;
              height: .89rem;
              border: .03rem solid rgba(255, 255, 255, 0.56);
              border-radius: 50%;

              img {
                width: .86rem;
                height: .86rem;
                border-radius: 50%;
              }
            }

            .info {
              display: flex;
              flex-direction: column;
              margin-left: .26rem;

              .name {
                width: 3.38rem;
                height: .48rem;
                font-weight: 600;
                font-size: .30rem;
                color: #216829;
                line-height: .48rem;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .grade {
                height: .33rem;
                font-size: .24rem;
                color: #619167;
                line-height: .33rem;
                text-align: left;
              }
            }
          }

          .schedule {
            position: relative;
            width: 4.3rem;
            height: .14rem;
            margin-top: .75rem;
            background: #A4D2B8;
            border-radius: .07rem;

            .value {
              position: absolute;
              height: .14rem;
              background: linear-gradient(90deg, #58DC78 0%, #36C190 100%);
              border-radius: .7rem;
              transition-duration: .3s;
            }

            span {
              position: absolute;
              top: -0.4rem;
              left: 0;
              height: .3rem;
              font-weight: 600;
              font-size: .22rem;
              color: #436E48;
              line-height: .3rem;
            }

            span:nth-child(2) {
              left: auto;
              right: 0;
            }

            p {
              position: absolute;
              top: .24rem;
              width: 5rem;
              height: .3rem;
              font-weight: 400;
              font-size: .22rem;
              color: #56855B;
            }
          }
        }

        .tabs-no {
          display: flex;
          flex-direction: column;
          padding: .93rem 0 .93rem .4rem;

          span {
            width: 4.4rem;
            margin-bottom: .08rem;
            line-height: .28rem;
            font-weight: 600;
            font-size: .28rem;
            color: #216829;
          }

          p {
            height: .33rem;
            font-size: .24rem;
            color: #619167;
            line-height: .33rem;
          }
        }

        .tabs1 {
          background-image: url(../../../assets/img/wealthClass/2.png);

          span {
            color: #43646E;
          }

          p {
            color: #61918E
          }

          .name {
            color: #43646E !important;
          }

          .grade {
            color: #61918E !important;
          }

          .schedule {
            background-color: #A2C0DD;

            .value {
              background: linear-gradient(63deg, #7FB7FF 0%, #66A8DB 100%);
            }

            span {
              color: #43646E;
            }

            p {
              color: #618191;
            }
          }
        }

        .tabs2 {
          background-image: url(../../../assets/img/wealthClass/3.png);

          span {
            color: #A25727;
          }

          p {
            color: #917961;
          }

          .name {
            color: #A25727 !important;
          }

          .grade {
            color: #917961 !important;
          }

          .schedule {
            background-color: #E0BE9E;

            .value {
              background: linear-gradient(63deg, #FFB075 0%, #F8922B 100%);
            }

            span {
              color: #A25727;
            }

            p {
              color: #917961;
            }
          }
        }

        .tabs3 {
          background-image: url(../../../assets/img/wealthClass/4.png);

          span {
            color: #5927A2;
          }

          p {
            color: #6D6191
          }

          .name {
            color: #5927A2 !important;
          }

          .grade {
            color: #6D6191 !important;
          }

          .schedule {
            background-color: #B89EE0;

            .value {
              background: linear-gradient(270deg, #6E3FBE 0%, #BE63F4 100%);
            }

            span {
              color: #5927A2;
            }

            p {
              color: #6D6191;
            }
          }
        }

        .tabs4 {
          background-image: url(../../../assets/img/wealthClass/5.png);

          span {
            color: #27A296;
          }

          p {
            color: #619185
          }

          .name {
            color: #27A296 !important;
          }

          .grade {
            color: #619185 !important;
          }

          .schedule {
            background-color: #9EE0CD;

            .value {
              background: linear-gradient(63deg, #6EC8BD 0%, #42B9A6 100%);
            }

            span {
              color: #27A296;
            }

            p {
              color: #619185;
            }
          }
        }

        .tabs5 {
          background-image: url(../../../assets/img/wealthClass/6.png);

          span {
            color: #315F9B;
          }

          p {
            color: #617B91
          }

          .name {
            color: #315F9B !important;
          }

          .grade {
            color: #617B91 !important;
          }

          .schedule {
            background-color: #98D0F4;

            .value {
              background: linear-gradient(63deg, #64A3F2 0%, #4787CF 100%);
            }

            span {
              color: #315F9B;
            }

            p {
              color: #617B91;
            }
          }
        }

        .tabs6 {
          background-image: url(../../../assets/img/wealthClass/7.png);

          span {
            color: #48525D;
          }

          p {
            color: #596470
          }

          .name {
            color: #48525D !important;
          }

          .grade {
            color: #596470 !important;
          }

          .schedule {
            background-color: #9FB2C6;

            .value {
              background: linear-gradient(63deg, #7599B0 0%, #637D9A 100%);
            }

            span {
              color: #48525D;
            }

            p {
              color: #596470;
            }
          }
        }

        .tabs7 {
          background-image: url(../../../assets/img/wealthClass/8.png);

          span {
            color: #495D48;
          }

          p {
            color: #59705B
          }

          .name {
            color: #495D48 !important;
          }

          .grade {
            color: #59705B !important;
          }

          .schedule {
            background-color: #9ACDAA;

            .value {
              background: linear-gradient(63deg, #4DDD66 0%, #40AD54 100%);
            }

            span {
              color: #495D48;
            }

            p {
              color: #59705B;
            }
          }
        }

        .tabs8 {
          background-image: url(../../../assets/img/wealthClass/9.png);

          span {
            color: #484D5D;
          }

          p {
            color: #595970
          }

          .name {
            color: #484D5D !important;
          }

          .grade {
            color: #595970 !important;
          }

          .schedule {
            background-color: #A6B8D5;

            .value {
              background: linear-gradient(63deg, #4DB4DD 0%, #4064AD 100%);
            }

            span {
              color: #484D5D;
            }

            p {
              color: #595970;
            }
          }
        }

        .tabs9 {
          background-image: url(../../../assets/img/wealthClass/10.png);

          span {
            color: #493C52;
          }

          p {
            color: #6E5970
          }

          .name {
            color: #493C52 !important;
          }

          .grade {
            color: #6E5970 !important;
          }

          .schedule {
            background-color: #C7A6D5;

            .value {
              background: linear-gradient(63deg, #924DDD 0%, #9A3AC2 100%);
            }

            span {
              color: #493C52;
            }

            p {
              color: #6E5970;
            }
          }
        }

        .tabs10 {
          background-image: url(../../../assets/img/wealthClass/11.png);

          span {
            color: #543E3E;
          }

          p {
            color: #705959
          }

          .name {
            color: #543E3E !important;
          }

          .grade {
            color: #705959 !important;
          }

          .schedule {
            background-color: #EAA1A1;

            .value {
              background: linear-gradient(63deg, #DD4D4D 0%, #C23A3A 100%);
            }

            span {
              color: #543E3E;
            }

            p {
              color: #705959;
            }
          }
        }
      }
    }

    .content {
      width: 7.5rem;
      min-height: 3.25rem;
      padding-top: .5rem;
      margin-top: .3rem;
      background-repeat: no-repeat;
      background-size: contain;
      transition-duration: .3s;

      .content-item-two,
      .content-item-one {
        position: relative;
        width: 6.9rem;
        padding-top: .64rem;
        margin: 0 auto .2rem;
        font-size: .26rem;
        color: #FFFFFF;
        padding-bottom: .2rem;

        .lock {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: .18rem;

          span {
            height: .4rem;
            line-height: .4rem;
            font-weight: 600;
            font-size: .28rem;
            color: #FFFFFF;
            opacity: .5;
          }

          .open {
            width: .27rem;
            height: .27rem;
            margin-right: .19rem;
          }

          .close {
            width: .22rem;
            height: .27rem;
            margin-right: .19rem;
          }
        }

        .info {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 6.2rem;
          min-height: 1.1rem;
          margin-left: .4rem;
          background: rgba(255, 255, 255, 0.04);
          border-radius: .22rem;

          .icon {
            position: relative;
            right: 0;
            height: 1.1rem;

            img {
              height: 90%;
            }
          }

          span {
            position: relative;
            left: 0;
            display: flex;
            align-items: center;
            float: left;
            height: 100%;
            margin: .15rem .3rem;

            img {
              width: .24rem;
              height: .24rem;
              margin-left: .13rem;
            }
          }

          .flutter {
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            img {
              position: relative;
              left: 0;
              width: 3.3rem;
              height: 90%;
            }
          }

          .general {
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;

            img {
              position: relative;
              left: 0;
              height: 90%;
            }
          }
        }
      }

      .content-item-two {
        background: linear-gradient( 90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%);
        border-radius: .3rem;

        .info {
          margin-bottom: .1rem;
        }
        .long {
          position: absolute;
          top: .65rem;
          left: .08rem;
          width: .02rem;
          height: 90%;
          background: url("https://yaame-static.yaame.io/admin/de0a65069c8421add33d7f680b002f00.png");
          background-size: contain;
        }
      }

      .content-item-one {
        width: 6.9rem;
        background: linear-gradient( 90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 100%);
        border-radius: .3rem;
        .short {
          position: absolute;
          top: .65rem;
          left: .08rem;
          width: .02rem;
          height: 80%;
          background: url("https://yaame-static.yaame.io/admin/5bdc742a5f7aae80f68a94c472112aad.png");
          background-size: contain;
        }
      }
    }

    .popup {
      transition-duration: .3s;

      .hint {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 5.9rem;
        background: #FFFFFF;
        border-radius: .24rem;

        .head {
          height: .48rem;
          margin: .6rem auto 0;
          font-weight: 600;
          font-size: .34rem;
          color: #333333;
          line-height: .48rem;
          text-align: center;
        }

        .tip {
          width: 4.9rem;
          margin: .21rem auto 0;
          font-weight: 400;
          font-size: .26rem;
          color: #666666;
          line-height: .37rem;
          text-align: left;
        }

        .button {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 4.3rem;
          height: .88rem;
          margin: .4rem auto .6rem;
          background-image: linear-gradient(90deg, rgba(99, 223, 109, 1) 0, rgba(76, 201, 164, 1) 100%);
          border-radius: .44rem .44rem .44rem .44rem;
          font-weight: 600;
          font-size: .3rem;
          color: #FFFFFF;
        }
      }
    }
  }
}
</style>