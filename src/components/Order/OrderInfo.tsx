import React from 'react';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatTime, TIME_FORMATS } from '@/helpers/time';
import { formatCurrency } from '@/helpers/currency';
import { copyText } from '@/helpers/clipboard';
import toast from '@/helpers/toast';

interface OrderInfoProps {
  order: API_V1.User.OrderItem;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  const { t } = useTranslation(['order', 'common']);


  // 订单状态映射
  const statusMap: Record<number, { text: string; color: string }> = {
    0: { text: t('detail.status.pending'), color: 'warning' },
    1: { text: t('detail.status.processing'), color: 'info' },
    2: { text: t('detail.status.cancelled'), color: 'secondary' },
    3: { text: t('detail.status.completed'), color: 'success' },
    4: { text: t('detail.status.credited'), color: 'dark' },
  };
  // 格式化时间
  const formatTimestamp = (timestamp: number | null): string => {
    if (!timestamp) return '-';
    return formatTime(timestamp, TIME_FORMATS.DATETIME);
  };

  // 复制订单号
  const copyOrderNumber = () => {
    if (!order?.trade_no) return;

    const success = copyText(order.trade_no.toString());
    if (success) {
      toast.success(t('order:toast.success.copied'));
    } else {
      toast.error(t('order:toast.error.copyFailed'));
    }
  };
  return (
    <>
      {/* 套餐信息展示 */}
      <Row>
        <Col lg={6}>
          <div className="pe-lg-3">
            <h6 className="text-primary mb-3 fw-bold border-bottom border-primary pb-2">
              <i className="ti ti-info-circle me-2"></i>
              {t('detail.labels.basicInfo')}
            </h6>
            <div className="space-y-3">
              {/* 订单状态作为第一个信息项 */}
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                <span className="text-muted fw-medium">{t('detail.labels.orderStatus')}</span>
                <span
                  className={`fw-bold px-3 py-1 rounded-pill small ${
                    order?.status === 0
                      ? 'bg-warning-subtle text-warning-emphasis'
                      : order?.status === 1
                        ? 'bg-info-subtle text-info-emphasis'
                        : order?.status === 2
                          ? 'bg-secondary-subtle text-secondary-emphasis'
                          : order?.status === 3
                            ? 'bg-success-subtle text-success-emphasis'
                            : order?.status === 4
                              ? 'bg-dark text-white'
                              : 'bg-secondary-subtle text-secondary'
                  }`}
                >
                  {order ? statusMap[order.status]?.text : t('detail.status.unknown')}
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                <span className="text-muted fw-medium d-flex align-items-center">
                  {t('detail.labels.orderNumber')}
                </span>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold font-monospace text-dark  px-2 py-1 rounded">
                    {order.trade_no}
                    <button
                      type="button"
                      className="btn btn-link btn-sm p-1 text-primary"
                      onClick={copyOrderNumber}
                      title={t('detail.actions.copyOrderNumber')}
                    >
                      <i className="ti ti-copy"></i>
                    </button>
                  </span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                <span className="text-muted fw-medium d-flex align-items-center">
                  {t('detail.labels.createTime')}
                </span>
                <span className="fw-medium text-dark font-monospace">
                  {formatTimestamp(order.created_at)}
                </span>
              </div>
              {order.paid_at && (
                <div className="d-flex justify-content-between align-items-center py-3">
                  <span className="text-muted fw-medium d-flex align-items-center">
                    {t('detail.labels.paymentTime')}
                  </span>
                  <span className="fw-medium text-dark font-monospace">
                    {formatTimestamp(order.paid_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div className="ps-lg-3">
            <h6 className="text-success mb-3 fw-bold border-bottom border-success pb-2">
              <i className="ti ti-currency-yuan me-2"></i>
              {t('detail.labels.amountDetails')}
            </h6>
            <div className="space-y-3">
              {/* 修改：套餐和周期显示（仅针对套餐订单） */}
              {order.type !== 6 && order.price_meta?.value != null && (
                <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                  <span className="text-muted fw-medium d-flex align-items-center">
                    {order.plan?.name} × {order.price_name}
                  </span>
                  <span className="fw-bold text-dark h6 mb-0">
                    {formatCurrency(order.price_meta.value)}
                  </span>
                </div>
              )}

              {/* 显示完整的金额明细 */}
              {(order.discount_amount ?? 0) > 0 && (
                <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                  <span className="text-muted fw-medium d-flex align-items-center">
                    {t('detail.labels.discountAmount')}
                  </span>
                  <span className="fw-bold text-success h6 mb-0">
                    -{formatCurrency(order.discount_amount ?? 0)}
                  </span>
                </div>
              )}

              {(order.balance_amount ?? 0) > 0 && (
                <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                  <span className="text-muted fw-medium">{t('detail.labels.balancePayment')}</span>
                  <span className="fw-bold text-success h6 mb-0">
                    -{formatCurrency(order.balance_amount ?? 0)}
                  </span>
                </div>
              )}

              {order.handling_amount > 0 && (
                <div className="d-flex justify-content-between align-items-center py-3 border-bottom border-light">
                  <span className="text-muted fw-medium">{t('detail.labels.handlingFee')}</span>
                  <span className="fw-bold text-warning h6 mb-0">
                    +{formatCurrency(order.handling_amount)}
                  </span>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center py-3">
                <span className="text-muted fw-medium">{t('detail.labels.orderAmount')}</span>
                <span className="fw-bold text-dark h6 mb-0">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {order.remarks && (
        <>
          <hr className="my-4" />
          <div>
            <h6 className="text-dark mb-3 fw-bold border-bottom border-secondary pb-2">
              <i className="ti ti-note me-2"></i>
              {t('detail.labels.orderRemarks')}
            </h6>
            <div className="py-2">
              <div className="rounded ">
                <p className="text-secondary fw-semibold">{order.remarks}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderInfo;
