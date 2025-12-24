import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface PlanSelectorProps {
  plans: API_V1.User.PlanItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const PlanSelector = ({ plans, activeTab, onTabChange }: PlanSelectorProps) => {
  const { t } = useTranslation('plan');

  return (
    <Row className="g-3 g-md-4 mg-b-0">
      {plans.map(plan => (
        <Col key={plan.id} xs={6} sm={6} lg={3} xl={3}>
          <div
            className={`plan-card-modern h-100 position-relative ${
              activeTab === plan.id.toString() ? 'plan-card-selected' : 'plan-card-default'
            } ${plan.is_sold_out ? 'plan-card-disabled' : 'cursor-pointer'}`}
            onClick={() => !plan.is_sold_out && onTabChange(plan.id.toString())}
          >
            {/* 售罄状态标识 */}
            {plan.is_sold_out && (
              <div className="plan-status-badge badge-danger">
                <i className="ph ph-x-circle me-1"></i>
                {t('selector.soldOut')}
              </div>
            )}

            {/* 即将售罄状态标识 */}
            {plan.is_nearing_sold_out && !plan.is_sold_out && (
              <div className="plan-status-badge badge-warning">
                <i className="ph ph-clock me-1"></i>
                {t('selector.nearingSoldOut')}
              </div>
            )}

            {/* 背景装饰元素 */}
            <div className="plan-card-decoration"></div>

            {/* 选中状态指示器 */}
            <div
              className={`plan-selection-indicator ${
                activeTab === plan.id.toString() ? 'active' : ''
              }`}
            >
              <div className="selection-ring">
                <div className="selection-dot">
                  <i className="ph ph-check"></i>
                </div>
              </div>
            </div>

            <div className="plan-card-content">
              {/* 上半部分 */}
              <div className="plan-card-top">
                {/* 套餐图标 */}
                <div className="plan-icon-wrapper mg-b-16">
                  <div
                    className={`plan-icon ${activeTab === plan.id.toString() ? 'active' : ''} ${
                      plan.is_sold_out ? 'disabled' : ''
                    }`}
                  >
                    <i className="ph-duotone ph-crown"></i>
                  </div>
                </div>

                {/* 套餐名称 */}
                <h6 className={`plan-title mg-b-12 ${plan.is_sold_out ? 'text-muted' : ''}`}>
                  {plan.name}
                </h6>
              </div>

              {/* 下半部分 */}
              <div className="plan-card-bottom">
                {/* 流量信息 */}
                <div className="plan-traffic-info mg-b-16">
                  <div className="traffic-amount">
                    <span className={`traffic-number ${plan.is_sold_out ? 'text-muted' : ''}`}>
                      {plan.quota_gb}
                    </span>
                    <span className={`traffic-unit ${plan.is_sold_out ? 'text-muted' : ''}`}>
                      GB
                    </span>
                  </div>
                  <div className={`traffic-label ${plan.is_sold_out ? 'text-muted' : ''}`}>
                    <i className="ph ph-database me-1"></i>
                    {t('selector.trafficQuota')}
                  </div>
                </div>

                {/* 底部装饰线 */}
                <div className="plan-card-bottom-line"></div>
              </div>
            </div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default PlanSelector;
