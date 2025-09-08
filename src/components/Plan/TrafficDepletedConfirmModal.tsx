import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface TrafficDepletedConfirmModalProps {
  isOpen: boolean;
  toggle: () => void;
  onConfirm: () => void;
}

const TrafficDepletedConfirmModal: React.FC<TrafficDepletedConfirmModalProps> = ({
  isOpen,
  toggle,
  onConfirm,
}) => {
  const { t } = useTranslation('plan');
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <div className="d-flex align-items-center">
          <i className="ph ph-warning-circle text-warning me-2"></i>
          <span>{t('trafficDepleted.title')}</span>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="text-center pa-20">
          <div className="mg-b-20">
            <i className="ph ph-warning-circle text-warning" style={{ fontSize: '3rem' }}></i>
          </div>
          <h5 className="f-fw-600 mg-b-15">{t('trafficDepleted.message')}</h5>
          <p className="text-muted mg-b-0">{t('trafficDepleted.warning')}</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={toggle}>
          {t('trafficDepleted.actions.cancel')}
        </Button>
        <Button color="primary" onClick={onConfirm}>
          {t('trafficDepleted.actions.confirm')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TrafficDepletedConfirmModal;
