/*
 * @Author: Elk
 * @Date: 2024-06-20 16:33:00
 * @FilePath: /yaame-h5/src/pages/withdraw/locale/ar-SA.js
 * @Description: 
 */
import refresh from '@/lib/i18n/refresh/ar-SA'
export default {
    // 提现
    withdraw: 'سحب',
    // 历史
    history: 'تاريخ',
    // 规则
    rule: 'قواعد',
    // 请先选择提现方式
    select_withdrawal_method: 'اختر طريقة السحب',
    // 更换
    replace: 'تغيير',
    // 提取至
    withdraw_to: 'سحب إلى',
    // 请选择提现方式后再选择提现金额档位
    select_withdrawal_amount: 'الرجاء اختيار طريقة السحب ثم اختيار مستوى مبلغ السحب',
    // 提现方式
    withdrawal_method: 'طريقة السحب',

    // 请选择银行
    select_bank_tips: 'الرجاء اختيار البنك',
    // 银行账号
    bank_account: 'رقم الحساب البنكي',
    // 收款人全名
    payee_full_name: 'اسم المستلم كاملاً',
    // 保存
    save: 'حفظ',
    // 请选择银行
    select_bank: 'الرجاء اختيار البنك',
    // 请填写银行账号
    enter_bank_account: 'الرجاء ملء رقم الحساب البنكي',
    // 请填写收款方全名
    enter_payee_full_name: 'الرجاء ملء اسم المستلم كاملاً',
    // 保存成功
    save_success: 'تم الحفظ بنجاح',

    // 账号
    account: 'حساب',
    // 收款方
    payee: 'المستفيد',
    // edit
    edit: 'تعديل',

    // 删除成功
    deleteSuccess: "تم الحذف بنجاح",
    // 请选择提现方式后再选择提现金额档位
    selectWithdrawalAmount: "الرجاء اختيار طريقة السحب ثم اختيار مستوى مبلغ السحب",
    // 此提现方式不支持某些档位提现，请注意查看
    withdrawalMethodNotSupport: "لا يدعم هذا النوع من السحب بعض المستويات، يرجى التحقق بعناية",
    // 成功发起提现申请
    buySuccess: "تم تقديم طلب الشحن بنجاح",
    // 提现记录
    withdrawRecord: "سجل الشحن",
    // 选择方式
    select_method: 'اختيار الطرق',
    // 创建新的方式
    create_new_method: 'إنشاء طرق جديدة',
    // 确认订单
    confirm_order: 'تأكيد الطلب',
    // 24小时内没有再次确认将自动完成到账操作
    confirm_order_tips: '24小时内没有再次确认将自动完成到账操作',
    // 金币数
    gold_coin: 'نقود ذهبية',
    // 费率
    rate: 'الرسوم',
    // 可获得
    can_get: 'يمكن أن يتم الحصول على',
    // 预计到账时间：1～4个工作日
    expect_time: 'وقت الوصول المتوقع: 1 إلى 4 يوم عمل',
    // 提交申请
    submit_application: 'تقديم الطلب',
    // 提示
    tips: 'تلميح',
    // 确认
    confirm: 'تأكيد',
    // 是否确认删除此提现方式？
    confirm_delete_withdrawal_method: 'هل أنت متأكد من أنك تريد حذف طريقة السحب هذه؟',
    // 取消
    cancel: 'إلغاء',
    // 你还没有发起过提现
    no_withdrawal: 'لم تقم بتقديم طلب سحب',
    // 提交信息
    submit_info: 'تقديم المعلومات',
    // 金币余额不足
    insufficient_gold_balance: 'رصيد نقود ذهبية غير كافٍ',
    // 完成
    complete: 'إكمال',
    // 银行编号
    bank_code: 'رمز البنك',

    // 2.用户只能选择几种提现档位中的一种进行提现操作。
    rule_2: 'الحد الأدنى للسحب مرة واحدة هو 4000 عملة ذهبية.',
    // 3.注意：不同提现方式有不同的提现费率，请仔细查看。提现金额需要扣除相应的提现费率后，剩余部分会到达你的提现账户中。
    rule_3: 'ملاحظة: تختلف رسوم السحب حسب طريقة السحب، يرجى مراجعة التفاصيل بعناية. سيتم خصم رسوم السحب المناسبة من المبلغ، وسيصل الجزء المتبقي إلى حساب السحب الخاص بك.',
    // 4.最终解释权归Yaame所有。
    rule_4: 'يمكن سحب الأموال ثلاث مرات فقط في اليوم.',
    // 6.最终解释权归Yaame所有。
    rule_6: 'الحق النهائي في التفسير ينتمي إلى yaame',
    // 汇率可能波动，以实际到账金额为准。
    rate_fluctuation: 'قد يتقلب سعر الصرف، ويجب أن يكون المبلغ الفعلي المستلم هو الذي يسود.',
    ...refresh,
    // 唯一实体编号
    'unique_entity_id': 'الرقم الفريد للكيان',
    // 虚拟付款地址
    'virtual_payment_address': 'عنوان الدفع الافتراضي',
    // 身份证号
    'id_number': ' رقم الهوية',
    // 手机号
    'phone_number': 'رقم الهاتف المحمول',
    // 请选择收款账号类型
    'select_account_type': 'يرجى اختيار نوع حساب الاستلام',
    // 收款账号错误
    'account_error': 'خطأ في حساب الاستلام',
    // 收款人银行账号：
    'recipient_bank_account': 'رقم حساب البنك للمستلم',
    // 收款人全名：
    'recipient_full_name': 'الاسم الكامل للمستلم',
    // 收款人手机号：
    'recipient_phone_number': 'رقم هاتف المستلم',
    // 银行编号（ACH）：
    'bank_code_ach': 'رقم البنك (ACH)',
    // 银行分行编号（ACH）：
    'branch_code_ach': 'رقم فرع البنك (ACH)',
    // 收款人银行名称：
    'recipient_bank_name': ' اسم بنك المستلم',
    // 收款人账号类型：
    'recipient_account_type': 'نوع حساب المستلم',
    // 收款人账号：
    'recipient_account_number': ' حساب المستلم',
    // 收款人姓名：
    'recipient_name': ' اسم المستلم',
    // 邮箱
    'email': 'البريد الإلكتروني',

    // 输入提现金币数
    enter_withdrawal_gold: 'أدخل عدد العملات الذهبية للسحب',
    // 请选择提现方式后再选择再填写提现金币数
    select_withdrawal_method_before_enter_gold: 'يرجى اختيار طريقة السحب قبل إدخال عدد العملات الذهبية للسحب',
    // 提现金币数必须是1k的整数倍
    withdrawal_gold_must_be_multiple_of_1k: 'يجب أن يكون عدد العملات الذهبية للسحب مضاعفًا صحيحًا لـ 1000',
    // 最小提取{0}金币，最大提取{1}金币
    withdrawal_gold_range: 'الحد الأدنى للسحب هو {0} عملة ذهبية، والحد الأقصى للسحب هو {1} عملة ذهبية',
    // 提现金币数不可小于{0}
    withdrawal_gold_must_not_be_less_than: 'لا يمكن أن يكون مبلغ السحب أقل من {0}',
    // 不同的银行的金额限制不同
    different_banks_have_different_amount_limits: 'تختلف حدود المبلغ حسب البنوك المختلفة',
    // 今日提现次数已用完
    today_withdrawal_times_have_been_used_up: 'تم استنفاد عدد السحب اليوم',
    // {0}h{1}m{2}s后可以再次发出提现
    can_withdraw_again_after: 'يمكنك إجراء السحب مرة أخرى بعد {0} ساعة و{1} دقيقة و{2} ثانية',
    // 提现次数达到上限
    withdrawal_times_reached_the_limit: 'لقد وصلت إلى الحد الأقصى لعدد السحب',
    // 收款账户异常，请检查收款账户/更换账户
    accountError: 'حساب الاستلام غير صحيح، يرجى التحقق من حساب الاستلام أو تغيير الحساب',

    // 钱包地址
    recipient_wallet_address: 'عنوان المحفظة',
    // 收款账户
    recipient_account: 'الحساب المستلم',
};
