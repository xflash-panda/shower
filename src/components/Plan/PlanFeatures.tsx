import React from 'react';
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
    <div className="space-y-3">
      {planFeatures.map((feature, index) => {
        return (
          <div
            key={feature}
            className="plan-data-item d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center text-dark small fw-medium">
              <span className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle me-2 flex-shrink-0 plan-feature-index">
                {index + 1}
              </span>
              {feature}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlanFeatures;
