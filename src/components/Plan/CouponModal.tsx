import { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import toast from '@helpers/toast';
import { couponCheck } from '@/api/v1/user';

// 优惠券类型
export interface CouponInnfo {
  type: string;
  value: number;
  name: string;
  description: string;
  code: string;
  minAmount?: number;
}

interface CouponModalProps {
  isOpen: boolean;
  toggle: () => void;
  onCouponApply: (couponInfo: CouponInnfo) => void;
  planId: number;
  priceId: string;
}

const CouponModal: React.FC<CouponModalProps> = ({
  isOpen,
  toggle,
  onCouponApply,
  planId,
  priceId,
}) => {
  const { t } = useTranslation('plan');

  // API响应数据适配器
  const adaptCouponData = (apiData: API_V1.User.Coupon, code: string): CouponInnfo => {
    return {
      type: apiData.type === 1 ? 'fixed' : 'percentage',
      value: apiData.value,
      name: apiData.name,
      description:
        apiData.type === 1
          ? `${t('coupon.discount.fixed')} ${apiData.value} ${t('coupon.discount.currency')}`
          : `${apiData.value}% ${t('coupon.discount.percentage')}`,
      code,
      minAmount: 0,
    };
  };
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponStatus, setCouponStatus] = useState<'' | 'validating' | 'invalid'>('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState<boolean>(false);
  const [lastFailedCode, setLastFailedCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 优惠券验证
  const validateCoupon = async (code: string): Promise<void> => {
    if (!code.trim()) {
      toast.error(t('coupon.modal.enterCode'));
      return;
    }

    setIsValidatingCoupon(true);
    setCouponStatus('validating');

    try {
      const response = await couponCheck({
        code: code.trim(),
        plan_id: planId,
        price_id: priceId,
      });

      if (response.data) {
        const adaptedCoupon = adaptCouponData(response.data, code.trim());
        onCouponApply(adaptedCoupon);
        toast.success(`${t('coupon.success')} ${adaptedCoupon.description}`);
        toggle(); // 直接关闭modal
      } else {
        setCouponStatus('invalid');
        setLastFailedCode(code.trim());
      }
    } catch (error) {
      setCouponStatus('invalid');
      setLastFailedCode(code.trim());
      const errorMsg = (error as Error)?.message ?? t('coupon.error.networkError');
      setErrorMessage(errorMsg);
      console.error('Coupon validation error:', error);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleClose = () => {
    toggle();
    // 窗口关闭时重置所有状态
    setCouponCode('');
    setCouponStatus('');
    setLastFailedCode('');
    setErrorMessage('');
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      container=".app-wrapper"
    >
      <ModalHeader toggle={handleClose}>{t('coupon.modal.title')}</ModalHeader>
      <ModalBody>
        <Form className="app-form px-2 py-1">
          <FormGroup className="mb-4">
            <Label for="couponCode" className="form-label fw-semibold">
              {t('coupon.modal.label')} <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              id="couponCode"
              className="form-control-lg shadow-sm rounded-3"
              placeholder={t('coupon.modal.placeholder')}
              value={couponCode}
              onChange={e => {
                setCouponCode(e.target.value);
                // 用户重新输入时清除错误状态
                if (couponStatus === 'invalid') {
                  setCouponStatus('');
                  setLastFailedCode('');
                  setErrorMessage('');
                }
              }}
              disabled={isValidatingCoupon}
              onKeyDown={e => {
                if (e.key === 'Enter' && couponCode.trim()) {
                  e.preventDefault();
                  void validateCoupon(couponCode);
                }
              }}
            />
          </FormGroup>

          {/* 验证结果提示 - 移除验证中状态，只保留成功和失败 */}
          {couponStatus === 'invalid' && (
            <div className="alert alert-danger d-flex align-items-center mb-4 rounded-3 shadow-sm">
              <i className="ph-duotone ph-x-circle me-2"></i>
              <span className="fw-medium">{errorMessage || t('coupon.modal.invalid')}</span>
            </div>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" outline className="rounded-pill" onClick={handleClose}>
          {t('coupon.modal.close')}
        </Button>
        <Button
          color="primary"
          onClick={() => void validateCoupon(couponCode)}
          disabled={
            !couponCode.trim() ||
            isValidatingCoupon ||
            (couponStatus === 'invalid' && couponCode.trim() === lastFailedCode)
          }
          className="btn-lg rounded-pill"
        >
          {isValidatingCoupon ? (
            <>
              <i className="ph-duotone ph-spinner me-1"></i>
              {t('coupon.modal.validating')}
            </>
          ) : (
            <>
              <i className="ph-duotone ph-shield-check me-1"></i>
              {t('coupon.modal.validate')}
            </>
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CouponModal;
