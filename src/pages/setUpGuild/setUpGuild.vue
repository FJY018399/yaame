<template>
	<div class="main">
    <!-- 标题 -->
    <Header color="blank" :title="$t('create_guild')" :keep="true">{{ $t('create_guild') }}</Header>
    <!-- 搜索 -->
    <van-search
      v-model="yaameId"
      shape="round"
      :placeholder="$t('enter_yaame_id')"
      class="search"
      left-icon=""
    >
      <template #right-icon>
        <van-icon class="search-button" name="search" @click="search" />
      </template>
    </van-search>
    <!-- 用户 -->
    <div class="my-list" v-if="avatar">
      <div class="frame">
        <div class="title">{{ $t('user_avatar') }}</div>
        <img :src="avatar" alt="">
      </div>
      <div class="frame">
        <div class="title">{{ $t('user_nickname') }}</div>
        <span class="no-wrap">{{ myName }}</span>
      </div>
      <div class="frame">
        <div class="title">{{ $t('yaame_id') }}</div>
        <span>{{ showYaameId }}</span>
      </div>
      <div class="frame" v-if="!guild && !black">
        <div class="title">{{ $t('guild_name') }}</div>
        <van-field v-model="data.guildName" :placeholder="$t('enter_guild_name')" />
      </div>
      <!-- <div class="frame" v-if="!guild && !black">
        <div class="title">{{ $t('country_manager') }}</div>
        <van-field
          v-model="guildNationManagerName"
          is-link
          readonly
          :placeholder="$t('select_country_manager')"
          @click="show = true"
        />
      </div> -->
    </div>
    <van-popup v-model="show" round position="bottom">
      <van-picker
        show-toolbar
        :columns="guildNationManagerList"
        @confirm="onConfirm"
        @cancel="show = false"
      >
        <template slot="confirm">{{ $t('confirm') }}</template>
        <template slot="cancel">{{ $t('cancel') }}</template>
      </van-picker>
    </van-popup>
    <van-button v-if="avatar && !black && !guild" class="buttom" round type="info" block :disabled="!data.guildName" @click="establish">
      {{ $t('create_guild_button') }}</van-button>
    <van-button v-else-if="avatar" class="buttom" round color="#ccc" block>{{ black ? $t('account_error') : guild ? $t('guild_already_exists') : '' }}</van-button>
	</div>
</template>

<script setup>
import Header from "@/components/common/header.vue";
import {getCurrentInstance, ref} from "vue";
import {getGuildCreateApi, getSearchApi} from "@/pages/setUpGuild/api";
import {Toast} from "vant";

// 获取国际化函数
const root = getCurrentInstance();
const t = (val) => {
  return root.proxy.$i18n.t(val);
};

// 搜索yaameid
const yaameId = ref('');
// 展示yaameid
const showYaameId = ref('');
const avatar = ref('');
const myName = ref('');
const guildNationManager = ref([]);
const guildNationManagerList = ref([]);
// 展示当前name
const guildNationManagerName = ref('');

// 封禁状态
const black = ref(0);
// 是否公会成员
const guild = ref(0);
const search = async () => {
  try {
    if (!yaameId.value) {
      Toast(t('please_enter_yaame_id'))
      return;
    }
    Toast.loading({
      message: t('loadingText'),
      forbidClick: true,
    });
    const res = await getSearchApi({
      yaame_id: yaameId.value,
    })
    Toast.clear();
    if (res.status !== 1000) return;
    if (!Object.keys(res.data).length) {
      Toast(t('no_results_found'));
      return;
    }
    showYaameId.value = res.data.yaame_id;
    avatar.value = res.data.avatar;
    myName.value = res.data.nickname;
    black.value = res.data.black;
    guild.value = res.data.guild;
    guildNationManager.value = res.data.guild_nation_managers;
    guildNationManagerList.value = res.data.guild_nation_managers.map(item => item.name);
    data.value.targetUid = res.data.uid;
  } catch (err) {
    console.log(err);
  }
}
// 创建公会
const data = ref({
  targetUid: null,
  guildName: '',
//   guildNationManager: '',
});

const establish = async () => {
  try {
    Toast.loading({
      message: t('loadingText'),
      forbidClick: true,
    });
    const res = await getGuildCreateApi({
      ...data.value
    })
    Toast.clear();
    if (res.status !== 1000) {
      Toast(res.desc);
      return;
    }
    Toast(t('settings_saved'));
    // 清空页面
    yaameId.value = '';
    avatar.value = '';
    data.value.guildName = '';
    guildNationManagerName.value = '';
  } catch (err) {
    console.log(err);
  }
}

// 选择经理弹窗
const show = ref(false);
const onConfirm = (value, index) => {
  show.value = false;
  guildNationManagerName.value = value;
  data.value.guildNationManager = guildNationManager.value[index].value;
}
</script>

<style lang="less" scoped>
.main {
  min-height: 100vh;
  overflow: hidden;
  .search {
    margin-top: 1.6rem;
    .search-button {
      margin-left: .3rem;
    }
  }
  .my-list {
    margin-left: .5rem;
    .frame {
      height: .8rem;
      display: flex;
      align-items: center;
      margin: .2rem;
      .title {
        min-width: 1.5rem;
        font-size: 0.28rem;
        margin-right: .2rem;
        white-space: nowrap;
      }
      img {
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
      }
      span {
        font-size: .3rem;
        margin-left: .2rem;
      }
    }
  }
  .buttom {
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
  }
}
</style>