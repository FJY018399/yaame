<!--
 * @Author: Se7enElk
 * @Date: 2022-03-24 16:11:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-06-16 19:15:04
 * @FilePath: /peanut_h5/src/pages/demonKing/components/Rule.vue
 * @Description: 
-->
<template>
    <popup class="flex-container">
        <div class="Rule">
            <img class="close-btn" src="https://yaame-static.yaame.io/admin/f9890c3f3df1d0edce6098ab86c7e3db.png"
                 alt="关闭按钮"
                 @click="close()"
            >

            <header class="rule-header">
                <div v-for="item in tabList" :key="item" :class="[tabActive === item && 'active']"
                     @click="tabActive = item"
                >{{ $t(item) }}
                </div>
            </header>

            <div v-show="tabActive === 'damageRewards'" class="content-box reward">
                <div class="title">{{ $t('activityEndRewards') }}</div>

                <div class="reward-container five top-1">
                    <div class="content">
                        <div v-for="(item, index) in OneList" :key="index" class="reward-item">
                            <div class="item-avatar">
                                <img :src="item.img"/>
                                <span class="num"><p>{{ item.day + $t('day') }}</p></span>
                            </div>
                            <p class="item-name no-wrap">{{ item.name ? item.name : $t(item.key) }}</p>
                            <p class="item-value">{{ item.num }} <img
                                src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
                                alt="diamond"
                            ></p>
                        </div>
                    </div>
                </div>
                <div class="reward-container five top-2">
                    <div class="content">
                        <div v-for="(item, index) in TwoList" :key="index" class="reward-item">
                            <div class="item-avatar">
                                <img :src="item.img"/>
                                <span class="num"><p>{{ item.day + $t('day') }}</p></span>
                            </div>
                            <p class="item-name no-wrap">{{ item.name ? item.name : $t(item.key) }}</p>
                            <p class="item-value">{{ item.num }} <img
                                src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
                                alt="diamond"
                            ></p>
                        </div>
                    </div>
                </div>
                <div class="reward-container top-3">
                    <div class="content">
                        <div v-for="(item, index) in ThreeList" :key="index" class="reward-item">
                            <div class="item-avatar">
                                <img :src="item.img"/>
                                <span class="num"><p>{{ item.day + $t('day') }}</p></span>
                            </div>
                            <p class="item-name no-wrap">{{ item.name ? item.name : $t(item.key) }}</p>
                            <p class="item-value">{{ item.num }} <img
                                src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
                                alt="diamond"
                            ></p>
                        </div>
                    </div>
                </div>
                <div class="reward-container top-4">
                    <div style="justify-content: space-around" class="content">
                        <div v-for="(item, index) in FourList" :key="index" class="reward-item">
                            <div class="item-avatar">
                                <img :src="item.img"/>
                                <span class="num"><p>{{ item.day + $t('day') }}</p></span>
                            </div>
                            <p class="item-name no-wrap">{{ item.name ? item.name : $t(item.key) }}</p>
                            <p class="item-value">{{ item.num }} <img
                                src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png"
                                alt="diamond"
                            ></p>
                        </div>
                    </div>
                </div>
            </div>

            <div v-show="tabActive === 'activityRules'" class="content-box rule">

                <p>{{ $t('activityTime') }}</p>
                <p>{{ $t('demonKingFormsInfo') }}</p>
                <p>{{ $t('weaponsInfo') }}</p>
                <table class="table">
                    <tr>
                        <th>{{ $t('weapon') }}</th>
                        <th>{{ $t('obtainMethods') }}</th>
                        <th>{{ $t('damageValue') }}</th>
                    </tr>
                    <tr>
                        <td>{{ $t('laserCannon') }}</td>
                        <td>{{ $t('giftObtained') }}</td>
                        <td>20 ~ 100</td>
                    </tr>
                    <tr>
                        <td>{{ $t('gemSword') }}</td>
                        <td>{{ $t('diamondPurchase') }}</td>
                        <td>5 ~ 30</td>
                    </tr>
                    <tr>
                        <td>{{ $t('crystal') }}</td>
                        <td>{{ $t('diamondPurchase') }}</td>
                        <td>20 ~ 100</td>
                    </tr>
                </table>
                <p>{{ $t('differentFormsRewards') }}</p>
                <p>{{ $t('topThreeDamageRewards') }}</p>
                <p>{{ $t('finalInterpretation') }}</p>
            </div>
        </div>
    </popup>
</template>

<script>
    import Header from "@/components/common/header.vue";
    import { ref } from "vue";

    export default {
        name: 'Rule',
        components: {
            Header,
            popup: () => import('../../../components/common/pop_up.vue'),
        },
        props: ['close'],
        setup(props, context) {
            const tabList = ref([
                'damageRewards', 'activityRules'
            ]);
            const tabActive = ref('damageRewards');

            const close = () => {
                context.emit('close');
            };
            return {
                tabList,
                tabActive,

                close,

                OneList: [
                    {
                        img: 'https://yaame-static.yaame.io/admin/2e685863102910d60b3db2f78b8b369c.png',
                        key: 'top1Text',
                        num: '6999',
                        day: '7'
                    }, {
                        img: 'https://yaame-static.yaame.io/admin/7f39940244a64420795cb108d8496c90.png',
                        key: 'top1Text',
                        num: '6999',
                        day: '7'
                    }, {
                        img: 'https://yaame-static.yaame.io/admin/ee735009d930949f5e03b6d31f56b2dc.png',
                        key: 'top1Text',
                        num: '6999',
                        day: '7'
                    }, {
                        img: 'https://yaame-static.yaame.io/admin/bdea3c8a227af4629e6e4cdc12b55b8a.png',
                        key: 'GoldenDragon',
                        num: '19999',
                        day: '7'
                    }, {
                        img: 'https://yaame-static.yaame.io/admin/c73cf2c87124408e180335432d751aa1.png',
                        name: 'Yaame ID',
                        num: '59999',
                        day: '7'
                    }
                ],
                TwoList: [
                    {
                        img: 'https://yaame-static.yaame.io/admin/c8698d85093abc081dce2469159c1c0c.png',
                        key: 'top2Text',
                        num: '6999',
                        day: '7'
                    }, {
                        img: 'https://yaame-static.yaame.io/admin/0e0bec05d799bcb208a15e0d08484187.png',
                        key: 'top2Text',
                        num: '6999',
                        day: '7'
                    }, {
                        img: 'https://yaame-static.yaame.io/admin/f71676e8f991ccece88da4bd51d467ee.png',
                        key: 'top2Text',
                        num: '6999',
                        day: '7'
                    }, {
                        img: 'https://yaame-static.yaame.io/admin/bdea3c8a227af4629e6e4cdc12b55b8a.png',
                        key: 'GoldenDragon',
                        num: '9999',
                        day: '3'
                    }, {
                        img: 'https://yaame-static.yaame.io/admin/c73cf2c87124408e180335432d751aa1.png',
                        name: 'Yaame ID',
                        num: '59999',
                        day: '7'
                    }
                ],
                ThreeList: [
                    {
                        img: 'https://yaame-static.yaame.io/admin/e1106602b176ce2070da9e1d386b453f.png',
                        key: 'top3Text',
                        num: '6999',
                        num: '6999',
                        day: '7'
                    }, {
                        img: 'https://yaame-static.yaame.io/admin/a8dc0f47f4e02454c00cb7056492edbe.png',
                        key: 'top3Text',
                        num: '6999',
                        day: '7'
                    }, {
                        img: 'https://yaame-static.yaame.io/admin/5024050b08523af52d20e3238ecf0a5e.png',
                        key: 'top3Text',
                        num: '6999',
                        day: '7'
                    },
                ],
                FourList: [
                    {
                        img: 'https://yaame-static.yaame.io/admin/28cfc252093959457c62a1b338eb8b36.png',
                        key: 'top4Text',
                        num: '6999',
                        day: '7'

                    }, {
                        img: 'https://yaame-static.yaame.io/admin/dbf79055d417036bac647607f559ab46.png',
                        key: 'top4Text',
                        num: '6999',
                        day: '7'
                    },
                ],
            };
        },
    };
</script>

<style lang="less" scoped>
.flex-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .Rule {
        width: 6.16rem;
        height: 9.5rem;
        opacity: 0.9;
        background: #5132E5;
        border-radius: 0.2rem;
        color: #fff;
        font-size: 0.24rem;
        overflow-y: scroll;
        position: relative;
        padding-top: 0.53rem;

        .rule-header {
            width: 4.48rem;
            height: 0.5rem;
            margin-left: 0.83rem;
            font-size: 0.32rem;
            font-weight: normal;
            color: rgba(255, 255, 255, 0.6);
            display: flex;
            justify-content: space-between;

            div {
                flex: 1;
                text-align: center;
                position: relative;
            }

            .active {
                color: #FFD428;

                &::after {
                    content: '';
                    position: absolute;
                    width: 0.54rem;
                    height: 0.06rem;
                    border-radius: 0.04rem;
                    background: #FFD428;
                    bottom: -0.14rem;
                    left: 50%;
                    transform: translateX(-50%);
                }
            }
        }

        .content-box {
            width: 5.8rem;
            height: 7.7rem;
            overflow-y: scroll;
            overflow-x: hidden;
            margin-top: 0.3rem;
            margin-left: 0.17rem;

            &.reward {
                padding-top: 0.2rem;

                .title {
                    width: 6.02rem;
                    height: 0.5rem;
                    line-height: 0.5rem;
                    font-size: 0.22rem;
                    font-weight: normal;
                    color: #FFFFFF;
                    background-image: url(https://yaame-static.yaame.io/admin/798fda71c42bfcf7bc1cf68603037ba1.png);
                    background-size: contain;
                    background-repeat: no-repeat;
                    margin-bottom: 0.2rem;
                    padding: 0 0.18rem;
                    overflow-x: scroll;
                    overflow-y: hidden;
                    white-space: nowrap;
                }

                .reward-container {
                    &.five {
                        width: 5.8rem;
                        height: 6.31rem;
                        background-size: contain;
                        background-repeat: no-repeat;
                        margin-bottom: 0.4rem;
                        padding-top: 1.02rem;

                        .content {
                            width: 5.8rem;
                            height: 4.78rem;
                            display: flex;
                            justify-content: space-around;
                            flex-wrap: wrap;
                            padding: 0 0.2rem;

                            .reward-item {
                                width: 1.4rem;
                                height: 2.14rem;

                                .item-avatar {
                                    width: 1.4rem;
                                    height: 1.4rem;
                                    background-size: contain;
                                    background-repeat: no-repeat;
                                    background-image: url(https://yaame-static.yaame.io/admin/bd382096d506173809e284d4955189b1.png);
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    position: relative;

                                    img {
                                        width: 1rem;
                                        height: auto;
                                    }

                                    .num {
                                        position: absolute;
                                        top: -0.13rem;
                                        right: -0.07rem;
                                        height: 0.35rem;
                                        line-height: 0.35rem;
                                        text-align: center;
                                        background: #FF6161;
                                        border-radius: 0.18rem;
                                        padding: 0 0.13rem;

                                        p {
                                            font-size: 0.24rem;
                                            color: #fff;
                                            transform: scale(0.8333);
                                        }
                                    }
                                }

                                .item-name {
                                    width: 1.4rem;
                                    line-height: 0.24rem;
                                    font-size: 0.24rem;
                                    font-weight: normal;
                                    color: #FFFFFF;
                                    text-align: center;
                                    margin-top: 0.18rem;
                                }

                                .item-value {
                                    width: 1.4rem;
                                    line-height: 0.24rem;
                                    font-size: 0.24rem;
                                    font-weight: normal;
                                    color: #F3EDCD;
                                    text-align: center;
                                    margin-top: 0.1rem;
                                    transform: scale(0.833);

                                    img {
                                        width: 0.23rem;
                                        height: auto;
                                        vertical-align: middle;
                                    }
                                }
                            }
                        }
                    }

                    &.top-1 {
                        background-image: url(https://yaame-static.yaame.io/admin/37905cf55ab3c1173201c8f1feb0509d.png);
                    }

                    &.top-2 {
                        background-image: url(https://yaame-static.yaame.io/admin/b4fb82e34db84936b46f20281f03cd1b.png);
                    }

                    &.top-3 {
                        background-image: url(https://yaame-static.yaame.io/admin/ee6188cce13e516e5b18ca5092fd0e98.png);
                    }

                    &.top-4 {
                        background-image: url(https://yaame-static.yaame.io/admin/56d3f66890abe255d93544b6825b8974.png);
                        margin-bottom: 0;
                    }

                    width: 5.8rem;
                    height: 3.5rem;
                    background-size: contain;
                    background-repeat: no-repeat;
                    margin-bottom: 0.4rem;
                    padding-top: 1.02rem;

                    .content {
                        width: 5.8rem;
                        height: 2.14rem;
                        display: flex;
                        justify-content: space-between;
                        padding: 0 0.36rem;

                        .reward-item {
                            width: 1.4rem;
                            height: 2.14rem;

                            .item-avatar {
                                width: 1.4rem;
                                height: 1.4rem;
                                background-size: contain;
                                background-repeat: no-repeat;
                                background-image: url(https://yaame-static.yaame.io/admin/bd382096d506173809e284d4955189b1.png);
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                position: relative;

                                img {
                                    width: 1rem;
                                    height: auto;
                                }

                                .num {
                                    position: absolute;
                                    top: -0.13rem;
                                    right: -0.07rem;
                                    height: 0.35rem;
                                    line-height: 0.35rem;
                                    text-align: center;
                                    background: #FF6161;
                                    border-radius: 0.18rem;
                                    padding: 0 0.13rem;

                                    p {
                                        font-size: 0.24rem;
                                        color: #fff;
                                        transform: scale(0.8333);
                                    }
                                }
                            }

                            .item-name {
                                width: 1.4rem;
                                line-height: 0.24rem;
                                font-size: 0.24rem;
                                font-weight: normal;
                                color: #FFFFFF;
                                text-align: center;
                                margin-top: 0.18rem;
                            }

                            .item-value {
                                width: 1.4rem;
                                line-height: 0.24rem;
                                font-size: 0.24rem;
                                font-weight: normal;
                                color: #F3EDCD;
                                text-align: center;
                                margin-top: 0.1rem;
                                transform: scale(0.833);

                                img {
                                    width: 0.23rem;
                                    height: auto;
                                    vertical-align: middle;
                                }
                            }
                        }
                    }
                }
            }

            &.rule {
                padding: 0.2rem 0.4rem 0;

                p {
                    margin-bottom: 0.1rem;
                }

                .table {
                    width: 4.9rem;
                    height: 2.4rem;
                    border: 0.01rem solid #FFFFFF;
                    margin-bottom: 0.2rem;
                    margin-top: 0.1rem;

                    th {
                        font-weight: normal;
                        height: 0.6rem;
                        border-right: 0.01rem solid rgba(224, 225, 226, 1);
                        border-bottom: 0.01rem solid rgba(224, 225, 226, 1);

                        &:last-child {
                            border-right: none;
                        }
                    }

                    td {
                        height: 0.6rem;
                        border-right: 0.01rem solid rgba(224, 225, 226, 1);
                        border-bottom: 0.01rem solid rgba(224, 225, 226, 1);
                        font-size: 0.24rem;
                        text-align: center;
                        padding: 0 0.1rem;

                        &:last-child {
                            border-right: none;
                        }
                    }

                    tr td:nth-child(1) {
                        width: 1.47rem;
                    }

                    tr th:nth-child(1) {
                        width: 1.47rem;
                    }

                    tr td:nth-child(2) {
                        width: 1.98rem;
                    }

                    tr th:nth-child(2) {
                        width: 1.98rem;
                    }
                }
            }
        }
    }

    .close-btn {
        position: absolute;
        width: 0.25rem;
        height: auto;
        right: 0.23rem;
        top: 0.23rem;
    }


}

</style>