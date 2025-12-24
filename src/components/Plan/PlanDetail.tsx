import { Badge, Collapse } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import SubscriptionSpecification from '@components/Plan/SubscriptionSpecification';

interface PlanOverviewProps {
  selectedPlan: API_V1.User.PlanItem & { features: string[] };
  showPlanDetails: boolean;
}

const PlanOverview = ({ selectedPlan, showPlanDetails }: PlanOverviewProps) => {
  const { t } = useTranslation('plan');

  return (
    <div className="pa-0">
      {/* 当前选择的套餐概览 */}
      <div className="bg-white pa-16 pa-md-20 border-bottom position-relative overflow-hidden">
        <div className="d-flex align-items-center justify-content-between position-relative">
          <div className="d-flex align-items-center flex-shrink-0">
            <div className="d-flex align-items-center justify-content-center me-3 w-50 h-50 bg-primary bg-opacity-10 rounded-3">
              <i className="ph-duotone ph-crown text-white f-s-20"></i>
            </div>
            <div>
              <h6 className="text-primary fw-bold mg-b-2">{selectedPlan.name}</h6>
              <div className="text-muted f-fw-500 small">{t('overview.currentPlan')}</div>
            </div>
          </div>

          {/* 右侧Badge布局 */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <Badge color="success" className="fw-medium rounded-pill pa-6 pe-10 ps-10">
              <i className="ph-duotone ph-database me-1 f-s-12"></i>
              {selectedPlan.quota_gb}GB
            </Badge>
            <Badge color="dark" className="fw-medium rounded-pill pa-6 pe-10 ps-10">
              <i className="ph-duotone ph-sparkle me-1 f-s-12"></i>
              {selectedPlan.features?.length ?? 0} {t('overview.features')}
            </Badge>
          </div>
        </div>
      </div>

      {/* 详细信息展示 - 使用已有的订阅规格组件 */}
      <div className="bg-white">
        <Collapse isOpen={showPlanDetails}>
          <div className="pa-16 pa-md-24">
            <SubscriptionSpecification plan={selectedPlan} isVisible={showPlanDetails} />
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default PlanOverview;
