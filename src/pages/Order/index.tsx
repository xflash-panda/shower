import { useState } from 'react';
import { Col, Container, Row, Card, CardBody, CardHeader } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useOrders } from '@/hooks/useUser';
import { orderCancel } from '@/api/v1/user';
import OrderTable from '@components/Order/OrderTable';
import OrderCloseConfirmModal from '@components/Order/OrderCloseConfirmModal';
import Pagination from '@components/Common/Pagination';
import Loading from '@components/Common/Loading';
import EmptyState from '@components/Common/EmptyState';

const OrderPage = (): JSX.Element => {
  const { t } = useTranslation(['order', 'common']);
  // 状态管理
  const [page, setPage] = useState<number>(1);
  const [showCloseModal, setShowCloseModal] = useState<boolean>(false);
  const [orderToClose, setOrderToClose] = useState<API_V1.User.OrderItem | null>(null);

  const PAGE_SIZE = 10;

  // 使用 useOrders hook 获取订单数据
  const {
    orders: ordersData,
    total,
    isLoading,
    mutate,
  } = useOrders({
    pageSize: PAGE_SIZE,
    current: page,
  });

  const handleOpenCloseModal = (order: API_V1.User.OrderItem): void => {
    setOrderToClose(order);
    setShowCloseModal(true);
  };

  const handleToggleCloseModal = (): void => {
    setShowCloseModal(!showCloseModal);
    setOrderToClose(null);
    // 如果是关闭模态框，则刷新订单列表
    if (showCloseModal) {
      mutate().catch(error => {
        console.error('Failed to refresh orders list:', error);
      });
    }
  };

  const handleCloseOrder = async (params: { trade_no: string }): Promise<void> => {
    await orderCancel(params);
  };

  // 分页计算
  const totalPage = Math.ceil((total ?? 0) / PAGE_SIZE);
  const orders = ordersData ?? [];

  return (
    <div className="min-vh-100">
      <Container fluid className="py-4">
        <Row className="mg-b-20">
          <Col xs={12}>
            <h4 className="main-title">
              <i className="ph-duotone ph-package me-2"></i>
              {t('order:title')}
            </h4>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{t('order:list.title')}</h5>
                  <span className="text-muted">{t('order:list.total', { total: total ?? 0 })}</span>
                </div>
              </CardHeader>

              <CardBody>
                {isLoading ? (
                  <Loading text={t('common:loading')} variant="spinner" />
                ) : orders.length > 0 ? (
                  <>
                    <OrderTable
                      orders={orders}
                      currentPage={page}
                      pageSize={PAGE_SIZE}
                      onCloseOrder={handleOpenCloseModal}
                    />
                    <Pagination currentPage={page} totalPages={totalPage} onPageChange={setPage} />
                  </>
                ) : (
                  <EmptyState icon="iconoir-glass-empty" title={t('common:noData')} />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 关闭订单确认模态框 */}
      {orderToClose && (
        <OrderCloseConfirmModal
          isOpen={showCloseModal}
          order={orderToClose}
          onCloseOrder={handleCloseOrder}
          onToggle={handleToggleCloseModal}
        />
      )}
    </div>
  );
};

export default OrderPage;
