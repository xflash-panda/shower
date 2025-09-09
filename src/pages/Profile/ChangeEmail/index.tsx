import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import HeaderLanguage from '@layout/Header/HeaderLanguage';
import { description } from '@/helpers/default';
import { useUserInfo } from '@/hooks/useUser';
import { useCommonConfig } from '@/hooks/useGuest';
import { useCheckEmail } from '@/hooks/useIdentity';
import { emailVerify, changeEmail } from '@/api/v1/identity';
import { EmailCodeInput } from '@/components/Common/EmailCodeInput';
import { getEmailCodeSentAddress, clearEmailCodeSentAddress } from '@/hooks/useEmailCodeCountdown';
import toast from '@/helpers/toast';
import { turnstile } from '@/helpers/turnstile';
import { getLogoPath } from '@/helpers/assets';
import {
  isValidPassword,
  isValidVerificationCode,
  hasValidEmailPrefixChars,
  isEmailPrefixLengthValid,
  isEmailLengthValid,
  matchesEmailRegex,
} from '@/helpers/validation';

const ChangeEmail = () => {
  const { t } = useTranslation('profile');
  const navigate = useNavigate();

  // 获取用户信息
  const { userInfo, isLoading: isUserLoading } = useUserInfo();

  // 获取配置信息
  const { config: commonConfig, isLoading: isConfigLoading } = useCommonConfig();

  // 使用邮箱检查 hook
  const { checkEmailExists } = useCheckEmail();

  // 当前邮箱从用户信息中获取
  const currentEmail = userInfo?.email ?? '';

  const [newEmailPrefix, setNewEmailPrefix] = useState('');
  const [newEmailSuffix, setNewEmailSuffix] = useState('@gmail.com');
  const [fullNewEmail, setFullNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 邮箱检查状态管理
  const [checkedEmail, setCheckedEmail] = useState<string>('');
  const [emailExists, setEmailExists] = useState<boolean | null>(null);

  // 验证错误状态
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    emailCode: '',
  });

  // 从配置中获取邮箱后缀，如果没有配置则使用默认值
  const emailSuffixes = useMemo(() => {
    return commonConfig?.email_whitelist_suffix ?? [];
  }, [commonConfig]);

  // 判断是否限制邮箱后缀
  const isEmailSuffixRestricted = emailSuffixes.length > 0;

  // 判断是否启用验证码（静默处理）
  const isCaptchaEnabled = commonConfig?.is_captcha_enable ?? false;
  const captchaType = commonConfig?.captcha_type;
  const turnstileSiteKey = commonConfig?.turnstile_site_key;

  // 判断是否需要静默处理 Turnstile 验证码
  const shouldHandleCaptcha = Boolean(
    isCaptchaEnabled && captchaType === 'turnstile' && turnstileSiteKey,
  );

  // 当配置加载完成后，设置默认后缀为第一个可用的后缀
  useEffect(() => {
    if (isEmailSuffixRestricted && emailSuffixes.length > 0) {
      setNewEmailSuffix(emailSuffixes[0]);
    }
  }, [emailSuffixes, isEmailSuffixRestricted]);

  // 页面初始化时从 localStorage 恢复保存的邮箱地址
  useEffect(() => {
    const savedEmail = getEmailCodeSentAddress('changeEmail');
    if (savedEmail?.trim()) {
      if (isEmailSuffixRestricted) {
        // 如果是限制后缀模式，解析邮箱前缀和后缀
        const atIndex = savedEmail.indexOf('@');
        if (atIndex > 0) {
          const prefix = savedEmail.substring(0, atIndex);
          const suffix = savedEmail.substring(atIndex);
          setNewEmailPrefix(prefix);
          if (emailSuffixes.includes(suffix)) {
            setNewEmailSuffix(suffix);
          }
        }
      } else {
        // 如果不是限制后缀模式，直接设置完整邮箱
        setFullNewEmail(savedEmail);
      }
    }
  }, [isEmailSuffixRestricted, emailSuffixes]);

  // 验证函数
  const validateEmailPrefixLocal = (prefix: string): string => {
    if (!prefix?.trim()) {
      return t('security.changeEmail.validation.emailPrefixRequired');
    }

    if (!hasValidEmailPrefixChars(prefix)) {
      return t('security.changeEmail.validation.emailPrefixInvalidChars');
    }

    if (!isEmailPrefixLengthValid(prefix)) {
      return t('security.changeEmail.validation.emailPrefixTooLong');
    }

    return '';
  };

  const validateFullEmailLocal = (email: string): string => {
    if (!email?.trim()) {
      return t('security.changeEmail.validation.emailRequired');
    }

    if (!matchesEmailRegex(email)) {
      return t('security.changeEmail.validation.emailInvalidFormat');
    }

    if (!isEmailLengthValid(email)) {
      return t('security.changeEmail.validation.emailTooLong');
    }

    return '';
  };

  const validatePasswordLocal = (password: string): string => {
    if (!password?.trim()) {
      return t('security.changeEmail.validation.passwordRequired');
    }

    if (!isValidPassword(password)) {
      return t('security.changeEmail.validation.passwordTooShort');
    }

    return '';
  };

  const validateEmailCode = (code: string): string => {
    if (!code?.trim()) {
      return t('security.changeEmail.validation.emailCodeRequired');
    }
    if (!isValidVerificationCode(code)) {
      return t('security.changeEmail.validation.emailCodeInvalidFormat');
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

  // 检查邮箱是否存在的函数
  const performEmailCheck = async (email: string): Promise<boolean> => {
    try {
      const result = await checkEmailExists(email);
      const exists = result.data;

      setCheckedEmail(email);
      setEmailExists(exists);

      if (exists) {
        setValidationError('email', t('security.changeEmail.validation.emailAlreadyRegistered'));
        return false;
      } else {
        clearValidationError('email');
        return true;
      }
    } catch (error) {
      console.error('Email check failed:', error);
      toast.error(t('security.changeEmail.error.emailCheckFailed'));
      return false;
    }
  };

  // 邮箱验证函数
  const handleEmailValidation = async (
    email: string,
  ): Promise<{ isValid: boolean; errorMessage?: string }> => {
    try {
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

  // 静默获取验证码 token
  const getSilentCaptchaToken = async (): Promise<string | null> => {
    if (!shouldHandleCaptcha || !turnstileSiteKey) return null;
    return await turnstile.getSilentToken(turnstileSiteKey);
  };

  // 发送邮箱验证码的适配函数
  const handleSendEmailCode = async (email: string, turnstileToken?: string) => {
    const params: { email: string; captcha_data?: string } = { email };

    if (turnstileToken) {
      params.captcha_data = turnstileToken;
    } else if (shouldHandleCaptcha) {
      const captchaToken = await getSilentCaptchaToken();
      if (captchaToken) {
        params.captcha_data = captchaToken;
      }
    }

    await emailVerify(params);
  };

  const handleNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isEmailSuffixRestricted) {
      setNewEmailPrefix(value);
      clearValidationError('email');
      // 验证邮箱前缀
      const prefixError = validateEmailPrefixLocal(value);
      if (prefixError) {
        setValidationError('email', prefixError);
      } else {
        // 前缀验证通过后，验证完整邮箱格式
        const fullEmail = `${value}@${newEmailSuffix}`;
        const fullEmailError = validateFullEmailLocal(fullEmail);
        if (fullEmailError) {
          setValidationError('email', fullEmailError);
        }
      }
    } else {
      setFullNewEmail(value);
      clearValidationError('email');
      // 实时验证完整邮箱
      const error = validateFullEmailLocal(value);
      if (error) {
        setValidationError('email', error);
      }
    }

    // 当邮箱发生变化时，清除之前的检查结果
    const newEmail = isEmailSuffixRestricted ? `${value}@${newEmailSuffix}` : value;
    if (checkedEmail !== newEmail) {
      setCheckedEmail('');
      setEmailExists(null);
    }
  };

  const handleSuffixChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewEmailSuffix(e.target.value);
    clearValidationError('email');

    // 当后缀变化时，重新验证完整邮箱
    if (newEmailPrefix.trim()) {
      const prefixError = validateEmailPrefixLocal(newEmailPrefix);
      if (prefixError) {
        setValidationError('email', prefixError);
      } else {
        const fullEmail = `${newEmailPrefix}@${e.target.value}`;
        const fullEmailError = validateFullEmailLocal(fullEmail);
        if (fullEmailError) {
          setValidationError('email', fullEmailError);
        }
      }
    }

    // 当邮箱后缀发生变化时，清除之前的检查结果
    const newEmail = `${newEmailPrefix}@${e.target.value}`;
    if (checkedEmail !== newEmail) {
      setCheckedEmail('');
      setEmailExists(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    clearValidationError('password');

    // 实时验证密码
    const error = validatePasswordLocal(value);
    if (error) {
      setValidationError('password', error);
    }
  };

  const handleChangeEmail = async () => {
    // 获取新邮箱值
    const newEmail = isEmailSuffixRestricted ? `${newEmailPrefix}@${newEmailSuffix}` : fullNewEmail;

    // 验证所有字段
    const emailError = isEmailSuffixRestricted
      ? validateEmailPrefixLocal(newEmailPrefix)
      : validateFullEmailLocal(newEmail);
    const passwordError = validatePasswordLocal(password);
    const emailCodeError = validateEmailCode(emailCode);

    // 设置所有验证错误
    setValidationErrors({
      email: emailError,
      password: passwordError,
      emailCode: emailCodeError,
    });

    // 如果有任何验证错误，阻止提交
    if (emailError || passwordError || emailCodeError) {
      toast.error(t('security.changeEmail.error.fixErrors'));
      return;
    }

    // 检查新邮箱是否与当前邮箱相同
    if (newEmail === currentEmail) {
      toast.error(t('security.changeEmail.error.sameEmail'));
      return;
    }

    // 检查邮箱是否已检查过，如果没有检查过或者邮箱发生了变化，则进行检查
    if (checkedEmail !== newEmail || emailExists === null) {
      const isEmailValid = await performEmailCheck(newEmail);
      if (!isEmailValid) {
        return; // 如果邮箱已存在，阻止提交
      }
    }

    setIsSubmitting(true);

    try {
      const params: API_V1.Identity.ChangeEmailParams = {
        email: newEmail,
        password,
        email_code: emailCode,
      };

      await changeEmail(params);
      toast.success(t('security.changeEmail.success.changeSuccess'));

      // 清除保存的邮箱地址
      clearEmailCodeSentAddress('changeEmail');

      // 修改成功后返回安全设置页面
      navigate('/profile', { state: { defaultTab: 'security' } });
    } catch (error) {
      console.error('Email change failed:', error);
      toast.error(t('security.changeEmail.error.changeFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReturnToSecurity = () => {
    // 清除保存的邮箱地址
    clearEmailCodeSentAddress('changeEmail');
    navigate('/profile', { state: { defaultTab: 'security' } });
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
                <Link className="logo d-inline-block" to="/dashboard">
                  <img src={getLogoPath('logo', 'webp')} width="250" />
                </Link>
              </div>
              <div className="form_container w-400">
                <form
                  className="app-form p-3 rounded-control"
                  onSubmit={e => {
                    e.preventDefault();
                    void handleChangeEmail();
                  }}
                >
                  <div
                    className="mb-4 text-center"
                    dangerouslySetInnerHTML={{ __html: description }}
                  ></div>

                  {/* 当前邮箱显示 */}
                  <div className="mb-3">
                    <label className="form-label">{t('security.changeEmail.currentEmail')}</label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={currentEmail}
                      disabled
                    />
                  </div>

                  {/* 新邮箱输入 */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('security.changeEmail.newEmail')} <span className="text-danger">*</span>
                    </label>
                    {isEmailSuffixRestricted ? (
                      <div className="input-group">
                        <input
                          type="text"
                          className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                          placeholder={t('security.changeEmail.newEmailPrefixPlaceholder')}
                          value={newEmailPrefix}
                          onChange={handleNewEmailChange}
                          style={{ flex: '1 1 60%' }}
                        />
                        <select
                          className="form-select"
                          value={newEmailSuffix}
                          onChange={handleSuffixChange}
                          disabled={isConfigLoading}
                          style={{ flex: '0 0 40%' }}
                        >
                          {isConfigLoading ? (
                            <option>{t('security.changeEmail.loading')}</option>
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
                        placeholder={t('security.changeEmail.newEmailPlaceholder')}
                        value={fullNewEmail}
                        onChange={handleNewEmailChange}
                      />
                    )}
                    {validationErrors.email && (
                      <div className="invalid-feedback d-block">{validationErrors.email}</div>
                    )}
                  </div>

                  {/* 邮箱验证码 */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('security.changeEmail.emailCode')} <span className="text-danger">*</span>
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
                        isEmailSuffixRestricted
                          ? `${newEmailPrefix}@${newEmailSuffix}`
                          : fullNewEmail
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
                      scope="changeEmail"
                    />
                  </div>

                  {/* 当前密码 */}
                  <div className="mb-3">
                    <label className="form-label">
                      {t('security.changeEmail.currentPassword')}{' '}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                      placeholder={t('security.changeEmail.currentPasswordPlaceholder')}
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    {validationErrors.password && (
                      <div className="invalid-feedback d-block">{validationErrors.password}</div>
                    )}
                  </div>

                  {/* 提交按钮 */}
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn btn-light-primary w-100"
                      disabled={
                        isSubmitting ||
                        isUserLoading ||
                        Object.values(validationErrors).some(error => Boolean(error.trim()))
                      }
                    >
                      {isSubmitting
                        ? t('security.changeEmail.changing')
                        : t('security.changeEmail.changeEmail')}
                    </button>
                  </div>

                  {/* 返回链接 */}
                  <div className="text-center">
                    <span className="text-secondary">{t('security.changeEmail.cancelChange')}</span>
                    <button
                      type="button"
                      onClick={handleReturnToSecurity}
                      className="text-primary text-decoration-underline ms-1 fw-medium border-0 bg-transparent"
                    >
                      {t('security.changeEmail.returnToSecurity')}
                    </button>
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

export default ChangeEmail;
