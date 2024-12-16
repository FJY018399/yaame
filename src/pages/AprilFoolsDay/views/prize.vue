<template>
    <div class="container">
        <custom-header :custom_back="true" color="white" @onCustomBack="back" />

        <!-- top1 -->
        <div class="prize-card card-large">
            <div class="card-title">{{ $t(`Top 1`) }}</div>
            <div class="prize-item">
                <div class="prize-box">
                    <!-- <div class="prize-tag">7days</div> -->
                    <div class="prize-img prize-img_1_1"></div>
                </div>
                <div class="prize-name">{{ $t("Diamonds") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 20000 </span>
                </div>
            </div>
            <div class="prize-item">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_1_2"></div>
                </div>
                <div class="prize-name">{{ $t("Clown king") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 10000 </span>
                </div>
            </div>
            <div class="prize-item">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_1_3"></div>
                </div>
                <div class="prize-name">{{ $t("Clown king") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 10000 </span>
                </div>
            </div>
            <div class="prize-item large">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_1_4"></div>
                </div>
                <div class="prize-name">{{ $t("Clown king") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 10000 </span>
                </div>
            </div>
            <div class="prize-item large">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_1_5"></div>
                </div>
                <div class="prize-name">{{ $t("Clown king") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 20000 </span>
                </div>
            </div>
        </div>
        <!-- top2 -->
        <div class="prize-card card-large">
            <div class="card-title">{{ $t(`Top 2`) }}</div>
            <div class="prize-item">
                <div class="prize-box">
                    <!-- <div class="prize-tag">7days</div> -->
                    <div class="prize-img prize-img_2_1"></div>
                </div>
                <div class="prize-name">{{ $t("Diamonds") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 15000 </span>
                </div>
            </div>
            <div class="prize-item">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_2_2"></div>
                </div>
                <div class="prize-name">{{ $t("Clown duke") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 8000 </span>
                </div>
            </div>
            <div class="prize-item">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_2_3"></div>
                </div>
                <div class="prize-name">{{ $t("Clown duke") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 8000 </span>
                </div>
            </div>
            <div class="prize-item large">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 15 }) }}</div>
                    <div class="prize-img prize-img_2_4"></div>
                </div>
                <div class="prize-name">{{ $t("Clown duke") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 8000 </span>
                </div>
            </div>
            <div class="prize-item large">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_2_5"></div>
                </div>
                <div class="prize-name">{{ $t("Clown duke") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 15000 </span>
                </div>
            </div>
        </div>
        <!-- top3 -->
        <div class="prize-card card-large">
            <div class="card-title">{{ $t(`Top 3`) }}</div>
            <div class="prize-item">
                <div class="prize-box">
                    <!-- <div class="prize-tag">7days</div> -->
                    <div class="prize-img prize-img_3_1"></div>
                </div>
                <div class="prize-name">{{ $t("Diamonds") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 10000 </span>
                </div>
            </div>
            <div class="prize-item">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_3_2"></div>
                </div>
                <div class="prize-name">{{ $t("Clown marquis") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 6000 </span>
                </div>
            </div>
            <div class="prize-item">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_3_3"></div>
                </div>
                <div class="prize-name">{{ $t("Clown marquis") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 6000 </span>
                </div>
            </div>
            <div class="prize-item large">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_3_4"></div>
                </div>
                <div class="prize-name">{{ $t("Clown marquis") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 10000 </span>
                </div>
            </div>
        </div>
        <!-- top4 -->
        <div class="prize-card">
            <div class="card-title">{{ $t(`Top 4`) }}</div>
            <div class="prize-item">
                <div class="prize-box">
                    <!-- <div class="prize-tag">7days</div> -->
                    <div class="prize-img prize-img_4_1"></div>
                </div>
                <div class="prize-name">{{ $t("Diamonds") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 8000 </span>
                </div>
            </div>
            <div class="prize-item">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_4_2"></div>
                </div>
                <div class="prize-name">{{ $t("Clown Count") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 4000 </span>
                </div>
            </div>
            <div class="prize-item">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_4_3"></div>
                </div>
                <div class="prize-name">{{ $t("Clown Count") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 4000 </span>
                </div>
            </div>
        </div>
        <!-- top5 -->
        <div class="prize-card">
            <div class="card-title">{{ $t(`Top 5`) }}</div>
            <div class="prize-item">
                <div class="prize-box">
                    <!-- <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div> -->
                    <div class="prize-img prize-img_5_1"></div>
                </div>
                <div class="prize-name">{{ $t("Diamonds") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 5000 </span>
                </div>
            </div>
            <div class="prize-item">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_5_2"></div>
                </div>
                <div class="prize-name">{{ $t("Clown Viscount") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 4000 </span>
                </div>
            </div>
            <div class="prize-item">
                <div class="prize-box">
                    <div class="prize-tag">{{ $t("{n}days", { n: 30 }) }}</div>
                    <div class="prize-img prize-img_5_3"></div>
                </div>
                <div class="prize-name">{{ $t("Clown Viscount") }}</div>
                <div class="prize-value">
                    <img class="diamond" src="../../../assets/img/AprilFoolsDay/diamond.png" alt="" />
                    <span> 4000 </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import customHeader from "@/components/common/header.vue";
import { getRankRewardsAPI } from "../api";
import { getLanguage } from "../../../lib/device";

const languageMap = {
    en: "ENGLISH",
    id: "INDONESIAN",
    zh: "ZH_CN",
    tw: "ZH_FT",
    ar: "ARABIC",
};

export default {
    components: { customHeader },
    data() {
        return {
            locale: "en",
            list: [],
        };
    },
    created() {
        document.title = this.$t("April Fool's Day");

        this.locale = this.$route.query.language || getLanguage() || "en";
        if (["zh-hk", "zh-tw", "zh-mo", "zh-cn"].indexOf(this.locale) > -1) {
            let localEnum = {
                "zh-hk": "tw",
                "zh-tw": "tw",
                "zh-mo": "tw",
                "zh-cn": "zh",
            };
            this.locale = localEnum[this.locale];
        }

        // this.query();
    },
    methods: {
        query() {
            getRankRewardsAPI({ languageType: languageMap[this.locale] }).then((res) => {
                if (res.status === 1000) {
                    this.list = res.data.fools_day_rank_reward_item_list;
                }
            });
        },
        back() {
            this.$router.go(-1);
        },
    },
};
</script>
<style scoped lang="less">
.prize-img_1_1 {
    background-image: url("../../../assets/img/AprilFoolsDay/diamonds/12000.png");
}
.prize-img_1_2 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/1/2.png");
}
.prize-img_1_3 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/1/3.png");
}
.prize-img_1_4 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/1/4.png");
}
.prize-img_1_5 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/1/5.png");
}

.prize-img_2_1 {
    background-image: url("../../../assets/img/AprilFoolsDay/diamonds/12000.png");
}
.prize-img_2_2 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/2/2.png");
}
.prize-img_2_3 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/2/3.png");
}
.prize-img_2_4 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/2/4.png");
}
.prize-img_2_5 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/2/5.png");
}

.prize-img_3_1 {
    background-image: url("../../../assets/img/AprilFoolsDay/diamonds/9000.png");
}
.prize-img_3_2 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/3/2.png");
}
.prize-img_3_3 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/3/3.png");
}
.prize-img_3_4 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/3/4.png");
}

.prize-img_4_1 {
    background-image: url("../../../assets/img/AprilFoolsDay/diamonds/8000.png");
}
.prize-img_4_2 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/4/2.png");
}
.prize-img_4_3 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/4/3.png");
}

.prize-img_5_1 {
    background-image: url("../../../assets/img/AprilFoolsDay/diamonds/4000.png");
}
.prize-img_5_2 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/5/2.png");
}
.prize-img_5_3 {
    background-image: url("../../../assets/img/AprilFoolsDay/prize/5/3.png");
}

.container {
    min-height: 100vh;
    background-color: #280130;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;
    padding-bottom: 0.42rem;
    background-repeat: no-repeat;
    background-position: top;
    background-size: contain;
    background-image: url("../../../assets/img/AprilFoolsDay/grid-bg.png");
    .prize-card {
        padding-top: 1.04rem;
        box-sizing: border-box;
        position: relative;
        width: 7.22rem;
        height: 4.05rem;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        background-image: url("../../../assets/img/AprilFoolsDay/rank-bg-2.png");
        margin-top: 1.05rem;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        &.card-large {
            height: 8.34rem;
            background-image: url("../../../assets/img/AprilFoolsDay/rank-bg-1.png");
        }
        .card-title {
            position: absolute;
            width: 4.86rem;
            height: 1.8rem;
            font-size: 0.32rem;
            line-height: 0.48rem;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            padding-top: 0.8rem;
            text-align: center;
            box-sizing: border-box;
            left: 1.18rem;
            top: -0.91rem;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            background-image: url("../../../assets/img/AprilFoolsDay/rank-title.png");
        }
        .prize-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            font-size: 0.24rem;
            line-height: 0.33rem;
            margin: 0 0.08rem;
            &.large {
                .prize-box {
                    width: 3.15rem;
                    height: 3.41rem;
                }
            }
            .prize-box {
                position: relative;
                width: 2.04rem;
                height: 2.04rem;
                border-radius: 0.16rem;
                border: 0.01rem solid #f25efd;
                margin-bottom: 0.07rem;
                display: flex;
                justify-content: center;
                align-items: center;
                .prize-tag {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background-color: #9800ea;
                    color: #fff;
                    font-size: 0.24rem;
                    line-height: 0.33rem;
                    padding: 0 0.15rem;
                    border-bottom-left-radius: 0.15rem;
                    border-top-right-radius: 0.15rem;
                }
                .prize-img {
                    width: 80%;
                    height: 80%;
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                }
            }
            .prize-name {
                color: #fff;
                text-align: center;
            }
            .prize-value {
                color: #fff;
                text-align: center;
                display: flex;
                align-items: center;
                img {
                    width: 0.26rem;
                    height: 0.22rem;
                    margin-right: 0.04rem;
                }
                span {
                    line-height: 1;
                }
            }
        }
    }
}
</style>
