import { apiClient, getDefaultHeaders } from '@/helpers/api';
import type { AxiosRequestConfig } from 'axios';

export async function userInfo(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.InfoResult>('/api/v1/user/info', {
    ...options,
    params: {
      random: +new Date(),
      ...(options?.params as Record<string, any>),
    },
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function logout(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.LogoutResult>('/api/v1/user/logout', {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function destroy(options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.User.DestroyResult>(
    '/api/v1/user/destroy',
    undefined,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function notice(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.NoticeResult>('/api/v1/user/notice/fetch', {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function knowledges(
  params: {
    /** 当前的语言 */
    language: string;
  },
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.User.KnowledgesResult>(
    '/api/v1/user/knowledge/fetch',
    {
      ...options,
      params: {
        ...params,
        ...(options?.params as Record<string, any>),
      },
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function knowledge(
  params: { id: number; slug?: never } | { slug: string; id?: never },
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.User.KnowledgeResult>(
    '/api/v1/user/knowledge/fetch',
    {
      ...options,
      params: {
        ...params,
        ...(options?.params as Record<string, any>),
      },
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function profileConfig(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.ProfileConfigResult>(
    '/api/v1/user/comm/profileConfig',
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function inviteConfig(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.InviteConfigResult>(
    '/api/v1/user/comm/inviteConfig',
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function subscribe(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.SubscribeResult>('/api/v1/user/subscribe', {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function telegramBotInfo(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.TelegramBotinfoResult>(
    '/api/v1/user/telegram/botInfo',
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function statsUser(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.StatsUserResult>('/api/v1/user/stat', {
    ...options,
  });
  return response.data;
}

export async function resetSecurity(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.ResetSecurityResult>(
    '/api/v1/user/resetSecurity',
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function planNodeOverview(
  params: API_V1.User.PlanNodeOverviewParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.User.PlanNodeOverviewResult>(
    '/api/v1/user/plan/nodeOverview',
    {
      ...options,
      params: {
        ...params,
        ...(options?.params as Record<string, any>),
      },
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function servers(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.ServersResult>('/api/v1/user/server/fetch', {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function serverOverview(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.ServerOverviewResult>(
    '/api/v1/user/server/overview',
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function plans(
  params: {
    check_capacity?: boolean;
  },
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.User.PlansResult>('/api/v1/user/plan/fetch', {
    ...options,
    params: {
      ...params,
      ...(options?.params as Record<string, any>),
    },
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function plan(
  params: {
    /** ID */
    id: number;
    check_capacity?: boolean;
  },
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.User.PlanResult>('/api/v1/user/plan/fetch', {
    ...options,
    params: {
      ...params,
      ...(options?.params as Record<string, any>),
    },
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function planConfig(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.PlanConfigResult>('/api/v1/user/plan/config', {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function couponCheck(
  body: API_V1.User.CouponCheckParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.User.CouponCheckResult>(
    '/api/v1/user/coupon/check',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function orderSave(body: API_V1.User.OrderSaveParams, options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.User.OrderSaveResult>(
    '/api/v1/user/order/save',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function orders(params: API_V1.User.OrdersParams, options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.OrdersResult>('/api/v1/user/order/fetch', {
    ...options,
    params: {
      ...params,
      ...(options?.params as Record<string, any>),
    },
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function orderCancel(
  body: API_V1.User.OrderCancelParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.User.OrderCancelResult>(
    '/api/v1/user/order/cancel',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function order(params: API_V1.User.OrderParams, options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.OrderResult>('/api/v1/user/order/details', {
    ...options,
    params: {
      ...params,
      ...(options?.params as Record<string, any>),
    },
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function orderUpdate(
  body: API_V1.User.OrderUpdateParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.User.OrderUpdateResult>(
    '/api/v1/user/order/update',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        'Referrer-Policy': 'Origin',
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function paymentNames(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.PaymentNamesResult>(
    '/api/v1/user/order/payments',
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function orderCheckout(
  body: API_V1.User.OrderCheckoutParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.User.OrderCheckoutResult>(
    '/api/v1/user/order/checkout',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        'Referrer-Policy': 'Origin',
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function orderCheck(
  params: API_V1.User.OrderCheckParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.User.OrderCheckResult>('/api/v1/user/order/check', {
    ...options,
    params: {
      random: +new Date(),
      ...params,
      ...(options?.params as Record<string, any>),
    },
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function invites(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.InvitesResult>('/api/v1/user/invite/fetch', {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function inviteGenerate(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.InviteGenerateResult>(
    '/api/v1/user/invite/save',
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function inviteOrders(
  params: API_V1.User.InviteOrdersParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.User.InviteOrdersResult>(
    '/api/v1/user/invite/details',
    {
      ...options,
      params: {
        ...params,
        ...(options?.params as Record<string, any>),
      },
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function transferCommissionBalance(
  body: API_V1.User.TransferCommissionBalanceParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.User.TransferCommissionBalanceResult>(
    '/api/v1/user/transferCommissionBalance',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function transferBalance(
  body: API_V1.User.TransferBalanceParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.User.TransferBalanceResult>(
    '/api/v1/user/transferBalance',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function recharge(body: API_V1.User.RechargeParams, options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.User.RechargeResult>('/api/v1/user/recharge', body, {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function ticketWithdraw(
  body: API_V1.User.TicketWithdrawParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.User.TicketWithdrawResult>(
    '/api/v1/user/ticket/withdraw',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function changePassword(
  body: API_V1.User.ChangePasswordParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.User.ChangePasswordResult>(
    '/api/v1/user/changePassword',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function update(body: API_V1.User.UpdateParams, options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.User.UpdateResult>('/api/v1/user/update', body, {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function unbindTelegram(options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.User.UnBindTelegramResult>(
    '/api/v1/user/unbindTelegram',
    {},
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function tickets(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.TicketsResult>('/api/v1/user/ticket/fetch', {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function ticketClose(
  body: API_V1.User.TicketCloseParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.User.TicketCloseResult>(
    '/api/v1/user/ticket/close',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function ticket(params: API_V1.User.TicketParams, options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.TicketResult>('/api/v1/user/ticket/fetch', {
    ...options,
    params: {
      ...params,
      ...(options?.params as Record<string, any>),
    },
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function ticketReply(
  body: API_V1.User.TicketReplyParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.post<API_V1.User.TicketReplyResult>(
    '/api/v1/user/ticket/reply',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function ticketSave(body: API_V1.User.TicketSaveParams, options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.User.TicketSaveResult>(
    '/api/v1/user/ticket/save',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function trafficLogs(
  params: API_V1.User.TrafficLogsParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.User.TrafficLogsResult>('/api/v1/user/trafficLogs', {
    ...options,
    params: {
      ...params,
      ...(options?.params as Record<string, any>),
    },
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function walletLogs(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.WalletLogsResult>('/api/v1/user/walletLogs', {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function trafficHeatMap(
  params: API_V1.User.TrafficHeatMapParams,
  options?: AxiosRequestConfig,
) {
  const response = await apiClient.get<API_V1.User.TrafficHeatMapResult>(
    '/api/v1/user/trafficHeatMap',
    {
      ...options,
      params: {
        ...params,
        ...(options?.params as Record<string, any>),
      },
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function unpaidOrder(options?: AxiosRequestConfig) {
  const response = await apiClient.get<API_V1.User.UnpaidOrderResult>('/api/v1/user/order/unpaid', {
    ...options,
    headers: {
      ...getDefaultHeaders(),
      ...(options?.headers as Record<string, any>),
    },
  });
  return response.data;
}

export async function ruleCreate(body: API_V1.User.RuleCreateParams, options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.User.RuleCreateResult>(
    '/api/v1/user/rule/create',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function ruleUpdate(body: API_V1.User.RuleUpdateParams, options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.User.RuleUpdateResult>(
    '/api/v1/user/rule/update',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}

export async function ruleDelete(body: API_V1.User.RuleDeleteParams, options?: AxiosRequestConfig) {
  const response = await apiClient.post<API_V1.User.RuleDeleteResult>(
    '/api/v1/user/rule/delete',
    body,
    {
      ...options,
      headers: {
        ...getDefaultHeaders(),
        ...(options?.headers as Record<string, any>),
      },
    },
  );
  return response.data;
}
