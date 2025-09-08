import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, Input } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface DeleteAccountConfirmModalProps {
  isOpen: boolean;
  onToggle: () => void;
  onConfirm: () => void;
  currentUserEmail: string;
  isLoading?: boolean;
}

const DeleteAccountConfirmModal: React.FC<DeleteAccountConfirmModalProps> = ({
  isOpen,
  onToggle,
  onConfirm,
  currentUserEmail,
  isLoading = false,
}) => {
  const { t } = useTranslation('profile');
  const [deleteEmail, setDeleteEmail] = useState<string>('');
  const [showEmailError, setShowEmailError] = useState<boolean>(false);

  // 处理注销账号
  const handleDeleteAccount = (): void => {
    // 点击确认注销按钮时才验证邮箱
    if (deleteEmail !== currentUserEmail) {
      setShowEmailError(true); // 显示错误提示
      return;
    }

    // 邮箱正确，执行注销逻辑
    onConfirm();
    resetForm();
  };

  // 重置表单
  const resetForm = (): void => {
    setDeleteEmail('');
    setShowEmailError(false);
  };

  // 处理模态框关闭
  const handleToggle = (): void => {
    if (isLoading) return; // 加载中时禁止关闭
    resetForm();
    onToggle();
  };

  // 当用户输入邮箱时，隐藏错误提示
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDeleteEmail(e.target.value);
    if (showEmailError) {
      setShowEmailError(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={handleToggle} centered container=".app-wrapper">
      <ModalHeader toggle={handleToggle}>{t('security.deleteAccount.modal.title')}</ModalHeader>
      <ModalBody>
        <form className="app-form px-2 py-1">
          <div className="mb-3">
            <div className="alert alert-border-danger d-flex align-items-start p-4">
              <div className="flex-shrink-0 me-3">
                <i className="ph-bold ph-shield-warning text-danger"></i>
              </div>
              <div className="flex-grow-1">
                <h6 className="text-danger fw-bold mb-2">
                  {t('security.deleteAccount.modal.warning.title')}
                </h6>
                <p
                  className="mb-0 lh-base"
                  dangerouslySetInnerHTML={{
                    __html: t('security.deleteAccount.modal.warning.description'),
                  }}
                ></p>
              </div>
            </div>
          </div>
          <div className="mb-4 mb-3">
            <Label for="deleteEmail" className="form-label fw-semibold">
              {t('security.deleteAccount.modal.emailLabel')}
              <span className="text-danger ms-1">*</span>
            </Label>
            <Input
              type="email"
              id="deleteEmail"
              value={deleteEmail}
              onChange={handleEmailChange}
              placeholder={t('security.deleteAccount.modal.emailPlaceholder')}
              className="form-control-lg shadow-sm rounded-3 form-control"
              invalid={showEmailError}
              disabled={isLoading}
            />
            {showEmailError && (
              <div className="text-danger small mt-1">
                <i className="ph-bold ph-x-circle me-1"></i>
                {t('security.deleteAccount.modal.emailError', { email: currentUserEmail })}
              </div>
            )}
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={handleToggle} disabled={isLoading}>
          {t('security.deleteAccount.modal.cancel')}
        </Button>
        <Button color="danger" onClick={handleDeleteAccount} disabled={isLoading}>
          {isLoading ? (
            <>
              <i className="spinner-border spinner-border-sm me-2"></i>
              {t('security.deleteAccount.modal.deleting')}
            </>
          ) : (
            <>
              <i className="ph-bold ph-trash me-2"></i>
              {t('security.deleteAccount.modal.confirm')}
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteAccountConfirmModal;
