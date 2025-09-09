import { useState, useEffect, type ChangeEvent } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCommonConfig } from '@/hooks/useGuest';
import { useCheckEmail } from '@/hooks/useIdentity';
import HeaderLanguage from '@layout/Header/HeaderLanguage';
import { description } from '@/helpers/default';
import { emailVerify, forget } from '@/api/v1/identity';
import toast from '@/helpers/toast';
import { turnstile } from '@/helpers/turnstile';
import { getLogoPath } from '@/helpers/assets';
import { EmailCodeInput } from '@/components/Common/EmailCodeInput';
import { getEmailCodeSentAddress, clearEmailCodeSentAddress } from '@/hooks/useEmailCodeCountdown';
import {
  isEmpty,
  isValidPassword,
  isPasswordMatch,
  isValidVerificationCode,
  matchesEmailRegex,
  isEmailLengthValid,
} from '@/helpers/validation';

const ForgotPassword = () => {
  const { t } = useTranslation('forgotPassword');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 静默验证码处理状态（仅用于表单提交）
  const [isProcessingCaptcha, setIsProcessingCaptcha] = useState(false);

  // 邮箱检查状态管理
  const [checkedEmail, setCheckedEmail] = useState<string>(''); // 已检查过的邮箱
  const [emailExists, setEmailExists] = useState<boolean | null>(null); // 邮箱是否存在

  // 验证错误状态
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    emailCode: '',
  });

  // 使用 useCommonConfig 获取配置
  const { config: commonConfig } = useCommonConfig();

  // 使用邮箱检查 hook
  const { checkEmailExists } = useCheckEmail();

  // 判断是否启用验证码（静默处理）
  const isCaptchaEnabled = commonConfig?.is_captcha_enable ?? false;
  const captchaType = commonConfig?.captcha_type;
  const turnstileSiteKey = commonConfig?.turnstile_site_key;

  // 判断是否需要静默处理 Turnstile 验证码
  const shouldHandleCaptcha = Boolean(
    isCaptchaEnabled && captchaType === 'turnstile' && turnstileSiteKey,
  );

  // 页面加载时恢复邮箱地址
  useEffect(() => {
    const savedEmail = getEmailCodeSentAddress('forgot-password');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // 验证函数
  const validateEmail = (email: string): string => {
    if (isEmpty(email)) {
      return t('validation.emailRequired');
    }

    if (!matchesEmailRegex(email)) {
      return t('validation.emailInvalid');
    }

    if (!isEmailLengthValid(email)) {
      return t('validation.emailTooLong');
    }

    return '';
  };

  const validatePassword = (password: string): string => {
    if (isEmpty(password)) {
      return t('validation.passwordRequired');
    }
    if (!isValidPassword(password)) {
      return t('validation.passwordTooShort');
    }
    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (isEmpty(confirmPassword)) {
      return t('validation.confirmPasswordRequired');
    }
    if (!isPasswordMatch(password, confirmPassword)) {
      return t('validation.passwordMismatch');
    }
    return '';
  };

  const validateEmailCode = (code: string): string => {
    if (isEmpty(code)) {
      return t('validation.emailCodeRequired');
    }
    if (!isValidVerificationCode(code)) {
      return t('validation.emailCodeInvalid');
    }
    return '';
  };

  // 清除特定字段的验证错误
  const clearValidationError = (field: keyof typeof validationErrors) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: '',
    }));
  };

  // 设置验证错误
  const setValidationError = (field: keyof typeof validationErrors, error: string) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: error,
    }));
  };

  // 公共邮箱检查方法 - 检查邮箱是否存在（忘记密码时邮箱必须存在）
  const performEmailExistenceCheck = async (email: string): Promise<boolean> => {
    try {
      const existsResult = await checkEmailExists(email);
      const exists = existsResult.data; // CheckEmailResult 的 data 字段是 boolean

      setCheckedEmail(email);
      setEmailExists(exists);

      if (!exists) {
        setValidationError('email', t('validation.emailNotExists'));
        return false;
      } else {
        clearValidationError('email');
        return true;
      }
    } catch (error) {
      console.error('Email check failed:', error);
      toast.error(t('error.emailCheckFailed'));
      return false;
    }
  };

  // 邮箱验证函数，供 EmailCodeInput 组件使用
  const handleEmailValidation = async (
    email: string,
  ): Promise<{ isValid: boolean; errorMessage?: string }> => {
    try {
      // 使用封装好的 performEmailExistenceCheck 方法
      const isEmailValid = await performEmailExistenceCheck(email);

      if (isEmailValid) {
        return { isValid: true };
      } else {
        return { isValid: false, errorMessage: 'Email does not exist' };
      }
    } catch (error) {
      console.error('Email validation failed:', error);
      const errorMessage = 'Email validation failed';
      setValidationError('email', errorMessage);
      return { isValid: false, errorMessage };
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    clearValidationError('email');

    // 当邮箱发生变化时，清除之前的检查结果
    if (checkedEmail !== value) {
      setCheckedEmail('');
      setEmailExists(null);
    }

    // 只有当邮箱不为空时才进行验证，避免在输入过程中显示错误
    if (value.trim()) {
      const error = validateEmail(value);
      if (error) {
        setValidationError('email', error);
      }
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    clearValidationError('password');

    // 实时验证密码
    const error = validatePassword(value);
    if (error) {
      setValidationError('password', error);
    }

    // 如果确认密码已输入，重新验证密码匹配
    if (confirmPassword) {
      clearValidationError('confirmPassword');
      const confirmError = validateConfirmPassword(value, confirmPassword);
      if (confirmError) {
        setValidationError('confirmPassword', confirmError);
      }
    }
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    clearValidationError('confirmPassword');

    // 实时验证密码匹配
    const error = validateConfirmPassword(password, value);
    if (error) {
      setValidationError('confirmPassword', error);
    }
  };

  // 静默获取验证码 token（使用统一的 helper）
  const getSilentCaptchaToken = async (): Promise<string | null> => {
    if (!shouldHandleCaptcha || !turnstileSiteKey) return null;
    return await turnstile.getSilentToken(turnstileSiteKey);
  };

  // 发送邮箱验证码的适配函数，供EmailCodeInput组件使用
  const handleSendEmailCode = async (email: string, turnstileToken?: string) => {
    const params: { email: string; captcha_data?: string } = { email };

    // 如果提供了 turnstile token，直接使用
    if (turnstileToken) {
      params.captcha_data = turnstileToken;
    } else if (shouldHandleCaptcha) {
      // 否则使用静默获取的验证码 token
      const captchaToken = await getSilentCaptchaToken();
      if (captchaToken) {
        params.captcha_data = captchaToken;
      }
    }

    await emailVerify(params);
  };

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证所有字段
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    const emailCodeError = validateEmailCode(emailCode);

    // 设置所有验证错误
    setValidationErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      emailCode: emailCodeError,
    });

    // 如果有任何验证错误，阻止提交
    if (emailError || passwordError || confirmPasswordError || emailCodeError) {
      toast.error(t('error.fixErrors'));
      return;
    }

    // 检查邮箱是否已检查过，如果没有检查过或者邮箱发生了变化，则进行检查
    if (checkedEmail !== email || emailExists === null) {
      const isEmailValid = await performEmailExistenceCheck(email);
      if (!isEmailValid) {
        return; // 如果邮箱不存在，阻止提交
      }
    }

    setIsSubmitting(true);
    setIsProcessingCaptcha(true);

    try {
      const params: API_V1.Identity.ForgetParams = {
        email,
        password,
        email_code: emailCode,
      };

      await forget(params);
      toast.success(t('success'));

      // 清除保存的邮箱地址
      clearEmailCodeSentAddress('forgot-password');

      // 密码重置成功后重定向到登录页面
      navigate('/login');
    } catch (error) {
      console.error('Password reset failed:', error);
      toast.error(t('error.resetFailed'));
    } finally {
      setIsSubmitting(false);
      setIsProcessingCaptcha(false);
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
                  <img src={getLogoPath('logo', 'webp')} width="250" alt="Logo" />
                </div>
              </div>
              <div className="form_container w-400">
                <form
                  className="app-form p-3 rounded-control"
                  onSubmit={e => {
                    void handleSubmit(e);
                  }}
                >
                  <div
                    className="mb-4 text-center"
                    dangerouslySetInnerHTML={{ __html: description }}
                  ></div>
                  <div className="mb-3">
                    <label className="form-label">
                      {t('form.email')} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                      placeholder={t('form.emailPlaceholder')}
                      value={email}
                      onChange={handleEmailChange}
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback d-block">{validationErrors.email}</div>
                    )}
                  </div>

                  {/* 邮箱验证码输入框 */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('form.emailCode')} <span className="text-danger">*</span>
                    </label>
                    <EmailCodeInput
                      value={emailCode}
                      onChange={value => {
                        setEmailCode(value);
                        clearValidationError('emailCode');

                        // 实时验证邮箱验证码
                        const error = validateEmailCode(value);
                        if (error) {
                          setValidationError('emailCode', error);
                        }
                      }}
                      email={email}
                      errorMessage={validationErrors.emailCode}
                      disabled={!!validationErrors.email}
                      onEmailValidation={handleEmailValidation}
                      onSendCode={handleSendEmailCode}
                      needsTurnstile={shouldHandleCaptcha}
                      turnstileSiteKey={
                        typeof turnstileSiteKey === 'string' ? turnstileSiteKey : undefined
                      }
                      className=""
                      scope="forgot-password"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      {t('form.newPassword')} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                      placeholder={t('form.newPasswordPlaceholder')}
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    {validationErrors.password && (
                      <div className="invalid-feedback d-block">{validationErrors.password}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      {t('form.confirmPassword')} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder={t('form.confirmPasswordPlaceholder')}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                    {validationErrors.confirmPassword && (
                      <div className="invalid-feedback d-block">
                        {validationErrors.confirmPassword}
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="btn btn-light-primary w-100"
                      disabled={
                        isSubmitting ||
                        isProcessingCaptcha ||
                        Object.values(validationErrors).some(error => Boolean(error.trim()))
                      }
                    >
                      {isSubmitting
                        ? isProcessingCaptcha
                          ? t('form.processing')
                          : t('form.resetting')
                        : t('form.reset')}
                    </button>
                  </div>

                  <div className="text-center mt-3">
                    <span className="text-secondary">{t('form.rememberedPassword')}</span>
                    <Link
                      to="/login"
                      className="text-primary text-decoration-underline ms-1"
                      onClick={() => clearEmailCodeSentAddress('forgot-password')}
                    >
                      {t('form.backToLogin')}
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ForgotPassword;
