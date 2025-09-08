import { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import toast from '@helpers/toast';

interface OrderCloseConfirmModalProps {
  /** 是否显示模态框 */
  isOpen: boolean;
  /** 要关闭的订单信息 */
  order: API_V1.User.OrderItem;
  /** 执行关闭订单操作的函数，参数参考 ticketClose 接口 */
  onCloseOrder: (params: { trade_no: string }) => Promise<void>;
  /** 切换模态框显示状态 */
  onToggle: () => void;
}

const OrderCloseConfirmModal = ({
  isOpen,
  order,
  onCloseOrder,
  onToggle,
}: OrderCloseConfirmModalProps): JSX.Element => {
  const { t } = useTranslation('order');
  const [isClosing, setIsClosing] = useState<boolean>(false);

  const handleConfirmClose = async (): Promise<void> => {
    if (!order?.trade_no) {
      toast.error(t('error.infoMissing'));
      return;
    }

    setIsClosing(true);

    try {
      await onCloseOrder({ trade_no: order.trade_no });

      toast.success(t('success.closed'));
      onToggle();
    } catch (error) {
      console.error('Failed to close order:', error);
      toast.error(t('error.closeFailed'));
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onToggle} backdrop="static" keyboard={false} centered>
      <ModalHeader toggle={onToggle}>{t('modal.closeOrder.title')}</ModalHeader>
      <ModalBody>
        <div className="text-center">
          <i className="ph-duotone ph-x-circle text-danger f-s-48 mb-3"></i>
          <h5>{t('modal.closeOrder.confirmMessage')}</h5>
          <p className="text-muted">{t('modal.closeOrder.warningMessage')}</p>
          {order && (
            <div className="mg-t-15">
              <p className="text-muted small">
                {t('modal.closeOrder.orderNumber')}:{' '}
                <span className="font-monospace">{order.trade_no}</span>
              </p>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline onClick={onToggle} disabled={isClosing}>
          {t('modal.closeOrder.cancel')}
        </Button>
        <Button
          color="danger"
          onClick={() => {
            handleConfirmClose().catch(error => {
              console.error('Unexpected error in order closing:', error);
            });
          }}
          disabled={isClosing}
        >
          {isClosing ? t('modal.closeOrder.closing') : t('modal.closeOrder.confirm')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default OrderCloseConfirmModal;
