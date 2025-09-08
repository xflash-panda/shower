import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from '@/helpers/toast';
import { turnstile } from '@/helpers/turnstile';
import { useEmailCodeCountdown } from '@/hooks/useEmailCodeCountdown';

interface EmailCodeInputProps {
  /** 邮箱验证码值 */
  value: string;
  /** 值变化回调 */
  onChange: (value: string) => void;
  /** 邮箱地址 */
  email: string;
  /** 验证错误信息，如果有值则自动显示错误状态 */
  errorMessage?: string;
  /** 是否禁用发送按钮 */
  disabled?: boolean;
  /** 邮箱验证回调函数，返回验证结果和错误信息 */
  onEmailValidation: (email: string) => Promise<{ isValid: boolean; errorMessage?: string }>;
  /** 发送验证码的API函数 */
  onSendCode: (email: string, turnstileToken?: string) => Promise<void>;

  /** 验证码输入框placeholder */
  placeholder?: string;
  /** 获取验证码按钮文本 */
  buttonText?: string;
  /** 倒计时时长（秒），默认60秒 */
  countdownDuration?: number;
  /** 是否需要Turnstile验证码 */
  needsTurnstile?: boolean;
  /** Turnstile site key */
  turnstileSiteKey?: string;
  /** 验证码最大长度 */
  maxLength?: number;
  /** 额外的CSS类名 */
  className?: string;
  /** 作用域，用于区分不同页面的倒计时状态 */
  scope?: string;
}

/**
 * 邮箱验证码输入组件
 * 包含验证码输入框和获取验证码按钮，支持倒计时功能
 */
export const EmailCodeInput: React.FC<EmailCodeInputProps> = ({
  value,
  onChange,
  email,
  errorMessage,
  disabled = false,
  onEmailValidation,
  onSendCode,

  placeholder,
  buttonText,
  countdownDuration = 60,
  needsTurnstile = false,
  turnstileSiteKey,
  maxLength = 6,
  className = '',
  scope = 'default',
}) => {
  const { t } = useTranslation('common');
  const [isSending, setIsSending] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [isProcessingCaptcha, setIsProcessingCaptcha] = useState(false);

  const { countdown, isCountingDown, startCountdown, saveEmailAddress } = useEmailCodeCountdown({
    duration: countdownDuration,
    scope, // 传入 scope 参数，实现不同页面独立的倒计时状态
  });

  // 处理验证码输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  // 处理发送验证码
  const handleSendCode = async () => {
    try {
      setIsSending(true);

      // 第一步：邮箱验证
      setIsValidatingEmail(true);
      const emailValidationResult = await onEmailValidation(email);
      setIsValidatingEmail(false);

      if (!emailValidationResult.isValid) {
        // 错误已在 onEmailValidation 中处理，直接返回
        return;
      }

      // 第二步：Turnstile 验证码（如果需要）
      let turnstileToken: string | undefined;
      if (needsTurnstile && turnstileSiteKey) {
        setIsProcessingCaptcha(true);

        try {
          const token = await turnstile.getToken(turnstileSiteKey);
          if (!token) {
            toast.error(t('emailCode.error.verificationFailed'));
            return;
          }
          turnstileToken = token;
        } catch (error) {
          console.error('Turnstile verification failed:', error);
          toast.error(t('emailCode.error.verificationFailed'));
          return;
        } finally {
          setIsProcessingCaptcha(false);
        }
      }

      // 第三步：发送验证码
      await onSendCode(email, turnstileToken);

      // 发送成功，开始倒计时并保存邮箱地址
      startCountdown();
      saveEmailAddress(email);

      toast.success(t('emailCode.success'));
    } catch (error: unknown) {
      console.error('Failed to send email code:', error);
      // 使用统一的错误处理
      toast.error(t('emailCode.error.sendFailed'));
    } finally {
      setIsSending(false);
      setIsValidatingEmail(false);
      setIsProcessingCaptcha(false);
    }
  };

  // 判断按钮是否应该禁用
  // 验证码格式错误不应该影响发送验证码按钮的状态
  const isButtonDisabled = disabled || isSending || isCountingDown || !email.trim();

  // 获取按钮显示文本
  const getButtonText = () => {
    if (isCountingDown) {
      return t('emailCode.countdown', { seconds: countdown });
    }
    if (isSending) {
      if (isValidatingEmail) {
        return t('emailCode.sending.validatingEmail');
      }
      if (isProcessingCaptcha) {
        return t('emailCode.sending.processingCaptcha');
      }
      return t('emailCode.sending.sending');
    }
    return buttonText ?? t('emailCode.buttonText');
  };

  return (
    <div className={`email-code-input ${className}`}>
      <div className="input-group">
        <input
          type="text"
          className={`form-control ${errorMessage ? 'is-invalid' : ''}`}
          placeholder={placeholder ?? t('emailCode.placeholder')}
          value={value}
          onChange={handleInputChange}
          maxLength={maxLength}
        />
        <button
          type="button"
          className="btn btn-outline-secondary"
          style={{ minWidth: '100px' }}
          onClick={() => void handleSendCode()}
          disabled={isButtonDisabled}
        >
          {getButtonText()}
        </button>
      </div>
      {errorMessage && <div className="invalid-feedback d-block">{errorMessage}</div>}
    </div>
  );
};
