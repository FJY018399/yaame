<!--
 * @Author: Elk
 * @Date: 2024-06-21 15:08:57
 * @FilePath: /yaame-h5/src/pages/withdraw/views/create.vue
 * @Description: 
-->
<template>
  <div :style="{ paddingTop: safeHeight + 0.88 + 0.3 + 'rem' }" class="create">
    <Header keep :keepColor="false">{{
        method_config.method_name
      }}
    </Header>

    <pageLoading v-if="loading"></pageLoading>

    <div
      v-if="method_config.method_type === 'BANK_TRANSFER'"
      class="form-container"
    >
      <div class="form-item">
        <div v-if="method_config.country_type === 'INDONESIA' || method_config.country_type === 'PHILIPPINES' || method_config.country_type === 'EGYPT'"
             class="label">{{ $t("select_bank") }}
        </div>
        <div v-if="method_config.country_type === 'MALAYSIA'" class="label">{{ $t("bank_code") }}</div>
        <div
          v-if="method_config.country_type === 'INDONESIA' || method_config.country_type === 'PHILIPPINES' || method_config.country_type === 'EGYPT'"
          class="select"
          @click="bankVisible = true"
        >
          {{ bankName ? bankName : $t("select_bank_tips") }}
          <img
            src="https://yaame-static.yaame.io/admin/abf6d8891e7ad267eabc388b2178f185.png"
            alt=""
          />
        </div>

        <div class="input-container">
          <input
            v-if="method_config.country_type === 'MALAYSIA'"
            v-model="bank_account.bank_code"
            class="input"
            type="text"
          />
          <img v-if="method_config.country_type === 'MALAYSIA'" class="info-icon"
               src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.bank_code_tip)">
        </div>
      </div>

      <div class="form-item">
        <div class="label">{{ $t("recipient_bank_account") }}</div>
        <div class="input-container">
          <!-- 新加银行账号提现验证判断 method_config.country_type === 'SINGAPORE'-->
          <input
            v-model="bank_account.card_no"
            class="input"
            type="text"
            @input="method_config.country_type === 'SINGAPORE' ? handleNumInputSingapore($event) : handleNumInput($event)"
          />
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.bank_card_no_tip)">
        </div>
      </div>

      <div class="form-item">
        <div class="label">{{ $t('recipient_full_name') }}</div>
        <div class="input-container">
          <!-- 菲律宾提使用字符数量限制 -->
          <input
            v-model="bank_account.account_name"
            class="input"
            type="text"
            @input="method_config.country_type === 'PHILIPPINES' ? handleNameInputPHILIPPINES($event) : method_config.country_type === 'SINGAPORE' ? handleNameInputSINGAPORE($event) : handleNameInput($event)"
          />
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.account_name_tip)">
        </div>
      </div>

      <!-- 新加坡提现方式 -->
      <div class="form-item" v-if="method_config.country_type === 'SINGAPORE'">
        <div class="label">{{ $t('recipient_phone_number') }}</div>
        <div class="input-container">
          <input
            v-model="bank_account.payee_phone"
            class="input"
            type="text"
            @input="handlePayeePhone($event)"
          />
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.phone_tip)">
        </div>
      </div>
      <div class="form-item" v-if="method_config.country_type === 'SINGAPORE'">
        <div class="label">{{ $t('bank_code_ach') }}</div>
        <div class="input-container">
          <input
            v-model="bank_account.bank_code"
            class="input"
            type="text"
            @input="handleBankCode($event)"
          />
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.bank_name_tip)">
        </div>
      </div>
      <div class="form-item" v-if="method_config.country_type === 'SINGAPORE'">
        <div class="label">{{ $t('branch_code_ach') }}</div>
        <div class="input-container">
          <input
            v-model="bank_account.bank_branch"
            class="input"
            type="text"
            @input="handleBankBranch($event)"
          />
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.bank_branch_tip)">
        </div>
      </div>
      <div class="form-item" v-if="method_config.country_type === 'SINGAPORE'">
        <div class="label">{{ $t('recipient_bank_name') }}</div>
        <div class="input-container">
          <input
            v-model="bank_account.bank_name"
            class="input"
            type="text"
            @input="handleBankName($event)"
          />
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.bank_code_tip)">
        </div>
      </div>
      <!-- 新加坡提现方式结束 -->

      <!-- 菲律宾提现 -->
      <div class="form-item" v-if="method_config.country_type === 'PHILIPPINES'">
        <div class="label">{{ $t('recipient_phone_number') }}</div>
        <div class="input-container">
          <input
            v-model="bank_account.payee_phone"
            class="input"
            type="text"
            @input="handlePayeePhonePHILIPPINES($event)"
          />
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.phone_tip)">
        </div>
      </div>
    </div>

    <!-- 新加坡钱包提现 -->
    <div v-else-if="method_config.method_type === 'WALLET_PAYNON' && method_config.country_type === 'SINGAPORE'" class="form-container">
      <div class="form-item">
        <div class="label">{{ $t("recipient_account_type") }}</div>
        <div
          class="select"
          @click="singapore = true"
        >
          {{ singaporeName ? singaporeName : '' }}
          <img
            class="spread"
            src="https://yaame-static.yaame.io/admin/abf6d8891e7ad267eabc388b2178f185.png"
            alt=""
            @click="singapore = true"
          />
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click.stop="handleClickInfo(remind_tips.account_type_tip)">
        </div>
      </div>
      <div class="form-item">
        <div class="label">{{ singaporeName ? singaporeName : $t('recipient_account_number') }}</div>
        <div class="input-container">
          <input
            v-model="wallet_account.account_no"
            class="input"
            type="text"
            @input="wallet_account.account_type === 'M' ? accountNoPhone($event) : handleAccountNo($event)"
          />
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.account_name_tip)">
        </div>
      </div>
      <div class="form-item">
        <div class="label">{{$t('recipient_name')}}</div>
        <div class="input-container">
          <input
            v-model="wallet_account.account_name"
            class="input"
            type="text"
            @input="accountName($event)"
          />
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.payee_name_tip)">
        </div>
      </div>
    </div>
    <!-- 新加坡钱包提现结束 -->

    <div v-else-if="method_config.country_type === 'EGYPT' && method_config.channel_type !== 'PAGSMILE'" class="form-container">
        
        <div v-if="method_config.method_type === 'CARD'">
            <div class="form-item">
                <div 
                    class="label">{{ $t("select_bank") }}
                </div>
                <div class="select" @click="bankVisible = true">
                    {{ bankName ? bankName : $t("select_bank_tips") }}
                    <img
                        src="https://yaame-static.yaame.io/admin/abf6d8891e7ad267eabc388b2178f185.png"
                        alt=""
                    />
                </div>
            </div>
            <div class="form-item">
                <div class="label">{{ $t("recipient_bank_account") }}</div>
                <div class="input-container">
                <!-- 新加银行账号提现验证判断 method_config.country_type === 'SINGAPORE'-->
                <input
                    v-model="bank_account.card_no"
                    class="input"
                    type="text"
                    @input="handleNumInput($event)"
                />
                <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
                    @click="handleClickInfo(remind_tips.bank_card_no_tip)">
                </div>
            </div>

            <div class="form-item">
                <div class="label">{{ $t('recipient_full_name') }}</div>
                <div class="input-container">
                <!-- 菲律宾提使用字符数量限制 -->
                <input
                    v-model="bank_account.account_name"
                    class="input"
                    type="text"
                    @input="handleNameInput($event)"
                />
                <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
                    @click="handleClickInfo(remind_tips.account_name_tip)">
                </div>
            </div>
        </div>
        <template v-else>
            <div class="form-item">
                <div class="label">{{ $t('recipient_phone_number') }}</div>
                <div class="input-container">
                <input
                    v-model="wallet_account.account_no"
                    class="input"
                    type="text"
                    @input="handleEgyptPhone($event)"
                />
                <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
                    @click="handleClickInfo(remind_tips.phone_tip || remind_tips.account_no_tip)">
                </div>
            </div>
            <div class="form-item">
                <div class="label">{{ $t('recipient_full_name') }}</div>
                <div class="input-container">
                <!-- 菲律宾收款人全名要单独验证 -->
                <input v-model="wallet_account.account_name" @input="handleNameInput($event)" class="input" type="text"/>
                <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
                    @click="handleClickInfo(remind_tips.account_name_tip)">
                </div>
            </div>
            <div v-if="method_config.method_type === 'CASH_AMAN'" class="form-item">
                <div class="label">{{ $t('email') }}</div>
                <div class="input-container">
                <!-- 菲律宾收款人全名要单独验证 -->
                <input v-model="wallet_account.email" @input="handleEmail($event)" class="input" type="text"/>
                <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
                    @click="handleClickInfo(remind_tips.account_email_tip)">
                </div>
            </div>
        </template>
    </div>

    <div v-else-if="method_config.channel_type === 'PAGSMILE'" class="form-container">
        <div class="form-item">
            <div class="label">{{ $t('recipient_full_name') }}</div>
            <div class="input-container">
            <!-- 菲律宾收款人全名要单独验证 -->
            <input v-model="wallet_account.account_name" @input="handleNameInput($event)" class="input" type="text"/>
            <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
                @click="handleClickInfo(remind_tips.account_name_tip)">
            </div>
        </div>
        <div class="form-item">
            <div class="label">{{ $t('recipient_account_number') }}</div>
            <div class="input-container">
            <input v-model="wallet_account.account_no" class="input" type="text"/>
            <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
                @click="handleClickInfo(remind_tips.account_no_tip)">
            </div>
        </div>
    </div>

    <div v-else class="form-container">
        <template v-if="method_config.channel_type === 'EPAY'">
            <div v-if="method_config.method_type === 'EPAY'" class="form-item">
                <div class="label">{{ $t('recipient_account') }}</div>
                <div class="input-container">
                <input v-model="wallet_account.account_no" class="input" type="text"/>
                <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
                    @click="handleClickInfo(remind_tips.account_no_tip)">
                </div>
            </div>

            <div v-else class="form-item">
                <div class="label">{{ $t('recipient_wallet_address') }}</div>
                <div class="input-container">
                <input v-model="wallet_account.address" class="input" type="text"/>
                <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
                    @click="handleClickInfo(remind_tips.account_address_tip)">
                </div>
            </div>
        </template>
      <div v-else-if="method_config.country_type !== 'PHILIPPINES'" class="form-item">
        <div class="label">{{ $t('recipient_account_number') }}</div>
        <div class="input-container">
          <input v-model="wallet_account.account_no" class="input" type="text"/>
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.account_no_tip)">
        </div>
      </div>

      <!-- 菲律宾账号 -->
      <div v-else class="form-item">
        <div class="label">{{ $t('recipient_account_number') }}</div>
        <div class="input-container">
          <input v-model="wallet_account.account_no" @input="method_config.method_name !== 'LAZADAPH' && accountNoPhonePHILIPPINES($event)" class="input"
                 type="text"/>
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.account_no_tip)">
        </div>
      </div>

      <div v-if="payeeList.includes(method_config.method_type)" class="form-item">
        <div class="label">{{ $t('recipient_full_name') }}</div>
        <div class="input-container">
          <!-- 菲律宾收款人全名要单独验证 -->
          <input v-model="wallet_account.account_name" @input="method_config.country_type === 'PHILIPPINES' && accountNamePHILIPPINES($event)" class="input" type="text"/>
          <img class="info-icon" src="https://yaame-static.yaame.io/admin/2d4741aa18682cda328103f22c1e841b.png" alt=""
               @click="handleClickInfo(remind_tips.account_name_tip)">
        </div>
      </div>
    </div>

    <Popup
      v-model="bankVisible"
      position="bottom"
      round
      :style="{ height: '60%' }"
    >
      <div class="bank-container">
        <div
          v-for="(item, index) in support_banks"
          :key="index"
          class="bank-item"
          @click="handleClickBank(item)"
        >
          <img class="bank-icon" :src="item.icon" alt="" />
          <div class="bank-info-content">
            <div class="bank-name no-wrap">{{ item.bank_name }}</div>
            <div class="bank-coin-info">{{  $t('withdrawal_gold_range', [item.min_coin_amount, item.max_coin_amount]) }}</div>
          </div>
          <img
            v-show="bank_account.target_org !== item.target_org"
            class="select-icon"
            src="https://yaame-static.yaame.io/admin/d45a3cb3e453d0365b04948348537b83.png"
            alt=""
          />
          <img
            v-show="bank_account.target_org === item.target_org"
            class="select-icon"
            src="https://yaame-static.yaame.io/admin/d00f58d8111074293ccc41dfedd20047.png"
            alt=""
          />
        </div>
      </div>
    </Popup>

    <div v-show="showBtn" :class="['submit', submitStatus && 'disabled', submitStatus]" @click="submit">{{ $t("submit_info") }}</div>



    <PopupRef v-if="detailVisible" class="flex-container">
      <div class="detail-container">
        <p class="title">{{ $t("tips") }}</p>
        <div class="content">
          <p style="white-space: pre-line;">{{ detailText }}</p>
        </div>
        <div class="btn" @click="detailVisible = false">{{ $t("confirm") }}</div>
      </div>
    </PopupRef>

    <!-- 新加坡钱包提现选择框 -->
    <Popup
      v-model="singapore"
      position="bottom"
      round
    >
      <div class="bank-container">
        <div
          v-for="(item, index) in singaporeList"
          :key="index"
          class="bank-item"
          @click="singaporeBank(item)"
        >
          <div class="bank-name no-wrap">{{ item.bank_name }}</div>
          <template v-if="wallet_account && wallet_account.account_type">
            <img
                v-show="wallet_account.account_type !== item.account_type"
                class="select-icon"
                src="https://yaame-static.yaame.io/admin/d45a3cb3e453d0365b04948348537b83.png"
                alt=""
            />
            <img
                v-show="wallet_account.account_type === item.account_type"
                class="select-icon"
                src="https://yaame-static.yaame.io/admin/d00f58d8111074293ccc41dfedd20047.png"
                alt=""
            />
          </template>
        </div>
      </div>
    </Popup>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, getCurrentInstance } from "vue";
import { getLanguage, getSafeHeight } from "@/lib/device";
import pageLoading from "@/components/common/page_loading.vue";
import { Toast } from "vant";
import Header from "@/components/common/header.vue";
import {
  getWithdrawalAccountAPI,
  addEditWithdrawalAccountAPI,
} from "../api.js";
import { Popup } from "vant";
import PopupRef from "@/components/common/pop_up.vue";
const root = getCurrentInstance();
const router = root.proxy.$router;
const route = root.proxy.$route;

const t = (key) => {
  return root.proxy.$t(key);
};
let loading = ref(true);

let safeHeight = ref(0);
let safeArea = getSafeHeight() || 0;
safeHeight.value = (safeArea * 2) / 100;

let method_config = ref({
  method_type: "",
  channel_type: "",
  country_type: "",
});
let support_banks = ref([]);
let remind_tips = ref({});
const getWithdrawalAccount = async () => {
  let options = {
    channel_type: route.query.channel_type,
    method_type: route.query.method_type,
  };
  if (route.query.withdraw_account_id) {
    options.withdraw_account_id = route.query.withdraw_account_id;
  }
  const res = await getWithdrawalAccountAPI(options);
  if (res.status === 1000) {
    loading.value = false;

    method_config.value = res.data.method_config;
    support_banks.value = res.data.support_banks || [];
    remind_tips.value = res.data.remind_tips || {};
    if (res.data.withdraw_account) {
      if (method_config.value.method_type === 'BANK_TRANSFER') {
        bank_account.value = res.data.withdraw_account.bank_account;

        bankName.value = support_banks.value.find(item => item.target_org === res.data.withdraw_account.bank_account.target_org).bank_name || '';
      } else if (method_config.value.method_type === 'WALLET_PAYNON' && method_config.value.country_type === 'SINGAPORE') {
        // 新加坡提现
        wallet_account.value = res.data.withdraw_account.wallet_account;
        singaporeName.value = singaporeList.value.find(item => item.account_type === res.data.withdraw_account.wallet_account.account_type).bank_name || '';
      } else if (method_config.value.method_type === 'CARD' && method_config.value.country_type === 'EGYPT') {
        bank_account.value = res.data.withdraw_account.bank_account;
        bankName.value = support_banks.value.find(item => item.target_org === res.data.withdraw_account.bank_account.target_org).bank_name || '';
      } else {
        wallet_account.value = res.data.withdraw_account.wallet_account;
      }

      sessionStorage.setItem('edit', 1);
    } else {
      sessionStorage.setItem('edit', 0);
    }
  } else {
    Toast.fail(res.desc);
  }
};

// 替换字符串中的_为空格 并把首字母大写 其他小写
const formatBankName = (name) => {
  return name.replace(/_/g, " ").replace(/\b\w+\b/g, function (word) {
    return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
  });
};

let bank_account = ref({
  account_name: "",
  bank_code: "",
  card_no: "",
  target_org: "",
  payee_phone: "",
  bank_branch: "",
  bank_name: ""
});
let bankName = ref("");
let bankVisible = ref(false);
// 新加坡弹窗
let singapore = ref(false);
let singaporeName = ref("");
let singaporeList = ref([
  {
    account_type: 'U',
    bank_name: t('unique_entity_id')
  },
  {
    account_type: 'V',
    bank_name: t('virtual_payment_address')
  },
  {
    account_type: 'N',
    bank_name: t('id_number')
  },
  {
    account_type: 'M',
    bank_name: t('phone_number')
  },
])
const handleClickBank = (item) => {
  bank_account.value.target_org = item.target_org;
  bankName.value = item.bank_name;
  bankVisible.value = false;
};
const singaporeBank = (item) => {
  wallet_account.value.account_type = item.account_type;
  singaporeName.value = item.bank_name;
  singapore.value = false;
}

let wallet_account = ref({
  account_no: '',
  account_name: '',
  account_type: '',
  email: '',
  address: '',
})
let payeeList = ref(['WALLET_OVO', 'WALLET_GOPAY', 'WALLET_LINKAJA', 'WALLET_DANA', 'WALLET_SHOPEEPAY', 'WALLET_TNG', 'WALLET_GCASH', 'WALLET_GRABPAY', 'WALLET_PAYMAYA', 'WALLET_LAZADAPH'])
const submit = async () => {

  if (submitStatus.value) {
    return;
  }

  let options = {};

  if (method_config.value.method_type === "BANK_TRANSFER") {
    options = {
      channel_type: route.query.channel_type,
      method_type: route.query.method_type,
      bank_account: {
        account_name: bank_account.value.account_name,
        card_no: bank_account.value.card_no,
      },
    };
    if (method_config.value.country_type === "MALAYSIA") {
      options.bank_account.bank_code = bank_account.value.bank_code;
    }
    if (method_config.value.country_type === "INDONESIA") {
      options.bank_account.target_org = bank_account.value.target_org;
    }

    if (method_config.value.country_type === "INDONESIA") {
      if (!options.bank_account.target_org) {
        Toast.fail(t("select_bank"));
        return;
      }
    }
    if (method_config.value.country_type === "MALAYSIA") {
      if (!options.bank_account.bank_code) {
        Toast.fail(t("select_bank"));
        return;
      }
    }
    if (!options.bank_account.card_no) {
      Toast.fail(t("enter_bank_account"));
      return;
    }
    if (!options.bank_account.account_name) {
      Toast.fail(t("enter_payee_full_name"));
      return;
    }
    if (method_config.value.country_type === 'PHILIPPINES') {
      options.bank_account.target_org = bank_account.value.target_org;
      options.bank_account.payee_phone = bank_account.value.payee_phone;
    }
    if (method_config.value.country_type === 'SINGAPORE') {
      options = {
        channel_type: route.query.channel_type,
        method_type: route.query.method_type,
        bank_account: {
          account_name: bank_account.value.account_name,
          card_no: bank_account.value.card_no,
          payee_phone: bank_account.value.payee_phone,
          bank_code: bank_account.value.bank_code,
          bank_branch: bank_account.value.bank_branch,
          bank_name: bank_account.value.bank_name,
        },
      };
    }
    if (method_config.value.country_type === 'EGYPT') {
      options = {
        channel_type: route.query.channel_type,
        method_type: route.query.method_type,
        bank_account: {
          account_name: bank_account.value.account_name,
          card_no: bank_account.value.card_no,
          target_org: bank_account.value.target_org,
        },
      };
    }
  } else {
    options = {
      channel_type: route.query.channel_type,
      method_type: route.query.method_type,
      wallet_account: {
        account_no: wallet_account.value.account_no,
      },
    };

    if (wallet_account.value.account_name) {
      options.wallet_account.account_name = wallet_account.value.account_name;
    }
    if (method_config.value.country_type === 'SINGAPORE') {
      options = {
        channel_type: route.query.channel_type,
        method_type: route.query.method_type,
        wallet_account: {
          account_no: wallet_account.value.account_no,
          account_name: wallet_account.value.account_name,
          account_type: wallet_account.value.account_type,
        },
      };
    }
    if (method_config.value.country_type === 'EGYPT') {
      if (method_config.value.method_type === 'CARD') {
        options = {
        channel_type: route.query.channel_type,
        method_type: route.query.method_type,
        bank_account: {
          account_name: bank_account.value.account_name,
          card_no: bank_account.value.card_no,
          target_org: bank_account.value.target_org,
        },
      };
      } else {
        options = {
          channel_type: route.query.channel_type,
          method_type: route.query.method_type,
          wallet_account: {
            account_no: wallet_account.value.account_no,
            account_name: wallet_account.value.account_name,
          },
        };

        if (wallet_account.value.email) {
          options.wallet_account.email = wallet_account.value.email;
        }
      }
    }
    if (method_config.value.channel_type === 'EPAY') {
      if (method_config.value.method_type === 'EPAY') {
        options.wallet_account.account_no = wallet_account.value.account_no;
      } else {
        options.wallet_account.address = wallet_account.value.address;
      }
    }
  }

  if (route.query.withdraw_account_id) {
    options.withdraw_account_id = route.query.withdraw_account_id;
  }
  console.log(options);
  
  let res = await addEditWithdrawalAccountAPI(options);

  if (res.status === 1000) {
    Toast.success(t("save_success"));
    router.go(-1);
  } else {
    Toast.fail(res.desc);
  }
};

const handleNumInput = (e) => {

    if (method_config.value.country_type === 'EGYPT') {
        // 只允许字母和数字
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
        bank_account.value.card_no = e.target.value;
    } else {
        e.target.value = e.target.value.replace(/[^\d]/g, "");
        bank_account.value.card_no = e.target.value;
    }
  
};

const handleEgyptPhone = (e) => {
    // 0开头的11位数字
    e.target.value = e.target.value.replace(/[^\d]/g, "");
    if (e.target.value.length > 11) {
        e.target.value = e.target.value.slice(0, 11);
    }
    wallet_account.value.account_no = e.target.value;
}

const handleNameInput = (e) => {
    if (method_config.value.country_type === 'EGYPT') {
        // 只能包含英文、空格、中划线（-）、点（.)、逗号（,)和阿拉伯语
        e.target.value = e.target.value.replace(/[^\w\s\.\,\-\u0600-\u06FF]/g, "");
        bank_account.value.account_name = e.target.value;
    } else {
        // 只能包含英文、空格、中划线（-）、点（.)、逗号（,)；小于100字符
        e.target.value = e.target.value.replace(/[^\w\s\.\,\-]/g, "");
        bank_account.value.account_name = e.target.value;
    }
  
};

// 新加坡添加收款人验证
const handleNameInputSINGAPORE = (e) => {
  // 只能包含英文、空格、中划线（-）、点（.）、逗号（,）；小于 35 个字符
  let value = e.target.value.replace(/[^\w\s\.\,\-]|_/g, "");

  // 限制输入长度不超过 35 个字符
  if (value.length > 35) {
    value = value.slice(0, 35);
  }

  // 更新输入框的值
  e.target.value = value;
  bank_account.value.account_name = value;
}

const handleNumInputSingapore = (e) => {
  // 只允许字母和数字，并且限制最大长度为 34
  const input = e.target.value.replace(/[^a-zA-Z0-9]/g, "");  // 过滤非字母数字
  e.target.value = input.substring(0, 34);  // 限制最大长度为34位
  bank_account.value.card_no = e.target.value;
}

// 新加坡手机号验证规则
const handlePayeePhone = (e) => {
  // 获取用户输入的值
  let value = e.target.value;

  // 仅允许数字输入
  value = value.replace(/\D/g, '');

  // 限制总长度不超过十位
  if (value.length > 10) {
    value = value.slice(0, 10);
  }

  // 限制开头的两个数字只能是 65
  if (value.length > 2 && value.slice(0, 2) !== '65') {
    value = '65' + value.slice(2);
  } else if (value.length <= 2 && value[0] !== '6') {
    value = '';
  } else if (value.length <= 2 && value[1] !== '5') {
    value = '6';
  }

  bank_account.value.payee_phone = value;
}
// 新加坡选择除了手机以外的账号验证
const handleAccountNo = (e) => {
  // 只允许字母和数字，并且限制最大长度为 34
  const input = e.target.value.replace(/[^a-zA-Z0-9]/g, "");  // 过滤非字母数字
  e.target.value = input.substring(0, 34);  // 限制最大长度为34位
  wallet_account.value.account_no = e.target.value;
}
// 新加坡钱包账号
const accountNoPhone = (e) => {
  // 获取用户输入的值
  let value = e.target.value;

  // 仅允许数字输入
  value = value.replace(/\D/g, '');

  // 限制总长度不超过十位
  if (value.length > 34) {
    value = value.slice(0, 34);
  }

  // 限制开头的两个数字只能是 65
  if (value.length > 2 && value.slice(0, 2) !== '65') {
    value = '65' + value.slice(2);
  } else if (value.length <= 2 && value[0] !== '6') {
    value = '';
  } else if (value.length <= 2 && value[1] !== '5') {
    value = '6';
  }

  wallet_account.value.account_no = value;
}
// 新加坡银行编号
const handleBankCode = (e) => {
  // 获取用户输入的值
  let value = e.target.value;

  // 使用正则表达式仅允许输入数字
  value = value.replace(/\D/g, '');

  // 限制输入长度不超过四位
  if (value.length > 4) {
    value = value.slice(0, 4);
  }
  bank_account.value.bank_code = value;
}
// 分行规则
const handleBankBranch = (e) => {
  // 获取用户输入的值
  let value = e.target.value;

  // 使用正则表达式仅允许输入数字
  value = value.replace(/\D/g, '');

  // 限制输入长度不超过四位
  if (value.length > 3) {
    value = value.slice(0, 3);
  }
  bank_account.value.bank_branch = value;
}
//收款分银行名称
const handleBankName = (e) => {
  // 只能包含英文、空格、中划线（-）、点（.）、逗号（,）；小于 35 个字符
  let value = e.target.value.replace(/[^\w\s\.\,\-]|_/g, "");

  // 限制输入长度不超过 35 个字符
  if (value.length > 35) {
    value = value.slice(0, 35);
  }

  // 更新输入框的值
  e.target.value = value;
  bank_account.value.bank_name = value;
};
const accountName = (e) => {
  // 只能包含英文、空格、中划线（-）、点（.）、逗号（,）；小于 35 个字符
  let value = e.target.value.replace(/[^\w\s\.\,\-]/g, "");

  // 限制输入长度不超过 35 个字符
  if (value.length > 70) {
    value = value.slice(0, 70);
  }

  // 更新输入框的值
  e.target.value = value;
  wallet_account.value.account_name = value;
};

// 菲律宾名字只使用字符数量限制
const handleNameInputPHILIPPINES = (e) => {
  let value = e.target.value;
  // 限制总长度不超过十位
  if (value.length > 100) {
    value = value.slice(0, 100);
  }
  bank_account.value.account_name = value;
};

// 菲律宾手机号验证规则
const handlePayeePhonePHILIPPINES = (e) => {
  // 获取用户输入的值
  let value = e.target.value;

  // 仅允许数字输入
  value = value.replace(/\D/g, '');

  // 限制总长度不超过十一位
  if (value.length > 11) {
    value = value.slice(0, 11);
  }

  // 限制开头的两个数字只能是 65
  if (value.length > 2 && value.slice(0, 2) !== '09') {
    value = '09' + value.slice(2);
  } else if (value.length <= 2 && value[0] !== '0') {
    value = '';
  } else if (value.length <= 2 && value[1] !== '9') value = '0';

  bank_account.value.payee_phone = value;
}
// 菲律宾钱包验证
const accountNoPhonePHILIPPINES = (e) => {
  // 获取用户输入的值
  let value = e.target.value;

  // 仅允许数字输入
  value = value.replace(/\D/g, '');

  // 限制总长度不超过十位
  if (value.length > 11) {
    value = value.slice(0, 11);
  }

  // 限制开头的两个数字只能是 65
  if (value.length > 2 && value.slice(0, 2) !== '09') {
    value = '09' + value.slice(2);
  } else if (value.length <= 2 && value[0] !== '0') {
    value = '';
  } else if (value.length <= 2 && value[1] !== '9') value = '0';

  wallet_account.value.account_no = value;
}

// 菲律宾添加除了BANK_TRANSFER之外的收款方全名验证
const accountNamePHILIPPINES = (e) => {
  let value = e.target.value.replace(/[^\w\s\.\,\-]|_/g, "");

  if (value.length > 100) {
    value = value.slice(0, 100);
  }

  // 更新输入框的值
  e.target.value = value;
  wallet_account.value.account_name = value;
}

// 邮箱验证
const handleEmail = (e) => {
    let value = e.target.value.replace(/[^\w\.\@_-]/g, ""); // 只保留字母、数字、点、@、下划线和连字符

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(value)) {
        console.log("邮箱格式不正确");
        return; // 不更新值，如果格式不正确
    }

    // 更新输入框的值
    e.target.value = value;
    wallet_account.value.email = value; // 假设你在这里更新邮箱
};


// 计算submit的状态 有一个为空就不能提交
const submitStatus = computed(() => {
  if (method_config.value.method_type === "BANK_TRANSFER") {
    if (method_config.value.country_type === 'INDONESIA') {
      if (
        !bank_account.value.target_org ||
        !bank_account.value.card_no ||
        !bank_account.value.account_name
      ) {
        return true;
      }
    } else if (method_config.value.country_type === 'SINGAPORE') {
      if (
        !bank_account.value.card_no ||
        !bank_account.value.account_name ||
        !bank_account.value.payee_phone ||
        !bank_account.value.bank_code ||
        !bank_account.value.bank_branch ||
        !bank_account.value.bank_name
      ) return true;
    } else if (method_config.value.country_type === 'PHILIPPINES') {
      if (
        !bank_account.value.target_org ||
        !bank_account.value.card_no ||
        !bank_account.value.payee_phone ||
        !bank_account.value.account_name
      ) return true;
    } else if (method_config.value.country_type === 'EGYPT') {
      if (
        !bank_account.value.target_org ||
        !bank_account.value.card_no ||
        !bank_account.value.account_name
      ) return true;
    } else {
      if (
        !bank_account.value.bank_code ||
        !bank_account.value.card_no ||
        !bank_account.value.account_name
      ) {
        return true;
      }
    }
  } else {
    if (method_config.value.country_type === 'SINGAPORE') {
      if (
        !wallet_account.value.account_no ||
        !wallet_account.value.account_name ||
        !wallet_account.value.account_type
      ) return true;
    }
    if (method_config.value.country_type === 'EGYPT') {
        if (method_config.value.method_type === 'CARD') {
            if (
            !bank_account.value.target_org ||
            !bank_account.value.card_no ||
            !bank_account.value.account_name
            ) return true;
            return false;
        }

        if (method_config.value.channel_type === 'PAYER_MAX') {
            if (method_config.value.method_type === 'CASH_AMAN') {
                if (
                    !wallet_account.value.account_no ||
                    !wallet_account.value.account_name ||
                    !wallet_account.value.email
                ) return true;

                return false;
            } else {
                if (
                    !wallet_account.value.account_no ||
                    !wallet_account.value.account_name
                ) return true;

                return false;
            }
        }
    }
    if (method_config.value.channel_type === 'PAGSMILE') {
        if (
            !wallet_account.value.account_no ||
            !wallet_account.value.account_name
        ) return true;
       return false;
    }
    if (method_config.value.channel_type === 'EPAY') {
      if (method_config.value.method_type === 'EPAY') {
        if (!wallet_account.value.account_no) {
          return true;
        }
      } else {
        if (!wallet_account.value.address) {
          return true;
        }
      }
      return false
    }
    if (!wallet_account.value.account_no) {
      return true;
    }
    if (payeeList.value.includes(method_config.value.method_type)) {
      if (!wallet_account.value.account_name) {
        return true;
      }
    }
  }
  return false;
});

let showBtn = ref(true);

let detailVisible = ref(false);
let detailText = ref("");
const handleClickInfo = (value) => {
  detailText.value = value;
  detailVisible.value = true;
}

onMounted(async () => {
  await getWithdrawalAccount();

  // window.addEventListener('resize', () => {
  //     if (window.innerHeight < 600) { // 根据实际情况调整
  //         document.querySelector('.submit').style.bottom = '0.3rem'; // 键盘弹出时调整位置

  //         // showBtn.value = false;
  //     } else {
  //         document.querySelector('.submit').style.bottom = '1.2rem'; // 键盘收起时恢复位置
  //         // showBtn.value = true;
  //     }
  // });
});
</script>
<style lang="less" scoped>
@media (min-aspect-ratio: 13/20) {
  .submit {
    display: none;
  }
}
.create {
  width: 7.5rem;
  min-height: 100vh;
  padding-top: 0.88rem;
  padding-bottom: .88rem;
  font-size: 0.24rem;
  color: #333;
  position: relative;
  .form-container {
    width: 6.9rem;
    padding: 0.4rem 0.3rem;
    background: #ffffff;
    border-radius: 0.24rem;
    margin-left: 0.3rem;
    .form-item {
      .label {
        height: 0.64rem;
        font-weight: 500;
        font-size: 0.3rem;
        color: #999999;
      }
      .input {
        width: 6.3rem;
        height: 1.1rem;
        background: #f2f5fb;
        border-radius: 0.2rem;
        border: none;
        padding: 0 0.4rem;
        line-height: 1.1rem;
        font-weight: 500;
        font-size: 0.28rem;
        color: #333333;
        padding-right: 0.7rem;
      }
      .select {
        position: relative;
        width: 6.3rem;
        height: 1.1rem;
        background: #f2f5fb;
        border-radius: 0.2rem;
        border: none;
        padding: 0 0.34rem 0 0.4rem;
        font-weight: 500;
        font-size: 0.28rem;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        img {
          width: 0.11rem;
        }
        .spread {
          position: absolute;
          right: 1rem;
        }
        .info-icon {
          width: 0.3rem;
          height: 0.3rem;
          position: absolute;
          right: 0.3rem;
          top: 0.4rem;
        }
      }
      margin-bottom: 0.5rem;
      &:nth-last-of-type(1) {
        margin-bottom: 0;
      }
    }
  }
  .bank-container {
    width: 7.5rem;
    height: 60vh;
    padding: 0.3rem 0.3rem 0.7rem;
    overflow-y: scroll;
    .bank-item {
      width: 6.9rem;
      min-height: 1.2rem;
      border-bottom: 0.01rem solid #eeeeee;
      display: flex;
      align-items: center;
      position: relative;
      padding: .2rem 0;
      .bank-icon {
        max-width: 1.56rem;
        max-height: 0.78rem;
      }
      .bank-info-content {
        width: 5.04rem;
        padding-left: 0.2rem;
      }
      .bank-name {
        font-weight: 600;
        font-size: 0.26rem;
        color: #333333;
      }
      .bank-coin-info {
        font-weight: 400;
        font-size: 0.18rem;
        color: #999999;
      }
      .select-icon {
        width: 0.3rem;
        height: 0.3rem;
        position: absolute;
        right: 0.3rem;
        top: 0.45rem;
      }
    }
  }
  .submit {
    position: relative;
    top: .5rem;
    width: 3.8rem;
    height: 1rem;
    background-size: contain;
    background-repeat: no-repeat;
    background-image: url(https://yaame-static.yaame.io/admin/c1f65e866d4ed732a829f83430a28927.png);
    left: 1.85rem;
    text-align: center;
    line-height: 1rem;
    font-weight: 500;
    font-size: 0.32rem;
    color: #ffffff;
    &.disabled {
      // 灰色滤镜
      filter: grayscale(1);
    }
  }
  .input-container {
    position: relative;

    .info-icon {
      width: 0.3rem;
      height: 0.3rem;
      position: absolute;
      right: 0.3rem;
      top: 0.4rem;
    }
  }
  .flex-container {
    display: flex;
    justify-content: center;
    align-items: center;
    .detail-container {
      width: 5.9rem;
      // height: 5.58rem;
      background: #FFFFFF;
      border-radius: 0.24rem;
      padding: 0.6rem 0.5rem;
      .title {
        width: 4.9rem;
        font-weight: 600;
        font-size: 0.34rem;
        color: #333333;
        text-align: center;
        margin-bottom: 0.2rem;
      }
      .content {
        width: 4.9rem;
        // height: 2.22rem;
        font-weight: 400;
        font-size: 0.26rem;
        color: #666666;
        overflow-y: scroll;
      }
      .btn {
        width: 3.7rem;
        height: 0.88rem;
        background-size: contain;
        background-repeat: no-repeat;
        background-image: url(https://yaame-static.yaame.io/admin/766ae0bd3f4856e6e74610a52d7effa4.png);
        text-align: center;
        line-height: 0.88rem;
        margin-left: 0.6rem;
        margin-top: 0.6rem;
        font-weight: 500;
        font-size: 0.32rem;
        color: #ffffff;
      }
    }
  }
}
</style>
