<template>
    <div class="contribution" @click="roomSelectToggle = false">
        <page-loading v-if="page_loading"></page-loading>
        <canvas v-show="tab !== 'VOICE_ROOM'" class="reward-icon" id="canvas" @click="toReward"></canvas>
        <div
            :style="{
				paddingTop: safe_height + 'rem',
				backgroundColor: backgroundColor,
			}"
            :class="['page-header', language === 'ar' && 'arabia-header']"
        >
            <div class="back" @click="back">
                <img
                    :style="{ top: safe_height + 0.24 + 'rem' }"
                    src="../../assets/img/common/icon_back_white.png"
                    alt=""
                />
            </div>
            <div class="tab1">
				<span
                    v-if="tabShow"
                    :class="{ active: tab === 'WEALTH' }"
                    @click="changeTab('WEALTH')"
                >{{ $t("contributionList") }}</span
                >
            </div>
            <div class="tab2">
				<span
            v-if="tabShow"
                    :class="{ active: tab === 'CHARM' }"
                    @click="changeTab('CHARM')"
                >{{ $t("glamourList") }}</span
                >
            </div>
            <div class="tab3">
				<span
                    :class="{ active: tab === 'VOICE_ROOM' }"
                    @click="changeTab('VOICE_ROOM')"
                >{{ $t("roomList") }}</span
                >
            </div>
            <div class="tab3">
				<span
            v-if="tabShow"
                    :class="{ active: tab === 'CP' }"
                    @click="changeTab('CP')"
                >{{ $t("couple") }}</span
                >
            </div>
        </div>
        <div class="switch-div" :style="{
				backgroundColor: backgroundColor,
                top: 1.68 + 'rem'
			}"
        >
            <div class="switch-box">
                <div
                    :class="[rank_type === 'DAY' ? 'active' : '', tabClass]"
                    @click="changeRankType('DAY')"
                >
                    {{ $t("dayList") }}
                </div>
                <div
                    :class="[rank_type === 'WEEK' ? 'active' : '', tabClass]"
                    @click="changeRankType('WEEK')"
                >
                    {{ $t("weeklyList") }}
                </div>
                <div
                    :class="[rank_type === 'MONTH' ? 'active' : '', tabClass]"
                    @click="changeRankType('MONTH')"
                >
                    {{ $t("monthlyList") }}
                </div>
            </div>
        </div>

        <div v-show="tab !== 'CP'">
            <div class="header">
                <img
                    v-if="tab === 'WEALTH'"
                    class="bg-img"
                    src="https://static.yaame.io/admin/cfb8ae85247987a54ac8f2b834cf9479.png"
                    alt=""
                />
                <img
                    v-else-if="tab === 'CHARM'"
                    class="bg-img"
                    src="https://static.yaame.io/admin/cdaf9478a2393dc0ac079daf0b747e43.png"
                    alt=""
                />
                <img
                    v-else-if="tab === 'VOICE_ROOM'"
                    class="bg-img"
                    src="https://static.yaame.io/admin/cf5df31a8f7b95e78059bba5631f670a.png"
                    alt=""
                />
                <!-- 前三名 -->
                <div class="top-container">
                    <!-- 第一名 -->
                    <div class="top-item top1">
                        <div class="top-avatar">
                            <div class="avatar-in" @click.stop="toRoom(top1)">
                                <div class="avatar-in-in">
                                    <img
                                        v-show="top1.subject_icon"
                                        :src="top1.subject_icon"
                                        class="top-avatar-img"
                                        alt=""
                                    />
                                </div>

                                <div
                                    v-show="top1.live_status"
                                    :class="['top1-tag-live', 'top-tag-live-' + language]"
                                >
								<span class="voice">
									<img
                                        src="https://static.yaame.io/admin/92e4f23382c2f1c6ab0af6ba510c18bc.gif"
                                        alt=""
                                    />
								</span>
                                </div>
                            </div>
                            <img
                                class="top-icon"
                                src="https://static.yaame.io/admin/606e8a11ebcbddf69cd1dc3d258ed89e.png"
                                alt=""
                            />
                        </div>
                        <div v-if="tab === 'VOICE_ROOM'" class="top-nick" style="margin-top: 1.65rem">
                            {{ top1.subject_name }}
                        </div>
                        <div v-else class="top-nick" style="margin-top: 1.5rem" :style="computedTextColor(top1)">
                            {{ top1.subject_name }}
                            <img
                                v-if="top1 && top1.noble && top1.noble.noble_level_badge && top1.noble.noble_level_badge.level_badge_icon"
                                :src="top1.noble.noble_level_badge.level_badge_icon" alt=""
                            >
                            <img
                                v-if="top1 && top1.vip && top1.vip.level_badge_icon"
                                :src="top1.vip.level_badge_icon" alt=""
                            >
                        </div>
                        <img
                            v-if="top1.img_tags && top1.img_tags[0]"
                            :src="top1.img_tags[0].image_url"
                            class="top-lv"
                            alt=""
                        />
                        <img v-else-if="tab !== 'VOICE_ROOM'" style="opacity: 0" class="top-lv" alt=""/>
                        <div class="top-count" style="margin-top: 0.16rem">
                            <img src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png" alt="">
                            {{ top1.score_value }}
                        </div>
                        <img
                            v-if="tab === 'CHARM'"
                            class="sort-img"
                            src="https://static.yaame.io/admin/3828a1afddf99d4563dc834ab21d60e0.png"
                            alt=""
                        />
                        <img
                            v-else-if="tab === 'WEALTH'"
                            class="sort-img"
                            src="https://static.yaame.io/admin/d916ff082aff48ce298d441d84a68cd0.png"
                            alt=""
                        />
                        <img
                            v-else-if="tab === 'VOICE_ROOM'"
                            class="sort-img"
                            src="https://static.yaame.io/admin/1bd4915afc51cca7e3bc4e057301e6d7.png"
                            alt=""
                        />
                    </div>
                    <!-- 第二名 -->
                    <div class="top-item top2">
                        <div class="top-avatar">
                            <div class="avatar-in" @click.stop="toRoom(top2)">
                                <div class="avatar-in-in">
                                    <img
                                        v-show="top2.subject_icon"
                                        :src="top2.subject_icon"
                                        class="top-avatar-img"
                                        alt=""
                                    />
                                </div>
                                <div
                                    v-show="top2.live_status"
                                    :class="[
									'top1-tag-live top2-tag-live',
									'top-tag-live-' + language,
								]"
                                >
								<span class="voice">
									<img
                                        src="https://static.yaame.io/admin/92e4f23382c2f1c6ab0af6ba510c18bc.gif"
                                        alt=""
                                    />
								</span>
                                </div>
                            </div>
                            <img
                                class="top-icon"
                                src="https://static.yaame.io/admin/7ce8c85779b5509c87aae232ce1770cd.png"
                                alt=""
                            />
                        </div>
                        <div v-if="tab === 'VOICE_ROOM'" class="top-nick" style="margin-top: 1.65rem">
                            {{ top2.subject_name }}
                        </div>
                        <div v-else class="top-nick" style="margin-top: 1.5rem" :style="computedTextColor(top2)">
                            {{ top2.subject_name }}
                            <img
                                v-if="top2 && top2.noble && top2.noble.noble_level_badge && top2.noble.noble_level_badge.level_badge_icon"
                                :src="top2.noble.noble_level_badge.level_badge_icon" alt=""
                            >
                            <img
                                v-if="top2 && top2.vip && top2.vip.level_badge_icon"
                                :src="top2.vip.level_badge_icon" alt=""
                            >
                        </div>
                        <img
                            v-if="top2.img_tags && top2.img_tags[0]"
                            :src="top2.img_tags[0].image_url"
                            class="top-lv"
                            alt=""
                        />
                        <img v-else-if="tab !== 'VOICE_ROOM'" style="opacity: 0" class="top-lv" alt=""/>
                        <div class="top-count" style="margin-top: 0.16rem">
                            <img src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png" alt="">
                            {{ top2.score_value }}
                        </div>
                        <img
                            v-if="tab === 'CHARM'"
                            class="sort-img"
                            src="https://static.yaame.io/admin/6b351d3ef2cf4c1f060ea2e929393dd5.png"
                            alt=""
                        />
                        <img
                            v-else-if="tab === 'WEALTH'"
                            class="sort-img"
                            src="https://static.yaame.io/admin/b0b5f13a75f3242f3da583bfb9a17491.png"
                            alt=""
                        />
                        <img
                            v-else-if="tab === 'VOICE_ROOM'"
                            class="sort-img"
                            src="https://static.yaame.io/admin/67eb7421eac729f68c8c3970802a1733.png"
                            alt=""
                        />
                    </div>
                    <!-- 第三名 -->
                    <div class="top-item top3">
                        <div class="top-avatar">
                            <div class="avatar-in" @click.stop="toRoom(top3)">
                                <div class="avatar-in-in">
                                    <img
                                        v-show="top3.subject_icon"
                                        :src="top3.subject_icon"
                                        class="top-avatar-img"
                                        alt=""
                                    />
                                </div>
                                <div
                                    v-show="top3.live_status"
                                    :class="[
									'top1-tag-live top2-tag-live',
									'top-tag-live-' + language,
								]"
                                >
								<span class="voice">
									<img
                                        src="https://static.yaame.io/admin/92e4f23382c2f1c6ab0af6ba510c18bc.gif"
                                        alt=""
                                    />
								</span>
                                </div>
                            </div>
                            <img
                                class="top-icon"
                                src="https://static.yaame.io/admin/1451f0dd383d2594cd9d49e41f737cfb.png"
                                alt=""
                            />
                        </div>
                        <div v-if="tab === 'VOICE_ROOM'" class="top-nick" style="margin-top: 1.7rem">
                            {{ top3.subject_name }}
                        </div>
                        <div v-else class="top-nick" style="margin-top: 1.5rem" :style="computedTextColor(top3)">
                            {{ top3.subject_name }}
                            <img
                                v-if="top3 && top3.noble && top3.noble.noble_level_badge && top3.noble.noble_level_badge.level_badge_icon"
                                :src="top3.noble.noble_level_badge.level_badge_icon" alt=""
                            >
                            <img
                                v-if="top3 && top3.vip && top3.vip.level_badge_icon"
                                :src="top3.vip.level_badge_icon" alt=""
                            >
                        </div>
                        <img
                            v-if="top3.img_tags && top3.img_tags[0]"
                            :src="top3.img_tags[0].image_url"
                            class="top-lv"
                            alt=""
                        />
                        <img v-else-if="tab !== 'VOICE_ROOM'" style="opacity: 0" class="top-lv" alt=""/>
                        <div class="top-count" style="margin-top: 0.16rem">
                            <img src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png" alt="">
                            {{ top3.score_value }}
                        </div>
                        <img
                            v-if="tab === 'CHARM'"
                            class="sort-img"
                            src="https://static.yaame.io/admin/b5af927cecf0effa4de01911111fffaa.png"
                            alt=""
                        />
                        <img
                            v-else-if="tab === 'WEALTH'"
                            class="sort-img"
                            src="https://static.yaame.io/admin/7043f5911585f15ddddf8b75bf11f3d0.png"
                            alt=""
                        />
                        <img
                            v-else-if="tab === 'VOICE_ROOM'"
                            class="sort-img"
                            src="https://static.yaame.io/admin/1ab4f2d1ed58e0a41cc6fb2362b0b4e7.png"
                            alt=""
                        />
                    </div>
                </div>
            </div>
            <div :style="{ marginTop: 0.3 + 'rem' }" :class="{ container: true }">
                <refresh class="refresh" ref="wlRefresh" @onRefresh="handleRefresh">
                    <div
                        :class="{ 'list-container': true, 'no-list': list && !list.length }"
                    >
                        <div
                            v-infinite-scroll="loadMore"
                            v-if="list && list.length"
                            :infinite-scroll-immediate-check="true"
                            infinite-scroll-disabled="loading"
                            infinite-scroll-distance="10"
                        >
                            <div v-for="(item, index) in list" :key="index" class="list-item" @click.stop="toRoom(item)">
                                <div v-if="item.subject_rank" class="rank">{{ item.subject_rank < 100 ? item.subject_rank : '99+' }}</div>
                                <div v-else class="rank">99+</div>
                                <div class="avatar-box">
                                    <img
                                        :src="item.subject_icon || default_avatar"
                                        class="avatar-img"
                                        alt=""
                                    />
                                </div>
                                <div class="info">
                                    <p class="nick-name" :style="computedTextColor(item)">{{ item.subject_name }}
                                        <img v-if="item && item.noble && item.noble.noble_level_badge && item.noble.noble_level_badge.level_badge_icon" :src="item.noble.noble_level_badge.level_badge_icon" alt="">
                                        <img v-if="item && item.vip && item.vip.level_badge_icon" :src="item.vip.level_badge_icon" alt=""> 
                                    </p>
                                    <div class="tag-box">
                                        <div
                                            v-for="(tag_item, tag_index) in item.img_tags"
                                            :key="tag_index"
                                            :class="['tag', 'tag-default']"
                                        >
                                            <img :src="tag_item.image_url" alt=""/>
                                        </div>
                                        <div
                                            v-if="item.live_status"
                                            :class="['tag-live user-voice', 'tag-live-' + language]"
                                        >
										<span class="voice">
											<!-- <i class="first"></i>
                                            <i class="three"></i>
                                            <i class="four"></i> -->
											<img
                                                src="https://static.yaame.io/admin/92e4f23382c2f1c6ab0af6ba510c18bc.gif"
                                                alt=""
                                            />
										</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="count">
                                    <p v-if="item.score_value" style="color: #666">
                                        <img style="width: 0.18rem; height: 0.18rem; vertical-align: middle;"
                                             src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png" alt=""
                                        >
                                        {{ item.score_value }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div v-if="no_person" class="empty">
                            <img
                                v-if="appType === 'sweet'"
                                :src="define.sweet_empty_img_url"
                                alt=""
                            />
                            <img
                                v-else-if="appType === 'cu'"
                                :src="define.sweet_empty_img_url"
                                alt=""
                            />
                            <img v-else :src="define.empty_img_url" alt=""/>
                            <p>{{ $t("NotOnTheListYet") }}</p>
                        </div>
                    </div>
                </refresh>
            </div>

            <div v-if="userInfo" class="user-info">
                <div v-if="userInfo.subject_rank" class="rank">{{ userInfo.subject_rank < 100 ? userInfo.subject_rank : '99+' }}</div>
                <!-- <div v-else class="rank">99+</div> -->
                <div v-else class="rank-null">99+</div>
                <div class="avatar-box" @click="toRoom(userInfo)">
                    <img
                        :src="userInfo.subject_icon || default_avatar"
                        class="avatar-img"
                        alt=""
                    />
                </div>
                <div class="info">
                    <p class="nick-name" :style="computedTextColor(userInfo)">{{ userInfo.subject_name }}</p>
                    <div class="tag-box">
                        <div
                            v-for="(tag_item, tag_index) in userInfo.img_tags"
                            :key="tag_index"
                            :class="['tag', 'tag-default']"
                        >
                            <img :src="tag_item.image_url" alt=""/>
                        </div>
                        <div v-show="userInfo.live_status" :class="['tag-live user-voice', 'tag-live-' + language]">
						<span class="voice">
							<i class="first"></i>
							<i class="three"></i>
							<i class="four"></i>
						</span>
                        </div>
                    </div>
                </div>
                <div class="user-count">
                    <div
                        v-if="userInfo.subject_rank === -1"
                        :style="{ right: userInfo.subject_rank > 1 ? '-1.5rem' : '0' }"
                        class="user-btn"
                        @click="showGift"
                    >
                        我要冲榜
                    </div>
                    <p v-if="userInfo.subject_rank >= 1" style="color: #666">
                        <p v-if="userInfo.score_value" style="color: #666">
                            <img style="width: 0.18rem; height: 0.18rem; vertical-align: middle;"
                                 src="https://static.yaame.io/admin/8f1cc268a594f46a953a906169e1a50f.png" alt=""
                            >
                            {{ userInfo.score_value }}
                        </p>
                    </p>
                </div>
            </div>
        </div>

        <div v-show="tab === 'CP'">
            <div :class="['cp-header', cpTabActive]">
                <div class="cp-top-list">
                    <div v-for="(item, index) in CPTopList" :key="index" :class="['top-' + index]">


                        <div v-if="item.relation_user_info_item_vo" :style="{'background-image': `url(${item.relation_user_info_item_vo.avatar})`}" class="cp-avatar left-avatar" @click="toRoom(item.relation_user_info_item_vo)">
                            <img v-if="index === 0" src="https://yaame-static.yaame.io/admin/eef138c7f78bb71b7af44f82adacd998.png" alt="">
                            <img v-if="index === 1" src="https://yaame-static.yaame.io/admin/776334465f2c7d8adc0e5f8fad5b60d9.png" alt="">
                            <img v-if="index === 2" src="https://yaame-static.yaame.io/admin/9e12bfc2c39bd55b399095df1d8234a6.png" alt="">


                        </div>
                        <div v-if="item.user_info_item_vo" :style="{'background-image': `url(${item.user_info_item_vo.avatar})`}" class="cp-avatar right-avatar" @click="toRoom(item.user_info_item_vo)">
                            <img v-if="index === 0" src="https://yaame-static.yaame.io/admin/eef138c7f78bb71b7af44f82adacd998.png" alt="">
                            <img v-if="index === 1" src="https://yaame-static.yaame.io/admin/776334465f2c7d8adc0e5f8fad5b60d9.png" alt="">
                            <img v-if="index === 2" src="https://yaame-static.yaame.io/admin/9e12bfc2c39bd55b399095df1d8234a6.png" alt="">
                        </div>


                        <img v-if="cpTabActive === 'Lover'" class="hear-img" src="https://yaame-static.yaame.io/admin/9397502bda326340379d39e1f2a3c08b.png" alt="">
                        <img v-else class="hear-img" src="https://yaame-static.yaame.io/admin/70ee5e6b94ad33e1c16964f8b7de4dc5.png" alt="">
                        <div :class="['cp-top-name', cpTabActive]">
                            <div v-if="item.relation_user_info_item_vo" :style="computedTextColor(item.relation_user_info_item_vo)" class="no-wrap">{{ item.relation_user_info_item_vo.nick_name }}</div>
                            <div v-if="item.user_info_item_vo" :style="computedTextColor(item.user_info_item_vo)" class="no-wrap">{{ item.user_info_item_vo.nick_name }}</div>
                        </div>
                        <div :class="['cp-top-value', cpTabActive]">
                            <img v-if="cpTabActive === 'Lover'" src="https://yaame-static.yaame.io/admin/6651549f064d2067f68bd03e41c9c589.png" alt="">
                            <img v-else src="https://yaame-static.yaame.io/admin/3707c09bca12f72930e188becf46a823.png" alt="">
                            {{ item.exp_value }}</div>
                    </div>
                </div>
            </div>

            <div class="cp-container">
                <div :class="['cp-tab', cpTabActive]">
                    <div v-for="(item, index) in cpTabArr" :key="index" :class="[cpTabActive === item && 'active']" @click="cpTabActive = item; getCPData()">
                        {{ $t(item) }}
                    </div>
                </div>
                <refresh class="refresh" ref="wlRefreshCP" @onRefresh="handleRefresh">
                    <div
                        :class="{ 'list-container': true, 'no-list': CPList && !CPList.length }"
                    >
                        <!-- v-infinite-scroll="loadMore"
                        :infinite-scroll-immediate-check="true"
                        infinite-scroll-disabled="loading"
                        infinite-scroll-distance="10" -->
                        <div
                            v-if="CPList && CPList.length"
                        >
                            <div v-for="(item, index) in CPList" :key="index" :class="['cp-list-item', cpTabActive]">
                                <div v-if="item.cp_rank" class="rank">{{ item.cp_rank < 100 ? item.cp_rank : '99+' }}</div>
                                <div v-else class="rank">99+</div>
                                <div class="user-avatar">
                                    <div class="cp-item-avatar left-avatar" @click="toRoom(item.relation_user_info_item_vo)">
                                        <img :src="item.relation_user_info_item_vo.avatar" alt="">
                                    </div>
                                    <div class="cp-item-avatar right-avatar" @click="toRoom(item.user_info_item_vo)">
                                        <img :src="item.user_info_item_vo.avatar" alt="">
                                    </div>
                                    <img v-if="cpTabActive === 'Lover'" class="hear-img" src="https://yaame-static.yaame.io/admin/9397502bda326340379d39e1f2a3c08b.png" alt="">
                                    <img v-else class="hear-img" src="https://yaame-static.yaame.io/admin/70ee5e6b94ad33e1c16964f8b7de4dc5.png" alt="">
                                </div>
                                <div class="user-name">
                                    <p class="no-wrap">{{ item.relation_user_info_item_vo.nick_name }}</p>
                                    <p class="no-wrap">{{ item.user_info_item_vo.nick_name }}</p>
                                </div>
                                <div class="user-value">
                                    <img v-if="cpTabActive === 'Lover'" src="https://yaame-static.yaame.io/admin/6651549f064d2067f68bd03e41c9c589.png" alt="">
                                    <img v-else src="https://yaame-static.yaame.io/admin/3707c09bca12f72930e188becf46a823.png" alt="">
                                    {{ item.exp_value }}</div>
                            </div>
                        </div>
                        <div v-if="no_person" class="empty">
                            <img
                                v-if="appType === 'sweet'"
                                :src="define.sweet_empty_img_url"
                                alt=""
                            />
                            <img
                                v-else-if="appType === 'cu'"
                                :src="define.sweet_empty_img_url"
                                alt=""
                            />
                            <img v-else :src="define.empty_img_url" alt=""/>
                            <p>{{ $t("NotOnTheListYet") }}</p>
                        </div>
                    </div>
                </refresh>
            </div>

            <div v-if="loverUserInfo && cpTabActive === 'Lover'" class="cp-user-info">
                <div v-if="loverUserInfo.cp_rank" class="rank">{{ loverUserInfo.cp_rank < 100 ? loverUserInfo.cp_rank : '99+' }}</div>
                <div v-else class="rank">99+</div>
                <div class="user-avatar">
                    <div class="cp-item-avatar left-avatar" @click="toRoom(loverUserInfo.relation_user_info_item_vo)">
                        <img :src="loverUserInfo.relation_user_info_item_vo.avatar" alt="">
                    </div>
                    <div class="cp-item-avatar right-avatar" @click="toRoom(loverUserInfo.user_info_item_vo)">
                        <img :src="loverUserInfo.user_info_item_vo.avatar" alt="">
                    </div>
                    <img v-if="cpTabActive === 'Lover'" class="hear-img" src="https://yaame-static.yaame.io/admin/9397502bda326340379d39e1f2a3c08b.png" alt="">
                    <img v-else class="hear-img" src="https://yaame-static.yaame.io/admin/70ee5e6b94ad33e1c16964f8b7de4dc5.png" alt="">
                </div>
                <div class="user-name">
                    <p class="no-wrap">{{ loverUserInfo.relation_user_info_item_vo.nick_name }}</p>
                    <p class="no-wrap">{{ loverUserInfo.user_info_item_vo.nick_name }}</p>
                </div>
                <div class="user-value">
                    <img v-if="cpTabActive === 'Lover'" src="https://yaame-static.yaame.io/admin/6651549f064d2067f68bd03e41c9c589.png" alt="">
                    <img v-else src="https://yaame-static.yaame.io/admin/3707c09bca12f72930e188becf46a823.png" alt="">
                    {{ loverUserInfo.exp_value }}</div>
            </div>

            <div v-if="!loverUserInfo && cpTabActive === 'Lover'" class="cp-invite-btn Lover" @click="toInvite">
                {{ $t('InviteLover') }}
            </div>

            <div v-if="!bestieUserInfo && cpTabActive === 'Bestie'" class="cp-invite-btn Bestie" @click="toInvite">
                {{ $t('InviteBestie') }}
            </div>

            <div v-if="bestieUserInfo && cpTabActive === 'Bestie'" :class="['bestie-user-info', 'length-' + bestieUserInfo.length]">
                <img v-if="!toggle && bestieUserInfo.length > 1" class="toggle-img" src="https://yaame-static.yaame.io/admin/d1217d8e4e91ceca09e04176f66109f4.png" alt="" @click="toggle = !toggle">
                <div v-show="toggle" class="more-info">
                    <div v-for="(item, index) in bestieUserInfo" v-show="index > 0" :key="index" class="bestie-list-item Bestie bottom-item">
                        <div v-if="item.cp_rank" class="rank">{{ item.cp_rank < 100 ? item.cp_rank : '99+' }}</div>
                        <div v-else class="rank">99+</div>
                        <div class="user-avatar">
                            <div class="cp-item-avatar left-avatar" @click="toRoom(item.relation_user_info_item_vo)">
                                <img :src="item.relation_user_info_item_vo.avatar" alt="">
                            </div>
                            <div class="cp-item-avatar right-avatar" @click="toRoom(item.user_info_item_vo)">
                                <img :src="item.user_info_item_vo.avatar" alt="">
                            </div>

                            <img class="hear-img" src="https://yaame-static.yaame.io/admin/70ee5e6b94ad33e1c16964f8b7de4dc5.png" alt="">
                        </div>
                        <div class="user-name">
                            <p class="no-wrap">{{ item.relation_user_info_item_vo.nick_name }}</p>
                            <p class="no-wrap">{{ item.user_info_item_vo.nick_name }}</p>
                        </div>
                        <div class="user-value">

                            <img src="https://yaame-static.yaame.io/admin/3707c09bca12f72930e188becf46a823.png" alt="">
                            {{ item.exp_value }}</div>
                    </div>
                </div>
                <div class="bestie-list-item Bestie bottom-item">
                    {{ bestieUserInfo[0].rank }}
                    <div v-if="bestieUserInfo[0].cp_rank" class="rank">{{ bestieUserInfo[0].cp_rank < 100 ? bestieUserInfo[0].cp_rank : '99+' }}</div>
                    <div v-else class="rank">99+</div>
                    <div class="user-avatar">
                        <div class="cp-item-avatar left-avatar" @click="toRoom(bestieUserInfo[0].relation_user_info_item_vo)">
                            <img :src="bestieUserInfo[0].relation_user_info_item_vo.avatar" alt="">
                        </div>
                        <div class="cp-item-avatar right-avatar" @click="toRoom(bestieUserInfo[0].user_info_item_vo)">
                            <img :src="bestieUserInfo[0].user_info_item_vo.avatar" alt="">
                        </div>

                        <img class="hear-img" src="https://yaame-static.yaame.io/admin/70ee5e6b94ad33e1c16964f8b7de4dc5.png" alt="">
                    </div>
                    <div class="user-name">
                        <p class="no-wrap">{{ bestieUserInfo[0].relation_user_info_item_vo.nick_name }}</p>
                        <p class="no-wrap">{{ bestieUserInfo[0].user_info_item_vo.nick_name }}</p>
                    </div>
                    <div class="user-value">

                        <img src="https://yaame-static.yaame.io/admin/3707c09bca12f72930e188becf46a823.png" alt="">
                        {{ bestieUserInfo[0].exp_value }}</div>
                </div>

                <img v-if="toggle" class="toggle-img" src="https://yaame-static.yaame.io/admin/a08bd4e3e0eee284eb02fe6794e54954.png" alt="" @click="toggle = !toggle">


            </div>
        </div>
    </div>
</template>
<script>
    import request from "../../lib/request/contribution.js";
    import Toast from "../../components/third/toast/toast";
    import { getQueryString, getScrollTop } from "@/lib/utils";
    import { getSafeHeight, getAppType, getLanguage } from "@/lib/device";
    import commonButton from "../../components/common/button.vue";
    import pageLoading from "../../components/common/page_loading.vue";
    import refresh from "../../components/common/refresh.vue";
    import customHeader from "../../components/common/header.vue";
    import define from "../../lib/define.js";
    import { Downloader, Parser, Player } from 'svga.lite';

    const getDefaultUser = () => {
        return {
            avatar: "",
            subject_name: "-",
            score_value: 0,
        };
    };
    const computedTabForUrl = () => {
        if (getQueryString("tab") === "0") {
            return "WEALTH";
        } else if (getQueryString("tab") === "1") {
            return "CHARM";
        } else if (getQueryString("tab") === "2") {
            return "VOICE_ROOM";
        } else if (getQueryString("tab") === "3") {
            return "CP";
        } else {
            return "WEALTH";
        }
    };
    const computedTimeForUrl = () => {
        if (getQueryString("time") === "0") {
            return "DAY";
        } else if (getQueryString("tab") === "1") {
            return "WEEK";
        } else if (getQueryString("tab") === "2") {
            return "MONTH";
        } else {
            return "WEEK";
        }
    };

    const getDefaultCPUser = () => {
        return {
            relation_user_info_item_vo: {
                avatar: "https://yaame-static.yaame.io/admin/72dc36eb39c5535e8bd1c407f13cdffb.png",
                nick_name: "None"
            },
            user_info_item_vo: {
                avatar: "https://yaame-static.yaame.io/admin/72dc36eb39c5535e8bd1c407f13cdffb.png",
                nick_name: "None"
            },
            exp_value: 0,
            cp_rank: '-'
        };
    };

    export default {
        components: {
            pageLoading,
            refresh,
            customHeader,
            commonButton,
        },
        filters: {
            count_filter(val) {
                if (val && val > 9999) {
                    return (val / 10000).toFixed(2) + "w";
                }
                return val;
            },
        },
        data() {
            return {
                tab: computedTabForUrl(),
                rank_type: computedTimeForUrl(),
                top1: getDefaultUser(),
                top2: getDefaultUser(),
                top3: getDefaultUser(),
                list: [],
                page_loading: true,
                safe_height: 0,
                page: 1,
                has_next: false,
                no_person: false,
                define,
                default_avatar:
                    "https://static.yaame.io/admin/e4a419c9d7d94db41ea41e3f810a3759.png",
                userInfo: {},
                appType: getAppType(),
                timeOptions: [
                    {
                        name: "本周",
                        value: this.getMonday(new Date()),
                    },
                    {
                        name: "上周",
                        value: this.getPrevMonday(new Date()),
                    },
                ],
                timeSelect: 0,
                dayOptions: [
                    {
                        name: "今日",
                        value: this.getToday(new Date()),
                    },
                    {
                        name: "昨日",
                        value: this.getYesterday(new Date()),
                    },
                ],
                daySelect: 0,
                roomSelectToggle: false,
                roomList: [],
                roomSelect: 0,
                guilds: getQueryString("guilds"),

                downloader: null,
                parser: null,
                player: null,
                svgaData: null,

                cpTabActive: getQueryString('cpTabActive') === '0' ? 'Lover' : 'Bestie',
                cpTabArr: [
                    'Lover', 'Bestie'
                ],

                CPTopList: [],
                CPList: [],
                cpDefaultAvatar: 'https://yaame-static.yaame.io/admin/72dc36eb39c5535e8bd1c407f13cdffb.png',

                loverUserInfo: null,
                bestieUserInfo: null,

                toggle: false,

                cp_show: false,
                tabShow: true,
                number: 1,
            };
        },
        computed: {
            language() {
                return getLanguage() || "en";
            },
            backgroundColor() {
                const colorEnum = {
                    WEALTH: "#5969D5",
                    CHARM: "#FE4286",
                    VOICE_ROOM: "#FC9F43",
                    CP: 'transparent',
                };

                if (this.tab === 'CP') {
                    if (this.cp_show) {
                        return 'transparent'
                    } else {
                        if (this.cpTabActive === 'Lover') {
                            return '#F2518E';
                        } else {
                            return '#6278FE';
                        }
                    }
                }

                return colorEnum[this.tab];
            },
            tabClass() {
                const classEnum = {
                    WEALTH: "colorBlue",
                    CHARM: "colorPink",
                    VOICE_ROOM: "colorYellow",
                    CP: 'color',
                };
                if (this.tab === 'CP') {
                    if (this.cpTabActive === 'Lover') {
                        return 'colorLover';
                    } else {
                        return 'colorBestie';
                    }
                }
                return classEnum[this.tab];
            },
        },
        async mounted() {
            const safe_area = getSafeHeight() || 40;
            this.safe_height = (safe_area * 2) / 100;
            if (this.guilds) {
                await this.getAllGuildsRoom();
                await this.getData();
            } else {
                if (this.tab !== 'CP') {
                    await this.getData();
                } else {
                    await this.getCPData();
                }
            }


            window.addEventListener("scroll", this.pageChange, false);
            this.initSVGAData();
        },
        methods: {
            pageChange() {
                const scroll_top = getScrollTop();
                this.cp_show = scroll_top <= 10;
            },
            showGift() {
                // 我要冲榜
                location.href = "wlyaame://voice/room/gift";
            },
            toReward() {
                if (this.tab === 'CP') {
                    location.href = './TopCP.html?key=' + this.cpTabActive;
                    return;
                }
                location.href = './TopReward.html?tab=' + this.tab;
            },
            changeRankType(type) {
                this.rank_type = type;
                this.page = 1;
                if (this.tab !== 'CP') {
                    this.getData();
                } else {

                    this.getCPData();
                }
            },
            async getData() {
                let options = {
                    time_cycle_type: this.rank_type,
                    rank_type: this.tab,
                    page: this.page,
                    size: 30,
                };
                let res = await request.getContributeRank(options);
                this.page_loading = false;
                if (res.status !== 1000) return;
                // 判断是否是华语大区和东南亚大区
                if (!res.data.show_list && this.number) {
                    this.number = 0;
                    this.tab = 'VOICE_ROOM';
                    this.tabShow = false;
                    this.getData();
                }
                let content = res.data.content;
                if (res.data.my_rank) {
                    this.userInfo = res.data.my_rank;
                } else {
                    this.userInfo = false;
                }
                if (this.page === 1) {
                    this.no_person = content.length < 3;
                    this.top1 = content[0] || getDefaultUser();
                    this.top2 = content[1] || getDefaultUser();
                    this.top3 = content[2] || getDefaultUser();

                    this.list = content.slice(3, content.length);
                } else {
                    this.list = this.list.concat(content);
                }
                this.has_next = res.data.has_next;
            },
            async getCPData() {
                let options = {
                    cpRankTimeCycleType: this.rank_type,
                    cpRankType: this.cpTabActive === 'Lover' ? 'LOVER' : 'BESTIE',
                    size: 30,
                    page: 1,
                };
                let res = await request.getContributeCPRank(options);
                this.page_loading = false;
                if (res.status !== 1000) return;
                let content = res.data.content;
                if (this.page === 1) {
                    this.no_person = content.length < 3;
                    if (content.length > 3) {
                        this.CPTopList = content.slice(0, 3);
                        this.CPList = content.slice(3);
                    } else if (content.length === 3) {
                        this.CPTopList = content.slice(0, 3);
                        this.CPList = [];
                    } else if (content.length < 100){
                        this.CPTopList = content.slice(0, 3);
                        this.CPTopList = this.CPTopList.concat(Array(3 - this.CPTopList.length).fill(getDefaultCPUser()));
                        this.CPList = [];
                    }
                } else {
                    this.CPList = this.CPList.concat(content);
                }

                if (this.cpTabActive === 'Lover') {
                    this.loverUserInfo = res.data.my_rank || null;
                    // this.loverUserInfo = res.data.content[0] || getDefaultCPUser();
                } else {
                    this.bestieUserInfo = res.data.my_rank_list;
                }

                this.has_next = res.data.has_next;
            },
            loadMore() {
                if (this.has_next) {
                    this.page++;
                    if (this.tab !== 'CP') {
                        this.getData();
                    } else {
                        this.getCPData();
                    }
                }
            },
            back() {
                location.href = "wlyaame://webview/back";
            },
            toRoom(item) {
                if (this.tab === 'CP') {
                    if (!item.uid) return;
                    if (item.is_mystery === 1) {
                        return;
                    }
                    location.href = `wlyaame://trend/user?uid=${item.uid}`;
                    return;
                }
                 if (item.subject_id && this.tab !== 'VOICE_ROOM') {
                    if (item.is_mystery && item.is_mystery === 1) {
                        return;
                    }
                    if (item.scheme_url) {
                        location.href = item.scheme_url;
                        return;
                    }
                    location.href = `wlyaame://trend/user?uid=${item.subject_id}`;
                }
                if (this.tab === 'VOICE_ROOM') {
                    if (item.live_status === 1) {
                        location.href = item.scheme_url;
                    } else {
                        Toast(this.$t('roomClosed'));
                    }
                }
            },
            changeTab(tab) {
                this.tab = tab;
                this.page = 1;
                if (this.tab !== 'CP') {
                    this.getData();
                } else {

                    this.getCPData();
                }
            },
            async handleRefresh() {
                this.page = 1;
                if (this.tab !== 'CP') {
                    await this.getData();
                } else {
                    await this.getCPData();
                }
                setTimeout(() => {
                    this.$refs.wlRefresh.isLoading = false;
                    this.$refs.wlRefreshCP.isLoading = false;
                }, 500);
            },
            getMonday(date) {
                let day = date.getDay();
                let deltaDay;
                if (day === 0) {
                    deltaDay = 6;
                } else {
                    deltaDay = day - 1;
                }
                let monday = new Date(date.getTime() - deltaDay * 24 * 60 * 60 * 1000);
                monday.setHours(0);
                monday.setMinutes(0);
                monday.setSeconds(0);
                return new Date(monday).getTime();
            },
            getPrevMonday(date) {
                let prevDayNum = date.getTime();
                let prevDay = new Date(prevDayNum - 1000 * 60 * 60 * 24 * 7);
                let day = new Date(prevDayNum - 1000 * 60 * 60 * 24 * 7).getDay();
                let deltaDay;
                if (day === 0) {
                    deltaDay = 6;
                } else {
                    deltaDay = day - 1;
                }
                let monday = new Date(prevDay.getTime() - deltaDay * 24 * 60 * 60 * 1000);
                monday.setHours(0);
                monday.setMinutes(0);
                monday.setSeconds(0);
                return new Date(monday).getTime();
            },
            getToday() {
                return new Date().getTime();
            },
            getYesterday() {
                return new Date().getTime() - 1000 * 60 * 60 * 24;
            },
            async getAllGuildsRoom() {
                let res = await request.getAllGuildsRoom();
                if (res.status !== 1000) {
                    return;
                }
                this.roomList = res.data;
            },

            async initSVGAData() {
                this.downloader = new Downloader();
                // 默认调用 WebWorker 线程解析
                // 可配置 new Parser({ disableWorker: true }) 禁止
                this.parser = new Parser();
                // #canvas 是 HTMLCanvasElement
                this.player = new Player('#canvas');

                // 加载静态动画
                const fileData = await this.downloader.get('https://static.yaame.io/admin/975053ec1867d72cc4910180a799665d.svga');
                this.svgaData = await this.parser.do(fileData);

                this.player.set({ loop: 0 });

                await this.player.mount(this.svgaData);
                this.player.start();
            },
            computedTextColor(item) {
                if (item && item.colorful_nick_name && item.colorful_nick_name.colorful_list) {
                    const colorful_list = item.colorful_nick_name.colorful_list;
                    if (colorful_list) {
                        const gradient = `linear-gradient(to right, ${colorful_list.join(', ')})`;
                        // 返回Vue期望的样式对象
                        return {
                            background: gradient,
                            color: 'transparent', // 将文本颜色设置为透明以便显示渐变背景
                            backgroundClip: 'text', // 只在文本区域显示背景
                            WebkitBackgroundClip: 'text', // 针对webkit浏览器的前缀版本
                            WebkitTextFillColor: 'transparent', // 对于webkit浏览器，对文本填充颜色也设置透明
                        };
                    } else {
                        return {};
                    }
                } else {
                    return {};
                }
            },
            toInvite() {
                if (this.cpTabActive === 'Lover') {
                    location.href = './cp.html';
                } else {
                    location.href = './cp.html';
                }
            },
        },
    };
</script>
<style scoped>
#canvas {
    width: 0.92rem;
    height: 0.92rem;
    position: fixed;
    right: 0.2rem;
    top: 6.9rem;
    z-index: 999;
}

.contribution {
    /* background: #17132B; */
    min-height: 100vh;
}

.bg-img {
    position: absolute;
    width: 100%;
    z-index: -1;
    top: -1px;
}

.container {
    width: 100%;
    padding: 0.2rem 0.3rem 0;
    font-family: PingFangSC-Medium, PingFang SC;
    background-color: #fff;
    border-top-right-radius: 0.3rem;
    border-top-left-radius: 0.3rem;
    position: relative;
    top: -0.5rem;
    left: 0;
    z-index: 4;
    padding-bottom: 1.19rem;
    padding-top: 0.3rem;
    min-height: 5rem;
}
.no-list {
    height: 30vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bottom-box {
    width: 100%;
    position: fixed;
    bottom: 0;
    padding-bottom: 0.4rem;
}

.bottom-btn {
    margin: 0 auto;
}

.tag-box {
    display: flex;
}

.tag-box .tag {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    margin-right: 0.1rem;
}

.tag-age {
    width: 0.74rem;
    height: 0.3rem;
    border-radius: 0.25rem;
    font-size: 0.2rem;
}

.tag-live {
    width: 1.02rem;
    height: 0.3rem;
    background-image: url("https://static.yaame.io/admin/37711911a9134b174bfd80e3f188f7d4.png");
    background-size: 1.02rem 0.3rem;
    padding-left: 0.1rem;
    padding-bottom: 0.03rem;
}

.tag-live-en {
    background-image: url("https://static.yaame.io/admin/f5e6c46f6680f76ff3c129ec971f49c6.png");
}

.tag-live-id {
    background-image: url("https://static.yaame.io/admin/db70422aeafc7f150eea4065e2c49df6.png");
}

.tag-live-ar {
    background-image: url("https://static.yaame.io/admin/bca202e76b0a727346fe6037ac50d09e.png");
}

.user-voice.tag-live {
    transform: scale(1.1);
}

.user-voice > .voice > img {
    margin-top: 0;
    top: 0.02rem;
}

.top-tag-live {
    position: absolute;
    left: 0.2rem;
    bottom: -0.04rem;
    z-index: 10;
}

.tag-default {
    /* width: .88rem; */
    margin: 0 0.06rem;
    height: 0.3rem;
    border-radius: 0.21rem;
}

.tag-default img {
    display: block;
    width: auto;
    height: 0.3rem;
}

.tag-age img {
    display: block;
    width: 0.26rem;
    height: 0.26rem;
    height: auto;
    margin-right: 0.02rem;
}

.top-container {
    width: 6.9rem;
    height: 5.25rem;
    position: relative;
    margin: 0 auto;
}

.top-item {
    width: 2.1rem;
    position: absolute;
    /* bottom: 0; */
    border-radius: 0.2rem;
    color: #fff;
    text-align: center;
}

.top-avatar {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 50%;
    /* background: #17132B; */
    position: absolute;
    left: 0.3rem;
    top: -0.5rem;
    padding: 0.04rem;
    z-index: 3;
}

.top-icon {
    position: absolute;
    display: block;
    width: 2.16rem;
    top: -0.366rem;
    left: -0.276rem;
}

.avatar-in {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    padding: 0.04rem;
    border: 1px solid;
}

.avatar-in-in {
    width: 100%;
    height: 100%;
    border: 1px solid;
    border-radius: 50%;
    position: relative;
    z-index: 2;
    background-image: url("https://static.yaame.io/admin/e4a419c9d7d94db41ea41e3f810a3759.png");
    background-size: 1.3rem 1.3rem;
    background-position: center center;
    background-repeat: no-repeat;
}

.top-avatar-img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.top-nick {
    width: 1.8rem;
    font-size: 0.24rem;
    line-height: 0.37rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 auto;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.8);
    background-clip: text !important;
}

.top-nick > img {
    height: 0.3rem;
    width: auto;
    vertical-align: sub;
    margin-left: 0.06rem;
}

.top-lv {
    display: block;
    height: 0.3rem;
    margin: 0.1rem auto 0;
}

.top-count {
    position: relative;
    z-index: 2;
    font-size: 0.22rem;
    line-height: 0.3rem;
    margin-top: 0.13rem;
    font-weight: normal;
    color: rgba(255, 255, 255, 0.8);
}

.top-count > img {
    width: 0.18rem;
    height: 0.18rem;
    vertical-align: middle;
}

.top1 {
    height: 4.84rem;
    /* background: linear-gradient(180deg, #FF72F3 0%, #FF3EE4 100%); */
    left: 2.4rem;
    top: 1.3rem;
}

.top1 > .sort-img {
    position: absolute;
    bottom: 0.2rem;
    width: 3.5rem;
    left: -0.7rem;
    z-index: 2;
    top: -0.365rem;
}

.top2 {
    height: 4.34rem;
    /* background: linear-gradient(180deg, #2980FF 0%, #2980FF 100%); */
    left: 0;
    top: 1.6rem;
}

.top2 > .sort-img {
    position: relative;
    bottom: 0;
    width: 2.4rem;
    left: 0;
    z-index: 1;
    top: -0.07rem;
}

.top3 {
    height: 4.34rem;
    /* background: linear-gradient(180deg, #8B3EFF 0%, #8B3EFF 100%); */
    right: 0;
    top: 1.6rem;
}

.top3 > .sort-img {
    position: relative;
    bottom: 0;
    width: 2.4rem;
    left: -0.5rem;
    z-index: 1;
    top: -0.07rem;
}

.list-item {
    display: flex;
    align-items: center;
    font-size: 0.28rem;
    color: #fff;
    height: 1rem;
    margin-bottom: 0.5rem;
}

.count {
    width: 1.2rem;
    text-align: right;
    opacity: 0.9;
}

.count > p {
    white-space: nowrap;
}

.user-btn {
    position: relative;
    right: -1.5rem;
    width: 1.56rem;
    height: 0.6rem;
    line-height: 0.6rem;
    color: #fff;
    background: linear-gradient(90deg, #fe3e7f 0%, #fe47bc 100%);
    box-shadow: 0px 0px 0.12rem 0px rgba(255, 48, 146, 0.3);
    border-radius: 0.33rem;
    text-align: center;
    font-size: 0.24rem;
}

.user-count {
    position: absolute;
    padding-top: 0.1rem;
    right: 0.3rem;
    /* width: 3rem; */
    text-align: right;
    opacity: 0.9;
}

.user-count > p {
    width: 3rem;
    font-size: 0.24rem;
    transform: scale(0.83);
    position: relative;
    right: -0.3rem;
}

.count p:first-child {
    font-size: 0.2rem;
    line-height: 0.32rem;
}

.count p:last-child {
    font-size: 0.24rem;
    line-height: 0.34rem;
}

.info {
    padding-left: 0.2rem;
    flex: 1;
}

.nick-name {
    width: 3.5rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 0.26rem;
    line-height: 0.38rem;
    padding: 0.1rem 0 0.1rem;
    opacity: 0.8;
    color: #333;
    background-clip: text !important;
}

.nick-name > img {
    height: 0.3rem;
    width: auto;
    vertical-align: sub;
    margin-left: 0.06rem;
}

.avatar-box {
    width: 1rem;
}

.avatar-img {
    width: 1rem;
    height: 1rem;
    object-fit: cover;
    border-radius: 0.5rem;
}

.rank {
    width: 0.75rem;
    padding-left: 0.1rem;
    font-size: 0.32rem;
    text-align: left;
    color: #666;
}

.switch-div {
    width: 7.5rem;
    position: sticky;
    z-index: 9;
    padding-bottom: 0.14rem;
    margin-top: -1px;
}

.switch-box {
    width: 4.32rem;
    height: 0.6rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 0.34rem;
    margin: 0.3rem auto 0;
    margin-top: 0;

}

.switch-box div {
    flex: 1;
    height: 0.6rem;
    line-height: 0.6rem;
    text-align: center;
    color: #fff;
    font-size: 0.24rem;
    border-radius: 0.34rem;
    font-weight: bold;
}

.switch-box div.active {
    background: #ffffff;
    color: #333;
}

.header {
    position: relative;
    left: 0;
    top: -0.58rem;
    font-size: 0.38rem;
    color: #fff;
    font-weight: bold;
    line-height: 0.88rem;
    z-index: 1;
    background: #17132b;
    padding-bottom: 0.3rem;
    padding-top: 0.2rem;
}

.back {
    position: absolute;
    left: 0.2rem;
    width: 0.4rem;
    height: 0.4rem;
}

.back img {
    width: 0.4rem;
    height: 0.4rem;
}

.page-header {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 9;
    font-size: 0.32rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-left: 0.7rem;
    padding-right: 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    margin-bottom: 0;
    height: 1.7rem;
    /* line-height: 1.7rem; */
    background-color: rgba(0, 0, 0, 0);
}
.page-header > div {
    /* 文字不折行 */
    white-space: nowrap;
}

.page-header .tab1 {
    text-align: right;
    padding-right: 0.15rem;
}

.page-header .tab2 {
    padding-left: 0.15rem;
    padding-right: 0.15rem;
}

.page-header .tab3 {
    padding-left: 0.15rem;
}

.page-header span.active {
    font-size: 0.34rem;
    color: #fff;
    position: relative;
}

.page-header span.active::after {
    content: "";
    position: absolute;
    right: -0.1rem;
    bottom: -0.05rem;
    width: 0.2rem;
    height: 0.2rem;
    background-image: url("https://static.yaame.io/admin/02de04edd2dd48ea73787a57e6e546c9.png");
    background-size: 0.2rem 0.2rem;
}

.empty {
    /* padding: 0 0 .5rem; */
    text-align: center;
    font-size: 0.28rem;
    color: #666;
    font-weight: normal;
    margin-top: -0.5rem;
}

.empty img {
    width: 1.4rem;
    height: auto;
    margin-bottom: 0.2rem;
}

.empty p {
    color: #999;
    font-size: 0.28rem;
}

/* 跳动的音符 */
.voice {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    height: 100%;
    width: 0.24rem;
}

.voice > img {
    width: 0.22rem;
    height: 0.22rem;
    margin-top: 0.04rem;
    position: relative;
    top: 0.04rem;
}

.voice i {
    display: inline-block;
    border-left: 2px solid #fff;
    margin: 0 1px;
    position: relative;
}

.voice i.first {
    height: 0.12rem;
    animation: first 0.5s linear 0s infinite alternate;
}

.voice i.second {
    height: 0.08rem;
    animation: second 1s linear 0s infinite alternate;
}

.voice i.three {
    height: 0.1rem;
    animation: three 0.8s linear 0s infinite alternate;
}

.voice i.four {
    height: 0.16rem;
    animation: four 0.6s linear 0s infinite alternate;
}

@keyframes first {
    0% {
        height: 0.08rem;
    }

    50% {
        height: 0.12rem;
    }

    100% {
        height: 0.14rem;
    }
}

@keyframes second {
    0% {
        height: 0.16rem;
    }

    50% {
        height: 0.13rem;
    }

    100% {
        height: 0.11rem;
    }
}

@keyframes three {
    0% {
        height: 0.18rem;
    }

    50% {
        height: 0.16rem;
    }

    100% {
        height: 0.14rem;
    }
}

@keyframes four {
    0% {
        height: 0.14rem;
    }

    50% {
        height: 0.12rem;
    }

    100% {
        height: 0.09rem;
    }
}

.pos_fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #fff;
    width: 100vw;
    padding: 0.3rem;
    margin-bottom: 0rem;
    height: 1.2rem;
    border-radius: 0.3rem 0.3rem 0px 0px;
    box-shadow: 0px -0.02rem 0.15rem 0px rgba(0, 0, 0, 0.08);
}

.active.colorBlue {
    color: #696fdd !important;
}

.active.colorPink {
    color: #fe548d !important;
}

.active.colorYellow {
    color: #f4a75c !important;
}
.active.colorLover {
    color: #FE548D !important;
}
.active.colorBestie {
    color: #6278FE !important;
}
.user-info {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    width: 7.5rem;
    height: 1.19rem;
    background: #ffffff;
    box-shadow: 0px -2px 0.15rem 0px rgba(0, 0, 0, 0.08);
    border-radius: 0.3rem 0.3rem 0px 0px;
    display: flex;
    font-size: 0.28rem;
    align-items: center;
    padding-left: 0.3rem;
}

.rank-null {
    font-size: 0.24rem;
    width: 1.05rem;
    text-align: center;
    color: #666;
}

.top1-tag-live {
    position: absolute;
    width: 1.02rem;
    height: 0.36rem;
    background-image: url("https://static.yaame.io/admin/18d3bdb0cb9d790e967c7fcd3bfb9627.png");
    background-size: 1.02rem 0.36rem;
    background-repeat: no-repeat;
    z-index: 3;
    bottom: 0.36rem;
    left: 0.18rem;
    position: relative;
    padding-bottom: 0.12rem;
    padding-left: 0.12rem;
}

.top-tag-live-zh-cn {
    background-image: url("https://static.yaame.io/admin/18d3bdb0cb9d790e967c7fcd3bfb9627.png");
}

.top-tag-live-en {
    background-image: url("https://static.yaame.io/admin/d7d998347a571048027070380e3ffa44.png");
}

.top-tag-live-id {
    background-image: url("https://static.yaame.io/admin/51592be22fe4416629152e4b6bc23ca8.png");
}

.top-tag-live-ar {
    background-image: url("https://static.yaame.io/admin/09ab354bf939ba6aab9429c191f90d10.png");
}

.top2-tag-live {
    transform: scale(0.75);
    margin-top: 0.06rem;
}

.room-search {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.3rem;
}

.time-select {
    width: 1.88rem;
    height: 0.54rem;
    background: #f4f4f4;
    border-radius: 0.27rem;
    display: flex;
    color: #777777;
    padding: 0.04rem;
    overflow: hidden;
    font-size: 0.24rem;
}

.time-select > div {
    width: 0.9rem;
    text-align: center;
    height: 0.46rem;
    line-height: 0.46rem;
    /* background-color: black; */
}

.time-select-active {
    background-color: #fff;
    border-radius: 0.25rem;
    color: #000;
    font-weight: 600;
}

.room-select {
    font-size: 0.3rem;
    font-weight: 600;
    color: #333333;
    position: relative;
}

.room-select > img {
    width: 0.3rem;
    vertical-align: middle;
}

.dropdown-menu {
    width: 2.81rem;
    background: #ffffff;
    box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0.27rem;
    position: absolute;
    top: calc(100%);
    left: 0;
    z-index: 99;
    padding: 0.1rem 0.3rem;
}

.dropdown-menu > div {
    width: 2.2rem;
    height: 0.82rem;
    text-align: center;
    line-height: 0.82rem;
    font-size: 0.3rem;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    border-bottom: 1px solid #eee;
}

.dropdown-menu > div:last-child {
    border-bottom: none;
}
</style>

<style lang="less" scoped>
.cp-header {
    width: 7.5rem;
    height: 8.2rem;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    background-size: 7.5rem auto;
    background-repeat: no-repeat;
    &.Lover {
        background-image: url(https://yaame-static.yaame.io/admin/44141e4d1be39a2a76d859b16020383b.png);
    }
    &.Bestie {
        background-image: url(https://yaame-static.yaame.io/admin/418edff863c7a727a9f658c3d2f0a24d.png);
    }
    .cp-top-list {
        width: 7.5rem;
        height: 5.2rem;
        position: absolute;
        top: 2.5rem;
        left: 0;
        .top-0 {
            width: 5.2rem;
            height: 2.2rem;
            background-size: 5.2rem auto;
            background-repeat: no-repeat;
            background-position: center center;
            position: absolute;
            top: 0;
            left: 1.15rem;
            background-image: url(https://yaame-static.yaame.io/admin/560a6093da7146eba004e1a34c58c307.png);
            .cp-avatar {
                width: 1.32rem;
                height: 1.32rem;
                background-size: 1.32rem 1.32rem;
                background-repeat: no-repeat;
                background-position: center center;
                position: absolute;
                background-image: url(https://yaame-static.yaame.io/admin/eef138c7f78bb71b7af44f82adacd998.png);
                display: flex;
                justify-content: center;
                align-items: center;
                display: block;
                border-radius: 50%;
                img {
                    width: 1.36rem;
                    height: auto;
                    display: block;
                    border-radius: 50%;
                    position: absolute;
                    top: -0.02rem;
                    left: -0.02rem;
                }
            }
            .left-avatar {
                top: 0.58rem;
                left: 1.41rem;
            }
            .right-avatar {
                top: 0.58rem;
                right: 1.41rem;
                z-index: 1;
            }
            .hear-img {
                width: 0.68rem;
                height: 0.68rem;
                position: absolute;
                top: 0.94rem;
                left: 49%;
                transform: translateX(-50%);
                z-index: 2;
            }
        }
        .top-1 {
            width: 3.66rem;
            height: 1.54rem;
            background-size: 3.66rem auto;
            background-repeat: no-repeat;
            background-position: center center;
            position: absolute;
            top: 2.95rem;
            left: 0.09rem;
            background-image: url(https://yaame-static.yaame.io/admin/9a129308d957e83d9fbca61adc45261d.png);
            .cp-avatar {
                width: 0.92rem;
                height: 0.92rem;
                background-size: 0.92rem 0.92rem;
                background-repeat: no-repeat;
                background-position: center center;
                position: absolute;
                background-image: url(https://yaame-static.yaame.io/admin/776334465f2c7d8adc0e5f8fad5b60d9.png);
                display: flex;
                justify-content: center;
                align-items: center;
                display: block;
                border-radius: 50%;
                img {
                    width: 0.96rem;
                    height: auto;
                    display: block;
                    border-radius: 50%;
                    position: absolute;
                    top: -0.02rem;
                    left: -0.02rem;
                }
            }
            .left-avatar {
                top: 0.41rem;
                left: 0.99rem;
            }
            .right-avatar {
                top: 0.41rem;
                right: 0.98rem;
                z-index: 1;
            }
            .hear-img {
                width: 0.48rem;
                height: 0.48rem;
                position: absolute;
                top: 0.64rem;
                left: 49%;
                transform: translateX(-50%);
                z-index: 2;
            }
        }
        .top-2 {
            width: 3.66rem;
            height: 1.54rem;
            background-size: 3.66rem auto;
            background-repeat: no-repeat;
            background-position: center center;
            position: absolute;
            top: 2.95rem;
            right: 0.09rem;
            background-image: url(https://yaame-static.yaame.io/admin/7cb674565f6d846584593b639a7c8d65.png);
            .cp-avatar {
                width: 0.92rem;
                height: 0.92rem;
                background-size: 0.92rem 0.92rem;
                background-repeat: no-repeat;
                background-position: center center;
                position: absolute;
                background-image: url(https://yaame-static.yaame.io/admin/9e12bfc2c39bd55b399095df1d8234a6.png);
                display: flex;
                justify-content: center;
                align-items: center;
                display: block;
                border-radius: 50%;
                img {
                    width: 0.96rem;
                    height: auto;
                    display: block;
                    border-radius: 50%;
                    position: absolute;
                    top: -0.02rem;
                    left: -0.02rem;
                }
            }
            .left-avatar {
                top: 0.41rem;
                left: 0.99rem;
            }
            .right-avatar {
                top: 0.41rem;
                right: 0.98rem;
                z-index: 1;
            }
            .hear-img {
                width: 0.48rem;
                height: 0.48rem;
                position: absolute;
                top: 0.64rem;
                left: 49%;
                transform: translateX(-50%);
                z-index: 2;
            }
        }
        .cp-top-name {
            width: 2.7rem;
            height: 0.36rem;
            background-size: 2.7rem auto;
            background-repeat: no-repeat;

            position: absolute;
            left: 50%;
            bottom: -0.36rem;
            transform: translateX(-50%);
            display: flex;
            font-size: 0.24rem;
            color: #fff;
            &.Lover {
                background-image: url(https://yaame-static.yaame.io/admin/f58fd8213860dcbf8a547590e53a0c5d.png);
            }
            &.Bestie {
                background-image: url(https://yaame-static.yaame.io/admin/ce669bb22a133a06efdd33030736efe6.png);
            }
            div {
                flex: 1;
                &:nth-child(1) {
                    padding-right: 0.1rem;
                    text-align: right;
                }
                &:nth-child(2) {
                    padding-left: 0.1rem;
                    text-align: left;
                }
            }
        }
        .cp-top-value {
            width: 2.7rem;
            height: 0.36rem;
            position: absolute;
            left: 50%;
            bottom: -0.76rem;
            transform: translateX(-50%);
            font-size: 0.22rem;
            color: #fff;
            text-align: center;
            &.Lover {
                color: #F75A88;
            }
            &.Bestie {
                color: #C4CCFF;
            }
            img {
                width: 0.28rem;
                height: 0.28rem;
                vertical-align: middle;
            }
        }
    }
}
.cp-container {
    width: 100%;
    background-color: #fff;
    border-top-right-radius: 0.3rem;
    border-top-left-radius: 0.3rem;
    position: absolute;
    top: 7.8rem;
    left: 0;
    z-index: 4;
    padding: 0.3rem 0.3rem 1.79rem;
    min-height: 5rem;
    .cp-tab {
        width: 4.84rem;
        height: 0.8rem;
        border-radius: 0.4rem;
        border: 0.01rem solid #FFFFFF;
        font-size: 0.26rem;
        margin-left: 1rem;
        display: flex;
        margin-bottom: 0.4rem;
        &.Lover {
            background: #FFF6F3;
            color: #F2518E;
            .active {
                background-image: url(https://yaame-static.yaame.io/admin/bef0b8011459806e3f4e5f95b08fd979.png);
            }
        }
        &.Bestie {
            background: #F3F8FF;
            color: #6278FE;
            .active {
                background-image: url(https://yaame-static.yaame.io/admin/bddb4c05fd1a07fe04b00085ef2e8000.png);
            }
        }
        .active {
            color: #fff;
            background-size: contain;
            background-repeat: no-repeat;
            font-weight: bold;
        }
        div {
            width: 2.36rem;
            text-align: center;
            line-height: 0.68rem;
            height: 0.68rem;
            margin: 0.06rem;
        }
    }

    .empty {
        margin-top: 0;
    }

    .cp-list-item {
        display: flex;
        align-items: center;
        height: 1rem;
        margin-bottom: 0.5rem;
        font-size: 0.26rem;
        color: #666666;

        &.Lover {
            .cp-item-avatar {
                background: linear-gradient(180deg, rgba(255, 211, 211, 1), rgba(255, 167, 237, 1));
            }
        }
        &.Bestie {
            .cp-item-avatar {
                background: linear-gradient(180deg, rgba(154, 233, 255, 1), rgba(127, 135, 255, 1));
            }
        }
        .rank {
            width: 0.86rem;
            text-align: center;
        }
        .user-avatar {
            width: 1.72rem;
            height: 0.9rem;
            position: relative;
            .cp-item-avatar {
                width: 0.9rem;
                height: 0.9rem;
                border-radius: 50%;
                position: absolute;
                top: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 0.84rem;
                    height: 0.84rem;
                    border-radius: 50%;
                    display: block;
                    margin: 0;
                }
            }
            .left-avatar {
                left: 0;
            }
            .right-avatar {
                left: 0.82rem;
            }
            .hear-img {
                width: 0.48rem;
                height: 0.48rem;
                position: absolute;
                top: 0.21rem;
                left: 0.62rem;
            }
        }

        .user-name {
            width: 3.47rem;
            padding-top: 0.08rem;
            padding-left: 0.2rem;
            padding-bottom: 0.08rem;
        }
        .user-value {
            width: 1.2rem;
            img {
                width: 0.28rem;
                height: 0.28rem;
                vertical-align: middle;
            }
        }
    }
}
.cp-user-info {
    width: 7.5rem;
    height: 1.2rem;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #FFFFFF;
    box-shadow: 0px -0.02rem 0.15rem 0 rgba(0,0,0,0.08);
    border-radius: 0.3rem 0.2rem 0 0;
    font-size: 0.26rem;
    color: #666666;
    z-index: 9;
    display: flex;
    align-items: center;
    padding-left: 0.2rem;
    &.Lover {
        .cp-item-avatar {
            background: linear-gradient(180deg, rgba(255, 211, 211, 1), rgba(255, 167, 237, 1));
        }
    }
    &.Bestie {
        .cp-item-avatar {
            background: linear-gradient(180deg, rgba(154, 233, 255, 1), rgba(127, 135, 255, 1));
        }
    }
    .rank {
        width: 0.86rem;
        text-align: center;
    }
    .user-avatar {
        width: 1.72rem;
        height: 0.9rem;
        position: relative;
        .cp-item-avatar {
            width: 0.9rem;
            height: 0.9rem;
            border-radius: 50%;
            position: absolute;
            top: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            img {
                width: 0.84rem;
                height: 0.84rem;
                border-radius: 50%;
                display: block;
                margin: 0;
            }
        }
        .left-avatar {
            left: 0;
        }
        .right-avatar {
            left: 0.82rem;
        }
        .hear-img {
            width: 0.48rem;
            height: 0.48rem;
            position: absolute;
            top: 0.21rem;
            left: 0.62rem;
        }
    }

    .user-name {
        width: 3.47rem;
        padding-top: 0.08rem;
        padding-left: 0.2rem;
        padding-bottom: 0.08rem;
    }
    .user-value {
        width: 1.2rem;
        img {
            width: 0.28rem;
            height: 0.28rem;
            vertical-align: middle;
        }
    }
}
.cp-invite-btn {
    width: 4.7rem;
    height: 1rem;
    position: fixed;
    bottom: 0.3rem;
    left: 1.4rem;
    background-size: contain;
    background-repeat: no-repeat;
    color: #fff;
    text-align: center;
    line-height: 1rem;
    font-size: 0.32rem;
    font-weight: 600;
    z-index: 9;
    &.Lover {
        background-image: url(https://yaame-static.yaame.io/admin/3eb465d96b166c4a3bd9f52c50196b25.png);
    }
    &.Bestie {
        background-image: url(https://yaame-static.yaame.io/admin/a54accd91819b08249851aabe29502c4.png);
    }
}
.bestie-user-info {
    min-height: 1.63rem;
    width: 7.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;
    background: #fff;
    box-shadow: 0px -0.02rem 0.15rem 0px rgba(0, 0, 0, 0.08);
    border-radius: 0.3rem 0.3rem 0px 0px;
    padding-top: 0.58rem;
    &.length-1 {
        height: 1.19rem;
        padding-top: 0;
        display: flex;
        align-items: center;
        min-height: 0;
        .bestie-list-item {
            margin-bottom: 0;
        }
    }
    .toggle-img {
        width: 0.56rem;
        height: 0.14rem;
        top: 0.2rem;
        left: 50%;
        transform: translateX(-50%);
        position: absolute;
    }
    .bestie-list-item {
        display: flex;
        align-items: center;
        height: 1rem;
        margin-bottom: 0.5rem;
        font-size: 0.26rem;
        color: #666666;
        //&.bottom-item {
        //    position: absolute;
        //    left: 0.2rem;
        //    bottom: 0.15rem;
        //}
        &.Lover {
            .cp-item-avatar {
                background: linear-gradient(180deg, rgba(255, 211, 211, 1), rgba(255, 167, 237, 1));
            }
        }
        &.Bestie {
            .cp-item-avatar {
                background: linear-gradient(180deg, rgba(154, 233, 255, 1), rgba(127, 135, 255, 1));
            }
        }
        .rank {
            width: 0.86rem;
            text-align: center;
        }
        .user-avatar {
            width: 1.72rem;
            height: 0.9rem;
            position: relative;
            .cp-item-avatar {
                width: 0.9rem;
                height: 0.9rem;
                border-radius: 50%;
                position: absolute;
                top: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                img {
                    width: 0.84rem;
                    height: 0.84rem;
                    border-radius: 50%;
                    display: block;
                    margin: 0;
                }
            }
            .left-avatar {
                left: 0;
            }
            .right-avatar {
                left: 0.82rem;
            }
            .hear-img {
                width: 0.48rem;
                height: 0.48rem;
                position: absolute;
                top: 0.21rem;
                left: 0.62rem;
            }
        }

        .user-name {
            width: 3.47rem;
            padding-top: 0.08rem;
            padding-left: 0.2rem;
            padding-bottom: 0.08rem;
        }
        .user-value {
            width: 1.2rem;
            img {
                width: 0.28rem;
                height: 0.28rem;
                vertical-align: middle;
            }
        }
    }
    .more-info {
        width: 7.5rem;
        margin-bottom: 0.2rem;
        overflow: hidden scroll;
        padding: 0 0.2rem;
        .bestie-list-item {
            width: 7.1rem;
            height: 1.5rem;
            background: #F2F4FF;
            border-radius: 0.24rem;
            margin-bottom: 0.2rem;
        }
    }
}
</style>
