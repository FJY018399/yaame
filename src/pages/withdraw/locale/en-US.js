/*
 * @Author: Elk
 * @Date: 2024-06-20 16:33:00
 * @FilePath: /yaame-h5/src/pages/withdraw/locale/en-US.js
 * @Description: 
 */
import refresh from '@/lib/i18n/refresh/en-US'
export default {
    // 提现
    withdraw: 'Withdraw',
    // 历史
    history: 'History',
    // 规则
    rule: 'Rules',
    // 请先选择提现方式
    select_withdrawal_method: 'Choose withdrawal method',
    // 更换
    replace: 'Exchange',
    // 提取至
    withdraw_to: 'Withdraw to',
    // 请选择提现方式后再选择提现金额档位
    select_withdrawal_amount: 'Please select the withdrawal method and then select the withdrawal level',
    // 提现方式
    withdrawal_method: 'Withdrawal way',

    // 请选择银行
    select_bank_tips: 'Please choose bank',
    // 银行账号
    bank_account: 'Bank account',
    // 收款人全名
    payee_full_name: 'Beneficiary name',
    // 保存
    save: 'Save',
    // 请选择银行
    select_bank: 'Please choose bank',
    // 请填写银行账号
    enter_bank_account: 'Please enter account number',
    // 请填写收款方全名
    enter_payee_full_name: 'Please enter whole beneficiary name',
    // 保存成功
    save_success: 'Saved successfully',

    // 账号
    account: 'Account number',
    // 收款方
    payee: 'Benieficiary',
    // edit
    edit: 'Edit',

    // 删除成功
    deleteSuccess: "Deleted successfully",
    // 请选择提现方式后再选择提现金额档位
    selectWithdrawalAmount: "Please select the withdrawal method and then select the withdrawal level",
    // 此提现方式不支持某些档位提现，请注意查看
    withdrawalMethodNotSupport: "This withdrawal method does not support the withdrawal of some stalls, please pay attention to check",
    // 成功发起提现申请
    buySuccess: "Successful top up application",
    // 提现记录
    withdrawRecord: "Top up record",
    // 选择方式
    select_method: 'Choose methods',
    // 创建新的方式
    create_new_method: 'Create new methods',
    // 确认订单
    confirm_order: 'Confirm order',
    // 24小时内没有再次确认将自动完成到账操作
    confirm_order_tips: 'No reconfirmation within 24 hours will be completed automatically',
    // 金币数
    gold_coin: 'Coins',
    // 费率
    rate: 'fee rates',
    // 可获得
    can_get: 'Recived',
    // 预计到账时间：1～4个工作日
    expect_time: 'Estimated arrival time: 1 ~ 4 working days',
    // 提交申请
    submit_application: 'Submit application',
    // 提示
    tips: 'Tips',
    // 确认
    confirm: 'Confirm',
    // 是否确认删除此提现方式？
    confirm_delete_withdrawal_method: 'Are you sure you want to delete this withdrawal method?',
    // 取消
    cancel: 'Cancel',
    // 你还没有发起过提现
    no_withdrawal: 'You have not initiated a withdrawal',
    // 提交信息
    submit_info: 'Submit information',
    // 金币余额不足
    insufficient_gold_balance: 'Inefficient coin balance',
    // 完成
    complete: 'Completed',
    // 银行编号
    bank_code: 'Swift Code',


    // 2.用户只能选择几种提现档位中的一种进行提现操作。
    rule_2: '1.Minimum 4000 coins for one time withdrawal.',
    // 3.注意：不同提现方式有不同的提现费率，请仔细查看。提现金额需要扣除相应的提现费率后，剩余部分会到达你的提现账户中。
    rule_3: '2. Note: Different withdrawal methods have different withdrawal rates, please check carefully. After deducting the corresponding withdrawal rate, the remaining part of the withdrawal amount will reach your withdrawal account.',
    // 4.最终解释权归Yaame所有。
    rule_4: '3. You can only withdraw 3 times per day.',
    // 6.最终解释权归Yaame所有。
    rule_6: '4. The final right of interpretation reserved by Yaame.',
    // 汇率可能波动，以实际到账金额为准。
    rate_fluctuation: 'The exchange rate may fluctuate, and the actual amount received shall prevail.',
    ...refresh,
    // 唯一实体编号
    'unique_entity_id': 'Unique Entity Number',
    // 虚拟付款地址
    'virtual_payment_address': 'Virtual Payment Address',
    // 身份证号
    'id_number': 'Singapore ID number',
    // 手机号
    'phone_number': 'Phone number',
    // 请选择收款账号类型
    'select_account_type': 'Please select the collection account type',
    // 收款账号错误
    'account_error': 'Wrong account number',
    // 收款人银行账号：
    'recipient_bank_account': 'Beneficiary Bank Account Number',
    // 收款人全名：
    'recipient_full_name': 'Full name of beneficiary',
    // 收款人手机号：
    'recipient_phone_number': 'Phone number of beneficiary',
    // 银行编号（ACH）：
    'bank_code_ach': 'Bank number (ACH)',
    // 银行分行编号（ACH）：
    'branch_code_ach': 'Bank branch number (ACH)',
    // 收款人银行名称：
    'recipient_bank_name': 'Beneficiary bank name',
    // 收款人账号类型：
    'recipient_account_type': 'Beneficiary account type',
    // 收款人账号：
    'recipient_account_number': 'Beneficiary account number',
    // 收款人姓名：
    'recipient_name': 'Name of beneficiary',
    // 邮箱
    'email': 'Email',

    // 输入提现金币数
    enter_withdrawal_gold: 'Enter the number of coins you want to withdraw',
    // 请选择提现方式后再选择再填写提现金币数
    select_withdrawal_method_before_enter_gold: 'Please select the withdrawal method and then select the number of coins to be withdrawn.',
    // 提现金币数必须是1k的整数倍
    withdrawal_gold_must_be_multiple_of_1k: 'The number of coins withdrawn must be an integer multiple of 1k.',
    // 最小提取{0}金币，最大提取{1}金币
    withdrawal_gold_range: 'Minimum withdrawal is {0} coins, maximum withdrawal is {1} coins.',
    // 提现金币数不可小于{0}
    withdrawal_gold_must_not_be_less_than: 'The number of coins withdrawn must not be less than {0}.',
    // 不同的银行的金额限制不同
    different_banks_have_different_amount_limits: 'Different banks have different limits',
    // 今日提现次数已用完
    today_withdrawal_times_have_been_used_up: "Today's withdrawal times have been used up",
    // {0}h{1}m{2}s后可以再次发出提现
    can_withdraw_again_after: 'You can withdraw again after {0}h{1}m{2}s.',
    // 提现次数达到上限
    withdrawal_times_reached_the_limit: 'The number of withdrawals has reached the limit',
    // 收款账户异常，请检查收款账户/更换账户
    accountError: 'The receiving account is abnormal, please check the receiving account/change the account.',

    // 钱包地址
    recipient_wallet_address: 'Wallet Address',
    // 收款账户
    recipient_account: 'Receiving account',
};
