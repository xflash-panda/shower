import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatAmount, validateDecimalPlaces } from '@/helpers/currency';

interface PromoTransferModalProps {
  isOpen: boolean;
  toggle: () => void;
  promoBalance: number;
  onTransfer: (amount: number) => Promise<void>;
  isLoading?: boolean;
  minBalanceRequired?: number;
}

const PromoTransferModal: React.FC<PromoTransferModalProps> = ({
  isOpen,
  toggle,
  promoBalance,
  onTransfer,
  isLoading = false,
  minBalanceRequired = 0,
}) => {
  const { t } = useTranslation('wallet');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // 检查余额是否满足最低要求（分单位）
  const minBalanceRequiredInCents = minBalanceRequired * 100;
  const isBalanceInsufficient =
    minBalanceRequiredInCents > 0 && promoBalance < minBalanceRequiredInCents;

  // 表单验证函数
  const validateForm = (): boolean => {
    if (!amount.trim()) {
      setError(t('promoTransferModal.validation.amountRequired'));
      return false;
    }

    // 检查小数位数
    if (!validateDecimalPlaces(amount)) {
      setError(t('promoTransferModal.validation.amountInvalid'));
      return false;
    }

    const transferAmount = formatAmount(amount);

    if (transferAmount <= 0) {
      setError(t('promoTransferModal.validation.amountValid'));
      return false;
    }

    if (transferAmount > promoBalance / 100) {
      setError(t('promoTransferModal.validation.amountExceeded'));
      return false;
    }

    setError('');
    return true;
  };

  // 单个字段验证
  const validateField = (value: string): void => {
    if (!value.trim()) {
      setError(t('promoTransferModal.validation.amountRequired'));
      return;
    }

    // 检查小数位数
    if (!validateDecimalPlaces(value)) {
      setError(t('promoTransferModal.validation.amountInvalid'));
      return;
    }

    const transferAmount = formatAmount(value);

    if (transferAmount <= 0) {
      setError(t('promoTransferModal.validation.amountValid'));
    } else if (transferAmount > promoBalance / 100) {
      setError(t('promoTransferModal.validation.amountExceeded'));
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

    const transferAmount = formatAmount(amount);

    if (transferAmount <= 0) {
      return false;
    }

    if (transferAmount > promoBalance / 100) {
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

    const transferAmount = formatAmount(amount);
    await onTransfer(transferAmount * 100);
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
        <span className="f-w-600">{t('promoTransferModal.title')}</span>
      </ModalHeader>
      <ModalBody>
        {isBalanceInsufficient ? (
          <div className="d-flex align-items-center pa-20">
            <i className="ph-duotone ph-warning-circle text-danger me-2 fs-4"></i>
            <div>
              <h6 className="f-w-600 mb-1">
                {t('promoTransferModal.validation.balanceInsufficient')}
              </h6>
              <small className="text-muted">
                {t('promoTransferModal.validation.balanceInsufficientDesc', {
                  minBalance: formatCurrency(minBalanceRequiredInCents),
                })}
              </small>
            </div>
          </div>
        ) : (
          <form className="app-form px-2 py-1">
            <div className="mb-4 mb-3">
              <Label htmlFor="currentBalance" className="form-label f-w-600">
                {t('promoTransferModal.labels.currentBalance')}
              </Label>
              <Input
                id="currentBalance"
                value={formatCurrency(promoBalance)}
                disabled
                bsSize="lg"
                className="form-control-lg shadow-sm rounded-3 form-control f-w-500"
              />
            </div>
            <div className="mb-4 mb-3">
              <Label htmlFor="promoAmount" className="form-label f-w-600">
                {t('promoTransferModal.labels.transferAmount')}
                <span className="text-danger ms-1">*</span>
              </Label>
              <Input
                id="promoAmount"
                type="text"
                placeholder={t('promoTransferModal.placeholders.transferAmount', {
                  maxAmount: formatCurrency(promoBalance),
                })}
                value={amount}
                onChange={e => {
                  const value = e.target.value;

                  // 处理输入验证，允许输入但会显示错误提示
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
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          outline
          onClick={handleClose}
          className="f-w-600"
          disabled={isLoading}
        >
          {t('promoTransferModal.buttons.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleSubmit().catch(console.error);
          }}
          className="f-w-600"
          disabled={isLoading || isBalanceInsufficient || !isFormValid()}
        >
          {isLoading
            ? t('promoTransferModal.buttons.transferring')
            : t('promoTransferModal.buttons.transfer')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default PromoTransferModal;
