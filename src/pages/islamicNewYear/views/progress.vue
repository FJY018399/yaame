<template>
  <div class="progress-main">
    <!--闯关说明-->
    <div class="explain">{{ $t('luckyBreakthroughInfo') }}</div>
    <!--用户信息-->
    <div class="my-info">
      <div class="info">
        <!--金币通关-->
        <div class="diamonds">
          <div class="head">
            <img :src="homeList.avatar" alt="">
          </div>
          <div class="diamonds-number">
              <i18n path="currentGoldCoins">
                <span place="0" class="i18n-diamonds">
                  <img src="https://yaame-static.yaame.io/admin/2494fd6a16eb0f17c3f4999b18b1ba90.png" alt="">{{ homeList.current_diamond }}
                </span>
              </i18n>
            <p>{{ $t('currentNumberOfPasses', {'0': homeList.current_pass_num}) }}</p>
          </div>
        </div>
        <!--说明-->
        <div class="my-explain">
          <i18n path="getGoldCoinsToUnlockTheNextLevelOfRewards">
            <span place="0">{{ homeList.next_level_score }}<img src="https://yaame-static.yaame.io/admin/2494fd6a16eb0f17c3f4999b18b1ba90.png" alt=""></span>
          </i18n>
        </div>
      </div>
    </div>
    <!--奖励项-->
    <div class="grade">
      <div class="item" v-for="(item, index) in 4" :key="index"
           :style="{
        backgroundImage: homeList.level_items && homeList.current_level_diamond >= homeList.level_items[index].end_diamond_amount ? `url('${imgBrightList[language][index]}')` : `url('${imgGreyList[language][index]}')`
      }">
        <div class="detailedness">
          <p>{{ $t('goldRequirements', { '0': homeList.level_items && homeList.level_items[index].end_diamond_amount }) }}</p>
            <i18n path="diamondRedEnvelopeAmount">
              <span place="0" class="i18n">
                <img src="https://yaame-static.yaame.io/admin/0eb6f646ec615ebfc3863818665edd7c.png" alt="">{{ homeList.level_items && homeList.level_items[index].red_packet_amount && homeList.level_items[index].red_packet_amount }}
              </span>
            </i18n>
          <p>{{ $t('shareRedEnvelopeQuantity', { '0': homeList.level_items && homeList.level_items[index].red_packet_count }) }}</p>
        </div>
      </div>
    </div>
    <!--烟花背景-->
    <div class="fireworks"></div>
    <!--进度条-->
    <div class="schedule">
      <div class="progress" :style="{ height: homeList.level_items && gradeLevel > 1 ? ((3.9 / homeList.current_level_end) * homeList.current_level_diamond) + ((gradeLevel - 2) * 3.9) + 'rem' : '0' }"></div>
      <div class="dot" :class="{ 'dot-no': homeList.level_items && homeList.current_level_diamond < homeList.level_items[item - 1].end_diamond_amount }" v-for="item in 4" :key="item"></div>
    </div>
  </div>
<!-- homeList.current_diamond && 防止数据未返回阻塞 -->
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {getIslamicLevelAPI} from "@/pages/islamicNewYear/api";
import {getLanguage} from "@/lib/device";

let language = computed(() => {
  let locale = getLanguage() || "en";
  if (["zh-hk", "zh-tw", "zh-mo", "zh-cn", "zh_cn"].indexOf(locale) > -1) {
    let localEnum = {
      "zh-hk": "zh-tw",
      "zh-tw": "zh-tw",
      "zh-mo": "zh-tw",
      "zh-cn": "zh-cn",
    };

    locale = localEnum[locale];
  }
  return locale;
});

// 关卡图片
const imgBrightList = ref({
  "zh-cn": [
    'https://yaame-static.yaame.io/admin/90d0af11af8c43bcb90f268b43b28028.png',
    'https://yaame-static.yaame.io/admin/8b38da99f4cd72fb991ad1eda54e2efa.png',
    'https://yaame-static.yaame.io/admin/e51fe167c5a57adaa6e78a9b667d244c.png',
    'https://yaame-static.yaame.io/admin/5e5e58100f4e84a51267742a2d28dc8e.png'
  ],
  "zh-tw": [
      'https://yaame-static.yaame.io/admin/4f8f57e5f7c58466ac7fc08fbbe39aeb.png',
      'https://yaame-static.yaame.io/admin/b08e7713a3473a6a494993e33cedbc6e.png',
      'https://yaame-static.yaame.io/admin/6c61516b2b59442727a0ac1cfb2f1fa4.png',
      'https://yaame-static.yaame.io/admin/2fff863d5927b0fb32bbfb9b8054fd3b.png',
  ],
  "en": [
      'https://yaame-static.yaame.io/admin/319a896ac0cbdb553acef8b017de0b25.png',
      'https://yaame-static.yaame.io/admin/4d93d06090d70d080c5121bdf84e5ed6.png',
      'https://yaame-static.yaame.io/admin/2340f8bc0a203212245f4212f57070e7.png',
      'https://yaame-static.yaame.io/admin/3d910fb9cdf2e5fbe2295054b7fc1f25.png',
  ],
  "id": [
    'https://yaame-static.yaame.io/admin/319a896ac0cbdb553acef8b017de0b25.png',
    'https://yaame-static.yaame.io/admin/4d93d06090d70d080c5121bdf84e5ed6.png',
    'https://yaame-static.yaame.io/admin/2340f8bc0a203212245f4212f57070e7.png',
    'https://yaame-static.yaame.io/admin/3d910fb9cdf2e5fbe2295054b7fc1f25.png',
  ],
  "ar": [
      'https://yaame-static.yaame.io/admin/a4ab58f8dc8ab9e7896032a8741537ca.png',
      'https://yaame-static.yaame.io/admin/a661ea4702edc85b42586aff5d7ad7d9.png',
      'https://yaame-static.yaame.io/admin/0675e2dd653b412f426e8db496645334.png',
      'https://yaame-static.yaame.io/admin/cbb7e0071749a686614bc4b538a172df.png'
  ],
})
const imgGreyList = ref({
  "zh-cn": [
    'https://yaame-static.yaame.io/admin/42ecd0f1acdedbfda5a2b7d98fa96939.png',
    'https://yaame-static.yaame.io/admin/630d985cfac497a7b305ec87dab2c7b7.png',
    'https://yaame-static.yaame.io/admin/14864f4e84f081609efbea8e868a64e9.png',
    'https://yaame-static.yaame.io/admin/377fe7b9457255a650d2b1c5a53f5466.png'
  ],
  "zh-tw": [
      'https://yaame-static.yaame.io/admin/37b0b3d8b41677a361660e6a9e70c4bc.png',
      'https://yaame-static.yaame.io/admin/fb86c3012eb0048be8fbc0f6f3ba61f5.png',
      'https://yaame-static.yaame.io/admin/2a72c54fc54ffdae0d377362b30aee7c.png',
      'https://yaame-static.yaame.io/admin/49e4453c7c6ddb0e5e819d2d9954cc28.png'
  ],
  "en": [
      'https://yaame-static.yaame.io/admin/14182d723e666a1c144ec211d3f00d75.png',
      'https://yaame-static.yaame.io/admin/dc623e5854f9faeadf65c9285b10c693.png',
      'https://yaame-static.yaame.io/admin/a11ac09a8ab49d2fcdcd7298899b6124.png',
      'https://yaame-static.yaame.io/admin/c5b42314e1dc88fc53db0302773e4b64.png',
  ],
  "id": [
    'https://yaame-static.yaame.io/admin/14182d723e666a1c144ec211d3f00d75.png',
    'https://yaame-static.yaame.io/admin/dc623e5854f9faeadf65c9285b10c693.png',
    'https://yaame-static.yaame.io/admin/a11ac09a8ab49d2fcdcd7298899b6124.png',
    'https://yaame-static.yaame.io/admin/c5b42314e1dc88fc53db0302773e4b64.png',
  ],
  "ar": [
      'https://yaame-static.yaame.io/admin/c8ed0e26b08778c2294a09c55eba97fc.png',
      'https://yaame-static.yaame.io/admin/4b4eefe1098673156ec343bd2d4a5c41.png',
      'https://yaame-static.yaame.io/admin/b5df7af35a3c227d04c88f3a8c948890.png',
      'https://yaame-static.yaame.io/admin/222e951bd0837a5f6e49cfef0caee795.png',
  ],
})

// 当前挡位
let gradeLevel = ref(0);
const gradeLevelList = {
  LEVEL_1: 1,
  LEVEL_2: 2,
  LEVEL_3: 3,
  LEVEL_4: 4,
}
// 当前闯关进度
const homeList = ref({});
// 获取页面数据
const getHomeData = async () => {
  try {
    const res = await getIslamicLevelAPI();
    if (res.status !== 1000) return;
    homeList.value = res.data;

    // 获取当前挡位
    gradeLevel.value = gradeLevelList[res.data.current_level_type];
  } catch (err) {
    console.log(err);
  }
}

onMounted(() => {
  getHomeData();
})
</script>

<style lang="less" scoped>
.progress-main {
  position: relative;
  width: 7.08rem;
  height: 22.12rem;
  margin: .47rem auto 0;
  background: url("https://yaame-static.yaame.io/admin/a9d97c5a0a22c8654ece4eb01c799068.png") no-repeat;
  background-size: contain;
  overflow: hidden;

  .explain {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 6.50rem;
    height: 2.38rem;
    margin: .47rem auto 0;
    font-size: .24rem;
    color: #FFEA83;
    text-align: center;
  }

  .my-info {
    display: flex;
    justify-content: center;
    width: 6.31rem;
    height: 2.53rem;
    margin: .2rem auto 0;
    background: url("https://yaame-static.yaame.io/admin/4d679bb3866d2674f64f1f6a387abd69.png") no-repeat;
    background-size: contain;
    overflow: hidden;

    .info {
      width: 5.22rem;
    }

    .my-explain {
      //height: .48rem;
      margin: auto;
      font-size: .22rem;
      color: #591EAD;
      text-align: center;
      line-height: .3rem;
      span {
        span {
          margin: 0 .1rem;
          img{
            width: .24rem;
            height: .24rem;
            margin-left: 0.05rem;
            margin-top: .03rem;
          }
        }
      }
    }

    .diamonds {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: .79rem auto 0.1rem;

      .head {
        display: flex;
        justify-content: center;
        align-items: center;
        width: .88rem;
        height: .88rem;
        background: #7A4FB6;
        border: .01rem solid #FFC847;
        border-radius: 50%;

        img {
          width: .86rem;
          height: .86rem;
          border-radius: 50%;
        }
      }

      .diamonds-number {
        display: flex;
        height: .88rem;
        flex-direction: column;
        justify-content: space-evenly;
        margin-left: .12rem;
        font-weight: 500;
        font-size: .24rem;
        color: #591EAD;

        .i18n-diamonds {
          img {
            width: .24rem;
            height: .24rem;
            margin: .04rem .05rem 0 0;
          }
        }
        p {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          height: .24rem;
          line-height: .24rem;
          img {
            width: .24rem;
            height: .24rem;
          }
        }
      }
    }
  }

  .grade {
    .item {
      position: absolute;
      width: 2.67rem;
      height: 3.92rem;
      background-image: url("https://yaame-static.yaame.io/admin/319a896ac0cbdb553acef8b017de0b25.png");
      background-repeat: no-repeat;
      background-size: contain;

      .detailedness {
        display: flex;
        flex-direction: column;
        position: absolute;
        bottom: -1.2rem;
        left: 50%;
        width: 2.66rem;
        height: 1rem;
        font-size: .24rem;
        color: #FFEA83;
        transform: translateX(-50%);

        p {
          //height: .24rem;
          line-height: .3rem;
          //margin-bottom: .14rem;
          text-align: center;

          img {
            width: .22rem;
            height: .19rem;
          }
        }
        span {
          //margin-bottom: .14rem;
          text-align: center;
          .i18n {
            margin: 0;
            img {
              width: .22rem;
              height: .19rem;
              margin-right: .02rem;
              margin-top: .06rem;
            }
          }
        }
      }
    }

    .item:nth-child(1) {
      top: 5.86rem;
      left: .36rem;
    }

    .item:nth-child(2) {
      top: 9.21rem;
      left: 4.05rem;
    }

    .item:nth-child(3) {
      top: 12.59rem;
      left: .36rem;
    }

    .item:nth-child(4) {
      top: 15.95rem;
      left: 4.05rem;
    }
  }

  .fireworks {
    position: absolute;
    top: 5.81rem;
    right: .12rem;
    width: 3.27rem;
    height: 2.94rem;
    background: url("https://yaame-static.yaame.io/admin/f7957a0ebe6a13b83c70531cb262f373.png") no-repeat;
    background-size: contain;
  }

  .schedule {
    position: relative;
    top: .63rem;
    left: 50%;
    width: .18rem;
    height: 11.7rem;
    background: #42197F;
    border-radius: .18rem;
    border: .01rem solid #BC83FF;
    transform: translateX(-50%);

    .progress {
      position: absolute;
      top: 0;
      left: 50%;
      width: .14rem;
      //height: 3.9rem;
      background: linear-gradient( 270deg, #FEFBB7 0%, #F6CA66 100%);
      border-radius: .18rem;
      transform: translateX(-50%);
      transition-duration: .3s;
    }

    .dot {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: .32rem;
      height: .32rem;
      background-image: url('https://yaame-static.yaame.io/admin/58a0f3227d893c60777e0d680e80667f.png');
      background-repeat: no-repeat;
      background-size: contain;
    }

    .dot-no {
      background-image: url('https://yaame-static.yaame.io/admin/27e9d781f1fb5f25085a389fe48a41f9.png');
    }

    .dot:nth-child(2) {
      top: -.16rem;
    }

    .dot:nth-child(3) {
      top: 3.7rem;
    }

    .dot:nth-child(4) {
      top: 7.57rem;
    }

    .dot:nth-child(5) {
      top: 11.44rem;
    }
  }
}
</style>