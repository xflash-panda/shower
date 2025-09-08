export const RoutePaths = {
  TERMS: '/terms',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  CHANGE_EMAIL: '/profile/change-email',
  TICKET: '/ticket',
  TICKET_DETAIL: '/ticket/:id',
  PROFILE: '/profile',
  WALLET: '/wallet',
  INVITE: '/invite',
  TRAFFIC: '/traffic',
  ORDER: '/order',
  ORDER_DETAIL: '/order/:id',
  PLAN: '/plan',
  DASHBOARD: '/dashboard',
  KNOWLEDGE: '/knowledge',
};

export const NoNeedAuthPaths: string[] = [
  RoutePaths.LOGIN,
  RoutePaths.REGISTER,
  RoutePaths.FORGOT_PASSWORD,
  RoutePaths.TERMS,
];

// 需要重定向的登录相关路径
export const LoginRelatedPaths = [
  RoutePaths.LOGIN,
  RoutePaths.REGISTER,
  RoutePaths.FORGOT_PASSWORD,
] as const;
