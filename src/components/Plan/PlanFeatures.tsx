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
    <Row className="g-1 plan-features-grid">
      {planFeatures.map((feature, index) => (
        <Col key={feature} xl={6} lg={6} md={12} className="mg-b-6">
          <div className="plan-feature-item d-flex align-items-start h-100">
            <span className="d-inline-flex align-items-center justify-content-center text-white rounded-circle me-3 flex-shrink-0 plan-feature-index plan-feature-index-bg">
              {index + 1}
            </span>
            <span className="flex-grow-1 plan-feature-text text-dark">{feature}</span>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default PlanFeatures;
