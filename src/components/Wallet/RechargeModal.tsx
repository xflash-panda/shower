import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatAmount, validateDecimalPlaces } from '@/helpers/currency';

interface RechargeModalProps {
  isOpen: boolean;
  toggle: () => void;
  onRecharge: (amount: number) => Promise<void>;
  isLoading?: boolean;
  minAmount?: number;
  maxAmount?: number;
  // 充值奖励相关配置
  rechargeRebateEnable?: number;
  rechargeRebateMode?: 'normal' | 'full';
  rechargeRebateNormalMinAmount?: number;
  rechargeRebateNormalRate?: number;
  rechargeRebateFullThresholdAmount?: number;
  rechargeRebateFullValue?: number;
}

const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  toggle,
  onRecharge,
  isLoading = false,
  minAmount = 1,
  maxAmount = 1000,
  // 充值奖励相关配置
  rechargeRebateEnable = 0,
  rechargeRebateMode = 'normal',
  rechargeRebateNormalMinAmount = 0,
  rechargeRebateNormalRate = 0,
  rechargeRebateFullThresholdAmount = 0,
  rechargeRebateFullValue = 0,
}) => {
  const { t } = useTranslation('wallet');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // 表单验证函数
  const validateForm = (): boolean => {
    if (!amount.trim()) {
      setError(t('rechargeModal.validation.amountRequired'));
      return false;
    }

    // 检查小数位数
    if (!validateDecimalPlaces(amount)) {
      setError(t('rechargeModal.validation.amountInvalid'));
      return false;
    }

    const rechargeAmount = formatAmount(amount);

    if (rechargeAmount <= 0) {
      setError(t('rechargeModal.validation.amountValid'));
      return false;
    }

    if (rechargeAmount < minAmount) {
      setError(t('rechargeModal.validation.amountMin', { minAmount }));
      return false;
    }

    if (rechargeAmount > maxAmount) {
      setError(t('rechargeModal.validation.amountMax', { maxAmount }));
      return false;
    }

    setError('');
    return true;
  };

  // 单个字段验证
  const validateField = (value: string): void => {
    if (!value.trim()) {
      setError(t('rechargeModal.validation.amountRequired'));
      return;
    }

    // 检查小数位数
    if (!validateDecimalPlaces(value)) {
      setError(t('rechargeModal.validation.amountInvalid'));
      return;
    }

    const rechargeAmount = formatAmount(value);

    if (rechargeAmount <= 0) {
      setError(t('rechargeModal.validation.amountValid'));
    } else if (rechargeAmount < minAmount) {
      setError(t('rechargeModal.validation.amountMin', { minAmount }));
    } else if (rechargeAmount > maxAmount) {
      setError(t('rechargeModal.validation.amountMax', { maxAmount }));
    } else {
      setError('');
    }
  };

  // 检查表单是否有效（用于按钮disabled状态）
  const isFormValid = (): boolean => {
    if (!amount.trim()) {
      return false;
    }

    // 检查小数位数
    if (!validateDecimalPlaces(amount)) {
      return false;
    }

    const rechargeAmount = formatAmount(amount);

    if (rechargeAmount <= 0) {
      return false;
    }

    if (rechargeAmount < minAmount || rechargeAmount > maxAmount) {
      return false;
    }

    return true;
  };

  const handleClose = () => {
    if (isLoading) {
      return; // 阻止在提交过程中关闭模态框
    }

    // 重置表单
    setAmount('');
    setError('');
    toggle();
  };

  const handleSubmit = async () => {
    // 表单验证
    if (!validateForm()) {
      return;
    }

    // 使用格式化后的金额，确保只有2位小数

    const rechargeAmount = formatAmount(amount);
    await onRecharge(rechargeAmount * 100);
    handleClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={isLoading ? undefined : toggle}
      backdrop="static"
      keyboard={false}
      container=".app-wrapper"
      centered
    >
      <ModalHeader toggle={handleClose}>
        <span className="f-w-600">{t('rechargeModal.title')}</span>
      </ModalHeader>
      <ModalBody>
        {/* 充值奖励信息显示 - 移到Form外面，使用alert-outline样式 */}
        {rechargeRebateEnable === 1 && (
          <div className="alert alert-primary mb-4" role="alert">
            {rechargeRebateMode === 'normal' ? (
              <span>
                {t('rechargeModal.promotion.normal', {
                  minAmount: rechargeRebateNormalMinAmount,
                  rate: rechargeRebateNormalRate,
                })}
              </span>
            ) : (
              <>
                <span>
                  {t('rechargeModal.promotion.full', {
                    threshold: rechargeRebateFullThresholdAmount,
                    value: rechargeRebateFullValue,
                  })}
                </span>
              </>
            )}
          </div>
        )}

        <form className="app-form px-2 py-1">
          <div className="mb-4 mb-3">
            <Label htmlFor="rechargeAmount" className="form-label f-w-600">
              {t('rechargeModal.labels.rechargeAmount')}
              <span className="text-danger ms-1">*</span>
            </Label>
            <Input
              id="rechargeAmount"
              type="text"
              placeholder={t('rechargeModal.placeholders.rechargeAmount', { minAmount, maxAmount })}
              value={amount}
              onChange={e => {
                const value = e.target.value;

                // 处理输入验证
                if (value === '') {
                  setAmount('');
                  validateField('');
                  return;
                }

                // 更宽松的数字验证规则，允许输入但会显示错误提示
                // 1. 不允许前导零（除了0.xx格式）
                // 2. 只允许一个小数点
                // 3. 允许任意位数的小数，但会在验证时提示错误
                const validNumberPattern = /^(?:0|[1-9]\d*)(?:\.\d*)?$/;

                if (validNumberPattern.test(value)) {
                  setAmount(value);
                  validateField(value);
                }
              }}
              invalid={!!error}
              bsSize="lg"
              className="form-control-lg shadow-sm rounded-3 form-control f-w-500"
              disabled={isLoading}
            />
            {error && (
              <div className="d-flex align-items-center mt-2">
                <i className="ph-duotone ph-warning-circle text-danger me-2"></i>
                <small className="text-danger fw-medium mb-0">{error}</small>
              </div>
            )}
          </div>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          outline
          onClick={handleClose}
          className="f-w-600"
          disabled={isLoading}
        >
          {t('rechargeModal.buttons.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleSubmit().catch(console.error);
          }}
          className="f-w-600"
          disabled={isLoading || !isFormValid()}
        >
          {isLoading ? t('rechargeModal.buttons.recharging') : t('rechargeModal.buttons.recharge')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default RechargeModal;
