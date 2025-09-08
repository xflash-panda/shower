import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface PaymentMethodsProps {
  paymentMethods: API_V1.User.PaymentNameItem[];
  selectedPayment: string;
  onPaymentSelect: (paymentId: string, paymentData: API_V1.User.PaymentNameItem | null) => void;
  isUpdatingPayment?: boolean;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  paymentMethods,
  selectedPayment,
  onPaymentSelect,
  isUpdatingPayment = false,
}) => {
  const { t } = useTranslation('order');
  const [isProcessing] = useState(false);

  // 使用传入的支付方式数据
  const availablePayments = paymentMethods;

  // 获取支付方式图标
  const getPaymentIcon = (iconType: number): string => {
    switch (iconType) {
      case 1:
        return 'pay-alipay';
      case 2:
        return 'pay-wechat';
      case 3:
        return 'pay-wallet';
      case 4:
        return 'pay-credit-card';
      case 5:
        return 'pay-stripe';
      default:
        return 'pay-credit-card';
    }
  };

  // 处理支付方式变更
  const handleInternalPaymentMethodChange = (paymentId: string) => {
    if (isUpdatingPayment || isProcessing) return;

    const paymentData = availablePayments.find(p => p.id.toString() === paymentId) ?? null;
    onPaymentSelect(paymentId, paymentData);
  };
  return (
    <>
      {/* 更新中的遮罩层 */}
      <div className="position-relative">
        {isUpdatingPayment && (
          <div
            className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center rounded-3"
            style={{ zIndex: 10 }}
          >
            <div className="text-center">
              <div className="spinner-border text-primary mb-2" role="status">
                <span className="visually-hidden">{t('payment.updating')}</span>
              </div>
              <div className="small text-muted fw-medium">{t('payment.updatingMethod')}</div>
            </div>
          </div>
        )}

        <div className="d-grid gap-2">
          {availablePayments.map(payment => (
            <div key={payment.id}>
              <input
                type="radio"
                className="d-none"
                name="payment"
                id={`payment-${payment.id}`}
                value={payment.id}
                checked={selectedPayment === payment.id.toString()}
                onChange={e => handleInternalPaymentMethodChange(e.target.value)}
                disabled={isUpdatingPayment || isProcessing}
              />
              <label
                className={`d-block rounded-3 p-3 border-2 bg-whiten d-flex align-items-center h-80 ${
                  selectedPayment === payment.id.toString()
                    ? 'selected border-primary box-shadow-18'
                    : 'border-light box-shadow-1'
                } ${isUpdatingPayment || isProcessing ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                htmlFor={`payment-${payment.id}`}
                style={{
                  cursor: isUpdatingPayment || isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div className="me-3">
                  <span className={`${getPaymentIcon(payment.icon_type)} d-inline-block`}></span>
                </div>
                <div className="flex-grow-1">
                  <div className={`fw-bold text-dark`}>{payment.name}</div>
                  {payment.handling_fee === true && payment.handling_fee_value > 0 && (
                    <div className="small mt-1 text-muted">
                      {payment.handling_fee_type === 1
                        ? t('payment.handlingFeeFixed', { amount: payment.handling_fee_value })
                        : t('payment.handlingFeePercentage', {
                            percentage: payment.handling_fee_value,
                          })}
                    </div>
                  )}
                </div>

                {/* 选中标志 */}
                {selectedPayment === payment.id.toString() && (
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center">
                    <i className="ti ti-check text-white fw-bold f-s-16"></i>
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PaymentMethods;
