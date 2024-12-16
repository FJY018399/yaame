<template>
    <div
        :style="{ 'padding-bottom': '1.9rem' }"
        :class="['main', language]"
    >

        <Header color="white">Puncak Kompetisi</Header>
        <pageLoading v-if="pageLoading"></pageLoading>

        <div class="rule" @click="ruleVisible = true;">Rules</div>
        <div class="rule rewards" @click="toReward">Hadiah</div>

        <div class="gift-container">
            <div class="top-img"></div>

            <p class="header-p">Hadiah event</p>


            <div class="gift-content">
                <div class="gift-info">
                    Kirim/ terima hadiah dibawah selama periode event akan masuk daftar rank
                </div>
                <div class="gift-list">
                    <div v-for="(item, index) in gift_config_item_vo_list" :key="index" class="gift-item">
                        <div class="img-container">
                            <img :src="item.icon" alt="">
                        </div>
                        <p class="gift-name">{{ item.gift_name }}</p>
                        <p class="gift-price">
                            <img src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                            {{ item.diamond_worth }}</p>
                    </div>
                </div>
            </div>
            <div class="bottom-img"></div>
        </div>

        <div class="tab-container">
            <div v-for="(item, index) in tabList" :key="index" :class="['tab-item', tabActive === index && 'active']"
                 @click="handleTabClick(index)"
            >
                {{ item.name }}
            </div>
        </div>

        <template v-if="listShow ">

            <div v-if="rankStatus === 2" class="timeout-container">
                <div>{{ timeInfo.dayLeft }}</div>
                <div>{{ timeInfo.dayRight }}</div>
                <div>{{ timeInfo.hours }}</div>
                <div>{{ timeInfo.minutes }}</div>
                <div>{{ timeInfo.seconds }}</div>
            </div>

            <div v-else class="time-text-container">
                {{ i18nKey }}
            </div>

            <div class="list-tab">
                <div v-for="(item, index) in listTabList" :key="index"
                    :class="['tab-item', listTabActive === index && 'active']" @click="handleListTabClick(index)"
                >
                    {{ item.name }}
                </div>
            </div>

            <template v-if="listTabActive === 2">
                <div v-if="roomList && roomList.length > 0" class="room-list">
                    <div v-for="(item, index) in roomList" :key="index" :class="['list-item', 'sort-' + index]" @click="toDetails(item)">
                        <div class="room-avatar">
                            <img :src="item.subject_icon" alt="">
                        </div>
                        <p class="room-name no-wrap">
                            {{ item.subject_name }}
                        </p>
                        <div class="room-icon">
                           <img src="https://yaame-static.yaame.io/admin/610c8c36e84a40569f6510903655647f.png" alt="">{{ item.member_cnt }}
                        </div>
                        <div v-if="item.subject_score" class="room-value">
                            <img src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                            {{ item.subject_score }}
                        </div>
                        <img v-if="item.live_status === 1" class="room-live"
                             src="https://yaame-static.yaame.io/admin/f059bc2d6effedea8acd073fd2c32b13.png"
                             alt=""
                        >
                        <div class="room-rank">TOP {{ item.subject_rank }}</div>
                    </div>
                </div>
                <div v-else class="empty-div flex-container">
                    <div class="content">
                        <img src="https://yaame-static.yaame.io/admin/6465265377f6ed89c4305a5db974b702.png" alt="">
                        <p>Sementara tidak ada di peringkat</p>
                    </div>
                </div>

                <div v-if="roomMyRank" class="room-user-info">
                    <p class="room-name no-wrap">
                        {{ roomMyRank.subject_name }}
                    </p>
                    <div v-if="roomMyRank.subject_score" class="room-value">
                        <img v-if="roomMyRank.show_text === 0" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                        {{ roomMyRank.subject_score }}
                    </div>
                    <div v-else class="room-value">
                        -
                    </div>
                    <div v-if="roomMyRank.subject_rank" class="room-rank">{{ computedUserRank }}</div>
                    <div v-else class="room-rank">--</div>
                </div>
            </template>

            <template v-else>
                <div v-show="topList && topList.length > 0" class="top-list">
                    <div v-for="(item, index) in topList" :key="index" :class="['top' + index]" @click="toDetails(item)">
                        <div class="avatar-container">
                            <img v-if="index === 0" class="avatar-dress"
                                 src="https://yaame-static.yaame.io/admin/1a3368dbe255b6af3c8fc6b48e42e5bd.png" alt=""
                            >
                            <img v-else-if="index === 1" class="avatar-dress"
                                 src="https://yaame-static.yaame.io/admin/e5cce5f73fec1fd55d279f24ce1bf294.png" alt=""
                            >
                            <img v-else-if="index === 2" class="avatar-dress"
                                 src="https://yaame-static.yaame.io/admin/313b95c34c10d37d54e013f059101553.png" alt=""
                            >

                            <img class="user-avatar" :src="item.subject_icon" alt="">
                        </div>

                        <p class="user-rank">TOP {{ item.subject_rank }}</p>
                        <p class="user-name no-wrap">{{ item.subject_name }}</p>
                        <p class="user-id no-wrap">ID: {{ item.peanut_id }}</p>
                        <p v-if="item.subject_score" class="user-value">
                            <img src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                            {{ item.subject_score }}
                        </p>
                    </div>
                </div>
                <div class="list">
                    <div v-for="(item, index) in list" :key="index" class="list-item" @click="toDetails(item)">
                        <div class="sort">{{ item.subject_rank }}</div>
                        <div :style="{ 'background-image': `url(${item.subject_icon})` }" class="user-avatar">
                            <img src="https://yaame-static.yaame.io/admin/72403099746f76fc113e71e8ad0687b5.png" alt="">
                        </div>
                        <div class="user-name no-wrap">{{ item.subject_name }}</div>
                        <div v-if="item.subject_score" class="user-value">
                            <img src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                            {{ item.subject_score }}
                        </div>
                    </div>
                </div>

                <div v-if="topList.length === 0" class="empty-div flex-container">
                    <div class="content">
                        <img src="https://yaame-static.yaame.io/admin/6465265377f6ed89c4305a5db974b702.png" alt="">
                        <p>Sementara tidak ada di peringkat</p>
                    </div>
                </div>

                <div class="user-info">
                    <div v-if="myRank.subject_rank" class="sort">
                        {{ computedUserRank }}
                    </div>
                    <div v-else class="sort">
                        --
                    </div>
                    <div :style="{ 'background-image': `url(${ myRank.subject_icon })` }" class="user-avatar">
                        <img src="https://yaame-static.yaame.io/admin/72403099746f76fc113e71e8ad0687b5.png" alt="">
                    </div>
                    <div class="user-name no-wrap">{{ myRank.subject_name }}</div>
                    <div v-if="myRank.subject_score" class="user-value">
                        <img v-if="myRank.show_text === 0" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                        {{ myRank.subject_score }}
                    </div>
                    <div v-else class="user-value">
                        -
                    </div>
                </div>
            </template>
        </template>
        <div v-else class="empty-div flex-container">
            <div class="content">
                <img src="https://yaame-static.yaame.io/admin/6465265377f6ed89c4305a5db974b702.png" alt="">
                <p>Event belum dimulai</p>
            </div>
        </div>

        <popup v-show="ruleVisible" class="flex-container">
            <div class="rule-container">
                <div class="rule-header">Rules</div>
                <div :class="['rule-content', language]">
                    <p>Waktu event</p>
                    <p>1. R1 (Penyisihan): 3 hari (15/01 00:00:00 hingga 17/01 24:00:00) (UTC)</p>
                    <p>2. R2 (Perempat final): 2 hari (18/01 00:00:00 hingga 19/01 24:00:00) (UTC)</p>
                    <p>3. R3 (Semifinal): 2 hari (20/01 00:00:00 hingga 21/01 24:00:00) (UTC)</p>
                    <p>4. Final: 2 hari (22/01 00:00:00 hingga 23/01 24:00:00) (UTC)</p>
                    <p>Deskripsi Event</p>
                    <p>1. Kompetisi dibagi menjadi babak R1 (penyisihan), R2 (perempat final), R3 (semi final) dan final.</p>
                    <p>2. Rank Spender: pengguna bisa mendapatkan poin peringkat dengan mengirimkan hadiah event, 1 berlian = 1 poin</p>
                    <p>3. Rank Star: pengguna bisa mendapatkan poin peringkat saat menerima hadiah event, 1 berlian = 1 poin</p>
                    <p>4. Rank Agency: Total Anggota Agency menerima poin peringkat saat menerima hadiah acara, 1 berlian = 1 poin</p>
                    <p>5. Hadiah event akan dikirim dalam waktu 3 hari kerja setelah kompetisi berakhir, dan hadiah peringkat room akan dibagikan kepada pemilik ruangan.</p>
                    <p>6. Silakan periksa hadiah acara di halaman detail hadiah</p>
                    <p>Aturan Kelolosan</p>
                    <p>Rank Spender</p>
                    <p>1. Kirim hadiah event untuk masuk babak penyisihan</p>
                    <p>2. 100 teratas di babak penyisihan dan poinnya mencapai 5000 dapat memasuki perempat final</p>
                    <p>3. 50 teratas di perempat final dan dengan poin 50.000 dapat melaju ke semi final</p>
                    <p>4. 20 teratas di semifinal dan poinnya mencapai 200.000 dapat masuk ke final</p>
                    <p>5. 3 teratas di final dan poinnya mencapai 600.000 akan menerima hadiah</p>
                    <p>Rank Star</p>
                    <p>1. Setelah menerima hadiah event, kamu bisa masuk ke daftar awal.</p>
                    <p>2. 100 teratas di babak penyisihan dan poinnya mencapai 10.000 dapat masuk ke perempat final</p>
                    <p>3. 50 teratas di perempat final dan dengan poin 200.000 dapat melaju ke semi final</p>
                    <p>4. 20 teratas di semifinal dan poinnya mencapai 500.000 dapat masuk ke final</p>
                    <p>5. 3 teratas di final dan poinnya mencapai 800.000 akan menerima hadiah</p>
                    <p>Rank Agency</p>
                    <p>1. Semua Agency dapat masuk dalam daftar penyisihan</p>
                    <p>2. 100 teratas di babak penyisihan dan poinnya mencapai 30.000 melaju ke perempat final</p>
                    <p>3. 50 teratas di perempat final dan dengan poin 250.000 dapat melaju ke semi final</p>
                    <p>4. 20 teratas di semifinal dan dengan poin 550.000 dapat melaju ke final</p>
                    <p>5. 3 teratas di final dan poinnya mencapai 1.500.000 akan menerima hadiah</p>
                </div>

                <img class="close-icon" src="https://yaame-static.yaame.io/admin/9f4b72ad7e28fcc87a2ed19d13b4b473.png"
                     @click="ruleVisible = false"
                >
            </div>
        </popup>


    </div>
</template>

<script>
    import {
        computed,
        onMounted,
        ref,
        getCurrentInstance, onBeforeUnmount,
    } from "vue";
    import { getLanguage, getSafeHeight } from "@/lib/device";
    import pageLoading from "@/components/common/page_loading.vue";
    import popup from '@/components/common/pop_up.vue';
    import { getInfoAPI, getRankAPI } from '../api';
    import Header from '@/components/common/header.vue';
    import Toast from '../../../components/third/toast/toast';

    // 初赛开始时间 =>  utc时区 20223 12.29 00:00:00
    let PRELIMINARY_START_TIME = new Date(Date.UTC(2024, 0, 9)).getTime();
    // 初赛结束时间 =>  utc时区 2024 01.02 23:59:59
    let PRELIMINARY_END_TIME = new Date(Date.UTC(2024, 0, 17, 23, 59, 59)).getTime();
    // 复赛开始时间 =>  utc时区 2024 01.03 00:00:00
    let QUARTERFINAL_START_TIME = new Date(Date.UTC(2024, 0, 18)).getTime();
    // 复赛结束时间 =>  utc时区 2024 01.05 23:59:59
    let QUARTERFINAL_END_TIME = new Date(Date.UTC(2024, 0, 19, 23, 59, 59)).getTime();
    // 半决赛开始时间 =>  utc时区 2024 01.06 00:00:00
    let SEMIFINAL_START_TIME = new Date(Date.UTC(2024, 0, 20)).getTime();
    // 半决赛结束时间 =>  utc时区 2024 01.07 23:59:59
    let SEMIFINAL_END_TIME = new Date(Date.UTC(2024, 0, 21, 23, 59, 59)).getTime();
    // 决赛开始时间 =>  utc时区 2024 01.09 00:00:00
    let FINAL_START_TIME = new Date(Date.UTC(2024, 0, 22)).getTime();
    // 决赛结束时间 =>  utc时区 2024 01.10 00:00:00
    let FINAL_END_TIME = new Date(Date.UTC(2024, 0, 23, 23, 59, 59)).getTime();
    export default {
        components: {
            pageLoading,
            popup,
            Header
        },
        setup() {
            const root = getCurrentInstance();
            const router = root.proxy.$router;
            const t = (val) => {
                return root.proxy.$i18n.t(val);
            };
            // 获取国家
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

            let safeHeight = ref(0);
            let safeArea = getSafeHeight() || 0;
            safeHeight.value = (safeArea * 2) / 100;

            let pageLoading = ref(true);

            let tabList = ref([
                {
                    name: 'R1',
                    value: 'PRELIMINARY'
                },
                {
                    name: 'R2',
                    value: 'QUARTERFINAL'
                },
                {
                    name: 'R3',
                    value: 'SEMIFINAL'
                },
                {
                    name: 'Final',
                    value: 'FINAL'
                }
            ]);

            let tabActive = ref(0);
            const handleTabClick = (index) => {
                tabActive.value = index;
                getRank();
            };

            let listTabList = ref([
                {
                    name: 'Spender',
                },
                {
                    name: 'Star',
                },
                {
                    name: 'Agency',
                },
            ]);

            let listTabActive = ref(0);
            const handleListTabClick = (index) => {
                listTabActive.value = index;
                getRank();
            };

            let timeoutVisible = ref(true);

            let ruleVisible = ref(false);
            let rewardVisible = ref(false);

            let gift_config_item_vo_list = ref([]);


            let current_pk_type = ref('PRELIMINARY');

            let isFirst = true;
            const getData = async () => {
                let res = await getInfoAPI();
                if (res.status !== 1000) return;
                gift_config_item_vo_list.value = res.data.gift_config_items;
                pageLoading.value = false;

                if (res.data.current_pk_type) {
                    current_pk_type.value = res.data.current_pk_type;
                } else {
                    if (new Date().getTime() < PRELIMINARY_START_TIME) {
                        current_pk_type.value = 'PRELIMINARY';
                    } else if (new Date().getTime() > FINAL_START_TIME) {
                        current_pk_type.value = 'FINAL';
                    } else {
                        current_pk_type.value = 'FINAL';
                    }
                }

                if (isFirst) {
                    isFirst = false;
                    tabActive.value = tabList.value.findIndex(item => item.value === current_pk_type.value);
                }

            };




            let myRank = ref(false);
            let topList = ref([]);
            let list = ref([]);

            let roomMyRank = ref(false);
            let roomList = ref([]);

            let listShow = ref(true);

            let rankStatus = ref(0);

            
            const getRank = async () => {
                let pkTypeEnum = {
                    0: 'PRELIMINARY',
                    1: 'QUARTERFINAL',
                    2: 'SEMIFINAL',
                    3: 'FINAL',
                };
                let pkRankTypeEnum = {
                    0: 'SEND_GIFT',
                    1: 'RECEIVE_GIFT',
                    2: 'GUILD',
                };
                let params = {
                    peakDuelType: pkTypeEnum[tabActive.value],
                    peakDuelRankType: pkRankTypeEnum[listTabActive.value],
                };
                let res = await getRankAPI(params);
                if (res.status !== 1000) return;

                if (listTabActive.value !== 2) {
                    myRank.value = res.data.my_rank;
                    topList.value = res.data.rank_list_info_items.slice(0, 3);
                    list.value = res.data.rank_list_info_items.slice(3);
                } else {
                    if (res.data.my_rank) {
                        roomMyRank.value = res.data.my_rank;
                    } else {
                        roomMyRank.value = false;
                        // if (tabActive.value === 0) {
                        //     roomMyRank.value = {
                        //         subject_rank: '--',
                        //         subject_icon: '',
                        //         subject_name: '',
                        //         subject_score: '0',
                        //         show_text: 0,
                        //     }
                        // } else {
                        //     roomMyRank.value = {
                        //         subject_rank: '--',
                        //         subject_icon: '',
                        //         subject_name: '',
                        //         subject_score: 'Tidak lolos',
                        //         show_text: 1,
                        //     }
                        // }
                    }
                    
                    roomList.value = res.data.rank_list_info_items;
                }

                listShow.value = res.data.status !== 0;

                rankStatus.value = res.data.status;

                if (res.data.current_pk_type === 'PRELIMINARY') {
                    PRELIMINARY_START_TIME = new Date(res.data.start_time);
                    PRELIMINARY_END_TIME = new Date(res.data.end_time);
                } else if (res.data.current_pk_type === 'QUARTERFINAL') {
                    QUARTERFINAL_START_TIME = new Date(res.data.start_time);
                    QUARTERFINAL_END_TIME = new Date(res.data.end_time);
                } else if (res.data.current_pk_type === 'SEMIFINAL') {
                    SEMIFINAL_START_TIME = new Date(res.data.start_time);
                    SEMIFINAL_END_TIME = new Date(res.data.end_time);
                } else if (res.data.current_pk_type === 'FINAL') {
                    FINAL_START_TIME = new Date(res.data.start_time);
                    FINAL_END_TIME = new Date(res.data.end_time);
                }

                change18nKey();
            };

            let timer = null;

            let timeInfo = ref({
                dayLeft: 0,
                dayRight: "D",
                hours: "00",
                minutes: "00",
                seconds: "00",
            });
            const getCountdown = (target) => {
                // 获取当前时间
                const now = new Date();

                // 计算剩余时间
                const timeDiff = target.getTime() - now.getTime();

                // 确保目标日期在未来
                if (timeDiff <= 0) {
                    timeInfo.value = {
                        dayLeft: '0',
                        dayRight: "D",
                        hours: "00",
                        minutes: "00",
                        seconds: "00",
                    };
                    timeoutVisible.value = false;
                    return;
                }

                // 将时间差转换为自然时间单位
                let days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                let hours = Math.floor(
                    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                );
                let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                // 计算倒计时天数的十位数和个位数
                let dayLeft = Math.floor(days / 10);
                let dayRight = days % 10;

                // 天数不足10，设置个位数为"D"
                if (days < 10) {
                    dayLeft = dayRight;
                    dayRight = "D";
                }

                // 时、分、秒不足10，前面补0
                hours = hours < 10 ? "0" + hours : hours;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;


                timeInfo.value = {
                    dayLeft,
                    dayRight,
                    hours,
                    minutes,
                    seconds
                };
            };
            let i18nKey = ref('');


            const changeInterVal = () => {
                let time = new Date().getTime();
                if (tabActive.value === 0) {
                    if (time < PRELIMINARY_START_TIME) {
                        timeoutVisible.value = false;
                        timeInfo.value = {
                            dayLeft: '0',
                            dayRight: "D",
                            hours: "00",
                            minutes: "00",
                            seconds: "00",
                        };
                    } else if (time > PRELIMINARY_START_TIME && time < PRELIMINARY_END_TIME) {
                        getCountdown(new Date(PRELIMINARY_END_TIME));
                        timeoutVisible.value = true;
                    } else if (time > PRELIMINARY_END_TIME) {
                        timeoutVisible.value = false;
                            timeInfo.value = {
                            dayLeft: '0',
                            dayRight: "D",
                            hours: "00",
                            minutes: "00",
                            seconds: "00",
                        };
                    }
                } else if (tabActive.value === 1) {
                    if (time < QUARTERFINAL_START_TIME) {
                        timeoutVisible.value = false;
                        timeInfo.value = {
                            dayLeft: '0',
                            dayRight: "D",
                            hours: "00",
                            minutes: "00",
                            seconds: "00",
                        };
                    } else if (time > QUARTERFINAL_START_TIME && time < QUARTERFINAL_END_TIME) {
                        getCountdown(new Date(QUARTERFINAL_END_TIME));
                        timeoutVisible.value = true;
                    } else if (time > QUARTERFINAL_END_TIME) {
                        timeoutVisible.value = false;
                        timeInfo.value = {
                            dayLeft: '0',
                            dayRight: "D",
                            hours: "00",
                            minutes: "00",
                            seconds: "00",
                        };
                    }
                } else if (tabActive.value === 2) {
                    if (time < SEMIFINAL_START_TIME) {
                        timeoutVisible.value = false;
                        timeInfo.value = {
                            dayLeft: '0',
                            dayRight: "D",
                            hours: "00",
                            minutes: "00",
                            seconds: "00",
                        };
                    } else if (time > SEMIFINAL_START_TIME && time < SEMIFINAL_END_TIME) {
                        getCountdown(new Date(SEMIFINAL_END_TIME));
                        timeoutVisible.value = true;
                    } else if (time > SEMIFINAL_END_TIME) {
                        timeoutVisible.value = false;
                        timeInfo.value = {
                            dayLeft: '0',
                            dayRight: "D",
                            hours: "00",
                            minutes: "00",
                            seconds: "00",
                        };
                    }
                } else if (tabActive.value === 3) {
                    if (time < FINAL_START_TIME) {
                        timeoutVisible.value = false;
                        timeInfo.value = {
                            dayLeft: '0',
                            dayRight: "D",
                            hours: "00",
                            minutes: "00",
                            seconds: "00",
                        };
                    } else if (time > FINAL_START_TIME && time < FINAL_END_TIME) {
                        getCountdown(new Date(FINAL_END_TIME));
                        timeoutVisible.value = true;
                    } else if (time > FINAL_END_TIME) {
                        timeoutVisible.value = false;
                        timeInfo.value = {
                            dayLeft: '0',
                            dayRight: "D",
                            hours: "00",
                            minutes: "00",
                            seconds: "00",
                        };
                    }
                }
            };

            let rewardTabActive = ref(0);

            const toDetails = (item) => {
                if (listTabActive.value === 2) {
                    if (item.live_status === 1) {
                        location.href = item.scheme_url;
                    }
                } else {
                    if (item.subject_id) {
                        location.href = `wlyaame://trend/user?uid=${item.subject_id}`;
                    }
                }
            };
            
            const change18nKey = () => {
                if (tabActive.value === 0) {
                    i18nKey.value = 'Babak penyisihan sudah berakhir';
                } else if (tabActive.value === 1) {
                    if (rankStatus.value === 0) {
                        i18nKey.value = 'Babak perempat final belum dimulai';
                    } else if (rankStatus.value === 2) {
                        i18nKey.value = 'Babak perempat final sudah berakhir';
                    }  else if (rankStatus.value === 1) {
                        i18nKey.value = 'Babak perempat final sudah berakhir';
                    }
                } else if (tabActive.value === 2) {
                    if (rankStatus.value === 0) {
                        if (new Date().getTime() < FINAL_START_TIME) {
                            i18nKey.value = 'Babak semifinal belum dimulai';
                        } else {
                            i18nKey.value = 'Babak semifinal sudah berakhir';
                        }
                    } else if (rankStatus.value === 2) {
                        i18nKey.value = 'Babak semifinal sudah berakhir';
                    } else if (rankStatus.value === 1) {
                        i18nKey.value = 'Babak semifinal sudah berakhir';
                    } else if (rankStatus.value === 3) {
                        i18nKey.value = 'Babak final belum dimulai';
                    }
                } else if (tabActive.value === 3) {
                    if (rankStatus.value === 0) {
                        i18nKey.value = 'Babak final belum dimulai';
                    } else if (rankStatus.value === 2) {
                        i18nKey.value = 'Babak final sudah berakhir';
                    } else if (rankStatus.value === 1) {
                        i18nKey.value = 'Babak final sudah berakhir';
                    }
                }
            }

            // 改造上面的函数为computed 
            const computedUserRank = computed(() => {
                if (tabActive.value ===  0) {
                    if (listTabActive.value === 0) {
                        if (myRank.value.subject_rank >= 100) {
                            return '99+';
                        } else {
                            return myRank.value.subject_rank;
                        }
                    } else if (listTabActive.value === 1) {
                        if (myRank.value.subject_rank >= 100) {
                            return '99+';
                        } else {
                            return myRank.value.subject_rank;
                        }
                    } else if (listTabActive.value === 2) {
                        if (roomMyRank.value.subject_rank >= 100) {
                            return '99+';
                        } else {
                            return roomMyRank.value.subject_rank;
                        }
                    }
                } else if (tabActive.value ===  1) {
                    if (listTabActive.value === 0) {
                        if (myRank.value.subject_rank > 50) {
                            return '50+';
                        } else {
                            return myRank.value.subject_rank;
                        }
                    } else if (listTabActive.value === 1) {
                        if (myRank.value.subject_rank > 50) {
                            return '50+';
                        } else {
                            return myRank.value.subject_rank;
                        }
                    } else if (listTabActive.value === 2) {
                        if (roomMyRank.value.subject_rank > 50) {
                            return '50+';
                        } else {
                            return roomMyRank.value.subject_rank;
                        }
                    }
                } else if (tabActive.value ===  2) {
                    if (listTabActive.value === 0) {
                        if (myRank.value.subject_rank > 20) {
                            return '20+';
                        } else {
                            return myRank.value.subject_rank;
                        }
                    } else if (listTabActive.value === 1) {
                        if (myRank.value.subject_rank > 20) {
                            return '20+';
                        } else {
                            return myRank.value.subject_rank;
                        }
                    } else if (listTabActive.value === 2) {
                        if (roomMyRank.value.subject_rank > 20) {
                            return '20+';
                        } else {
                            return roomMyRank.value.subject_rank;
                        }
                    }
                } else if (tabActive.value ===  3) {
                    if (listTabActive.value === 0) {
                        if (myRank.value.subject_rank > 10) {
                            return '10+';
                        } else {
                            return myRank.value.subject_rank;
                        }
                    } else if (listTabActive.value === 1) {
                        if (myRank.value.subject_rank > 10) {
                            return '10+';
                        } else {
                            return myRank.value.subject_rank;
                        }
                    } else if (listTabActive.value === 2) {
                        if (roomMyRank.value.subject_rank > 10) {
                            return '10+';
                        } else {
                            return roomMyRank.value.subject_rank;
                        }
                    }    
                }
            });

            const toReward = () => {
                router.push({ name: "reward" })
            }


            onMounted(async () => {
                await getData();
                await getRank();

                changeInterVal();
                timer = setInterval(() => {
                    changeInterVal();
                }, 1000);
            });
            onBeforeUnmount(() => {
                clearInterval(timer);
            });
            return {
                language,
                safeHeight,
                pageLoading,

                tabList,
                tabActive,
                handleTabClick,

                listTabList,
                listTabActive,
                handleListTabClick,

                timeoutVisible,

                ruleVisible,
                rewardVisible,

                gift_config_item_vo_list,

                myRank,
                list,
                topList,

                roomMyRank,
                roomList,

                timeInfo,
                i18nKey,
                listShow,

                rewardTabActive,

                toDetails,

                rankStatus,

                computedUserRank,
                toReward
            };
        },
    };
</script>
<style lang="less" scoped>
.main {
    width: 7.5rem;
    min-height: 100vh;
    background-size: 7.5rem auto;
    background-repeat: no-repeat;
    position: relative;
    font-size: 0.24rem;
    color: #fff;
    padding-top: 6.96rem;
    padding-bottom: 1.9rem;
    background-image: url("https://yaame-static.yaame.io/admin/6c2cd3738cd977046a6ce23515e8c2b1.png");
    .rule {
        width: 1.53rem;
        height: 0.54rem;
        background-image: url(https://yaame-static.yaame.io/admin/6f881906dbd22e7da5482dbf0619882d.png);
        background-size: contain;
        background-repeat: no-repeat;
        line-height: 0.44rem;
        text-align: center;
        font-size: 0.28rem;
        font-weight: normal;
        color: #E8DDBB;
        position: fixed;
        top: 5.61rem;
        right: 0;
        padding-left: 0.3rem;
        z-index: 9;
    }

    .rewards {
        top: 6.42rem;
    }

    .gift-container {
        width: 7rem;
        height: auto;
        position: relative;
        padding-top: 1.12rem;
        padding-bottom: 0.54rem;
        margin-left: 0.44rem;
        .header-p {
            width: 7rem;
            text-align: center;
            font-size: 0.3rem;
            font-weight: normal;
            color: #E8DDBB;
            position: absolute;
            top: 0.4rem;
            left: 0;
        }
        .top-img {
            width: 7rem;
            height: 1.8rem;
            position: absolute;
            top: 0;
            left: 0;
            background-image: url(https://yaame-static.yaame.io/admin/a81b79f20324064bb50d325a96a4d028.png);
            background-size: 7rem auto;
            background-repeat: no-repeat;
        }

        .bottom-img {
            width: 7rem;
            height: 1.19rem;
            position: absolute;
            bottom: 0;
            left: 0;
            background-image: url(https://yaame-static.yaame.io/admin/abf8108b96a06fe461dbcc5cfb8dfa0c.png);
            background-size: 7rem auto;
            background-repeat: no-repeat;
        }

        .gift-content {
            width: 7rem;
            height: auto;
            min-height: 2.5rem;
            background-image: url(https://yaame-static.yaame.io/admin/f7c351cf2f5620e664f326e0bf76188d.png);
            background-size: 7rem auto;
            background-repeat: repeat;
            position: relative;
            z-index: 1;
            .gift-info {
                margin-top: 0.2rem;
                width: 6.1rem;
                margin-left: 0.26rem;
                text-align: center;
                font-size: .22rem;
                font-weight: normal;
                color: #E8DDBB;
                position: relative;
                z-index: 1;
                margin-bottom: 0.27rem;
            }
            .gift-list {
                width: 6.44rem;
                margin-left: 0.28rem;
                height: 2.16rem;
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;

                .gift-item {
                    width: 1.4rem;
                    height: 2.16rem;

                    .img-container {
                        width: 1.4rem;
                        height: 1.51rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-image: url(https://yaame-static.yaame.io/admin/5881f06248be4f450520579b5c444fb8.png);
                        background-size: 1.4rem 1.51rem;
                        background-repeat: no-repeat;

                        img {
                            width: 1.1rem;
                            height: auto;
                        }
                    }

                    .gift-name {
                        width: 1.4rem;
                        text-align: center;
                        font-size: 0.22rem;
                        font-weight: normal;
                        color: #FFFFFF;
                        margin-top: 0.08rem;
                    }

                    .gift-price {
                        width: 1.4rem;
                        text-align: center;
                        font-size: 0.22rem;
                        font-weight: normal;
                        color: #ECD3B3;
                        margin-top: 0.04rem;

                        img {
                            width: 0.22rem;
                            height: auto;
                            vertical-align: middle;
                        }
                    }
                }
            }


        }
    }

    .tab-container {
        width: 7.5rem;
        height: 0.98rem;
        display: flex;
        background-image: url(https://yaame-static.yaame.io/admin/fe59b4d71b0c48d7a5c0468a89bdd102.png);
        background-size: 7.5rem auto;
        background-repeat: no-repeat;
        margin-top: 0.62rem;

        .tab-item {
            flex: 1;
            text-align: center;
            line-height: 0.9rem;
            color: #DECDA9;
            font-size: 0.28rem;

            &.active {
                background-image: url(https://yaame-static.yaame.io/admin/26dbe72519d4d615af54b65a4a935e3d.png);
                background-size: 1.875rem auto;
                background-repeat: no-repeat;
                color: #DECDA9;
            }
        }
    }

    .timeout-container {
        width: 5.31rem;
        height: 1rem;
        margin-top: 0.47rem;
        margin-left: 1.1rem;
        background-image: url("https://yaame-static.yaame.io/admin/235b0c25881ce594ee39220bebdfdbc4.png");
        background-size: 5.31rem auto;
        background-repeat: no-repeat;
        position: relative;

        div {
            text-align: center;
            line-height: 0.56rem;
            font-size: 0.24rem;
            font-weight: normal;
            color: #DECDA9;
            top: 0.22rem;
        }

        div:nth-child(1) {
            width: 0.6rem;
            height: 0.56rem;

            position: absolute;
            left: 0.66rem;

        }

        div:nth-child(2) {
            width: 0.6rem;
            height: 0.56rem;

            position: absolute;
            left: 1.32rem;
        }

        div:nth-child(3) {
            width: 0.68rem;
            height: 0.56rem;

            position: absolute;
            left: 2.12rem;
        }

        div:nth-child(4) {
            width: 0.68rem;
            height: 0.56rem;

            position: absolute;
            left: 3.04rem;
        }

        div:nth-child(5) {
            width: 0.68rem;
            height: 0.56rem;

            position: absolute;
            left: 3.94rem;
        }
    }

    .time-text-container {
        width: 5.93rem;
        height: 1rem;
        margin-top: 0.46rem;
        margin-left: 0.785rem;
        background-image: url(https://yaame-static.yaame.io/admin/8d2de3ae34623bc14ed4864bbd158fde.png);
        background-size: 5.93rem auto;
        background-repeat: no-repeat;
        text-align: center;
        line-height: 1rem;
        font-size: 0.24rem;
        font-weight: normal;
        color: #FFF4AA;
    }

    .list-tab {
        width: 7.5rem;
        height: 0.87rem;
        display: flex;
        margin-top: 0.48rem;
        justify-content: space-between;

        .tab-item {
            width: 2.5rem;
            height: 0.68rem;
            line-height: 0.68rem;
            font-size: 0.34rem;
            text-align: center;
            font-weight: normal;
            color: #E8DDBB;
            background-image: url(https://yaame-static.yaame.io/admin/753a8e208c4d5e6b8f34176010fa75f8.png);
            background-size: 2.5rem auto;
            background-repeat: no-repeat;

            &.active {
                background-image: url(https://yaame-static.yaame.io/admin/42cdeb80aa3a152a5e927b6a2c21f3b8.png);
                margin-top: -0.28rem;
                height: 1rem;
                line-height: 1.2rem;
            }
        }
    }

    .top-list {
        width: 7.5rem;
        position: relative;
        height: 5.5rem;
        .top0 {
            width: 2.25rem;
            height: 3.91rem;
            background-image: url("https://yaame-static.yaame.io/admin/e51ada979306c47f49800af9b042d568.png");
            background-size: 2.25rem auto;
            background-repeat: no-repeat;
            position: absolute;
            top: 0.41rem;
            left: 2.63rem;

            .avatar-container {
                width: 2.12rem;
                height: 2.17rem;
                position: absolute;
                top: -0.04rem;
                left: 0.08rem;

                .user-avatar {
                    width: 1.36rem;
                    height: 1.36rem;
                    border-radius: 50%;
                    position: absolute;
                    top: 0.45rem;
                    left: 0.36rem;
                }

                .avatar-dress {
                    width: 2.12rem;
                    height: 2.17rem;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                }
            }

            .user-rank {
                width: 2.25rem;
                text-align: center;
                position: absolute;
                top: 2.12rem;
                font-size: 0.22rem;
                color: #FFF4AA;
            }

            .user-name {
                width: 2.25rem;
                text-align: center;
                position: absolute;
                top: 2.41rem;
                font-size: 0.24rem;
                color: #FFF4AA;
            }
            .user-id {
                width: 2.25rem;
                text-align: center;
                position: absolute;
                top: 2.7rem;
                font-size: 0.18rem;
                color: #FFF4AA;
            }

            .user-value {
                width: 2.25rem;
                text-align: center;
                position: absolute;
                top: 3.07rem;
                font-size: 0.24rem;
                color: #FFFFFF;

                img {
                    width: 0.22rem;
                    height: auto;
                    vertical-align: middle;

                }
            }
        }

        .top1, .top2 {
            width: 2.25rem;
            height: 3.91rem;
            background-size: 2.25rem auto;
            background-repeat: no-repeat;
            position: absolute;
            top: 1.11rem;

            .avatar-container {
                width: 2.12rem;
                height: 2.17rem;
                position: absolute;
                top: -0.04rem;
                left: 0.08rem;

                .user-avatar {
                    width: 1.36rem;
                    height: 1.36rem;
                    border-radius: 50%;
                    position: absolute;
                    top: 0.45rem;
                    left: 0.36rem;
                }

                .avatar-dress {
                    width: 2.12rem;
                    height: 2.17rem;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 1;
                }
            }

            .user-rank {
                width: 2.25rem;
                text-align: center;
                position: absolute;
                top: 2.12rem;
                font-size: 0.22rem;
                color: #FFF4AA;
            }

            .user-name {
                width: 2.25rem;
                text-align: center;
                position: absolute;
                top: 2.41rem;
                font-size: 0.24rem;
                color: #FFF4AA;
            }
            .user-id {
                width: 2.25rem;
                text-align: center;
                position: absolute;
                top: 2.7rem;
                font-size: 0.18rem;
                color: #FFF4AA;
            }

            .user-value {
                width: 2.25rem;
                text-align: center;
                position: absolute;
                top: 3.07rem;
                font-size: 0.24rem;
                color: #FFFFFF;

                img {
                    width: 0.22rem;
                    height: auto;
                    vertical-align: middle;

                }
            }
        }

        .top1 {
            background-image: url(https://yaame-static.yaame.io/admin/cd153c11482587db29737ac37c78dff5.png);
            left: 0.21rem;
        }

        .top2 {
            background-image: url(https://yaame-static.yaame.io/admin/84086ef3a2cbf31960d72c2c5a4ed317.png);
            right: 0.21rem;
        }
    }

    .list {
        width: 7.5rem;
        min-height: 1.3rem;
        padding-left: 0.13rem;

        .list-item {
            width: 7.24rem;
            height: 1.51rem;
            background-image: url("https://yaame-static.yaame.io/admin/d962d44c7cf2b7d34dfcde58ab1313a8.png");
            background-size: 7.24rem auto;
            background-repeat: no-repeat;
            display: flex;
            margin-bottom: 0.2rem;
            align-items: center;

            .sort {
                width: 0.9rem;
                text-align: center;
                font-size: 0.26rem;
                color: #FFD569;
            }

            .user-avatar {
                width: 1.09rem;
                height: 1.09rem;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-size: contain;
                background-repeat: no-repeat;

                img {
                    width: 1.09rem;
                    height: 1.09rem;
                }
            }

            .user-name {
                width: 3.32rem;
                padding-left: 0.2rem;
                font-size: 0.24rem;
                font-weight: normal;
                color: #ECD3B3;
            }

            .user-value {
                flex: 1;
                color: #ECD3B3;
                img {
                    width: 0.22rem;
                    height: auto;
                    vertical-align: middle;
                }
            }
        }
    }

    .user-info {
        width: 7.5rem;
        height: 1.95rem;
        background-image: url(https://yaame-static.yaame.io/admin/92907fb38cd3922fe5cf3a717bf5270d.png);
        background-size: 7.5rem auto;
        background-repeat: no-repeat;
        position: fixed;
        bottom: 0;
        left: 0;
        padding: 0.8rem 0.13rem 0.48rem 0.13rem;
        display: flex;
        align-items: center;
        z-index: 10;
        color: #ECD3B3;
        .sort {
            width: 0.9rem;
            text-align: center;
            font-size: 0.26rem;
        }

        .user-avatar {
            width: 1.09rem;
            height: 1.09rem;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            background-size: contain;
            background-repeat: no-repeat;
            position: relative;
            img {
                width: 1.09rem;
                height: 1.13rem;
                position: absolute;
                left: 0;
                top: -0.02rem;
            }
        }

        .user-name {
            width: 3.32rem;
            padding-left: 0.2rem;
            font-size: 0.24rem;
            font-weight: normal;
        }

        .user-value {
            flex: 1;

            img {
                width: 0.22rem;
                height: auto;
                vertical-align: middle;
            }
        }
    }

    .room-list {
        width: 7.5rem;
        min-height: 5.3rem;
        padding-left: 0.14rem;
        margin-top: 0.5rem;

        .list-item {
            width: 7.22rem;
            height: 2.17rem;
            background-image: url(https://yaame-static.yaame.io/admin/af4faa5e380654b81b72f63c15c8e531.png);
            background-size: 7.22rem auto;
            background-repeat: no-repeat;
            display: flex;
            margin-bottom: 0.24rem;
            align-items: center;
            padding-left: 0.47rem;
            position: relative;

            &.sort-0 {
                height: 2.43rem;
                background-image: url(https://yaame-static.yaame.io/admin/9811c685135b4cad03aaa664bcb3039c.png);
                padding-top: 0.26rem;
                .room-avatar {
                    background-image: url(https://yaame-static.yaame.io/admin/2632c6879e6d2bc66466012646b12d6d.png);
                }

                .room-rank {
                    color: #904104;
                    top: 0.44rem;
                }
                .room-name {
                    top: 0.94rem;
                }
                .room-icon {
                    top: 1.48rem;
                }
            }

            &.sort-1 {
                height: 2.43rem;
                background-image: url(https://yaame-static.yaame.io/admin/2e43266366401b40d91417a63c9c5395.png);
                padding-top: 0.26rem;
                .room-avatar {
                    background-image: url(https://yaame-static.yaame.io/admin/999f3fefe1f07228d848ce593e9ecea5.png);
                }

                .room-rank {
                    color: #314D61;
                    top: 0.44rem;
                }
                .room-name {
                    top: 0.94rem;
                }
                .room-icon {
                    top: 1.48rem;
                }
            }

            &.sort-2 {
                height: 2.43rem;
                background-image: url(https://yaame-static.yaame.io/admin/164700c889f34a71d26b1ced05e291d1.png);
                padding-top: 0.26rem;
                .room-avatar {
                    background-image: url(https://yaame-static.yaame.io/admin/1ba750110d9b9c51d1352568be3a635b.png);
                }

                .room-rank {
                    color: #904104;
                    top: 0.44rem;
                }
                .room-name {
                    top: 0.94rem;
                }
                .room-icon {
                    top: 1.48rem;
                }
            }

            .room-avatar {
                width: 1.4rem;
                height: 1.4rem;
                background-image: url(https://yaame-static.yaame.io/admin/a5cf13bfba8a5a752f03c3f0b642d182.png);
                background-size: 1.4rem auto;
                background-repeat: no-repeat;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    display: block;
                    width: 1.3rem;
                    height: 1.3rem;
                    border-radius: 0.14rem;
                }
            }

            .room-name {
                width: 3.1rem;
                position: absolute;
                left: 2.38rem;
                top: 0.66rem;
                font-size: 0.34rem;
                font-weight: normal;
                color: #FFFFFF;
            }

            .room-icon {
                width: 3.1rem;
                position: absolute;
                left: 2.38rem;
                top: 1.2rem;
                display: flex;
                flex-wrap: nowrap;

                img {
                    width: auto;
                    height: 0.3rem;
                    margin-right: 0.1rem;
                }
                span {
                    width: 2.38rem;
                    display: inline-block;
                }
            }

            .room-value {
                width: 1.8rem;
                position: absolute;
                left: 5.5rem;
                top: 0.98rem;
                font-size: 0.24rem;
                font-weight: normal;
                color: #FFFFFF;

                img {
                    width: 0.22rem;
                    height: auto;
                    vertical-align: middle;
                }
            }

            .room-live {
                width: 0.8rem;
                height: 0.28rem;
                position: absolute;
                left: 6.35rem;
                top: 1.81rem;
            }

            .room-rank {
                width: 0.9rem;
                text-align: center;
                color: #202348;
                position: absolute;
                left: 6rem;
                top: 0.16rem;
            }
        }
    }

    .room-user-info {
        width: 7.46rem;
        height: 1.95rem;
        background-image: url(https://yaame-static.yaame.io/admin/92907fb38cd3922fe5cf3a717bf5270d.png);
        background-size: 7.46rem auto;
        background-repeat: no-repeat;
        position: fixed;
        bottom: 0;
        left: 0.02rem;
        padding: 0.97rem 0 0.46rem 0.52rem;
        display: flex;
        align-items: center;
        z-index: 10;

        .room-name {
            width: 3.1rem;
            position: absolute;
            left: 2.36rem;
            font-size: 0.34rem;
            font-weight: normal;
            color: #FFFFFF;
            top: 0.9rem;
        }

        .room-icon {
            width: 3.1rem;
            position: absolute;
            left: 2.38rem;
            top: 1.29rem;
            display: flex;
            flex-wrap: nowrap;

            img {
                width: auto;
                height: 0.3rem;
            }
        }

        .room-value {
            width: 1.8rem;
            position: absolute;
            left: 5.5rem;
            top: 0.97rem;
            font-size: 0.24rem;
            font-weight: normal;
            color: #FFFFFF;

            img {
                width: 0.22rem;
                height: auto;
                vertical-align: middle;
            }
        }

        .room-live {
            width: 0.8rem;
            height: 0.28rem;
            position: absolute;
            left: 6.35rem;
            top: 1.81rem;
        }

        .room-rank {
            width: 1.2rem;
            text-align: center;
            position: absolute;
            left: 0.86rem;
            top: 0.97rem;
        }
    }

    .flex-container {
        display: flex;
        justify-content: center;
        align-items: center;

        .rule-container {
            width: 7rem;
            height: 11.11rem;
            background-image: url(https://yaame-static.yaame.io/admin/8e1f8215d821a79ce7a0f9d31326eece.png);
            background-size: 7rem auto;
            background-repeat: no-repeat;
            padding-top: 1.35rem;
            position: relative;

            .rule-header {
                width: 7rem;
                height: 0.34rem;
                position: absolute;
                top: 0.48rem;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.34rem;
                font-weight: normal;
                color: #E8DDBB;
            }

            .rule-content {
                width: 6.3rem;
                height: 8.9rem;
                overflow-x: hidden;
                overflow-y: scroll;
                font-size: 0.26rem;
                margin-left: 0.54rem;
                color: #FFFFFF;
                &.ar {
                    text-align: right;
                }
            }

            .close-icon {
                width: 0.7rem;
                height: 0.7rem;
                position: absolute;
                bottom: -1rem;
                right: 50%;
                transform: translateX(50%);
            }
        }
    }

    .empty-div {
        width: 7.5rem;
        height: 6.86rem;

        .content {
            width: 2.1rem;
            font-size: 0.24rem;
            color: #E8DDBB;
            letter-spacing: 0;
            text-align: center;

            img {
                width: 0.84rem;
                height: auto;
                margin-bottom: 0.1rem;
            }
        }
    }
}
</style>
