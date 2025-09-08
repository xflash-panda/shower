import { useGoogleLogin } from '@react-oauth/google';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GoogleLoginButtonProps {
  onSuccess: (response: any) => void;
  onError: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onSuccess, onError }) => {
  const { t } = useTranslation('login');
  const [loading, setLoading] = useState(false);

  // 使用Implicit flow
  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      try {
        // 将access_token传递给onSuccess回调
        onSuccess({
          access_token: tokenResponse.access_token,
        });
      } catch (error) {
        console.error('Error in Google login:', error);
        onError();
      } finally {
        setLoading(false);
      }
    },
    onError: error => {
      console.error('OAuth Error:', error);
      onError();
      setLoading(false);
    },
    flow: 'implicit', // 使用implicit flow
    scope: 'openid email profile',
    onNonOAuthError: error => {
      console.error('Non-OAuth Error:', error);
      onError();
      setLoading(false);
    },
  });

  // 使用useCallback处理点击事件，防止重复渲染
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) return; // 如果已经在加载中，则不执行任何操作

      e.preventDefault(); // 阻止默认行为
      e.stopPropagation(); // 阻止事件冒泡

      setLoading(true);

      // 添加一个小延迟，确保状态更新后再调用googleLogin
      setTimeout(() => {
        googleLogin();
      }, 10);
    },
    [loading, googleLogin],
  );

  return (
    <button
      type="button"
      className="btn btn-light-danger icon-btn b-r-5 m-1 w-45 h-45"
      title={t('form.googleLogin')}
      onClick={handleClick}
      disabled={loading}
    >
      <i className="ti ti-brand-google"></i>
    </button>
  );
};

export default GoogleLoginButton;
