import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface ResetSubscriptionConfirmModalProps {
  isOpen: boolean;
  onToggle: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ResetSubscriptionConfirmModal: React.FC<ResetSubscriptionConfirmModalProps> = ({
  isOpen,
  onToggle,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useTranslation('profile');

  return (
    <Modal isOpen={isOpen} toggle={onToggle} centered container=".app-wrapper">
      <ModalHeader toggle={onToggle}>{t('modals.resetSubscriptionConfirm.title')}</ModalHeader>
      <ModalBody>
        <form className="app-form px-2 py-1">
          <div className="mb-3">
            <div className="alert alert-light-warning d-flex align-items-center">
              <i className="ph-bold ph-info me-2"></i>
              <span>{t('modals.resetSubscriptionConfirm.warning')}</span>
            </div>
          </div>
          <div className="mb-4 mb-3">
            <div className="text-center">
              <i className="ph-bold ph-arrow-clockwise text-warning f-s-48 mb-3"></i>
              <h6 className="text-warning fw-semibold">
                {t('modals.resetSubscriptionConfirm.confirmTitle')}
              </h6>
              <p className="text-muted small">
                {t('modals.resetSubscriptionConfirm.confirmDescription')}
              </p>
            </div>
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={onToggle} disabled={isLoading}>
          {t('modals.resetSubscriptionConfirm.cancel')}
        </Button>
        <Button color="warning" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <i className="spinner-border spinner-border-sm me-2"></i>
              {t('modals.resetSubscriptionConfirm.resetting')}
            </>
          ) : (
            <>
              <i className="ph-bold ph-arrow-clockwise me-2"></i>
              {t('modals.resetSubscriptionConfirm.confirm')}
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ResetSubscriptionConfirmModal;
