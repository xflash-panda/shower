import { Modal, ModalBody, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import type { UserSubscribeData } from '@helpers/user';

interface SubscriptionChangeConfirmModalProps {
  /** 是否显示Modal */
  isOpen: boolean;
  /** 关闭Modal的回调函数 */
  toggle: () => void;
  /** 当前用户数据 */
  userData?: UserSubscribeData | null;
  /** 新选择的套餐信息 */
  newPlan?: API_V1.User.PlanItem | null;
  /** 新选择的价格信息 */
  newPrice?: API_V1.User.PlanPriceItem | null;
  /** 确认变更的回调 */
  onConfirm?: () => void;
}

const SubscriptionChangeConfirmModal: React.FC<SubscriptionChangeConfirmModalProps> = ({
  isOpen,
  toggle,
  userData,
  newPlan,
  newPrice,
  onConfirm,
}) => {
  const { t } = useTranslation('plan');
  // 处理确认变更
  const handleConfirm = () => {
    onConfirm?.();
    toggle();
  };

  // 处理取消变更
  const handleCancel = () => {
    toggle();
  };

  // 如果没有当前订阅或新套餐信息，不显示Modal
  if (!userData?.analysis || !newPlan || !newPrice) {
    return null;
  }

  // 使用优化后的检查方法
  const isSubscriptionChange = userData.analysis.checkIsSubscriptionChange(newPlan.id);
  const isSubscriptionTypeChange = userData.analysis.checkIsSubscriptionTypeChange(newPrice.type);

  // 生成变更类型描述
  const getChangeTypeDescription = () => {
    if (isSubscriptionChange && isSubscriptionTypeChange) {
      return t('subscriptionChange.changeTypes.both');
    } else if (isSubscriptionChange) {
      return t('subscriptionChange.changeTypes.plan');
    } else {
      return t('subscriptionChange.changeTypes.type');
    }
  };

  // 生成订阅类型描述（暂时未使用）
  const _getSubscriptionTypeDescription = (isOneTime: boolean) => {
    return isOneTime
      ? t('subscriptionChange.subscriptionTypes.oneTime')
      : t('subscriptionChange.subscriptionTypes.recurring');
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      backdrop="static"
      container=".app-wrapper"
      size="md"
      centered
    >
      <ModalBody className="text-center py-4 position-relative">
        <button
          type="button"
          className="position-absolute top-0 end-0 mg-t-10 mg-e-10 border-0 bg-transparent pa-8 text-muted f-s-20 cursor-pointer"
          onClick={toggle}
          aria-label="Close"
        >
          <i className="ti ti-x"></i>
        </button>

        <div className="mb-4">
          <i className="ti ti-alert-triangle text-warning f-s-80"></i>
        </div>

        <h5 className="mb-3 text-dark">{t('subscriptionChange.title')}</h5>

        <p className="text-muted mb-4 px-3">
          {t('subscriptionChange.detected')}
          <strong className="text-danger"> {getChangeTypeDescription()} </strong>
          {t('subscriptionChange.warning')}
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Button color="secondary" outline onClick={handleCancel} className="px-4">
            <i className="ti ti-x me-2"></i>
            {t('subscriptionChange.actions.cancel')}
          </Button>

          <Button color="danger" onClick={handleConfirm} className="px-4">
            <i className="ti ti-check me-2"></i>
            {t('subscriptionChange.actions.confirm')}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SubscriptionChangeConfirmModal;
