<template>
  <div class="task">
    <div class="fish box" :data-bg="lazyImg['fish']"></div>
    <div class="conch box" :data-bg="lazyImg['conch']"></div>
    <!--活动说明-->
    <div class="activity-txt">{{ $t('extra_reward') }}</div>

    <!--个人信息进度-->
    <div class="my-list box" :data-bg="lazyImg['my-list']">
      <div class="head">
        <div class="head-img">
          <img :src="homeData.user_avatar" alt="">
        </div>
        <div class="head-name">
          <p>{{ homeData.user_name }}</p>
          <p>{{ $t('current_pearls') }}{{ presentPearlNumber }}</p>
        </div>
      </div>
      <div class="at-present">{{ homeData.next_pearl_tip < 0 ? $t('unlock_complete') : $t('next_reward', {msg: homeData.next_pearl_tip}) }}</div>
      <!--进度条-->
      <div class="schedule">
        <div class="left-number">{{ homeData.last_pearl_amount }}</div>
        <div class="right-number">{{ homeData.next_pearl_amount }}</div>
        <div class="move"
             :style="{ width: (4.56 / (homeData.next_pearl_amount - homeData.last_pearl_amount)) * (homeData.pearl_amount - homeData.last_pearl_amount) + 'rem' }">
          <div class="circle box" :data-bg="lazyImg['pearl']"></div>
        </div>
      </div>
    </div>

    <!--进度条-->
    <div class="schedule">
      <div class="progress"
           :style="{ height: progressHeight }"></div>
      <!--圆点懒加载-->
      <div class="dot box" :style="{ top: index * 2.9 + 'rem' }" v-for="(item, index) in taskData"
           :key="index"
           :data-bg="item.status === 0 ? lazyImg['dot'] : lazyImg['getDot']">
        <!--当前任务进度-->
        <div class="frame">
          <div class="task-item box" :style="{ opacity: item.status === 0 ? '0.4' : '1' }"
               :data-bg="item.rewards.length > 2 ? lazyImg['long'] : lazyImg['task']"
               :class="{ 'task-item-long': homeData.task_levels[index].rewards.length > 2 }">
            <div class="head">{{ $t('make_pearls', {msg: item.task_require_amount}) }}</div>
            <div class="icon" v-for="(ite, inx) in item.rewards" :key="inx">
              <div class="img">
                <div class="day" v-if="ite.object_type !== 'DIAMOND'">{{
                    ite.subscript
                  }}
                </div>
                <img class="box" :data-bg="ite.reward_icon" src="" alt="">
              </div>
              <div class="name">{{ ite.reward_name }}</div>
              <div class="diamond">
                <img v-if="ite.price_type && ite.price_type === 'CRYSTAL'" loading="lazy" :style="{ width: '.14rem', height: '.21rem' }" src="https://yaame-static.yaame.io/admin/d0d3e4c4541506ddd034e79bc387cef8.png" alt="">
                <img v-else loading="lazy" src="https://yaame-static.yaame.io/admin/dcb74f5d4781c8550ed3440f698cbe32.png"
                     alt="">
                {{ ite.reward_diamond_worth }}
              </div>
            </div>
            <!--领取按钮-->
            <div class="button box" :class="{ 'git-button': item.status === 2 }"
                 :data-bg="item.status !== 2 ? lazyImg['button'] : lazyImg['getButton']"
                 @click="getAward(item)">
              {{ item.status !== 2 ? $t('claim') : $t('claimed') }}
            </div>
          </div>
          <div v-if="taskData[index] && taskData[index].status === 0" class="lock box" :data-bg="lazyImg['lock']"></div>
        </div>
      </div>
    </div>

    <!--弹窗-->
    <popup class="popup" v-show="awardWin" @cancel="awardWin = !awardWin">
      <div class="award-win">
        <!--标题-->
        <div class="award-win-head">
          <span></span>
          <div>{{ $t('claim_success') }}</div>
          <span></span>
        </div>

        <div class="award-win-item" v-for="(item, index) in awardWinData" :key="index">
          <div class="day" v-if="item.object_type !== 'DIAMOND'">{{
              item.subscript
            }}
          </div>
          <img :src="item.reward_icon" alt="">
          <div class="name">{{ item.reward_name }}</div>
        </div>

        <div class="button" @click="awardWin = !awardWin">OK</div>
      </div>
      <div class="rule-page-close" @click="awardWin = !awardWin"></div>
    </popup>
  </div>
</template>

<script setup>
import {getCurrentInstance, nextTick, onMounted, ref, watch} from "vue";
import popup from "@/components/common/pop_up.vue";
import {taskReceiveApi} from "@/pages/pearl/api";
import {Toast} from "vant";
import eventBus from "../eventBus";

// 获取国际化函数
const root = getCurrentInstance();
const t = (val) => {
  return root.proxy.$i18n.t(val);
};

const props = defineProps(['taskData', 'homeData', 'main']);
const lazyImg = ref({
  'my-list': 'https://yaame-static.yaame.io/admin/3ae0e2a659861ddac13fd65d8d8c5b01.png',
  'pearl': 'https://yaame-static.yaame.io/admin/0b28fa9dddabbed0f9f5a93d79069283.png',
  'task': 'https://yaame-static.yaame.io/admin/b9a1636adbcfc285ee8362e360d30c00.png',
  'dot': 'https://yaame-static.yaame.io/admin/048892f9a8d0c2651a4b63395f0b7aa7.png',
  'getDot': 'https://yaame-static.yaame.io/admin/77cc580dc6f80f6c8bdad45d62b0d5ea.png',
  'fish': 'https://yaame-static.yaame.io/admin/7e7207fcf40f7bec31f1893e830ad4a1.png',
  'conch': 'https://yaame-static.yaame.io/admin/6862d81b43f1f00fb73d15866d761896.png',
  'long': 'https://yaame-static.yaame.io/admin/a5dc06bee665454b44cfc22acf65e034.png',
  'button': 'https://yaame-static.yaame.io/admin/33255e565edbcee2e11c6c337313eb07.png',
  'getButton': 'https://yaame-static.yaame.io/admin/2799bae71a8f699a39d27d5d24808dfc.png',
  'lock': 'https://yaame-static.yaame.io/admin/f35d07d3326d3665f0515755e3e09878.png'
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
    const mainRect = props.main.getBoundingClientRect();
    return (
        rect.bottom >= mainRect.top &&  // 图片底部进入视口
        rect.right >= mainRect.left &&  // 图片右侧进入视口
        rect.top <= mainRect.bottom &&  // 图片顶部进入视口
        rect.left <= mainRect.right     // 图片左侧进入视口
    );
  };

  props.main.addEventListener('scroll', loadImages);
  props.main.addEventListener('resize', loadImages);

  loadImages();
};

// 奖励弹窗
const awardWin = ref(false);


// 监听主页数据刷新任务
const homeData = ref({});
const taskData = ref([]);
// 当前处于档位、
const gearsIndex = ref(0);
const maxPearlAmount = ref(0);
// 用户珍珠页面显示数量
const presentPearlNumber = ref(0);
// 获取当前进度长度
const progressHeight = ref('');
watch(() => props.taskData, (newValue) => {
  if (newValue) {
    homeData.value = newValue;
    taskData.value = newValue.task_levels;

    presentPearlNumber.value = homeData.value.pearl_amount;

    // 获取当前档位
    newValue.task_levels.forEach((item, index) => {
      if (item.task_require_amount === newValue.next_pearl_amount) gearsIndex.value = index;
    })

    // 获取最后一个档位的最大值  如果大于设为最大值
    maxPearlAmount.value = newValue.task_levels[newValue.task_levels.length - 1].task_require_amount;
    if (newValue.pearl_amount > maxPearlAmount.value) homeData.value.pearl_amount = maxPearlAmount.value;

    if (!gearsIndex.value) progressHeight.value = '0';
    else if (gearsIndex.value === 1) progressHeight.value = (2.97 / (newValue.next_pearl_amount - newValue.last_pearl_amount)) * (homeData.value.pearl_amount - newValue.last_pearl_amount) + 'rem';
    else progressHeight.value = 2.97 + (2.92 * (gearsIndex.value - 2)) + (2.92 / (newValue.next_pearl_amount - newValue.last_pearl_amount)) * (homeData.value.pearl_amount - newValue.last_pearl_amount) + 'rem';
    nextTick(() => {
      lazyLoadImages();
    })
  }
})

// 中将弹窗
const awardWinData = ref([]);
// 领取任务
const getAward = async (item) => {
  try {
    awardWinData.value = item.rewards;
    if (item.status === 0) {
      Toast(t('reward_not_unlocked'));
      return;
    }
    if (item.status === 2) {
      Toast(t('claimed'));
      return;
    }
    const res = await taskReceiveApi({
      task_flag: item.group_flag
    })
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    Toast(t('claim_successful'));
    awardWin.value = true;
    // 刷新任务列表
    eventBus.emit('getHomeData');
  } catch (err) {
    console.log(err);
  }
}

onMounted(() => {
  // 监听元素位置
  document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
  });
})
</script>

<style lang="less" scoped>
.task {
  position: relative;
  width: 7.2rem;
  height: 41.3rem;
  margin: .42rem auto .4rem;
  background: #265CC4;
  border-radius: .2rem;
  border: .02rem solid #7DD4FF;

  .fish {
    position: absolute;
    top: 4.99rem;
    right: .54rem;
    width: 1.91rem;
    height: 3.59rem;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .conch {
    position: absolute;
    bottom: .03rem;
    left: .25rem;
    width: 2.84rem;
    height: 2.53rem;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .activity-txt {
    width: 6.34rem;
    height: .52rem;
    margin: .3rem auto .25rem;
    font-size: .24rem;
    color: #FFFFFF;
    line-height: .26rem;
    text-align: center;
  }

  .my-list {
    position: relative;
    width: 6.3rem;
    height: 3.82rem;
    margin: auto;
    background-repeat: no-repeat;
    background-size: contain;
    overflow: hidden;

    .head {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: .57rem;

      &-img {
        display: flex;
        justify-content: center;
        align-items: center;
        width: .88rem;
        height: .88rem;
        margin-right: .11rem;
        background: #123DBD;
        border: .01rem solid #63BEFF;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: .8rem;
          height: .8rem;
        }
      }

      &-name {
        font-weight: 500;
        font-size: .24rem;
        color: #FFFFFF;

        p {
          height: .24rem;
          line-height: .24rem;
        }

        p:last-of-type {
          margin-top: .14rem;
        }
      }
    }

    .at-present {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 4.9rem;
      height: .48rem;
      margin: .1rem auto 0;
      font-size: .22rem;
      color: #FFFFFF;
      line-height: .24rem;
      text-align: center;
    }

    .schedule {
      position: absolute;
      top: 2.3rem;
      left: 50%;
      width: 4.56rem;
      height: .24rem;
      transform: translate(-50%);
      background: #00517A;
      border-radius: .15rem;

      .move {
        position: absolute;
        top: 50%;
        height: .22rem;
        transform: translateY(-50%);
        background: linear-gradient(180deg, #6EECF8 0%, #327DF7 100%);
        border-radius: .14rem;
        border: .01rem solid #63E7FE;
        transition-duration: .3s;

        .circle {
          position: absolute;
          top: -0.08rem;
          right: -0.07rem;
          width: .36rem;
          height: .32rem;
          background-repeat: no-repeat;
          background-size: contain;
          z-index: 1;
        }
      }

      .left-number,
      .right-number {
        position: absolute;
        bottom: -0.34rem;
        height: .2rem;
        line-height: .2rem;
        font-size: .2rem;
        color: #FFEA83;
      }

      .left-number {
        left: 0;
      }

      .right-number {
        right: 0;
      }
    }
  }

  .schedule {
    position: absolute;
    top: 6.24rem;
    left: 50%;
    transform: translateX(-50%);
    width: .18rem;
    height: 32.28rem;
    background: #0C37B8;
    border-radius: .18rem;
    border: .01rem solid #7094FF;

    .progress {
      position: absolute;
      top: .03rem;
      left: 50%;
      transform: translateX(-50%);
      width: .14rem;
      background: linear-gradient(270deg, #6EECF8 0%, #327DF7 100%);
      border-radius: .18rem;
      transition-duration: .3s;
    }

    .dot {
      position: absolute;
      left: -0.08rem;
      width: .32rem;
      height: .32rem;
      background-repeat: no-repeat;
      background-size: contain;

      .frame {
        position: absolute;
        left: -3.32rem;
        transform: translateY(-50%);

        .task-item {
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          justify-content: space-evenly;
          position: relative;
          width: 3.2rem;
          height: 3.53rem;
          padding-top: .78rem;
          background-repeat: no-repeat;
          background-size: contain;

          .head {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 0.15rem;
            left: 50%;
            transform: translateX(-50%);
            height: .4rem;
            line-height: .2rem;
            font-weight: 500;
            font-size: .22rem;
            color: #FFFFFF;
            text-align: center;
          }

          .icon {
            display: flex;
            flex-direction: column;
            width: 1.08rem;
            font-size: .2rem;
            color: #FFFFFF;

            .img {
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 1.08rem;
              height: 1.08rem;
              background: url("https://yaame-static.yaame.io/admin/86c27759c803340b492c9f4b3d0cd7ab.png") no-repeat;
              background-size: contain;

              .day {
                position: absolute;
                top: 0;
                right: 0;
                min-width: .58rem;
                height: .22rem;
                padding: 0 .04rem;
                line-height: .22rem;
                background: #2E6BFF;
                border-radius: 0 .06rem 0 .06rem;
                font-size: .16rem;
                color: #FFFFFF;
                text-align: center;
              }

              img {
                width: .74rem;
                height: .74rem;
              }
            }

            .name {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: .4rem;
              margin-top: .06rem;
              line-height: .2rem;
              text-align: center;
            }

            .diamond {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;

              img {
                width: .22rem;
                height: .19rem;
              }
            }
          }

          .button {
            position: absolute;
            bottom: .22rem;
            left: 50%;
            transform: translateX(-50%);
            width: 1.72rem;
            height: .63rem;
            padding-top: .1rem;
            background-repeat: no-repeat;
            background-size: contain;
            font-weight: 500;
            font-size: .22rem;
            color: #FFFFFF;
            text-align: center;
          }

          .git-button {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
            align-items: center;
            width: 1.83rem;
            height: .59rem;
            padding-top: 0;
            background-repeat: no-repeat;
            background-size: contain;
            font-weight: 500;
            font-size: .22rem;
            color: #7DC3FF;
          }
        }

        .lock {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: .6rem;
          height: .76rem;
          background-repeat: no-repeat;
          background-size: contain;
        }

        .task-item-long {
          height: 5.33rem;
        }
      }
    }

    .dot:nth-child(2n-1) {
      .frame {
        left: .46rem;
      }
    }

    .dot:nth-child(2) {
      top: -0.19rem !important;

      .frame {
        top: -0.76rem;
        transform: translateY(0);
      }
    }

    .dot:last-of-type {
      top: auto !important;
      bottom: -0.16rem;
    }
  }

  .popup {
    overflow: auto;

    .award-win {
      display: flex;
      justify-content: space-evenly;
      position: relative;
      width: 6.9rem;
      height: 5.72rem;
      margin: 3.89rem auto 0;
      padding-top: 2.02rem;
      background: url("https://yaame-static.yaame.io/admin/8081169a967ed6a5fe30d762c86841b1.png") no-repeat;
      background-size: contain;

      &-head {
        position: absolute;
        top: 1.22rem;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        justify-content: center;
        align-items: center;

        span {
          width: .61rem;
          height: .12rem;
          background-image: url("https://yaame-static.yaame.io/admin/13c62c4abda1c299c0b2d6fec31e46e4.png");
          background-repeat: no-repeat;
          background-size: contain;
        }

        span:nth-child(3) {
          background-image: url("https://yaame-static.yaame.io/admin/63ede40a8375aaaf072fd404898dc67c.png");
        }

        div {
          display: flex;
          justify-content: center;
          align-items: center;
          height: .5rem;
          margin: 0 .16rem;
          font-weight: 600;
          font-size: .36rem;
          color: #FFFFFF;
          line-height: .50rem;
          white-space: nowrap;
        }
      }

      &-item {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 1.5rem;
        height: 1.5rem;
        background: #1348AC;
        border-radius: .08rem;
        border: .02rem solid #7DD4FF;

        .day {
          position: absolute;
          top: 0;
          right: 0;
          min-width: .58rem;
          height: .22rem;
          padding: 0 .04rem;
          line-height: .22rem;
          background: #2E6BFF;
          border-radius: 0 .06rem 0 .06rem;
          font-size: .16rem;
          color: #FFFFFF;
          text-align: center;
        }

        img {
          width: 1.2rem;
          height: 1.2rem;
        }

        .name {
          position: absolute;
          bottom: -0.44rem;
          width: 100%;
          height: .3rem;
          font-weight: 400;
          font-size: .22rem;
          color: #FFFFFF;
          line-height: .3rem;
          text-align: center;
        }
      }

      .button {
        position: absolute;
        bottom: .56rem;
        left: 50%;
        transform: translateX(-50%);
        width: 1.99rem;
        height: .73rem;
        padding-top: .06rem;
        background: url("https://yaame-static.yaame.io/admin/1dd6101971701903b9446c4097f87fbf.png") no-repeat;
        background-size: contain;
        font-weight: 600;
        font-size: .32rem;
        color: #FFFFFF;
        text-align: center;
      }
    }

    .rule-page-close {
      width: .5rem;
      height: .5rem;
      margin: .36rem auto 0;
      background: url("https://yaame-static.yaame.io/admin/8669613454f4a034da716205f8ebff7b.png") no-repeat;
      background-size: contain;
    }
  }
}
</style>