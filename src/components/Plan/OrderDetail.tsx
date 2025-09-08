import { useState } from 'react';
import { Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import CouponModal from '@components/Plan/CouponModal';
import { formatCurrency } from '@/helpers/currency';
import type { CouponInnfo } from '@components/Plan/CouponModal';

interface OrderDetailProps {
  selectedPlan: API_V1.User.PlanItem;
  selectedPrice: API_V1.User.PlanPriceItem;
  isProcessing: boolean;
  onSubmitOrder: (couponCode?: string) => void;
}

const OrderDetail = ({
  selectedPlan,
  selectedPrice,
  isProcessing,
  onSubmitOrder,
}: OrderDetailProps) => {
  const { t } = useTranslation('plan');

  // 内部状态管理
  const [showCouponModal, setShowCouponModal] = useState<boolean>(false);
  const [couponStatus, setCouponStatus] = useState<'' | 'validating' | 'valid' | 'invalid'>('');
  const [couponInfo, setCouponInfo] = useState<CouponInnfo | null>(null);

  // 计算折扣金额
  const calculateDiscount = (): number => {
    if (!couponInfo || !selectedPrice || couponStatus !== 'valid') {
      return 0;
    }

    if (couponInfo.type === 'percentage') {
      // 百分比
      return Math.floor((selectedPrice.value * couponInfo.value) / 100);
    } else if (couponInfo.type === 'fixed') {
      // 固定金额
      return Math.min(couponInfo.value, selectedPrice.value);
    }

    return 0;
  };

  // 计算最终价格
  const calculateFinalPrice = (): number => {
    if (!selectedPrice) return 0;
    const discount = calculateDiscount();
    return selectedPrice.value - discount;
  };

  // 处理优惠券应用
  const handleCouponApply = (couponInfo: CouponInnfo) => {
    setCouponInfo(couponInfo);
    setCouponStatus('valid');
    setShowCouponModal(false);
  };

  // 处理优惠券移除
  const handleRemoveCoupon = () => {
    setCouponInfo(null);
    setCouponStatus('');
  };

  // 切换优惠券模态框
  const toggleCouponModal = () => {
    setShowCouponModal(!showCouponModal);
  };

  return (
    <div className="plan-order-summary-sticky">
      <div className="mg-b-20 pa-b-20 border-bottom">
        <h6 className="text-dark fw-bold mg-b-20">{selectedPlan.name}</h6>
        <div className="d-flex justify-content-between mg-b-12">
          <span className="text-muted f-fw-500">{t('order.planType')}:</span>
          <span className="text-dark f-fw-600">{selectedPrice.name}</span>
        </div>
        <div className="d-flex justify-content-between mg-b-12">
          <span className="text-muted f-fw-500">{t('order.trafficQuota')}:</span>
          <span className="text-primary f-fw-700">{selectedPlan.transfer_enable}GB</span>
        </div>
        {selectedPrice.tip && (
          <div className="mg-t-16">
            <div className="rounded-3 pa-16 border-start border-3 border-info position-relative overflow-hidden">
              <div className="plan-tip-bg" />
              <span className="text-info f-fw-600 position-relative">
                <i className="ph-duotone ph-info me-2"></i>
                {selectedPrice.tip}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 优惠券区域 - 简化版本 */}
      <div className="mg-t-20 mg-b-20 pa-b-20 border-bottom">
        <div className="d-flex align-items-center justify-content-between mg-b-15">
          <h6 className="text-dark fw-bold mb-0">{t('order.coupon')}</h6>
          {couponStatus !== 'valid' && (
            <Button color="primary" outline className="btn-sm" onClick={toggleCouponModal}>
              <i className="ph-duotone ph-plus me-1"></i>
              {t('order.useCoupon')}
            </Button>
          )}
        </div>

        {couponStatus === 'valid' && (
          <div className="coupon-applied txt-bg-success b-1-success rounded-3 pa-15 mg-b-10 box-shadow-12">
            <div className="d-flex align-items-center justify-content-between">
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mg-b-8">
                  <div className="d-flex align-items-center justify-content-center w-20 h-20 bg-success rounded-circle me-2">
                    <i className="ph-duotone ph-check text-white"></i>
                  </div>
                  <span className="text-dark fw-bold">{couponInfo?.name}</span>
                </div>
                <div className="text-dark fw-medium mg-s-32">{couponInfo?.description}</div>
              </div>
              <Button
                color="secondary"
                outline
                size="sm"
                className="pa-8 pe-10 ps-10 b-r-10 d-flex align-items-center justify-content-center"
                onClick={handleRemoveCoupon}
                title={t('coupon.actions.removeCoupon')}
              >
                <i className="ph-duotone ph-x"></i>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 价格明细 */}
      <div className="price-breakdown mg-t-20 mg-b-20">
        {couponStatus === 'valid' && calculateDiscount() > 0 ? (
          // 使用优惠券时的详细明细
          <>
            <div className="d-flex justify-content-between mg-b-8">
              <span className="text-muted fw-medium text-dark">{t('order.originalPrice')}:</span>
              <span className="text-dark fw-bold">{formatCurrency(selectedPrice.value)}</span>
            </div>

            <div className="d-flex justify-content-between mg-b-8">
              <span className="text-success fw-medium">{t('order.discount')}:</span>
              <span className="text-success fw-bold">-{formatCurrency(calculateDiscount())}</span>
            </div>

            <div className="border-top pa-t-10 ">
              <div className="d-flex justify-content-between align-items-center">
                <span className="fw-bold text-primary">{t('order.finalAmount')}:</span>
                <span className="fw-bold text-primary">
                  {formatCurrency(calculateFinalPrice())}
                </span>
              </div>
            </div>
          </>
        ) : (
          // 没有优惠券时的简单显示
          <div className="d-flex justify-content-between align-items-center">
            <span className="fw-bold text-dark">{t('order.amount')}:</span>
            <span className="fw-bold text-primary">{formatCurrency(calculateFinalPrice())}</span>
          </div>
        )}
      </div>

      <Button
        color="primary"
        className="w-100 btn-lg"
        onClick={() => onSubmitOrder(couponInfo?.code)}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <i className="ph-duotone ph-spinner me-2"></i>
            {t('order.processing')}
          </>
        ) : (
          <>
            <i className="ph-duotone ph-shopping-cart me-2"></i>
            {t('order.placeOrder')}
          </>
        )}
      </Button>

      <div className="text-center mg-t-15">
        <small className="text-muted fw-medium">
          <i className="ph-duotone ph-shield-check me-1"></i>
          {t('order.orderNote')}
        </small>
      </div>

      {/* 优惠券模态框 - 内部子组件 */}
      <CouponModal
        isOpen={showCouponModal}
        toggle={toggleCouponModal}
        onCouponApply={handleCouponApply}
        planId={selectedPlan.id}
        priceId={selectedPrice.id}
      />
    </div>
  );
};

export default OrderDetail;
