import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface TelegramUnbindConfirmModalProps {
  isOpen: boolean;
  toggle: () => void;
  isUnbinding?: boolean;
  onConfirmUnbind: () => Promise<void>;
}

const TelegramUnbindConfirmModal: React.FC<TelegramUnbindConfirmModalProps> = ({
  isOpen,
  toggle,
  isUnbinding = false,
  onConfirmUnbind,
}) => {
  const { t } = useTranslation('profile');

  const handleConfirmUnbind = (): void => {
    void onConfirmUnbind();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered container=".app-wrapper">
      <ModalHeader toggle={toggle}>
        <i className="ph-link-break text-danger me-2"></i>
        {t('modals.telegramUnbindConfirm.title')}
      </ModalHeader>
      <ModalBody>
        <div className="text-center">
          <i className="ph-warning text-warning f-s-48 mb-3"></i>
          <h5>{t('modals.telegramUnbindConfirm.warning')}</h5>
          <p className="text-muted">{t('modals.telegramUnbindConfirm.description')}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggle}>
          {t('modals.telegramUnbindConfirm.cancel')}
        </Button>
        <Button color="danger" onClick={handleConfirmUnbind} disabled={isUnbinding}>
          {isUnbinding ? (
            <>
              <i className="ph-spinner ph-spin me-1"></i>
              {t('modals.telegramUnbindConfirm.unbinding')}
            </>
          ) : (
            <>
              <i className="ph-link-break me-1"></i>
              {t('modals.telegramUnbindConfirm.confirm')}
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TelegramUnbindConfirmModal;
