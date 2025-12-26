import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { usePlans, useSubscribe } from '@hooks/useUser';
import { orderSave, unpaidOrder } from '@/api/v1/user';
import toast from '@/helpers/toast';
import { getErrorMessage } from '@/helpers/error';

import PlanSelector from '@components/Plan/PlanSelector';
import PlanOverview from '@components/Plan/PlanOverview';
import Loading from '@components/Common/Loading';
import EmptyState from '@components/Common/EmptyState';
import SubscriptionCycleSelector from '@components/Plan/SubscriptionCycleSelector';
import OrderDetail from '@components/Plan/OrderDetail';
import UnpaidOrderModal from '@components/Common/UnpaidOrderModal';
import SubscriptionChangeConfirmModal from '@components/Plan/SubscriptionChangeConfirmModal';
import TrafficDepletedConfirmModal from '@components/Plan/TrafficDepletedConfirmModal';

const PlanPage = () => {
  const { t } = useTranslation(['plan', 'common']);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<
    (API_V1.User.PlanItem & { features: string[] }) | null
  >(null);
  const [selectedPrice, setSelectedPrice] = useState<API_V1.User.PlanPriceItem | null>(null);

  // 使用 usePlans hook 获取套餐数据
  const { plansWithFeatures: plans, isLoading } = usePlans();

  // 获取当前用户订阅信息
  const { userData } = useSubscribe();

  // 套餐详情展示状态
  const [showPlanDetails, setShowPlanDetails] = useState(false);

  // 订单处理状态
  const [isProcessing, setIsProcessing] = useState(false);

  // 未支付订单相关状态
  const [showUnpaidOrderModal, setShowUnpaidOrderModal] = useState(false);
  const [currentUnpaidOrder, setCurrentUnpaidOrder] = useState<API_V1.User.OrderItem | null>(null);

  // 订阅变更确认相关状态
  const [showSubscriptionChangeModal, setShowSubscriptionChangeModal] = useState(false);
  const [subscriptionChangeResolver, setSubscriptionChangeResolver] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  // 流量耗尽确认相关状态
  const [showTrafficDepletedModal, setShowTrafficDepletedModal] = useState(false);
  const [trafficDepletedResolver, setTrafficDepletedResolver] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  // 统一的套餐选择逻辑
  const selectPlanWithPrice = (
    plan: (API_V1.User.PlanItem & { features: string[] }) | null,
    isTrafficPurchase: boolean = false,
    isTrafficReset: boolean = false,
    isTempTraffic: boolean = false,
  ) => {
    if (!plan) {
      setSelectedPlan(null);
      setSelectedPrice(null);
      return;
    }

    setActiveTab(plan.id.toString());
    setSelectedPlan(plan);

    // 根据场景选择价格选项
    if (plan.prices && plan.prices.length > 0) {
      let defaultPrice: API_V1.User.PlanPriceItem;

      if (isTrafficReset) {
        // 重置流量场景：优先选择重置流量类型（type === 3），没有才选择第一个
        const trafficResetPrice = plan.prices.find(price => price.type === 3);
        defaultPrice = trafficResetPrice ?? plan.prices[0];
      } else if (isTempTraffic) {
        // 补充临时流量场景：优先选择临时流量类型（type === 4），没有才选择第一个
        const tempTrafficPrice = plan.prices.find(price => price.type === 4);
        defaultPrice = tempTrafficPrice ?? plan.prices[0];
      } else if (isTrafficPurchase) {
        // 购买流量场景：优先选择一次性类型（type === 2）
        const oneTimePrice = plan.prices.find(price => price.type === 2);
        defaultPrice = oneTimePrice ?? plan.prices[0];
      } else {
        // 续期或普通访问场景：选择第一个价格选项
        defaultPrice = plan.prices[0];
      }

      setSelectedPrice(defaultPrice);
    } else {
      setSelectedPrice(null);
    }
  };

  useEffect(() => {
    if (plans && plans.length > 0) {
      // 检查是否有从state传入的defaultPlanId、isTrafficPurchase、isTrafficReset和isTempTraffic
      const state = location.state as {
        defaultPlanId?: number;
        isTrafficPurchase?: boolean;
        isTrafficReset?: boolean;
        isTempTraffic?: boolean;
      } | null;
      const defaultPlanId = state?.defaultPlanId;
      const isTrafficPurchase = state?.isTrafficPurchase ?? false;
      const isTrafficReset = state?.isTrafficReset ?? false;
      const isTempTraffic = state?.isTempTraffic ?? false;

      let targetPlan: (typeof plans)[0];

      // 如果有defaultPlanId，尝试找到对应的套餐
      if (defaultPlanId) {
        const planFromState = plans.find(p => p.id === defaultPlanId);
        targetPlan = planFromState ?? plans[0];
      } else {
        // 否则选择第一个套餐
        targetPlan = plans[0];
      }

      selectPlanWithPrice(targetPlan, isTrafficPurchase, isTrafficReset, isTempTraffic);
    }
  }, [plans, location.state]);

  // 处理Tab切换
  const handleTabChange = (tabId: string): void => {
    const plan = plans?.find(p => p.id.toString() === tabId);
    const state = location.state as {
      isTrafficPurchase?: boolean;
      isTrafficReset?: boolean;
      isTempTraffic?: boolean;
    } | null;
    const isTrafficPurchase = state?.isTrafficPurchase ?? false;
    const isTrafficReset = state?.isTrafficReset ?? false;
    const isTempTraffic = state?.isTempTraffic ?? false;

    selectPlanWithPrice(plan ?? null, isTrafficPurchase, isTrafficReset, isTempTraffic);
  };

  // 处理价格选择
  const handlePriceSelect = (price: API_V1.User.PlanPriceItem) => {
    setSelectedPrice(price);
  };

  // 检查未支付订单
  const checkUnpaidOrder = async (): Promise<boolean> => {
    const result = await unpaidOrder();
    const unpaidOrderData = result.data;

    if (unpaidOrderData) {
      // 有未支付订单，显示提醒Modal
      setCurrentUnpaidOrder(unpaidOrderData);
      setShowUnpaidOrderModal(true);
      return false; // 阻止继续提交
    }

    return true; // 没有未支付订单，可以继续提交
  };

  // 检查流量耗尽
  const checkTrafficDepleted = (): Promise<boolean> => {
    return new Promise(resolve => {
      // 如果没有订阅信息或没有选择价格，直接通过
      if (!userData?.analysis || !selectedPrice || !selectedPlan) {
        resolve(true);
        return;
      }

      // 检查是否是订阅变更，如果是订阅变更则不显示流量耗尽确认
      const isSubscriptionChange = userData.analysis.checkIsSubscriptionChange(selectedPlan.id);
      const isSubscriptionTypeChange = userData.analysis.checkIsSubscriptionTypeChange(
        selectedPrice.type,
      );

      if (isSubscriptionChange || isSubscriptionTypeChange) {
        resolve(true);
        return;
      }

      // 使用优化后的检查方法
      if (userData.analysis.checkShouldShowTrafficDepletedConfirm(selectedPrice.type)) {
        setTrafficDepletedResolver({ resolve });
        setShowTrafficDepletedModal(true);
      } else {
        resolve(true);
      }
    });
  };

  // 检查订阅变更
  const checkSubscriptionChange = (): Promise<boolean> => {
    return new Promise(resolve => {
      // 如果没有当前订阅或没有选择新套餐，直接通过
      if (!userData?.analysis || !selectedPlan || !selectedPrice) {
        resolve(true);
        return;
      }

      // 使用优化后的检查方法
      if (
        userData.analysis.checkShouldShowSubscriptionChangeConfirm(
          selectedPlan.id,
          selectedPrice.type,
        )
      ) {
        setSubscriptionChangeResolver({ resolve });
        setShowSubscriptionChangeModal(true);
      } else {
        resolve(true);
      }
    });
  };

  // 创建新订单 - 使用类型安全的参数，确保调用时已经有选择
  const createOrder = async (
    plan: API_V1.User.PlanItem & { features: string[] },
    price: API_V1.User.PlanPriceItem,
    couponCode?: string,
  ): Promise<string | null> => {
    const orderParams: API_V1.User.OrderSaveParams = {
      plan_id: plan.id,
      price_id: price.id,
      ...(couponCode && { coupon_code: couponCode }),
    };

    const result = await orderSave(orderParams);
    if (result.data) {
      return result.data; // 返回订单号
    } else {
      return null;
    }
  };

  // 处理订单提交 - 优化后的版本，避免冗余检查
  const handleSubmitOrder = async (couponCode?: string) => {
    // 这个函数只会在OrderDetail组件中被调用，而OrderDetail只在有选择时才渲染
    // 因此这里可以安全地假设selectedPlan和selectedPrice存在
    if (!selectedPlan || !selectedPrice) {
      // 这种情况理论上不应该发生，如果发生说明有系统错误
      console.error('Unexpected state: selectedPlan or selectedPrice is null');
      toast.error(t('plan.error.invalidSelection'));
      return;
    }

    setIsProcessing(true);

    try {
      // 1. 首先检查是否有未支付订单
      const canProceedUnpaid = await checkUnpaidOrder();
      if (!canProceedUnpaid) {
        return; // 有未支付订单，已显示Modal，停止处理
      }

      // 2. 检查订阅变更
      const canProceedSubscription = await checkSubscriptionChange();
      if (!canProceedSubscription) {
        return; // 用户取消了订阅变更，停止处理
      }

      // 3. 检查流量耗尽
      const canProceedTraffic = await checkTrafficDepleted();
      if (!canProceedTraffic) {
        return; // 用户取消了流量耗尽确认，停止处理
      }

      // 4. 创建新订单 - 传递确定存在的plan和price
      const tradeNo = await createOrder(selectedPlan, selectedPrice, couponCode);
      if (tradeNo) {
        // toast提示，订单创建成功，即将跳转到支付页面
        toast.success(t('plan:order.createSuccess'));

        // 跳转到订单支付页面, 延迟一秒
        setTimeout(() => {
          navigate(`/order/${tradeNo}`);
        }, 1000);
      }
    } catch (error) {
      console.error('Order submission failed:', error);
      // 使用 helper 处理错误消息
      const errorMessage = getErrorMessage(error, t('plan.error.submissionFailed'));
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // 处理未支付订单Modal关闭
  const handleUnpaidOrderModalClose = () => {
    setShowUnpaidOrderModal(false);
    setCurrentUnpaidOrder(null);
  };

  // 处理订单取消成功
  const handleOrderCancelled = () => {
    toast.success(t('plan:order.cancelSuccess'));
    setCurrentUnpaidOrder(null);
    // 取消订单后，可以继续提交新订单
    // 这里可以选择是否自动重新提交订单，或者让用户重新点击
  };

  // 处理订单取消失败
  const handleOrderCancelError = (error: string) => {
    console.error('Order cancellation failed:', error);
    toast.error(t('plan:order.cancelError'));
  };

  // 处理订阅变更确认
  const handleSubscriptionChangeConfirm = () => {
    if (subscriptionChangeResolver) {
      subscriptionChangeResolver.resolve(true);
      setSubscriptionChangeResolver(null);
    }
    setShowSubscriptionChangeModal(false);
  };

  // 处理订阅变更取消
  const handleSubscriptionChangeCancel = () => {
    if (subscriptionChangeResolver) {
      subscriptionChangeResolver.resolve(false);
      setSubscriptionChangeResolver(null);
    }
    setShowSubscriptionChangeModal(false);
  };

  // 处理流量耗尽确认
  const handleTrafficDepletedConfirm = () => {
    if (trafficDepletedResolver) {
      trafficDepletedResolver.resolve(true);
      setTrafficDepletedResolver(null);
    }
    setShowTrafficDepletedModal(false);
  };

  // 处理流量耗尽取消
  const handleTrafficDepletedCancel = () => {
    if (trafficDepletedResolver) {
      trafficDepletedResolver.resolve(false);
      setTrafficDepletedResolver(null);
    }
    setShowTrafficDepletedModal(false);
  };

  // 统一的状态处理函数
  const renderPageState = () => {
    // Loading 状态
    if (isLoading) {
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: '60vh' }}
        >
          <Loading size="lg" text={t('common:loading')} />
        </div>
      );
    }

    // Empty 状态
    if (!plans || plans.length === 0) {
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: '60vh' }}
        >
          <EmptyState title={t('common:noData')} icon="iconoir-glass-empty" size="lg" />
        </div>
      );
    }

    // 正常状态 - 渲染套餐内容
    return (
      <div className="min-vh-100">
        <Container fluid className="py-4">
          <Row className="mg-b-20">
            <Col xs={12}>
              <h4 className="main-title">
                <i className="ph ph-crown me-2"></i>
                {t('plan:title')}
              </h4>
            </Col>
          </Row>
          <Row className="g-2 g-md-4">
            {/* 主要内容区域 */}
            <Col lg={8}>
              {/* 套餐选择组件 */}
              <Card className="rounded-4 shadow-sm overflow-hidden mg-b-30">
                <div className="card-header">
                  <h5 className="f-fw-600 mg-b-0 text-dark">
                    <i className="ph ph-crown me-2"></i>
                    {t('plan:selector.title')}
                  </h5>
                </div>
                <CardBody className="pa-20 pa-md-24">
                  <PlanSelector plans={plans} activeTab={activeTab} onTabChange={handleTabChange} />
                </CardBody>
              </Card>

              {/* 套餐详情组件 */}
              {selectedPlan && (
                <Card className="rounded-4 shadow-sm overflow-hidden mg-b-30">
                  <div className="card-header">
                    <div className="d-flex align-items-center justify-content-between">
                      <h5 className="f-fw-600 mg-b-0 text-dark">
                        <i className="ph ph-info me-2"></i>
                        {t('plan:overview.title')}
                      </h5>

                      {/* 展开/收起按钮 */}
                      <Button
                        color="dark"
                        outline
                        className="btn btn-sm"
                        onClick={() => setShowPlanDetails(!showPlanDetails)}
                        title={showPlanDetails ? t('common:collapse') : t('common:expand')}
                      >
                        <i
                          className={`ph-duotone ${showPlanDetails ? 'ph-eye-slash' : 'ph-eye'} me-2`}
                        ></i>
                        <span>{showPlanDetails ? t('common:collapse') : t('common:expand')}</span>
                      </Button>
                    </div>
                  </div>
                  <CardBody className="pa-0">
                    <PlanOverview selectedPlan={selectedPlan} showPlanDetails={showPlanDetails} />
                  </CardBody>
                </Card>
              )}

              {/* 订阅周期选择组件 */}
              {selectedPlan?.prices && selectedPrice && (
                <Card className="rounded-4 shadow-sm overflow-hidden mg-b-30">
                  <div className="card-header">
                    <h5 className="f-fw-600 mg-b-0 text-dark">
                      <i className="ph ph-calendar me-2 "></i>
                      {t('plan:cycle.title')}
                    </h5>
                  </div>
                  <CardBody className="pa-20 pa-md-24">
                    <SubscriptionCycleSelector
                      prices={selectedPlan.prices}
                      selectedPrice={selectedPrice}
                      onPriceSelect={handlePriceSelect}
                      userData={userData}
                    />
                  </CardBody>
                </Card>
              )}
            </Col>

            {/* 订单详情组件 */}
            <Col lg={4}>
              <Card className="bg-white rounded-4 shadow-sm overflow-hidden">
                <div className="card-header bg-gradient-primary text-white pa-20 pa-md-24">
                  <h5 className="f-fw-600 text-dark mb-0">
                    <i className="ph ph-receipt me-2"></i>
                    {t('plan:order.title')}
                  </h5>
                </div>
                <CardBody className="pa-16 pa-md-20">
                  {selectedPlan && selectedPrice ? (
                    <OrderDetail
                      selectedPlan={selectedPlan}
                      selectedPrice={selectedPrice}
                      isProcessing={isProcessing}
                      onSubmitOrder={(couponCode?: string) => {
                        handleSubmitOrder(couponCode).catch(console.error);
                      }}
                    />
                  ) : (
                    <Loading text={t('common:loading')} variant="spinner" size="md" />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  };

  // 统一返回状态处理结果
  return (
    <>
      {renderPageState()}

      {/* 未支付订单提醒Modal */}
      <UnpaidOrderModal
        isOpen={showUnpaidOrderModal}
        toggle={handleUnpaidOrderModalClose}
        unpaidOrder={currentUnpaidOrder}
        onOrderCancelled={handleOrderCancelled}
        onOrderCancelError={handleOrderCancelError}
        isLoading={isProcessing}
      />

      {/* 订阅变更确认Modal */}
      <SubscriptionChangeConfirmModal
        isOpen={showSubscriptionChangeModal}
        toggle={handleSubscriptionChangeCancel}
        userData={userData}
        newPlan={selectedPlan}
        newPrice={selectedPrice}
        onConfirm={handleSubscriptionChangeConfirm}
      />

      {/* 流量耗尽确认Modal */}
      <TrafficDepletedConfirmModal
        isOpen={showTrafficDepletedModal}
        toggle={handleTrafficDepletedCancel}
        onConfirm={handleTrafficDepletedConfirm}
      />
    </>
  );
};

export default PlanPage;
