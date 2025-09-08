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
  Spinner,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface TicketReplyModalProps {
  isOpen: boolean;
  onToggle: () => void;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
}

const TicketReplyModal: React.FC<TicketReplyModalProps> = ({
  isOpen,
  onToggle,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation('ticket');
  const [replyContent, setReplyContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (): Promise<void> => {
    // 清除之前的错误信息
    setError('');

    // 验证回复内容
    if (!replyContent.trim()) {
      setError(t('reply.validation.contentRequired'));
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(replyContent.trim());

      // 成功后清空内容并关闭模态框
      setReplyContent('');
      setError('');
    } catch (err) {
      // 处理错误
      const errorMessage = err instanceof Error ? err.message : t('error.replyFailed');
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    if (isSubmitting) {
      return; // 提交中不允许取消
    }

    // 清空内容和错误信息
    setReplyContent('');
    setError('');
    onCancel();
  };

  const handleToggle = (): void => {
    if (isSubmitting) {
      return; // 提交中不允许关闭
    }

    // 清空内容和错误信息
    setReplyContent('');
    setError('');
    onToggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleToggle} backdrop="static" keyboard={false} centered>
      <ModalHeader toggle={handleToggle}>{t('reply.modal.title')}</ModalHeader>
      <ModalBody>
        <Form className="app-form px-2 py-1">
          <FormGroup className="mb-4">
            <Label for="replyContent" className="form-label fw-semibold">
              {t('reply.form.content')} <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              id="replyContent"
              className="form-control shadow-sm rounded-3"
              value={replyContent}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplyContent(e.target.value)}
              placeholder={t('reply.form.contentPlaceholder')}
              rows="6"
              disabled={isSubmitting}
            />
            {error && (
              <div className="text-danger small mt-2">
                <i className="ti ti-alert-circle me-1"></i>
                {error}
              </div>
            )}
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={handleCancel}
          className="btn-lg rounded-pill px-4"
          disabled={isSubmitting}
        >
          {t('reply.form.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() => void handleSubmit()}
          className="btn-lg rounded-pill px-4"
          disabled={isSubmitting || !replyContent.trim()}
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="me-2" />
              {t('reply.form.submitting')}
            </>
          ) : (
            t('reply.form.submit')
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TicketReplyModal;
