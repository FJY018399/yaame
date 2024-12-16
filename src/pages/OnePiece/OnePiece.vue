<template>
    <div
        :style="{ 'background-image': `url('${ backgroundImgList[gameType] }')`, 'background-color': backgroundColorList[gameType], 'padding-top': isFirstWeek ? '0' : '1rem' }"
        :class="['main', gameType]"
    >
        <customHeader
            color="white"
            right_text=" "
            right_img="https://yaame-static.yaame.io/admin/b76e58d98bfde578e38223b4e151580c.png"
            @rightCall="rightCallBack"
        ></customHeader>
        <page-loading v-if="page_loading"></page-loading>
        <div
            v-if="isFirstWeek"
            :style="{ 'background-image': `url('${ titleImgList[gameType][language] }')` }"
            class="title-img"
        ></div>

        <div v-else :style="{ 'background-image': `url('${ lastTitleImgList[gameType][language] }')` }"
             class="title-last"
        ></div>

        <div v-if="isFirstWeek" :style="{ 'background-image': `url('${ countdownImgList[gameType] }')` }"
             class="countdown"
        >
            <span>{{ day }}</span>
            <span>DD</span>
            <span>{{ hour }}</span>
            <span>{{ minute }}</span>
            <span>{{ second }}</span>
        </div>

        <div v-else :style="{ 'background-image': `url('${ lastContainerBgList[gameType] }')` }" class="last-week">
            <div class="top-list">
                <div class="top2">
                    <div
                        :style="{ backgroundImage: `url(${prevTop2.subject_icon})` }"
                        class="avatar"
                        @click="toDetails(prevTop2)"
                    >
                        <img
                            class="dress"
                            src="https://yaame-static.yaame.io/admin/e20f21fb1d5d7c5945c11b67b36bb33e.png"
                            alt=""
                        />
                    </div>
                    <p class="top-name no-wrap">{{ prevTop2.subject_name }}</p>
                    <div class="top-diamond">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ prevTop2.income_diamonds }}
                    </div>
                </div>
                <div class="top1">
                    <div
                        :style="{ backgroundImage: `url(${prevTop1.subject_icon})` }"
                        class="avatar"
                        @click="toDetails(prevTop1)"
                    >
                        <img
                            class="dress"
                            src="https://yaame-static.yaame.io/admin/7906d5195c1a3b591c32bf68e4a8909b.png"
                            alt=""
                        />
                    </div>
                    <p class="top-name no-wrap">{{ prevTop1.subject_name }}</p>
                    <div class="top-diamond">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ prevTop1.income_diamonds }}
                    </div>
                </div>
                <div class="top3">
                    <div
                        :style="{ backgroundImage: `url(${prevTop3.subject_icon})` }"
                        class="avatar"
                        @click="toDetails(prevTop3)"
                    >
                        <img
                            class="dress"
                            src="https://yaame-static.yaame.io/admin/905f00e0890d895d6b85df8be7a695a1.png"
                            alt=""
                        />
                    </div>
                    <p class="top-name no-wrap">{{ prevTop3.subject_name }}</p>
                    <div class="top-diamond">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ prevTop3.income_diamonds }}
                    </div>
                </div>
            </div>
            <div :style="{ 'background-image': `url('${ countdownImgList[gameType] }')` }" class="countdown">
                <span>{{ day }}</span>
                <span>D</span>
                <span>{{ hour }}</span>
                <span>{{ minute }}</span>
                <span>{{ second }}</span>
            </div>
        </div>

        <div
            :style="{ marginTop: isFirstWeek ? '3.7rem' : '1rem',
                    'background-image': `url('${ eventGiftImgList[gameType] }')`
             }"
            class="event-gift"
        >
            <div :style="{ 'background-image': `url('${ containerHeaderImgList[gameType] }')` }"
                 class="container-header"
            >{{ $t("eventGift") }}
            </div>

            <div
                v-for="(item, index) in event_gif_list"
                :key="index"
                class="event-gift-item"
            >
                <div :style="{ 'background-color': imgBgColorList[gameType] }" class="img-container">
                    <img :src="item.icon" alt=""/>

                    <div class="img-price">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        <p>{{ item.diamond_worth }}</p>
                    </div>
                </div>
                <p class="gift-name no-wrap">{{ item.gift_name }}</p>
            </div>
        </div>

        <div :style="{ 'background-image': `url('${ topGiftBgList[gameType] }')` }" class="top20-gift">
            <div :style="{ 'background-image': `url('${ containerHeaderImgList[gameType] }')` }"
                 class="container-header"
            >{{ $t("top20Rewards") }}
            </div>

            <div
                v-for="(item, index) in top20_rewards_list"
                :key="index"
                class="view-rewards"
                @click="viewRewards(item)"
            >
                {{ $t("viewRewards") }}
            </div>
        </div>

        <div :style="{ 'background-image': `url('${ rankListBgList[gameType] }')` }" class="rank-list">
            <div :style="{ 'background-image': `url('${ containerHeaderImgList[gameType] }')` }"
                 class="container-header"
            >{{ $t("Ranking") }}
            </div>

            <img
                class="top-img"
                :src="listTopImg"
                alt=""
            />
            <img
                class="bottom-img"
                :src="listBottomImg"
                alt=""
            />

            <div class="top-list">
                <div class="top2">
                    <div
                        :style="{ backgroundImage: `url(${top2.subject_icon})` }"
                        class="avatar"
                        @click="toDetails(top2)"
                    >
                        <img
                            class="dress"
                            src="https://yaame-static.yaame.io/admin/e20f21fb1d5d7c5945c11b67b36bb33e.png"
                            alt=""
                        />
                    </div>
                    <p class="top-name no-wrap">{{ top2.subject_name }}</p>
                    <div class="top-diamond">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ top2.income_diamonds }}
                    </div>
                </div>
                <div class="top1">
                    <div
                        :style="{ backgroundImage: `url(${top1.subject_icon})` }"
                        class="avatar"
                        @click="toDetails(top1)"
                    >
                        <img
                            class="dress"
                            src="https://yaame-static.yaame.io/admin/7906d5195c1a3b591c32bf68e4a8909b.png"
                            alt=""
                        />
                    </div>
                    <p class="top-name no-wrap">{{ top1.subject_name }}</p>
                    <div class="top-diamond">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ top1.income_diamonds }}
                    </div>
                </div>
                <div class="top3">
                    <div
                        :style="{ backgroundImage: `url(${top3.subject_icon})` }"
                        class="avatar"
                        @click="toDetails(top3)"
                    >
                        <img
                            class="dress"
                            src="https://yaame-static.yaame.io/admin/905f00e0890d895d6b85df8be7a695a1.png"
                            alt=""
                        />
                    </div>
                    <p class="top-name no-wrap">{{ top3.subject_name }}</p>
                    <div class="top-diamond">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ top3.income_diamonds }}
                    </div>
                </div>
            </div>

            <div v-if="list && list.length" class="list-container">
                <div v-for="(item, index) in list" :key="index"
                     :style="{ 'background-image': `url('${ listItemBgList[gameType] }')` }" class="list-item"
                >
                    <div :style="{ backgroundImage: `url(${ listFlagBgList[gameType] })`, 'color': sortColorList[gameType] }" class="sort">{{ item.subject_rank }}</div>
                    <div
                        :style="{ backgroundImage: `url(${item.subject_icon})` }"
                        class="user-avatar"
                        @click="toDetails(item)"
                    >
                        <img
                            :src="userAvatar[gameType]"
                            alt=""
                        />
                    </div>
                    <div class="user-info">
                        <p>{{ item.subject_name }}</p>
                        <p>ID:{{ item.peanut_id }}</p>
                    </div>
                    <div class="user-value">
                        <img
                            src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                            alt=""
                        />
                        {{ item.income_diamonds }}
                    </div>
                </div>
            </div>
        </div>

        <div :style="{ 'background-image': `url('${ userInfoBgList[gameType] }')` }" class="user-data">
            <div class="list-item">
                <div class="sort">{{ my_rank.subject_rank || "99+" }}</div>
                <div
                    :style="{ backgroundImage: `url(${my_rank.subject_icon})` }"
                    class="user-avatar"
                    @click="toDetails(my_rank)"
                >
                    <img
                        :src="userAvatar[gameType]"
                        alt=""
                    />
                </div>
                <div class="user-info">
                    <p>{{ my_rank.subject_name }}</p>
                    <p>ID:{{ my_rank.peanut_id }}</p>
                </div>
                <div class="user-value">
                    <img
                        src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                        alt=""
                    />
                    {{ my_rank.income_diamonds }}
                </div>
            </div>
        </div>

        <popup v-if="ruleVisible" class="flex-box">
            <div :style="{ 'background-image': `url('${ ruleContainerBgList[gameType] }')` }" class="rule-container">
                <div :style="{ 'background-image': `url('${ containerHeaderImgList[gameType] }')` }"
                     class="container-header"
                >{{ $t("ActivityRules") }}
                </div>

                <div class="rule-div">
                    <p>{{ $t("rule-1") }}</p>
                    <p>{{ $t("rule-2") }}</p>
                    <div :style="{ 'background-color': imgListBgColorList[gameType] }" class="rule-gift">
                        <div class="event-gift-title">Event Gift</div>
                        <div
                            v-for="(item, index) in event_gif_list"
                            :key="index"
                            class="event-gift-item"
                        >
                            <div :style="{ 'background-color': imgBgColorList[gameType] }" class="img-container">
                                <img :src="item.icon" alt=""/>

                                <div class="img-price">
                                    <img
                                        src="https://yaame-static.yaame.io/admin/f65da18f53bc6f72ae84daf13b328c1d.png"
                                        alt=""
                                    />
                                    <p>{{ item.diamond_worth }}</p>
                                </div>
                            </div>
                            <p class="gift-name no-wrap">{{ item.gift_name }}</p>
                        </div>
                    </div>
                    <p>{{ $t("rule-3") }}</p>
                    <div class="rule-table">
                        <div class="table-header">
                            <div>{{ $t("chestName") }}</div>
                            <div>{{ $t("rank") }}</div>
                        </div>
                        <div class="table-header">
                            <div>{{ $t("PlatinumChest") }}</div>
                            <div>1ST</div>
                        </div>
                        <div class="table-header">
                            <div>{{ $t("GoldenTreasure") }}</div>
                            <div>2ST</div>
                        </div>
                        <div class="table-header">
                            <div>{{ $t("PurpleTreasure") }}</div>
                            <div>3ST</div>
                        </div>
                        <div class="table-header">
                            <div>{{ $t("CopperTreasure") }}</div>
                            <div>4ST-10ST</div>
                        </div>
                        <div class="table-header">
                            <div>{{ $t("IronTreasure") }}</div>
                            <div>11ST-20ST</div>
                        </div>
                    </div>
                    <p>{{ $t("rule-4") }}</p>
                </div>

                <img
                    class="close-img"
                    src="https://yaame-static.yaame.io/admin/404e026c3812fcdef0ec4be668562f4f.png"
                    alt=""
                    @click="ruleVisible = false"
                />
            </div>
        </popup>

        <popup v-if="viewRewardsVisible" class="flex-box">
            <div
                :class="{
					'view-rewards-container': true,
					'length-4': !one_piece_uid_item,
					'length-5': one_piece_uid_item,
				}"
                :style="{ 'background-image': `url('${ viewRewardsBgImg }')` }"
            >
                <div :style="{ 'background-image': `url('${ containerHeaderImgList[gameType] }')` }"
                     class="container-header"
                >One Piece
                </div>
                <div v-if="one_piece_uid_item">
                    <div :style="{ 'background-color': imgBgColorList[gameType] }" class="big-gift">
                        <img :src="one_piece_uid_item.icon" alt=""/>
                        <p class="gift-name">{{ one_piece_uid_item.gift_name }}</p>

                        <div class="gift-price">{{ one_piece_uid_item.diamond_worth }}</div>
                    </div>
                    <div class="gift-container">
                        <div
                            v-for="(item, index) in rewardList"
                            :key="index"
                            class="gift-item"
                            :style="{ 'background-color': imgBgColorList[gameType] }"
                        >
                            <img :src="item.icon" alt=""/>
                            <p class="gift-name">{{ item.gift_name }}</p>
                            <div class="gift-price">{{ item.diamond_worth }}</div>
                        </div>
                    </div>
                </div>
                <div v-else class="gift-container">
                    <div
                        v-for="(item, index) in rewardList"
                        :key="index"
                        class="gift-item"
                        :style="{ 'background-color': imgBgColorList[gameType] }"
                    >
                        <img :src="item.icon" alt=""/>
                        <p class="gift-name">{{ item.gift_name }}</p>
                        <div class="gift-price">{{ item.diamond_worth }}</div>
                    </div>
                </div>

                <img
                    class="close-img"
                    src="https://yaame-static.yaame.io/admin/404e026c3812fcdef0ec4be668562f4f.png"
                    alt=""
                    @click="viewRewardsVisible = false"
                />
            </div>
        </popup>
    </div>
</template>
<script>
    import pageLoading from "../../components/common/page_loading.vue";
    import customHeader from "../../components/common/header.vue";
    import request from "../../lib/request/activity";
    import popup from "../../components/common/pop_up.vue";
    import { getAppType, getChannel, getLanguage } from "@/lib/device";

    const getDefaultUser = () => {
        return {
            subject_icon:
                "https://yaame-static.yaame.io/admin/3754bb61a4df0fae4e166999c2401876.png",
            subject_name: "-",
            subject_id: "",
            income_diamonds: "-",
            peanut_id: "-",
            subject_rank: "",
        };
    };
    export default {
        components: {
            customHeader,
            pageLoading,
            popup,
        },
        data() {
            return {
                event_gif_list: [],
                top20_rewards_list: [],

                list: [],
                top1: getDefaultUser(),
                top2: getDefaultUser(),
                top3: getDefaultUser(),

                prevTop1: getDefaultUser(),
                prevTop2: getDefaultUser(),
                prevTop3: getDefaultUser(),

                isFirstWeek: false,

                day: "",
                hour: "",
                minute: "",
                second: "",

                my_rank: getDefaultUser(),

                page_loading: true,

                ruleVisible: false,

                viewRewardsVisible: false,

                rewardList: [],
                one_piece_uid_item: false,


                gameType: 'ONE_PIECE_SEA',
                backgroundImgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/8e2056b92f4c13c713debbe088e4553c.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/d4cb77269ae3efcd1eb3ee1bcc26ca1e.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/9172ed9c848f3a7baba3601a95ac6541.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/8f045c9f998a710456c7039e8af08176.png',
                },
                backgroundColorList: {
                    ONE_PIECE_SEA: '#416fee',
                    ONE_PIECE_FOREST: '#193E13',
                    ONE_PIECE_DESERT: '#582E02',
                    ONE_PIECE_FIRMAMENT: '#14164C',
                },
                titleImgList: {
                    ONE_PIECE_SEA: {
                        'zh-cn': 'https://yaame-static.yaame.io/admin/9c6cb48fe2f5ae3ef439743381c94761.png',
                        'zh-tw': 'https://yaame-static.yaame.io/admin/90e7b75c1d9e5c1c71d2ee7a0d155f78.png',
                        'en': 'https://yaame-static.yaame.io/admin/37ccbbfcf82cb763363539e4e5fec5b9.png',
                        'id': 'https://yaame-static.yaame.io/admin/1c475ac4ccdbe800880795c58ceed34f.png',
                        'ar': 'https://yaame-static.yaame.io/admin/3cff7a5d80b85fd485bffe7c85f05025.png',
                    },
                    ONE_PIECE_FOREST: {
                        'zh-cn': 'https://yaame-static.yaame.io/admin/862049180f4e0baa2ea81afdeedcc559.png',
                        'zh-tw': 'https://yaame-static.yaame.io/admin/9fe89b0313a4568f49d597b7676d8c69.png',
                        'en': 'https://yaame-static.yaame.io/admin/488819938e5c0057f74926ef6bc8f9b3.png',
                        'id': 'https://yaame-static.yaame.io/admin/cda35dbc1a2743e412dfd8583c5dd339.png',
                        'ar': 'https://yaame-static.yaame.io/admin/8c6b64ff2a535688d0e01fa44b15945d.png',
                    },
                    ONE_PIECE_DESERT: {
                        'zh-cn': 'https://yaame-static.yaame.io/admin/c016e99abee319263cdced151b317644.png',
                        'zh-tw': 'https://yaame-static.yaame.io/admin/a2700017e9f380eafcb39b1126a5c30f.png',
                        'en': 'https://yaame-static.yaame.io/admin/c99d8b8d16fc48dcbf913c4103c2531a.png',
                        'id': 'https://yaame-static.yaame.io/admin/f33f5ede1898d23884c5edebf3156709.png',
                        'ar': 'https://yaame-static.yaame.io/admin/2644ab8d8aa850eac69821b3f6174a39.png',
                    },
                    ONE_PIECE_FIRMAMENT: {
                        'zh-cn': 'https://yaame-static.yaame.io/admin/4b23ad46b9a4756d2106331d0af30c41.png',
                        'zh-tw': 'https://yaame-static.yaame.io/admin/debe4eb6934f7adaeb5aa1215f6a9a6c.png',
                        'en': 'https://yaame-static.yaame.io/admin/32a816448e151b4c848ce635b906720d.png',
                        'id': 'https://yaame-static.yaame.io/admin/2d8396c497614a446ef72a779033b2a4.png',
                        'ar': 'https://yaame-static.yaame.io/admin/43978e7172e9a6577aa173de2640b6d9.png',
                    },
                },
                lastTitleImgList: {
                    ONE_PIECE_SEA: {
                        'zh-cn': 'https://yaame-static.yaame.io/admin/3d09d857c00523506ace7cebdbfa964b.png',
                        'en': 'https://yaame-static.yaame.io/admin/198eacea37422ff4f2a010533d7bed56.png',
                        'id': 'https://yaame-static.yaame.io/admin/2894a6d5126d94607e24891df7673f32.png',
                        'ar': 'https://yaame-static.yaame.io/admin/234af334756ed9196cd0c7734645c34f.png',
                        'zh-tw': 'https://yaame-static.yaame.io/admin/8256083de2dd77923d7eada87f1ebfa6.png',
                    },
                    ONE_PIECE_FOREST: {
                        'zh-cn': 'https://yaame-static.yaame.io/admin/a42503c0ee8ac319dd6d51f70b2443eb.png',
                        'en': 'https://yaame-static.yaame.io/admin/e85d2603f7f922022764d97cbd3fb55d.png',
                        'id': 'https://yaame-static.yaame.io/admin/0057e32f9002c2b9adf0f0c4c9dd7be1.png',
                        'ar': 'https://yaame-static.yaame.io/admin/145fd87b23a96c7db7c65f6ca2592e05.png',
                        'zh-tw': 'https://yaame-static.yaame.io/admin/1df241ee0efd1f00a1fa3b7ac9804bf9.png',
                    },
                    ONE_PIECE_DESERT: {
                        'zh-cn': 'https://yaame-static.yaame.io/admin/b719f5bd06b16a0e3146bbc339f7c682.png',
                        'zh-tw': 'https://yaame-static.yaame.io/admin/66e2818ff8064f660fa619f9b81b9254.png',
                        'en': 'https://yaame-static.yaame.io/admin/1098cbd014bb52127d2319884dddaa0d.png',
                        'id': 'https://yaame-static.yaame.io/admin/11df89e880ef51737bb9777359d5e060.png',
                        'ar': 'https://yaame-static.yaame.io/admin/b70e2df2a01356e976ab031782bec2f3.png',
                    },
                    ONE_PIECE_FIRMAMENT: {
                        'zh-cn': 'https://yaame-static.yaame.io/admin/4948c7c8de5ae8059b0f5fcbaecde9f3.png',
                        'zh-tw': 'https://yaame-static.yaame.io/admin/3464d34f5ad6b267904add23e74d2f80.png',
                        'en': 'https://yaame-static.yaame.io/admin/d0447e6886d6fb65a0419987333643f5.png',
                        'id': 'https://yaame-static.yaame.io/admin/b9e25606e9c6b215380aef417fe3c4fa.png',
                        'ar': 'https://yaame-static.yaame.io/admin/686c1623995f93f60dac2de2a725cfe8.png',
                    },
                },
                lastContainerBgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/77e993db6b7e54d89634a1d03b08267a.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/76407938ba4e430569fe8db121c850b0.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/20c668b5101f1f7227b8c01391c9cabb.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/a8dd2159347148df920f8043caa36d03.png',
                },
                countdownImgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/4baaa2fbfbaa5510b676b0640a01f166.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/2626009c232dab776147d302106dfefb.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/e89b17db1c5b68abd20f8a75b0dabc18.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/ac17bd8d970e78f17bd8c8519c295f1a.png',
                },
                containerHeaderImgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/438cdea34d6e063be8a762df1623266a.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/614c5fe7e50a95653d52f1b95db3660d.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/c7def919715234f98b166ef1a7cc676d.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/a84fde40502577ecefb1ff4e75018685.png',
                },
                eventGiftImgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/ccd2d03a75ed0a52c77ee64c18c9a002.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/aaeb24ca19304a992645a3be26a404e4.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/142e3a20fb10e2c1ed556874cf3d5001.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/5d52b2a1e8450d6d7c6ec61a82e25a1e.png',
                },
                imgBgColorList: {
                    ONE_PIECE_SEA: '#2433a5',
                    ONE_PIECE_FOREST: '#0F5003',
                    ONE_PIECE_DESERT: '#593214',
                    ONE_PIECE_FIRMAMENT: '#20046D',
                },
                imgListBgColorList: {
                    ONE_PIECE_SEA: '#3d84e3',
                    ONE_PIECE_FOREST: '#267F0E',
                    ONE_PIECE_DESERT: '#A45816',
                    ONE_PIECE_FIRMAMENT: '#471BA5',
                },
                topGiftBgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/ee11eb55c044608d67ae5c6f907368ab.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/7a261098a77425b236657814a5bbb879.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/8384f6b68893799f2e0905fed83bd5a1.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/0a310bbdb962edb6558c60857451e1a5.png',
                },
                listTopImgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/3cf1f1b83ed7fff1acffa10b191e55e9.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/fc1916a4d987c30ed69ce0eb614c43da.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/b1db51d2894578a4de41bbab4c87547b.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/380c6b58d1a879c7071688e9625cef94.png',
                },
                listBottomImgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/f6e52d8211820f874ec88f79d89c6b05.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/966d58386123b245faf9f770ba468e5b.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/a03871bbba3407256bfe812cdb9f8623.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/104cb8992b28bab62d25f80d5f029866.png',
                },
                rankListBgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/75bd6626ca98151da371df248633ccec.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/e97adf5178b91b210bc623ae9fa325ca.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/62f8bc939bb3b62843208fcebefe2a56.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/afebc40a533fcc016e99495b4e6f60ef.png',
                },
                listItemBgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/9ee6090fb1d9b9abd964c09e0c65cc4f.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/383343171e403cbc4b9c037b898fb948.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/9cfea1e2dc840288f0792a33c96cdd21.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/79e059bd13efe0b046819e31c3a58042.png',
                },
                userInfoBgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/d42629095455752e829d408205f87274.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/e39bdbc8e1cb877ba4a57b8e32c77b11.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/0992b63b41fbc8865b9f5816509501d1.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/0051d77122c9a00d52b50c2eaca06b6d.png',
                },
                ruleContainerBgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/612ee6466c40dfff237567b2eb9d0cc2.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/5aeed0a7d65c543031216e9aa7cf109b.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/8166da38eae2a42c7e0ad29752509e0d.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/c0ca649c79d47f5cbfd54ae5152b34b6.png',
                },
                fiveRewardBgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/e5721814986731ee88bb6d24318ec81e.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/8122bc04b31e25fb9cd526e2413152b8.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/d499bac9b227b5566382d2719aba7905.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/96ebac57c1f4936f6684029222d3b0f5.png',
                },
                oneRewardBgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/10e3e8e878deb15ae7aefcb7a922a967.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/0c59f82bcd2bb33a039b4a07c85e08e0.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/aaf074934796d8c26ea940b28eb55c2a.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/2453ec29840a1f89c60d98de44c66ce4.png',
                },
                listFlagBgList: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/79bae0697b757cedfa26c00fc07c5dcc.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/1c6737680de0a0178220fca9b3809e5f.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/225ff6e7c6f5e4eff4ff1237cf83a1f5.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/c053b75de4402de438630426f5c0ef7b.png',
                },
                userAvatar: {
                    ONE_PIECE_SEA: 'https://yaame-static.yaame.io/admin/c9db821dcffa6020dd22314af615797c.png',
                    ONE_PIECE_FOREST: 'https://yaame-static.yaame.io/admin/2d080312f05eed167c7610ef3fe9b46f.png',
                    ONE_PIECE_DESERT: 'https://yaame-static.yaame.io/admin/ec1958f554b1a79fd00c91b9c41f9cba.png',
                    ONE_PIECE_FIRMAMENT: 'https://yaame-static.yaame.io/admin/71cd871852ff616a283e3e3f51a58dd9.png',
                },
                sortColorList: {
                    ONE_PIECE_SEA: '#0d4a96',
                    ONE_PIECE_FOREST: '#185D05',
                    ONE_PIECE_DESERT: '#884406',
                    ONE_PIECE_FIRMAMENT: '#FFFFFF',
                }
            };
        },
        computed: {
            language() {
                let locale = getLanguage() || "en";
                if (['zh-hk', 'zh-tw', 'zh-mo', 'zh-cn', 'zh_cn'].indexOf(locale) > -1) {
                    let localEnum = {
                        'zh-hk': 'zh-tw',
                        'zh-tw': 'zh-tw',
                        'zh-mo': 'zh-tw',
                        'zh-cn': 'zh-cn',
                        'zh_cn': 'zh-cn',
                    };

                    locale = localEnum[locale];
                }
                return locale;
            },
            listTopImg() {
                return this.listTopImgList[this.gameType];
            },
            listBottomImg() {
                return this.listBottomImgList[this.gameType];
            },
            viewRewardsBgImg() {
                if (this.one_piece_uid_item) {
                    return this.fiveRewardBgList[this.gameType];
                } else {
                    return this.oneRewardBgList[this.gameType];
                }
            },
        },
        async mounted() {
            let self = this;
            await this.getData();
            await this.getList();

            this.page_loading = false;

            self.getTimeToWeekend();

            this.countInterval = setInterval(() => {
                self.getTimeToWeekend();
            }, 1000);

            setInterval(() => {
                self.getList();
            }, 5000);
        },
        methods: {
            rightCallBack() {
                this.ruleVisible = true;
            },
            async getData() {
                let res = await request.getOnePieceIndex();
                if (res.status !== 1000) return;
                this.event_gif_list = res.data.event_gif_list;
                this.top20_rewards_list = res.data.top20_rewards_list;

                this.prevTop1 =
                    res.data.last_weeks_top_explorer_list[0] || getDefaultUser();
                this.prevTop2 =
                    res.data.last_weeks_top_explorer_list[1] || getDefaultUser();
                this.prevTop3 =
                    res.data.last_weeks_top_explorer_list[2] || getDefaultUser();

                this.gameType = res.data.one_piece_theme_type;

                if (
                    res.data.last_weeks_top_explorer_list &&
                    res.data.last_weeks_top_explorer_list.length
                ) {
                    this.isFirstWeek = false;
                } else {
                    this.isFirstWeek = true;
                }
            },
            async getList(page = 1) {
                let res = await request.getActivityRank({
                    page,
                    size: 50,
                    activityRankCycleType: "WEEK",
                    activityRankType: "ONE_PIECE_GAME",
                });
                if (res.status !== 1000) return;

                this.top1 = res.data.content[0] || getDefaultUser();
                this.top2 = res.data.content[1] || getDefaultUser();
                this.top3 = res.data.content[2] || getDefaultUser();

                this.my_rank = res.data.my_rank || getDefaultUser();
                if (!this.my_rank.income_diamonds) {
                    this.my_rank.income_diamonds = 0;
                }
                if (res.data.content && res.data.content && res.data.content.length > 3) {
                    this.list = res.data.content.slice(3);
                } else {
                    this.list = [];
                }
            },

            getTimeToWeekend() {
                const now = new Date();
                const currentDayOfWeek = now.getUTCDay();
                const nextMonday = new Date(
                    Date.UTC(
                        now.getUTCFullYear(),
                        now.getUTCMonth(),
                        now.getUTCDate() + ((7 - currentDayOfWeek || 7) % 7 + 1),
                        0,
                        0,
                        0
                    )
                );

                let timeRemaining = nextMonday.getTime() - now.getTime();

                timeRemaining = Math.floor(timeRemaining / 1000); // convert from ms to s

                const days = Math.floor(timeRemaining / 86400); // 1 day = 86400 seconds
                timeRemaining %= 86400;

                const hours = String(Math.floor(timeRemaining / 3600)).padStart(2, "0"); // 1 hour = 3600 seconds
                timeRemaining %= 3600;

                const minutes = String(Math.floor(timeRemaining / 60)).padStart(2, "0"); // 1 minute = 60 seconds
                timeRemaining %= 60;

                const seconds = String(timeRemaining).padStart(2, "0");

                this.day = days;
                this.hour = hours;
                this.minute = minutes;
                this.second = seconds;
            },
            viewRewards(item) {
                if (item.one_piece_uid_item) {
                    this.one_piece_uid_item = item.one_piece_uid_item;
                } else {
                    this.one_piece_uid_item = false;
                }
                this.rewardList = item.reward_item_vo_list || [];
                this.viewRewardsVisible = true;
            },
            toDetails(item) {
                if (item.is_mystery === 1) {
                    return
                }
                if (item.subject_id) {
                    location.href = `wlyaame://trend/user?uid=${item.subject_id}`;
                }
            },
        },
    };
</script>
<style scoped lang="less">
.main {
    width: 7.5rem;
    min-height: 100vh;

    background-color: #416fee;
    background-image: url(https://yaame-static.yaame.io/admin/8e2056b92f4c13c713debbe088e4553c.png);
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    padding-bottom: 2.4rem;
    &.ONE_PIECE_FIRMAMENT {
        .container-header {
            width: 4.98rem;
            height: 1.1rem;
            padding-right: 0.4rem;
        }
    }
    .title-img {
        width: 7.5em;
        height: 3.42rem;
        background-repeat: no-repeat;
        background-size: contain;
        position: relative;
        left: 0;
        background-position: center center;
    }

    .title-last {
        width: 7.5rem;
        height: 1.5rem;
        background-image: url(https://yaame-static.yaame.io/admin/240cc8a52dca599d8ddd51a885fc0b6f.png);
        background-repeat: no-repeat;
        background-size: contain;
        position: relative;
        left: 0;
        background-position: center center;
    }

    .countdown {
        width: 3.28rem;
        height: 0.72rem;
        position: relative;
        left: 2.04rem;
        background-image: url(https://yaame-static.yaame.io/admin/4baaa2fbfbaa5510b676b0640a01f166.png);
        background-size: contain;
        background-repeat: no-repeat;
        font-size: 0.26rem;
        text-align: center;
        color: #fff;

        span {
            width: 0.36rem;
            height: 0.36rem;
            text-align: center;
            line-height: 0.36rem;
            position: absolute;
            top: 0.18rem;

            &:nth-child(1) {
                left: 0.24rem;
            }

            &:nth-child(2) {
                left: 0.64rem;
                transform: scale(0.7);
            }

            &:nth-child(3) {
                left: 1.22rem;
            }

            &:nth-child(4) {
                left: 1.92rem;
            }

            &:nth-child(5) {
                left: 2.6rem;
            }
        }
    }

    .last-week {
        width: 7.22rem;
        height: 4.62rem;
        position: relative;
        background-size: 7.22rem auto;
        background-repeat: no-repeat;
        background-image: url(https://yaame-static.yaame.io/admin/77e993db6b7e54d89634a1d03b08267a.png);
        margin-top: 0.98rem;
        left: 0.14rem;

        .top-list {
            position: absolute;
            top: -0.86rem;
        }

        .countdown {
            width: 3.28rem;
            height: 0.72rem;
            position: relative;
            left: 1.9rem;
            top: 3.5rem;
            background-image: url(https://yaame-static.yaame.io/admin/4baaa2fbfbaa5510b676b0640a01f166.png);
            background-size: contain;
            background-repeat: no-repeat;
        }
    }

    .event-gift {
        width: 7.22rem;
        height: 3.47rem;
        background-image: url(https://yaame-static.yaame.io/admin/ccd2d03a75ed0a52c77ee64c18c9a002.png);
        background-repeat: no-repeat;
        background-size: 7.22rem auto;
        margin-top: 3.7rem;
        margin-left: 0.14rem;
        position: relative;
        display: flex;
        justify-content: space-between;
        padding: 1.04rem 0.33rem 0.42rem;

        .event-gift-item {
            width: 1.52rem;
            height: 1.97rem;

            .img-container {
                width: 1.52rem;
                height: 1.52rem;
                background: #2433a5;
                border-radius: 0.16rem;
                border: 0.01rem solid #fefa85;
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;

                .img-price {
                    position: absolute;
                    padding: 0 0.06rem;
                    top: 0;
                    right: 0;
                    height: 0.26rem;
                    line-height: 0.26rem;
                    background: #fefa85;
                    border-radius: 0px 0.15rem 0px 0.13rem;
                    font-size: 0.24rem;
                    font-weight: 500;
                    color: #a84118;

                    img {
                        width: 0.24rem;
                        height: 0.24rem;
                        vertical-align: middle;
                    }

                    p {
                        display: inline-block;
                        transform: scale(0.9333);
                    }
                }

                img {
                    width: 1.2rem;
                    height: 1.2rem;
                }
            }

            .gift-name {
                text-align: center;
                font-size: 0.24rem;
                font-family: SFProDisplay-Medium, SFProDisplay;
                font-weight: 500;
                color: #fdf5b4;
                margin-top: 0.12rem;
            }
        }
    }

    .container-header {
        width: 4.38rem;
        height: 1.1rem;
        position: absolute;
        z-index: 1;
        background-image: url(https://yaame-static.yaame.io/admin/438cdea34d6e063be8a762df1623266a.png);
        background-repeat: no-repeat;
        background-size: contain;
        left: 1.42rem;
        top: -0.4rem;
        font-size: 0.32rem;
        line-height: 1.14rem;
        text-align: center;
        font-family: SFProDisplay-Medium, SFProDisplay;
        font-weight: 500;
        color: #fdf5b4;
    }

    .top20-gift {
        width: 7.22rem;
        height: 6.91rem;
        background-image: url(https://yaame-static.yaame.io/admin/ee11eb55c044608d67ae5c6f907368ab.png);
        background-repeat: no-repeat;
        background-size: contain;
        margin-top: 0.98rem;
        margin-left: 0.14rem;
        position: relative;

        .view-rewards {
            width: 1.76rem;
            height: 0.4rem;
            background-image: url(https://yaame-static.yaame.io/admin/747a3d8c29ad16b30be234d6a152cd0c.png);
            background-repeat: no-repeat;
            background-size: contain;
            line-height: 0.4rem;
            text-align: center;
            font-size: 0.22rem;
            font-family: SFProDisplay-Medium, SFProDisplay;
            font-weight: 500;
            color: #a84118;
            position: absolute;

            &:nth-child(2) {
                left: 1.04rem;
                top: 3.73rem;
            }

            &:nth-child(3) {
                right: 1.04rem;
                top: 3.73rem;
            }

            &:nth-child(4) {
                left: 0.48rem;
                bottom: 0.54rem;
            }

            &:nth-child(5) {
                left: 2.72rem;
                bottom: 0.54rem;
            }

            &:nth-child(6) {
                right: 0.48rem;
                bottom: 0.54rem;
            }
        }
    }

    .rank-list {
        width: 7.22rem;
        margin-left: 0.14rem;
        min-height: 6rem;
        background-image: url(https://yaame-static.yaame.io/admin/75bd6626ca98151da371df248633ccec.png);
        background-size: 7.22rem calc(100% - 2rem);
        background-position: 0 0.4rem;
        background-repeat: no-repeat;
        position: relative;
        margin-top: 0.98rem;
        padding-top: 1.04rem;
        padding-bottom: 0.42rem;

        .top-img {
            width: 7.22rem;
            height: 2rem;
            position: absolute;
            top: 0;
            left: 0;
        }

        .bottom-img {
            width: 7.22rem;
            height: 2rem;
            position: absolute;
            bottom: 0;
            left: 0;
        }

        .list-container {
            width: 6.58rem;
            min-height: 5rem;
            margin-left: 0.32rem;
            padding-top: 0.4rem;

            .list-item {
                width: 6.58rem;
                height: 1.3rem;
                background-image: url(https://yaame-static.yaame.io/admin/9ee6090fb1d9b9abd964c09e0c65cc4f.png);
                background-repeat: no-repeat;
                background-size: contain;
                margin-bottom: 0.2rem;
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
                padding-left: 0.2rem;
                padding-right: 0.3rem;
                position: relative;
                z-index: 2;

                .sort {
                    width: 0.6rem;
                    height: 0.6rem;
                    background-image: url(https://yaame-static.yaame.io/admin/79bae0697b757cedfa26c00fc07c5dcc.png);
                    background-repeat: no-repeat;
                    background-size: contain;
                    line-height: 0.6rem;
                    text-align: center;
                    font-size: 0.3rem;
                    font-family: SFProDisplay-Medium, SFProDisplay;
                    font-weight: 500;
                    color: #0d4a96;
                }

                .user-avatar {
                    width: 0.98rem;
                    height: 0.98rem;
                    background-size: contain;
                    background-repeat: no-repeat;
                    margin-left: 0.2rem;
                    border-radius: 50%;

                    img {
                        width: 0.98rem;
                        height: 0.98rem;
                    }
                }

                .user-info {
                    width: 2.5rem;
                    font-size: 0.24rem;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #ffffff;
                    margin-left: 0.18rem;
                }

                .user-value {
                    width: 1.6rem;
                    font-size: 0.26rem;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #ffffff;
                    text-align: right;

                    img {
                        width: 0.26rem;
                        height: 0.26rem;
                        vertical-align: middle;
                    }
                }
            }
        }
    }

    .top-list {
        width: 6.58rem;
        height: 4.02rem;
        margin-left: 0.32rem;
        display: flex;
        position: relative;
        justify-content: space-between;

        .top1 {
            width: 2.3rem;
            height: 4.02rem;
            background-image: url(https://yaame-static.yaame.io/admin/046381d5ea452eb4345d5604ff6a0001.png);
            background-repeat: no-repeat;
            background-size: contain;
            position: relative;

            .avatar {
                width: 1.2rem;
                height: 1.2rem;
                margin-top: 0.2rem;
                margin-left: 0.2rem;
                position: absolute;
                top: 0.82rem;
                left: 0.35rem;
                background-size: 1.2rem 1.2rem;
                background-position: center;
                background-repeat: no-repeat;
                border-radius: 50%;
                position: relative;

                .dress {
                    position: absolute;
                    top: -0.2rem;
                    left: -0.2rem;
                    width: 1.6rem;
                    height: 1.6rem;
                }
            }

            .top-name {
                width: 2.3rem;
                top: 2.42rem;
                text-align: center;
            }

            .top-diamond {
                width: 1.7rem;
                height: 0.38rem;
                text-align: center;
                line-height: 0.38rem;
                position: absolute;
                top: 2.87rem;
                left: 0.3rem;

                img {
                    width: 0.26rem;
                    height: 0.26rem;
                    vertical-align: middle;
                }

                font-size: 0.26rem;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #724b36;
                background-size: contain;
                background-repeat: no-repeat;
                background-image: url(https://yaame-static.yaame.io/admin/dba3a0bce3ef2b36019f0ebc1ce45534.png);
            }
        }

        .top2 {
            background-image: url(https://yaame-static.yaame.io/admin/9567716f1d4950ffd48318074e8db35f.png);
            background-repeat: no-repeat;
            background-size: contain;

            .top-diamond {
                background-image: url(https://yaame-static.yaame.io/admin/f0dc5d6f1ec5ed578ea0eac392680dd5.png);
            }
        }

        .top3 {
            background-image: url(https://yaame-static.yaame.io/admin/2a26e27374bef5c9cdd5c2b48a3cafce.png);
            background-repeat: no-repeat;
            background-size: contain;

            .top-diamond {
                background-image: url(https://yaame-static.yaame.io/admin/1024b1ced56f890cbb5b0f4a2f704b5b.png);
            }
        }

        .top2,
        .top3 {
            width: 1.98rem;
            height: 3.56rem;
            position: relative;
            top: 0.34rem;

            .avatar {
                width: 1.1rem;
                height: 1.1rem;
                position: absolute;
                top: 0.7rem;
                left: 0.24rem;
                background-size: 1.1rem 1.1rem;
                background-position: center;
                background-repeat: no-repeat;
                border-radius: 50%;
                position: relative;
                margin: 0.2rem;

                .dress {
                    width: 1.5rem;
                    height: 1.5rem;
                    position: absolute;
                    top: -0.2rem;
                    left: -0.2rem;
                }
            }

            .top-name {
                width: 1.98rem;
                top: 2.2rem;
                text-align: center;
            }

            .top-diamond {
                width: 1.7rem;
                height: 0.38rem;
                text-align: center;
                line-height: 0.38rem;
                position: absolute;
                top: 2.59rem;
                left: 0.14rem;
                background-repeat: no-repeat;
                background-size: contain;

                img {
                    width: 0.26rem;
                    height: 0.26rem;
                    vertical-align: middle;
                }

                font-size: 0.26rem;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #724b36;
            }
        }

        .top-name {
            font-size: 0.26rem;
            font-family: SFProDisplay-Semibold, SFProDisplay;
            font-weight: 600;
            color: #ffffff;
            position: absolute;
        }
    }

    .user-data {
        width: 7.5rem;
        height: 1.84rem;
        position: fixed;
        z-index: 99;
        bottom: 0;
        left: 0;
        background-image: url(https://yaame-static.yaame.io/admin/d42629095455752e829d408205f87274.png);
        background-repeat: no-repeat;
        background-size: contain;
        padding-left: 0.46rem;

        .list-item {
            width: 6.58rem;
            height: 1.3rem;
            margin-bottom: 0.2rem;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            padding-left: 0.2rem;
            padding-right: 0.3rem;

            .sort {
                width: 0.6rem;
                height: 0.6rem;
                line-height: 0.6rem;
                text-align: center;
                font-size: 0.3rem;
                font-family: SFProDisplay-Medium, SFProDisplay;
                font-weight: 500;
                color: #0d4a96;
                color: #fff;
            }

            .user-avatar {
                width: 0.98rem;
                height: 0.98rem;
                background-size: contain;
                background-repeat: no-repeat;
                margin-left: 0.2rem;
                border-radius: 50%;

                img {
                    width: 0.98rem;
                    height: 0.98rem;
                }
            }

            .user-info {
                width: 2.5rem;
                font-size: 0.24rem;
                font-weight: 500;
                color: #ffffff;
                margin-left: 0.18rem;
            }

            .user-value {
                width: 1.6rem;
                font-size: 0.26rem;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #ffffff;
                text-align: right;

                img {
                    width: 0.26rem;
                    height: 0.26rem;
                    vertical-align: middle;
                }
            }
        }
    }

    .flex-box {
        display: flex;
        justify-content: center;
        align-items: center;

        .rule-container {
            width: 6.28rem;
            height: 10.84rem;
            background-image: url(https://yaame-static.yaame.io/admin/612ee6466c40dfff237567b2eb9d0cc2.png);
            background-repeat: no-repeat;
            background-size: 6.28rem auto;
            position: relative;
            padding-top: 0.94rem;

            .rule-div {
                width: 6.28rem;
                height: 9.6rem;
                padding: 0 0.24rem 0;
                overflow-y: scroll;
            }

            p {
                font-size: 0.24rem;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #ffffff;
            }

            .rule-gift {
                width: 5.8rem;
                height: 2.8rem;
                background: #3d84e3;
                border-radius: 0.2rem;
                position: relative;
                padding: 0.82rem 0.18rem 0.24rem;
                display: flex;
                justify-content: space-between;
                margin-top: 0.24rem;
                margin-bottom: 0.24rem;

                .event-gift-item {
                    width: 1.3rem;
                    height: 1.74em;

                    .img-container {
                        width: 1.3rem;
                        height: 1.3rem;
                        background: #2433a5;
                        border-radius: 0.16rem;
                        border: 0.01rem solid #fefa85;
                        position: relative;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .img-price {
                            position: absolute;
                            padding: 0 0.06rem;
                            top: 0;
                            right: 0;
                            height: 0.26rem;
                            line-height: 0.26rem;
                            background: #fefa85;
                            border-radius: 0px 0.15rem 0px 0.13rem;
                            font-size: 0.24rem;
                            font-weight: 500;
                            color: #a84118;

                            img {
                                width: 0.24rem;
                                height: 0.24rem;
                                vertical-align: middle;
                            }

                            p {
                                display: inline-block;
                                transform: scale(0.9333);
                                color: #a84118;
                            }
                        }

                        img {
                            width: 0.98rem;
                            height: 0.98rem;
                        }
                    }

                    .gift-name {
                        text-align: center;
                        font-size: 0.24rem;
                        font-weight: 500;
                        color: #fdf5b4;
                        margin-top: 0.12rem;
                    }
                }
                .event-gift-title {
                    display: inline-block;
                    position: absolute;
                    height: 0.38rem;
                    line-height: 0.38rem;
                    font-size: 0.28rem;
                    color: #FDF5B4;
                    text-align: center;
                    top: 0.24rem;
                    left: 50%;
                    transform: translateX(-50%);
                    &::after {
                        content: '';
                        display: inline-block;
                        width: 0.22rem;
                        height: 0.16rem;
                        position: absolute;
                        top: 0.14rem;
                        left: -0.36rem;
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-image: url(https://yaame-static.yaame.io/admin/bb4c197c26395adddeaca0d1e629d3ea.png);
                    }
                    &::before {
                        content: '';
                        display: inline-block;
                        width: 0.22rem;
                        height: 0.16rem;
                        position: absolute;
                        top: 0.14rem;
                        right: -0.36rem;
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-image: url(https://yaame-static.yaame.io/admin/1409fb2648491db0056ba821737a2792.png);
                    }
                }
            }

            .rule-table {
                width: 5.8rem;
                height: 3.6rem;
                border-radius: 0.2rem;
                border: 0.01rem solid rgba(255, 255, 255, 0.2);
                margin-bottom: 0.24rem;
                margin-top: 0.24rem;
                color: #fff;
                font-size: 0.24rem;
                overflow: hidden;

                .table-header {
                    width: 5.8rem;
                    height: 0.6rem;
                    background-color: rgba(255, 255, 255, 0.2);
                    display: flex;
                    line-height: 0.6rem;

                    div {
                        &:nth-child(1) {
                            width: 2.99rem;
                            text-align: center;
                            border-right: 0.01rem solid rgba(255, 255, 255, 0.1);
                            border-top-left-radius: 0.2rem;
                        }

                        &:nth-child(2) {
                            width: 2.79rem;
                            text-align: center;
                            border-top-right-radius: 0.2rem;
                        }
                    }
                }
            }
        }

        .container-header {
            left: 0.95rem;
        }

        .close-img {
            width: 0.6rem;
            height: 0.6rem;
            position: absolute;
            bottom: -1rem;
            left: 2.84rem;
        }

        .view-rewards-container {
            width: 6.28rem;
            background-size: contain;
            background-repeat: no-repeat;
            position: relative;

            &.length-3,
            &.length-4 {
                height: 5.6rem;
                background-image: url(https://yaame-static.yaame.io/admin/10e3e8e878deb15ae7aefcb7a922a967.png);
                padding: 0.94rem 0.32rem 0;
            }

            &.length-5 {
                height: 7.12rem;
                padding: 0.94rem 0.32rem 0;
                background-image: url(https://yaame-static.yaame.io/admin/e5721814986731ee88bb6d24318ec81e.png);
            }

            .gift-container {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;

                .gift-item {
                    width: 2.64rem;
                    height: 2.04rem;
                    background: #2433a5;
                    border-radius: 0.16rem;
                    border: 0.01rem solid #fefa85;
                    margin-bottom: 0.16rem;
                    position: relative;

                    img {
                        width: 1.28rem;
                        height: 1.28rem;
                        position: absolute;
                        top: 0.24rem;
                        left: 0.68rem;
                    }

                    .gift-name {
                        width: 2.64rem;
                        font-size: 0.24rem;
                        position: absolute;
                        left: 0;
                        top: 1.6rem;
                        font-family: SFProDisplay-Regular, SFProDisplay;
                        font-weight: 400;
                        color: #fdf5b4;
                        text-align: center;
                    }

                    .gift-price {
                        display: inline-block;
                        padding: 0 0.1rem;
                        height: 0.26rem;
                        text-align: center;
                        line-height: 0.26rem;
                        background: #fefa85;
                        border-radius: 0px 0.15rem 0px 0.13rem;
                        font-size: 0.22rem;
                        font-family: SFProDisplay-Medium, SFProDisplay;
                        font-weight: 500;
                        color: #a84118;
                        position: absolute;
                        right: 0;
                        top: 0;
                    }
                }
            }

            .big-gift {
                margin-left: 0.1rem;
                width: 5.44rem;
                height: 1.36rem;
                background: #2433a5;
                border-radius: 0.16rem;
                border: 0.01rem solid #fefa85;
                position: relative;
                margin-bottom: 0.16rem;

                img {
                    position: absolute;
                    width: 3.5rem;
                    height: 0.6rem;
                    top: 0.24rem;
                    left: 0.97rem;
                }

                .gift-name {
                    width: 5.44rem;
                    font-size: 0.24rem;
                    position: absolute;
                    left: 0;
                    top: 0.92rem;
                    font-family: SFProDisplay-Regular, SFProDisplay;
                    font-weight: 400;
                    color: #fdf5b4;
                    text-align: center;
                }

                .gift-price {
                    display: inline-block;
                    padding: 0 0.1rem;
                    height: 0.26rem;
                    text-align: center;
                    line-height: 0.26rem;
                    background: #fefa85;
                    border-radius: 0px 0.15rem 0px 0.13rem;
                    font-size: 0.22rem;
                    font-family: SFProDisplay-Medium, SFProDisplay;
                    font-weight: 500;
                    color: #a84118;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }
        }
    }
}
</style>

