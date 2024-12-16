<template>
    <div
        :style="{ 'padding-bottom': listTabActive === 2 ? '2.7rem' : '1.9rem' }"
        :class="['main', language]"
    >

        <Header color="white">{{ $t('winGoldBar') }}</Header>
        <pageLoading v-if="pageLoading"></pageLoading>

        <div class="rule" @click="ruleVisible = true;">{{ $t('rules') }}</div>
        <div class="rule rewards" @click="rewardVisible = true; rewardTabActive = 0;">{{ $t('rewards') }}</div>

        <div class="gift-container">
            <div class="top-img"></div>

            <p class="header-p">{{ $t('eventGifts') }}</p>
            <div class="gift-content">
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
                <div class="gift-info">
                    {{ $t('sendAnyGift') }}
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
                {{ $t(i18nKey) }}
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
                            <img :src="item.country_icon" alt="">

                            <img v-if="item.room_family && item.room_family.level_badge" :src="item.room_family.level_badge" alt="">

                            <span v-if="item.room_family && item.room_family.name" class="no-wrap">{{ item.room_family.name }}</span>
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
                        <img src="https://yaame-static.yaame.io/admin/9d7df06c0510199537c564ddb3223757.png" alt="">
                        <p>{{ $t('noLeaderboard') }}</p>
                    </div>
                </div>

                <div v-if="roomMyRank" class="room-user-info">
                    <p class="room-name no-wrap">
                        {{ $t('myRoom') }}
                    </p>
                    <div v-if="roomMyRank.country_icon" class="room-icon">
                            <img :src="roomMyRank.country_icon" alt="">

                            <img v-if="roomMyRank.room_family && roomMyRank.room_family.level_badge" :src="roomMyRank.room_family.level_badge" alt="">

                            <span v-if="roomMyRank.room_family && roomMyRank.room_family.name" class="no-wrap">{{ roomMyRank.room_family.name }}</span>
                        </div>
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
                                 src="https://yaame-static.yaame.io/admin/049a55d906b4917a8f22347ec654234e.png" alt=""
                            >
                            <img v-else-if="index === 1" class="avatar-dress"
                                 src="https://yaame-static.yaame.io/admin/73b82ecc89c95714c3b2fd048d9a19e1.png" alt=""
                            >
                            <img v-else-if="index === 2" class="avatar-dress"
                                 src="https://yaame-static.yaame.io/admin/5b2203438fbc9e9f814a878fa9c9028f.png" alt=""
                            >

                            <img class="user-avatar" :src="item.subject_icon" alt="">
                        </div>

                        <p class="user-rank">TOP {{ item.subject_rank }}</p>
                        <p class="user-name no-wrap">{{ item.subject_name }}</p>
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
                            <img src="https://yaame-static.yaame.io/admin/04a1c54d9bb797a3650d12fceaef16db.png" alt="">
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
                        <img src="https://yaame-static.yaame.io/admin/9d7df06c0510199537c564ddb3223757.png" alt="">
                        <p>{{ $t('noLeaderboard') }}</p>
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
                        <img src="https://yaame-static.yaame.io/admin/04a1c54d9bb797a3650d12fceaef16db.png" alt="">
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
                <img src="https://yaame-static.yaame.io/admin/9d7df06c0510199537c564ddb3223757.png" alt="">
                <p>{{ $t('activityNoStart') }}</p>
            </div>
        </div>

        <popup v-show="ruleVisible" class="flex-container">
            <div class="rule-container">
                <div class="rule-header">{{ $t('rules') }}</div>
                <div :class="['rule-content', language]">
                    <p>{{ $t('eventDuration') }}</p>
                    <p>{{ $t('prelimDuration') }}</p>
                    <p>{{ $t('semiDuration') }}</p>
                    <p>{{ $t('finalDuration') }}</p>
                    <p>{{ $t('restDuration') }}</p>
                    <p>{{ $t('finalDayDuration') }}</p>
                    <p>{{ $t('eventDetails') }}</p>
                    <p>{{ $t('matchExplanation1') }}</p>
                    <p>{{ $t('matchExplanation2') }}</p>
                    <p>{{ $t('matchExplanation3') }}</p>
                    <p>{{ $t('matchExplanation4') }}</p>
                    <p>{{ $t('matchExplanation5') }}</p>
                    <p>{{ $t('matchExplanation6') }}</p>
                    <p>{{ $t('matchExplanation7') }}</p>
                    <p>{{ $t('matchExplanation8') }}</p>
                    <p>{{ $t('matchExplanation9') }}</p>
                    <p>{{ $t('matchExplanation10') }}</p>
                    <p>{{ $t('rewardDelivery') }}</p>
                    <p>{{ $t('rewardDetails') }}</p>
                    <p>{{ $t('interpretationRights') }}</p>
                </div>

                <img class="close-icon" src="https://yaame-static.yaame.io/admin/9f4b72ad7e28fcc87a2ed19d13b4b473.png"
                     @click="ruleVisible = false"
                >
            </div>
        </popup>

        <popup v-if="rewardVisible" class="flex-container">
            <div class="reward-container">
                <div class="reward-header">{{ $t('rewards') }}</div>
                <div class="list-tab">
                    <div v-for="(item, index) in listTabList" :key="index"
                         :class="['tab-item', rewardTabActive === index && 'active']" @click="rewardTabActive = index"
                    >
                        {{ item.name }}
                    </div>
                </div>

                <div v-show="rewardTabActive === 0" class="gift">
                    <div v-for="(item, index) in reward_gift_items" :key="index">
                        <div v-if="index === 0" class="reward-title reward-0">{{ $t('firstPlace') }}</div>
                        <div v-if="index === 1" class="reward-title reward-1">{{ $t('secondPlace') }}</div>
                        <div v-if="index === 2" class="reward-title reward-2">{{ $t('thirdPlaceIndividual') }}</div>
                        <div v-if="index === 3" class="reward-title reward-3">{{ $t('fourthToTenthRank') }}</div>

                        <div v-if="index === 0" class="flex-content">
                            <div class="long-item">
                                <div class="long-img">
                                    <img src="https://yaame-static.yaame.io/admin/dfb82ffc00bd31e8b0ff062a953872c7.png" alt="">
                                </div>
                                <p class="long-name">{{ $t('goldBar') }}{{ $t('g1') }}</p>
                            </div>

                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>

                            <div class="big-item">
                                <div class="big-img">
                                    <img :src="item.reward_items[3].icon" alt="">
                                </div>
                                <p class="big-name">{{ item.reward_items[3].gift_name }}</p>
                                <p class="big-value">
                                    {{ item.reward_items[3].validity_date }}
                                </p>
                            </div>
                            <div class="big-item">
                                <div class="big-img">
                                    <img src="https://yaame-static.yaame.io/admin/8b10285ce637effe300b6e4c98b8611d.png" alt="">
                                </div>
                                <p class="big-name">{{ $t('bigReward') }}</p>
                                <p class="big-value">
                                    {{ item.reward_items[4].validity_date }}
                                </p>
                            </div>
                        </div>
                        <div v-if="index === 1" class="flex-content">
                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>

                            <div class="big-item">
                                <div class="big-img">
                                    <!-- <img :src="item.reward_items[3].icon" alt=""> -->
                                    <img src="https://yaame-static.yaame.io/admin/ed779ca40ca0f6bd9a661b9d65db0d12.png" alt="">
                                </div>
                                <p class="big-name">{{ $t('littleReward') }}</p>
                                <p class="big-value">
                                    {{ item.reward_items[3].validity_date }}
                                </p>
                            </div>
                        </div>
                        <div v-if="index === 2" class="flex-content">
                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>

                            <div class="big-item">
                                <div class="big-img">
                                    <img src="https://yaame-static.yaame.io/admin/ed779ca40ca0f6bd9a661b9d65db0d12.png" alt="">
                                </div>
                                <p class="big-name">{{ $t('littleReward') }}</p>
                                <p class="big-value">
                                    {{ item.reward_items[3].validity_date }}
                                </p>
                            </div>
                        </div>
                        <div v-if="index === 3" class="flex-content">
                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
                <div v-show="rewardTabActive === 1" class="gift">
                    <div v-for="(item, index) in reward_star_items" :key="index">
                        <div v-if="index === 0" class="reward-title reward-0">{{ $t('firstPlace') }}</div>
                        <div v-if="index === 1" class="reward-title reward-1">{{ $t('secondPlace') }}</div>
                        <div v-if="index === 2" class="reward-title reward-2">{{ $t('thirdPlaceIndividual') }}</div>
                        <div v-if="index === 3" class="reward-title reward-3">{{ $t('fourthToTenthRank') }}</div>

                        <div v-if="index === 0" class="flex-content">
                            <div class="long-item">
                                <div class="long-img">
                                    <img src="https://yaame-static.yaame.io/admin/dfb82ffc00bd31e8b0ff062a953872c7.png" alt="">
                                </div>
                                <p class="long-name">{{ $t('goldBar') }}{{ $t('g1') }}</p>
                            </div>

                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>

                            <div class="big-item">
                                <div class="big-img">
                                    <img :src="item.reward_items[3].icon" alt="">
                                </div>
                                <p class="big-name">{{ item.reward_items[3].gift_name }}</p>
                                <p v-if="item.reward_items[3].diamond_worth" class="big-value">
                                    <img v-if="item.reward_items[3].diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ item.reward_items[3].diamond_worth }}
                                </p>
                                <p v-if="item.reward_items[3].validity_date" class="big-value">
                                    {{ item.reward_items[3].validity_date }}
                                </p>
                            </div>
                            <div class="big-item">
                                <div class="big-img">
                                    <img src="https://yaame-static.yaame.io/admin/8b10285ce637effe300b6e4c98b8611d.png" alt="">
                                </div>
                                <p class="big-name">{{ $t('bigReward') }}</p>
                                <p class="big-value">
                                    {{ item.reward_items[3].validity_date }}
                                </p>
                            </div>
                        </div>
                        <div v-if="index === 1" class="flex-content">
                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>

                            <div class="big-item">
                                <div class="big-img">
                                    <img src="https://yaame-static.yaame.io/admin/ed779ca40ca0f6bd9a661b9d65db0d12.png" alt="">
                                </div>
                                <p class="big-name">{{ $t('littleReward') }}</p>
                                <p v-if="item.reward_items[3].diamond_worth" class="big-value">
                                    <img v-if="item.reward_items[3].diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ item.reward_items[3].diamond_worth }}
                                </p>
                                <p v-if="item.reward_items[3].validity_date" class="big-value">
                                    {{ item.reward_items[3].validity_date }}
                                </p>
                            </div>
                        </div>
                        <div v-if="index === 2" class="flex-content">
                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>

                            <div class="big-item">
                                <div class="big-img">
                                    <img src="https://yaame-static.yaame.io/admin/ed779ca40ca0f6bd9a661b9d65db0d12.png" alt="">
                                </div>
                                <p class="big-name">{{ $t('littleReward') }}</p>
                                <p v-if="item.reward_items[3].diamond_worth" class="big-value">
                                    <img v-if="item.reward_items[3].diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ item.reward_items[3].diamond_worth }}
                                </p>
                                <p v-if="item.reward_items[3].validity_date" class="big-value">
                                    {{ item.reward_items[3].validity_date }}
                                </p>
                            </div>
                        </div>
                        <div v-if="index === 3" class="flex-content">
                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
                <div v-show="rewardTabActive === 2" class="gift">
                    <div v-for="(item, index) in reward_room_items" :key="index">
                        <div v-if="index === 0" class="reward-title reward-0">{{ $t('firstPlace') }}</div>
                        <div v-if="index === 1" class="reward-title reward-1">{{ $t('secondPlace') }}</div>
                        <div v-if="index === 2" class="reward-title reward-2">{{ $t('thirdPlaceIndividual') }}</div>
                        <div v-if="index === 3" class="reward-title reward-3">{{ $t('fourthToTenthRank') }}</div>

                        <div v-if="index === 0" class="flex-content">
                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>

                            <div class="big-item">
                                <div class="big-img">
                                    <img :src="item.reward_items[3].icon" alt="">
                                </div>
                                <p class="big-name">{{ item.reward_items[3].gift_name }}</p>
                                <p v-if="item.reward_items[3].diamond_worth" class="big-value">
                                    <img v-if="item.reward_items[3].diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ item.reward_items[3].diamond_worth }}
                                </p>
                                <p v-if="item.reward_items[3].validity_date" class="big-value">
                                    {{ item.reward_items[3].validity_date }}
                                </p>
                            </div>
                        </div>
                        <div v-if="index === 1" class="flex-content">
                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>

                            <div class="big-item">
                                <div class="big-img">
                                    <img :src="item.reward_items[3].icon" alt="">
                                </div>
                                <p class="big-name">{{ item.reward_items[3].gift_name }}</p>
                                <p v-if="item.reward_items[3].diamond_worth" class="big-value">
                                    <img v-if="item.reward_items[3].diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ item.reward_items[3].diamond_worth }}
                                </p>
                                <p v-if="item.reward_items[3].validity_date" class="big-value">
                                    {{ item.reward_items[3].validity_date }}
                                </p>
                            </div>
                        </div>
                        <div v-if="index === 2" class="flex-content">
                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>

                            <div class="big-item">
                                <div class="big-img">
                                    <img :src="item.reward_items[3].icon" alt="">
                                </div>
                                <p class="big-name">{{ item.reward_items[3].gift_name }}</p>
                                <p v-if="item.reward_items[3].diamond_worth" class="big-value">
                                    <img v-if="item.reward_items[3].diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ item.reward_items[3].diamond_worth }}
                                </p>
                                <p v-if="item.reward_items[3].validity_date" class="big-value">
                                    {{ item.reward_items[3].validity_date }}
                                </p>
                            </div>
                        </div>
                        <div v-if="index === 3" class="flex-content">
                            <div v-for="(ele, inx) in item.reward_items" v-show="inx < 3" :key="inx" class="normal-item">
                                <div class="normal-img">
                                    <img :src="ele.icon" alt="">
                                </div>
                                <p class="normal-name">{{ ele.gift_name }}</p>
                                <p v-if="ele.diamond_worth" class="normal-value">
                                    <img v-if="ele.diamond_worth" src="https://yaame-static.yaame.io/admin/e1238ed805d473066d9081d2b3f0faa9.png" alt="">
                                    {{ ele.diamond_worth }}
                                </p>
                                <p v-if="ele.validity_date" class="normal-value">
                                    {{ ele.validity_date }}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <img class="close-icon" src="https://yaame-static.yaame.io/admin/9f4b72ad7e28fcc87a2ed19d13b4b473.png"
                     @click="rewardVisible = false"
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
    import { getInfoAPI, getGiftInfoAPI, getRankAPI } from '../api';
    import Header from '@/components/common/header.vue';
    import Toast from '../../../components/third/toast/toast';

    // 初赛开始时间 =>  utc时区 20223 12.29 00:00:00
    const PRELIMINARY_START_TIME = new Date(Date.UTC(2023, 11, 29)).getTime();
    // 初赛结束时间 =>  utc时区 2024 01.02 23:59:59
    const PRELIMINARY_END_TIME = new Date(Date.UTC(2024, 0, 2, 23, 59, 59)).getTime();
    // 复赛开始时间 =>  utc时区 2024 01.03 00:00:00
    const QUARTERFINAL_START_TIME = new Date(Date.UTC(2024, 0, 3)).getTime();
    // 复赛结束时间 =>  utc时区 2024 01.05 23:59:59
    const QUARTERFINAL_END_TIME = new Date(Date.UTC(2024, 0, 5, 23, 59, 59)).getTime();
    // 半决赛开始时间 =>  utc时区 2024 01.06 00:00:00
    const SEMIFINAL_START_TIME = new Date(Date.UTC(2024, 0, 6)).getTime();
    // 半决赛结束时间 =>  utc时区 2024 01.07 23:59:59
    const SEMIFINAL_END_TIME = new Date(Date.UTC(2024, 0, 7, 23, 59, 59)).getTime();
    // 决赛开始时间 =>  utc时区 2024 01.09 00:00:00
    const FINAL_START_TIME = new Date(Date.UTC(2024, 0, 9)).getTime();
    // 决赛结束时间 =>  utc时区 2024 01.10 00:00:00
    const FINAL_END_TIME = new Date(Date.UTC(2024, 0, 9, 23, 59, 59)).getTime();
    export default {
        components: {
            pageLoading,
            popup,
            Header
        },
        setup() {
            const root = getCurrentInstance();
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
                    name: t('preliminary'),
                    value: 'PRELIMINARY'
                },
                {
                    name: t('semifinals'),
                    value: 'QUARTERFINAL'
                },
                {
                    name: t('banFinals'),
                    value: 'SEMIFINAL'
                },
                {
                    name: t('finals'),
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
                    name: t('giftSender'),
                },
                {
                    name: t('star'),
                },
                {
                    name: t('room'),
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
                gift_config_item_vo_list.value = res.data.gift_config_item_vo_list;
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

            // 获取奖品
            let reward_gift_items = ref([]);
            let reward_room_items = ref([]);
            let reward_star_items = ref([]);
            const getGiftInfo = async () => {
                let res = await getGiftInfoAPI();
                if (res.status !== 1000) return;
                reward_gift_items.value = res.data.reward_gift_items;
                reward_room_items.value = res.data.reward_room_items;
                reward_star_items.value = res.data.reward_star_items;
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
                    2: 'VOICE_ROOM',
                };
                let params = {
                    year_end_pk_type: pkTypeEnum[tabActive.value],
                    year_end_pk_rank_type: pkRankTypeEnum[listTabActive.value],
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

                        if (tabActive.value === 0) {
                            roomMyRank.value = {
                                subject_rank: '--',
                                subject_icon: '',
                                subject_name: '',
                                subject_score: '0',
                                show_text: 0,
                            }
                        } else {
                            roomMyRank.value = {
                                subject_rank: '--',
                                subject_icon: '',
                                subject_name: '',
                                subject_score: t('notQualified'),
                                show_text: 1,
                            }
                        }
                    }
                    
                    roomList.value = res.data.rank_list_info_items;
                }

                listShow.value = res.data.status !== 0;

                rankStatus.value = res.data.status;

                

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
                    } else {
                        Toast(t('liveEnd'))
                    }
                } else {
                    if (item.subject_id) {
                        location.href = `wlyaame://trend/user?uid=${item.subject_id}`;
                    }
                }
            };
            
            const change18nKey = () => {
                if (tabActive.value === 0) {
                    i18nKey.value = 'postPreliminary';
                } else if (tabActive.value === 1) {
                    if (rankStatus.value === 0) {
                        i18nKey.value = 'preQuarter';
                    } else if (rankStatus.value === 2) {
                        i18nKey.value = 'postQuarter';
                    }  else if (rankStatus.value === 1) {
                        i18nKey.value = 'postQuarter';
                    }
                } else if (tabActive.value === 2) {
                    if (rankStatus.value === 0) {
                        if (new Date().getTime() < FINAL_START_TIME) {
                            i18nKey.value = 'preSemi';
                        } else {
                            i18nKey.value = 'postSemi';
                        }
                    } else if (rankStatus.value === 2) {
                        i18nKey.value = 'postSemi';
                    } else if (rankStatus.value === 1) {
                        i18nKey.value = 'postSemi';
                    } else if (rankStatus.value === 3) {
                        i18nKey.value = 'preFinal';
                    }
                } else if (tabActive.value === 3) {
                    if (rankStatus.value === 0) {
                        i18nKey.value = 'preFinal';
                    } else if (rankStatus.value === 2) {
                        i18nKey.value = 'postFinal';
                    } else if (rankStatus.value === 1) {
                        i18nKey.value = 'postFinal';
                    }
                }
            }

            // 改造上面的函数为computed 
            const computedUserRank = computed(() => {
                if (tabActive.value ===  0) {
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
                } else if (tabActive.value ===  1) {
                    if (listTabActive.value === 0) {
                        if (myRank.value.subject_rank > 40) {
                            return '40+';
                        } else {
                            return myRank.value.subject_rank;
                        }
                    } else if (listTabActive.value === 1) {
                        if (myRank.value.subject_rank > 40) {
                            return '40+';
                        } else {
                            return myRank.value.subject_rank;
                        }
                    } else if (listTabActive.value === 2) {
                        if (roomMyRank.value.subject_rank > 40) {
                            return '40+';
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


            onMounted(async () => {
                
                getGiftInfo();
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
                reward_gift_items,
                reward_room_items,
                reward_star_items,

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
    background-image: url("https://yaame-static.yaame.io/admin/ce1f675ac91eafd820c7e9eaecb772f7.png");

    &.zh-cn {
        background-image: url("https://yaame-static.yaame.io/admin/7f23700b394b93c94380d33884a2954b.png");
    }

    &.zh-tw {
        background-image: url("https://yaame-static.yaame.io/admin/3ca3e4106c70af1af1f1757b7716a85f.png");
    }

    &.en {
        background-image: url("https://yaame-static.yaame.io/admin/ce1f675ac91eafd820c7e9eaecb772f7.png");
    }

    &.ar {
        background-image: url("https://yaame-static.yaame.io/admin/aec9234263e74217508a119a14f4c08f.png");
    }

    &.id {
        background-image: url("https://yaame-static.yaame.io/admin/71447bb858b499e713478c8b91be6b30.png");
    }

    .rule {
        width: 1.53rem;
        height: 0.54rem;
        background-image: url(https://yaame-static.yaame.io/admin/d2ac3054166a9a1779539b395e2169a8.png);
        background-size: contain;
        background-repeat: no-repeat;
        line-height: 0.54rem;
        text-align: center;
        font-size: 0.28rem;
        font-weight: normal;
        color: #FFF8B6;
        position: fixed;
        top: 5.61rem;
        right: 0;
        padding-left: 0.2rem;
        z-index: 9
    }

    .rewards {
        background-image: url(https://yaame-static.yaame.io/admin/ab9e7d375501db5d1241ebe1b06f1480.png);
        top: 6.42rem;
    }

    .gift-container {
        width: 6.62rem;
        height: auto;
        position: relative;
        padding-top: 1.12rem;
        padding-bottom: 0.54rem;
        margin-left: 0.44rem;
        .header-p {
            width: 6.62rem;
            text-align: center;
            font-size: 0.3rem;
            font-weight: normal;
            color: #FFF8B6;
            position: absolute;
            top: 0.28rem;
            left: 0;
        }
        .top-img {
            width: 6.62rem;
            height: 2.87rem;
            position: absolute;
            top: 0;
            left: 0;
            background-image: url(https://yaame-static.yaame.io/admin/d50517c8d33cee0fd9ef30f620a88871.png);
            background-size: 6.62rem auto;
            background-repeat: no-repeat;
        }

        .bottom-img {
            width: 6.62rem;
            height: 0.91rem;
            position: absolute;
            bottom: 0;
            left: 0;
            background-image: url(https://yaame-static.yaame.io/admin/ea90e299e1b161ffabcbff137a3f260d.png);
            background-size: 6.62rem auto;
            background-repeat: no-repeat;
        }

        .gift-content {
            width: 6.62rem;
            height: auto;
            min-height: 2.5rem;
            background-image: url("https://yaame-static.yaame.io/admin/81f7eb5098a22a56762a8c1033e6f44a.png");
            background-size: 6.62rem auto;
            background-repeat: repeat;
            position: relative;
            z-index: 1;

            .gift-list {
                width: 5.86rem;
                margin-left: 0.38rem;
                height: 2.16rem;
                display: flex;
                justify-content: space-between;
                flex-wrap: nowrap;

                .gift-item {
                    width: 1.3rem;
                    height: 2.16rem;

                    .img-container {
                        width: 1.3rem;
                        height: 1.3rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background-image: url("https://yaame-static.yaame.io/admin/a0d9bfed63b59768969b9214a8c273b4.png");
                        background-size: 1.3rem 1.3rem;
                        background-repeat: no-repeat;

                        img {
                            width: 1rem;
                            height: auto;
                        }
                    }

                    .gift-name {
                        width: 1.3rem;
                        text-align: center;
                        font-size: 0.22rem;
                        font-weight: normal;
                        color: #FFFFFF;
                        margin-top: 0.08rem;
                    }

                    .gift-price {
                        width: 1.3rem;
                        text-align: center;
                        font-size: 0.22rem;
                        font-weight: normal;
                        color: #D89FFF;
                        margin-top: 0.04rem;

                        img {
                            width: 0.22rem;
                            height: auto;
                            vertical-align: middle;
                        }
                    }
                }
            }

            .gift-info {
                margin-top: 0.2rem;
                width: 6.1rem;
                margin-left: 0.26rem;
                text-align: center;
                font-size: .22rem;
                font-weight: normal;
                color: #FFFFDC;
            }
        }
    }

    .tab-container {
        width: 7.5rem;
        height: 0.98rem;
        display: flex;
        background-image: url("https://yaame-static.yaame.io/admin/95bb7eb16b0dd18d8989d0e07c9d13e6.png");
        background-size: 7.5rem auto;
        background-repeat: no-repeat;
        margin-top: 0.62rem;

        .tab-item {
            flex: 1;
            text-align: center;
            line-height: 0.9rem;
            color: #E7B5FF;
            font-size: 0.28rem;

            &.active {
                background-image: url("https://yaame-static.yaame.io/admin/4e4410aa5c75b110fa874d3137af014b.png");
                background-size: 1.875rem auto;
                background-repeat: no-repeat;
                color: #970000;
            }
        }
    }

    .timeout-container {
        width: 6.41rem;
        height: 0.81rem;
        margin-top: 0.47rem;
        margin-left: 0.57rem;
        background-image: url("https://yaame-static.yaame.io/admin/473d7f28b393b93873367cff3130bb60.png");
        background-size: 6.41rem auto;
        background-repeat: no-repeat;
        position: relative;

        div {
            text-align: center;
            line-height: 0.56rem;
            font-size: 0.24rem;
            font-weight: normal;
            color: #FFF4AA;
        }

        div:nth-child(1) {
            width: 0.6rem;
            height: 0.56rem;

            position: absolute;
            left: 1.32rem;
            top: 0.12rem;
        }

        div:nth-child(2) {
            width: 0.6rem;
            height: 0.56rem;

            position: absolute;
            left: 2rem;
            top: 0.12rem;
        }

        div:nth-child(3) {
            width: 0.68rem;
            height: 0.56rem;

            position: absolute;
            left: 2.74rem;
            top: 0.12rem;
        }

        div:nth-child(4) {
            width: 0.68rem;
            height: 0.56rem;

            position: absolute;
            left: 3.58rem;
            top: 0.12rem;
        }

        div:nth-child(5) {
            width: 0.68rem;
            height: 0.56rem;

            position: absolute;
            left: 4.4rem;
            top: 0.12rem;
        }
    }

    .time-text-container {
        width: 6.51rem;
        height: 0.91rem;
        margin-top: 0.47rem;
        margin-left: 0.5rem;
        background-image: url("https://yaame-static.yaame.io/admin/4ab4309a28d92682e5fe1e219242f4f1.png");
        background-size: 6.51rem auto;
        background-repeat: no-repeat;
        text-align: center;
        line-height: 0.91rem;
        font-size: 0.24rem;
        font-weight: normal;
        color: #FFF4AA;
    }

    .list-tab {
        width: 7.5rem;
        height: 0.87rem;
        display: flex;
        margin-top: 0.38rem;
        justify-content: space-between;

        .tab-item {
            width: 2.49rem;
            height: 0.87rem;
            line-height: 1.06rem;
            font-size: 0.34rem;
            text-align: center;
            font-weight: normal;
            color: #E7B5FF;
            background-image: url("https://yaame-static.yaame.io/admin/412e602a3435cb41f94fb65d4ce83696.png");
            background-size: 2.49rem auto;
            background-repeat: no-repeat;

            &.active {
                color: #973E00;
                background-image: url("https://yaame-static.yaame.io/admin/28133efd9abde71319306abf69f99a9c.png");
            }
        }
    }

    .top-list {
        width: 7.5rem;
        position: relative;
        height: 5.5rem;
        .top0 {
            width: 2.79rem;
            height: 4.25rem;
            background-image: url("https://yaame-static.yaame.io/admin/f3869c04c7a763977fc29408c32a6d69.png");
            background-size: 2.79rem auto;
            background-repeat: no-repeat;
            position: absolute;
            top: 0.41rem;
            left: 2.36rem;

            .avatar-container {
                width: 2.36rem;
                height: 2.36rem;
                position: absolute;
                left: 0.22rem;
                top: 0.09rem;

                .user-avatar {
                    width: 1.36rem;
                    height: 1.36rem;
                    border-radius: 50%;
                    position: absolute;
                    top: 0.56rem;
                    left: 0.52rem;
                }

                .avatar-dress {
                    width: 2.36rem;
                    height: 2.36rem;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                }
            }

            .user-rank {
                width: 2.79rem;
                text-align: center;
                position: absolute;
                top: 2.33rem;
                font-size: 0.28rem;
                color: #FFF4AA;
            }

            .user-name {
                width: 2.3rem;
                text-align: center;
                position: absolute;
                top: 2.8rem;
                font-size: 0.24rem;
                color: #FFF4AA;
                left: 0.28rem;
            }

            .user-value {
                width: 2.79rem;
                text-align: center;
                position: absolute;
                top: 3.22rem;
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
            width: 2.51rem;
            height: 3.83rem;
            background-size: 2.51rem auto;
            background-repeat: no-repeat;
            position: absolute;
            top: 1.29rem;

            .avatar-container {
                width: 2.12rem;
                height: 2.12rem;
                position: absolute;
                left: 0.2rem;
                top: 0;

                .user-avatar {
                    width: 1.224rem;
                    height: 1.224rem;
                    border-radius: 50%;
                    position: absolute;
                    top: 0.48rem;
                    left: 0.48rem;
                }

                .avatar-dress {
                    width: 2.12rem;
                    height: 2.12rem;
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                }
            }

            .user-rank {
                width: 2.51rem;
                text-align: center;
                position: absolute;
                top: 2.12rem;
                font-size: 0.25rem;
                color: #FFF4AA;
            }

            .user-name {
                width: 2rem;
                text-align: center;
                position: absolute;
                top: 2.53rem;
                font-size: 0.22rem;
                color: #FFF4AA;
                left: 0.28rem;
            }

            .user-value {
                width: 2.51rem;
                text-align: center;
                position: absolute;
                top: 2.89rem;
                font-size: 0.22rem;
                color: #FFFFFF;

                img {
                    width: 0.22rem;
                    height: auto;
                    vertical-align: middle;

                }
            }
        }

        .top1 {
            background-image: url("https://yaame-static.yaame.io/admin/35863eb5d824a63d70e4a5628ad15f82.png");
            left: 0;
        }

        .top2 {
            background-image: url("https://yaame-static.yaame.io/admin/18ce52b6b2f621a451ced3e4e4fdbff9.png");
            right: 0;
        }
    }

    .list {
        width: 7.5rem;
        min-height: 1.3rem;
        padding-left: 0.13rem;

        .list-item {
            width: 7.24rem;
            height: 1.51rem;
            background-image: url("https://yaame-static.yaame.io/admin/2033087758be8a8d0c7486bbe59860f4.png");
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
                color: #FFFFFF;
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
    }

    .user-info {
        width: 7.5rem;
        height: 2.37rem;
        background-image: url("https://yaame-static.yaame.io/admin/dec3aa1342b3dd13234826492a905738.png");
        background-size: 7.5rem auto;
        background-repeat: no-repeat;
        position: fixed;
        bottom: 0;
        left: 0;
        padding: 0.8rem 0.13rem 0.48rem 0.13rem;
        display: flex;
        align-items: center;
        z-index: 10;

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
            color: #FFFFFF;
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
        padding-left: 0.1rem;
        margin-top: 0.5rem;

        .list-item {
            width: 7.31rem;
            height: 2.26rem;
            background-image: url(https://yaame-static.yaame.io/admin/9372eeac51e977c6c4dedca491fc3c4f.png);
            background-size: 7.31rem auto;
            background-repeat: no-repeat;
            display: flex;
            margin-bottom: 0.2rem;
            align-items: center;
            padding-left: 0.53rem;
            position: relative;

            &.sort-0 {
                background-image: url(https://yaame-static.yaame.io/admin/44212b1a73e83c5998f7f15ac32493e0.png);

                .room-avatar {
                    background-image: url(https://yaame-static.yaame.io/admin/426f0263cc154dbdf3dd216d1889269a.png);
                }

                .room-rank {
                    color: #904104;
                }
            }

            &.sort-1 {
                background-image: url(https://yaame-static.yaame.io/admin/783e486d72de66dabd3933aa6b153907.png);

                .room-avatar {
                    background-image: url(https://yaame-static.yaame.io/admin/05cb946e9034ac7fd982bb2d72b84765.png);
                }

                .room-rank {
                    color: #314D61;
                }
            }

            &.sort-2 {
                background-image: url(https://yaame-static.yaame.io/admin/88b95570ccb616e533b702c931db8ac3.png);

                .room-avatar {
                    background-image: url(https://yaame-static.yaame.io/admin/6078e7e3b427306a8273237f9a65ca18.png);
                }

                .room-rank {
                    color: #904104;
                }
            }

            .room-avatar {
                width: 1.5rem;
                height: 1.5rem;
                background-image: url(https://yaame-static.yaame.io/admin/fb92cc004b7f7f3187d600f0430177cf.png);
                background-size: 1.5rem auto;
                background-repeat: no-repeat;
                display: flex;
                justify-content: center;
                align-items: center;

                img {
                    display: block;
                    width: 1.4rem;
                    height: 1.4rem;
                    border-radius: 0.14rem;
                }
            }

            .room-name {
                width: 3.1rem;
                position: absolute;
                left: 2.38rem;
                top: 0.69rem;
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
                top: 1.08rem;
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
                color: #5F2654;
                position: absolute;
                left: 6.18rem;
                top: 0.2rem;
            }
        }
    }

    .room-user-info {
        width: 7.5rem;
        height: 2.14rem;
        background-image: url("https://yaame-static.yaame.io/admin/000d3b8c9660b309365ed22b63f116e0.png");
        background-size: 7.5rem auto;
        background-repeat: no-repeat;
        position: fixed;
        bottom: 0;
        left: 0;
        padding: 0.75rem 0 0.46rem 0.52rem;
        display: flex;
        align-items: center;
        z-index: 10;

        .room-name {
            width: 3.1rem;
            position: absolute;
            left: 2.36rem;
            top: 0.77rem;
            font-size: 0.34rem;
            font-weight: normal;
            color: #FFFFFF;
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
            top: 1.13rem;
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
            top: 1.14rem;
        }
    }

    .flex-container {
        display: flex;
        justify-content: center;
        align-items: center;

        .rule-container {
            width: 7.37rem;
            height: 11.11rem;
            background-image: url(https://yaame-static.yaame.io/admin/9f3810e867ff4bf4e61d4b3fc9908ea2.png);
            background-size: contain;
            background-repeat: no-repeat;
            padding-top: 1.35rem;
            position: relative;

            .rule-header {
                width: 7.37rem;
                height: 0.34rem;
                position: absolute;
                top: 0.37rem;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.34rem;
                font-weight: normal;
                color: #FFF8B6;
            }

            .rule-content {
                width: 6.3rem;
                height: 9.2rem;
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

        .reward-container {
            width: 7.37rem;
            height: 11.11rem;
            background-image: url(https://yaame-static.yaame.io/admin/9f3810e867ff4bf4e61d4b3fc9908ea2.png);
            background-size: contain;
            background-repeat: no-repeat;
            padding-top: 1.28rem;
            position: relative;

            .reward-header {
                width: 7.37rem;
                height: 0.34rem;
                position: absolute;
                top: 0.37rem;
                left: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 0.34rem;
                font-weight: normal;
                color: #FFF8B6;
            }

            .list-tab {
                width: 7.37rem;
                height: 0.6rem;
                display: flex;
                justify-content: space-between;
                padding: 0 0.45rem;
                margin-bottom: 0.12rem;
                margin-top: 0;

                .tab-item {
                    width: 2.2rem;
                    height: 0.6rem;
                    line-height: 0.6rem;
                    font-size: 0.26rem;
                    text-align: center;
                    font-weight: normal;
                    color: #FFEFEF;
                    background-image: url("https://yaame-static.yaame.io/admin/674c6d2cd8f0c22689ba606787cfff52.png");
                    background-size: 2.2rem auto;
                    background-repeat: no-repeat;

                    &.active {
                        color: #FFF8B6;
                        background-image: url("https://yaame-static.yaame.io/admin/288ddda55c49250ac364bd3105b606f5.png");
                    }
                }
            }

            .gift {
                width: 6.7rem;
                height: 8.86rem;
                overflow: hidden scroll;
                margin-left: 0.4rem;
            }

            .reward-title {
                width: 6.7rem;
                height: 0.68rem;
                text-align: center;
                background-size: 6.7rem auto;
                background-repeat: no-repeat;
                font-size: 0.3rem;
                font-weight: normal;
                color: #FFFFFF;
                line-height: 0.9rem;

                &.reward-0 {
                    background-image: url(https://yaame-static.yaame.io/admin/63cd6be9ac0726ce9cc4a56aa4532192.png);
                }

                &.reward-1 {
                    background-image: url(https://yaame-static.yaame.io/admin/675c64ea0afc1a2e98cc18b1e524fe46.png);
                }

                &.reward-2 {
                    background-image: url(https://yaame-static.yaame.io/admin/8405a35a5dc34652a650caea1a2bf897.png);
                }

                &.reward-3 {
                    background-image: url(https://yaame-static.yaame.io/admin/384bcc3f1c87199ffea6c57006a12d6f.png);
                }

            }

            .flex-content {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                width: 6.6rem;
                margin-top: 0.3rem;
                .long-item {
                    width: 6.6rem;
                    height: 2.4rem;
                    margin-bottom: 0.3rem;
                    .long-img {
                        width: 6.6rem;
                        height: 2rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 0.1rem;
                        background-image: url(https://yaame-static.yaame.io/admin/3fd3b07376020a9fd059c03da41d0bbd.png);
                        background-repeat: no-repeat;
                        background-size: 6.6rem auto;
                        img {
                            width: 2.39rem;
                            height: 1.26rem;
                        }
                    }

                    .long-name {
                        width: 6.6rem;
                        height: 0.3rem;
                        text-align: center;
                        font-size: 0.24rem;
                        font-weight: normal;
                        color: #FFFFFF;
                    }
                }

                .normal-item {
                    width: 2rem;
                    height: 2.7rem;
                    margin-bottom: 0.3rem;
                    .normal-img {
                        width: 2rem;
                        height: 2rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-image: url(https://yaame-static.yaame.io/admin/76a092bd781ffb2e715ad9bcfa13bcfd.png);
                        background-repeat: no-repeat;
                        background-size: 2rem auto;
                        img {
                            width: 1.6rem;
                            height: 1.6rem;
                        }
                    }
                    .normal-name {
                        width: 2rem;
                        text-align: center;
                        font-size: 0.22rem;
                        font-weight: normal;
                        color: #FFFFFF;
                        margin-top: 0.1rem;
                    }
                    .normal-value {
                        width: 2rem;
                        text-align: center;
                        font-size: 0.22rem;
                        font-weight: normal;
                        color: #FFE678;
                        img {
                            width: 0.22rem;
                            height: auto;
                            vertical-align: middle;
                        }
                    }
                }
                .big-item {
                    width: 3rem;
                    height: 3.8rem;
                    margin-bottom: 0.3rem;
                    .big-img {
                        width: 3rem;
                        height: 3rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background-image: url(https://yaame-static.yaame.io/admin/76a092bd781ffb2e715ad9bcfa13bcfd.png);
                        background-repeat: no-repeat;
                        background-size: 3rem auto;
                        img {
                            width: auto;
                            height: 2.4rem;
                        }
                    }
                    .big-name {
                        width: 3rem;
                        text-align: center;
                        font-size: 0.24rem;
                        font-weight: normal;
                        color: #FFFFFF;
                        margin-top: 0.1rem;
                    }
                    .big-value {
                        width: 3rem;
                        text-align: center;
                        font-size: 0.24rem;
                        font-weight: normal;
                        color: #FFE678;
                        img {
                            width: 0.22rem;
                            height: auto;
                            vertical-align: middle;
                        }
                    }
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
            color: #B17BEB;
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
