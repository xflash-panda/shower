import React from 'react';
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/helpers/currency';

interface PaymentInfoProps {
  order: API_V1.User.OrderItem;
  selectedPayment: string;
  isUpdatingPayment: boolean;
  isProcessing: boolean;
  handlePayment: () => void | Promise<void>;
  showFinalAmount?: boolean;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({
  order,
  selectedPayment,
  isUpdatingPayment,
  isProcessing,
  handlePayment,
  showFinalAmount = true,
}) => {
  const { t } = useTranslation('order');
  // 直接使用服务器返回的订单数据，无需前端重复计算
  const hasHandlingFee = (order?.handling_amount ?? 0) > 0;
  const finalAmount = order?.total_amount ?? 0;

  // 区分余额支付（移除免费订单特殊处理）
  const balanceAmount = order?.balance_amount ?? 0;
  const isBalancePayment = finalAmount === 0 && balanceAmount > 0;

  // 包装异步函数以避免 TypeScript 错误
  const handlePaymentClick = () => {
    void handlePayment();
  };

  return (
    <>
      {/* 现代化订单汇总 - 只有这部分有遮罩层 */}
      <div className="position-relative">
        {/* 更新中的遮罩层 - 只覆盖金额计算部分 */}
        {isUpdatingPayment && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center rounded-3"
            style={{ zIndex: 10 }}
          >
            <div className="text-center">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">{t('payment.updating')}</span>
              </div>
              <div className="small text-muted fw-medium">{t('payment.recalculating')}</div>
            </div>
          </div>
        )}

        {/* 订单汇总内容 */}
        <div className="rounded-3 overflow-hidden">
          <div className="p-0">
            {/* 订单金额 */}
            <div
              className={`d-flex justify-content-between align-items-center p-3 ${
                hasHandlingFee ? 'border-bottom border-light' : ''
              }`}
            >
              <span className="text-muted fw-medium">{t('payment.orderAmount')}</span>
              <span className="fw-bold text-dark">
                {order && formatCurrency(order.total_amount)}
              </span>
            </div>

            {/* 处理费 */}
            {hasHandlingFee && (
              <div className="d-flex justify-content-between align-items-center p-3 bg-warning-subtle border-bottom border-light">
                <span className="text-warning-emphasis fw-medium d-flex align-items-center">
                  <i className="ti ti-credit-card me-2"></i>
                  {t('payment.handlingFee')}
                </span>
                <span className="text-warning-emphasis fw-bold">
                  +{formatCurrency(order?.handling_amount ?? 0)}
                </span>
              </div>
            )}

            {/* 实付金额 - 仅在需要时显示 */}
            {showFinalAmount && finalAmount > 0 && (
              <div className="bg-gradient-primary text-dark p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold d-flex align-items-center">
                    {t('payment.finalAmount')}
                  </span>
                  <div className="text-end">
                    <div className="fw-bold h4 mb-0">{formatCurrency(finalAmount)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 支付按钮 - 完全移出遮罩容器 */}
      <div className="d-grid mt-4">
        <Button
          color="primary"
          size="lg"
          className="fw-bold py-3 rounded-3"
          onClick={handlePaymentClick}
          disabled={isProcessing || isUpdatingPayment || (finalAmount > 0 && !selectedPayment)}
        >
          {isProcessing ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">{t('payment.processing')}</span>
              </span>
              {t('payment.processing')}
            </>
          ) : finalAmount > 0 ? (
            <>
              <i className="ti ti-credit-card me-2"></i>
              {t('payment.payNow', { amount: formatCurrency(finalAmount) })}
            </>
          ) : isBalancePayment ? (
            <>
              <i className="ti ti-wallet me-2"></i>
              {t('payment.confirmBalancePayment')}
            </>
          ) : (
            <>
              <i className="ti ti-check me-2"></i>
              {t('payment.confirmOrder')}
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default PaymentInfo;
