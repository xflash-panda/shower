import React from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row, Badge } from 'reactstrap';
import { useTranslation } from 'react-i18next';

const Terms = () => {
  const { t } = useTranslation('terms');
  return (
    <div className="page-wrapper">
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card className="card-bordered hover-effect">
                <CardHeader className="code-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h4 className="card-title mb-0">
                        <i className="ti ti-file-text me-2 text-dark"></i>
                        {t('title')}
                      </h4>
                      <p className="text-muted mb-0 mt-1">{t('subtitle')}</p>
                    </div>
                    <Badge color="secondary" className="text-white">
                      <i className="ti ti-clock me-1"></i>
                      {t('lastUpdated')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="terms-content">
                    <div className="mb-4 p-3 border-start border-4 border-primary">
                      <i className="ti ti-info-circle me-2 text-primary"></i>
                      <strong>{t('importantNotice')}</strong> {t('importantNoticeText')}
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-info-circle text-dark me-2"></i>
                          {t('sections.introduction.title')}
                        </h5>
                        <p className="mb-0">{t('sections.introduction.content')}</p>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-settings text-dark me-2"></i>
                          {t('sections.serviceDescription.title')}
                        </h5>
                        <p className="mb-3">{t('sections.serviceDescription.content')}</p>
                        <ul className="list-unstyled">
                          {Array.isArray(
                            t('sections.serviceDescription.services', {
                              returnObjects: true,
                            }),
                          )
                            ? (
                                t('sections.serviceDescription.services', {
                                  returnObjects: true,
                                }) as string[]
                              ).map((service: string, index: number) => (
                                <li
                                  key={service}
                                  className={
                                    index ===
                                    (
                                      t('sections.serviceDescription.services', {
                                        returnObjects: true,
                                      }) as string[]
                                    ).length -
                                      1
                                      ? 'mb-0'
                                      : 'mb-2'
                                  }
                                >
                                  <i className="ti ti-check text-dark me-2"></i>
                                  {service}
                                </li>
                              ))
                            : null}
                        </ul>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-ban text-dark me-2"></i>
                          {t('sections.refundPolicy.title')}
                        </h5>
                        <div className="mb-3 p-3 border-start border-4 border-danger">
                          <i className="ti ti-alert-circle me-2 text-danger"></i>
                          <strong>{t('sections.refundPolicy.importantStatement')}</strong>{' '}
                          {t('sections.refundPolicy.noRefund')}
                        </div>
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <div className="p-3 border rounded">
                              <h6 className="text-dark mb-2">
                                <i className="ti ti-x-circle me-2"></i>
                                {t('sections.refundPolicy.noRefundTitle')}
                              </h6>
                              <p className="mb-0 small">
                                {t('sections.refundPolicy.noRefundText')}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="p-3 border rounded">
                              <h6 className="text-dark mb-2">
                                <i className="ti ti-clock me-2"></i>
                                {t('sections.refundPolicy.immediateEffect')}
                              </h6>
                              <p className="mb-0 small">
                                {t('sections.refundPolicy.immediateEffectText')}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="p-3 border rounded">
                              <h6 className="text-dark mb-2">
                                <i className="ti ti-check-circle me-2"></i>
                                {t('sections.refundPolicy.purchaseConfirmation')}
                              </h6>
                              <p className="mb-0 small">
                                {t('sections.refundPolicy.purchaseConfirmationText')}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <h6 className="text-dark mb-2">
                            {t('sections.refundPolicy.detailedExplanation')}
                          </h6>
                          <ul className="list-unstyled mb-0">
                            <li className="mb-2">
                              <i className="ti ti-minus text-dark me-2"></i>
                              <strong>{t('sections.refundPolicy.serviceNature')}</strong>{' '}
                              {t('sections.refundPolicy.serviceNatureText')}
                            </li>
                            <li className="mb-2">
                              <i className="ti ti-minus text-dark me-2"></i>
                              <strong>
                                {t('sections.refundPolicy.technicalLimitations')}
                              </strong>{' '}
                              {t('sections.refundPolicy.technicalLimitationsText')}
                            </li>
                            <li className="mb-2">
                              <i className="ti ti-minus text-dark me-2"></i>
                              <strong>{t('sections.refundPolicy.usageStatus')}</strong>{' '}
                              {t('sections.refundPolicy.usageStatusText')}
                            </li>
                            <li className="mb-2">
                              <i className="ti ti-minus text-dark me-2"></i>
                              <strong>{t('sections.refundPolicy.serviceQuality')}</strong>{' '}
                              {t('sections.refundPolicy.serviceQualityText')}
                            </li>
                            <li>
                              <i className="ti ti-minus text-dark me-2"></i>
                              <strong>
                                {t('sections.refundPolicy.specialCircumstances')}
                              </strong>{' '}
                              {t('sections.refundPolicy.specialCircumstancesText')}
                            </li>
                          </ul>
                        </div>
                        <div className="mt-3 p-3 border rounded">
                          <h6 className="text-dark mb-2">
                            <i className="ti ti-alert-triangle me-1"></i>
                            {t('finalReminder')}
                          </h6>
                          <p className="mb-0">{t('finalReminderText')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-user-shield text-dark me-2"></i>
                          {t('sections.userAccount.title')}
                        </h5>
                        <div className="row">
                          <div className="col-md-4 mb-3">
                            <div className="p-3 border rounded">
                              <h6 className="text-dark mb-2">
                                <i className="ti ti-user-check me-1"></i>
                                {t('sections.userAccount.registrationRequirements')}
                              </h6>
                              <p className="mb-0">
                                {t('sections.userAccount.registrationRequirementsText')}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="p-3 border rounded">
                              <h6 className="text-dark mb-2">
                                <i className="ti ti-lock me-1"></i>
                                {t('sections.userAccount.accountSecurity')}
                              </h6>
                              <p className="mb-0">
                                {t('sections.userAccount.accountSecurityText')}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-4 mb-3">
                            <div className="p-3 border rounded">
                              <h6 className="text-dark mb-2">
                                <i className="ti ti-user-x me-1"></i>
                                {t('sections.userAccount.accountUsage')}
                              </h6>
                              <p className="mb-0">{t('sections.userAccount.accountUsageText')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-shield-lock text-dark me-2"></i>
                          {t('sections.userBehavior.title')}
                        </h5>
                        <ul className="list-unstyled mb-0">
                          {Array.isArray(
                            t('sections.userBehavior.prohibitedActions', {
                              returnObjects: true,
                            }),
                          )
                            ? (
                                t('sections.userBehavior.prohibitedActions', {
                                  returnObjects: true,
                                }) as string[]
                              ).map((action: string, index: number) => (
                                <li
                                  key={action}
                                  className={
                                    index ===
                                    (
                                      t('sections.userBehavior.prohibitedActions', {
                                        returnObjects: true,
                                      }) as string[]
                                    ).length -
                                      1
                                      ? ''
                                      : 'mb-2'
                                  }
                                >
                                  <i className="ti ti-ban text-dark me-2"></i>
                                  {action}
                                </li>
                              ))
                            : null}
                        </ul>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-copyright text-dark me-2"></i>
                          {t('sections.intellectualProperty.title')}
                        </h5>
                        <p>
                          <strong>{t('sections.intellectualProperty.ourRights')}</strong>{' '}
                          {t('sections.intellectualProperty.ourRightsText')}
                        </p>
                        <p>
                          <strong>{t('sections.intellectualProperty.userContent')}</strong>{' '}
                          {t('sections.intellectualProperty.userContentText')}
                        </p>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-shield-check text-dark me-2"></i>
                          {t('sections.privacyProtection.title')}
                        </h5>
                        <p>{t('sections.privacyProtection.content')}</p>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-refresh text-dark me-2"></i>
                          {t('sections.serviceChanges.title')}
                        </h5>
                        <p>
                          <strong>{t('sections.serviceChanges.serviceModifications')}</strong>{' '}
                          {t('sections.serviceChanges.serviceModificationsText')}
                        </p>
                        <p>
                          <strong>{t('sections.serviceChanges.accountTermination')}</strong>{' '}
                          {t('sections.serviceChanges.accountTerminationText')}
                        </p>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-alert-circle text-dark me-2"></i>
                          {t('sections.disclaimer.title')}
                        </h5>
                        <p>
                          <strong>{t('sections.disclaimer.asIs')}</strong>{' '}
                          {t('sections.disclaimer.asIsText')}
                        </p>
                        <p>
                          <strong>{t('sections.disclaimer.liabilityLimitation')}</strong>{' '}
                          {t('sections.disclaimer.liabilityLimitationText')}
                        </p>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-balance text-dark me-2"></i>
                          {t('sections.indemnification.title')}
                        </h5>
                        <p>{t('sections.indemnification.content')}</p>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-edit text-dark me-2"></i>
                          {t('sections.agreementModification.title')}
                        </h5>
                        <p>{t('sections.agreementModification.content')}</p>
                      </div>
                    </div>

                    <div className="card card-bordered mb-4">
                      <div className="card-body">
                        <h5 className="d-flex align-items-center mb-3">
                          <i className="ti ti-gavel text-dark me-2"></i>
                          {t('sections.governingLaw.title')}
                        </h5>
                        <p>{t('sections.governingLaw.content')}</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Terms;
