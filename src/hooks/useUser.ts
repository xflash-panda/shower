import { useMemo } from 'react';
import useSWR from 'swr';
import {
  userInfo,
  notice,
  servers,
  serverOverview,
  subscribe,
  knowledges,
  knowledge,
  trafficLogs,
  walletLogs,
  trafficHeatMap,
  inviteConfig,
  invites,
  inviteOrders,
  orders,
  order,
  orderCheck,
  paymentNames,
  unpaidOrder,
  tickets,
  ticket,
  profileConfig,
  telegramBotInfo,
  plans,
  plan,
  planConfig,
  couponCheck,
  planNodeOverview,
} from '@/api/v1/user';
import { parseContentToTextArray } from '@helpers/content';
import { buildUserSubscribeData, type UserSubscribeData } from '@helpers/user';
import type { AxiosRequestConfig } from 'axios';

// 常量定义
const USER_INFO_KEY = 'user-user-info';
const USER_NOTICE_KEY = 'user-user-notice';
const USER_SERVERS_KEY = 'user-user-servers';
const USER_SERVER_OVERVIEW_KEY = 'user-server-overview';
const USER_SUBSCRIBE_KEY = 'user-user-subscribe';
const USER_KNOWLEDGES_KEY = 'user-user-knowledges';
const USER_KNOWLEDGE_KEY = 'user-user-knowledge';
const USER_TRAFFIC_LOGS_KEY = 'user-user-traffic-logs';
const USER_WALL_LOGS_KEY = 'user-user-wall-logs';
const USER_TRAFFIC_HEAT_MAP_KEY = 'user-user-traffic-heat-map';
const USER_INVITE_CONFIG_KEY = 'user-invite-config';
const USER_INVITES_KEY = 'user-invites';
const USER_INVITE_ORDERS_KEY = 'user-invite-orders';
const USER_ORDERS_KEY = 'user-orders';
const USER_ORDER_KEY = 'user-order';
const USER_ORDER_CHECK_KEY = 'user-order-check';
const USER_PAYMENT_NAMES_KEY = 'user-payment-names';
const USER_UNPAID_ORDER_KEY = 'user-unpaid-order';
const USER_TICKETS_KEY = 'user-tickets';
const USER_TICKET_KEY = 'user-ticket';
const USER_PROFILE_CONFIG_KEY = 'user-profile-config';
const USER_TELEGRAM_BOT_INFO_KEY = 'user-telegram-bot-info';
const USER_PLANS_KEY = 'user-plans';
const USER_PLAN_KEY = 'user-plan';
const USER_PLAN_CONFIG_KEY = 'user-plan-config';
const USER_COUPON_CHECK_KEY = 'user-coupon-check';
const USER_PLAN_NODE_OVERVIEW_KEY = 'user-plan-node-overview';

/**
 * 用户信息 Hook
 * 用于获取和管理当前用户的基本信息
 *
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含用户数据和状态
 */
export function useUserInfo(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.InfoResult>(
    enabled ? [USER_INFO_KEY, options] : null,
    () => userInfo(options),
    {
      dedupingInterval: 30000, // 30秒内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.InfoResult) => {
        // Success callback for user info
      },
    },
  );

  return {
    /** 用户信息数据 */
    userInfo: result.data?.data,
    /** 是否正在加载 - 包含初始加载和验证中的状态 */
    isLoading: result.isLoading || (enabled && !result.data && !result.error),
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 用户公告 Hook
 * 用于获取和管理用户公告列表
 *
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含公告数据和状态
 */
export function useNotice(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.NoticeResult>(
    enabled ? [USER_NOTICE_KEY, options] : null,
    () => notice(options),
    {
      dedupingInterval: 600000, // 10分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.NoticeResult) => {
        // Success callback for user notice
      },
    },
  );

  return {
    /** 公告列表数据 */
    notices: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 用户服务器列表 Hook
 * 用于获取和管理用户可用的服务器节点列表
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含服务器列表数据和状态
 */
export function useServers(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.ServersResult>(
    enabled ? [USER_SERVERS_KEY, options] : null,
    () => servers(options),
    {
      dedupingInterval: 60000, // 1分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.ServersResult) => {
        // Success callback for server list
      },
    },
  );

  return {
    /** 服务器列表数据 */
    servers: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 服务器概览 Hook
 * 用于获取和管理服务器概览信息，包含各地区服务器统计数据
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含服务器概览数据和状态
 */
export function useServerOverview(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.ServerOverviewResult>(
    enabled ? [USER_SERVER_OVERVIEW_KEY, options] : null,
    () => serverOverview(options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.ServerOverviewResult) => {
        // Success callback for server overview
      },
    },
  );

  return {
    /** 服务器概览数据 */
    serverOverview: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 用户订阅信息 Hook
 * 用于获取和管理用户的订阅信息，包含套餐详情、流量使用情况等
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含订阅数据和状态
 */
export function useSubscribe(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.SubscribeResult>(
    enabled ? [USER_SUBSCRIBE_KEY, options] : null,
    () => subscribe(options),
    {
      dedupingInterval: 60000, // 1分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.SubscribeResult) => {
        // Success callback for user subscribe info
      },
    },
  );

  // 使用 useMemo 缓存处理后的用户数据
  const userData: UserSubscribeData | null = useMemo(() => {
    if (!result.data?.data) {
      return null;
    }
    return buildUserSubscribeData(result.data.data);
  }, [result.data?.data]);

  return {
    /** 原始订阅信息数据 */
    subscribeInfo: result.data?.data,
    /** 处理后的用户数据 */
    userData,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 用户知识库列表 Hook
 * 用于获取和管理指定语言的知识库文章列表
 *
 * @param params - 请求参数，包含语言信息
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含知识库列表数据和状态
 */
export function useKnowledges(
  params: { language: string },
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.KnowledgesResult>(
    enabled ? [USER_KNOWLEDGES_KEY, params, options] : null,
    () => knowledges(params, options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.KnowledgesResult) => {
        // Success callback for user knowledges
      },
    },
  );

  return {
    /** 知识库列表数据 */
    knowledges: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 用户知识库详情 Hook
 * 用于获取和管理单个知识库文章的详细信息
 *
 * @param params - 请求参数，可以通过 id 或 slug 获取
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含知识库详情数据和状态
 */
export function useKnowledge(
  params: { id: number; slug?: never } | { slug: string; id?: never },
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.KnowledgeResult>(
    enabled ? [USER_KNOWLEDGE_KEY, params, options] : null,
    () => knowledge(params, options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.KnowledgeResult) => {
        // Success callback for user knowledge
      },
    },
  );

  return {
    /** 知识库详情数据 */
    knowledge: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 用户流量日志 Hook
 * 用于获取和管理用户的流量使用日志记录，支持分页查询
 *
 * @param params - 分页请求参数，包含 pageSize 和 current
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含流量日志数据和状态
 */
export function useTrafficLogs(
  params: API_V1.User.TrafficLogsParams,
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.TrafficLogsResult>(
    enabled ? [USER_TRAFFIC_LOGS_KEY, params, options] : null,
    () => trafficLogs(params, options),
    {
      dedupingInterval: 30000, // 30秒内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.TrafficLogsResult) => {
        // Success callback for traffic logs
      },
    },
  );

  return {
    /** 流量日志列表数据 */
    trafficLogs: result.data?.data,
    /** 总数量 */
    total: result.data?.total,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 用户钱包日志 Hook
 * 用于获取和管理用户的钱包交易日志记录
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含钱包日志数据和状态
 */
export function useWalletLogs(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.WalletLogsResult>(
    enabled ? [USER_WALL_LOGS_KEY, options] : null,
    () => walletLogs(options),
    {
      dedupingInterval: 30000, // 30秒内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.WalletLogsResult) => {
        // Success callback for wallet logs
      },
    },
  );

  return {
    /** 钱包日志列表数据 */
    wallLogs: result.data?.data,
    /** 总数量 */
    total: result.data?.total,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 用户流量热力图 Hook
 * 用于获取和管理用户的流量使用热力图数据，展示每日流量分布情况
 *
 * @param params - 请求参数，包含开始时间等过滤条件
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含流量热力图数据和状态
 */
export function useTrafficHeatMap(
  params: API_V1.User.TrafficHeatMapParams,
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.TrafficHeatMapResult>(
    enabled ? [USER_TRAFFIC_HEAT_MAP_KEY, params, options] : null,
    () => trafficHeatMap(params, options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.TrafficHeatMapResult) => {
        // Success callback for traffic heat map
      },
    },
  );

  return {
    /** 流量热力图数据 */
    trafficHeatMap: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 邀请配置 Hook
 * 用于获取和管理用户的邀请配置信息，包含邀请生成限制和邀请链接等
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含邀请配置数据和状态
 */
export function useInviteConfig(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.InviteConfigResult>(
    enabled ? [USER_INVITE_CONFIG_KEY, options] : null,
    () => inviteConfig(options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.InviteConfigResult) => {
        // Success callback for invite config
      },
    },
  );

  return {
    /** 邀请配置数据 */
    inviteConfig: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 邀请吗列表 Hook
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含邀请记录数据和状态
 */
export function useInvites(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.InvitesResult>(
    enabled ? [USER_INVITES_KEY, options] : null,
    () => invites(options),
    {
      dedupingInterval: 60000, // 1分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.InvitesResult) => {
        // Success callback for invites data
      },
    },
  );

  return {
    /** 邀请记录数据 */
    invites: result.data?.data,
    /** 邀请码列表 */
    inviteCodes: result.data?.data?.codes,
    /** 邀请统计数据 */
    inviteStats: result.data?.data?.stat,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 邀请订单列表 Hook
 * 用于获取和管理用户的邀请返利明细数据，支持分页查询
 *
 * @param params - 分页请求参数，包含 pageSize 和 current
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含邀请订单数据和状态
 */
export function useInviteOrders(
  params: API_V1.User.InviteOrdersParams,
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.InviteOrdersResult>(
    enabled ? [USER_INVITE_ORDERS_KEY, params, options] : null,
    () => inviteOrders(params, options),
    {
      dedupingInterval: 30000, // 30秒内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.InviteOrdersResult) => {
        // Success callback for invite orders
      },
    },
  );

  return {
    /** 邀请订单列表数据 */
    inviteOrders: result.data?.data,
    /** 总数量 */
    total: result.data?.total,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

// ============================= 订单相关 Hooks ============================= //

/**
 * 订单列表 Hook
 * 用于获取和管理用户的订单列表，支持分页查询
 *
 * @param params - 分页请求参数，包含 pageSize 和 current
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含订单列表数据和状态
 */
export function useOrders(
  params: API_V1.User.OrdersParams,
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.OrdersResult>(
    enabled ? [USER_ORDERS_KEY, params, options] : null,
    () => orders(params, options),
    {
      dedupingInterval: 0, // 禁用去重，每次都发起新请求
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.OrdersResult) => {
        // Success callback for user orders
      },
    },
  );

  return {
    /** 订单列表数据 */
    orders: result.data?.data,
    /** 总数量 */
    total: result.data?.total,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 订单详情 Hook
 * 用于获取和管理单个订单的详细信息
 *
 * @param params - 请求参数，包含 trade_no
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含订单详情数据和状态
 */
export function useOrder(
  params: API_V1.User.OrderParams,
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.OrderResult>(
    enabled ? [USER_ORDER_KEY, params, options] : null,
    () => order(params, options),
    {
      dedupingInterval: 0, // 禁用去重，每次都发起新请求
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.OrderResult) => {
        // Success callback for order details
      },
    },
  );

  return {
    /** 订单详情数据 */
    order: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 未支付订单 Hook
 * 用于获取用户的未支付订单信息
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含未支付订单数据和状态
 */
export function useUnpaidOrder(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.UnpaidOrderResult>(
    enabled ? [USER_UNPAID_ORDER_KEY, options] : null,
    () => unpaidOrder(options),
    {
      dedupingInterval: 0, // 禁用去重，每次都发起新请求
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.UnpaidOrderResult) => {
        // Success callback for unpaid order
      },
    },
  );

  return {
    /** 未支付订单数据 */
    unpaidOrder: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 支付方式列表 Hook
 * 用于获取和管理可用的支付方式列表
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含支付方式列表数据和状态
 */
export function usePaymentNames(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.PaymentNamesResult>(
    enabled ? [USER_PAYMENT_NAMES_KEY, options] : null,
    () => paymentNames(options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.PaymentNamesResult) => {
        // Success callback for payment methods
      },
    },
  );

  return {
    /** 支付方式列表数据 */
    paymentMethods: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 订单检查 Hook
 * 用于检查订单的支付状态，支持自动刷新
 *
 * @param params - 请求参数，包含 trade_no
 * @param enabled - 是否启用数据获取，默认为 true
 * @param refreshInterval - 自动刷新间隔（毫秒），默认0（不自动刷新）
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含订单状态数据
 */
export function useOrderCheck(
  params: API_V1.User.OrderCheckParams,
  enabled: boolean = true,
  refreshInterval: number = 0,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.OrderCheckResult>(
    enabled ? [USER_ORDER_CHECK_KEY, params, options] : null,
    () => orderCheck(params, options),
    {
      dedupingInterval: 0, // 禁用去重，每次都发起新请求
      revalidateOnFocus: true, // 焦点时重新验证
      revalidateOnReconnect: true, // 重连时重新验证
      refreshInterval, // 使用传入的刷新间隔
      revalidateIfStale: true, // 即使数据过期也重新验证
      revalidateOnMount: true, // 组件挂载时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.OrderCheckResult) => {
        // Success callback for order check
      },
    },
  );

  return {
    /** 订单状态数据 */
    orderStatus: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

// ============================= 工单相关 Hooks ============================= //

/**
 * 工单列表 Hook
 * 用于获取和管理用户的工单列表，包含工单基本信息和状态
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含工单列表数据和状态
 */
export function useTickets(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.TicketsResult>(
    enabled ? [USER_TICKETS_KEY, options] : null,
    () => tickets(options),
    {
      dedupingInterval: 60000, // 1分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.TicketsResult) => {
        // Success callback for user tickets
      },
    },
  );

  return {
    /** 工单列表数据 */
    tickets: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 工单详情 Hook
 * 用于获取和管理单个工单的详细信息，包含工单内容和回复记录
 *
 * @param params - 请求参数，包含 id
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含工单详情数据和状态
 */
export function useTicket(
  params: API_V1.User.TicketParams,
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.TicketResult>(
    enabled ? [USER_TICKET_KEY, params, options] : null,
    () => ticket(params, options),
    {
      dedupingInterval: 30000, // 30秒内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.TicketResult) => {
        // Success callback for ticket details
      },
    },
  );

  return {
    /** 工单详情数据 */
    ticket: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 用户配置信息 Hook
 * 用于获取和管理用户的配置信息，包含系统配置、支付设置等
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含配置信息数据和状态
 */
export function useProfileConfig(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.ProfileConfigResult>(
    enabled ? [USER_PROFILE_CONFIG_KEY, options] : null,
    () => profileConfig(options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.ProfileConfigResult) => {
        // Success callback for profile config
      },
    },
  );

  return {
    /** 配置信息数据 */
    profileConfig: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * Telegram Bot 信息 Hook
 * 用于获取和管理 Telegram Bot 的信息，包含 Bot 用户名等配置
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含 Telegram Bot 信息数据和状态
 */
export function useTelegramBotInfo(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.TelegramBotinfoResult>(
    enabled ? [USER_TELEGRAM_BOT_INFO_KEY, options] : null,
    () => telegramBotInfo(options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.TelegramBotinfoResult) => {
        // Success callback for telegram bot info
      },
    },
  );

  return {
    /** Telegram Bot 信息数据 */
    telegramBotInfo: result.data?.data,
    /** Bot 用户名 */
    botUsername: result.data?.data?.username,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

// ============================= 套餐相关 Hooks ============================= //

/**
 * 套餐列表 Hook
 * 用于获取和管理可用的套餐列表，支持容量检查
 *
 * @param params - 请求参数，包含是否检查容量等选项
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含套餐列表数据和状态，以及带解析特性的套餐数据
 */
export function usePlans(
  params: { check_capacity?: boolean } = {},
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.PlansResult>(
    enabled ? [USER_PLANS_KEY, params, options] : null,
    () => plans(params, options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.PlansResult) => {
        // Success callback for plans
      },
    },
  );

  // 为每个套餐解析特性
  const plansWithFeatures = useMemo(() => {
    if (!result.data?.data) return undefined;

    return result.data.data.map(plan => ({
      ...plan,
      features: parseContentToTextArray(plan.content || ''),
    }));
  }, [result.data?.data]);

  return {
    /** 套餐列表数据 */
    plans: result.data?.data,
    /** 带解析特性的套餐列表数据 */
    plansWithFeatures,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 单个套餐详情 Hook
 * 用于获取和管理指定套餐的详细信息
 *
 * @param params - 请求参数，包含套餐 ID 和是否检查容量等选项
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含套餐详情数据和状态，以及处理好的套餐特性数组
 */
export function usePlan(
  params: { id: number; check_capacity?: boolean },
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.PlanResult>(
    enabled ? [USER_PLAN_KEY, params, options] : null,
    () => plan(params, options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.PlanResult) => {
        // Success callback for plan details
      },
    },
  );

  // 解析套餐特性
  const planFeatures = useMemo(() => {
    return parseContentToTextArray(result.data?.data?.content ?? '');
  }, [result.data?.data?.content]);

  return {
    /** 套餐详情数据 */
    plan: result.data?.data,
    /** 解析后的套餐特性数组 */
    planFeatures,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 套餐配置 Hook
 * 用于获取和管理套餐的系统配置信息
 *
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含套餐配置数据和状态
 */
export function usePlanConfig(enabled: boolean = true, options?: AxiosRequestConfig) {
  const result = useSWR<API_V1.User.PlanConfigResult>(
    enabled ? [USER_PLAN_CONFIG_KEY, options] : null,
    () => planConfig(options),
    {
      dedupingInterval: 600000, // 10分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.PlanConfigResult) => {
        // Success callback for plan config
      },
    },
  );

  return {
    /** 套餐配置数据 */
    planConfig: result.data?.data,
    /** 是否启用一次性流量重置 */
    resetOnetimeTrafficEnable: result.data?.data?.reset_onetime_traffic_enable,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}

/**
 * 优惠券验证 Hook
 * 用于验证优惠券的有效性和获取优惠券信息，注意这是 POST 接口不使用 SWR
 * 由于这是一个验证操作，建议在需要时手动调用，而不是自动获取
 *
 * @param params - 优惠券验证参数，包含优惠券代码、套餐ID和价格ID
 * @param enabled - 是否启用数据获取，默认为 false（需要手动触发）
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含优惠券验证结果和状态
 */
export function useCouponCheck(
  params: API_V1.User.CouponCheckParams,
  enabled: boolean = false,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.CouponCheckResult>(
    enabled ? [USER_COUPON_CHECK_KEY, params, options] : null,
    () => couponCheck(params, options),
    {
      dedupingInterval: 0, // 禁用去重，每次都发起新请求
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: false, // 重连时不重新验证
      revalidateIfStale: false, // 数据过期时不自动重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.CouponCheckResult) => {
        // Success callback for coupon check
      },
    },
  );

  return {
    /** 优惠券验证结果数据 */
    couponData: result.data?.data,
    /** 优惠券信息 */
    coupon: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动触发验证 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
    /** 手动触发优惠券验证的便捷方法 */
    checkCoupon: () => result.mutate(),
  };
}

/**
 * 套餐节点概览 Hook
 * 用于获取和管理指定套餐的节点概览信息，包含各地区节点统计数据
 *
 * @param params - 请求参数，包含套餐 ID
 * @param enabled - 是否启用数据获取，默认为 true
 * @param options - Axios 请求配置选项
 * @returns SWR 响应对象，包含节点概览数据和状态
 */
export function usePlanNodeOverview(
  params: API_V1.User.PlanNodeOverviewParams,
  enabled: boolean = true,
  options?: AxiosRequestConfig,
) {
  const result = useSWR<API_V1.User.PlanNodeOverviewResult>(
    enabled ? [USER_PLAN_NODE_OVERVIEW_KEY, params, options] : null,
    () => planNodeOverview(params, options),
    {
      dedupingInterval: 300000, // 5分钟内去重
      revalidateOnFocus: false, // 焦点时不重新验证
      revalidateOnReconnect: true, // 重连时重新验证

      // 成功回调
      onSuccess: (_data: API_V1.User.PlanNodeOverviewResult) => {
        // Success callback for plan node overview
      },
    },
  );

  return {
    /** 节点概览数据 */
    nodeOverview: result.data?.data,
    /** 是否正在加载 */
    isLoading: result.isLoading,
    /** 是否有错误 */
    isError: !!result.error,
    /** 错误信息 */
    error: result.error as Error | undefined,
    /** 手动重新获取数据 */
    mutate: result.mutate,
    /** 是否验证中 */
    isValidating: result.isValidating,
  };
}
