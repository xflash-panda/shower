import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderMode from './HeaderMode';
import HeaderLanguage from './HeaderLanguage';
import { clearToken, removeRememberMeCredentials } from '@/helpers/auth';
import { RoutePaths } from '@/routes/AuthRoutes';
import toast from '@/helpers/toast';
import { mutate } from 'swr';
import { logout } from '@/api/v1/user';
import { useUserInfo } from '@/hooks/useUser';
import { formatCurrency } from '@/helpers/currency';
import { generateUserInitials } from '@/helpers/avatar';
import { CookieHelper, getCookieDomain } from '@/helpers/cookie';

const HeaderMenu: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['header', 'common']);

  // 创建无前缀的 CookieHelper 实例
  const cookieHelper = new CookieHelper('');

  // 获取用户信息
  const { userInfo, isLoading, isError, error } = useUserInfo();

  // 获取用户数据，如果加载失败使用默认值
  const userEmail = userInfo?.email;
  const userInitials = useMemo(() => {
    if (!userEmail) {
      return '';
    }
    return generateUserInitials(userEmail);
  }, [userEmail]);

  // 余额数据（这里需要添加余额相关的API调用）
  const totalBalance = (userInfo?.balance ?? 0) + (userInfo?.commission_balance ?? 0);
  const commissionBalance = userInfo?.commission_balance ?? 0;
  const accountBalance = userInfo?.balance ?? 0;

  /**
   * 处理用户登出
   * 调用登出API，清除认证令牌并重定向到登录页面
   */
  const handleLogout = async (): Promise<void> => {
    try {
      // 调用登出API
      await logout();
      // 显示成功消息
      toast.success(t('header:toast.auth.logoutSuccess'), 1200);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // 无论成功还是失败，都要清除本地状态
      clearToken();
      removeRememberMeCredentials();

      // 清理所有SWR缓存
      void mutate(() => true, undefined, { revalidate: true });

      // 重定向到登录页面
      navigate(RoutePaths.LOGIN, { replace: true });
    }
  };

  /**
   * 处理切换到旧版
   * 设置user_theme_preference cookie为default值
   */
  const handleSwitchToOldVersion = (): void => {
    try {
      const domain = getCookieDomain();

      // 设置cookie，过期时间为365天
      cookieHelper.set('user_theme_preference', 'default', {
        expires: 365,
        path: '/',
        domain: domain || undefined, // 只有在有域名时才设置
        secure: window.location.protocol === 'https:',
        sameSite: 'Lax',
      });

      // 刷新页面以应用新的主题设置
      window.location.reload();
    } catch (error) {
      console.error('Failed to switch to old version:', error);
      toast.error('Failed to switch to classic interface');
    }
  };
  // 处理加载状态
  if (isLoading) {
    return (
      <>
        <ul className="d-flex align-items-center">
          <li className="header-language">
            <HeaderLanguage />
          </li>
          <li className="header-dark">
            <HeaderMode />
          </li>
          <li className="header-profile">
            <div className="b-r-10 h-35 w-35 d-flex-center bg-secondary text-white f-w-500">
              <i className="ph-bold ph-spinner ph-spin"></i>
            </div>
          </li>
        </ul>
      </>
    );
  }

  // 处理错误状态
  if (isError) {
    console.error('Failed to load user info:', error);
  }

  return (
    <>
      <ul className="d-flex align-items-center">
        <li className="header-language">
          <HeaderLanguage />
        </li>

        <li className="header-dark">
          <HeaderMode />
        </li>

        <li className="header-profile">
          <a
            href="#"
            className="d-block head-icon"
            role="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#profilecanvasRight"
            aria-controls="profilecanvasRight"
          >
            <div className="b-r-10 h-35 w-35 d-flex-center bg-primary text-white f-s-18 f-w-500">
              {userInitials}
            </div>
          </a>

          <div
            className="offcanvas offcanvas-end header-profile-canvas"
            tabIndex={-1}
            id="profilecanvasRight"
            aria-labelledby="profilecanvasRight"
          >
            <div className="offcanvas-body app-scroll">
              <ul className="">
                <li className="d-flex gap-3 mb-3">
                  <div className="d-flex-center">
                    <span className="h-45 w-45 d-flex-center b-r-10 position-relative bg-primary text-white f-w-500 f-s-18">
                      {userInitials}
                    </span>
                  </div>
                  <div className="flex-grow-1 mt-2">
                    <h6 className="mb-0 txt-ellipsis-1">{userEmail}</h6>
                  </div>
                </li>

                <li className="app-divider-v dotted py-1"></li>
                <li>
                  <div className="card card-primary hover-effect d-block text-decoration-none mb-2">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <Link className="f-w-600 text-white" to="/wallet">
                            <i className="ph-bold ph-wallet pe-1 f-s-20"></i>
                            {t('menu.wallet')}
                          </Link>
                        </div>
                        <div className="text-end">
                          <div className="f-w-700 f-s-18 mb-1 text-white">
                            {formatCurrency(totalBalance)}
                          </div>
                          <div className="f-s-11 text-white text-opacity-75">
                            {t('menu.totalBalance')}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex justify-content-between">
                        <div className="text-center flex-1">
                          <div className="f-s-12 f-w-500 mb-1 text-white">
                            {formatCurrency(commissionBalance)}
                          </div>
                          <div className="f-s-10 text-white text-opacity-75">
                            {t('menu.commissionBalance')}
                          </div>
                        </div>

                        <div className="bg-white bg-opacity-20 mx-2 w-1"></div>

                        <div className="text-center flex-1">
                          <div className="f-s-12 f-w-500 mb-1 text-white">
                            {formatCurrency(accountBalance)}
                          </div>
                          <div className="f-s-10 text-white text-opacity-75">
                            {t('menu.accountBalance')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="app-divider-v dotted py-1"></li>
                <li>
                  <Link className="f-w-500" to="/profile">
                    <i className="ph-bold ph-user-circle pe-1 f-s-20"></i>
                    {t('menu.profile')}
                  </Link>
                </li>

                <li>
                  <Link className="f-w-500" to="/ticket">
                    <i className="ph-bold ph-ticket pe-1 f-s-20"></i> {t('menu.ticket')}
                  </Link>
                </li>

                <li>
                  <Link className="f-w-500" to="#" onClick={handleSwitchToOldVersion} type="button">
                    <i className="ph-bold ph-arrow-counter-clockwise pe-1 f-s-20"></i>
                    {t('menu.switchToOldVersion')}
                  </Link>
                </li>

                <li className="app-divider-v dotted py-1"></li>

                <li>
                  <button
                    className="mb-0 btn btn-primary btn-sm justify-content-center w-100"
                    onClick={() => void handleLogout()}
                    type="button"
                  >
                    <i className="ph-duotone ph-sign-out pe-1 f-s-20"></i> {t('menu.logout')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default HeaderMenu;
