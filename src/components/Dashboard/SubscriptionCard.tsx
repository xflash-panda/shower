import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardBody,
  Col,
  Row,
  Button,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import toast from '@/helpers/toast';
import { copyText } from '@/helpers/clipboard';
import { detectPlatform, type PlatformType } from '@/helpers/platform';
import { ClientDownloadData } from '@/data/client';
import type { Client } from '@/types/client';
import { SubscriptionStatus, type UserSubscribeData } from '@/helpers/user';
import { calculateRemainingTraffic, bytesToGB } from '@/helpers/bytes';

interface SubscriptionCardProps {
  userSubscribeData: UserSubscribeData;
}

const SubscriptionCard = ({ userSubscribeData }: SubscriptionCardProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');

  // 从 analysis 中获取订阅分析工具
  const { analysis } = userSubscribeData;

  // 优化：将3个订阅下拉状态合并为1个
  const [subscriptionDropdown, setSubscriptionDropdown] = useState(false);

  // 检测当前平台并获取对应的客户端列表
  const currentPlatform: PlatformType = useMemo(() => detectPlatform(), []);

  // 按钮显示逻辑 - 基于订阅状态的原子判断
  const subscriptionStatus = analysis.status.subscriptionStatus;
  const isPackageType = analysis.checkIsPackageType();

  // 是否显示续期按钮（非流量包类型才显示）
  const shouldShowRenewalButton = !isPackageType;

  // 是否显示购买流量按钮（流量包类型才显示）
  const shouldShowPurchaseButton = isPackageType;

  // 是否显示重置流量按钮（周期性订阅且流量耗尽，且未过期，且当前套餐包含重置流量价格 type=4）
  const hasResetTrafficPrice =
    userSubscribeData.plan?.prices?.some(price => price.type === 4) ?? false;
  const shouldShowResetButton =
    analysis.trafficStatus.isPeriodicWithDepleted &&
    subscriptionStatus !== SubscriptionStatus.SERVICE_EXPIRED &&
    subscriptionStatus !== SubscriptionStatus.EXPIRED_EXHAUSTED &&
    hasResetTrafficPrice;

  const availableClients: Client[] = useMemo(() => {
    const platform = ClientDownloadData.platforms.find(p => p.id === currentPlatform);
    return platform?.clients ?? [];
  }, [currentPlatform]);

  // 处理跳转到订阅页面
  const handleNavigateToPlan = () => {
    navigate('/plan');
  };

  // 处理续期跳转到订阅页面，传入当前planId
  const handleNavigateToRenewal = () => {
    if (userSubscribeData.analysis?.currentPlanId) {
      navigate('/plan', {
        state: {
          defaultPlanId: userSubscribeData.analysis.currentPlanId,
        },
      });
    } else {
      navigate('/plan');
    }
  };

  // 处理购买流量跳转到订阅页面，传入当前planId，标识为购买流量
  const handleNavigateToTrafficPurchase = () => {
    if (userSubscribeData.analysis?.currentPlanId) {
      navigate('/plan', {
        state: {
          defaultPlanId: userSubscribeData.analysis.currentPlanId,
          isTrafficPurchase: true,
        },
      });
    } else {
      navigate('/plan', {
        state: {
          isTrafficPurchase: true,
        },
      });
    }
  };

  // 处理重置流量跳转到订阅页面，传入当前planId，标识为重置流量
  const handleNavigateToTrafficReset = () => {
    if (userSubscribeData.analysis?.currentPlanId) {
      navigate('/plan', {
        state: {
          defaultPlanId: userSubscribeData.analysis.currentPlanId,
          isTrafficReset: true,
        },
      });
    } else {
      navigate('/plan', {
        state: {
          isTrafficReset: true,
        },
      });
    }
  };

  const copyToClipboard = (text: string) => {
    try {
      const success = copyText(text);
      if (success) {
        toast.success(t('subscription.success.linkCopied'));
      } else {
        toast.error(t('subscription.error.copyLinkFailed'));
      }
      return success;
    } catch (error) {
      console.error('Copy to clipboard failed:', error);
      toast.error(t('subscription.error.copyToClipboardFailed'));
      return false;
    }
  };

  // 一键导入处理函数
  const handleOneClickImport = (client: Client): void => {
    try {
      // 生成导入链接
      const importUrl = client.generateImportUrl(userSubscribeData.subscribeUrl);

      // 直接打开链接
      setTimeout(() => {
        window.open(importUrl, '_self');
      }, 500);
    } catch (error) {
      console.error('Error importing configuration:', error);
      toast.error(t('subscription.error.importConfigFailed'));
    }
  };

  return (
    <>
      {/* 核心数据卡片 */}
      {analysis.checkHasNoSubscription() ? (
        // 暂无订阅或暂无用户数据 - 显示购买订阅占位内容
        <Row>
          <Col xs={12}>
            <Card className="b-r-15 d-flex align-items-center justify-content-center h-150">
              <CardBody className="text-center pa-30">
                <div className="d-inline-flex align-items-center justify-content-center mg-b-18 b-r-50 w-75 h-75 txt-bg-primary">
                  <i className="ph-duotone ph-crown h2 text-primary"></i>
                </div>
                <h5 className="f-fw-600 mg-b-12 text-dark">
                  {t('subscription.noSubscription.title')}
                </h5>
                <p className="text-muted mg-b-20">{t('subscription.noSubscription.subtitle')}</p>
                <Button color="primary" className="btn btn-lg" onClick={handleNavigateToPlan}>
                  <i className="ph-duotone ph-shopping-cart me-1"></i>
                  {t('subscription.noSubscription.startButton')}
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      ) : (
        // 已订阅状态 - 显示原来的4个卡片
        <Row>
          {/* 当前订阅计划 */}
          <Col
            md={6}
            lg={analysis.checkIsPackageType() ? 4 : 3}
            className="mg-b-15 mb-md-3 shadow-sm"
          >
            <Card className="h-150 b-r-15">
              <CardBody className="pa-20 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-dark mg-b-5">{t('subscription.currentPlan')}</h6>
                    <h4 className="f-fw-600 mg-b-0 text-primary">{userSubscribeData.plan?.name}</h4>
                  </div>
                  <i className="ph-duotone ph-crown h1 text-warning"></i>
                </div>
                <div className="mt-auto">
                  <p className="small mg-b-0">
                    <span className="text-muted">{t('subscription.serviceStatus')}: </span>
                    <span
                      className={`f-fw-700 ${analysis.checkIsServiceNormal() ? 'text-success' : 'text-danger'}`}
                    >
                      {analysis.checkIsServiceNormal()
                        ? t('subscription.status.normal')
                        : t('subscription.status.abnormal')}
                    </span>
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* 流量使用情况 */}
          <Col
            md={6}
            lg={analysis.checkIsPackageType() ? 4 : 3}
            className="mg-b-15 mb-md-3 shadow-sm"
          >
            <Card className="h-150 b-r-15">
              <CardBody className="pa-20 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-dark mg-b-8">{t('subscription.trafficUsage')}</h6>
                    <div className="d-flex align-items-end">
                      <div className="d-flex align-items-baseline">
                        <h4 className="f-fw-600 mg-b-0 text-primary">
                          {userSubscribeData.traffic.gb.used.toFixed(2)}
                        </h4>
                        <small className="text-primary mg-s-3 f-fw-500">GB</small>
                      </div>
                      <span className="text-muted h5 mg-s-8 mg-e-8 f-fw-300">/</span>
                      <div className="d-flex align-items-baseline">
                        <span className="text-dark h5 f-fw-500">
                          {userSubscribeData.traffic.gb.total.toFixed(2)}
                        </span>
                        <small className="text-dark mg-s-3 f-fw-500">GB</small>
                      </div>
                    </div>
                  </div>
                  <i className="ph-duotone ph-chart-bar h1 text-primary"></i>
                </div>
                <div className="mt-auto">
                  <Progress
                    aria-valuenow={userSubscribeData.traffic.percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    value={userSubscribeData.traffic.percentage}
                    color={
                      userSubscribeData.traffic.percentage >= 100
                        ? 'danger'
                        : userSubscribeData.traffic.percentage > 80
                          ? 'warning'
                          : 'success'
                    }
                    className="mg-b-10"
                    striped
                    animated
                  >
                    {userSubscribeData.traffic.percentage.toFixed(1)}%
                  </Progress>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted mg-b-0">
                      {t('subscription.trafficRemaining')}
                      <span className="f-fw-700 text-primary mg-s-3 mg-e-3">
                        {bytesToGB(
                          calculateRemainingTraffic(
                            userSubscribeData.traffic.bytes.total,
                            userSubscribeData.traffic.bytes.used,
                          ),
                        ).toFixed(2)}
                      </span>
                      GB
                    </small>

                    <span
                      className={`small f-fw-600 ${
                        userSubscribeData.traffic.percentage >= 100
                          ? 'text-danger'
                          : userSubscribeData.traffic.percentage > 80
                            ? 'text-warning'
                            : 'text-success'
                      }`}
                    >
                      {userSubscribeData.traffic.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* 剩余天数 */}
          <Col
            md={6}
            lg={analysis.checkIsPackageType() ? 4 : 3}
            className="mg-b-15 mb-md-3 shadow-sm"
          >
            <Card className="h-150 b-r-15">
              <CardBody className="pa-20 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-dark  mg-b-5">{t('subscription.expiryDate')}</h6>
                    <h4 className="f-fw-600 mg-b-0">
                      {analysis.checkIsExpired()
                        ? t('subscription.status.expired')
                        : analysis.checkIsPackageType()
                          ? t('subscription.status.longTermValid')
                          : userSubscribeData.expiry?.isNeverExpires
                            ? t('subscription.status.neverExpires')
                            : (userSubscribeData.expiry?.date ?? '--')}
                    </h4>
                  </div>
                  <i
                    className={`ph-duotone ph-calendar h1 ${
                      analysis.checkIsExpired()
                        ? 'text-danger'
                        : analysis.checkIsPackageType()
                          ? 'text-info'
                          : 'text-success'
                    }`}
                  ></i>
                </div>
                <div className="mt-auto">
                  <small className="text-muted mg-b-0">
                    {analysis.checkIsExpired() ? (
                      <span className="text-danger f-fw-700">
                        {t('subscription.serviceExpired')}
                      </span>
                    ) : analysis.checkIsPackageType() ? (
                      <span className="text-muted">{t('subscription.packageNoExpiry')}</span>
                    ) : (
                      <>
                        {t('subscription.trafficRemaining')}
                        <span className="f-fw-700 text-primary mg-s-3 mg-e-3">
                          {userSubscribeData.expiry?.remainingDays ?? 0}
                        </span>
                        {t('subscription.daysToExpiry')}
                      </>
                    )}
                  </small>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* 流量重置 - 只在有重置信息且非流量包状态下显示 */}
          {userSubscribeData.reset && !analysis.checkIsPackageType() && (
            <Col md={6} lg={3} className="mg-b-15 mb-md-3 shadow-sm">
              <Card className="h-150 b-r-15">
                <CardBody className="pa-20 d-flex flex-column justify-content-between">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="text-dark mg-b-5">{t('subscription.trafficReset')}</h6>
                      <h4 className="f-fw-600 mg-b-0">{userSubscribeData.reset?.date ?? '--'}</h4>
                    </div>
                    <i className="ph-duotone ph-arrow-clockwise h1 text-info"></i>
                  </div>
                  <div className="mt-auto">
                    <small className="text-muted mg-b-0">
                      {analysis.checkIsExpired() ? (
                        <span className="text-danger f-fw-700">
                          {t('subscription.expiredCannotReset')}
                        </span>
                      ) : (
                        <>
                          {t('subscription.trafficRemaining')}
                          <span className="f-fw-700 text-primary mg-s-3 mg-e-3">
                            {userSubscribeData.reset?.remainingDays ?? 0}
                          </span>
                          {t('subscription.daysToReset')}
                        </>
                      )}
                    </small>
                  </div>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>
      )}

      {/* 订阅操作按钮区域 - 只在有订阅时显示 */}
      {!analysis.checkHasNoSubscription() && (
        <div className="card-footer pa-8 pa-s-20 pa-e-20 border-0">
          {/* 桌面端布局 - 水平排列 */}
          <div className="d-none d-md-flex justify-content-between align-items-center gap-1 flex-wrap">
            {/* 左侧：购买/续费相关按钮 */}
            <div className="d-flex align-items-center gap-1 flex-wrap">
              {/* 非一次性订阅（周期性订阅）- 显示续期和重置流量按钮 */}
              {shouldShowRenewalButton && (
                <>
                  {/* 续期/续费按钮 - 根据服务状态显示不同文字和图标 */}
                  <Button
                    color="primary"
                    className="btn btn-lg"
                    outline
                    onClick={handleNavigateToRenewal}
                  >
                    {analysis.checkIsExpired() ? (
                      <>
                        <i className="ph-duotone ph-credit-card me-1"></i>
                        {t('subscription.actions.renewExpired')}
                      </>
                    ) : (
                      <>
                        <i className="ph-duotone ph-clock-clockwise me-1"></i>
                        {t('subscription.actions.renew')}
                      </>
                    )}
                  </Button>

                  {/* 重置流量按钮 - 只在流量耗尽且非过期状态下显示 */}
                  {shouldShowResetButton && (
                    <Button
                      color="primary"
                      outline
                      className="btn btn-lg"
                      onClick={handleNavigateToTrafficReset}
                    >
                      <i className="ph-duotone ph-arrow-clockwise me-1"></i>
                      {t('subscription.actions.resetTraffic')}
                    </Button>
                  )}
                </>
              )}

              {/* 一次性订阅（流量包）- 只显示购买流量按钮 */}
              {shouldShowPurchaseButton && (
                <Button
                  color="primary"
                  className="btn btn-lg"
                  outline
                  onClick={handleNavigateToTrafficPurchase}
                >
                  <i className="ph-duotone ph-shopping-cart me-1"></i>
                  {t('subscription.actions.buyTraffic')}
                </Button>
              )}
            </div>

            {/* 右侧：一键订阅下拉菜单 */}
            <Dropdown
              isOpen={subscriptionDropdown}
              toggle={() => setSubscriptionDropdown(!subscriptionDropdown)}
            >
              <DropdownToggle caret color="primary" outline className="btn btn-lg">
                <i className="ph-duotone ph-lightning me-1"></i>
                {t('subscription.actions.quickImport')}
              </DropdownToggle>
              <DropdownMenu end>
                {/* 复制订阅地址选项 */}
                <DropdownItem
                  onPointerDown={() => {
                    copyToClipboard(userSubscribeData.subscribeUrl);
                  }}
                >
                  <i className="ph-duotone ph-copy me-2"></i>
                  {t('subscription.actions.copySubscriptionLink')}
                </DropdownItem>

                {/* 分隔线 */}
                <DropdownItem divider />

                {/* 当前平台的客户端一键导入选项 */}
                {availableClients.map(client => (
                  <DropdownItem key={client.id} onPointerDown={() => handleOneClickImport(client)}>
                    <i className="ph-duotone ph-export me-2"></i>
                    {t('subscription.actions.importToClient')} {client.name}
                  </DropdownItem>
                ))}

                {/* 如果没有可用的客户端，显示提示信息 */}
                {availableClients.length === 0 && (
                  <DropdownItem disabled>
                    <i className="ph-duotone ph-info me-2"></i>
                    {t('subscription.actions.noPlatformClients')}
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* 移动端布局 - 智能适应按钮数量 */}
          <div className="d-block d-md-none">
            <div className="pa-15">
              {(() => {
                // 计算可见按钮数量
                const hasRenewal = shouldShowRenewalButton;
                const hasPurchase = shouldShowPurchaseButton;
                const hasReset = shouldShowResetButton;
                const hasImport = true; // 快速导入始终显示

                const buttonCount =
                  (hasRenewal ? 1 : 0) +
                  (hasPurchase ? 1 : 0) +
                  (hasReset ? 1 : 0) +
                  (hasImport ? 1 : 0);

                // 只有两个按钮时，并排显示
                if (buttonCount === 2) {
                  return (
                    <div className="d-flex gap-3">
                      {/* 续期/续费按钮 */}
                      {hasRenewal && (
                        <Button
                          color="primary"
                          outline
                          className="flex-fill d-flex align-items-center justify-content-center pa-10 f-fw-500"
                          onClick={handleNavigateToRenewal}
                        >
                          {analysis.checkIsExpired() ? (
                            <>
                              <i className="ph-duotone ph-credit-card me-1"></i>
                              {t('subscription.actions.renewExpired')}
                            </>
                          ) : (
                            <>
                              <i className="ph-duotone ph-clock-clockwise me-1"></i>
                              {t('subscription.actions.renew')}
                            </>
                          )}
                        </Button>
                      )}

                      {/* 购买流量按钮 */}
                      {hasPurchase && (
                        <Button
                          color="primary"
                          outline
                          className="flex-fill d-flex align-items-center justify-content-center pa-10 f-fw-500"
                          onClick={handleNavigateToTrafficPurchase}
                        >
                          <i className="ph-duotone ph-shopping-cart me-1"></i>
                          {t('subscription.actions.buyTraffic')}
                        </Button>
                      )}

                      {/* 快速导入下拉菜单 */}
                      <Dropdown
                        isOpen={subscriptionDropdown}
                        toggle={() => setSubscriptionDropdown(!subscriptionDropdown)}
                        className="flex-fill"
                      >
                        <DropdownToggle
                          color="info"
                          outline
                          className="btn w-100 d-flex align-items-center justify-content-center pa-10 f-fw-500"
                        >
                          <i className="ph-duotone ph-lightning me-1"></i>
                          {t('subscription.actions.quickImport')}
                          <i className="ti ti-chevron-down ms-1"></i>
                        </DropdownToggle>
                        <DropdownMenu end>
                          {/* 复制订阅地址选项 */}
                          <DropdownItem
                            onPointerDown={() => {
                              copyToClipboard(userSubscribeData.subscribeUrl);
                            }}
                          >
                            <i className="ph-duotone ph-copy me-2"></i>
                            {t('subscription.actions.copySubscriptionLink')}
                          </DropdownItem>

                          {/* 分隔线 */}
                          <DropdownItem divider />

                          {/* 当前平台的客户端一键导入选项 */}
                          {availableClients.map(client => (
                            <DropdownItem
                              key={client.id}
                              onPointerDown={() => handleOneClickImport(client)}
                            >
                              <i className="ph-duotone ph-export me-2"></i>
                              {t('subscription.actions.importToClient')} {client.name}
                            </DropdownItem>
                          ))}

                          {/* 如果没有可用的客户端，显示提示信息 */}
                          {availableClients.length === 0 && (
                            <DropdownItem disabled>
                              <i className="ph-duotone ph-info me-2"></i>
                              {t('subscription.actions.noPlatformClients')}
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  );
                }

                // 三个或更多按钮时，使用原来的布局
                return (
                  <div className="d-grid gap-3">
                    {/* 续费和重置流量按钮 - 并排显示 */}
                    <div className="d-flex gap-3">
                      {/* 续期/续费按钮 */}
                      {hasRenewal && (
                        <Button
                          color="primary"
                          outline
                          className="flex-fill d-flex align-items-center justify-content-center pa-10 f-fw-500"
                          onClick={handleNavigateToRenewal}
                        >
                          {analysis.checkIsExpired() ? (
                            <>
                              <i className="ph-duotone ph-credit-card me-1"></i>
                              {t('subscription.actions.renewExpired')}
                            </>
                          ) : (
                            <>
                              <i className="ph-duotone ph-clock-clockwise me-1"></i>
                              {t('subscription.actions.renew')}
                            </>
                          )}
                        </Button>
                      )}

                      {/* 重置流量按钮 */}
                      {hasReset && (
                        <Button
                          color="danger"
                          outline
                          className="flex-fill d-flex align-items-center justify-content-center pa-10 f-fw-500"
                          onClick={handleNavigateToTrafficReset}
                        >
                          <i className="ph-duotone ph-arrow-clockwise me-1"></i>
                          {t('subscription.actions.resetTraffic')}
                        </Button>
                      )}

                      {/* 购买流量按钮 - 只在流量包状态下显示，占满整行 */}
                      {hasPurchase && (
                        <Button
                          color="primary"
                          outline
                          className="w-100 d-flex align-items-center justify-content-center pa-10 f-fw-500"
                          onClick={handleNavigateToTrafficPurchase}
                        >
                          <i className="ph-duotone ph-shopping-cart me-1"></i>
                          {t('subscription.actions.buyTraffic')}
                        </Button>
                      )}
                    </div>

                    {/* 快速导入下拉菜单 - 单独一排 */}
                    {hasImport && (
                      <Dropdown
                        isOpen={subscriptionDropdown}
                        toggle={() => setSubscriptionDropdown(!subscriptionDropdown)}
                        className="flex-fill"
                      >
                        <DropdownToggle
                          color="info"
                          outline
                          className="btn w-100 d-flex align-items-center justify-content-center pa-10 f-fw-500"
                        >
                          <i className="ph-duotone ph-lightning me-1"></i>
                          {t('subscription.actions.quickImport')}
                          <i className="ti ti-chevron-down ms-1"></i>
                        </DropdownToggle>
                        <DropdownMenu end>
                          {/* 复制订阅地址选项 */}
                          <DropdownItem
                            onPointerDown={() => {
                              copyToClipboard(userSubscribeData.subscribeUrl);
                            }}
                          >
                            <i className="ph-duotone ph-copy me-2"></i>
                            {t('subscription.actions.copySubscriptionLink')}
                          </DropdownItem>

                          {/* 分隔线 */}
                          <DropdownItem divider />

                          {/* 当前平台的客户端一键导入选项 */}
                          {availableClients.map(client => (
                            <DropdownItem
                              key={client.id}
                              onPointerDown={() => handleOneClickImport(client)}
                            >
                              <i className="ph-duotone ph-export me-2"></i>
                              {t('subscription.actions.importToClient')} {client.name}
                            </DropdownItem>
                          ))}

                          {/* 如果没有可用的客户端，显示提示信息 */}
                          {availableClients.length === 0 && (
                            <DropdownItem disabled>
                              <i className="ph-duotone ph-info me-2"></i>
                              {t('subscription.actions.noPlatformClients')}
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      </Dropdown>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionCard;
