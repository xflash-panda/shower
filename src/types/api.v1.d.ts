/**
 * API V1 类型定义
 * 统一管理所有 API 接口的请求参数和响应数据类型
 */
declare namespace API_V1 {
  /**
   * 通用响应结构
   * @template T 响应数据类型
   */
  interface BaseResponse<T = any> {
    /** 响应数据 */
    data: T;
    /** 响应消息 */
    message?: string;
    /** 响应状态码 */
    status?: number;
  }

  /** 通用请求参数基础接口 */
  interface BaseParams {
    [key: string]: any;
  }

  /** 分页请求参数 */
  interface PaginationParams {
    /** 每页数量 */
    pageSize: number;
    /** 当前页码 */
    current: number;
  }

  /**
   * 分页响应结构
   * @template T 列表项数据类型
   */
  interface PaginationResult<T> {
    /** 数据列表 */
    data: T[];
    /** 总数量 */
    total: number;
  }

  /** 认证令牌信息 */
  interface AuthToken {
    /** 访问令牌 */
    token: string;
  }

  /** 身份认证相关接口 */
  namespace Identity {
    interface LoginParams {
      email: string;
      password: string;
    }

    type LoginResult = BaseResponse<AuthToken>;

    type CheckLoginResult = BaseResponse<{ is_login: boolean }>;

    interface CheckEmailParams {
      email: string;
    }

    type CheckEmailResult = BaseResponse<boolean>;

    interface CheckPhoneParams {
      phone: string;
      check_exist: number;
    }

    type CheckPhoneResult = BaseResponse<boolean>;

    interface EmailVerifyParams {
      email: string;
      captcha_data?: string;
    }

    type EmailVerifyResult = BaseResponse<boolean>;

    interface SmsVerifyParams {
      phone: string;
      captcha_data?: string;
    }

    type SmsVerifyResult = BaseResponse<boolean>;

    interface RegisterParams {
      email: string;
      password: string;
      invite_code: string;
      email_code: string;
      captcha_data?: string;
    }

    type RegisterResult = BaseResponse<AuthToken>;

    interface ForgetParams {
      email: string;
      password: string;
      email_code: string;
    }

    type ForgetResult = BaseResponse<boolean>;

    interface ChangeEmailParams {
      email: string;
      password: string;
      email_code: string;
    }

    type ChangeEmailResult = BaseResponse<boolean>;

    interface ChangePhoneParams {
      phone: string;
      sms_code: string;
    }

    type ChangePhoneResult = BaseResponse<boolean>;

    interface AppleSignInParams {
      identity_token: string;
    }

    type AppleSignInResult = BaseResponse<AuthToken>;

    interface GoogleSignInParams {
      id_token: string;
    }

    type GoogleSignInResult = BaseResponse<AuthToken>;

    interface GoogleSignInWithAccessTokenParams {
      access_token: string;
    }

    type GoogleSignInWithAccessTokenResult = BaseResponse<AuthToken>;

    interface LoginWithSmsParams {
      phone: string;
      sms_code: string;
    }

    type LoginWithSmsResult = BaseResponse<AuthToken>;
  }

  /** 用户相关接口 */
  namespace User {
    interface InfoItem {
      balance: number;
      banned: number;
      commission_balance: number;
      commission_rate: number | null;
      created_at: number;
      discount: number | null;
      email?: string;
      phone?: string;
      expired_at: number;
      last_login_at: number | null;
      plan_id: number;
      auto_renewal: number;
      auto_reset_traffic: number;
      remind_expire: number;
      remind_traffic: number;
      telegram_id: number;
      suspend_type: number;
      is_suspend: boolean;
      recovery_at?: number;
    }

    type InfoResult = BaseResponse<InfoItem>;

    type LogoutResult = BaseResponse<boolean>;

    type DestroyResult = BaseResponse<boolean>;

    interface NoticeItem {
      id: number;
      title: string;
      content: string;
      img_url: string;
      created_at: number;
      updated_at: number;
    }

    type NoticeResult = PaginationResult<NoticeItem>;

    interface KnowledgeItem {
      id: number;
      category: string;
      title: string;
      updated_at: number;
      body?: string;
      language?: string;
      show?: number;
      free?: number;
      sort?: number;
      created_at?: number;
    }

    type KnowledgesResult = BaseResponse<Record<string, KnowledgeItem[]>>;

    type KnowledgeResult = BaseResponse<KnowledgeItem>;

    interface ProfileConfigItem {
      is_telegram: number;
      telegram_discuss_link?: string;
      withdraw_methods: string[];
      recharge_close: number;
      withdraw_close: number;
      transfer_balance_close: number;
      transfer_commission_balance_close: number;
      min_recharge_amount: number;
      max_recharge_amount: number;
      commission_withdraw_limit: number;
      recharge_rebate_enable: number;
      recharge_rebate_mode: 'normal' | 'full';
      recharge_rebate_normal_min_amount: number;
      recharge_rebate_normal_rate: number;
      recharge_rebate_full_threshold_amount: number;
      recharge_rebate_full_value: number;
    }

    type ProfileConfigResult = BaseResponse<ProfileConfigItem>;

    interface InviteConfigItem {
      invite_gen_limit: number;
      invite_url: null | string;
    }

    type InviteConfigResult = BaseResponse<InviteConfigItem>;

    interface SubscribeData {
      bound_telegram: boolean;
      is_available: boolean;
      is_traffic_depleted: boolean;
      is_expired: boolean;
      subscribe_url: string;
      reset_day: number;
      plan_id: number;
      token: string;
      expired_at: number;
      time_limit: boolean;
      start_sec: number;
      end_sec: number;
      u: number;
      d: number;
      transfer_enable: number;
      email: string;
      plan?: PlanItem;
    }

    type SubscribeResult = BaseResponse<SubscribeData>;

    type TelegramBotinfoResult = BaseResponse<{ username?: string }>;

    type StatsUserResult = BaseResponse<number[]>;

    type SubscribeUrl = string;
    type ResetSecurityResult = BaseResponse<SubscribeUrl>;

    type ProxyProtocol =
      | 'trojan'
      | 'hysteria2'
      | 'vmess'
      | 'shadowsocks'
      | 'vless'
      | 'wireguard'
      | 'hysteria'
      | 'tuic'
      | 'reality'
      | 'naiveproxy';
    interface ServerItem {
      id: number;
      name: string;
      tags: string[];
      display_rate: string;
      created_at: number;
      updated_at: number;
      type: ProxyProtocol;
      last_check_at: number;
    }

    type ServersResult = BaseResponse<ServerItem[]>;

    interface ServerOverviewItem {
      flag: string;
      country: string;
      country_code: string;
      city: string;
      lng: number;
      lat: number;
      server_total: number;
      server_load: number;
    }

    type ServerOverviewResult = BaseResponse<ServerOverviewItem[]>;

    interface PlanPriceItem {
      id: string;
      name: string;
      tip?: string;
      off_tip?: string;
      value: number;
      type?: number;
      expire_type?: string;
      expire_value?: number;
    }

    interface PlanItem {
      id: number;
      transfer_enable: number;
      transfer_enable_value: number;
      name: string;
      show: number;
      prices: PlanPriceItem[] | null;
      allow_ids: number[] | null;
      payment_ids: number[] | null;
      sort: number;
      renew: number;
      content: string;
      is_sold_out?: boolean;
      is_nearing_sold_out?: boolean;
      created_at: number;
      updated_at: number;
    }

    type PlansResult = BaseResponse<PlanItem[]>;

    type PlanResult = BaseResponse<PlanItem>;

    type PlanConfigResult = BaseResponse<{ reset_onetime_traffic_enable: number }>;

    interface PlanNodeOverviewParams {
      plan_id: number;
    }

    interface PlanNodeOverviewItem {
      id: number;
      country: string;
      city: string;
      flag: string;
      node_count: number;
      node_direct_count: number;
      node_relay_count: number;
      exit_ip_count: number;
      route_type: 'direct' | 'relay' | 'hybrid';
      protocols: string[];
    }

    type PlanNodeOverviewResult = BaseResponse<PlanNodeOverviewItem[]>;

    interface CouponCheckParams {
      code: string;
      plan_id: number;
      price_id: string;
    }

    interface Coupon {
      id: number;
      name: string;
      /** 优惠券类型: 1=固定金额, 2=百分比 */
      type: 1 | 2;
      value: number;
      code: string;
      created_at: number;
      ended_at: string;
      startd_at: string;
      updated_at: string;
      limit_use: number;
      limit_plan_ids: string;
    }

    type CouponCheckResult = BaseResponse<Coupon>;

    interface OrderSaveParams {
      price_id: string;
      plan_id: number;
      coupon_code?: string;
    }

    type OrderSaveResult = BaseResponse<string>;

    interface OrderItem {
      balance_amount?: number;
      callback_no?: string;
      commission_balance: number;
      commission_status: number;
      coupon_id?: number;
      created_at: number;
      price_name?: string;
      price_meta?: PlanPriceItem;
      discount_amount?: number;
      handling_amount: number;
      invite_user_id: number;
      payment_id: number;
      plan_id: number;
      status: number;
      total_amount: number;
      trade_no: string;
      type: number;
      paid_at?: number;
      remarks: string;
      updated_at: string;
      plan?: PlanItem;
    }

    type OrdersParams = PaginationParams;

    type OrdersResult = PaginationResult<OrderItem>;

    type UnpaidOrderResult = BaseResponse<OrderItem | null>;

    interface OrderCancelParams {
      trade_no: string;
    }

    type OrderCancelResult = BaseResponse<boolean>;

    interface OrderParams {
      trade_no: string;
    }

    type OrderResult = BaseResponse<OrderItem>;

    interface PaymentNameItem {
      id: number;
      name: string;
      payment: string;
      icon_type: number;
      handling_fee: boolean;
      handling_fee_type: number;
      handling_fee_value: number;
    }

    type PaymentNamesResult = BaseResponse<PaymentNameItem[]>;

    interface OrderCheckoutParams {
      trade_no: string;
    }

    interface OrderCheckoutData {
      data: string | boolean;
      type: number; // 0: 二维码支付, 1: 跳转第三方支付
    }

    type OrderCheckoutResult = OrderCheckoutData;

    interface OrderUpdateParams {
      trade_no: string;
      method_id: number;
    }

    type OrderUpdateResult = BaseResponse<OrderItem>;

    interface OrderCheckParams {
      trade_no: string;
    }

    type OrderCheckResult = BaseResponse<number>;

    interface InviteCodeItem {
      id: number;
      user_id: number;
      code: string;
      status: number;
      pv: number;
      created_at: number;
      updated_at: number;
    }

    interface InvitesData {
      codes: InviteCodeItem[];
      stat: number[];
    }

    type InvitesResult = BaseResponse<InvitesData>;

    type InviteGenerateResult = BaseResponse<boolean>;

    interface InviteOrderItem {
      id: number;
      total_amount: number;
      handling_amount: number;
      commission_rate?: number;
      commission_balance: number;
      commission_status: number;
      created_at: number;
      updated_at: number;
    }

    type InviteOrdersParams = PaginationParams;

    type InviteOrdersResult = PaginationResult<InviteOrderItem>;

    interface TransferCommissionBalanceParams {
      transfer_amount: number;
    }

    type TransferCommissionBalanceResult = BaseResponse<boolean>;

    interface TransferBalanceParams {
      transfer_amount: number;
      transfer_user: string;
    }

    interface TransferBalanceData {
      data: boolean;
    }

    type TransferBalanceResult = BaseResponse<TransferBalanceData>;

    interface RechargeParams {
      recharge_amount: number;
    }

    type RechargeResult = BaseResponse<string>;

    interface TicketWithdrawParams {
      withdraw_account: string;
      withdraw_method: string;
    }

    type TicketWithdrawResult = BaseResponse<boolean>;

    interface ChangePasswordParams {
      old_password: string;
      new_password: string;
    }

    type ChangePasswordResult = BaseResponse<boolean>;

    interface UpdateParams {
      remind_expire?: number;
      remind_traffic?: number;
      auto_renewal?: number;
      auto_reset_traffic?: number;
    }

    type UpdateResult = BaseResponse<boolean>;

    type UnBindTelegramResult = BaseResponse<boolean>;

    interface TicketItem {
      random_id: string;
      user_id: number;
      last_reply_user_id: number;
      level: number;
      reply_status: number;
      status: number;
      subject: string;
      created_at: number;
      updated_at: number;
    }

    type TicketsResult = BaseResponse<TicketItem[]>;

    interface TicketCloseParams {
      random_id: string;
    }

    type TicketCloseResult = BaseResponse<boolean>;

    interface TicketParams {
      random_id: string;
    }

    interface TicketMessageItem {
      id: number;
      user_id: number;
      ticket_id: number;
      message: string;
      created_at: number;
      updated_at: number;
      is_me: boolean;
    }

    type TicketUnionItem = TicketItem & {
      message: TicketMessageItem[];
    };

    type TicketResult = BaseResponse<TicketUnionItem>;

    interface TicketReplyParams {
      random_id: string;
      message: string;
    }

    interface TicketReplyData {
      id: number;
      message: string;
    }

    type TicketReplyResult = BaseResponse<TicketReplyData>;

    interface TicketSaveParams {
      subject: string;
      level: number;
      message: string;
    }

    type TicketSaveResult = BaseResponse<boolean>;

    type TrafficLogsParams = PaginationParams;

    interface TrafficLogItem {
      id: number;
      d: number;
      u: number;
      n: number;
      user_id: number;
      created_at: number;
      updated_at: number;
      log_at: number;
    }

    type TrafficLogsResult = PaginationResult<TrafficLogItem>;

    // 钱包日志类型常量
    type WallLogType = 1 | 2 | 3 | 4 | 5;

    // 佣金划转到余额消息
    interface CommissionToBalanceMessage {
      amount: number; // 转换金额
    }

    // 余额充值消息
    interface BalanceRechargeMessage {
      amount: number; // 充值金额
      rebate_amount: number | null; // 返利金额
      actual_amount: number; // 实际到账金额
      order_id: string; // 订单号
    }

    // 余额划转消息
    interface BalanceTransferMessage {
      amount: number; // 转账金额
      direction: 'out' | 'in'; // 'out' 转出 或 'in' 转入
      to_user_contact: string | null; // 接收用户联系方式（邮箱或手机）
      from_user_contact: string | null; // 转出方联系方式（邮箱或手机）
    }

    // 佣金提现消息
    interface CommissionWithdrawMessage {
      amount: number; // 提现金额
      withdraw_method: string; // 提现方式
      withdraw_account: string; // 提现账户
    }

    // 余额消费消息
    interface BalanceConsumeMessage {
      amount: number; // 消费金额
      order_id: string; // 关联订单ID
    }

    // 钱包日志项基础接口
    interface BaseWallLogItem {
      id: number;
      user_id: number;
      created_at: number;
      updated_at: number;
    }

    // 不同类型的钱包日志项
    interface CommissionToBalanceLogItem extends BaseWallLogItem {
      type: 1; // TYPE_COMMISSION_TO_BALANCE
      message: CommissionToBalanceMessage;
    }

    interface BalanceRechargeLogItem extends BaseWallLogItem {
      type: 2; // TYPE_BALANCE_RECHARGE
      message: BalanceRechargeMessage;
    }

    interface BalanceTransferLogItem extends BaseWallLogItem {
      type: 3; // TYPE_BALANCE_TRANSFER
      message: BalanceTransferMessage;
    }

    interface CommissionWithdrawLogItem extends BaseWallLogItem {
      type: 4; // TYPE_COMMISSION_WITHDRAW
      message: CommissionWithdrawMessage;
    }

    interface BalanceConsumeLogItem extends BaseWallLogItem {
      type: 5; // TYPE_BALANCE_CONSUME
      message: BalanceConsumeMessage;
    }

    // 钱包日志项联合类型
    type WalletLogItem =
      | CommissionToBalanceLogItem
      | BalanceRechargeLogItem
      | BalanceTransferLogItem
      | CommissionWithdrawLogItem
      | BalanceConsumeLogItem;

    type WalletLogsResult = PaginationResult<WalletLogItem>;

    interface TrafficHeatMapParams {
      start_at?: number;
    }

    interface TrafficHeatMapItem {
      log_at: number;
      log_date: string;
      total: number;
      u: number;
      d: number;
      n: number;
    }

    type TrafficHeatMapResult = BaseResponse<Record<string, TrafficHeatMapItem>>;

    /** 规则相关接口 */
    interface RuleCreateParams {
      /** 规则名称 */
      name: string;
      /** 规则内容 */
      content: string;
      /** 规则类型 */
      type: number;
      /** 是否启用 */
      enabled?: boolean;
    }

    type RuleCreateResult = BaseResponse<boolean>;

    interface RuleUpdateParams {
      /** 规则ID */
      id: number;
      /** 规则名称 */
      name?: string;
      /** 规则内容 */
      content?: string;
      /** 规则类型 */
      type?: number;
      /** 是否启用 */
      enabled?: boolean;
    }

    type RuleUpdateResult = BaseResponse<boolean>;

    interface RuleDeleteParams {
      /** 规则ID */
      id: number;
    }

    type RuleDeleteResult = BaseResponse<boolean>;
  }

  /** 游客/公共接口 */
  namespace Guest {
    interface CommonConfigItem {
      tos_url: string | null;
      is_email_verify: boolean;
      is_invite_force: boolean;
      email_whitelist_suffix: string[] | null;
      is_captcha_enable: boolean;
      captcha_type: 'recaptcha' | 'hcaptcha' | 'turnstile' | 'geetestv4' | 'recaptchav3';
      recaptcha_site_key?: string;
      recaptcha_v3_site_key?: string;
      hcaptcha_site_key?: string;
      turnstile_site_key?: string;
      geetest_v4_id?: string;
      app_description: string;
      app_url: string;
      google_client_id?: string;
      apple_client_id?: string;
      sms_login_enable: boolean;
    }
    type CommonConfigResult = BaseResponse<CommonConfigItem>;
  }
}
