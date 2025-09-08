import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface ChangeEmailConfirmModalProps {
  isOpen: boolean;
  onToggle: () => void;
  onConfirm: () => void;
}

const ChangeEmailConfirmModal: React.FC<ChangeEmailConfirmModalProps> = ({
  isOpen,
  onToggle,
  onConfirm,
}) => {
  const { t } = useTranslation('profile');

  return (
    <Modal isOpen={isOpen} toggle={onToggle} centered container=".app-wrapper">
      <ModalHeader toggle={onToggle}>{t('modals.changeEmailConfirm.title')}</ModalHeader>
      <ModalBody>
        <form className="app-form px-2 py-1">
          <div className="mb-4 mb-3">
            <div className="text-center">
              <i className="ph-bold ph-at text-danger f-s-48 mb-3"></i>
              <h6 className="text-danger fw-semibold">
                {t('modals.changeEmailConfirm.warning.title')}
              </h6>
              <p className="text-muted small">
                {t('modals.changeEmailConfirm.warning.description')}
              </p>
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={onToggle}>
          {t('modals.changeEmailConfirm.cancel')}
        </Button>
        <Button color="danger" onClick={onConfirm}>
          <i className="ph-bold ph-at me-2"></i>
          {t('modals.changeEmailConfirm.confirm')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ChangeEmailConfirmModal;
