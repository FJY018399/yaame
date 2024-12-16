<template>
  <div class="main" ref="main">
    <div class="index" :style="{ backgroundImage: `url(${logoImg[language]})` }">
      <!--返回栏-->
      <custom-header color="white" :dom-main="main">{{ $t('pearl_collector') }}</custom-header>

      <!--规则弹窗和点亮-->
      <div class="rule" @click="$router.push('/rule')">{{ $t('rules_rewards') }}</div>
      <div class="pearl-rule" @click="openAwardWin">{{ $t('pearl_museum') }}</div>

      <!--时间倒计时-->
      <div class="time">
        <div class="times">{{ days }}</div>
        <div class="times">D</div>
        <div class="times">{{ hours < 10 ? '0' + hours : hours }}</div>
        <div class="times">{{ minutes < 10 ? '0' + minutes : minutes }}</div>
        <div class="times">{{ seconds < 10 ? '0' + seconds : seconds }}</div>
      </div>

      <!--活动时间-->
      <p class="activity-time"> 8/1 00:00 - 8/9 23:59(UTC+0)</p>
      <!--奖励展示-->
      <div class="event-gifts">
        <div class="head">{{ $t('event_gift') }}</div>
        <div class="gift" v-if="taskData.pearl_collector_gifts" v-for="(item, index) in taskData.pearl_collector_gifts"
             :key="index">
          <div class="icon">
            <img :src="item.reward_icon" alt="">
          </div>
          <div class="name">{{ item.reward_name }}</div>
          <div class="diamond">
            <img src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png" alt="">
            {{ item.reward_diamond_worth }}
          </div>
        </div>
      </div>

      <!--tab-->
      <div class="tab" ref="tabTop">
        <div class="tabs"
             v-show="tabStyle === 0"
             :class="{ 'tabs-one': tabStyle === index }"
             v-for="(item, index) in tabImg[language]" :key="index"
             :style="{ backgroundImage: `url(${item.one})` }"
             @click="selectTab(index)"></div>
        <div class="tabs"
             v-show="tabStyle === 1"
             :class="{ 'tabs-one': tabStyle === index }"
             v-for="(item, index) in tabImg[language]" :key="index + 2"
             :style="{ backgroundImage: `url(${item.two})` }"
             @click="selectTab(index)"></div>
      </div>

      <!--任务榜单组件-->
      <keep-alive>
        <router-view :taskData="taskData" :main="main"></router-view>
      </keep-alive>

      <!--弹窗-->
      <popup class="popup" v-show="awardWin" @cancel="awardWin = !awardWin">
        <div class="award-win">
          <!--标题-->
          <div class="header">{{ $t('pearl_museum') }}</div>
          <p>{{ $t('light_up_all') }}</p>
          <!--奖励-->
          <div class="award-list">
            <div class="icon" v-for="(item, index) in pearlData.rewards" :key="index">
              <div class="img">
                <img :src="item.reward_icon" alt="">
              </div>
              <div class="name">{{ item.reward_name }}</div>
              <div class="diamond">
                <img src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png" alt="">
                {{ item.reward_diamond_worth }}
              </div>
            </div>
            <div class="get" :class="{ 'git-button': pearlData.reward_status === 2 }"
                 :style="{ opacity: pearlData.reward_status ? '1' : '0.4' }"
                 @click="getAwardAll(pearlData.reward_status)">
              {{ pearlData.reward_status === 2 ? $t('claimed') : $t('claim') }}
            </div>
          </div>
          <!--点亮数量-->
          <div class="txt-number">{{ $t('current_light_up') }}{{
              pearlData.draws_count ? pearlData.draws_count : 0
            }}
          </div>

          <div class="lighten" @click="illumePearl">
            {{ $t('light_up_pearl') }}
          </div>

          <div class="pearl-list">
            <div class="item" v-for="(item, index) in pearlNoImg" :key="index">
              <img :src="pearlImg[index].icon" alt="">
              <img :style="{ opacity: drawsPearls[index] && drawsPearls[index].status ? '0' : '1' }" :src="item.icon"
                   alt="">
              <canvas class="svga" :id="`svga${index}`"></canvas>
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
        </div>
        <div class="rule-page-close" @click="awardWin = !awardWin"></div>
      </popup>
    </div>
    <pageLoading v-show="loading"/>
  </div>
</template>

<script setup>
import customHeader from "@/components/common/cs_header";
import {computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref} from "vue";
import {getLanguage, getSafeHeight} from "@/lib/device";
import popup from "@/components/common/pop_up.vue";
import {Downloader, Parser, Player} from 'svga.lite'
import DB from 'svga.lite/db'
import {getLightenHomeApi, getPearlCollectorHomeApi, postAllAwardApi, postLightenApi} from "@/pages/pearl/api";
import {Toast} from "vant";
import pageLoading from '@/components/common/page_loading.vue';
import eventBus from "../eventBus";
import {burialPointFun} from "@/lib/utils";

// 获取国际化函数
const root = getCurrentInstance();
const t = (val, msg) => {
  return root.proxy.$i18n.t(val, msg);
};
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

// 头部国际化
const logoImg = ref({
  "ar": 'https://yaame-static.yaame.io/admin/e55cda4aae891225cda0204406895c32.png',
  "en": 'https://yaame-static.yaame.io/admin/7c1cce6e0939bd6f14610a7e2a9c81dd.png',
  "id": 'https://yaame-static.yaame.io/admin/60a0e7f83375925e58d00d4ef8045d4d.png',
  "zh-cn": 'https://yaame-static.yaame.io/admin/ac0366a57c83ac7f797fd2a4c47d90e8.png',
  "zh-tw": 'https://yaame-static.yaame.io/admin/ac0366a57c83ac7f797fd2a4c47d90e8.png',
})

// 外层dom
const main = ref(null);

let tabStyle = ref(1);
// tab国际化
const tabImg = ref({
  "zh-cn": [
    {
      one: "https://yaame-static.yaame.io/admin/782bee791ef0720f2dfb9fb7269abed3.png", // 选中
      two: "https://yaame-static.yaame.io/admin/128cae9232fc3b2f4957b367ddbee7f4.png"
    },
    {
      two: "https://yaame-static.yaame.io/admin/57eaca0516100912ffad94ca81ff9768.png",
      one: "https://yaame-static.yaame.io/admin/47ee5334fca11a8cf614ede982818498.png"
    }
  ],
  "zh-tw": [
    {
      one: "https://yaame-static.yaame.io/admin/87bba13447f935fb082b110c0fc49124.png", // 选中
      two: "https://yaame-static.yaame.io/admin/69002cbc6be0cad1168b3b78006b8f54.png"
    },
    {
      two: "https://yaame-static.yaame.io/admin/9b3777c65cdceece4a28b7e8f8ffccf1.png",
      one: "https://yaame-static.yaame.io/admin/6adbf893faa1055830f240823370ae05.png"
    }
  ],
  "en": [
    {
      one: "https://yaame-static.yaame.io/admin/3a21f22af3a7115eeeb2a23fa73fa086.png", // 选中
      two: "https://yaame-static.yaame.io/admin/fce791d7825e78a83a07f67769637f21.png"
    },
    {
      two: "https://yaame-static.yaame.io/admin/2cbe74cc8b7690c9343f5ab6e1090848.png",
      one: "https://yaame-static.yaame.io/admin/6e66c1b3acf50877b642dba3923a966b.png"
    }
  ],
  "id": [
    {
      one: "https://yaame-static.yaame.io/admin/317a02488fafd7c6d9bcc49a9d1e4fbf.png", // 选中
      two: "https://yaame-static.yaame.io/admin/69f14f8eea4f349251651b6ca7d2b619.png"
    },
    {
      two: "https://yaame-static.yaame.io/admin/9f37ae3364702d4690205545992ed10a.png",
      one: "https://yaame-static.yaame.io/admin/b481b072aa55e39663f66e7f195c121f.png"
    }
  ],
  "ar": [
    {
      one: "https://yaame-static.yaame.io/admin/f85ba09086ffeac432e988a98f495327.png", // 选中
      two: "https://yaame-static.yaame.io/admin/cc22797c072d715e3d5a46ca8c4ef938.png"
    },
    {
      two: "https://yaame-static.yaame.io/admin/5df01a70a91d9b36df7d6047d6d73244.png",
      one: "https://yaame-static.yaame.io/admin/26dd423b83fdd4f90568a0c2bdb3f6c5.png"
    }
  ],
});
// 切换tab
const selectTab = (index) => {
  tabStyle.value = index;
  // 判断页面当前是否开始
  if (!activityStatus.value) Toast(t('event_not_started'));
  if (activityStatus.value === 2) Toast(t('event_ended'));
  if (activityStatus.value === 3) Toast(t('event_ended'));
  if (index) {
    // 埋点任务点击
    burialPointFun({
      event_name: "page_btn_click",
      cid: -1000,
      md: 2,
      args_name: "page_btn_click",
      args: {
        type: 'task_tab_click',
      },
    });
    root.proxy.$router.replace('ranking');
  } else {
    // 埋点排行点击
    burialPointFun({
      event_name: "page_btn_click",
      cid: -1000,
      md: 2,
      args_name: "page_btn_click",
      args: {
        type: 'rank_tab_click',
      },
    });
    homeData();
    root.proxy.$router.replace('task');
  }
}

// 奖励弹窗
const awardWin = ref(false);

// 珍珠图片
const pearlImg = ref([
  {
    name: 'Giftname',
    icon: 'https://yaame-static.yaame.io/admin/4ecb65ec3d543545b5169dc3a4f3ae2a.png' // 紫
  },
  {
    name: 'Giftname Giftname',
    icon: 'https://yaame-static.yaame.io/admin/7e6aa8645344ece49803a841486b3576.png' // 蓝
  },
  {
    name: 'Giftname Giftname',
    icon: 'https://yaame-static.yaame.io/admin/4c839e84e3e041f5f4ab065feb4a5456.png' // 肉色
  },
  {
    name: 'Giftname Giftname',
    icon: 'https://yaame-static.yaame.io/admin/c5f96500c2f3903650036d295ff8a541.png' // 黄色
  },
  {
    name: 'Giftname Giftname',
    icon: 'https://yaame-static.yaame.io/admin/7d33e97f5c1f35a8f0238bdebe6895fd.png' // 黑
  },
  {
    name: 'Giftname Giftname',
    icon: 'https://yaame-static.yaame.io/admin/5995fd9987a8fb776bdc03e549dd3236.png' // 银色
  },
  {
    name: 'Giftname Giftname',
    icon: 'https://yaame-static.yaame.io/admin/13cc8f6f9eab24a5ec03ffd118f1a7ba.png' // 粉色
  },
  {
    name: 'Giftname Giftname',
    icon: 'https://yaame-static.yaame.io/admin/a3ebc8738ce7f3540c7f084676131063.png' // 绿色
  },
  {
    name: 'Giftname Giftname',
    icon: 'https://yaame-static.yaame.io/admin/e6e68873e171cff6f247f6c195c9b86e.png' // 炫彩
  },
]);
const pearlNoImg = ref();

// 珍珠页数据
const pearlData = ref({});
const drawsPearls = ref([]);
// 打开弹窗
const openAwardWin = async () => {
  awardWin.value = true;
  // 埋点珍珠点亮页面
  burialPointFun({
    event_name: "page_btn_click",
    cid: -1000,
    md: 2,
    args_name: "page_btn_click",
    args: {
      type: 'pearl_museum',
    },
  });
  try {
    const res = await getLightenHomeApi();
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    pearlData.value = res.data;
    drawsPearls.value = res.data.draws_pearls;
  } catch (err) {
    console.log(err);
  }
}

// svga
const svgaImg = ref([
  'https://yaame-static.yaame.io/admin/2e19afe605956fbf9fa2e42dbfa6c87a.svga',
  'https://yaame-static.yaame.io/admin/ad47aa96782495dc3e60f8544198906f.svga',
  'https://yaame-static.yaame.io/admin/eee8323db1f347db01972a59021d333d.svga',
  'https://yaame-static.yaame.io/admin/04388351aa2c4764be78bd3026d71d32.svga',
  'https://yaame-static.yaame.io/admin/7bc0aa7dde6f97a91fc4ed977bdfaac7.svga',
  'https://yaame-static.yaame.io/admin/93a05b6a63bcc771d5be0b557ed54cc7.svga',
  'https://yaame-static.yaame.io/admin/fcbc0de49f28740d9470720f32b1b861.svga',
  'https://yaame-static.yaame.io/admin/9eafbbafd5b3a3669e9896d5606b5a65.svga',
  'https://yaame-static.yaame.io/admin/83b9f90b2a32ccc76d93b20e25f1fffb.svga'
]);
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
});
// 存储svag
const storage = async (svgaFile, canvas, index) => {
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

  svgaSave.value[index].set({loop: 1})
  svgaSave.value[index].start()
}

// tab吸顶
let tabTop = ref();
let safe_area = getSafeHeight() || 0;
// 页面卷去高度
const bodyTop = () => {
  if (!tabTop.value) return;
  // 获取动态的字体大小
  const htmlSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  // 算出屏幕到达的固定位置
  const targetPixeValue = main.value.scrollTop / htmlSize;
  //(12.43 - (safe_area * 2) / 100) - 1.14  距离顶部距离-手机安全高度-设计稿要求距离+内容固定的0.88
  if (targetPixeValue >= (12.43 - (safe_area * 2) / 100) - 1.14) {
    tabTop.value.style.position = 'fixed';
    let safe_height = (safe_area * 2) / 100;
    tabTop.value.style.top = (1.14 + safe_height) + 'rem';
  } else if (targetPixeValue < (12.43 - (safe_area * 2) / 100) - 1.14) {
    tabTop.value.style.position = 'absolute';
    tabTop.value.style.top = '12.43rem';
  }
};

// 被点亮索引
let throttle = false;
// 点亮珍珠
const illumePearl = async () => {
  try {
    if (throttle) return;
    throttle = true;
    const res = await postLightenApi({});
    if (res.status !== 1000) {
      Toast(res.desc);
      throttle = false;
      await openAwardWin();
      return;
    }
    Toast(t('light_up_success', {msg: pearlNoImg.value[res.data.pearl_index].name}));
    const index = res.data.pearl_index;
    await storage(svgaImg.value[index], `#svga${index}`, index)
    // 三秒过后清除动画
    setTimeout(() => {
      svgaSave.value[index].clear()
      drawsPearls.value[res.data.pearl_index].status = 1; // 更改当前点亮状态
      throttle = false;
    }, 3000)
    await openAwardWin();
  } catch (err) {
    console.log(err);
  }
}

// 活动结束时间戳
const timeEnd = ref(0);
// 页面计时时间
let days = ref(0);
let hours = ref(0);
let minutes = ref(0);
let seconds = ref(0);
const updateTime = () => {
  const now = new Date().getTime();
  const timeDifference = timeEnd.value - now;
  if (timeDifference > 0) {
    days.value = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((timeDifference % (1000 * 60)) / 1000);
  } else {
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
  }
};
// 定时器倒计时
let timeOut = null;
const openTiming = () => {
  timeOut = setInterval(() => {
    updateTime();
  }, 1000)
}

// 任务页面数据
const taskData = ref({});
// 页面活动标识
const activityStatus = ref(1);
// 获取页面数据
const homeData = async () => {
  try {
    const res = await getPearlCollectorHomeApi();
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    activityStatus.value = res.data.activity_status
    taskData.value = res.data;
    timeEnd.value = res.data.activity_end_time;
  } catch (err) {
    console.log(err);
  }
}

// 领取所有奖励
const getAwardAll = async (status) => {
  try {
    if (!status) return;
    const res = await postAllAwardApi({});
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    Toast(t('claim_successful'));
    await openAwardWin();
  } catch (err) {
    console.log(err);
  }
}

// 添加loading
let loading = ref(true);

onMounted(async () => {
  // 监听页面滚动事件
  main.value.addEventListener('scroll', bodyTop);

  window.onload = () => {
    loading.value = false;
    // 首屏加载过后隐式加载资源
    pearlNoImg.value = [
      {
        name: t('purple_light_pearl'),
        icon: 'https://yaame-static.yaame.io/admin/77d667d7d8d99c67fa75f54824e00641.png' // 紫
      },
      {
        name: t('peacock_blue_pearl'),
        icon: 'https://yaame-static.yaame.io/admin/c0364a7d01ae34d5479ba8b5ba673a2b.png' // 蓝
      },
      {
        name: t('aurora_pearl'),
        icon: 'https://yaame-static.yaame.io/admin/b80343fba047f0d78ff722240b99ced5.png' // 肉色
      },
      {
        name: t('golden_pearl'),
        icon: 'https://yaame-static.yaame.io/admin/d6dd35f92a83fd8a86ac348da372bdd0.png' // 黄色
      },
      {
        name: t('brilliant_pearl'),
        icon: 'https://yaame-static.yaame.io/admin/e3cb8149bc417dbb15d0e946b6efd89a.png' // 黑
      },
      {
        name: t('silver_pearl'),
        icon: 'https://yaame-static.yaame.io/admin/8d9faec800d4d51fb74af87811209452.png' // 银色
      },
      {
        name: t('pink_light_pearl'),
        icon: 'https://yaame-static.yaame.io/admin/e4abbc0dd1149a6cdc5f8fd8931e627a.png' // 粉色
      },
      {
        name: t('jade_pearl'),
        icon: 'https://yaame-static.yaame.io/admin/bec11925d24028d1ff11fff194ae3657.png' // 绿色
      },
      {
        name: t('glowing_pearl'),
        icon: 'https://yaame-static.yaame.io/admin/7fda562c1fae8708844031c1f2de7ad6.png' // 炫彩
      },
    ];
  }
  // 埋点进入页面
  burialPointFun({
    event_name: "event_page_view",
    cid: -1000,
    md: 1,
    args_name: "event_page_view",
  });
  // 获取页面数据
  await homeData();
  // 判断页面当前是否开始
  if (!activityStatus.value) Toast(t('event_not_started'));
  if (activityStatus.value === 2) Toast(t('event_ended'));
  if (activityStatus.value === 3) Toast(t('event_ended'));
  // 请求结束之后切回默认展示tab 是为了提前加载资源去除tab闪烁
  tabStyle.value = 0;
  // 开启页面倒计时
  openTiming();
  // 插入方法
  eventBus.on('getHomeData', homeData);
})

onBeforeUnmount(() => {
  eventBus.off('getHomeData', homeData);
})
</script>

<style lang="less" scoped>
.main {
  height: 100vh;
  overflow: auto;

  .index {
    position: relative;
    min-height: 100vh;
    background-repeat: no-repeat;
    background-size: contain;
    overflow: hidden;

    .activity-time {
      margin: 2.66rem auto 0;
      height: .24rem;
      line-height: .24rem;
      font-size: .24rem;
      color: #FFFFFF;
      text-align: center;
      font-weight: 600;
      letter-spacing: .02rem;
    }

    .pearl-rule,
    .rule {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 3.19rem;
      right: 0;
      width: 1.9rem;
      height: .6rem;
      line-height: .25rem;
      background-image: url("https://yaame-static.yaame.io/admin/5cd0a1cd8c4cd61946e7f7296318d9f1.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      font-size: .22rem;
      color: #FFFFFF;
      text-align: center;
    }

    .time {
      position: absolute;
      top: 4.78rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: space-between;
      width: 4.29rem;
      font-size: .26rem;
      color: #FFFFFF;

      .times {
        display: flex;
        justify-content: center;
        align-items: center;
        width: .69rem;
        height: .69rem;
      }
    }

    .pearl-rule {
      top: 4.14rem;
      background-image: url("https://yaame-static.yaame.io/admin/6ab413d5556116a0aa96958e4caa1a4d.png");
    }

    .event-gifts {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      width: 7.1rem;
      height: 6.26rem;
      margin: 2.9rem auto 1.69rem;
      padding-top: 1.06rem;
      padding-left: .65rem;
      background: url("https://yaame-static.yaame.io/admin/a04928efd6d1aae1e2d4b6ec7d8c54a9.png") no-repeat;
      background-size: contain;

      .head {
        position: absolute;
        top: .34rem;
        left: 50%;
        transform: translateX(-50%);
        height: .30rem;
        font-weight: 600;
        font-size: .3rem;
        color: #FFFFFF;
        line-height: .3rem;
        text-align: center;
      }

      .gift {
        width: 1.54rem;
        font-weight: 600;
        color: #FFFFFF;
        margin-right: .59rem;

        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.54rem;
          height: 1.54rem;
          background: url("https://yaame-static.yaame.io/admin/86c27759c803340b492c9f4b3d0cd7ab.png") no-repeat;
          background-size: contain;

          img {
            width: .97rem;
            height: .97rem;
          }
        }

        .name {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: .4rem;
          margin: .08rem 0 .05rem;
          font-size: .22rem;
          line-height: .20rem;
          text-align: center;
        }

        .diamond {
          height: .33rem;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: .24rem;

          img {
            width: .22rem;
            height: .19rem;
          }
        }
      }

      .gift:nth-child(2n+1) {
        margin-top: .03rem;
      }
    }

    .tab {
      position: absolute;
      top: 12.43rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      width: 5.67rem;
      height: .81rem;
      z-index: 2;

      .tabs {
        width: 2.6rem;
        height: .80rem;
        background-repeat: no-repeat;
        background-size: contain;
      }

      .tabs-one {
        width: 2.6rem;
        height: .81rem;
      }
    }

    .popup {
      overflow: auto;

      .award-win {
        position: relative;
        width: 6.81rem;
        height: 13.9rem;
        margin: .66rem auto 0;
        background: url("https://yaame-static.yaame.io/admin/084b928ef9635fbb7f75facb38e65c69.png") no-repeat;
        background-size: contain;
        overflow: hidden;

        p {
          width: 95%;
          height: .3rem;
          line-height: .3rem;
          font-size: .22rem;
          color: #FFFFFF;
          text-align: center;
          margin: 1.12rem auto 0;
        }

        .header {
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: absolute;
          top: .26rem;
          left: 50%;
          transform: translateX(-50%);
          width: 2.48rem;
          height: .52rem;
          font-weight: 600;
          font-size: .32rem;
          color: #FFEA83;
          line-height: .26rem;
          text-align: center;
        }

        .award-list {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          width: 6rem;
          height: 2.2rem;
          margin: .11rem auto 0;
          background: #265CC4;
          border-radius: .2rem;
          border: .02rem solid #7DD4FF;
          transition-duration: .3s;

          .icon {
            display: flex;
            flex-direction: column;
            width: 1.18rem;
            font-size: .2rem;
            color: #FFFFFF;

            .img {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 1.18rem;
              height: 1.18rem;
              background: url("https://yaame-static.yaame.io/admin/86c27759c803340b492c9f4b3d0cd7ab.png") no-repeat;
              background-size: contain;

              img {
                width: .84rem;
                height: .84rem;
              }
            }

            .name {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: .4rem;
              margin-top: .05rem;
              line-height: .2rem;
              text-align: center;
            }

            .diamond {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;

              img {
                width: .2rem;
                height: .17rem;
              }
            }
          }

          .get {
            width: 1.41rem;
            height: .62rem;
            font-weight: 600;
            font-size: .24rem;
            color: #FFFFFF;
            padding-top: .1rem;
            background: url("https://yaame-static.yaame.io/admin/6969c26e57785b63c6a50f54bb4b5629.png") no-repeat;
            background-size: contain;
            text-align: center;
          }

          .git-button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.83rem;
            height: .59rem;
            padding-top: 0;
            background-repeat: no-repeat;
            background-size: contain;
            color: #FFFFFF;
            background-image: url("https://yaame-static.yaame.io/admin/2799bae71a8f699a39d27d5d24808dfc.png");
          }
        }

        .txt-number {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 5.3rem;
          height: .54rem;
          margin: .24rem auto .19rem;
          background: rgba(8, 61, 165, 0.5);
          border-radius: .55rem;
          font-weight: 600;
          font-size: .22rem;
          color: #FFFFFF;
        }

        .lighten {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2.56rem;
          height: 1.08rem;
          padding-top: .1rem;
          margin: auto;
          background: url("https://yaame-static.yaame.io/admin/15f986a4cfb813eb5614cd6f0814ac3f.png") no-repeat;
          background-size: contain;
          font-weight: 600;
          font-size: .24rem;
          color: #FFFFFF;
          transition-duration: .3s;
          text-align: center;
          line-height: .25rem;
          animation: open 1.2s infinite;
        }

        .pearl-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-evenly;

          .item {
            position: relative;
            width: 1.94rem;
            padding-top: 2rem;

            img {
              position: absolute;
              top: 0;
              width: 1.94rem;
              height: 2rem;
              transition-duration: .3s;
            }

            .name {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: .40rem;
              margin: .06rem auto .08rem;
              font-weight: 600;
              font-size: .22rem;
              color: #FFFFFF;
              line-height: .20rem;
              text-align: center;
            }

            .svga {
              position: absolute;
              top: 0;
              width: 1.94rem;
              height: 2rem;
              z-index: 1;
            }
          }
        }
      }

      .rule-page-close {
        width: .5rem;
        height: .5rem;
        margin: .36rem auto 0;
        background: url("https://yaame-static.yaame.io/admin/707119e0ce51aacfd88ef38c410d533a.png") no-repeat;
        background-size: contain;
      }
    }
  }
}

@keyframes open {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.03);
  }
  100% {
    transform: scale(1);
  }
}
</style>