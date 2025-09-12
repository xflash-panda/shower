import { Row, Col, Card, CardHeader, CardBody } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import PlanBasicInfo from '@components/Plan/PlanBasicInfo';
import PlanFeatures from '@components/Plan/PlanFeatures';
import PlanNodeOverview from '@components/Plan/PlanNodeOverview';
import EmptyState from '@components/Common/EmptyState';
import Loading from '@components/Common/Loading';
import { usePlanNodeOverview, usePlan } from '@hooks/useUser';

interface SubscriptionSpecificationProps {
  plan: API_V1.User.PlanItem;
  isVisible: boolean;
}

const SubscriptionSpecification: React.FC<SubscriptionSpecificationProps> = ({
  plan,
  isVisible = false,
}) => {
  const { t } = useTranslation('plan');
  // 只有在组件可见时才获取节点概览数据
  const {
    nodeOverview,
    isLoading: nodeOverviewLoading,
    isError: nodeOverviewError,
  } = usePlanNodeOverview({ plan_id: plan.id }, isVisible);

  // 获取处理好的套餐特性
  const { planFeatures, isLoading: planLoading } = usePlan({ id: plan.id }, isVisible);

  // 类型守卫，确保 nodeOverview 是预期的数组类型
  const safeNodeOverview = Array.isArray(nodeOverview) ? nodeOverview : [];

  return (
    <div className="plan-detail-section">
      {/* 第一行：基础信息和套餐特性并列 */}
      <Row className="g-4 position-relative">
        {/* 基础信息卡片 */}
        <Col md={6}>
          <Card>
            <CardHeader>
              <h6 className="fw-bold text-dark d-flex align-items-center mg-b-0">
                <i className="ph-duotone ph-info text-primary me-2 f-s-18"></i>
                {t('specification.basicInfo')}
              </h6>
            </CardHeader>
            <CardBody className="pa-20">
              {nodeOverviewLoading ? (
                <Loading text={t('specification.loading')} variant="spinner" size="md" />
              ) : nodeOverviewError ? (
                <EmptyState
                  title={t('specification.noData')}
                  icon="iconoir-glass-empty"
                  variant="primary"
                  size="sm"
                />
              ) : (
                <PlanBasicInfo plan={plan} nodeOverviews={safeNodeOverview} />
              )}
            </CardBody>
          </Card>
        </Col>

        {/* 套餐特性卡片 */}
        <Col md={6} className="position-relative">
          {/* 竖直分割线 - 使用伪元素 */}
          <div
            className="d-none d-md-block position-absolute top-0 start-0 h-100"
            style={{ left: '-12px', width: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }}
          ></div>

          {/* 小屏幕分割线 - 放在卡片外面 */}
          <div className="d-md-none mb-3">
            <div
              className="w-100"
              style={{
                height: '1px',
                backgroundColor: 'var(--border_color)',
                opacity: 0.5,
              }}
            ></div>
          </div>

          <Card>
            <CardHeader>
              <h6 className="fw-bold text-dark d-flex align-items-center mg-b-0">
                <i className="ph-duotone ph-sparkle text-primary me-2 f-s-18"></i>
                {t('specification.planFeatures')}
              </h6>
            </CardHeader>
            <CardBody className="pa-20">
              {planLoading ? (
                <Loading text={t('specification.loading')} variant="spinner" size="md" />
              ) : (
                <PlanFeatures planFeatures={planFeatures || []} />
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* 分割线 */}
      <div className="app-divider-v"></div>

      {/* 第二行：节点概览 */}
      <Row>
        <Col md={12}>
          <Card>
            <CardHeader>
              <h6 className="fw-bold text-dark d-flex align-items-center mg-b-0">
                <i className="ph-duotone ph-map-pin text-primary me-2 f-s-18"></i>
                {t('specification.nodeOverview')}
              </h6>
            </CardHeader>
            <CardBody className="pa-20">
              {nodeOverviewLoading ? (
                <Loading text={t('specification.loading')} variant="spinner" size="md" />
              ) : nodeOverviewError ? (
                <EmptyState
                  title={t('specification.loadFailed')}
                  icon="iconoir-glass-empty"
                  size="sm"
                />
              ) : safeNodeOverview.length === 0 ? (
                <EmptyState
                  title={t('specification.noData')}
                  icon="iconoir-glass-empty"
                  size="sm"
                />
              ) : (
                <PlanNodeOverview nodeOverviews={safeNodeOverview} />
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SubscriptionSpecification;
