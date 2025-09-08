import { useNavigate } from 'react-router-dom';
import { Modal, ModalBody, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import { formatCurrency } from '@helpers/currency';
import { orderCancel } from '@/api/v1/user';
import { getErrorMessage } from '@/helpers/error';

interface UnpaidOrderModalProps {
  /** 是否显示Modal */
  isOpen: boolean;
  /** 关闭Modal的回调函数 */
  toggle: () => void;
  /** 未支付订单数据 */
  unpaidOrder: API_V1.User.OrderItem | null;
  /** 取消订单成功后的回调 */
  onOrderCancelled?: () => void;
  /** 取消订单失败时的错误回调 */
  onOrderCancelError?: (error: string) => void;
  /** 是否正在处理订单操作 */
  isLoading?: boolean;
}

const UnpaidOrderModal: React.FC<UnpaidOrderModalProps> = ({
  isOpen,
  toggle,
  unpaidOrder,
  onOrderCancelled,
  onOrderCancelError,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  // 处理前往订单详情页面支付
  const handleGoToPayment = () => {
    if (unpaidOrder?.trade_no) {
      navigate(`/order/${unpaidOrder.trade_no}`);
      toggle();
    }
  };

  // 处理取消订单
  const handleCancelOrder = async () => {
    if (!unpaidOrder?.trade_no) return;

    try {
      await orderCancel({ trade_no: unpaidOrder.trade_no });
      // 调用回调函数通知父组件订单已取消
      onOrderCancelled?.();
      toggle();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      const errorMessage = getErrorMessage(error, 'Failed to cancel order');
      // 将错误返回给调用方处理
      onOrderCancelError?.(errorMessage);
    }
  };

  // 如果没有未支付订单数据，不显示Modal
  if (!unpaidOrder) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      toggle={isLoading ? undefined : toggle}
      backdrop="static"
      keyboard={false}
      container=".app-wrapper"
      size="md"
      centered
    >
      <ModalBody className="text-center py-4 position-relative">
        <button
          type="button"
          className={`position-absolute top-0 end-0 mg-t-10 mg-e-10 border-0 bg-transparent pa-8 text-muted f-s-20 ${
            isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          }`}
          onClick={toggle}
          disabled={isLoading}
          aria-label="Close"
        >
          <i className="ti ti-x"></i>
        </button>
        <div className="mb-4">
          <i className="ti ti-alert-circle text-warning f-s-80"></i>
        </div>

        <h5 className="mb-3 text-dark">{t('unpaidOrder.title')}</h5>

        <p className="text-muted mb-4 px-3">
          {t('unpaidOrder.message', { amount: formatCurrency(unpaidOrder.total_amount) })}
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Button
            color="secondary"
            outline
            onClick={() => {
              handleCancelOrder().catch(console.error);
            }}
            disabled={isLoading}
            className="px-4"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {t('unpaidOrder.cancelling')}
              </>
            ) : (
              <>
                <i className="ti ti-x me-2"></i>
                {t('unpaidOrder.cancelOrder')}
              </>
            )}
          </Button>

          <Button color="primary" onClick={handleGoToPayment} disabled={isLoading} className="px-4">
            <i className="ti ti-credit-card me-2"></i>
            {t('unpaidOrder.goToPayment')}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default UnpaidOrderModal;
