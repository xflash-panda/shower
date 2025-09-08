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

// 工单相关类型定义
interface TicketFormData {
  title: string;
  content: string;
  priority: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  priority?: string;
}

interface TicketCreateModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSave: (newTicket: API_V1.User.TicketSaveParams) => Promise<void>;
  isSubmitting?: boolean;
}

const TicketCreateModal = ({
  isOpen,
  toggle,
  onSave,
  isSubmitting = false,
}: TicketCreateModalProps) => {
  const { t } = useTranslation('ticket');
  const [ticket, setTicket] = useState<TicketFormData>({
    title: '',
    content: '',
    priority: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // 表单验证函数
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证主题
    if (!ticket.title.trim()) {
      newErrors.title = t('create.validation.titleRequired');
    } else if (ticket.title.trim().length > 20) {
      newErrors.title = t('create.validation.titleTooLong100');
    }

    // 验证优先级
    if (!ticket.priority) {
      newErrors.priority = t('create.validation.priorityRequired');
    }

    // 验证内容
    if (!ticket.content.trim()) {
      newErrors.content = t('create.validation.contentRequired');
    } else if (ticket.content.trim().length > 2000) {
      newErrors.content = t('create.validation.contentTooLong');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 单个字段验证
  const validateField = (fieldName: keyof TicketFormData, value: string): void => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = t('create.validation.titleRequired');
        } else if (value.trim().length > 100) {
          newErrors.title = t('create.validation.titleTooLong100');
        } else {
          delete newErrors.title;
        }
        break;

      case 'priority':
        if (!value) {
          newErrors.priority = t('create.validation.priorityRequired');
        } else {
          delete newErrors.priority;
        }
        break;

      case 'content':
        if (!value.trim()) {
          newErrors.content = t('create.validation.contentRequired');
        } else if (value.trim().length > 2000) {
          newErrors.content = t('create.validation.contentTooLong');
        } else {
          delete newErrors.content;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleSaveTicket = async () => {
    // 表单验证
    if (!validateForm()) {
      return;
    }

    try {
      const newTicket: API_V1.User.TicketSaveParams = {
        subject: ticket.title,
        level: parseInt(ticket.priority) || 0,
        message: ticket.content,
      };

      await onSave(newTicket);
      handleClose();
    } catch (error) {
      console.error('Failed to save ticket:', error);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return; // 阻止在提交过程中关闭模态框
    }

    // 重置表单
    setTicket({
      title: '',
      content: '',
      priority: '',
    });
    setErrors({});
    toggle();
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={isSubmitting ? undefined : toggle}
      backdrop="static"
      keyboard={false}
      container=".app-wrapper"
      centered
    >
      <ModalHeader toggle={handleClose}>{t('create.modal.title')}</ModalHeader>
      <ModalBody>
        <Form className="app-form px-2 py-1">
          <FormGroup className="mb-4">
            <Label for="ticketTitle" className="form-label fw-semibold">
              {t('create.form.title')} <span className="text-danger">*</span>
            </Label>
            <Input
              type="text"
              id="ticketTitle"
              className={`form-control-lg shadow-sm rounded-3 ${errors.title ? 'is-invalid' : ''}`}
              value={ticket.title}
              onChange={e => {
                const value = e.target.value;
                setTicket({ ...ticket, title: value });
                validateField('title', value);
              }}
              placeholder={t('create.form.titlePlaceholder')}
              disabled={isSubmitting}
            />
            {errors.title && (
              <div className="d-flex align-items-center mt-2">
                <i className="ph-duotone ph-warning-circle text-danger me-2"></i>
                <small className="text-danger fw-medium mb-0">{errors.title}</small>
              </div>
            )}
          </FormGroup>
          <FormGroup className="mb-4">
            <Label for="ticketPriority" className="form-label fw-semibold">
              {t('create.form.priority')} <span className="text-danger">*</span>
            </Label>
            <Input
              type="select"
              id="ticketPriority"
              className={`form-control-lg shadow-sm rounded-3 ${errors.priority ? 'is-invalid' : ''}`}
              value={ticket.priority}
              onChange={e => {
                const value = e.target.value;
                setTicket({ ...ticket, priority: value });
                validateField('priority', value);
              }}
              disabled={isSubmitting}
            >
              <option value="">{t('create.form.priorityPlaceholder')}</option>
              <option value="0">{t('create.form.priorityLow')}</option>
              <option value="1">{t('create.form.priorityMedium')}</option>
              <option value="2">{t('create.form.priorityHigh')}</option>
            </Input>
            {errors.priority && (
              <div className="d-flex align-items-center mt-2">
                <i className="ph-duotone ph-warning-circle text-danger me-2"></i>
                <small className="text-danger fw-medium mb-0">{errors.priority}</small>
              </div>
            )}
          </FormGroup>
          <FormGroup className="mb-4">
            <Label for="ticketContent" className="form-label fw-semibold">
              {t('create.form.content')} <span className="text-danger">*</span>
            </Label>
            <Input
              type="textarea"
              id="ticketContent"
              className={`form-control shadow-sm rounded-3 ${errors.content ? 'is-invalid' : ''}`}
              value={ticket.content}
              onChange={e => {
                const value = e.target.value;
                setTicket({ ...ticket, content: value });
                validateField('content', value);
              }}
              placeholder={t('create.form.contentPlaceholder')}
              rows="6"
              disabled={isSubmitting}
            />
            {errors.content && (
              <div className="d-flex align-items-center mt-2">
                <i className="ph-duotone ph-warning-circle text-danger me-2"></i>
                <small className="text-danger fw-medium mb-0">{errors.content}</small>
              </div>
            )}
            <div className="form-text">
              <small
                className={`${
                  ticket.content.length > 1800
                    ? 'text-danger'
                    : ticket.content.length > 1500
                      ? 'text-warning'
                      : 'text-muted'
                }`}
              >
                {t('create.form.characterCount', { current: ticket.content.length })}
              </small>
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="secondary"
          onClick={handleClose}
          className="btn-lg rounded-pill px-4"
          disabled={isSubmitting}
        >
          {t('close', { ns: 'common' })}
        </Button>
        <Button
          color="primary"
          onClick={() => {
            handleSaveTicket().catch(console.error);
          }}
          className="btn-lg rounded-pill px-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {t('create.form.submitting')}
            </>
          ) : (
            t('create.form.submit')
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default TicketCreateModal;
