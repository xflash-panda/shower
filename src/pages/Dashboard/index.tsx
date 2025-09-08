import { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row, Collapse } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import ServerStatus from '@components/Dashboard/ServerStatus';
import ServerNodeMap from '@components/Dashboard/ServerNodeMap';
import Client from '@components/Dashboard/Client';
import NoticeSlider from '@components/Dashboard/NoticeSlider';
import SubscriptionCard from '@components/Dashboard/SubscriptionCard';
import Loading from '@components/Common/Loading';
import EmptyState from '@components/Common/EmptyState';

import { useNotice, useServers, useServerOverview, useSubscribe } from '@/hooks/useUser';
import type { UserSubscribeData } from '@/helpers/user';

const DashboardPage = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  // 获取通知数据
  const { notices, isLoading: noticesLoading, isError: noticesError } = useNotice();

  // 获取订阅数据
  const { userData, isLoading: subscribeLoading } = useSubscribe();

  // 统一处理类型断言 - 避免重复使用 as
  const subscribeData = userData as UserSubscribeData;

  // 添加节点状态折叠控制 - 默认隐藏
  const [isNodeStatusOpen, setIsNodeStatusOpen] = useState(false);

  // 获取服务器列表数据 - 只有在节点状态展开时才加载
  const { servers, isLoading: serversLoading } = useServers(isNodeStatusOpen);

  // 获取服务器概览数据 - 用于节点地图
  const { serverOverview, isLoading: serverOverviewLoading } = useServerOverview();

  return (
    <div className="min-vh-100">
      <Container fluid className="py-4">
        {/* 标题和面包屑 */}
        <Row className="mg-b-20">
          <Col xs={12}>
            <h4 className="main-title">
              <i className="ph-duotone ph-gauge me-2"></i>
              {t('dashboard:title')}
            </h4>
          </Col>
        </Row>

        {/* 通知轮播 - 方形dots */}
        {noticesLoading ? (
          <Row className="mg-b-25">
            <Loading text={t('common:loading')} variant="spinner" />
          </Row>
        ) : notices && notices.length > 0 ? (
          <Row className="mg-b-25">
            <NoticeSlider notices={notices} />
          </Row>
        ) : noticesError ? (
          (() => {
            console.error('Failed to load notices:', noticesError);
            return null;
          })()
        ) : null}

        {/* I18n 示例组件 */}
        {/* <Row className="mg-b-30">
          <Col xs={12} lg={6}>
            <I18nExample />
          </Col>
        </Row> */}

        {/* 我的订阅模块 */}
        <Card className="mg-b-30 b-r-15">
          <CardHeader className="pa-20 pa-b-15 border-0 flex-shrink-0">
            <h5 className="f-fw-600 mg-b-0 text-dark">
              <i className="ph-duotone ph-crown me-2"></i>
              {t('dashboard:subscription.title')}
            </h5>
          </CardHeader>
          <CardBody className="pa-25">
            {userData === null ? (
              <Loading text={t('common:loading')} variant="spinner" />
            ) : (
              <SubscriptionCard userSubscribeData={subscribeData} />
            )}
          </CardBody>
        </Card>

        {/* 客户端模块 */}
        {(subscribeLoading ||
          userData === null ||
          (userData && 'plan' in userData && subscribeData.plan !== '')) && (
          <Card className="mg-b-30 b-r-15">
            <CardHeader className="pa-20 pa-b-15 border-0 flex-shrink-0">
              <h5 className="f-fw-600 mg-b-0 text-dark">
                <i className="ph-duotone ph-devices me-2"></i>
                {t('dashboard:client.title')}
              </h5>
            </CardHeader>
            <CardBody className="pa-25 pa-t-15 d-flex flex-column flex-grow-1">
              {subscribeLoading || userData === null ? (
                <Loading text={t('common:loading')} variant="spinner" />
              ) : subscribeData.subscribeUrl ? (
                <Client subscribeUrl={subscribeData.subscribeUrl} />
              ) : (
                <EmptyState icon="iconoir-glass-empty" title={t('common:noData')} />
              )}
            </CardBody>
          </Card>
        )}

        {/* 节点状态列表 */}
        {(subscribeLoading || userData === null || (userData && subscribeData.plan !== '')) && (
          <Card className="mg-b-30 b-r-15">
            <CardHeader
              className="pa-25 cursor-pointer"
              onClick={() => setIsNodeStatusOpen(!isNodeStatusOpen)}
            >
              <div className="d-flex justify-content-between align-items-center pa-b-12">
                <h5 className="f-fw-600 mg-b-0 text-dark">
                  <i className="ph-duotone ph-monitor me-2"></i>
                  {t('dashboard:nodes.title')}
                </h5>
                <i
                  className={`ph-duotone ${isNodeStatusOpen ? 'ph-eye-slash' : 'ph-eye'} f-s-20 text-dark`}
                ></i>
              </div>
            </CardHeader>
            <Collapse isOpen={isNodeStatusOpen}>
              <CardBody className="pa-20">
                {/* 节点卡片网格布局 */}
                {subscribeLoading || userData === null ? (
                  <Loading text={t('common:loading')} variant="spinner" />
                ) : serversLoading ? (
                  <Loading text={t('common:loading')} variant="spinner" />
                ) : servers && servers.length > 0 ? (
                  <ServerStatus serverData={servers} />
                ) : (
                  <EmptyState icon="iconoir-glass-empty" title={t('common:noData')} />
                )}
              </CardBody>
            </Collapse>
          </Card>
        )}

        {/* 服务器节点地图模块 - 只有在无订阅时才显示 */}
        {userData && subscribeData.plan === '' && (
          <Card className="mg-b-30 b-r-15">
            <CardHeader className="pb-0">
              <h5 className="f-fw-600 mg-b-5 text-dark">
                <i className="ph-duotone ph-globe-hemisphere-west me-2"></i>
                {t('dashboard:nodeMap.title')}
              </h5>
            </CardHeader>
            <CardBody className="pa-25">
              {serverOverviewLoading ? (
                <Loading text={t('common:loading')} variant="spinner" />
              ) : !serverOverview || serverOverview.length === 0 ? (
                <EmptyState icon="iiconoir-glass-empty" title={t('common:noData')} />
              ) : (
                <ServerNodeMap serverData={serverOverview} />
              )}
            </CardBody>
          </Card>
        )}
      </Container>
    </div>
  );
};

export default DashboardPage;
