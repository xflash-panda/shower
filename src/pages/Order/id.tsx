import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card, CardHeader, CardBody, Button } from 'reactstrap';
import { orderCancel, orderUpdate, orderCheckout } from '@/api/v1/user';
import { useOrder, usePaymentNames, useOrderCheck } from '@/hooks/useUser';
import OrderCloseConfirmModal from '@components/Order/OrderCloseConfirmModal';
import OrderInfo from '@components/Order/OrderInfo';
import SubscriptionInfo from '@components/Order/SubscriptionInfo';
import PaymentMethods from '@components/Order/PaymentMethods';
import PaymentInfo from '@components/Order/PaymentInfo';
import PaymentCelebration from '@components/Order/PaymentCelebration';
import toast from '@/helpers/toast';
import Loading from '@components/Common/Loading';
import EmptyState from '@components/Common/EmptyState';

// 订单相关类型定义

const OrderDetail = () => {
  const { t } = useTranslation('order');
  const { id } = useParams();
  const [selectedPayment, setSelectedPayment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // 使用 useOrder hook 获取订单详情
  const { order, isLoading, isError, mutate } = useOrder(
    { trade_no: id ?? '' },
    !!id, // 只有当 id 存在时才启用请求
  );

  // 获取支付方式数据
  const { paymentMethods, isLoading: isPaymentLoading } = usePaymentNames();

  // 支付状态轮询 - 仅在待支付状态下启用，3秒间隔
  const { orderStatus } = useOrderCheck(
    { trade_no: id ?? '' },
    !!id && order?.status === 0, // 只有在订单存在且状态为待支付时才启用轮询
    3000, // 3秒轮询间隔
  );

  // 监听支付状态变化
  useEffect(() => {
    if (orderStatus === 1) {
      // 1表示已支付
      // 支付成功，刷新订单详情
      void mutate();
      // 显示庆祝动画而不是简单的 toast
      setShowCelebration(true);
    }
  }, [orderStatus, mutate]);

  // 初始化支付方式选择 - 当订单和支付方式数据都加载完成后
  useEffect(() => {
    if (order && paymentMethods && paymentMethods.length > 0 && !selectedPayment) {
      // 如果订单中已有选择的支付方式，使用该支付方式
      if (order.payment_id) {
        const existingPayment = paymentMethods.find(p => p.id === order.payment_id);
        if (existingPayment) {
          setSelectedPayment(order.payment_id.toString());
          return;
        }
      }

      // 否则选择第一个可用的支付方式作为默认选项
      const firstPayment = paymentMethods[0];
      if (firstPayment) {
        setSelectedPayment(firstPayment.id.toString());
      }
    }
  }, [order, paymentMethods, selectedPayment]);

  // 如果有错误，重定向到404页面
  if (isError) {
    return <Navigate to="/404" replace />;
  }

  // 加载状态
  if (isLoading || !order) {
    return (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: '60vh' }}
      >
        <Loading size="lg" text={t('common.loading')} />
      </div>
    );
  }

  // 处理支付
  const handlePayment = async (): Promise<void> => {
    const finalAmount = order.total_amount ?? 0;

    // 如果实付金额大于0，需要选择支付方式
    if (finalAmount > 0 && !selectedPayment) {
      toast.error(t('payment.error.selectMethod'));
      return;
    }

    setIsProcessing(true);

    try {
      const response = await orderCheckout({
        trade_no: order.trade_no.toString(),
      });

      if (response.data) {
        const data = response.data;

        if (typeof data === 'string') {
          // 跳转到第三方支付平台
          toast.info(t('payment.info.redirecting'));
          window.location.href = data;
        } else if (data === true) {
          // 支付已完成
          await mutate();
          setIsProcessing(false);
          // 显示庆祝动画
          setShowCelebration(true);
        } else {
          toast.error(t('payment.error.responseFormat'));
          setIsProcessing(false);
        }
      } else {
        toast.error(t('payment.error.initiateFailed'));
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error(t('payment.error.initiateFailedRetry'));
      setIsProcessing(false);
    }
  };

  // getPaymentIcon 函数现在在 PaymentMethods 组件内部

  // 处理关闭订单的API调用
  const handleCloseOrder = async (params: { trade_no: string }): Promise<void> => {
    await orderCancel(params);
  };

  // 处理支付方式选择
  const handlePaymentSelect = async (
    paymentId: string,
    _paymentData: API_V1.User.PaymentNameItem,
  ) => {
    try {
      setIsUpdatingPayment(true);

      // 调用订单更新接口
      await orderUpdate({
        trade_no: id ?? '',
        method_id: Number(paymentId),
      });

      // 更新本地状态
      setSelectedPayment(paymentId);

      // 刷新订单数据
      await mutate();
    } catch (error) {
      console.error('Failed to update payment method:', error);
      toast.error(t('payment.error.updateMethodFailed'));
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  // 切换关闭订单模态框状态
  const handleToggleCloseModal = (): void => {
    setShowCloseModal(!showCloseModal);
    // 如果是关闭模态框且订单已关闭，则刷新数据
    if (showCloseModal) {
      void mutate();
    }
  };

  // 庆祝动画处理函数
  const handleCelebrationComplete = (): void => {
    setShowCelebration(false);
  };

  // 模拟支付成功（用于测试）
  const handleSimulatePaymentSuccess = (): void => {
    setShowCelebration(true);
  };

  return (
    <div className="min-vh-100">
      <Container fluid className="py-4">
        {/* 现代化页面头部 */}
        <Row className="m-1">
          <Col xs={12}>
            {/* 恢复头部为原来的样式 */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="main-title mb-0">
                <i className="ph-duotone ph-package me-2"></i>
                <span className="me-2">{t('detail.title')} -</span>
                <span className="text-secondary">#{order.trade_no.toString()}</span>
              </h4>

              {/* 返回订单列表按钮 */}
              <Link to="/order" className="btn btn-secondary btn-sm fw-medium">
                <i className="ti ti-arrow-left me-1"></i>
                {t('detail.backToList')}
              </Link>
            </div>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={order.status === 0 ? 8 : 12}>
            {/* 订阅信息卡片 - 根据订单类型显示不同内容 */}
            <Card className="shadow-sm mb-4">
              <CardHeader className="bg-gradient-primary text-white">
                <h5 className="f-fw-600 mg-b-0 text-dark">
                  <i className={`ti ${order.type === 6 ? 'ti-credit-card' : 'ti-crown'} me-2`}></i>
                  {order.type === 6 ? t('detail.rechargeInfo') : t('detail.subscriptionInfo')}
                </h5>
              </CardHeader>
              <CardBody>
                {/* 处理订阅信息的 loading 和 empty 状态 */}
                {isLoading ? (
                  <Loading text={t('common.loading')} variant="spinner" />
                ) : !order ? (
                  <EmptyState title={t('common.noData')} icon="iconoir-glass-empty" size="sm" />
                ) : (
                  <SubscriptionInfo order={order} />
                )}
              </CardBody>
            </Card>

            {/* 现代化订单信息卡片 */}
            <Card className="shadow-sm overflow-hidden">
              {/* 订单信息卡片头部 */}
              <CardHeader className="bg-gradient-primary text-white">
                {order?.status === 0 ? (
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <h5 className="f-fw-600 mg-b-0 text-dark">
                      <i className="ti ti-file-text me-2"></i>
                      {t('detail.orderInfo')}
                    </h5>
                    {/* 关闭订单按钮 - 仅在待支付状态显示 */}
                    <Button
                      color="danger"
                      size="sm"
                      onClick={handleToggleCloseModal}
                      disabled={isProcessing}
                    >
                      <i className="ti ti-ban me-1"></i>
                      {t('detail.closeOrder')}
                    </Button>
                  </div>
                ) : (
                  <h5 className="f-fw-600 mg-b-0 text-dark">
                    <i className="ti ti-file-text me-2"></i>
                    {t('detail.orderInfo')}
                  </h5>
                )}
              </CardHeader>
              <CardBody>
                {/* 处理订单信息的 loading 和 empty 状态 */}
                {isLoading ? (
                  <Loading text={t('common.loading')} variant="spinner" />
                ) : !order ? (
                  <div className="text-center py-4">
                    <EmptyState title={t('common.noData')} icon="iconoir-glass-empty" size="sm" />
                  </div>
                ) : (
                  <OrderInfo order={order} />
                )}
              </CardBody>
            </Card>
          </Col>

          <Col lg={order.status === 0 ? 4 : 12}>
            {/* 现代化支付框 */}
            {order.status === 0 && (
              <div className="sticky-top-100">
                {/* 支付方式选择卡片 - 仅在实付金额大于0时显示 */}
                {(order.total_amount ?? 0) > 0 && (
                  <Card className="shadow-sm border-0 mb-4">
                    <CardHeader className="bg-gradient-primary text-white">
                      <h5 className="f-fw-600 mg-b-0 text-dark">
                        <i className="ti ti-settings me-2"></i>
                        {t('detail.paymentMethod')}
                      </h5>
                    </CardHeader>

                    <CardBody className="px-4 pt-2 pb-4">
                      {isPaymentLoading ? (
                        <Loading text={t('common.loading')} variant="spinner" />
                      ) : !paymentMethods || paymentMethods.length === 0 ? (
                        <EmptyState
                          title={t('common.noData')}
                          icon="iconoir-glass-empty"
                          size="sm"
                        />
                      ) : (
                        <PaymentMethods
                          paymentMethods={paymentMethods}
                          selectedPayment={selectedPayment}
                          onPaymentSelect={(paymentId, paymentData) => {
                            if (paymentData) {
                              void handlePaymentSelect(paymentId, paymentData);
                            }
                          }}
                          isUpdatingPayment={isUpdatingPayment}
                        />
                      )}
                    </CardBody>
                  </Card>
                )}

                {/* 支付信息卡片 - 独立的第二个卡片 */}
                <Card className="shadow-sm border-0">
                  <CardHeader className="bg-gradient-primary text-white">
                    <h5 className="f-fw-600 mg-b-0 text-dark">
                      <i className="ti ti-wallet me-2"></i>
                      {t('detail.paymentInfo')}
                    </h5>
                  </CardHeader>

                  <CardBody className="px-4 pt-2 pb-4">
                    <PaymentInfo
                      order={order}
                      selectedPayment={selectedPayment}
                      isUpdatingPayment={isUpdatingPayment}
                      isProcessing={isProcessing}
                      handlePayment={() => void handlePayment()}
                      showFinalAmount={(order.total_amount ?? 0) > 0}
                    />

                    {/* 安全提示 - 仅在有实付金额时显示 */}
                    {(order.total_amount ?? 0) > 0 && (
                      <div className="text-center mt-3">
                        <small className="text-muted d-flex align-items-center justify-content-center">
                          <i className="ti ti-shield-check me-1 text-success"></i>
                          {t('detail.sslSecurity')}
                        </small>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            )}
          </Col>
        </Row>
      </Container>

      {/* 关闭订单确认模态框 */}
      {order && (
        <OrderCloseConfirmModal
          isOpen={showCloseModal}
          order={order}
          onCloseOrder={handleCloseOrder}
          onToggle={handleToggleCloseModal}
        />
      )}

      {/* 支付成功庆祝动画 */}
      <PaymentCelebration
        isVisible={showCelebration}
        orderAmount={order?.total_amount ?? 0}
        onComplete={handleCelebrationComplete}
        autoRedirectSeconds={15}
        orderTradeNo={order?.trade_no?.toString()}
      />

      {/* 开发环境测试按钮 */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
          }}
        >
          <Button
            color="warning"
            size="sm"
            onClick={handleSimulatePaymentSuccess}
            className="shadow"
          >
            {t('detail.testCelebration')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
