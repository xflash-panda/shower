import { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@helpers/currency';

interface WithdrawModalProps {
  isOpen: boolean;
  toggle: () => void;
  promoBalance: number;
  availableWithdrawMethods?: string[];
  commissionWithdrawLimit?: number;
  onWithdraw: (method: string, account: string) => Promise<void>;
  isLoading?: boolean;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  toggle,
  promoBalance,
  availableWithdrawMethods,
  commissionWithdrawLimit,
  onWithdraw,
  isLoading = false,
}) => {
  const { t } = useTranslation('wallet');
  const [withdrawMethod, setWithdrawMethod] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setWithdrawMethod('');
    setWithdrawAccount('');
    setError('');
    toggle();
  };

  const handleSubmit = async () => {
    if (!withdrawMethod) {
      setError(t('withdrawModal.validation.methodRequired'));
      return;
    }

    if (!withdrawAccount.trim()) {
      setError(t('withdrawModal.validation.accountRequired'));
      return;
    }

    await onWithdraw(withdrawMethod, withdrawAccount.trim());
    handleClose();
  };

  const withdrawLimit = commissionWithdrawLimit ?? 200;
  const canWithdraw = promoBalance / 100 >= withdrawLimit;

  return (
    <Modal isOpen={isOpen} toggle={handleClose} container=".app-wrapper" centered>
      <ModalHeader toggle={handleClose}>
        <span className="f-w-600">{t('withdrawModal.title')}</span>
      </ModalHeader>
      <ModalBody>
        <form className="app-form px-2 py-1">
          <div className="mb-4 mb-3">
            <Label htmlFor="currentPromoBalance" className="form-label f-w-600">
              {t('balance.commission')}
            </Label>
            <Input
              id="currentPromoBalance"
              value={formatCurrency(promoBalance)}
              disabled
              bsSize="lg"
              className="form-control-lg shadow-sm rounded-3 form-control f-w-500"
            />
            {!canWithdraw && (
              <div className="d-flex align-items-center mt-2">
                <i className="ph-duotone ph-warning-circle text-danger me-2"></i>
                <small className="text-danger fw-medium mb-0">
                  {t('withdrawModal.validation.minimumAmount', {
                    amount: formatCurrency(withdrawLimit * 100),
                  })}
                </small>
              </div>
            )}
          </div>

          <div className="mb-4 mb-3">
            <Label htmlFor="withdrawMethod" className="form-label f-w-600">
              {t('withdrawModal.labels.withdrawMethod')}
              <span className="text-danger ms-1">*</span>
            </Label>
            <Input
              id="withdrawMethod"
              type="select"
              value={withdrawMethod}
              onChange={e => setWithdrawMethod(e.target.value)}
              invalid={!!error && error.includes('method')}
              bsSize="lg"
              className="form-control-lg shadow-sm rounded-3 form-control f-w-500"
              disabled={isLoading}
            >
              <option value="">{t('withdrawModal.validation.methodRequired')}</option>
              {availableWithdrawMethods?.map(method => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </Input>
          </div>
          <div className="mb-4 mb-3">
            <Label htmlFor="withdrawAccount" className="form-label f-w-600">
              {t('withdrawModal.labels.withdrawAccount')}
              <span className="text-danger ms-1">*</span>
            </Label>
            <Input
              id="withdrawAccount"
              placeholder={t('withdrawModal.placeholders.withdrawAccount')}
              value={withdrawAccount}
              onChange={e => setWithdrawAccount(e.target.value)}
              invalid={!!error && !error.includes('method')}
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
          {t('withdrawModal.buttons.cancel')}
        </Button>
        <Button
          color="dark"
          onClick={() => void handleSubmit()}
          disabled={!canWithdraw || isLoading || !withdrawMethod || !withdrawAccount.trim()}
          className="f-w-600"
        >
          {isLoading ? t('withdrawModal.buttons.withdrawing') : t('withdrawModal.buttons.withdraw')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default WithdrawModal;
