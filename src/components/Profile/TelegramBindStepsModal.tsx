import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import toast from '@helpers/toast';
import { copyText } from '@helpers/clipboard';

interface TelegramBindStepsModalProps {
  isOpen: boolean;
  toggle: () => void;
  subscribeUrl: string;
  botUsername?: string;
  onUserInfoMutate?: () => Promise<void>;
}

const TelegramBindStepsModal: React.FC<TelegramBindStepsModalProps> = ({
  isOpen,
  toggle,
  subscribeUrl,
  botUsername = 'your_bot_name',
  onUserInfoMutate,
}) => {
  const { t } = useTranslation('profile');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isBinding, setIsBinding] = useState<boolean>(false);

  // 监听模态框开关状态，每次打开重置到第一步，关闭时清空状态
  useEffect(() => {
    if (isOpen) {
      // 模态框打开时，重置到第一步
      setCurrentStep(1);
      setIsBinding(false);
    } else {
      // 模态框关闭时，清空所有状态
      setCurrentStep(1);
      setIsBinding(false);
    }
  }, [isOpen]);

  const handleStartBind = async (): Promise<void> => {
    if (!onUserInfoMutate) return;

    setIsBinding(true);
    try {
      // 直接更新用户信息以检查绑定状态
      await onUserInfoMutate();
      toggle(); // 关闭模态框
    } catch (error) {
      console.error('Failed to update user info:', error);
    } finally {
      setIsBinding(false);
    }
  };

  const handleOpenBot = (): void => {
    window.open(`https://t.me/${botUsername}`, '_blank');
  };

  const handleCopyBotUsername = (): void => {
    const success = copyText(`@${botUsername}`);
    if (success) {
      toast.success(t('telegram.success.usernameCopierd'));
    } else {
      toast.error(t('telegram.error.copyUsernameFailed'));
    }
  };

  const handleCopyBindCommand = (): void => {
    const bindCommand = `/bind ${subscribeUrl}`;
    const success = copyText(bindCommand);
    if (success) {
      toast.success(t('telegram.success.commandCopied'));
    } else {
      toast.error(t('telegram.error.copyCommandFailed'));
    }
  };

  const handleNextStep = (): void => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number): void => {
    setCurrentStep(step);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg" centered container=".app-wrapper">
      <ModalHeader toggle={toggle}>
        <i className="ph-telegram-logo text-primary me-2"></i>
        {t('telegram.bindModal.title')}
      </ModalHeader>
      <ModalBody>
        <div className="form-wizard">
          <div className="form-wizard-header">
            <ul className="form-wizard-steps">
              <li className={currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}>
                <span className="wizard-steps cursor-pointer" onClick={() => handleStepClick(1)}>
                  1
                </span>
              </li>
              <li className={currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}>
                <span className="wizard-steps cursor-pointer" onClick={() => handleStepClick(2)}>
                  2
                </span>
              </li>
              <li className={currentStep === 3 ? 'active' : ''}>
                <span className="wizard-steps cursor-pointer" onClick={() => handleStepClick(3)}>
                  3
                </span>
              </li>
            </ul>
          </div>

          <div className="form-wizard-body mt-4">
            {currentStep === 1 && (
              <div className="step-content-wrapper">
                <div className="text-center mb-4">
                  <div className="step-icon-large mb-3">
                    <i className="ph-device-mobile text-primary f-s-48"></i>
                  </div>
                  <h5 className="mb-3">{t('telegram.bindModal.steps.step1.title')}</h5>
                  <p className="text-muted">{t('telegram.bindModal.steps.step1.description')}</p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content-wrapper">
                <div className="text-center mb-4">
                  <div className="step-icon-large mb-3">
                    <i className="ph-magnifying-glass text-primary f-s-48"></i>
                  </div>
                  <h5 className="mb-3">{t('telegram.bindModal.steps.step2.title')}</h5>
                  <p className="text-muted mb-4">
                    {t('telegram.bindModal.steps.step2.description')}
                    <button
                      type="button"
                      onClick={handleOpenBot}
                      className="btn btn-link p-0 mx-1 text-primary fw-semibold text-decoration-underline align-baseline"
                    >
                      <i className="ph-telegram-logo me-1"></i>
                      {t('telegram.bindModal.steps.step2.openDirectly')}
                    </button>
                    {t('telegram.bindModal.steps.step2.chatDescription')}
                  </p>

                  <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center bg-dark rounded-3 px-4 py-3">
                      <i className="ph-duotone ph-robot text-light me-2 f-s-20"></i>
                      <code className="text-light fw-semibold me-4 f-s-16">@{botUsername}</code>
                      <button
                        type="button"
                        onClick={handleCopyBotUsername}
                        className="btn btn-outline-light btn-sm px-2 py-1 d-inline-flex align-items-center justify-content-center"
                        title={t('telegram.bindModal.steps.step2.copyUsernameTooltip')}
                        style={{
                          minWidth: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <i className="ph-duotone ph-copy f-s-16"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content-wrapper">
                <div className="text-center mb-4">
                  <div className="step-icon-large mb-3">
                    <i className="ph-paper-plane-tilt text-primary f-s-48"></i>
                  </div>
                  <h5 className="mb-3">{t('telegram.bindModal.steps.step3.title')}</h5>
                  <p className="text-muted mb-4">
                    {t('telegram.bindModal.steps.step3.description')}
                  </p>

                  <p className="mb-4">
                    <span className="d-inline-flex align-items-center mx-2 px-3 py-2 bg-dark rounded-3">
                      <code className="text-light fw-semibold me-2">/bind {subscribeUrl}</code>
                      <button
                        type="button"
                        onClick={handleCopyBindCommand}
                        className="btn btn-outline-light btn-sm px-2 py-1 d-inline-flex align-items-center justify-content-center"
                        title={t('telegram.bindModal.steps.step3.copyCommandTooltip')}
                        style={{
                          minWidth: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <i className="ph-duotone ph-copy f-s-16"></i>
                      </button>
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="d-flex justify-content-between">
        <div>
          {currentStep > 1 && (
            <Button color="secondary" outline onClick={handlePrevStep}>
              <i className="ph-arrow-left me-1"></i>
              {t('telegram.bindModal.navigation.previousStep')}
            </Button>
          )}
        </div>

        <div>
          {currentStep < 3 ? (
            <Button color="primary" outline onClick={handleNextStep}>
              {t('telegram.bindModal.navigation.nextStep')}
              <i className="ph-arrow-right ms-1"></i>
            </Button>
          ) : (
            <Button color="primary" onClick={() => void handleStartBind()} disabled={isBinding}>
              {isBinding ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">
                      {t('telegram.bindModal.navigation.loading')}
                    </span>
                  </div>
                  {t('telegram.bindModal.navigation.updating')}
                </>
              ) : (
                <>
                  <i className="ph-telegram-logo me-1"></i>
                  {t('telegram.bindModal.navigation.completeBinding')}
                </>
              )}
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default TelegramBindStepsModal;
