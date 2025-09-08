import { RoutePaths } from '@/routes/AuthRoutes';
import type { SidebarMenuItem } from '@/layout/Sidebar/MenuItem';

// 菜单分组配置
export const menuGroups = {
  CORE: 'core',
  BUSINESS: 'business',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
} as const;

// 增强的侧边栏菜单配置
export const sidebarConfig: SidebarMenuItem[] = [
  {
    id: 'dashboard',
    name: 'menu.dashboard',
    path: RoutePaths.DASHBOARD,
    iconClass: 'ph-duotone ph-gauge',
  },
  {
    id: 'knowledge',
    name: 'menu.knowledge',
    path: RoutePaths.KNOWLEDGE,
    iconClass: 'ph-duotone ph-book-open',
  },
  {
    id: 'plan',
    name: 'menu.plan',
    path: RoutePaths.PLAN,
    iconClass: 'ph-duotone ph-crown',
    title: 'title.subscription',
  },
  {
    id: 'order',
    name: 'menu.order',
    path: RoutePaths.ORDER,
    iconClass: 'ph-duotone ph-package',
    title: 'title.finance',
  },
  {
    id: 'invite',
    name: 'menu.invite',
    path: RoutePaths.INVITE,
    iconClass: 'ph-duotone ph-star',
  },
  {
    id: 'traffic',
    name: 'menu.traffic',
    path: RoutePaths.TRAFFIC,
    iconClass: 'ph-duotone ph-chart-bar',
    title: 'title.statistics',
  },
];
