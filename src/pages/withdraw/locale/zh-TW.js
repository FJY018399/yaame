/*
 * @Author: Elk
 * @Date: 2024-06-20 16:33:00
 * @FilePath: /yaame-h5/src/pages/withdraw/locale/zh-TW.js
 * @Description: 
 */
import refresh from '@/lib/i18n/refresh/zh-TW'
export default {
    // 提现
    withdraw: '提現',
    // 历史
    history: '歷史',
    // 规则
    rule: '規則',
    // 请先选择提现方式
    select_withdrawal_method: '請先選擇提現方式',
    // 更换
    replace: '更換',

    // 提取至
    withdraw_to: '提現到',
    // 请选择提现方式后再选择提现金额档位
    select_withdrawal_amount: '請選擇提現方式後再選擇提現金額檔位',
    // 提现方式
    withdrawal_method: '提现方式',


    // 请选择银行
    select_bank_tips: '請選擇銀行',
    // 银行账号
    bank_account: '銀行帳號',
    // 收款人全名
    payee_full_name: '收款人全名',
    // 保存
    save: '儲存',
    // 请选择银行
    select_bank: '請選擇銀行',
    // 请填写银行账号
    enter_bank_account: '請填寫銀行帳號',
    // 请填写收款方全名
    enter_payee_full_name: '請填寫收款方全名',
    // 保存成功
    save_success: '保存成功',

    // 账号
    account: '帳號',
    // 收款方
    payee: '收款方',
    // edit
    edit: '編輯',

    // 删除成功
    deleteSuccess: "刪除成功",
    // 请选择提现方式后再选择提现金额档位
    selectWithdrawalAmount: "請選擇提現方式後再選擇提現金額檔位",
    // 此提现方式不支持某些档位提现，请注意查看
    withdrawalMethodNotSupport: "此提現方式不支持某些檔位提現，請注意查看",
    // 成功发起提现申请
    buySuccess: "成功發起提現申請",
    // 提现记录
    withdrawRecord: "提現記錄",
    // 选择方式
    select_method: '選擇方式',
    // 创建新的方式
    create_new_method: '創建新的方式',
    // 确认订单
    confirm_order: '確認訂單',
    // 24小时内没有再次确认将自动完成到账操作
    confirm_order_tips: '24小時內沒有再次確認將自動完成到賬操作',
    // 金币数
    gold_coin: '金幣數',
    // 费率
    rate: '費率',
    // 可获得
    can_get: '可獲得',
    // 预计到账时间：1～4个工作日
    expect_time: '預計到賬時間：1～4個工作日',
    // 提交申请
    submit_application: '提交申請',
    // 提示
    tips: '提示',
    // 确认
    confirm: '確認',
    // 是否确认删除此提现方式？
    confirm_delete_withdrawal_method: '是否確認刪除此提現方式？',
    // 取消
    cancel: '取消',
    // 你还没有发起过提现
    no_withdrawal: '你還沒有發起過提現',
    // 提交信息
    submit_info: '提交信息',
    // 金币余额不足
    insufficient_gold_balance: '金幣餘額不足',
    // 完成
    complete: '完成',
    // 银行编号
    bank_code: '銀行編號',

    // 2.用户只能选择几种提现档位中的一种进行提现操作。
    rule_2: '1.單次最少提現 4000 金幣。',
    // 3.注意：不同提现方式有不同的提现费率，请仔细查看。提现金额需要扣除相应的提现费率后，剩余部分会到达你的提现账户中。
    rule_3: '2.注意：不同提現方式有不同的提現費率，請仔細查看。提現金額需要扣除相應的提現費率後，剩餘部分會到達你的提現賬戶中。',
    // 4.最终解释权归Yaame所有。
    rule_4: '3.每日只可提現 3 次。',
    // 6.最终解释权归Yaame所有。
    rule_6: '4.Yaame保留最終解釋權。',
    // 汇率可能波动，以实际到账金额为准。
    rate_fluctuation: '匯率可能波動，以實際到賬金額為準。',
    ...refresh,
    // 唯一实体编号
    'unique_entity_id': '唯一實體編號',
    // 虚拟付款地址
    'virtual_payment_address': '虛擬付款地址',
    // 身份证号
    'id_number': '身分證號',
    // 手机号
    'phone_number': '手機號',
    // 请选择收款账号类型
    'select_account_type': '请选择收款账号类型',
    // 收款账号错误
    'account_error': '收款帳號錯誤',
    // 收款人银行账号
    'recipient_bank_account': '收款人銀行帳號',
    // 收款人全名
    'recipient_full_name': '收款人全名',
    // 收款人手机号
    'recipient_phone_number': '收款人手機號碼',
    // 银行编号（ACH）
    'bank_code_ach': '銀行編號（ACH）',
    // 银行分行编号（ACH）
    'branch_code_ach': '銀行分行編號（ACH）',
    // 收款人银行名称
    'recipient_bank_name': '收款人銀行名稱',
    // 收款人账号类型
    'recipient_account_type': '收款人帳號類型',
    // 收款人账号
    'recipient_account_number': '收款人帳號',
    // 收款人姓名
    'recipient_name': '收款人姓名',
    // 邮箱
    'email': '邮箱',

    // 输入提现金币数
    enter_withdrawal_gold: '輸入提現金幣數',
    // 请选择提现方式后再选择再填写提现金币数
    select_withdrawal_method_before_enter_gold: '請選擇提現方式後再填寫提現金幣數',
    // 提现金币数必须是1k的整数倍
    withdrawal_gold_must_be_multiple_of_1k: '提現金幣數必須是 1k 的整數倍',
    // 最小提取{0}金币，最大提取{1}金币
    withdrawal_gold_range: '最小提取 {0} 金幣，最大提取 {1} 金幣',
    // 提现金币数不可小于{0}
    withdrawal_gold_must_not_be_less_than: '提現金幣數不可小於 {0}',
    // 不同的银行的金额限制不同
    different_banks_have_different_amount_limits: '不同的銀行的金額限制不同',
    // 今日提现次数已用完
    today_withdrawal_times_have_been_used_up: '今日提現次數已用完',
    // {0}h{1}m{2}s后可以再次发出提现
    can_withdraw_again_after: '{0}h{1}m{2}s 後可以再次發出提現',
    // 提现次数达到上限
    withdrawal_times_reached_the_limit: '提現次數達到上限',
    // 收款账户异常，请检查收款账户/更换账户
    accountError: '收款賬戶異常，請檢查收款賬戶/更換賬戶',

    // 钱包地址
    recipient_wallet_address: '錢包地址',
    // 收款账户
    recipient_account: '收款賬戶',
};
