import { Row, Col, Badge } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/helpers/currency';

interface SubscriptionInfoProps {
  order: API_V1.User.OrderItem;
}

const SubscriptionInfo = ({ order }: SubscriptionInfoProps) => {
  const { t } = useTranslation('order');

  return (
    <>
      {order.type === 6 ? (
        // 充值订单显示
        <Row className="g-4">
          <Col md={4}>
            <div className="rounded-3 p-4 h-100 border-start border-5 border-primary">
              <div className="d-flex align-items-center mb-2">
                <i className="ti ti-coin text-primary me-2"></i>
                <h6 className="text-muted mb-0 fw-semibold">{t('subscription.rechargeType')}</h6>
              </div>
              <p className="fw-bold mb-0 text-dark h5">{t('subscription.balanceRecharge')}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="rounded-3 p-4 h-100 border-start border-5 border-info">
              <div className="d-flex align-items-center mb-2">
                <i className="ti ti-currency-yuan text-success me-2"></i>
                <h6 className="text-muted mb-0 fw-semibold">{t('subscription.rechargeAmount')}</h6>
              </div>
              <p className="fw-bold mb-0 text-dark h5">{formatCurrency(order.total_amount)}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="rounded-3 p-4 h-100 border-start border-5 border-success">
              <div className="d-flex align-items-center mb-2">
                <i className="ti ti-check-circle text-info me-2"></i>
                <h6 className="text-muted mb-0 fw-semibold">{t('subscription.creditedAmount')}</h6>
              </div>
              <p className="fw-bold mb-0 text-dark h5">{formatCurrency(order.total_amount)}</p>
            </div>
          </Col>
        </Row>
      ) : (
        // 套餐订单显示（原有的订阅信息）
        <Row className="g-4">
          <Col md={4}>
            <div className="rounded-3 p-4 h-100 border-start border-5 border-primary">
              <div className="d-flex align-items-center mb-2">
                <i className="ti ti-crown text-primary me-2"></i>
                <h6 className="text-muted mb-0 fw-semibold">{t('subscription.plan')}</h6>
              </div>
              <p className="fw-bold mb-0 text-dark h5">{order.plan?.name ?? ''}</p>
            </div>
          </Col>
          <Col md={4}>
            <div className="rounded-3 p-4 h-100 border-start border-5 border-info">
              <div className="d-flex align-items-center mb-2">
                <i className="ti ti-calendar text-info me-2"></i>
                <h6 className="text-muted mb-0 fw-semibold">{t('subscription.cycle')}</h6>
              </div>
              <p className="fw-bold mb-2 text-dark h5">{order.price_name ?? '-'}</p>
              {order.price_meta?.off_tip && (
                <Badge className="bg-gradient-warning text-white fw-medium rounded-pill">
                  {order.price_meta.off_tip}
                </Badge>
              )}
            </div>
          </Col>
          <Col md={4}>
            <div className="rounded-3 p-4 h-100 border-start border-5 border-success">
              <div className="d-flex align-items-center mb-2">
                <i className="ti ti-database text-success me-2"></i>
                <h6 className="text-muted mb-0 fw-semibold">{t('subscription.dataQuota')}</h6>
              </div>
              <p className="fw-bold mb-0 text-dark h5">
                {order.plan?.quota_gb ? `${order.plan.quota_gb}GB` : t('subscription.unlimited')}
              </p>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default SubscriptionInfo;
