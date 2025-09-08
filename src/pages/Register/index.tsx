import { useState, useMemo, useEffect, useRef, type ChangeEvent } from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCommonConfig } from '@/hooks/useGuest';
import { useHashParams } from '@/hooks/useHashParams';
import { useCheckEmail } from '@/hooks/useIdentity';
import { description } from '@/helpers/default';
import { emailVerify, register } from '@/api/v1/identity';
import toast from '@/helpers/toast';
import { turnstile } from '@/helpers/turnstile';
import { getLogoPath } from '@/helpers/assets';
import {
  isValidPassword,
  isPasswordMatch,
  isValidVerificationCode,
  hasValidEmailPrefixChars,
  isEmailPrefixLengthValid,
  isEmailLengthValid,
  matchesEmailRegex,
} from '@/helpers/validation';
import { EmailCodeInput } from '@/components/Common/EmailCodeInput';
import { getEmailCodeSentAddress, clearEmailCodeSentAddress } from '@/hooks/useEmailCodeCountdown';
import HeaderLanguage from '@layout/Header/HeaderLanguage';

const SignUp = () => {
  const { t } = useTranslation('register');
  const { t: tc } = useTranslation('common');
  const navigate = useNavigate();
  const [emailPrefix, setEmailPrefix] = useState('');
  const [emailSuffix, setEmailSuffix] = useState('@gmail.com');
  const [fullEmail, setFullEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 静默验证码处理状态（仅用于注册表单提交）
  const [isProcessingCaptcha, setIsProcessingCaptcha] = useState(false);

  // 邮箱检查状态管理
  const [checkedEmail, setCheckedEmail] = useState<string>(''); // 已检查过的邮箱
  const [emailExists, setEmailExists] = useState<boolean | null>(null); // 邮箱是否存在

  // 移除倒计时相关状态，现在由EmailCodeInput组件管理

  // 验证错误状态
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
    emailCode: '',
  });

  // 使用 useCommonConfig 获取邮箱后缀配置
  const { config: commonConfig, isLoading: isConfigLoading } = useCommonConfig();

  // 使用自定义 hook 读取 hash 参数
  const { getParam } = useHashParams();

  // 使用邮箱检查 hook
  const { checkEmailExists } = useCheckEmail();

  // 从配置中获取邮箱后缀，如果没有配置则使用默认值
  const emailSuffixes = useMemo(() => {
    return commonConfig?.email_whitelist_suffix ?? [];
  }, [commonConfig]);

  // 判断是否限制邮箱后缀
  const isEmailSuffixRestricted = emailSuffixes.length > 0;

  // 判断是否强制要求邀请码
  const isInviteRequired = commonConfig?.is_invite_force ?? false;

  // 判断是否需要邮箱验证
  const isEmailVerifyRequired = commonConfig?.is_email_verify ?? false;

  // 判断是否启用验证码（静默处理）
  const isCaptchaEnabled = commonConfig?.is_captcha_enable ?? false;
  const captchaType = commonConfig?.captcha_type;
  const turnstileSiteKey = commonConfig?.turnstile_site_key;

  // 判断是否需要静默处理 Turnstile 验证码
  const shouldHandleCaptcha = Boolean(
    isCaptchaEnabled && captchaType === 'turnstile' && turnstileSiteKey,
  );

  // 使用 ref 追踪是否已经初始化过默认后缀
  const isDefaultSuffixSet = useRef(false);

  // 移除倒计时管理函数，现在由EmailCodeInput组件管理

  // 当配置加载完成后，设置默认后缀为第一个可用的后缀
  useEffect(() => {
    if (isEmailSuffixRestricted && emailSuffixes.length > 0 && !isDefaultSuffixSet.current) {
      setEmailSuffix(emailSuffixes[0]);
      isDefaultSuffixSet.current = true;
    }
  }, [emailSuffixes, isEmailSuffixRestricted]);

  // 从 URL 参数中读取邀请码
  useEffect(() => {
    const inviteCodeParam = getParam('invite_code');
    if (inviteCodeParam) {
      setInviteCode(inviteCodeParam);
    }
  }, [getParam]);

  // 无邮箱后缀限制时恢复保存的邮箱地址
  useEffect(() => {
    if (!isEmailSuffixRestricted) {
      const savedEmail = getEmailCodeSentAddress('register');
      if (savedEmail) {
        setFullEmail(savedEmail);
      }
    }
  }, [isEmailSuffixRestricted]);

  // 有邮箱后缀限制时恢复保存的邮箱地址
  useEffect(() => {
    if (isEmailSuffixRestricted) {
      const savedEmail = getEmailCodeSentAddress('register');
      if (savedEmail) {
        const atIndex = savedEmail.indexOf('@');

        if (atIndex > 0) {
          const prefix = savedEmail.substring(0, atIndex);
          const suffix = savedEmail.substring(atIndex + 1);

          // 检查后缀是否在允许列表中，如果 emailSuffixes 还在加载中则跳过检查
          if (emailSuffixes.length === 0 || emailSuffixes.includes(suffix)) {
            setEmailPrefix(prefix);
            setEmailSuffix(suffix);
          }
        }
      }
    }
  }, [isEmailSuffixRestricted, emailSuffixes]);

  // 移除倒计时相关的useEffect，现在由EmailCodeInput组件管理

  // 内联验证函数 - 直接进行验证并返回错误消息
  const validateEmailPrefixLocal = (prefix: string): string => {
    if (!prefix?.trim()) {
      return t('validation.emailPrefixRequired');
    }

    if (!hasValidEmailPrefixChars(prefix)) {
      return t('validation.emailPrefixInvalid');
    }

    if (!isEmailPrefixLengthValid(prefix)) {
      return t('validation.emailPrefixTooLong');
    }

    return '';
  };

  const validateFullEmailLocal = (email: string): string => {
    if (!email?.trim()) {
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

  const validatePasswordLocal = (password: string): string => {
    if (!password?.trim()) {
      return t('validation.passwordRequired');
    }

    if (!isValidPassword(password)) {
      return t('validation.passwordTooShort');
    }

    return '';
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword?.trim()) {
      return t('validation.confirmPasswordRequired');
    }

    if (!isPasswordMatch(password, confirmPassword)) {
      return t('validation.passwordMismatch');
    }

    return '';
  };

  const validateInviteCode = (code: string): string => {
    if (isInviteRequired && !code?.trim()) {
      return t('validation.inviteCodeRequired');
    }
    return '';
  };

  const validateEmailCode = (code: string): string => {
    if (isEmailVerifyRequired && !code?.trim()) {
      return t('validation.emailCodeRequired');
    }
    if (code && !isValidVerificationCode(code)) {
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

  // 简化的邮箱验证函数
  const handleEmailValidation = async (
    email: string,
  ): Promise<{ isValid: boolean; errorMessage?: string }> => {
    try {
      // 直接使用封装好的 performEmailCheck 方法
      const isEmailValid = await performEmailCheck(email);

      if (isEmailValid) {
        return { isValid: true };
      } else {
        return { isValid: false, errorMessage: 'Email already registered' };
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
    if (isEmailSuffixRestricted) {
      setEmailPrefix(value);
      clearValidationError('email');
      // 验证邮箱前缀
      const prefixError = validateEmailPrefixLocal(value);
      if (prefixError) {
        setValidationError('email', prefixError);
      } else {
        // 前缀验证通过后，验证完整邮箱格式
        const fullEmail = `${value}@${emailSuffix}`;
        const fullEmailError = validateFullEmailLocal(fullEmail);
        if (fullEmailError) {
          setValidationError('email', fullEmailError);
        }
      }
    } else {
      setFullEmail(value);
      clearValidationError('email');
      // 实时验证完整邮箱
      const error = validateFullEmailLocal(value);
      if (error) {
        setValidationError('email', error);
      }
    }

    // 当邮箱发生变化时，清除之前的检查结果
    const newEmail = isEmailSuffixRestricted ? `${value}@${emailSuffix}` : value;
    if (checkedEmail !== newEmail) {
      setCheckedEmail('');
      setEmailExists(null);
    }
  };

  const handleSuffixChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setEmailSuffix(e.target.value);
    clearValidationError('email');

    // 当后缀变化时，重新验证完整邮箱
    if (emailPrefix.trim()) {
      const prefixError = validateEmailPrefixLocal(emailPrefix);
      if (prefixError) {
        setValidationError('email', prefixError);
      } else {
        const fullEmail = `${emailPrefix}@${e.target.value}`;
        const fullEmailError = validateFullEmailLocal(fullEmail);
        if (fullEmailError) {
          setValidationError('email', fullEmailError);
        }
      }
    }

    // 当邮箱后缀发生变化时，清除之前的检查结果
    const newEmail = `${emailPrefix}@${e.target.value}`;
    if (checkedEmail !== newEmail) {
      setCheckedEmail('');
      setEmailExists(null);
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    clearValidationError('password');

    // 实时验证密码
    const error = validatePasswordLocal(value);
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

  const handleInviteCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInviteCode(value);
    clearValidationError('inviteCode');

    // 实时验证邀请码
    const error = validateInviteCode(value);
    if (error) {
      setValidationError('inviteCode', error);
    }
  };

  // 静默获取验证码 token（使用统一的 helper）
  const getSilentCaptchaToken = async (): Promise<string | null> => {
    if (!shouldHandleCaptcha || !turnstileSiteKey) return null;
    return await turnstile.getSilentToken(turnstileSiteKey);
  };

  // 检查邮箱是否存在的函数
  const performEmailCheck = async (email: string): Promise<boolean> => {
    try {
      const result = await checkEmailExists(email);
      const exists = result.data; // CheckEmailResult 的 data 字段是 boolean

      setCheckedEmail(email);
      setEmailExists(exists);

      if (exists) {
        setValidationError('email', t('validation.emailExists'));
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

    // 获取当前邮箱值
    const email = isEmailSuffixRestricted ? `${emailPrefix}@${emailSuffix}` : fullEmail;

    // 验证所有字段
    const emailError = isEmailSuffixRestricted
      ? validateEmailPrefixLocal(emailPrefix)
      : validateFullEmailLocal(email);
    const passwordError = validatePasswordLocal(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
    const inviteCodeError = validateInviteCode(inviteCode);
    const emailCodeError = validateEmailCode(emailCode);

    // 设置所有验证错误
    setValidationErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      inviteCode: inviteCodeError,
      emailCode: emailCodeError,
    });

    // 如果有任何验证错误，阻止提交
    if (emailError || passwordError || confirmPasswordError || inviteCodeError || emailCodeError) {
      toast.error(tc('validation.fixErrors'));
      return;
    }

    // 检查邮箱是否已检查过，如果没有检查过或者邮箱发生了变化，则进行检查
    if (checkedEmail !== email || emailExists === null) {
      const isEmailValid = await performEmailCheck(email);
      if (!isEmailValid) {
        return; // 如果邮箱已存在，阻止提交
      }
    }

    setIsSubmitting(true);
    setIsProcessingCaptcha(true);

    try {
      const params: API_V1.Identity.RegisterParams = {
        email,
        password,
        invite_code: inviteCode,
        email_code: emailCode,
      };

      // 总是静默获取验证码 token（不管之前是否验证过）
      if (shouldHandleCaptcha) {
        const captchaToken = await getSilentCaptchaToken();
        if (captchaToken) {
          params.captcha_data = captchaToken;
        }
      }

      await register(params);
      toast.success(t('success'));

      // 清除保存的邮箱地址
      clearEmailCodeSentAddress('register');

      // 注册成功后重定向到登录页面
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(t('error.registerFailed'));
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
                    {isEmailSuffixRestricted ? (
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                          placeholder={t('form.emailPrefixPlaceholder')}
                          value={emailPrefix}
                          onChange={handleEmailChange}
                          style={{ flex: '1 1 60%' }}
                        />
                        <select
                          className="form-select"
                          value={emailSuffix}
                          onChange={handleSuffixChange}
                          disabled={isConfigLoading}
                          style={{ flex: '0 0 40%' }}
                        >
                          {isConfigLoading ? (
                            <option>{tc('loading')}</option>
                          ) : (
                            emailSuffixes.map(suffix => (
                              <option key={suffix} value={suffix}>
                                {suffix}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    ) : (
                      <input
                        type="email"
                        className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                        placeholder={t('form.emailPlaceholder')}
                        value={fullEmail}
                        onChange={handleEmailChange}
                      />
                    )}
                    {validationErrors.email && (
                      <div className="invalid-feedback d-block">{validationErrors.email}</div>
                    )}
                  </div>

                  {/* 根据 is_email_verify 配置决定是否显示邮箱验证码 */}
                  {isEmailVerifyRequired && (
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
                        email={
                          isEmailSuffixRestricted ? `${emailPrefix}@${emailSuffix}` : fullEmail
                        }
                        errorMessage={validationErrors.emailCode}
                        disabled={!!validationErrors.email} // 当邮箱有错误时禁用按钮
                        onEmailValidation={handleEmailValidation}
                        onSendCode={handleSendEmailCode}
                        needsTurnstile={shouldHandleCaptcha}
                        turnstileSiteKey={
                          typeof turnstileSiteKey === 'string' ? turnstileSiteKey : undefined
                        }
                        className=""
                        scope="register"
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">
                      {t('form.password')} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                      placeholder={t('form.passwordPlaceholder')}
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

                  <div className="mb-3">
                    <label className="form-label">
                      {t('form.inviteCode')}{' '}
                      {!isInviteRequired && <span className="text-muted">{tc('optional')}</span>}
                      {isInviteRequired && <span className="text-danger">*</span>}
                    </label>
                    <input
                      type="text"
                      className={`form-control ${validationErrors.inviteCode ? 'is-invalid' : ''}`}
                      placeholder={
                        isInviteRequired
                          ? t('form.inviteCodePlaceholder')
                          : t('form.inviteCodeOptionalPlaceholder')
                      }
                      value={inviteCode}
                      onChange={handleInviteCodeChange}
                    />
                    {validationErrors.inviteCode && (
                      <div className="invalid-feedback d-block">{validationErrors.inviteCode}</div>
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
                          : t('form.registering')
                        : t('form.register')}
                    </button>
                  </div>

                  <div className="text-center mt-3">
                    <span className="text-secondary">{t('form.hasAccount')}</span>
                    <Link
                      to="/login"
                      className="text-primary text-decoration-underline ms-1"
                      onClick={() => clearEmailCodeSentAddress('register')}
                    >
                      {t('form.loginNow')}
                    </Link>
                  </div>

                  {/* 根据 tos_url 配置决定是否显示用户协议 */}
                  {commonConfig?.tos_url && (
                    <div className="text-center mt-3">
                      <Link
                        to={
                          commonConfig.tos_url.startsWith('http') ? commonConfig.tos_url : '/terms'
                        }
                        className="text-secondary text-decoration-underline"
                        target={commonConfig.tos_url.startsWith('http') ? '_blank' : '_self'}
                        rel={
                          commonConfig.tos_url.startsWith('http')
                            ? 'noopener noreferrer'
                            : undefined
                        }
                      >
                        {t('form.terms')}
                      </Link>
                    </div>
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

export default SignUp;
