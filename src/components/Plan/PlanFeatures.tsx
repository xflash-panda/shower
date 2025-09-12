import React from 'react';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface PlanFeaturesProps {
  planFeatures: string[];
}

const PlanFeatures: React.FC<PlanFeaturesProps> = ({ planFeatures }) => {
  const { t } = useTranslation('plan');

  if (!planFeatures || planFeatures.length === 0) {
    return <div className="text-center text-muted small">{t('basicInfo.values.noFeatures')}</div>;
  }

  return (
    <Row>
      {planFeatures.map((feature, index) => {
        return (
          <Col key={feature} xl={6} lg={6} md={12} className="mg-b-10">
            <div className="d-flex align-items-start text-dark small fw-medium">
              <span className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-2 flex-shrink-0 plan-feature-index">
                {index + 1}
              </span>
              <span className="lh-base">{feature}</span>
            </div>
          </Col>
        );
      })}
    </Row>
  );
};

export default PlanFeatures;
