import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Col,
  Button,
  Label,
  Input,
  InputGroup,
  InputGroupText,
} from 'reactstrap';
import ChangeEmailConfirmModal from '@components/Profile/ChangeEmailConfirmModal';
import ResetSubscriptionConfirmModal from '@components/Profile/ResetSubscriptionConfirmModal';
import DeleteAccountConfirmModal from '@components/Profile/DeleteAccountConfirmModal';
import { changePassword, resetSecurity, destroy } from '@/api/v1/user';
import { useUserInfo } from '@/hooks/useUser';
import { clearToken } from '@helpers/auth';
import { getErrorMessage } from '@helpers/error';
import toast from '@helpers/toast';

interface PasswordVisibility {
  currentPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

type PasswordField = keyof PasswordVisibility;

const SecurityCard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('profile');

  // 获取用户信息和 mutate 函数
  const {
    userInfo,
    isLoading: isUserInfoLoading,
    isError: isUserInfoError,
    mutate: mutateUserInfo,
  } = useUserInfo();
  const [passwordVisible, setPasswordVisible] = useState<PasswordVisibility>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // 密码表单相关状态
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [isSubmittingPassword, setIsSubmittingPassword] = useState<boolean>(false);

  // 注销账号相关状态
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState<boolean>(false);

  // 重置订阅信息相关状态
  const [resetSubscriptionModal, setResetSubscriptionModal] = useState<boolean>(false);
  const [isResettingSubscription, setIsResettingSubscription] = useState<boolean>(false);

  // 更换邮箱确认相关状态
  const [changeEmailModal, setChangeEmailModal] = useState<boolean>(false);

  const togglePasswordVisibility = (field: PasswordField): void => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // 处理密码表单输入
  const handlePasswordInputChange = (field: keyof PasswordFormData, value: string): void => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value,
    }));

    // 清除对应字段的错误提示
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // 验证密码表单
  const validatePasswordForm = (): boolean => {
    const errors: PasswordErrors = {};

    // 验证当前密码（仅当用户已设置密码时）
    if (hasPassword && !passwordForm.currentPassword.trim()) {
      errors.currentPassword = t('security.validation.currentPasswordRequired');
    }

    // 验证新密码
    if (!passwordForm.newPassword.trim()) {
      errors.newPassword = t('security.validation.newPasswordRequired');
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = t('security.validation.passwordTooShort');
    } else if (hasPassword && passwordForm.newPassword === passwordForm.currentPassword) {
      errors.newPassword = t('security.validation.passwordsSame');
    }

    // 验证确认密码
    if (!passwordForm.confirmPassword.trim()) {
      errors.confirmPassword = t('security.validation.confirmPasswordRequired');
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = t('security.validation.passwordsNotMatch');
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 处理密码修改提交
  const handlePasswordSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setIsSubmittingPassword(true);

    try {
      // 调用更改密码 API
      await changePassword({
        old_password: hasPassword ? passwordForm.currentPassword : '',
        new_password: passwordForm.newPassword,
      });

      toast.success(t('security.changePassword.success'));

      // 重置表单
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});

      // 更新用户信息缓存，因为用户现在已经有密码了
      await mutateUserInfo();
    } catch (error) {
      console.error('Failed to update password:', error);
      const errorMessage = getErrorMessage(error, t('security.changePassword.error'));
      toast.error(errorMessage);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  // 处理注销账号
  const handleDeleteAccount = async (): Promise<void> => {
    setIsDeletingAccount(true);

    try {
      // 调用实际的注销 API
      await destroy();

      toast.success(t('security.deleteAccount.success'));
      setDeleteModal(false);

      // 注销成功后的逻辑，清除token并跳转到登录页面
      clearToken();
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
      const errorMessage = getErrorMessage(error, t('security.deleteAccount.error'));
      toast.error(errorMessage);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // 重置注销表单
  const resetDeleteForm = (): void => {
    setDeleteModal(false);
  };

  // 处理重置订阅信息
  const handleResetSubscription = async (): Promise<void> => {
    setIsResettingSubscription(true);

    try {
      await resetSecurity();

      // 重置成功
      toast.success(t('security.resetSubscription.success'));
      setResetSubscriptionModal(false);

      // 清除 userInfo 缓存，强制重新获取最新用户信息
      await mutateUserInfo();

      // 可以在这里处理返回的新订阅URL
    } catch (error) {
      console.error('Failed to reset subscription:', error);
      const errorMessage = getErrorMessage(error, t('security.resetSubscription.error'));
      toast.error(errorMessage);
    } finally {
      setIsResettingSubscription(false);
    }
  };

  // 重置订阅表单
  const resetSubscriptionForm = (): void => {
    setResetSubscriptionModal(false);
  };

  // 处理更换邮箱跳转
  const handleChangeEmail = (): void => {
    setChangeEmailModal(true);
  };

  // 确认更换邮箱
  const handleConfirmChangeEmail = (): void => {
    setChangeEmailModal(false);
    navigate('/profile/change-email');
  };

  // 重置更换邮箱表单
  const resetChangeEmailForm = (): void => {
    setChangeEmailModal(false);
  };

  // 计算用户是否已设置密码
  const hasPassword = userInfo?.has_password ?? true;

  // 计算全局加载状态 - 用于禁用所有按钮
  const isGlobalLoading =
    isUserInfoLoading || isSubmittingPassword || isResettingSubscription || isDeletingAccount;

  // 如果用户信息加载失败，显示错误状态
  if (isUserInfoError || (!isUserInfoLoading && !userInfo)) {
    return (
      <Card className="mb-4">
        <CardBody className="text-center py-5">
          <div className="text-danger">
            <i className="ph-warning-circle me-2"></i>
            {t('security.error.loadUserInfoFailed')}
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <h5>{t('security.changePassword.title')}</h5>
        </CardHeader>
        <CardBody>
          <form
            className="app-form"
            onSubmit={e => {
              handlePasswordSubmit(e).catch(console.error);
            }}
          >
            <Row>
              {/* Current Password - 仅当用户已设置密码时显示 */}
              {hasPassword && (
                <Col sm="12">
                  <Label for="currentPassword" className="form-label">
                    {t('security.labels.currentPassword')}
                  </Label>
                  <InputGroup className="mb-3">
                    <InputGroupText>
                      <i className="ph-bold ph-lock"></i>
                    </InputGroupText>
                    <Input
                      type={passwordVisible.currentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      className="form-control"
                      placeholder={t('security.changePassword.currentPasswordPlaceholder')}
                      value={passwordForm.currentPassword}
                      onChange={e => handlePasswordInputChange('currentPassword', e.target.value)}
                      invalid={!!passwordErrors.currentPassword}
                    />
                    <InputGroupText
                      onClick={() => togglePasswordVisibility('currentPassword')}
                      style={{ cursor: 'pointer' }}
                    >
                      <i
                        className={`ph ${passwordVisible.currentPassword ? 'ph-eye' : 'ph-eye-slash'} ${passwordVisible.currentPassword ? 'text-primary' : ''}`}
                      ></i>
                    </InputGroupText>
                  </InputGroup>
                  {passwordErrors.currentPassword && (
                    <div className="text-danger small mb-3">{passwordErrors.currentPassword}</div>
                  )}
                </Col>
              )}

              {/* New Password */}
              <Col sm="12">
                <Label for="newPassword" className="form-label">
                  {t('security.labels.newPassword')}
                </Label>
                <InputGroup className="mb-3">
                  <InputGroupText>
                    <i className="ph-bold ph-lock"></i>
                  </InputGroupText>
                  <Input
                    type={passwordVisible.newPassword ? 'text' : 'password'}
                    id="newPassword"
                    className="form-control"
                    placeholder={t('security.changePassword.newPasswordPlaceholder')}
                    value={passwordForm.newPassword}
                    onChange={e => handlePasswordInputChange('newPassword', e.target.value)}
                    invalid={!!passwordErrors.newPassword}
                  />
                  <InputGroupText
                    onClick={() => togglePasswordVisibility('newPassword')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i
                      className={`ph ${passwordVisible.newPassword ? 'ph-eye' : 'ph-eye-slash'} ${passwordVisible.newPassword ? 'text-primary' : ''}`}
                    ></i>
                  </InputGroupText>
                </InputGroup>
                {passwordErrors.newPassword && (
                  <div className="text-danger small mb-3">{passwordErrors.newPassword}</div>
                )}
              </Col>

              {/* Confirm Password */}
              <Col sm="12">
                <Label for="confirmPassword" className="form-label">
                  {t('security.labels.confirmPassword')}
                </Label>
                <InputGroup className="mb-3">
                  <InputGroupText>
                    <i className="ph-bold ph-lock"></i>
                  </InputGroupText>
                  <Input
                    type={passwordVisible.confirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className="form-control"
                    placeholder={t('security.changePassword.confirmPasswordPlaceholder')}
                    value={passwordForm.confirmPassword}
                    onChange={e => handlePasswordInputChange('confirmPassword', e.target.value)}
                    invalid={!!passwordErrors.confirmPassword}
                  />
                  <InputGroupText
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    style={{ cursor: 'pointer' }}
                  >
                    <i
                      className={`ph ${passwordVisible.confirmPassword ? 'ph-eye' : 'ph-eye-slash'} ${passwordVisible.confirmPassword ? 'text-primary' : ''}`}
                    ></i>
                  </InputGroupText>
                </InputGroup>
                {passwordErrors.confirmPassword && (
                  <div className="text-danger small mb-3">{passwordErrors.confirmPassword}</div>
                )}
              </Col>

              {/* Submit Button */}
              <Col sm="12" className="text-end">
                <Button type="submit" color="primary" disabled={isGlobalLoading}>
                  {isSubmittingPassword ? (
                    <>
                      <i className="spinner-border spinner-border-sm me-2"></i>
                      {t('security.buttons.saving')}
                    </>
                  ) : (
                    <>
                      <i className="ph-bold ph-floppy-disk me-2"></i>
                      {t('security.buttons.save')}
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </form>
        </CardBody>
      </Card>

      {/* 重置订阅信息卡片 */}
      <Card className="security-card-content mt-4">
        <CardHeader>
          <h5 className="mb-2">{t('security.resetSubscription.title')}</h5>
          <p className="text-muted mb-0 small">{t('security.resetSubscription.description')}</p>
        </CardHeader>
        <CardBody>
          <div className="app-form">
            <Row>
              <Col sm="12" className="text-end">
                <Button
                  color="primary"
                  outline
                  className="btn btn-md"
                  onClick={() => setResetSubscriptionModal(true)}
                  disabled={isGlobalLoading}
                >
                  <i className="ph-bold ph-arrow-clockwise me-2"></i>
                  {t('security.resetSubscription.button')}
                </Button>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>

      {/* 更换邮箱卡片 */}
      <Card className="security-card-content mt-4">
        <CardHeader>
          <h5 className="mb-2">{t('security.changeEmail.title')}</h5>
          <p className="text-muted mb-0 small">{t('security.changeEmail.description')}</p>
        </CardHeader>
        <CardBody>
          <div className="app-form">
            <Row>
              <Col sm="12" className="text-end">
                <Button
                  color="primary"
                  outline
                  className="btn btn-md"
                  onClick={handleChangeEmail}
                  disabled={isGlobalLoading}
                >
                  <i className="ph-bold ph-at me-2"></i>
                  {t('security.changeEmail.changeEmail')}
                </Button>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>

      {/* 注销账号卡片 */}
      <Card className="security-card-content mt-4">
        <CardHeader>
          <h5 className="mb-2">{t('security.deleteAccount.title')}</h5>
          <p className="text-muted mb-0 small">{t('security.deleteAccount.description')}</p>
        </CardHeader>
        <CardBody>
          <div className="app-form">
            <Row>
              <Col sm="12" className="text-end">
                <Button
                  color="danger"
                  outline
                  className="btn btn-md"
                  onClick={() => setDeleteModal(true)}
                  disabled={isGlobalLoading}
                >
                  <i className="ph-bold ph-trash me-2"></i>
                  {t('security.deleteAccount.button')}
                </Button>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>

      {/* 更换邮箱确认模态框 */}
      <ChangeEmailConfirmModal
        isOpen={changeEmailModal}
        onToggle={resetChangeEmailForm}
        onConfirm={handleConfirmChangeEmail}
      />

      {/* 重置订阅确认模态框 */}
      <ResetSubscriptionConfirmModal
        isOpen={resetSubscriptionModal}
        onToggle={resetSubscriptionForm}
        onConfirm={() => {
          void handleResetSubscription();
        }}
        isLoading={isResettingSubscription}
      />

      {/* 注销确认模态框 */}
      <DeleteAccountConfirmModal
        isOpen={deleteModal}
        onToggle={resetDeleteForm}
        onConfirm={() => {
          void handleDeleteAccount();
        }}
        currentUserEmail={userInfo?.email ?? ''}
        isLoading={isDeletingAccount}
      />
    </>
  );
};

export default SecurityCard;
