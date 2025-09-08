import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enCommon from '../locales/en/common.json';
import zhCommon from '../locales/zh/common.json';
import enLogin from '../locales/en/login.json';
import zhLogin from '../locales/zh/login.json';
import enRegister from '../locales/en/register.json';
import zhRegister from '../locales/zh/register.json';
import enForgotPassword from '../locales/en/forgotPassword.json';
import zhForgotPassword from '../locales/zh/forgotPassword.json';
import enDashboard from '../locales/en/dashboard.json';
import zhDashboard from '../locales/zh/dashboard.json';
import enPlan from '../locales/en/plan.json';
import zhPlan from '../locales/zh/plan.json';
import enWallet from '../locales/en/wallet.json';
import zhWallet from '../locales/zh/wallet.json';
import enTicket from '../locales/en/ticket.json';
import zhTicket from '../locales/zh/ticket.json';
import enProfile from '../locales/en/profile.json';
import zhProfile from '../locales/zh/profile.json';
import enOrder from '../locales/en/order.json';
import zhOrder from '../locales/zh/order.json';
import enInvite from '../locales/en/invite.json';
import zhInvite from '../locales/zh/invite.json';
import enError from '../locales/en/error.json';
import zhError from '../locales/zh/error.json';
import enTraffic from '../locales/en/traffic.json';
import zhTraffic from '../locales/zh/traffic.json';
import enHeader from '../locales/en/header.json';
import zhHeader from '../locales/zh/header.json';
import enSidebar from '../locales/en/sidebar.json';
import zhSidebar from '../locales/zh/sidebar.json';
import enKnowledge from '../locales/en/knowledge.json';
import zhKnowledge from '../locales/zh/knowledge.json';
import enTerms from '../locales/en/terms.json';
import zhTerms from '../locales/zh/terms.json';
import enSwrProvider from '../locales/en/swrProvider.json';
import zhSwrProvider from '../locales/zh/swrProvider.json';

// 静态导入语言资源文件
const resources = {
  'en-US': {
    common: enCommon,
    login: enLogin,
    register: enRegister,
    forgotPassword: enForgotPassword,
    dashboard: enDashboard,
    plan: enPlan,
    wallet: enWallet,
    ticket: enTicket,
    profile: enProfile,
    order: enOrder,
    invite: enInvite,
    error: enError,
    traffic: enTraffic,
    header: enHeader,
    sidebar: enSidebar,
    knowledge: enKnowledge,
    terms: enTerms,
    swrProvider: enSwrProvider,
  },
  'zh-CN': {
    common: zhCommon,
    login: zhLogin,
    register: zhRegister,
    forgotPassword: zhForgotPassword,
    dashboard: zhDashboard,
    plan: zhPlan,
    wallet: zhWallet,
    ticket: zhTicket,
    profile: zhProfile,
    order: zhOrder,
    invite: zhInvite,
    error: zhError,
    traffic: zhTraffic,
    header: zhHeader,
    sidebar: zhSidebar,
    knowledge: zhKnowledge,
    terms: zhTerms,
    swrProvider: zhSwrProvider,
  },
};

void i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 传递 i18n 实例给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    resources,

    // 默认语言
    fallbackLng: 'zh-CN',

    // 调试模式 (生产环境建议关闭)
    debug: process.env.NODE_ENV === 'development',

    // 默认命名空间
    defaultNS: 'common',

    // 语言检测配置
    detection: {
      // 检测顺序
      order: ['localStorage', 'navigator', 'htmlTag'],

      // 缓存用户语言
      caches: ['localStorage'],

      // localStorage 键名
      lookupLocalStorage: 'shower_language',

      // 直接在配置中处理所有语言映射
      convertDetectedLanguage: (lng: string) => {
        if (lng === 'zh') return 'zh-CN';
        if (lng === 'en') return 'en-US';
        return 'zh-CN'; // 默认中文
      },
    },

    interpolation: {
      // React 组件已经安全转义
      escapeValue: false,
    },

    // 反应配置
    react: {
      // 启用suspense模式
      useSuspense: false,
    },
  });

export default i18n;
