import { useNavigate } from 'react-router-dom';
import { Modal, ModalBody, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface SubscriptionRequiredModalProps {
  /** 是否显示Modal */
  isOpen: boolean;
  /** 关闭Modal的回调函数 */
  toggle: () => void;
  /** 文档标题 */
  documentTitle?: string;
}

const SubscriptionRequiredModal: React.FC<SubscriptionRequiredModalProps> = ({
  isOpen,
  toggle,
  documentTitle,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('knowledge');

  // 处理前往套餐页面
  const handleGoToPlan = () => {
    navigate('/plan');
    toggle();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      backdrop="static"
      keyboard={false}
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
          <i className="ti ti-crown text-warning f-s-80"></i>
        </div>

        <h5 className="mb-3 text-dark">{t('subscriptionRequired.title')}</h5>

        <p className="text-muted mb-4 px-3">
          {documentTitle
            ? t('subscriptionRequired.messageWithTitle', { title: documentTitle })
            : t('subscriptionRequired.message')}
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Button color="secondary" outline onClick={toggle} className="px-4">
            <i className="ti ti-x me-2"></i>
            {t('subscriptionRequired.cancel')}
          </Button>

          <Button color="primary" onClick={handleGoToPlan} className="px-4">
            <i className="ti ti-crown me-2"></i>
            {t('subscriptionRequired.goToPlan')}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SubscriptionRequiredModal;
