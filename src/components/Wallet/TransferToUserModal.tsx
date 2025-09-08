import { useState, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatAmount, validateDecimalPlaces } from '@helpers/currency';

interface TransferToUserModalProps {
  isOpen: boolean;
  toggle: () => void;
  balance: number;
  currentUserEmail?: string;
  onTransfer: (toUser: string, amount: number) => Promise<void>;
  isLoading?: boolean;
}

// 邮箱验证正则
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TransferToUserModal: React.FC<TransferToUserModalProps> = ({
  isOpen,
  toggle,
  balance,
  currentUserEmail,
  onTransfer,
  isLoading = false,
}) => {
  const { t } = useTranslation('wallet');
  const [toUser, setToUser] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<{
    toUser?: string;
    amount?: string;
  }>({});

  // 验证函数
  const validateForm = () => {
    const newErrors: { toUser?: string; amount?: string } = {};

    // 验证接收方账号（必须是邮箱）
    const userAccount = toUser.trim();
    if (!userAccount) {
      newErrors.toUser = t('transferModal.validation.emailRequired');
    } else if (!EMAIL_REGEX.test(userAccount)) {
      newErrors.toUser = t('transferModal.validation.emailInvalid');
    } else {
      // 检查是否是自己的账号
      const isEmailMatch = Boolean(currentUserEmail && userAccount === currentUserEmail);

      if (isEmailMatch) {
        newErrors.toUser = t('transferModal.validation.cannotTransferToSelf');
      }
    }

    // 验证转账金额
    if (!amount.trim()) {
      newErrors.amount = t('transferModal.validation.amountRequired');
    } else {
      // 检查小数位数
      if (!validateDecimalPlaces(amount)) {
        newErrors.amount = t('transferModal.validation.amountInvalid');
      }

      if (!newErrors.amount) {
        const transferAmount = formatAmount(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
          newErrors.amount = t('transferModal.validation.amountInvalid');
        } else if (transferAmount * 100 > balance) {
          newErrors.amount = t('transferModal.validation.insufficientBalance');
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 检查是否有输入内容（用于按钮启用状态）
  const hasInputContent = useMemo(() => {
    return toUser.trim().length > 0 && amount.trim().length > 0;
  }, [toUser, amount]);

  const handleClose = () => {
    setToUser('');
    setAmount('');
    setErrors({});
    toggle();
  };

  const handleSubmit = async () => {
    // 先进行表单验证
    if (!validateForm()) {
      return;
    }

    const userAccount = toUser.trim();
    // 使用格式化后的金额，确保只有2位小数
    const transferAmount = formatAmount(amount);

    await onTransfer(userAccount, transferAmount * 100);
    handleClose();
  };

  // 处理输入变化时清除对应字段的错误
  const handleToUserChange = (value: string) => {
    setToUser(value);
    if (errors.toUser) {
      setErrors(prev => ({ ...prev, toUser: undefined }));
    }
  };

  const handleAmountChange = (value: string) => {
    // 处理输入验证，允许输入但会显示错误提示
    if (value === '') {
      setAmount('');
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: undefined }));
      }
      return;
    }

    // 更宽松的数字验证规则，允许输入但会显示错误提示
    // 1. 不允许前导零（除了0.xx格式）
    // 2. 只允许一个小数点
    // 3. 允许任意位数的小数，但会在验证时提示错误
    const validNumberPattern = /^(?:0|[1-9]\d*)(?:\.\d*)?$/;

    if (validNumberPattern.test(value)) {
      setAmount(value);
      // 清除之前的错误，重新验证
      if (errors.amount) {
        setErrors(prev => ({ ...prev, amount: undefined }));
      }
      // 立即验证新输入的值
      validateAmountField(value);
    }
  };

  // 单独的金额字段验证函数
  const validateAmountField = (value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, amount: t('transferModal.validation.amountRequired') }));
      return;
    }

    // 检查小数位数
    if (!validateDecimalPlaces(value)) {
      setErrors(prev => ({ ...prev, amount: t('transferModal.validation.amountInvalid') }));
      return;
    }

    const transferAmount = formatAmount(value);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      setErrors(prev => ({ ...prev, amount: t('transferModal.validation.amountInvalid') }));
    } else if (transferAmount * 100 > balance) {
      setErrors(prev => ({ ...prev, amount: t('transferModal.validation.insufficientBalance') }));
    } else {
      setErrors(prev => ({ ...prev, amount: undefined }));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} container=".app-wrapper" centered>
      <ModalHeader toggle={handleClose}>
        <span className="f-w-600">{t('transferModal.title')}</span>
      </ModalHeader>
      <ModalBody>
        <form className="app-form px-2 py-1">
          <div className="mb-4 mb-3">
            <Label htmlFor="currentBalance" className="form-label f-w-600">
              {t('balance.account')}
            </Label>
            <Input
              id="currentBalance"
              value={formatCurrency(balance)}
              disabled
              bsSize="lg"
              className="form-control-lg shadow-sm rounded-3 form-control f-w-500"
            />
          </div>
          <div className="mb-4 mb-3">
            <Label htmlFor="toUserAccount" className="form-label f-w-600">
              {t('transferModal.labels.recipientEmail')}
              <span className="text-danger ms-1">*</span>
            </Label>
            <Input
              id="toUserAccount"
              placeholder={t('transferModal.placeholders.recipientEmail')}
              value={toUser}
              onChange={e => handleToUserChange(e.target.value)}
              invalid={!!errors.toUser}
              bsSize="lg"
              className="form-control-lg shadow-sm rounded-3 form-control f-w-500"
              disabled={isLoading}
            />
            {errors.toUser && (
              <div className="d-flex align-items-center mt-2">
                <i className="ph-duotone ph-warning-circle text-danger me-2"></i>
                <small className="text-danger fw-medium mb-0">{errors.toUser}</small>
              </div>
            )}
          </div>
          <div className="mb-4 mb-3">
            <Label htmlFor="toUserAmount" className="form-label f-w-600">
              {t('transferModal.labels.transferAmount')}
              <span className="text-danger ms-1">*</span>
            </Label>
            <Input
              id="toUserAmount"
              type="text"
              placeholder={t('transferModal.placeholders.transferAmount')}
              value={amount}
              onChange={e => handleAmountChange(e.target.value)}
              invalid={!!errors.amount}
              bsSize="lg"
              className="form-control-lg shadow-sm rounded-3 form-control f-w-500"
              disabled={isLoading}
            />
            {errors.amount && (
              <div className="d-flex align-items-center mt-2">
                <i className="ph-duotone ph-warning-circle text-danger  me-2"></i>
                <small className="text-danger fw-medium mb-0">{errors.amount}</small>
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
          {t('transferModal.buttons.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() => void handleSubmit()}
          className="f-w-600"
          disabled={isLoading || !hasInputContent}
        >
          {isLoading
            ? t('transferModal.buttons.transferring')
            : t('transferModal.buttons.transfer')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TransferToUserModal;
