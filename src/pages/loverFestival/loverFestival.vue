<template>
    <div class="main" :style="{ backgroundImage: cutTab === 'lover' ? 'url(https://yaame-static.yaame.io/admin/06ba9de1a25e1de1e270d44d7def3365.png)' : 'url(https://yaame-static.yaame.io/admin/de7f2b905bb5081d362190264b0b6330.png)' }">
        <!--返回头部-->
        <custom-header color="white" class="header">{{ $t('LoveDay') }}</custom-header>
        <!--tab切换-->
        <div class="tab">
            <!--切换样式动画-->
            <div class="tab-style" :style="{ left: cutTab === 'lover' ? 0 : '2.4rem', backgroundImage: cutTab === 'lover' ? 'url(https://yaame-static.yaame.io/admin/a6143db7e49a741826ee1da6813d2c05.png)' : 'url(https://yaame-static.yaame.io/admin/4a073ca8bac05347ae9b7ff0e1d05f33.png)' }"></div>
            <div v-for="(item, index) in tab" :key="index" class="both-tab" :class="{ 'cut-tab': cutTab === item.type }" @click="cutTabFun(item.type)">{{ item.name }}</div>
        </div>
        <!--上榜说明-->
        <p class="explain">{{ $t('Ferris_Wheel') }}</p>
        <!--前五名摩天轮样式-->
        <div class="ferris-wheel">
            <!--摩天轮中心样式-->
            <div class="ferris-wheel-centre" :style="{ backgroundImage: cutTab === 'lover' ? 'url(https://yaame-static.yaame.io/admin/72b1d645109fab9c5811e46f5494e523.png)' :'url(https://yaame-static.yaame.io/admin/7f8e8703b563999f4794e317e683d113.png)' }"></div>
            <!--摩天楼轮盘样式-->
            <div class="corona">
                <div :class="['corona-list', `corona-list${index}`, cutTab === 'lover' ? '' : `chum-list${index}`]" v-for="(item, index) in topFiveList" :key="index">
                    <div v-for="(value, number) in 2" :key="number" class="both-lover" :class="{ 'both-chum': cutTab === 'chum' }">
                        <img v-if="number === 0" :src="item.user.avatar" alt="" @click="skip(item.user.scheme_user_url)">
                        <img v-else :src="item.cp_user.avatar" alt="" @click="skip(item.cp_user.scheme_user_url)">
                    </div>
                    <div class="corona-list-diamond">
                        <img style="transition-duration: .3s" :src="cutTab === 'lover' ? 'https://yaame-static.yaame.io/admin/0a600f08d12be8cf9db7f432759f2397.png' : 'https://yaame-static.yaame.io/admin/0d9df4e2c0adf57f2b4760e57750a497.png'" alt="">
                        {{ item.score ? item.score : 0 }}
                    </div>
                </div>
            </div>
        </div>
        <!--活动礼物-->
        <div class="activity-gift">
            <div class="activity-gift-header">{{ $t('Event_Gift') }}</div>
            <div class="gift">
                <div class="gift-list" v-for="(item, index) in activityGift" :key="index">
                    <div class="gift-img">
                        <img :src="item.icon" alt="">
                    </div>
                    <div class="gift-diamond">
                        <img src="https://yaame-static.yaame.io/admin/0a600f08d12be8cf9db7f432759f2397.png" alt="">
                        {{ item.activity_value }}
                    </div>
                </div>
            </div>
            <div class="gift-explain">
                <p>{{ $t('Love_Points') }}</p>
                <p>{{ $t('Friendship_Points') }}</p>
            </div>
        </div>

        <!--奖品图标-->
        <div class="prize-icon"><span>{{ $t('Prizes') }}</span></div>
        <!--奖品-->
        <div v-show="cutTab === 'lover'" class="prize" :class="`prize${index}`" :style="{ backgroundImage: `url(${awardImg[index]})` }" v-for="(item, index) in loveList" :key="index">
            <div class="prize-header">{{ index === 0 ? $t('FirstPlace') : index === 1 ? $t('SecondPlace') : $t('Third_Place') }}</div>
            <div class="prize-list" :class="`prize-list${number}`" v-for="(value, number) in 4" :key="number">
                <img v-if="number === 2" :src="item.head_frame" alt="">
                <img v-else :src="number === 0 ? item.suit : number === 1 ? item.dress : item.bubble" alt="">
                <div class="prize-diamond">
                    {{ item.diamond_worth }}
                </div>
            </div>
        </div>
        <!--因为dom完全一样所以要改变key-->
        <div v-show="cutTab === 'chum'" class="prize" :class="`prize${index}`" :style="{ backgroundImage: `url(${awardImg[index]})` }" v-for="(item, index) in chumList" :key="index + 3">
            <div class="prize-header">{{ index === 0 ? $t('FirstPlace') : index === 1 ? $t('SecondPlace') : $t('Third_Place') }}</div>
            <div class="prize-list" :class="`prize-list${number}`" v-for="(value, number) in 4" :key="number">
                <img v-if="number === 2" :src="item.head_frame" alt="">
                <img v-else :src="number === 0 ? item.suit : number === 1 ? item.dress : item.bubble" alt="">
                <div class="prize-diamond">
                    {{ item.diamond_worth }}
                </div>
            </div>
        </div>

        <!--恋人底部-->
        <div v-show="cutTab === 'lover'" class="footer-lover">
            <!--为了省去写多个if-->
            <div v-if="Object.keys(userList).length">
                <div class="footer-lover-rank">{{ !userList.rank_num || userList.rank_num + 1 > 99 ? 99 + '+' : userList.rank_num }}</div>
                <div class="footer-lover-img">
                    <div class="portrait">
                        <img :src="userList.user.avatar" alt="" @click="skip(userList.user.scheme_user_url)">
                    </div>
                    <img class="png"  src="https://yaame-static.yaame.io/admin/e3356213fea388955711d503a7e4f894.png" alt="">
                    <div class="portrait">
                        <img :src="userList.cp_user.avatar" alt="" @click="skip(userList.cp_user.scheme_user_url)">
                    </div>
                </div>
                <div class="footer-lover-name">
                    <div class="my">{{ userList.user.nick_name }}</div>
                    <div class="cp">{{ userList.cp_user.nick_name }}</div>
                </div>
                <div class="footer-lover-diamond">
                    <img src="https://yaame-static.yaame.io/admin/0a600f08d12be8cf9db7f432759f2397.png" alt="">
                    {{ userList.score ? userList.score : 0 }}
                </div>
            </div>
            <!--无恋人显示-->
            <div class="no-lover" v-else @click="invite('https://yaame.yaame.net/cp.html?is_full_screen=1#/index')">{{ $t('InviteLover') }}</div>
        </div>
        <!--密友底部-->
        <div v-show="cutTab === 'chum'" class="footer-lover footer-chum">
            <!--为了省去写多个if-->
            <div v-if="userChumList.length">
                <div v-if="userChumList.length > 1 && !showChumList" class="unfold" @click="showChumItem"></div>
                <div class="footer-lover-rank">{{ !userChumList[0].rank_num || userChumList[0].rank_num + 1 > 99 ? 99 + '+' : userChumList[0].rank_num }}</div>
                <div class="footer-lover-img footer-chum-img">
                    <div class="portrait">
                        <img :src="userChumList[0].user.avatar" alt="" @click="skip(userChumList[0].user.scheme_user_url)">
                    </div>
                    <img class="png" src="https://yaame-static.yaame.io/admin/0ecb7c47e524525653db9d8fb89aa69c.png" alt="">
                    <div class="portrait">
                        <img :src="userChumList[0].cp_user.avatar" alt="" @click="skip(userChumList[0].cp_user.scheme_user_url)">
                    </div>
                </div>
                <div class="footer-lover-name">
                    <div class="my">{{ userChumList[0].user.nick_name }}</div>
                    <div class="cp">{{ userChumList[0].cp_user.nick_name }}</div>
                </div>
                <div class="footer-lover-diamond">
                    <img src="https://yaame-static.yaame.io/admin/e35eda334fff7b84fcc2257b15e9865c.png" alt="">
                    {{ userChumList[0].score ? userChumList[0].score : 0 }}
                </div>
            </div>
            <!--无恋人显示-->
            <div class="no-lover" v-else @click="invite('https://yaame.yaame.net/cp.html?is_full_screen=1&tab=1#/index')">{{ $t('InviteFriend') }}</div>
        </div>
        <!--展开数据-->
        <div v-show="showChumList" class="chum-list" :style="{ height: chumStyle + 'rem' }">
            <div class="unfold" @click="hideChumList"></div>
            <div class="chum-item" v-for="(item, index) in chumListStyle" :key="index">
                <div class="chum-item-rank">{{ !item.rank_num || item.rank_num + 1 > 99 ? 99 + '+' : item.rank_num }}</div>
                <div class="chum-item-img">
                    <div class="portrait">
                        <img :src="item.user.avatar" alt="" @click="skip(item.user.scheme_user_url)">
                    </div>
                    <div class="png"></div>
                    <div class="portrait">
                        <img :src="item.cp_user.avatar" alt="" @click="skip(item.cp_user.scheme_user_url)">
                    </div>
                </div>
                <div class="chum-item-name">
                    <div class="my">{{ item.user.nick_name }}</div>
                    <div class="cp">{{ item.cp_user.nick_name }}</div>
                </div>
                <div class="chum-item-diamond">
                    <img src="https://yaame-static.yaame.io/admin/e35eda334fff7b84fcc2257b15e9865c.png" alt="">
                    {{ item.score ? item.score : 0 }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { getCurrentInstance, onMounted, ref } from "vue";
    import { getBestie, getLover } from "../../lib/request/activity";
    import customHeader from "../../components/common/header.vue";

    // 获取国际化
    const root = getCurrentInstance();
    const t = (value) => {
        return root.proxy.$i18n.t(value);
    };
    // 前五名奖励数据
    let topFiveList = ref([
        {
        "cp_user": {
            "avatar": "",
            "gender": "",
            "nick_name": "",
            "peanut_id": ""
        },
        "rank_num": 0,
        "score": 0,
        "user": {
            "avatar": "",
            "gender": "",
            "nick_name": "",
            "peanut_id": ""
        }
    },
        {
            "cp_user": {
                "avatar": "",
                "gender": "",
                "nick_name": "",
                "peanut_id": ""
            },
            "rank_num": 0,
            "score": 0,
            "user": {
                "avatar": "",
                "gender": "",
                "nick_name": "",
                "peanut_id": ""
            }
        },
        {
            "cp_user": {
                "avatar": "",
                "gender": "",
                "nick_name": "",
                "peanut_id": ""
            },
            "rank_num": 0,
            "score": 0,
            "user": {
                "avatar": "",
                "gender": "",
                "nick_name": "",
                "peanut_id": ""
            }
        },
        {
            "cp_user": {
                "avatar": "",
                "gender": "",
                "nick_name": "",
                "peanut_id": ""
            },
            "rank_num": 0,
            "score": 0,
            "user": {
                "avatar": "",
                "gender": "",
                "nick_name": "",
                "peanut_id": ""
            }
        },
        {
            "cp_user": {
                "avatar": "",
                "gender": "",
                "nick_name": "",
                "peanut_id": ""
            },
            "rank_num": 0,
            "score": 0,
            "user": {
                "avatar": "",
                "gender": "",
                "nick_name": "",
                "peanut_id": ""
            }
        }]);
    // 奖励背景图片
    const awardImg = ref([
        'https://yaame-static.yaame.io/admin/86b882c5a2925a21d011be866e8b9a96.png',
        'https://yaame-static.yaame.io/admin/385aeb98efbc12e48667d6b7ef35b460.png',
        'https://yaame-static.yaame.io/admin/07c8ac0965bdf796ef1db0a03568be0c.png',

    ]);
    // tab
    let cutTab = ref('lover');
    const tab = ref([
        {
            name: t('Beloved'),
            type: "lover",
        },
        {
            name: t('Confidant'),
            type: "chum"
        }
    ]);
    const cutTabFun = (value) => {
        cutTab.value = value;
        // 关闭密友展开，和数据清空回复动画
        showChumList.value = false;
        chumListStyle.value = [];
        chumStyle.value = 0;
        chumStyleIndex.value = 1;
        // 清除前五数据
        topFiveList.value = [
            {
                "cp_user": {
                    "avatar": "",
                    "gender": "",
                    "nick_name": "",
                    "peanut_id": ""
                },
                "rank_num": 0,
                "score": 0,
                "user": {
                    "avatar": "",
                    "gender": "",
                    "nick_name": "",
                    "peanut_id": ""
                }
            },
            {
                "cp_user": {
                    "avatar": "",
                    "gender": "",
                    "nick_name": "",
                    "peanut_id": ""
                },
                "rank_num": 0,
                "score": 0,
                "user": {
                    "avatar": "",
                    "gender": "",
                    "nick_name": "",
                    "peanut_id": ""
                }
            },
            {
                "cp_user": {
                    "avatar": "",
                    "gender": "",
                    "nick_name": "",
                    "peanut_id": ""
                },
                "rank_num": 0,
                "score": 0,
                "user": {
                    "avatar": "",
                    "gender": "",
                    "nick_name": "",
                    "peanut_id": ""
                }
            },
            {
                "cp_user": {
                    "avatar": "",
                    "gender": "",
                    "nick_name": "",
                    "peanut_id": ""
                },
                "rank_num": 0,
                "score": 0,
                "user": {
                    "avatar": "",
                    "gender": "",
                    "nick_name": "",
                    "peanut_id": ""
                }
            },
            {
                "cp_user": {
                    "avatar": "",
                    "gender": "",
                    "nick_name": "",
                    "peanut_id": ""
                },
                "rank_num": 0,
                "score": 0,
                "user": {
                    "avatar": "",
                    "gender": "",
                    "nick_name": "",
                    "peanut_id": ""
                }
            }];
        // 进行svag动画控制
        if (value === 'lover') {
            getLoverList();
        } else {
            getChumList();
        }
    };
    // 活动奖励信息
    const activityGift = ref([]);

    // 爱人礼物
    const loveList = ref([
        {
            suit: 'https://yaame-static.yaame.io/admin/8a224a33821627146e44336cd6c3f5c4.png', // 套装
            dress: 'https://yaame-static.yaame.io/admin/7ab871fc23c0a1ed01b6a75b18fbbac2.png', // 第二个
            head_frame: 'https://yaame-static.yaame.io/admin/365aa96177e8a20eaa3440f6c12cb3e7.png',
            bubble: 'https://yaame-static.yaame.io/admin/3144d9f8220fb09a00f66e8ab29aa89a.png', // 气泡
            diamond_worth: 30 + t('Day')
        },
        {
            suit: 'https://yaame-static.yaame.io/admin/1db79d59cda796c99d6fb9540e1f1293.png',
            dress: 'https://yaame-static.yaame.io/admin/47e47d51b0ad7c88e2acdc4dc6134c72.png',
            head_frame: 'https://yaame-static.yaame.io/admin/82bb213671634a5bdaa2e946088ab860.png',
            bubble: 'https://yaame-static.yaame.io/admin/a4b9435839296349a9fda61a7990f357.png',
            diamond_worth: 30 + t('Day')
        },
        {
            suit: 'https://yaame-static.yaame.io/admin/942f0389f9f9046f85fd022ae2f7dba1.png',
            dress: 'https://yaame-static.yaame.io/admin/a7a441b4df23d04c56d0bed6ccdefe24.png',
            head_frame: 'https://yaame-static.yaame.io/admin/de642b46f0722fa422508e05eb5307b9.png',
            bubble: 'https://yaame-static.yaame.io/admin/a1e55ee4dd2b5ecc7f6c350abbc94143.png',
            diamond_worth: 30 + t('Day')
        }
    ])
    // 密友礼物
    const chumList = ref([
        {
            suit: 'https://yaame-static.yaame.io/admin/4be5790ed593c97b72e7d69a724ca0d4.png',
            dress: 'https://yaame-static.yaame.io/admin/7ab871fc23c0a1ed01b6a75b18fbbac2.png',
            head_frame: 'https://yaame-static.yaame.io/admin/dd2d7fecfe0ffa42d3a223fa2a00534f.png',
            bubble: 'https://yaame-static.yaame.io/admin/e481c42ce83b98b8b30f382d4f085d71.png',
            diamond_worth: 30 + t('Day')
        },
        {
            suit: 'https://yaame-static.yaame.io/admin/452e9b3a5f602c0877b88de39bd3238d.png',
            dress: 'https://yaame-static.yaame.io/admin/3c062975816935c7f13a382dbffdea8c.png',
            head_frame: 'https://yaame-static.yaame.io/admin/f7a90c58a0be8f4bc99f03cb35ba5cb8.png',
            bubble: 'https://yaame-static.yaame.io/admin/4de472452719846b21fac3671717344a.png',
            diamond_worth: 30 + t('Day')
        },
        {
            suit: 'https://yaame-static.yaame.io/admin/4e6b26c8bdd528ea3a2e073cb508524d.png',
            dress: 'https://yaame-static.yaame.io/admin/5256ea01afea877c6720ae20827f4a4a.png',
            head_frame: 'https://yaame-static.yaame.io/admin/d31c49fbd03bd55dfd29d5d147b68476.png',
            bubble: 'https://yaame-static.yaame.io/admin/4637dc46bd2209a37befa2a12ac4f53e.png',
            diamond_worth: 30 + t('Day')
        }
    ])

    // 对前五数据进行处理
    const topFive = (value) => {
        value.forEach((item, index) => {
            topFiveList.value.splice(index, 1, item);
        })
    };

    // 爱人用户数据
    const userList = ref({});
    // 密友用户数据
    const userChumList = ref([]);
    const chumListStyle = ref([]);
    const chumStyle = ref(0);
    // 控制展开数据
    const showChumList = ref(false);

    // 防止多次push
    const chumStyleIndex = ref(1);
    // 展开数据动画方法
    const showChumItem = () => {
        showChumList.value = true;
        if (chumStyleIndex.value !== 1) return;
        chumStyleIndex.value++;
        setTimeout(() => {
            for ( let i = 1; i <= userChumList.value.length - 1; i++ ) {
                chumListStyle.value.push(userChumList.value[i]);
                chumStyle.value += 1.24;
            }
        });
        chumStyle.value += 0.3;
    };
    // 收起列表动画
    const hideChumList = () => {
        const time = userChumList.value.length - 1 > 3 ? 410 : 300;
        setTimeout(() => {
            chumStyle.value -= 0.3;
            for ( let i = 1; i <= userChumList.value.length - 1; i++ ) {
                chumStyle.value -= 1.24;
            }
        });
        setTimeout(() => {
            chumListStyle.value = [];
            if (chumStyle.value < 0.2) showChumList.value = false;
            chumStyleIndex.value = 1;
        }, time);
    };

    // 获取恋人数据
    const getLoverList = async () => {
        try {
            const res = await getLover();
            if (res.status !== 1000) return;
            // 获取恋人榜单奖励
            if (res.data.activity_gifts.length) activityGift.value = res.data.activity_gifts;
            // 获取前五名数据
            if (res.data.rank.length) topFive(res.data.rank);
            // 获取用户数据
            if (res.data.users_info) userList.value = res.data.users_info;
        } catch (err) {
            console.log(err);
        }
    }
    // 获取密友数据
    const getChumList = async () => {
        try {
            const res = await getBestie();
            if (res.status !== 1000) return;
            // 获取密友榜单奖励
            if (res.data.activity_gifts.length) activityGift.value = res.data.activity_gifts;
            // 获取前五名数据
            if (res.data.rank.length) topFive(res.data.rank);
            // 获取用户数据
            if (res.data.users_info.length) userChumList.value = res.data.users_info;
        } catch (err) {
            console.log(err);
        }
    }


    // 头部显示
    const headerStyle = ref(false);
    // 页面滚动显示回退顶部
    const topScroll = () => {
        headerStyle.value = window.pageYOffset > 1;
    };

    // 退回上一层
    const back = () => {
        location.href = 'wlyaame://webview/back';
    };

    // 邀请跳转
    const invite = (value) => {
        window.location.href = value;
    };

    // 跳转用户页
    const skip = (value) => {
        window.location.href = value;
    };

    onMounted(() =>{
        // 获取当前奖励和排名数据
        getLoverList();
        // 头部显示
        topScroll();
        window.addEventListener('scroll', topScroll);
    })
</script>

<style lang="less" scoped>
.main {
    min-height: 100vh;
    padding-bottom: 2.01rem;
    background: url("https://yaame-static.yaame.io/admin/84be2f864bbb2ab5c77c1b18a45ce4b6.png") no-repeat;
    background-size: contain;
    transition-duration: .3s;
    overflow: hidden;
    // 头部返回样式
    .header {
        transition-duration: .3s;
    }
    // 顶部文案
    .explain {
        height: .18rem;
        margin-top: .13rem;
        font-size: .18rem;
        color: #fff;
        line-height: .18rem;
        text-align: center;
    }
    // tab样式
    .tab {
        position: relative;
        display: flex;
        width: 4.64rem;
        height: .72rem;
        margin: 1.21rem auto 0;
        background: #6413BF;
        border: .02rem solid #D9D0FE;
        border-radius: .36rem;
        font-size: .3rem;
        font-weight: 400;
        color: #DBD2FF;
        justify-content: center;
        align-items: center;
        z-index: 4;
        .both-tab {
            display: flex;
            width: 2.33rem;
            height: .708rem;
            justify-content: center;
            align-items: center;
            z-index: 1;
        }
        .tab-style {
            position: absolute;
            left: 0;
            width: 2.33rem;
            height: .708rem;
            background: url("https://yaame-static.yaame.io/admin/a6143db7e49a741826ee1da6813d2c05.png") no-repeat;
            background-size: contain;
            transition-duration: .3s;
        }
        .cut-tab {
            color: #fff;
        }
    }

    // 摩天轮样式
    .ferris-wheel {
        position: relative;
        width: 6.2rem;
        height: 6.2rem;
        margin: .5rem auto 0;
        .ferris-wheel-centre {
            position: absolute;
            top: 1.88rem;
            left: 1.74rem;
            width: 2.72rem;
            height: 2.25rem;
            background-repeat: no-repeat;
            background-size: contain;
            z-index: 2;
            transition-duration: .3s;
        }
        .corona {
            position: relative;
            width: 6.2rem;
            height: 6.2rem;
            margin: auto;
            background: url("https://yaame-static.yaame.io/admin/dd138fb06addcf8619e46e4196c58b2f.png") no-repeat;
            background-size: contain;
            animation: corona 10s infinite linear;
            .corona-list {
                position: absolute;
                width: 2.02rem;
                height: 1.92rem;
                background-repeat: no-repeat;
                background-size: contain;
                animation: list 10s infinite linear;
                transition-duration: .3s;
                .both-lover {
                    position: absolute;
                    display: flex;
                    top: .48rem;
                    left: .22rem;
                    width: .74rem;
                    height: .74rem;
                    justify-content: center;
                    align-items: center;
                    background: #FFC8D9;
                    border: .03rem solid #FFFFFF;
                    border-radius: 50%;
                    transition-duration: .3s;
                    overflow: hidden;
                    img {
                        width: .7rem;
                    }
                    &:nth-child(2) {
                        left: 1.05rem;
                    }
                }
                .both-chum {
                    background: #D3D1FD;
                }
                .corona-list-diamond {
                    position: absolute;
                    bottom: .37rem;
                    display: flex;
                    width: 2.02rem;
                    height: .2rem;
                    justify-content: center;
                    align-items: center;
                    font-size: .24rem;
                    color: #FFFFFF;
                    img {
                        width: .23rem;
                        height: .2rem;
                        margin-right: .07rem;
                    }
                }
            }
            .corona-list0 {
                top: .07rem;
                left: .41rem;
                background-image: url("https://yaame-static.yaame.io/admin/242cb23be986c5cb2a4eff6b71f66754.png");
            }
            .corona-list1 {
                top: .07rem;
                left: 3.77rem;
                background-image: url("https://yaame-static.yaame.io/admin/139b2f4acbea3c370006c6e59256cadb.png");
            }
            .corona-list2 {
                top: 2.85rem;
                left: 4.5rem;
                background-image: url("https://yaame-static.yaame.io/admin/6606a587366d2c14b9a5d39c4a6bf3fd.png");
            }
            .corona-list3 {
                top: 4.64rem;
                left: 2.09rem;
                background-image: url("https://yaame-static.yaame.io/admin/bf72cbd17462af9bf107d46a72f704d4.png");
            }
            .corona-list4 {
                top: 2.85rem;
                left: -0.33rem;
                background-image: url("https://yaame-static.yaame.io/admin/a3c9c1a3e964d4bca23cc58e592abd2d.png");
            }

            .chum-list0{
                background-image: url("https://yaame-static.yaame.io/admin/c8e8ffcc74e06150a10b94ac3c870a72.png");
            }
            .chum-list1{
                background-image: url("https://yaame-static.yaame.io/admin/befa87473bf012d85e76526ca08d6f69.png");
            }
            .chum-list2{
                background-image: url("https://yaame-static.yaame.io/admin/36127b7340f1ab332bc3a8c8238a18f4.png");
            }
            .chum-list3{
                background-image: url("https://yaame-static.yaame.io/admin/a81e7aba7766914403b7095f8d85c69b.png");
            }
            .chum-list4{
                background-image: url("https://yaame-static.yaame.io/admin/98c2ac81aca71a1831a7afdfb354028e.png");
            }
        }
    }

    //活动礼物样式
    .activity-gift {
        position: relative;
        width: 7.25rem;
        height: 8.16rem;
        margin: 3.7rem auto 0;
        background: url("https://yaame-static.yaame.io/admin/ba951321afdd9e87bcd32c15588f8e60.png") no-repeat;
        background-size: contain;
        overflow: hidden;
        .activity-gift-header {
            position: absolute;
            top: .23rem;
            left: 50%;
            height: .21rem;
            transform: translateX(-50%);
            line-height: .21rem;
            font-size: .28rem;
            font-weight: bold;
            color: #FFFFFF;
        }
        //奖励列表样式
        .gift {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            align-items: center;
            margin-top: 1.35rem;
            .gift-list {
                &:nth-child(n+4):nth-child(-n+6) {
                    margin-top: .35rem;
                }
                .gift-img {
                    display: flex;
                    width: 2rem;
                    height: 2rem;
                    justify-content: center;
                    align-items: center;
                    background: url("https://yaame-static.yaame.io/admin/f8efa53b048f7dfdf90f966e0ba6c97c.png") no-repeat;
                    background-size: contain;
                    img {
                        width: 1.7rem;
                    }
                }
                .gift-diamond {
                    display: flex;
                    height: .2rem;
                    margin-top: .16rem;
                    font-size: .24rem;
                    font-weight: 400;
                    color: #905CF9;
                    line-height: .2rem;
                    align-items: center;
                    justify-content: center;
                    img {
                        width: .23rem;
                        height: .2rem;
                    }
                }
            }
        }
        //奖励说明样式
        .gift-explain {
            position: absolute;
            display: flex;
            left: 50%;
            bottom: .22rem;
            width: 6.68rem;
            height: 1.03rem;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #DDC9F8;
            border-radius: .2rem;
            font-size: .22rem;
            font-weight: 400;
            color: #7832EC;
            transform: translateX(-50%);
        }
    }

    //奖励标题样式
    .prize-icon {
        position: relative;
        width: 4.52rem;
        height: .88rem;
        margin: .48rem auto .43rem;
        background: url("https://yaame-static.yaame.io/admin/f634f3e9cebfc050a9a52130dac7d75f.png") no-repeat;
        background-size: contain;
        font-size: .36rem;
        font-weight: bold;
        color: #FFFFFF;
        span {
            position: absolute;
            height: .35rem;
            top: .38rem;
            left: 50%;
            line-height: .35rem;
            transform: translateX(-50%);
        }
    }

    //奖励样式
    .prize {
        position: relative;
        width: 7.25rem;
        height: 8.97rem;
        margin: 0 auto .31rem;
        background-repeat: no-repeat;
        background-size: contain;
        // 头部标题样式
        .prize-header {
            position: absolute;
            top: .92rem;
            left: 50%;
            height: .33rem;
            line-height: .33rem;
            font-size: .32rem;
            color: #FFFFFF;
            transform: translateX(-50%);
        }
        // 每个奖励单独样式
        .prize-list {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            background-repeat: no-repeat;
            background-size: contain;
            img {
                width: 2.5rem;
            }
            .prize-diamond {
                display: flex;
                position: absolute;
                bottom: -0.34rem;
                height: 0.18rem;
                justify-content: center;
                align-items: center;
                font-size: .24rem;
                font-weight: 400;
                color: #905CF9;
                img {
                    width: .22rem;
                    height: .18rem;
                }
            }
        }
        .prize-list0,
        .prize-list1 {
            top: 1.76rem;
            left: .31rem;
            width: 2.94rem;
            height: 3.88rem;
            background-image: url("https://yaame-static.yaame.io/admin/9df55f7a834eb6c9149f32d8970f3f76.png");
        }
        .prize-list1 {
            left: 4rem;
        }
        .prize-list2 {
            left: .32rem;
            bottom: .75rem;
            width: 2rem;
            height: 2rem;
            background-image: url("https://yaame-static.yaame.io/admin/f8efa53b048f7dfdf90f966e0ba6c97c.png");
            img {
                width: 1.98rem;
            }
        }
        .prize-list3 {
            right: .32rem;
            bottom: .75rem;
            width: 3.89rem;
            height: 2rem;
            background-image: url("https://yaame-static.yaame.io/admin/f2407568bb1d0f6bf858d9d4b06c8fd1.png");
        }
        &:last-of-type {
            margin-bottom: 0;
        }
    }
    .prize1 {
        height: 8.85rem;
        .prize-header {
            top: .8rem;
        }
        .prize-list0,
        .prize-list1 {
            top: 1.64rem;
            left: .31rem;
        }
        .prize-list1 {
            left: 4rem;
        }
        .prize-list2 {

        }
        .prize-list3 {

        }
    }
    .prize2 {
        height: 8.69rem;
        .prize-header {
            top: .64rem;
        }
        .prize-list0,
        .prize-list1 {
            top: 1.48rem;
            left: .31rem;
        }
        .prize-list1 {
            left: 4rem;
        }
    }

    // 恋人底部样式
    .footer-lover {
        position: fixed;
        bottom: 0;
        width: 7.5rem;
        height: 1.9rem;
        background: url("https://yaame-static.yaame.io/admin/a4c21ce00078f827942d597558d2dbab.png") no-repeat;
        background-size: contain;
        font-size: .24rem;
        color: #FFFFFF;
        .footer-lover-rank {
            position: absolute;
            top: 1.1rem;
            left: .28rem;
            height: .18rem;
            line-height: .18rem;
        }

        // 两个人的头像
        .footer-lover-img {
            .png {
                position: absolute;
                top: .91rem;
                left: 2.02rem;
                width: .93rem;
                height: .53rem;
            }
            .portrait {
                position: absolute;
                top: .67rem;
                left: 1.08rem;
                width: .94rem;
                height: .94rem;
                border: .02rem solid #FF89AB;
                background: #FCB3B3;
                border-radius: 50%;
                overflow: hidden;
                img {
                    width: .92rem;
                }
            }
            .portrait:last-of-type {
                left: 2.95rem;
            }
        }

        .footer-lover-name {
            font-size: .2rem;
            .my {
                position: absolute;
                top: .82rem;
                left: 4.1rem;
                width: 1.66rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .cp {
                position: absolute;
                bottom: .46rem;
                left: 4.1rem;
                width: 1.66rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }

        // 得分
        .footer-lover-diamond {
            position: absolute;
            top: 1.1rem;
            left: 5.85rem;
            display: flex;
            height: .2rem;
            justify-content: center;
            align-items: center;
            img {
                width: .23rem;
                height: .2rem;
                margin-right: .11rem;
            }
        }

        .no-lover {
            position: absolute;
            display: flex;
            top: .78rem;
            left: 1.88rem;
            width: 3.74rem;
            height: .87rem;
            justify-content: center;
            align-items: center;
            background: url("https://yaame-static.yaame.io/admin/a19188399ba5f741df5aa38c35a7b8a7.png") no-repeat;
            background-size: contain;
            font-size: .3rem;
            font-weight: 500;
            color: #FFFFFF;
        }
    }

    //密友样式
    .footer-chum {
        height: 1.6rem;
        background: url("https://yaame-static.yaame.io/admin/9e9b042d816487e8bb9297c418a78f97.png") no-repeat;
        background-size: contain;
        z-index: 4;
        // 展开样式
        .unfold {
            position: absolute;
            top: .14rem;
            left: 3.58rem;
            width: .346rem;
            height: .142rem;
            background: url("https://yaame-static.yaame.io/admin/ff9ac992a4b26dec5e96bce5a59be292.png") no-repeat;
            background-size: contain;
        }

        .footer-lover-rank {
            top: .8rem;
            left: .29rem;
        }
        .footer-chum-img {
            .png {
                top: .6rem;
                left: 2.01rem;
            }
            .portrait {
                top: .36rem;
                left: 1.07rem;
                border: 2px solid #604BFF;
                background: #C4B7FF;
            }
            .portrait:nth-child(2) {
                left: 2.96rem;
            }
        }
        .footer-lover-name {
            .my {
                top: .52rem;
            }
            .cp {
                bottom: .46rem;
                left: 4.1rem;
            }
        }
        .footer-lover-diamond {
            top: .8rem;
        }

        .no-lover {
            top: .4rem;
            background: url("https://yaame-static.yaame.io/admin/a94f10911e5891f918494b2e028efbf5.png") no-repeat;
            background-size: contain;
        }
    }

    // 展开的数据样式
    .chum-list {
        position: fixed;
        bottom: 1.4rem;
        width: 7.49rem;
        max-height: 7.74rem;
        padding-top: .3rem;
        background: linear-gradient(180deg, #8263F6 0%, #9063F6 100%);
        border-radius: .2rem .2rem 0 0;
        transition-duration: .5s;
        overflow-x: auto;
        z-index: 3;
        .unfold {
            position: absolute;
            top: 0.1rem;
            left: 3.58rem;
            width: 0.346rem;
            height: 0.142rem;
            background: url("https://yaame-static.yaame.io/admin/ff9ac992a4b26dec5e96bce5a59be292.png") no-repeat;
            background-size: contain;
            transform: rotate(180deg);
        }
        .chum-item {
            position: relative;
            height: .94rem; // 1.24rem
            margin-bottom: .3rem;
            font-size: .24rem;
            font-weight: 400;
            color: #FFFFFF;
            .chum-item-rank{
                position: absolute;
                top: .44rem;
                left: .29rem;
                height: .18rem;
                line-height: .18rem;
            }
            .chum-item-img {
                .portrait {
                    position: absolute;
                    display: flex;
                    left: 1.07rem;
                    width: .94rem;
                    height: .94rem;
                    justify-content: center;
                    align-items: center;
                    border: .02rem solid #604BFF;
                    border-radius: 50%;
                    overflow: hidden;
                    &:last-of-type {
                        left: 2.96rem;
                    }
                    img {
                        width: .92rem;
                        height: .92rem;
                    }
                }
                .png {
                    position: absolute;
                    top: .24rem;
                    left: 2.01rem;
                    width: .94rem;
                    height: .49rem;
                    background: url("https://yaame-static.yaame.io/admin/0ecb7c47e524525653db9d8fb89aa69c.png") no-repeat;
                    background-size: contain;
                }
            }
            .my,
            .cp {
                position: absolute;
                top: .16rem;
                left: 4.1rem;
                width: 1.66rem;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .cp {
                top: .59rem;
            }
            .chum-item-diamond {
                position: absolute;
                display: flex;
                left: 5.85rem;
                top: .43rem;
                justify-content: center;
                align-items: center;
                img {
                    width: .21rem;
                    height: .2rem;
                    margin-right: .11rem;
                }
            }
        }
    }
}
// 摩天轮选装样式
@keyframes corona {
    to {
        transform: rotate(360deg);
    }
}
@keyframes list {
    to {
        transform: rotate(-360deg);
    }
}
</style>