import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentSize } from '@/helpers/theme';

interface LoadingProps {
  text?: string;
  variant?: 'default' | 'spinner' | 'dots' | 'wave' | 'pulse' | 'gradient' | 'bounce';
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  className?: string;
}

const Loading = ({
  text,
  variant = 'default',
  size = getCurrentSize(),
  centered = true,
  className = '',
}: LoadingProps): ReactElement => {
  const { t } = useTranslation('common');
  // 获取动态的默认 size 值
  const getLoaderClass = () => {
    switch (variant) {
      case 'spinner':
        return 'loader_1';
      case 'dots':
        return 'loader_2';
      case 'wave':
        return 'loader_7';
      case 'pulse':
        return 'loader_12';
      case 'gradient':
        return 'loader_21';
      case 'bounce':
        return 'loader_25';
      default:
        return 'loader_27';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'small';
      case 'lg':
        return 'h4';
      default:
        return '';
    }
  };

  const containerClass = centered ? 'd-flex justify-content-center align-items-center h-150' : '';

  // For spinner variant, use Bootstrap spinner instead of CSS loader
  if (variant === 'spinner') {
    return (
      <div className={`${containerClass} ${className}`}>
        <div className="text-center">
          <div
            className={`spinner-border text-primary mg-b-15 ${size === 'sm' ? 'spinner-border-sm' : ''}`}
            role="status"
          >
            <span className="visually-hidden">{text ?? t('loading')}</span>
          </div>
          <p className={`text-dark ${getSizeClass()} mg-b-0`}>{text ?? t('loading')}</p>
        </div>
      </div>
    );
  }

  // For CSS loaders, use custom loader classes
  return (
    <div className={`${containerClass} ${className}`}>
      <div className="text-center">
        <div className={`${getLoaderClass()} ${getSizeClass()}`}></div>
        {text && <p className={`text-dark mg-t-15 mg-b-0`}>{text}</p>}
      </div>
    </div>
  );
};

export default Loading;
