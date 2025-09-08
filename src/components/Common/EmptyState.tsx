import React from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentSize } from '@helpers/theme';

interface EmptyStateProps {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'info' | 'warning' | 'success' | 'dark';
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  size = getCurrentSize(),
  className = '',
  variant = 'dark',
  icon,
}) => {
  const { t } = useTranslation('common');
  const iconClass = icon ?? 'ph-duotone ph-battery-empty';

  const sizeClasses = {
    sm: {
      container: 'pa-25',
      icon: 'f-s-40', // 图标使用固定字体大小类
      titleTag: 'h6', // 使用语义化标签
      descriptionClass: 'small', // 使用Bootstrap小字体类
    },
    md: {
      container: 'pa-40',
      icon: 'f-s-56', // 图标使用固定字体大小类
      titleTag: 'h5', // 使用语义化标签
      descriptionClass: '', // 使用默认字体大小
    },
    lg: {
      container: 'pa-50',
      icon: 'f-s-72', // 图标使用固定字体大小类
      titleTag: 'h4', // 使用语义化标签
      descriptionClass: '', // 使用默认字体大小
    },
  };

  const variantClasses = {
    default: {
      iconColor: 'text-secondary',
      titleColor: 'text-dark',
      descriptionColor: 'text-muted',
    },
    primary: {
      iconColor: 'text-primary',
      titleColor: 'text-primary',
      descriptionColor: 'text-muted',
    },
    secondary: {
      iconColor: 'text-secondary',
      titleColor: 'text-secondary',
      descriptionColor: 'text-muted',
    },
    info: {
      iconColor: 'text-info',
      titleColor: 'text-info',
      descriptionColor: 'text-muted',
    },
    warning: {
      iconColor: 'text-warning',
      titleColor: 'text-warning',
      descriptionColor: 'text-muted',
    },
    success: {
      iconColor: 'text-success',
      titleColor: 'text-success',
      descriptionColor: 'text-muted',
    },
    dark: {
      iconColor: 'text-dark',
      titleColor: 'text-dark',
      descriptionColor: 'text-muted',
    },
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  return (
    <div
      className={`empty-state-container position-relative text-center ${currentSize.container} ${className}`}
    >
      <div className="d-flex flex-column align-items-center justify-content-center">
        {/* 简洁大气的图标 */}
        <div className="mg-b-24">
          <i className={`${iconClass} ${currentSize.icon} ${currentVariant.iconColor}`}></i>
        </div>

        {/* 标题 */}
        {React.createElement(
          currentSize.titleTag,
          {
            className: `${currentVariant.titleColor} f-fw-600 mg-b-8`,
          },
          title ?? t('emptyState.noData'),
        )}

        {/* 描述文本 */}
        {description && (
          <p
            className={`${currentSize.descriptionClass} ${currentVariant.descriptionColor} f-fw-400 mg-b-0 text-center lh-base w-300`}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
