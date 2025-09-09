import React, { useState, useEffect } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GoogleLoginButton from '@/components/Login/GoogleLoginButton';
import AppleLoginButton from '@/components/Login/AppleLoginButton';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { login, googleSignInWithAccessToken, appleSignIn } from '@/api/v1/identity';
import { RoutePaths } from '@/routes/AuthRoutes';
import toast from '@/helpers/toast';
import { isNetworkError, isAuthError } from '@/helpers/error';
import { description } from '@/helpers/default';
import { mutate } from 'swr';
import {
  type RememberMeCredentials,
  getRememberMeCredentials,
  setRememberMeCredentials,
  setToken,
  getRedirectPath,
} from '@/helpers/auth';
import { encryptPassword, decryptPassword } from '../../helpers/crypto';
import { matchesEmailRegex, isValidPassword } from '@/helpers/validation';
import HeaderLanguage from '@layout/Header/HeaderLanguage';
import { useCommonConfig } from '@/hooks/useGuest';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface AppleLoginResponse {
  authorization?: {
    id_token: string;
    code: string;
    state: string;
  };
  user?: {
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('login');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState<boolean>(false);

  // 初始化加载 commonConfig
  const { config: commonConfig } = useCommonConfig();

  // 组件初始化时从localStorage恢复用户信息
  useEffect(() => {
    const savedCredentials = getRememberMeCredentials();
    if (savedCredentials?.email) {
      // 解密密码（如果存在）
      let decryptedPassword = '';
      if (savedCredentials.password) {
        try {
          decryptedPassword = decryptPassword(savedCredentials.password);
        } catch (error) {
          console.error('Failed to decrypt password:', error);
          // 密码解密失败时不影响邮箱的恢复
        }
      }
      setFormData(prev => ({
        ...prev,
        email: savedCredentials.email,
        password: decryptedPassword,
      }));
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else if (!matchesEmailRegex(formData.email)) {
      newErrors.email = t('validation.emailInvalid');
    }

    // 验证密码
    if (!formData.password) {
      newErrors.password = t('validation.passwordRequired');
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = t('validation.passwordTooShort');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // 清除对应字段的错误信息（仅适用于字符串字段）
    if (typeof value === 'string' && errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 直接调用API，无需SWR
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      if (response?.data?.token) {
        setToken(response.data.token);

        // 清除所有 SWR 缓存，确保登录后获取最新数据
        void mutate(() => true, undefined, { revalidate: true });

        // 处理记住我功能...
        const encryptedPassword =
          formData.rememberMe && formData.password ? encryptPassword(formData.password) : undefined;

        const credentialsToSave: RememberMeCredentials = {
          email: formData.email,
          password: encryptedPassword,
          rememberMe: formData.rememberMe,
        };

        if (formData.rememberMe) {
          setRememberMeCredentials(credentialsToSave);
        }

        toast.success(t('success'), 1200);
        // 添加短暂延迟确保 token 完全设置后再跳转，避免 Dashboard 数据加载问题
        setTimeout(() => {
          navigate(getRedirectPath(RoutePaths.DASHBOARD), { replace: true });
        }, 300);
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(t('error.loginFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理 Google 登录成功
  const handleGoogleLoginSuccess = async (response: { access_token: string }) => {
    if (isGoogleLoggingIn) return; // 防止重复调用

    setIsGoogleLoggingIn(true);

    try {
      // 调用后端 API 进行 Google 登录验证
      const loginResponse = await googleSignInWithAccessToken({
        access_token: response.access_token,
      });

      if (loginResponse?.data?.token) {
        // 登录成功，保存 token
        setToken(loginResponse.data.token);

        // 清除所有 SWR 缓存，确保登录后获取最新数据
        void mutate(() => true, undefined, { revalidate: true });

        // 显示成功消息
        toast.success(t('success'), 1200);

        // 添加短暂延迟确保 token 完全设置后再跳转，避免 Dashboard 数据加载问题
        setTimeout(() => {
          navigate(getRedirectPath(RoutePaths.DASHBOARD), { replace: true });
        }, 300);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Google login failed:', error);
      // 根据错误类型显示不同的错误消息
      if (error instanceof Error) {
        if (isNetworkError(error)) {
          toast.error(t('error.networkError'));
        } else if (isAuthError(error)) {
          toast.error(t('error.googleNotAuthorized'));
        } else {
          toast.error(t('error.googleLoginFailed'));
        }
      }
    } finally {
      setIsGoogleLoggingIn(false);
    }
  };

  // 处理 Google 登录失败
  const handleGoogleLoginError = () => {
    // 显示用户友好的错误消息
    toast.error(t('error.googleLoginFailed'));

    // 重置 Google 登录状态
    setIsGoogleLoggingIn(false);
  };

  // 处理 Apple 登录响应
  const handleAppleResponse = async (response: AppleLoginResponse) => {
    if (isSubmitting) return; // 防止重复调用

    setIsSubmitting(true);

    try {
      // 检查 Apple 登录是否成功
      if (response.authorization) {
        // 调用后端 API 进行 Apple 登录验证
        const loginResponse = await appleSignIn({
          identity_token: response.authorization.id_token,
        });

        if (loginResponse?.data?.token) {
          // 登录成功，保存 token
          setToken(loginResponse.data.token);

          // 清除所有 SWR 缓存，确保登录后获取最新数据
          void mutate(() => true, undefined, { revalidate: true });

          // 显示成功消息
          toast.success(t('success'), 1200);

          // 添加短暂延迟确保 token 完全设置后再跳转，避免 Dashboard 数据加载问题
          setTimeout(() => {
            navigate(getRedirectPath(RoutePaths.DASHBOARD), { replace: true });
          }, 300);
        } else {
          throw new Error('Invalid response from server');
        }
      } else {
        throw new Error('Apple login failed - no authorization data');
      }
    } catch (error) {
      console.error('Apple login failed:', error);
      // 根据错误类型显示不同的错误消息
      if (error instanceof Error) {
        if (isNetworkError(error)) {
          toast.error(t('error.networkError'));
        } else if (isAuthError(error)) {
          toast.error(t('error.appleNotAuthorized'));
        } else {
          toast.error(t('error.appleLoginFailed'));
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="position-fixed top-0 end-0 pa-20">
        <HeaderLanguage />
      </div>
      <Container fluid>
        <Row>
          <Col xs={12} className="p-0">
            <div className="login-form-container">
              <div className="mb-4">
                <div className="logo d-inline-block">
                  <img
                    src="assets/images/logo/logo.webp"
                    alt="Shower Panel Logo"
                    width="250"
                    height="auto"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              </div>
              <div className="form_container w-400">
                <form className="app-form rounded-control" onSubmit={e => void handleSubmit(e)}>
                  <div
                    className="mb-4 text-center"
                    dangerouslySetInnerHTML={{ __html: description }}
                  ></div>
                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark mg-b-8">
                      {t('form.email')}
                    </label>
                    <input
                      type="email"
                      className={`form-control pa-12-16 ${errors.email ? 'is-invalid' : ''}`}
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block f-s-12 text-danger mg-t-5">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-medium text-dark f-s-14 mg-b-8">
                      {t('form.password')}
                    </label>
                    <input
                      type="password"
                      className={`form-control f-s-15 pa-12-16 ${errors.password ? 'is-invalid' : ''}`}
                      value={formData.password}
                      onChange={e => handleInputChange('password', e.target.value)}
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block f-s-12 text-danger mg-t-5">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="formCheck1"
                        checked={formData.rememberMe}
                        onChange={e => handleInputChange('rememberMe', e.target.checked)}
                      />
                      <label
                        className="form-check-label text-secondary f-s-14"
                        htmlFor="formCheck1"
                      >
                        {t('form.rememberMe')}
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-primary text-decoration-underline fw-medium f-s-14"
                    >
                      {t('form.forgotPassword')}
                    </Link>
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-light-primary w-100 fw-semibold f-s-16 pa-12-24"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('form.loggingIn') : t('form.login')}
                    </button>
                  </div>
                  <div className="text-center mb-4">
                    <span className="text-secondary f-s-14">{t('form.noAccount')}</span>
                    <Link
                      to="/register"
                      className="text-primary text-decoration-underline ms-1 fw-medium f-s-14"
                    >
                      {t('form.registerNow')}
                    </Link>
                  </div>

                  {/* 根据配置决定是否显示第三方登录 */}
                  {((commonConfig?.google_client_id ?? false) ||
                    (commonConfig?.apple_client_id ?? false)) && (
                    <>
                      <div className="app-divider-v justify-content-center mb-3">
                        <p className="text-muted fw-medium f-s-14 mg-0">{t('form.otherMethods')}</p>
                      </div>
                      <div className="mb-3">
                        <div className="text-center">
                          {commonConfig?.google_client_id && (
                            <GoogleOAuthProvider clientId={commonConfig.google_client_id}>
                              <GoogleLoginButton
                                onSuccess={(response: { access_token: string }) =>
                                  void handleGoogleLoginSuccess(response)
                                }
                                onError={handleGoogleLoginError}
                              />
                            </GoogleOAuthProvider>
                          )}
                          {commonConfig?.apple_client_id && (
                            <AppleLoginButton
                              clientId={commonConfig.apple_client_id}
                              onCallback={(response: AppleLoginResponse) => {
                                void handleAppleResponse(response);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
