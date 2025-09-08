/**
 * 主题系统相关类型定义
 */

// 主题模式类型
export type ThemeMode = 'light' | 'dark';

// 侧边栏选项类型
export type SidebarOption =
  | 'vertical-sidebar'
  | 'horizontal-sidebar'
  | 'compact-sidebar'
  | 'dark-sidebar';

// 布局选项类型
export type LayoutOption = 'ltr' | 'rtl' | 'box-layout';

// 颜色选项类型
export type ColorOption = 'default' | 'gold' | 'warm' | 'happy' | 'nature' | 'hot';

// 文本大小选项类型
export type TextOption = 'small-text' | 'medium-text' | 'large-text';

// 主题设置对象类型
export interface ThemeSettings {
  mode: ThemeMode;
  sidebarOption: SidebarOption;
  layoutOption: LayoutOption;
  colorOption: ColorOption;
  textOption: TextOption;
}

// 部分主题设置类型（用于批量更新）
export type PartialThemeSettings = Partial<ThemeSettings>;
