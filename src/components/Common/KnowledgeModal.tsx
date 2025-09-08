import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Badge, Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import MarkdownRenderer from '@components/Common/MarkdownRenderer';
import { formatTime, TIME_FORMATS } from '@helpers/time';
import { useKnowledge } from '@/hooks/useUser';

interface KnowledgeModalProps {
  isOpen: boolean;
  toggle: () => void;
  /** Knowledge ID or slug for fetching data */
  knowledgeId?: number;
  knowledgeSlug?: string;
  title?: string;
}

const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  isOpen,
  toggle,
  knowledgeId,
  knowledgeSlug,
  title,
}) => {
  const { t } = useTranslation('common');
  // 构建参数对象
  const params = React.useMemo(() => {
    if (knowledgeId) {
      return { id: knowledgeId };
    } else if (knowledgeSlug) {
      return { slug: knowledgeSlug };
    }
    return null;
  }, [knowledgeId, knowledgeSlug]);

  // 使用 useKnowledge hook 获取数据
  const {
    knowledge: data,
    isLoading,
    isError,
    error,
  } = useKnowledge(
    params as { id: number; slug?: never } | { slug: string; id?: never },
    isOpen && !!params, // 只有在 modal 打开且有参数时才启用
  );
  // 处理键盘事件
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        toggle();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyPress);
      const currentOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyPress);
        document.body.style.overflow = currentOverflow || '';
      };
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen, toggle]);

  // 组件卸载时恢复body overflow
  React.useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      fullscreen
      className="grid-modal"
      container=".app-wrapper"
    >
      <ModalHeader toggle={toggle} className="grid-modal-header border-0 pa-24">
        <div className="d-flex align-items-center">
          <div className="mg-e-20">
            <div className="grid-modal-icon d-flex align-items-center justify-content-center b-r-15 pa-15 bg-primary">
              <i className="ph ph-book-open text-white f-s-20"></i>
            </div>
          </div>
          <div className="flex-grow-1">
            <div className="mg-b-8">
              <h4 className="mg-b-0 f-fw-600 text-dark">{title}</h4>
            </div>
            {data && (
              <div className="d-flex align-items-center flex-wrap gap-2">
                <div className="d-flex align-items-center mg-e-15">
                  <i className="ph ph-calendar-blank text-muted mg-e-5"></i>
                  <small className="text-muted">
                    {data.updated_at && formatTime(data.updated_at, TIME_FORMATS.DATE)}
                  </small>
                </div>
                <Badge
                  color={data.free === 0 ? 'success' : 'warning'}
                  className="pa-6 b-r-6 f-fw-500"
                >
                  <i className={`ph ${data.free === 0 ? 'ph-check-circle' : 'ph-lock'} mg-e-3`}></i>
                  {data.free === 0
                    ? t('knowledgeModal.freeContent')
                    : t('knowledgeModal.premiumContent')}
                </Badge>
                <Badge className="grid-modal-category-badge pa-6 b-r-6 f-fw-500 bg-secondary text-white">
                  <i className="ph ph-folder mg-e-3"></i>
                  {data.category}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="pa-30">
        {isLoading && (
          <div
            className="d-flex flex-column align-items-center justify-content-center pa-40"
            style={{ minHeight: '60vh' }}
          >
            <div className="spinner-border text-primary mg-b-15" role="status">
              <span className="visually-hidden">{t('loading')}</span>
            </div>
            <p className="text-muted mg-b-0">{t('knowledgeModal.loading')}</p>
          </div>
        )}

        {isError && error && (
          <div
            className="d-flex flex-column align-items-center justify-content-center pa-40"
            style={{ minHeight: '60vh' }}
          >
            <i className="ph-duotone ph-warning-circle text-dark mg-b-15"></i>
            <h5 className="text-dark f-fw-400 mg-b-15">{t('knowledgeModal.loadFailed')}</h5>
            <p className="text-muted mg-b-20 text-center">
              {error?.message ?? t('knowledgeModal.loadError')}
            </p>
          </div>
        )}

        {!isLoading && !isError && data?.body && (
          <div className="grid-modal-content">
            {/* Content Grid Layout */}
            <Row>
              <Col xs={12}>
                <div className="content-section">
                  <MarkdownRenderer
                    content={data.body}
                    variant="knowledge"
                    className="grid-modal-markdown"
                  />
                </div>
              </Col>
            </Row>
          </div>
        )}

        {!isLoading && !isError && !data?.body && (
          <div
            className="d-flex flex-column align-items-center justify-content-center pa-40"
            style={{ minHeight: '60vh' }}
          >
            <i className="ph-duotone ph-file-text text-muted mg-b-15 f-s-48"></i>
            <h5 className="text-muted f-fw-400 mg-b-15">{t('knowledgeModal.noContent')}</h5>
            <p className="text-muted mg-b-0 text-center">{t('knowledgeModal.noContentMessage')}</p>
          </div>
        )}
      </ModalBody>

      <ModalFooter className="border-0 pa-20">
        <div className="d-flex justify-content-end w-100">
          <Button onClick={toggle} color="secondary" outline className="btn btn-sm">
            <i className="ph ph-x me-1"></i>
            {t('knowledgeModal.close')}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default KnowledgeModal;
