import { useState, useEffect } from 'react';
import { Col, Container, Row, Card, CardHeader, CardBody, Nav, NavItem, NavLink } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SecurityCard from '@components/Profile/SecurityCard';
import FeatureCard from '@components/Profile/FeatureCard';
import ConnectionCard from '@components/Profile/ConnectionCard';
import { useUserInfo, useProfileConfig } from '@/hooks/useUser';
import { update } from '@/api/v1/user';

const ProfilePage = () => {
  const { t } = useTranslation(['profile', 'common']);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('feature');

  // 获取用户信息
  const { userInfo, isLoading, mutate } = useUserInfo();

  // 获取配置信息
  const { profileConfig } = useProfileConfig();

  useEffect(() => {
    const state = location.state as { defaultTab?: string } | null;
    if (state?.defaultTab) {
      setActiveTab(state.defaultTab);
    }
  }, [location.state]);

  const toggleTab = (tab: string) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  // 更新用户配置
  const handleUpdateConfig = async (config: {
    auto_renewal?: number;
    auto_reset_traffic?: number;
    remind_expire?: number;
    remind_traffic?: number;
  }): Promise<void> => {
    try {
      await update(config);
      // 重新获取用户信息以更新UI
      await mutate();
    } catch (error) {
      console.error('Failed to update configuration:', error);
      throw error; // 重新抛出错误，让子组件处理
    }
  };

  // 包装 mutate 函数以匹配期望的类型
  const handleUserInfoMutate = async (): Promise<void> => {
    await mutate();
  };

  return (
    <div className="min-vh-100">
      <Container fluid>
        <Row className="mg-b-20">
          <Col xs={12}>
            <h4 className="main-title">
              <i className="ph ph-user me-2"></i>
              {t('profile:title')}
            </h4>
          </Col>
        </Row>
        <Row>
          <Col lg={4} xxl={3}>
            <Card>
              <CardHeader>
                <h5>{t('profile:settings.title')}</h5>
              </CardHeader>
              <CardBody>
                <div className="vertical-tab setting-tab">
                  <Nav tabs className="app-tabs-primary">
                    <NavItem>
                      <NavLink
                        className={activeTab === 'feature' ? 'active' : ''}
                        onClick={() => toggleTab('feature')}
                      >
                        <i className="ph-bold ph-notification pe-2"></i>
                        {t('profile:settings.features')}
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        className={activeTab === 'security' ? 'active' : ''}
                        onClick={() => toggleTab('security')}
                      >
                        <i className="ph-bold ph-shield-check pe-2"></i>
                        {t('profile:settings.security')}
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        className={activeTab === 'connection' ? 'active' : ''}
                        onClick={() => toggleTab('connection')}
                      >
                        <i className="ph-bold ph-link pe-2"></i>
                        {t('profile:settings.connections')}
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
              </CardBody>
            </Card>

            {/* Used Space Card */}
          </Col>
          <Col lg={8} xxl={9}>
            <div className="tab-content">
              {activeTab === 'feature' && (
                <div className="tab-pane active">
                  <FeatureCard
                    userInfo={userInfo}
                    isLoading={isLoading}
                    onUpdateConfig={handleUpdateConfig}
                  />
                </div>
              )}
              {activeTab === 'security' && (
                <div className="tab-pane active">
                  <SecurityCard />
                </div>
              )}
              {activeTab === 'connection' && (
                <div className="tab-pane active">
                  <ConnectionCard
                    userInfo={userInfo}
                    profileConfig={profileConfig}
                    onUserInfoMutate={handleUserInfoMutate}
                  />
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;
