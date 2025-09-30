import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface FeatureCardProps {
  /** 用户信息数据 */
  userInfo?: API_V1.User.InfoItem;
  /** 是否正在加载 */
  isLoading?: boolean;
  /** 配置更新回调 */
  onUpdateConfig: (config: {
    auto_renewal?: number;
    auto_reset_traffic?: number;
    remind_expire?: number;
    remind_traffic?: number;
    system_notification?: number;
  }) => Promise<void>;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  userInfo,
  isLoading = false,
  onUpdateConfig,
}) => {
  const { t } = useTranslation('profile');
  // 为每个开关单独管理 loading 状态
  const [loadingStates, setLoadingStates] = useState({
    autoRenewal: false,
    autoResetTraffic: false,
    emailSubscriptionReminder: false,
    trafficUsageReminder: false,
    systemNotification: false,
  });
  // 处理自动续订设置变化
  const handleAutoRenewalChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, checked } = e.target;

    // 异步更新配置
    const updateConfig = async () => {
      const switchId = id as keyof typeof loadingStates;
      // 设置当前开关的 loading 状态
      setLoadingStates(prev => ({ ...prev, [switchId]: true }));
      try {
        if (id === 'autoRenewal') {
          await onUpdateConfig({ auto_renewal: checked ? 1 : 0 });
        } else if (id === 'autoResetTraffic') {
          await onUpdateConfig({ auto_reset_traffic: checked ? 1 : 0 });
        }
      } catch (error) {
        console.error('Failed to update auto renewal settings:', error);
      } finally {
        // 清除当前开关的 loading 状态
        setLoadingStates(prev => ({ ...prev, [switchId]: false }));
      }
    };

    void updateConfig();
  };

  // 处理通知设置变化
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, checked } = e.target;

    // 异步更新配置
    const updateConfig = async () => {
      const switchId = id as keyof typeof loadingStates;
      // 设置当前开关的 loading 状态
      setLoadingStates(prev => ({ ...prev, [switchId]: true }));
      try {
        if (id === 'emailSubscriptionReminder') {
          await onUpdateConfig({ remind_expire: checked ? 1 : 0 });
        } else if (id === 'trafficUsageReminder') {
          await onUpdateConfig({ remind_traffic: checked ? 1 : 0 });
        } else if (id === 'systemNotification') {
          await onUpdateConfig({ system_notification: checked ? 1 : 0 });
        }
      } catch (error) {
        console.error('Failed to update notification settings:', error);
      } finally {
        // 清除当前开关的 loading 状态
        setLoadingStates(prev => ({ ...prev, [switchId]: false }));
      }
    };

    void updateConfig();
  };

  return (
    <>
      {/* 自动续订设置 */}
      <Card className="mb-4">
        <CardHeader>
          <h5>{t('features.autoRenewal.title')}</h5>
        </CardHeader>
        <CardBody className="p-4">
          <Row className="g-4">
            <Col md="12">
              <ul className="share-menu-list">
                <li>
                  <div className="share-menu-item mb-4">
                    <span className="share-menu-img text-outline-primary h-45 w-45 d-flex-center b-r-10">
                      <i className="ph-bold ph-calendar-check f-s-30"></i>
                    </span>
                    <div className="share-menu-content">
                      <h6 className="mb-0">{t('features.autoRenewal.autoRenewal.title')}</h6>
                      <p className="mb-0 text-muted">
                        {t('features.autoRenewal.autoRenewal.description')}
                      </p>
                    </div>
                    <div className="main-switch main-switch-color d-flex mt-1">
                      <div className="switch-primary">
                        <input
                          type="checkbox"
                          id="autoRenewal"
                          className="toggle"
                          checked={userInfo?.auto_renewal === 1}
                          disabled={isLoading || loadingStates.autoRenewal}
                          onChange={handleAutoRenewalChange}
                        />
                        <label htmlFor="autoRenewal"></label>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="share-menu-item mb-4">
                    <span className="share-menu-img text-outline-warning h-45 w-45 d-flex-center b-r-10">
                      <i className="ph-bold ph-arrows-clockwise f-s-30"></i>
                    </span>
                    <div className="share-menu-content">
                      <h6 className="mb-0">{t('features.autoRenewal.autoResetTraffic.title')}</h6>
                      <p className="mb-0 text-muted">
                        {t('features.autoRenewal.autoResetTraffic.description')}
                      </p>
                    </div>
                    <div className="main-switch main-switch-color d-flex mt-1">
                      <div className="switch-primary">
                        <input
                          type="checkbox"
                          id="autoResetTraffic"
                          className="toggle"
                          checked={userInfo?.auto_reset_traffic === 1}
                          disabled={isLoading || loadingStates.autoResetTraffic}
                          onChange={handleAutoRenewalChange}
                        />
                        <label htmlFor="autoResetTraffic"></label>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* 通知设置 */}
      <Card className="mb-4">
        <CardHeader>
          <h5>{t('features.notifications.title')}</h5>
        </CardHeader>
        <CardBody className="p-4">
          <Row className="g-4">
            <Col md="12">
              <ul className="share-menu-list">
                <li>
                  <div className="share-menu-item mb-4">
                    <span className="share-menu-img text-outline-info h-45 w-45 d-flex-center b-r-10">
                      <i className="ph-bold ph-envelope f-s-30"></i>
                    </span>
                    <div className="share-menu-content">
                      <h6 className="mb-0">
                        {t('features.notifications.emailSubscriptionReminder.title')}
                      </h6>
                      <p className="mb-0 text-muted">
                        {t('features.notifications.emailSubscriptionReminder.description')}
                      </p>
                    </div>
                    <div className="main-switch main-switch-color d-flex mt-1">
                      <div className="switch-primary">
                        <input
                          type="checkbox"
                          id="emailSubscriptionReminder"
                          className="toggle"
                          checked={userInfo?.remind_expire === 1}
                          disabled={isLoading || loadingStates.emailSubscriptionReminder}
                          onChange={handleNotificationChange}
                        />
                        <label htmlFor="emailSubscriptionReminder"></label>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="share-menu-item mb-4">
                    <span className="share-menu-img text-outline-danger h-45 w-45 d-flex-center b-r-10">
                      <i className="ph-bold ph-chart-line f-s-30"></i>
                    </span>
                    <div className="share-menu-content">
                      <h6 className="mb-0">
                        {t('features.notifications.trafficUsageReminder.title')}
                      </h6>
                      <p className="mb-0 text-muted">
                        {t('features.notifications.trafficUsageReminder.description')}
                      </p>
                    </div>
                    <div className="main-switch main-switch-color d-flex mt-1">
                      <div className="switch-primary">
                        <input
                          type="checkbox"
                          id="trafficUsageReminder"
                          className="toggle"
                          checked={userInfo?.remind_traffic === 1}
                          disabled={isLoading || loadingStates.trafficUsageReminder}
                          onChange={handleNotificationChange}
                        />
                        <label htmlFor="trafficUsageReminder"></label>
                      </div>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="share-menu-item mb-4">
                    <span className="share-menu-img text-outline-success h-45 w-45 d-flex-center b-r-10">
                      <i className="ph-bold ph-bell f-s-30"></i>
                    </span>
                    <div className="share-menu-content">
                      <h6 className="mb-0">
                        {t('features.notifications.systemNotification.title')}
                      </h6>
                      <p className="mb-0 text-muted">
                        {t('features.notifications.systemNotification.description')}
                      </p>
                    </div>
                    <div className="main-switch main-switch-color d-flex mt-1">
                      <div className="switch-primary">
                        <input
                          type="checkbox"
                          id="systemNotification"
                          className="toggle"
                          checked={userInfo?.system_notification === 1}
                          disabled={isLoading || loadingStates.systemNotification}
                          onChange={handleNotificationChange}
                        />
                        <label htmlFor="systemNotification"></label>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default FeatureCard;
