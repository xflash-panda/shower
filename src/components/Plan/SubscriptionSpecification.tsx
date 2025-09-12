import { Row, Col, Card, CardBody } from 'reactstrap';
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
      {/* 统一卡片：基础信息 + 套餐特性 + 节点概览 */}
      <Row className="mg-b-10">
        <Col md={12}>
          <Card>
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
                <>
                  {/* 基础信息部分 */}
                  <h6 className="fw-bold text-dark d-flex align-items-center mg-b-15">
                    <i className="ph-duotone ph-info text-primary me-2 f-s-16"></i>
                    {t('specification.basicInfo')}
                  </h6>
                  <PlanBasicInfo plan={plan} nodeOverviews={safeNodeOverview} />

                  {/* 套餐特性部分 */}
                  {planFeatures && planFeatures.length > 0 && (
                    <>
                      <div
                        className="pa-t-15 mg-b-15"
                        style={{ borderTop: '1px solid #dee2e6' }}
                      ></div>
                      <h6 className="fw-bold text-dark d-flex align-items-center mg-b-15">
                        <i className="ph-duotone ph-sparkle text-primary me-2 f-s-16"></i>
                        {t('specification.planFeatures')}
                      </h6>
                      {planLoading ? (
                        <Loading text={t('specification.loading')} variant="spinner" size="sm" />
                      ) : (
                        <PlanFeatures planFeatures={planFeatures || []} />
                      )}
                    </>
                  )}

                  {/* 节点概览部分 */}
                  <div className="pa-t-15 mg-b-15" style={{ borderTop: '1px solid #dee2e6' }}></div>
                  <h6 className="fw-bold text-dark d-flex align-items-center mg-b-15">
                    <i className="ph-duotone ph-map-pin text-primary me-2 f-s-16"></i>
                    {t('specification.nodeOverview')}
                  </h6>
                  {nodeOverviewLoading ? (
                    <Loading text={t('specification.loading')} variant="spinner" size="sm" />
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
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SubscriptionSpecification;
