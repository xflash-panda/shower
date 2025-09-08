import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import toast from '@helpers/toast';

interface TicketCloseConfirmModalProps {
  /** 是否显示模态框 */
  isOpen: boolean;
  /** 要关闭的工单信息 */
  ticket: API_V1.User.TicketItem;
  /** 关闭模态框的回调函数 */
  onClose: () => void;
  /** 工单关闭成功后的回调函数 */
  onSuccess?: () => void;
  /** 执行关闭工单操作的函数，参数参考 ticketClose 接口 */
  onCloseTicket: (params: API_V1.User.TicketCloseParams) => Promise<void>;
}

const TicketCloseConfirmModal = ({
  isOpen,
  ticket,
  onClose,
  onSuccess,
  onCloseTicket,
}: TicketCloseConfirmModalProps): JSX.Element => {
  const { t } = useTranslation('ticket');
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleConfirmClose = async (): Promise<void> => {
    if (!ticket?.random_id) {
      toast.error(t('error.infoMissing'));
      return;
    }

    setIsClosing(true);

    try {
      await onCloseTicket({ random_id: ticket.random_id });

      toast.success(t('success.closed'));
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to close ticket:', error);
      toast.error(t('error.closeFailed'));
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} backdrop="static" keyboard={false} centered>
      <ModalHeader toggle={onClose}>{t('closeModal.title')}</ModalHeader>
      <ModalBody>
        <div className="text-center">
          <i className="ti ti-lock text-danger f-s-48 mb-3"></i>
          <h5>{t('closeModal.confirmMessage')}</h5>
          <p className="text-muted">{t('closeModal.description')}</p>
          {ticket && (
            <div className="mg-t-15">
              <p className="text-muted small">
                {t('closeModal.ticketSubject')} <span className="fw-medium">{ticket.subject}</span>
              </p>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={onClose} disabled={isClosing}>
          <i className="ti ti-x me-2"></i>
          {t('closeModal.cancel')}
        </Button>
        <Button
          color="danger"
          onClick={() => {
            handleConfirmClose().catch(error => {
              console.error('Unexpected error in ticket closing:', error);
            });
          }}
          disabled={isClosing}
        >
          {isClosing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              {t('closeModal.closing')}
            </>
          ) : (
            <>
              <i className="ti ti-lock me-2"></i>
              {t('closeModal.confirm')}
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TicketCloseConfirmModal;
