import { formatBytesToReadable, calculateTrafficPercentage, bytesToGB } from '@helpers/bytes';
import { timestampToDate, getCurrentTimestamp } from '@helpers/time';

/**
 * 用户数据处理工具函数
 */

/**
 * 流量数据处理对象
 */
export interface TrafficData {
  /** 原始流量数据（字节） */
  bytes: {
    /** 总流量（字节） */
    total: number;
    /** 已使用流量（字节） */
    used: number;
    /** 上传流量（字节） */
    upload: number;
    /** 下载流量（字节） */
    download: number;
    /** 剩余流量（字节） */
    remaining: number;
  };
  /** 格式化显示数据 */
  formatted: {
    /** 格式化的总流量 */
    total: string;
    /** 格式化的已使用流量 */
    used: string;
    /** 格式化的上传流量 */
    upload: string;
    /** 格式化的下载流量 */
    download: string;
    /** 格式化的剩余流量 */
    remaining: string;
  };
  /** GB 格式数据 */
  gb: {
    /** 总流量（GB） */
    total: number;
    /** 已使用流量（GB） */
    used: number;
  };
  /** 使用百分比 */
  percentage: number;
}

/**
 * 计算剩余天数
 * @param expiredTimestamp - 过期时间戳（秒）
 * @returns 剩余天数
 */
const calculateRemainingDays = (expiredTimestamp: number): number => {
  const now = getCurrentTimestamp();
  const expiredDate = new Date(timestampToDate(expiredTimestamp));
  const currentDate = new Date(timestampToDate(now));

  const diffTime = expiredDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * 计算到重置日期的剩余天数
 * @param resetDay - 重置日期（数字或字符串）
 * @returns 剩余天数
 */
const calculateResetRemainingDays = (resetDay: string | number): number => {
  const now = new Date();
  const resetDayNum = typeof resetDay === 'string' ? parseInt(resetDay, 10) : resetDay;

  // 创建本月的重置日期
  const resetDate = new Date(now.getFullYear(), now.getMonth(), resetDayNum, 0, 0, 0, 0);

  // 如果本月的重置日期已经过了，就计算下个月的重置日期
  if (now.getDate() >= resetDayNum) {
    resetDate.setMonth(resetDate.getMonth() + 1);
  }

  // 计算剩余天数
  const diffTime = resetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * 计算重置日期的格式化字符串
 * @param resetDay - 重置日期（数字或字符串）
 * @param locale - 本地化选项，默认为 'zh-CN'
 * @returns 格式化的重置日期字符串
 */
const calculateResetDate = (resetDay: string | number, locale: string = 'zh-CN'): string => {
  const now = new Date();
  const resetDayNum = typeof resetDay === 'string' ? parseInt(resetDay, 10) : resetDay;

  // 创建重置日期
  const resetDate = new Date(now.getFullYear(), now.getMonth(), resetDayNum);

  // 如果当前日期还没到本月的重置日，就用本月，否则用下月
  if (now.getDate() >= resetDayNum) {
    resetDate.setMonth(resetDate.getMonth() + 1);
  }

  // 使用原生Date的toLocaleDateString方法格式化
  return resetDate.toLocaleDateString(locale);
};

/**
 * 格式化过期日期
 * @param expiredTimestamp - 过期时间戳（秒）
 * @param locale - 本地化选项，默认为 'zh-CN'
 * @returns 格式化的过期日期字符串
 */
const formatExpiredDate = (expiredTimestamp: number, locale: string = 'zh-CN'): string => {
  const expiredDate = new Date(timestampToDate(expiredTimestamp));
  return expiredDate.toLocaleDateString(locale);
};

/**
 * 订阅状态常量
 */
export const SubscriptionStatus = {
  /** 无订阅 */
  NO_SUBSCRIPTION: 'noSubscription',
  /** 服务正常 */
  SERVICE_ACTIVE: 'serviceActive',
  /** 服务已过期 */
  SERVICE_EXPIRED: 'serviceExpired',
  /** 流量包有效 */
  PACKAGE_VALID: 'packageValid',
  /** 流量包已耗尽 */
  PACKAGE_EXHAUSTED: 'packageExhausted',
  /** 已过期且流量耗尽 */
  EXPIRED_EXHAUSTED: 'expiredExhausted',
} as const;

/**
 * 订阅状态类型
 */
export type SubscriptionStatusType = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];

/**
 * 订阅状态和类型检查工具
 */
export interface SubscriptionAnalysis {
  /** 当前订阅类型 */
  type: {
    /** 是否为一次性订阅 */
    isOneTime: boolean;
    /** 是否为周期性订阅 */
    isPeriodic: boolean;
  };
  /** 流量状态 */
  trafficStatus: {
    /** 流量是否耗尽 */
    isDepleted: boolean;
    /** 是否有周期性订阅且流量耗尽 */
    isPeriodicWithDepleted: boolean;
  };
  /** 订阅状态 */
  status: {
    /** 是否已过期 */
    isExpired: boolean;
    /** 是否可用 */
    isAvailable: boolean;
    /** 当前订阅状态类型 */
    subscriptionStatus: SubscriptionStatusType;
  };
  /** 当前套餐ID */
  currentPlanId: number;
  /** 检查方法：是否为订阅变更 */
  checkIsSubscriptionChange: (newPlanId: number) => boolean;
  /** 检查方法：是否为订阅类型变更 */
  checkIsSubscriptionTypeChange: (newPriceType?: number) => boolean;
  /** 检查方法：是否应显示流量重置包 */
  checkShouldShowTrafficReset: () => boolean;
  /** 检查方法：是否应显示流量耗尽确认 */
  checkShouldShowTrafficDepletedConfirm: (newPriceType?: number) => boolean;
  /** 检查方法：是否应显示订阅变更确认 */
  checkShouldShowSubscriptionChangeConfirm: (newPlanId: number, newPriceType?: number) => boolean;
  /** 检查方法：是否为流量包类型 */
  checkIsPackageType: () => boolean;
  /** 检查方法：服务状态是否正常 */
  checkIsServiceNormal: () => boolean;
  /** 检查方法：是否无订阅 */
  checkHasNoSubscription: () => boolean;
  /** 检查方法：是否已过期 */
  checkIsExpired: () => boolean;
}

/**
 * 处理后的用户数据接口
 */
export interface UserSubscribeData {
  /** 用户邮箱 */
  email: string;
  /** 套餐信息 */
  plan: API_V1.User.PlanItem | null;
  /** 服务到期信息 */
  expiry: {
    /** 剩余天数，-1表示永不过期 */
    remainingDays: number;
    /** 过期日期（格式化），null表示永不过期 */
    date: string | null;
    /** 是否永不过期 */
    isNeverExpires: boolean;
  } | null;
  /** 流量重置信息 */
  reset: {
    /** 重置日期（原始值） */
    day: string | number;
    /** 重置剩余天数 */
    remainingDays: number;
    /** 重置日期（格式化） */
    date: string;
  } | null;
  /** 订阅链接 */
  subscribeUrl: string;
  /** 流量数据对象 */
  traffic: TrafficData;
  /** 订阅分析和检查工具 */
  analysis: SubscriptionAnalysis;
}

/**
 * 创建订阅分析工具
 * @param subscribeInfo - 订阅信息数据
 * @returns 订阅分析对象
 */
/**
 * 计算订阅状态类型
 */
const calculateSubscriptionStatus = (
  planName: string,
  isOneTime: boolean,
  isExpired: boolean,
  isDepleted: boolean,
  remainingDays: number,
): SubscriptionStatusType => {
  if (planName === '') {
    return SubscriptionStatus.NO_SUBSCRIPTION;
  }

  // 一次性流量包（无到期时间和重置周期）
  if (isOneTime) {
    return isDepleted ? SubscriptionStatus.PACKAGE_EXHAUSTED : SubscriptionStatus.PACKAGE_VALID;
  }

  // 周期性订阅（有到期时间）
  if (isExpired || remainingDays <= 0) {
    return isDepleted ? SubscriptionStatus.EXPIRED_EXHAUSTED : SubscriptionStatus.SERVICE_EXPIRED;
  }

  return SubscriptionStatus.SERVICE_ACTIVE;
};

const createSubscriptionAnalysis = (
  subscribeInfo: API_V1.User.SubscribeData,
  trafficUsagePercentage: number,
): SubscriptionAnalysis => {
  // 基础类型判断
  const isOneTime = subscribeInfo.expired_at === null || subscribeInfo.expired_at === 0;
  const isPeriodic = !isOneTime;

  // 流量状态
  const isDepleted = subscribeInfo.is_traffic_depleted;
  const isPeriodicWithDepleted = isPeriodic && isDepleted;

  // 订阅状态
  const isExpired = subscribeInfo.is_expired;
  const isAvailable = subscribeInfo.is_available;

  // 计算剩余天数
  const remainingDays =
    subscribeInfo.expired_at && subscribeInfo.expired_at > 0
      ? calculateRemainingDays(subscribeInfo.expired_at)
      : -1;

  // 计算订阅状态类型
  const subscriptionStatus = calculateSubscriptionStatus(
    subscribeInfo.plan?.name ?? '',
    isOneTime,
    isExpired,
    isDepleted,
    remainingDays,
  );

  return {
    type: {
      isOneTime,
      isPeriodic,
    },
    trafficStatus: {
      isDepleted,
      isPeriodicWithDepleted,
    },
    status: {
      isExpired,
      isAvailable,
      subscriptionStatus,
    },
    currentPlanId: subscribeInfo.plan_id,

    // 检查方法：是否为订阅变更
    checkIsSubscriptionChange: (newPlanId: number) => {
      return subscribeInfo.plan_id !== newPlanId;
    },

    // 检查方法：是否为订阅类型变更
    checkIsSubscriptionTypeChange: (newPriceType?: number) => {
      const newIsOneTime = newPriceType === 2;
      return isOneTime !== newIsOneTime;
    },

    // 检查方法：是否应显示流量重置包（type === 4）
    // 条件：周期性订阅且流量已使用>=80%，且未过期
    checkShouldShowTrafficReset: () => {
      return isPeriodic && trafficUsagePercentage >= 80 && !isExpired;
    },

    // 检查方法：是否应显示流量耗尽确认
    checkShouldShowTrafficDepletedConfirm: (newPriceType?: number) => {
      // 只有周期性订阅且流量耗尽，并且新选择的不是一次性类型时才显示
      return isPeriodic && isDepleted && newPriceType === 1;
    },

    // 检查方法：是否应显示订阅变更确认
    checkShouldShowSubscriptionChangeConfirm: (newPlanId: number, newPriceType?: number) => {
      const isSubscriptionChange = subscribeInfo.plan_id !== newPlanId;
      const isSubscriptionTypeChange = isOneTime !== (newPriceType === 2);
      return isSubscriptionChange || isSubscriptionTypeChange;
    },

    // 检查方法：是否为流量包类型
    checkIsPackageType: () =>
      subscriptionStatus === SubscriptionStatus.PACKAGE_VALID ||
      subscriptionStatus === SubscriptionStatus.PACKAGE_EXHAUSTED,

    // 检查方法：服务状态是否正常
    checkIsServiceNormal: () =>
      subscriptionStatus === SubscriptionStatus.SERVICE_ACTIVE ||
      subscriptionStatus === SubscriptionStatus.PACKAGE_VALID,

    // 检查方法：是否无订阅
    checkHasNoSubscription: () => subscriptionStatus === SubscriptionStatus.NO_SUBSCRIPTION,

    // 检查方法：是否已过期
    checkIsExpired: () => isExpired,
  };
};

/**
 * 转换订阅信息为前端友好的用户数据格式
 * @param subscribeInfo - 订阅信息数据
 * @returns 转换后的用户数据对象
 */
const transformSubscribeData = (subscribeInfo: API_V1.User.SubscribeData): UserSubscribeData => {
  const totalBytes = subscribeInfo.quota_bytes;
  const usedBytes = subscribeInfo.u + subscribeInfo.d;
  const remainingBytes = Math.max(0, totalBytes - usedBytes);

  // 构建流量数据对象
  const traffic: TrafficData = {
    bytes: {
      total: totalBytes,
      used: usedBytes,
      upload: subscribeInfo.u,
      download: subscribeInfo.d,
      remaining: remainingBytes,
    },
    formatted: {
      total: formatBytesToReadable(totalBytes),
      used: formatBytesToReadable(usedBytes),
      upload: formatBytesToReadable(subscribeInfo.u),
      download: formatBytesToReadable(subscribeInfo.d),
      remaining: formatBytesToReadable(remainingBytes),
    },
    gb: {
      total: bytesToGB(totalBytes),
      used: bytesToGB(usedBytes),
    },
    percentage: calculateTrafficPercentage(usedBytes, totalBytes),
  };

  // 处理过期信息 - expired_at 为 null 表示永不过期（一次性流量）
  const expiry =
    subscribeInfo.expired_at === null || subscribeInfo.expired_at === 0
      ? {
          remainingDays: -1,
          date: null,
          isNeverExpires: true,
        }
      : {
          remainingDays: calculateRemainingDays(subscribeInfo.expired_at),
          date: formatExpiredDate(subscribeInfo.expired_at),
          isNeverExpires: false,
        };

  // 处理重置信息 - reset_day 为 null/empty 或 expired_at 为 null 表示无重置周期
  const reset =
    subscribeInfo.reset_day === 0 ||
    subscribeInfo.expired_at === null ||
    subscribeInfo.expired_at === 0
      ? null
      : {
          day: subscribeInfo.reset_day,
          remainingDays: calculateResetRemainingDays(subscribeInfo.reset_day),
          date: calculateResetDate(subscribeInfo.reset_day),
        };

  // 创建订阅分析工具
  const analysis = createSubscriptionAnalysis(subscribeInfo, traffic.percentage);

  return {
    email: subscribeInfo.email ?? '',
    plan: subscribeInfo.plan ?? null,
    expiry,
    reset,
    subscribeUrl: subscribeInfo.subscribe_url,
    traffic,
    analysis,
  };
};

/**
 * 构建用户数据对象（主函数）
 * @param subscribeInfo - 订阅信息数据
 * @returns 用户数据对象
 */
export const buildUserSubscribeData = (
  subscribeInfo: API_V1.User.SubscribeData,
): UserSubscribeData => {
  return transformSubscribeData(subscribeInfo);
};
