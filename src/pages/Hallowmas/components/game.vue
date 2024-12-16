<template>
  <div v-show="lazyLoad" class="game">
    <!-- 游戏说明 -->
    <p class="explain">{{ $t('candy_value_info') }}</p>

    <!-- 拼图 -->
    <div class="puzzle">
      <div class="head">{{ $t('map_x', { msg: pictureIndex + 1 }) }}</div>
      <!-- 展示拼图 -->
      <div class="picture">
        <ul :style="{ left: location[pictureIndex] }">
          <li v-for="(item, index) in pictureDark" :key="index">
            <img v-for="(ite, inx) in item" :key="inx" :src="ite" alt="">
            <!-- 铺底 -->
            <div class="fundus"></div>
          </li>
        </ul>
        <ul :style="{ left: location[pictureIndex] }">
          <li v-for="(item, index) in pictureBright" :key="index">
            <img :style="{ opacity: puzzlesList[index]?.pieces[inx]?.light_status }" v-for="(ite, inx) in item"
              :key="inx" :src="ite" alt=""
              @click="clickBright(ite, puzzlesList[index]?.pieces[inx].piece_id, puzzlesList[index]?.pieces[inx]?.light_status)">
          </li>
        </ul>
      </div>
      <!-- 成功动画展示 -->
      <img v-if="animationStatus" class="animation" :src="animation[pictureIndex]" alt="">
      <!-- 左右按钮 -->
      <div class="right box" @click="rightCut"></div>
      <div class="left box" @click="leftCut"></div>
      <!-- 重复碎片展示 -->
      <div class="repetition">
        <img v-if="webpStatus" class="box" v-for="(item, index) in 5" :key="index"
          :src="index < repetition ? repetitionIcon[0] : repetitionIcon[1]" alt="">
      </div>
      <!-- 说明文案展示 -->
      <div class="txt">{{ $t('combine_fragment') }}</div>
      <!-- 点亮tab -->
      <div class="illume">
        <div class="box" v-for="(item, index) in illumeList" :key="index"
          :style="{ opacity: frequency < item.type ? '0.5' : 1 }" @click="debris(item.type)">
          <img class="box" :src="item.img" alt="">
          <span>{{ item.name }}</span>
        </div>
      </div>
      <!-- 个人信息 -->
      <div class="my-info box">
        <div class="info">
          <div class="icon">
            <img class="box" :src="myIcon" alt="">
          </div>
          <div class="list">
            <span>{{ $t('my_candy_value') }}: {{ candies }}</span>
            <span>{{ $t('lightable_times') }}: {{ frequency }}</span>
          </div>
        </div>
        <div class="schedule">
          <i18n path="map_x_progress">
            <template v-slot:msg>
              {{ pictureIndex + 1 }}<img src="https://yaame-static.yaame.io/admin/71f9c771ec6edb5fe900590f7f02b1d6.png"
                alt="">
            </template>
          </i18n>
          {{ puzzlesList[pictureIndex]?.progress }}/16
        </div>
      </div>
      <!-- 提示 -->
      <div class="tips">
        <div class="frame"></div>
        <p><img src="https://yaame-static.yaame.io/admin/e06324b27b72bccda018b7c0044f56de.png" alt="">Tips：{{
          $t('click_to_purchase') }}</p>
      </div>
      <!-- 历史记录页 -->
      <div class="history" @click="getRecordA">{{ $t('reward_record') }}</div>
    </div>

    <!-- 奖池 -->
    <div class="jackpot">
      <div class="list box" v-for="(item, index) in HomeData" :key="index">
        <div class="icon" :class="`icon${item.start_level}`">
          <span>{{ item.start_level === 5 ? $t('super') : item.start_level === 3 ? $t('rare') : $t('normal') }}</span>
          <img class="box" :src="item.reward.reward_icon" alt="">
          <div class="day" v-if="item.reward.object_type !== 'DIAMOND'">{{ item.reward.subscript }}</div>
        </div>
        <div class="name">{{ item.reward.reward_name }}</div>
        <div v-if="item.reward.reward_diamond_worth" class="diamond">
          <img src="https://yaame-static.yaame.io/admin/69a3c9ed074266defeaf4d31bab361d9.png" alt="">
          {{ item.reward.reward_diamond_worth }}
        </div>
      </div>
      <div class="head box">{{ $t('reward_pool') }}</div>
    </div>

    <!-- 是否点亮碎片弹窗 -->
    <popup class="popup" v-show="illuminedWin" @cancel="illuminedWin = !illuminedWin" :visible="illuminedWin">
      <div class="illumine">
        <div class="icon">
          <div class="frame"></div>
          <img :src="imgList" alt="">
        </div>
        <div class="txt">
          <i18n path="spend_diamonds_light">
            <template v-slot:msg>
              300<img src="https://yaame-static.yaame.io/admin/69a3c9ed074266defeaf4d31bab361d9.png" alt="">
            </template>
          </i18n>
        </div>
        <div class="close" @click="illuminedWin = !illuminedWin">{{ $t('cancel') }}</div>
        <div class="button" @click="openDiamond">{{ $t('yes') }}</div>
      </div>
    </popup>

    <!-- 碎片弹窗 -->
    <popup class="popup" v-show="debrisdWin" :visible="debrisdWin">
      <div class="award-win" :style="{ paddingTop: lightPiece.length === 1 ? '1.25rem' : '1.85rem' }">
        <div class="award-win-item" :class="{ 'one': lightPiece.length === 1, 'two': lightPiece.length > 5 }"
          v-for="(item, index) in lightPiece" :key="index">
          <div class="from"></div>
          <img :src="item" alt="">
        </div>
        <div v-if="pieceReward.length" class="award">
          <i18n path="light_fragment_reward">
            <template v-slot:msg>
              <img v-for="(ite, inx) in pieceReward" :src="ite.reward.reward_icon" alt="">
            </template>
          </i18n>
        </div>
        <div v-else class="award" style="text-align: center">{{ $t('light_fragment_success') }}</div>
        <div class="button" @click="openOK">OK</div>
      </div>
    </popup>

    <!-- 地图完成弹窗 -->
    <popup class="popup" v-show="mapFinish" @cancel="mapFinish = !mapFinish" :visible="mapFinish">
      <div class="map-finish">
        <div class="frame">
          <div class="award-item" v-for="(item, index) in puzzleReward" :key="index">
            <div class="icon">
              <img :src="item.reward.reward_icon" alt="">
            </div>
            <div class="name">{{ item.reward.reward_name }}</div>
          </div>
        </div>
        <div class="txt">
          {{ $t('combine_map_success') }}
        </div>
        <div class="button" @click="mapFinish = !mapFinish">OK</div>
      </div>
    </popup>

    <!-- 历史弹窗 -->
    <popup class="popup" v-show="historyWin" @cancel="historyWin = !historyWin" :visible="historyWin">
      <div class="history-win">
        <div class="head">{{ $t('reward_record') }}</div>
        <div v-if="historyList.length" class="frame">
          <div v-if="item.puzzle_reward.length" class="item" :class="{ 'special': typeof item.index === 'number' }"
            v-for="(item, index) in historyList" :key="index">
            <span>{{ formatDate(item.timestamp, 'yyyy.MM.dd hh:mm') }}(UTC+0)</span>
            <span v-if="typeof item.index === 'number'">{{ $t('light_complete_map', { msg: item.index + 1 }) }}</span>
            <span v-else-if="item.light_cnt === 1">{{ $t('light_once') }}</span>
            <span v-else-if="item.light_cnt === 5">{{ $t('light_five_times') }}</span>
            <div class="gifts" v-for="(ite, inx) in item.puzzle_reward" :key="inx">
              <div class="icon">
                <div v-if="ite.reward.object_type !== 'DIAMOND'" class="day">{{ ite.reward.subscript }}</div>
                <img :src="ite.reward.reward_icon" alt="">
              </div>
              <div v-if="ite.reward.object_type !== 'DIAMOND'" class="name">{{ ite.reward.reward_name }}</div>
              <div v-if="ite.reward.object_type === 'DIAMOND'" class="diamond">
                <img src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png" alt="">
                {{ ite.reward.reward_diamond_worth }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="deficiency">
          <p>{{ $t('no_records') }}</p>
        </div>
      </div>
      <div class="rule-page-close" @click="historyWin = false"></div>
    </popup>
    <img v-if="webpStatus" class="webp" :src="item" v-for="(item, index) in animation" :key="index" alt="">
  </div>
</template>

<script setup>
import { getCurrentInstance, onActivated, onMounted, ref } from "vue";
import popup from "@/components/common/pop_up.vue";
import { getPuzzleHomeApi, getRecordApi, postDiamondApi, postPuzzleListApi } from "@/pages/Hallowmas/api";
import { lazyLoadImages } from "@/lib/load-img";
import { formatDate } from "@/lib/utils";
import { Toast } from "vant";

// 获取国际化函数
const root = getCurrentInstance();
const t = (val) => {
  return root.proxy.$i18n.t(val);
};

// 点亮碎片icon
const repetitionIcon = ref([
  'https://yaame-static.yaame.io/admin/164865de85055f9eb0b0f323f1f1f68e.png',
  'https://yaame-static.yaame.io/admin/5417b23fbd16fb1a259b316a5694484b.png'
])

// 给父组件传递顶部数据
const emit = defineEmits(['homeDataFun']);

// 拼图暗列表
const pictureDark = ref([
  [
    'https://yaame-static.yaame.io/admin/649d7b42250f07013db4c6d237bc9c91.png',
    'https://yaame-static.yaame.io/admin/c994d26b831e4d3d62370890221ad27a.png',
    'https://yaame-static.yaame.io/admin/3419ef436e6e2978f54c3d1fc9aa8337.png',
    'https://yaame-static.yaame.io/admin/645b6d1e5005699308d196f5d65939fc.png',
    'https://yaame-static.yaame.io/admin/27664b1917cb4ec2c2041454b8f91bd9.png',
    'https://yaame-static.yaame.io/admin/96c1a32b1c280b83b79beb7106e99b05.png',
    'https://yaame-static.yaame.io/admin/bd281af307ca0c0061c6e291850357dc.png',
    'https://yaame-static.yaame.io/admin/af72f8a1fc6d0eebcc34c8ae9e8e7ae8.png',
    'https://yaame-static.yaame.io/admin/b4faf5d5d34b393eb0880a5d2ad8d4fb.png',
    'https://yaame-static.yaame.io/admin/cfac5083b652dd5bf2120b488dbf6fdd.png',
    'https://yaame-static.yaame.io/admin/c45e23c89077ca0d0fa8a84944ee1635.png',
    'https://yaame-static.yaame.io/admin/65b8ff540f18118e4531ca2cb60f8f95.png',
    'https://yaame-static.yaame.io/admin/3ce0616aa7c968091bc3bd16ca0ebb18.png',
    'https://yaame-static.yaame.io/admin/cd385eb44becba299ccb8cfd2aa3147c.png',
    'https://yaame-static.yaame.io/admin/0e17d144d3d736c37fd311449ad6107b.png',
    'https://yaame-static.yaame.io/admin/9a1af26840658a5f832f96333fd63c50.png'
  ],
]);
const pictureBright = ref([
  [
    'https://yaame-static.yaame.io/admin/b945f7bd500aa161f87a794a124f621d.png',
    'https://yaame-static.yaame.io/admin/08fe60fddd5af3a4685464d77fe31830.png',
    'https://yaame-static.yaame.io/admin/95b2699ff57eb3f53d9a263d44173f45.png',
    'https://yaame-static.yaame.io/admin/2e915834b8950a7d065af7fa4b7799b9.png',
    'https://yaame-static.yaame.io/admin/e1ceff7666671a1fee98199e8f94fdc1.png',
    'https://yaame-static.yaame.io/admin/24efcb4792fe40981e7a54996fb72ed3.png',
    'https://yaame-static.yaame.io/admin/4888f88202eae1f22ec269053ef31fd4.png',
    'https://yaame-static.yaame.io/admin/78237049d891b399677b834460163074.png',
    'https://yaame-static.yaame.io/admin/f40b119803d76d7d1cd456fe1686328a.png',
    'https://yaame-static.yaame.io/admin/a2150c823aa3fd1a5e617ec5d08048f0.png',
    'https://yaame-static.yaame.io/admin/f446815aca1490d357dc58e144d7f19e.png',
    'https://yaame-static.yaame.io/admin/a01157999f17d6bb5898d981f46e08d1.png',
    'https://yaame-static.yaame.io/admin/440ae0d6dd2ece5cc02e3731a6bc9376.png',
    'https://yaame-static.yaame.io/admin/e7a76a8db063672f009efc34645114a1.png',
    'https://yaame-static.yaame.io/admin/5616ced5e76f10c89bb2aab4c9229c4c.png',
    'https://yaame-static.yaame.io/admin/2c1f7011cbea029f0029411ed9d82c62.png'
  ],
])
// 控制拼图切换
const pictureIndex = ref(0);
// tab位置
const location = ref(['0', '-5.8rem', '-11.6rem'])

// 向左切换
const rightCut = () => {
  pictureIndex.value = pictureIndex.value >= pictureDark.value.length - 1 ? pictureDark.value.length - 1 : ++pictureIndex.value;
}
// 向左切换
const leftCut = () => {
  pictureIndex.value = pictureIndex.value <= 0 ? 0 : --pictureIndex.value;
}

// 点亮按钮
const illumeList = ref([
  {
    name: t('light_once'),
    type: 1,
    img: 'https://yaame-static.yaame.io/admin/71f9c771ec6edb5fe900590f7f02b1d6.png'
  },
  {
    name: t('light_five_times'),
    type: 5,
    img: 'https://yaame-static.yaame.io/admin/b120714fedb968256f66c27b547f7e08.png'
  }
]);
// 点亮数据
const lightPiece = ref([]);
// 碎片奖励
const pieceReward = ref([]);
const puzzleReward = ref([]);
// 点亮地图
const lightPuzzle = ref(null);
// 节流阀
const throttle = ref(false);
// 点亮碎片方法
const debris = async (type) => {
  try {
    // 判断点亮次数
    if (frequency.value < type) {
      Toast(t('no_light_chances'));
      return;
    }
    // 节流阀
    if (throttle.value) return;
    throttle.value = true;
    // 清空上次抽奖记录
    lightPiece.value = [];
    pieceReward.value = [];
    puzzleReward.value = [];
    const res = await postPuzzleListApi({
      light_cnt: type
    })
    if (res.status !== 1000) {
      Toast(res.desc);
      throttle.value = false;
      return;
    }
    // 获取数据
    pieceReward.value = res.data.piece_reward;
    puzzleReward.value = res.data.light_puzzle.length ? res.data.light_puzzle[0].puzzle_reward : [];
    lightPuzzle.value = res.data.light_puzzle.length ? res.data.light_puzzle[0].index : null;
    // 获取点亮碎片
    res.data.light_piece.forEach((piece) => {
      lightPiece.value.push(pictureBright.value[piece.puzzle_index][piece.piece_index]);
      // 点亮对应碎片
      puzzlesList.value[piece.puzzle_index].pieces[piece.piece_index].light_status = 1;
    });
    await getHome();
    if (lightPiece.value.length) debrisdWin.value = true;
  } catch (err) {
    console.log(err);
  }
}

// 动画列表
const animation = ref([
  'https://yaame-static.yaame.io/admin/bdcbb8ed1e2be3f2a59e361688348264.webp',
  'https://yaame-static.yaame.io/admin/f25d0517e479f49218a78709ed289a55.webp',
  'https://yaame-static.yaame.io/admin/a04039ac9e9cf2370da0e560c6051821.webp'
]);

// 控制动画开始展示
const animationStatus = ref(false);
// 关闭碎片奖励弹窗
const openOK = () => {
  debrisdWin.value = !debrisdWin.value;
  // 关闭弹窗打开节流阀
  throttle.value = false;
  // 有拼图奖励先进行动画播放
  if (puzzleReward.value.length) {
    // 移动到该地图进度动画播放
    pictureIndex.value = lightPuzzle.value;
    setTimeout(() => {
      animationStatus.value = true;
    }, 300)
    setTimeout(() => {
      animationStatus.value = false;
      // 播放完毕进行礼物弹窗
      mapFinish.value = true;
    }, 6000)
  }
}

// 总地图成功奖励
const mapFinish = ref(false);

// 碎片弹窗
const debrisdWin = ref(false);

// 点亮碎片弹窗控制
const illuminedWin = ref(false);
// 存储当前购买碎片信息
const imgList = ref('');
// 存储点亮id
const diamondId = ref(null);
// 打开购买弹窗
const clickBright = async (img, id, status) => {
  try {
    if (status) {
      Toast(t('bright'));
      return;
    }
    imgList.value = img;
    diamondId.value = id;
    illuminedWin.value = true;
  } catch (err) {
    console.log(err);
  }
}

const buyDiamondStatus = ref(false);
// 确认购买
const openDiamond = async () => {
  try {
    illuminedWin.value = false;
    // 节流控制
    if (buyDiamondStatus.value) return;
    buyDiamondStatus.value = true;
    // 清空上次抽奖记录
    lightPiece.value = [];
    pieceReward.value = [];
    puzzleReward.value = [];
    const res = await postDiamondApi({
      piece_id: diamondId.value
    })
    if (res.status !== 1000) {
      if (res.status === 6600) {
        window.location.href = "wlyaame://mine/shop/diamond?popup=1";
      }
      Toast(res.desc);
      buyDiamondStatus.value = false;
      return;
    }
    buyDiamondStatus.value = false;
    // 获取数据
    pieceReward.value = res.data.piece_reward;
    puzzleReward.value = res.data.light_puzzle.length ? res.data.light_puzzle[0].puzzle_reward : [];
    lightPuzzle.value = res.data.light_puzzle.length ? res.data.light_puzzle[0].index : null;
    // 获取点亮碎片
    res.data.light_piece.forEach((piece) => {
      lightPiece.value.push(pictureBright.value[piece.puzzle_index][piece.piece_index]);
      // 点亮对应碎片
      puzzlesList.value[piece.puzzle_index].pieces[piece.piece_index].light_status = 1;
    });
    await getHome();
    if (lightPiece.value.length) debrisdWin.value = true;
  } catch (err) {
    console.log(err);
  }
}

// 三组拼图点亮进度信息
const puzzlesList = ref([]);
// 奖励信息
const HomeData = ref([]);
// 重复碎片数量
const repetition = ref(0);
// 点亮次数
const frequency = ref(0);
// 糖果值
const candies = ref(0);
// 用户头像
const myIcon = ref('');
// 首页数据
const getHome = async () => {
  try {
    const res = await getPuzzleHomeApi();
    if (res.status !== 1000) return;
    puzzlesList.value = res.data.puzzles;
    HomeData.value = res.data.puzzles_rewards;
    repetition.value = res.data.repeat_piece_cnt;
    frequency.value = res.data.light_cnt;
    candies.value = res.data.user_gift_cnt;
    myIcon.value = res.data.avatar
    emit('homeDataFun', res.data);
  } catch (err) {
    console.log(err);
  }
}

// 历史记录弹窗控制
const historyWin = ref(false);
// 历史记录
const historyList = ref([]);
const getRecordA = async () => {
  try {
    historyWin.value = true;
    const res = await getRecordApi();
    if (res.status !== 1000) return;
    // 处理历史奖励未展示缺省页问题
    historyList.value = res.data.reward_records.filter(item => item.puzzle_reward.length)
  } catch (err) {
    console.log(err);
  }
}

// 页面加载完毕加载webp
const webpStatus = ref(false);
// 赋值地图
const listLoadImg = () => {
  webpStatus.value = true;
  pictureDark.value = [...pictureDark.value,
  [
    'https://yaame-static.yaame.io/admin/3361888d6e9850ddfe2d755154ba1c0d.png',
    'https://yaame-static.yaame.io/admin/0e0fe840d03c3c4dcf0b6f93adbea5a2.png',
    'https://yaame-static.yaame.io/admin/07b2942aad7c19263e87fa4dc42daa97.png',
    'https://yaame-static.yaame.io/admin/dbfbe7a7f77bc1a5dde99dd545cbdddf.png',
    'https://yaame-static.yaame.io/admin/de3aebaa6dfca24edabcf281f3a9dfee.png',
    'https://yaame-static.yaame.io/admin/84b7e06efae782b54048d369104bec22.png',
    'https://yaame-static.yaame.io/admin/51b08493e4affdbc6035ebb37ea32ca5.png',
    'https://yaame-static.yaame.io/admin/fa8fe8bc9fd2b9a2d232a2354323b2de.png',
    'https://yaame-static.yaame.io/admin/17fa1f11f11e2a09c01de4c7db053cb5.png',
    'https://yaame-static.yaame.io/admin/0ca01a0f4e12dd5ff7d2c8cf75a8c756.png',
    'https://yaame-static.yaame.io/admin/677644e6bc1b0b296f4beceaa1257325.png',
    'https://yaame-static.yaame.io/admin/24aafdb283cb59aa806a491817178f19.png',
    'https://yaame-static.yaame.io/admin/f08230b8fc16a89c26f991879b660816.png',
    'https://yaame-static.yaame.io/admin/9dfbb692be58fe2ac0458abd1f85503c.png',
    'https://yaame-static.yaame.io/admin/919f2b8d0c32c59e150a28d62b15cdde.png',
    'https://yaame-static.yaame.io/admin/5a63d889ff9ce738af4d8e6487fc6a2c.png'
  ], [
    'https://yaame-static.yaame.io/admin/05cb7217999dc3389a90b11a40e96321.png',
    'https://yaame-static.yaame.io/admin/a44ec4f5545c95d9746893e1e55b357c.png',
    'https://yaame-static.yaame.io/admin/eb6901da8a4b45a6c486fe9130744ba9.png',
    'https://yaame-static.yaame.io/admin/9c4e8e0c82907936b624d25de3ac800a.png',
    'https://yaame-static.yaame.io/admin/a7be11db928c51f1f135218524136310.png',
    'https://yaame-static.yaame.io/admin/4a3d5d4c1250e56e7e4096a40e8bb800.png',
    'https://yaame-static.yaame.io/admin/e4aae393b01980ff8473072f8f3cef54.png',
    'https://yaame-static.yaame.io/admin/229a3f3a6211403157b4a80dfa24184b.png',
    'https://yaame-static.yaame.io/admin/0c724aeb9757be77fb7a1ab526af1e81.png',
    'https://yaame-static.yaame.io/admin/c73a3b898a6df794ac28187dcbbfbefa.png',
    'https://yaame-static.yaame.io/admin/70991df92397b48f61b3b21751e57fc5.png',
    'https://yaame-static.yaame.io/admin/e532afe507f5f512467379021472d4f1.png',
    'https://yaame-static.yaame.io/admin/273717bf6b6b430ed73b786f96635ec6.png',
    'https://yaame-static.yaame.io/admin/d48ca456b519e4336051abf132f6623f.png',
    'https://yaame-static.yaame.io/admin/0471cbf1849e9fe997d4bb1d7923f2f8.png',
    'https://yaame-static.yaame.io/admin/573415d946b06c0a0b2ad9a2a410e40e.png'
  ]];
  pictureBright.value = [...pictureBright.value,
  [
    'https://yaame-static.yaame.io/admin/bb7fbaf5fc290a3892aeaca2ac15a9f1.png',
    'https://yaame-static.yaame.io/admin/9ac1f1b8befebab5f8ec7dc73a865c54.png',
    'https://yaame-static.yaame.io/admin/c6c5b65fa6a7b3c52ad8caf886f1b16c.png',
    'https://yaame-static.yaame.io/admin/dbc88241bf99fceebb23e372735da28a.png',
    'https://yaame-static.yaame.io/admin/8fef806c2fe4cac68a14dd8516d67472.png',
    'https://yaame-static.yaame.io/admin/00458254673613ba13dbb77e9b9688c0.png',
    'https://yaame-static.yaame.io/admin/356620a8636ac06f45b48bb8138a319d.png',
    'https://yaame-static.yaame.io/admin/8ff7ee012627b6b2daee2b58f06ad147.png',
    'https://yaame-static.yaame.io/admin/f23644752a749700185e3ea256ba8067.png',
    'https://yaame-static.yaame.io/admin/8c6f19a3ac72a086df18153d4e22bb79.png',
    'https://yaame-static.yaame.io/admin/dd5bdec17fc5e7f23cdb38c9e7053b34.png',
    'https://yaame-static.yaame.io/admin/bacd66c26f4b2b8e0b5252a58e6887e1.png',
    'https://yaame-static.yaame.io/admin/b14d993c5e31e41d9d3fc81290b7f875.png',
    'https://yaame-static.yaame.io/admin/97d9d7182bbc7aca89da06c8c2123f70.png',
    'https://yaame-static.yaame.io/admin/d4d886a170c7e8c64788cebeb5112d77.png',
    'https://yaame-static.yaame.io/admin/3096fb6f4dcbcb0825bc23203aec442b.png'
  ], [
    'https://yaame-static.yaame.io/admin/b2f42fa82472a6190dc0d60d09923783.png',
    'https://yaame-static.yaame.io/admin/f71df96081ef60e6988f4f10d70b5436.png',
    'https://yaame-static.yaame.io/admin/a0ee27cd41002f50dc509da00e208014.png',
    'https://yaame-static.yaame.io/admin/41e4c550587a18e60571e7100c1cba5d.png',
    'https://yaame-static.yaame.io/admin/518c4b0038a8a879b310a9d0205f2bfc.png',
    'https://yaame-static.yaame.io/admin/81813190916250e0595e83bd5e894d09.png',
    'https://yaame-static.yaame.io/admin/4273db9d78370969bcc3b5adac335fcf.png',
    'https://yaame-static.yaame.io/admin/4a15aac3fd7c6847585a26842ea9dbfc.png',
    'https://yaame-static.yaame.io/admin/43503af05bc0cee86bac099848e8ad58.png',
    'https://yaame-static.yaame.io/admin/d570929e87fa693aa2edc91273716d9b.png',
    'https://yaame-static.yaame.io/admin/a495d2ead0f0d9a706f8120c9f7c0bd4.png',
    'https://yaame-static.yaame.io/admin/e732a8af0a51ddcf571e798b56254c1a.png',
    'https://yaame-static.yaame.io/admin/81a2af9d1119e7993a25e52cff37fe72.png',
    'https://yaame-static.yaame.io/admin/eb2f92d5eeb4cbbe9848e5c0258d078e.png',
    'https://yaame-static.yaame.io/admin/800db4a10094c337812185c6ff438cd6.png',
    'https://yaame-static.yaame.io/admin/138c6430549f034e1c61fdd728bb6414.png'
  ]];
}

defineExpose({
  listLoadImg
})

// 懒加载
const lazyLoad = ref(false);
let { loadImages } = lazyLoadImages();

onActivated(async () => {
  await getHome();
  lazyLoad.value = true;
})

onMounted(() => {
  lazyLoadImages();
  window.addEventListener('scroll', loadImages);
})
</script>

<style lang="less" scoped>
.game {
  .explain {
    width: 6.46rem;
    font-weight: normal;
    font-size: .22rem;
    color: #FFEA83;
    line-height: .30rem;
    margin: .28rem auto .26rem;
    text-align: center;
  }

  .puzzle {
    position: relative;
    width: 7.36rem;
    height: 13.14rem;
    margin: 0 auto;
    background: url("https://yaame-static.yaame.io/admin/c11486724044a241ed8df9e6a95b339c.png") no-repeat;
    background-size: contain;
    overflow: hidden;

    .head {
      position: absolute;
      top: .75rem;
      left: 50%;
      transform: translateX(-50%);
      height: .34rem;
      line-height: .34rem;
      font-weight: 500;
      font-size: .34rem;
      color: #FFE220;
    }

    // 拼图部分
    .picture {
      position: relative;
      width: 5.8rem;
      height: 5.8rem;
      margin: 1.74rem auto 0;
      overflow: hidden;

      ul {
        position: absolute;
        display: flex;
        width: 17.40rem;
        height: 5.8rem;
        transition-duration: .3s;

        li {
          position: relative;
          width: 5.8rem;
          height: 5.8rem;
          background-repeat: no-repeat;
          background-size: contain;

          img {
            position: absolute;
            transition-duration: .3s;
            z-index: 1;
          }

          img:nth-child(1) {
            top: 0.1rem;
            left: 0.1rem;
            width: 1.88rem;
            height: 1.4rem;
          }

          img:nth-child(2) {
            top: .1rem;
            left: 1.51rem;
            width: 1.4rem;
            height: 1.88rem;
          }

          img:nth-child(3) {
            top: .1rem;
            left: 2.44rem;
            width: 2.34rem;
            height: 1.4rem;
          }

          img:nth-child(4) {
            top: .1rem;
            left: 4.3rem;
            width: 1.4rem;
            height: 1.88rem;
          }

          img:nth-child(5) {
            top: 1.02rem;
            left: .1rem;
            width: 1.4rem;
            height: 2.34rem;
          }

          img:nth-child(6) {
            top: 1.49rem;
            left: 1.03rem;
            width: 2.34rem;
            height: 1.4rem;
          }

          img:nth-child(7) {
            top: 1.02rem;
            left: 2.9rem;
            width: 1.4rem;
            height: 2.34rem;
          }

          img:nth-child(8) {
            top: 1.49rem;
            left: 3.84rem;
            width: 1.86rem;
            height: 1.4rem;
          }

          img:nth-child(9) {
            top: 2.88rem;
            left: .1rem;
            width: 1.4rem;
            height: 1.4rem;
          }

          img:nth-child(10) {
            top: 2.4rem;
            left: 1.03rem;
            width: 2.34rem;
            height: 1.88rem;
          }

          img:nth-child(11) {
            top: 2.88rem;
            left: 2.9rem;
            width: 1.88rem;
            height: 1.4rem;
          }

          img:nth-child(12) {
            top: 2.42rem;
            left: 4.31rem;
            width: 1.4rem;
            height: 2.34rem;
          }

          img:nth-child(13) {
            top: 3.81rem;
            left: .1rem;
            width: 1.88rem;
            height: 1.89rem;
          }

          img:nth-child(14) {
            top: 3.81rem;
            left: 1.51rem;
            width: 1.4rem;
            height: 1.89rem;
          }

          img:nth-child(15) {
            top: 3.82rem;
            left: 2.44rem;
            width: 1.88rem;
            height: 1.88rem;
          }

          img:nth-child(16) {
            top: 4.3rem;
            left: 3.84rem;
            width: 1.87rem;
            height: 1.4rem;
          }
        }
      }

      ul:nth-child(1) {
        li:nth-child(1) {
          background-image: url(https://yaame-static.yaame.io/admin/aefe1e5b096d59e4a30cdfee74b686e6.png);
        }

        li:nth-child(2) {
          background-image: url(https://yaame-static.yaame.io/admin/000375a9c1cb047f1cde96ad58f40338.png);
        }

        li:nth-child(3) {
          background-image: url(https://yaame-static.yaame.io/admin/aff777db8d6c6c91f25a74be9461d140.png);
        }

        .fundus {
          position: absolute;
          top: .1rem;
          left: .1rem;
          width: 5.6rem;
          height: 5.6rem;
          background-color: #D8D8D8;
          z-index: 0;
        }
      }

      ul:nth-child(2) {
        img {
          opacity: 0;
        }
      }
    }

    // 动画
    .animation {
      position: absolute;
      top: 1.74rem;
      left: 50%;
      transform: translateX(-50%);
      width: 5.8rem;
      height: 5.8rem;
      z-index: 2;
    }

    // 按钮
    .right,
    .left {
      position: absolute;
      top: 4.15rem;
      left: .14rem;
      width: .98rem;
      height: .98rem;
      background-image: url("https://yaame-static.yaame.io/admin/9c9d51fdb5be3d38f47705e62b365582.png");
      background-repeat: no-repeat;
      background-size: contain;
      z-index: 2;
    }

    .right {
      left: 6.24rem;
      background-image: url(https://yaame-static.yaame.io/admin/f88792fa9e750c93c3cb54557c96ec98.png);
    }

    .repetition {
      display: flex;
      justify-content: space-between;
      width: 1.93rem;
      height: .28rem;
      margin: .22rem auto .1rem;

      img {
        width: .29rem;
        height: .28rem;
      }
    }

    .txt {
      width: 6.46rem;
      margin: 0 auto .18rem;
      font-weight: normal;
      font-size: .22rem;
      color: #FFEA83;
      line-height: .22rem;
      text-align: center;
    }

    .illume {
      display: flex;
      justify-content: space-between;
      width: 4.38rem;
      height: .74rem;
      margin: 0 auto .22rem;

      div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: .74rem;
        padding-bottom: .1rem;
        background-image: url(https://yaame-static.yaame.io/admin/2f60c5e0b064a1f3e1ba0916a0acc191.png);
        background-repeat: no-repeat;
        background-size: contain;
        font-weight: 600;
        font-size: .24rem;
        line-height: .24rem;
        color: #FFFFFF;
        text-align: center;

        span {
          width: 1.2rem;
        }

        img {
          width: .29rem;
          height: .28rem;
          margin-right: .03rem;
        }
      }

      div:last-of-type {
        color: #9F2B24;
        background-image: url(https://yaame-static.yaame.io/admin/c3ef9aa02a18c8e7f3c3100c36d9b94c.png);
      }
    }

    .my-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 6.43rem;
      height: 1.89rem;
      margin: 0 auto .14rem;
      background: url("https://yaame-static.yaame.io/admin/e6c743dc6ddd77d5e7714f5ec9cc87fb.png") no-repeat;
      background-size: contain;

      .info {
        display: flex;
        justify-content: center;

        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: .88rem;
          height: .88rem;
          margin-right: .14rem;
          background: #592B98;
          border: .04rem solid #B673FF;
          border-radius: 50%;

          img {
            width: .8rem;
            height: .8rem;
            border-radius: 50%;
          }
        }

        .list {
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;

          span {
            font-weight: 500;
            font-size: .24rem;
            color: #F8EBFF;
            line-height: .24rem;
          }
        }
      }

      .schedule {
        display: flex;
        justify-content: center;
        align-items: center;
        height: .24rem;
        margin-top: .11rem;
        font-weight: 500;
        font-size: .24rem;
        color: #FDE159;

        img {
          width: .29rem;
          height: .28rem;
          margin-left: .02rem;
          margin-top: 0.03rem;
        }
      }
    }

    .tips {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 6.2rem;
      height: .69rem;
      margin: 0 auto 0;

      img {
        width: .32rem;
        height: .32rem;
      }

      span,
      p {
        // display: flex;
        font-weight: normal;
        font-size: .22rem;
        color: #FFFFFF;
        text-align: center;
        z-index: 1;
      }

      .frame {
        position: absolute;
        width: 6.2rem;
        height: .69rem;
        margin: 0 auto 0;
        background: #350655;
        border-radius: .08rem;
        opacity: 0.55;
      }
    }

    .history {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      right: 0.27rem;
      top: 7.27rem;
      width: 1.57rem;
      height: .69rem;
      padding: 0 .1rem;
      background: url("https://yaame-static.yaame.io/admin/b17eda32e14e7a6a1998e5dcd7d10f0e.png") no-repeat;
      background-size: contain;
      font-weight: 500;
      font-size: .24rem;
      color: #FEE075;
      line-height: .24rem;
      text-align: center;
      z-index: 2;
    }
  }

  .jackpot {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    width: 7rem;
    padding: .81rem .1rem 0;
    margin: 1.22rem auto .37rem;
    background: #58048E;
    border-radius: .2rem;
    border: .08rem solid #9964FF;

    .list {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 2rem;
      margin-bottom: .28rem;

      .icon {
        position: relative;
        width: 2rem;
        height: 2.44rem;
        background-repeat: no-repeat;
        background-size: contain;

        span {
          position: absolute;
          top: .41rem;
          left: 50%;
          transform: translateX(-50%);
          height: .22rem;
          font-weight: 600;
          font-size: .24rem;
          color: #FBCE39;
          line-height: .28rem;
        }

        .day {
          position: absolute;
          bottom: .26rem;
          right: .27rem;
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: .82rem;
          height: .34rem;
          padding: 0 .1rem;
          background: #C61FE1;
          border-radius: .12rem .02rem .02rem .02rem;
          font-weight: 400;
          font-size: .22rem;
          color: #FFFFFF;
        }

        img {
          position: absolute;
          top: .9rem;
          left: 50%;
          transform: translateX(-50%);
          width: 1.1rem;
          height: 1.1rem;
        }
      }

      .name {
        width: 80%;
        margin: .11rem auto .05rem;
        font-weight: 400;
        font-size: .22rem;
        color: #FFFFFF;
        line-height: .22rem;
        text-align: center
      }

      .diamond {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 400;
        font-size: .22rem;
        color: #FFFFFF;

        img {
          width: .22rem;
          height: .19rem;
        }
      }

      .icon5 {
        background-image: url(https://yaame-static.yaame.io/admin/54a61af316ccfd65f32809e3c9ff32fe.png);
      }

      .icon3 {
        background-image: url(https://yaame-static.yaame.io/admin/d5b41ef96268fb5693429053ae3d1d74.png);
      }

      .icon1 {
        background-image: url(https://yaame-static.yaame.io/admin/56fd6cbae50f40d35346c1df8bf7027b.png);
      }
    }

    .list:nth-child(3n-2) {
      margin-right: .3rem;
    }

    .list:nth-child(3n-1) {
      margin-right: .3rem;
    }

    .head {
      display: flex;
      justify-content: center;
      position: absolute;
      top: -0.69rem;
      left: 50%;
      transform: translateX(-50%);
      width: 6.14rem;
      height: 1.38rem;
      padding-top: .5rem;
      font-weight: 600;
      background: url("https://yaame-static.yaame.io/admin/bf3c38877f013a4f5c8d9f5df8e6cc0d.png") no-repeat;
      background-size: contain;
      font-size: .3rem;
      color: #A84F00;
    }
  }

  .illumine {
    position: relative;
    width: 6.76rem;
    height: 5.82rem;
    margin: 4.38rem auto 0;
    background: url("https://yaame-static.yaame.io/admin/acec687e42914b481436b0edeca46615.png") no-repeat;
    background-size: contain;
    overflow: hidden;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 2rem;
      height: 2rem;
      margin: 1.46rem auto 0;
      overflow: hidden;

      .frame {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #420976;
        border-radius: .07rem;
        border: .01rem solid #FFFFA9;
        opacity: 0.9;
      }

      img {
        position: relative;
        max-width: 1.6rem;
        max-height: 1.6rem;
        width: auto;
        height: auto;
        z-index: 1;
      }
    }

    .txt {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      width: 4.8rem;
      margin: .18rem auto 0;
      font-weight: 400;
      font-size: .24rem;
      color: #FFFFFF;
      line-height: .38rem;

      span {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
      }

      img {
        width: .26rem;
        height: .22rem;
      }
    }

    .close,
    .button {
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: .41rem;
      left: 1.2rem;
      width: 1.72rem;
      height: .64rem;
      padding-top: .05rem;
      background-repeat: no-repeat;
      background-size: contain;
      background-image: url(https://yaame-static.yaame.io/admin/0ee887b5347d694f6266f7bdb6b658b0.png);
      font-weight: 600;
      font-size: .3rem;
      color: #FFFFFF;
    }

    .button {
      left: 3.84rem;
      background-image: url(https://yaame-static.yaame.io/admin/7587a78f67cc5754028d6e1a8efe09b3.png);
    }
  }

  .award-win {
    position: relative;
    display: flex;
    align-content: flex-start;
    justify-content: space-evenly;
    flex-direction: row;
    flex-wrap: wrap;
    width: 6.76rem;
    height: 5.78rem;
    padding: 1.85rem .1rem 0;
    margin: 4.59rem auto 0;
    background: url("https://yaame-static.yaame.io/admin/d33c882d61d3314aa6f4720ad5ec0782.png") no-repeat;
    background-size: contain;

    .award-win-item {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: 1.04rem;
      height: 1.04rem;

      .from {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #420976;
        border-radius: .07rem;
        border: .01rem solid #FFFFA9;
        opacity: 0.83;
      }

      img {
        position: relative;
        max-width: .84rem;
        max-height: .84rem;
        height: auto;
        width: auto;
        z-index: 1;
      }
    }

    .one {
      width: 2rem;
      height: 2rem;

      img {
        max-width: 1.6rem;
        max-height: 1.6rem;
        width: auto;
        height: auto;
      }
    }

    .two {
      width: .92rem;
      height: .92rem;

      img {
        max-width: .74rem;
        max-height: .74rem;
        width: auto;
        height: auto;
      }
    }

    .award {
      width: 5.96rem;
      margin-top: .24rem;
      font-weight: 400;
      font-size: .24rem;
      color: #FFFFFF;
      line-height: .42rem;

      span {
        display: block;
        width: 100%;
        text-align: center;
      }

      img {
        width: .5rem;
        height: .5rem;
        margin-right: .06rem;
      }
    }

    .button {
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: .61rem;
      left: 50%;
      transform: translateX(-50%);
      width: 1.72rem;
      height: .64rem;
      padding-top: .03rem;
      background: url("https://yaame-static.yaame.io/admin/fd30b1b0d49efefbcfc2c2d65beb9012.png") no-repeat;
      background-size: contain;
      font-weight: 600;
      font-size: .30rem;
      color: #FFFFFF;
    }
  }

  .map-finish {
    position: relative;
    width: 7.04rem;
    height: 7.7rem;
    margin: 3.68rem auto 0;
    padding: 1.92rem .73rem 0;
    background: url("https://yaame-static.yaame.io/admin/54a53d89eea693dcde0902dcdf999ddb.png") no-repeat;
    background-size: contain;

    .txt {
      width: 5.2rem;
      margin: .2rem auto 0;
      font-weight: 400;
      font-size: .2rem;
      color: #FFFFFF;
      line-height: .22rem;
      text-align: center;
    }

    .frame {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      height: 3.9rem;
      overflow: auto;

      .award-item {
        width: 1.26rem;
        margin-right: .16rem;

        .icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 1.26rem;
          height: 1.26rem;
          background: #52017F;
          border-radius: .07rem;
          border: .01rem solid #FFFFA9;

          img {
            width: 1.1rem;
            height: 1.1rem;
          }
        }

        .name {
          width: 100%;
          margin: .12rem 0;
          font-weight: 400;
          font-size: .2rem;
          color: #FFFFFF;
          line-height: .24rem;
          text-align: center;
        }
      }
      .award-item:nth-child(4n) {
        margin-right: 0;
      }
    }

    .button {
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: .42rem;
      left: 50%;
      transform: translateX(-50%);
      width: 1.72rem;
      height: .64rem;
      padding-top: .05rem;
      font-weight: 600;
      font-size: .30rem;
      color: #FFFFFF;
      background: url("https://yaame-static.yaame.io/admin/61c8cbc38ad95aa93abf2c10aec4aec6.png") no-repeat;
      background-size: contain;
    }
  }

  .history-win {
    position: relative;
    width: 6.8rem;
    height: 9.72rem;
    margin: 2.45rem auto 0;
    padding-top: 1.36rem;
    background: url("https://yaame-static.yaame.io/admin/918570aa75052676206189727ad7ad2f.png") no-repeat;
    background-size: contain;

    .head {
      position: absolute;
      top: .55rem;
      left: 50%;
      transform: translateX(-50%);
      width: 2rem;
      height: .37rem;
      font-weight: 500;
      font-size: .26rem;
      color: #A84F00;
      line-height: .37rem;
      text-align: center
    }

    .frame {
      width: 5.96rem;
      height: 8.18rem;
      margin: 0 auto 0;
      overflow: auto;

      .item {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 5.96rem;
        margin-bottom: .39rem;
        padding-top: .39rem;

        span {
          position: absolute;
          top: 0;
          height: .22rem;
          font-weight: normal;
          font-size: .20rem;
          color: #FFFFFF;
          line-height: .20rem;
        }

        span:nth-child(2) {
          right: 0;
        }

        .gifts {
          width: 1rem;
          margin-right: .24rem;

          .icon {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1rem;
            height: 1rem;
            background: #FFE4DA;
            border-radius: .08rem;
            border: .01rem solid #F6D076;

            .day {
              display: flex;
              justify-content: center;
              align-items: center;
              position: absolute;
              top: 0;
              right: 0;
              min-width: .65rem;
              height: .26rem;
              padding: 0 .1rem;
              background: #F8A032;
              border-radius: 0 .08rem 0 .08rem;
              font-weight: normal;
              font-size: .16rem;
              color: #FFF8F3;
            }

            img {
              width: .9rem;
              height: .9rem;
            }
          }

          .name {
            width: .95rem;
            margin: .08rem 0 .12rem;
            font-weight: normal;
            font-size: .2rem;
            color: #FFF;
            line-height: .24rem;
            text-align: center;
          }

          .diamond {
            width: .95rem;
            margin-top: .08rem;
            font-weight: normal;
            font-size: .20rem;
            color: #FFF;
            line-height: .20rem;

            img {
              width: .24rem;
              height: .18rem;
            }
          }
        }

        .gifts:nth-child(5n + 2) {
          margin-right: 0;
        }
      }

      .special {
        span {
          color: #FFCE22;
        }

        .gifts {
          .name {
            color: #FFCE22;
          }
          .diamond {
            color: #FFCE22;
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
      background: url("https://yaame-static.yaame.io/admin/ee7c629c6317ef6a4c14708777c45513.png") no-repeat;
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
        color: #FFF;
      }
    }
  }

  .rule-page-close {
    width: .5rem;
    height: .5rem;
    margin: .6rem auto 0;
    background: url("https://yaame-static.yaame.io/admin/bf289585eece563d1d74e393c654893d.png") no-repeat;
    background-size: contain;
  }

  .webp {
    position: fixed;
    width: 1px;
    height: 1px;
    opacity: 0;
    z-index: -999;
  }
}
</style>