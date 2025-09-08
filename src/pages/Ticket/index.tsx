import { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import TicketCreateModal from '@components/Ticket/TicketCreateModal';
import TicketCloseConfirmModal from '@components/Ticket/TicketCloseConfirmModal';
import TicketTable from '@components/Ticket/TicketTable';
import { useTickets } from '@/hooks/useUser';
import { ticketClose, ticketSave } from '@/api/v1/user';
import toast from '@/helpers/toast';
import EmptyState from '@/components/Common/EmptyState';
import Loading from '@/components/Common/Loading';

const TicketPage = () => {
  const { t } = useTranslation('ticket');
  const { t: tCommon } = useTranslation('common');
  const [showModal, setShowModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [ticketToClose, setTicketToClose] = useState<API_V1.User.TicketItem | null>(null);

  // 使用 SWR 获取工单列表数据
  const { tickets, isLoading, mutate: mutateTickets } = useTickets();
  const total = tickets?.length ?? 0;

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveTicket = async (newTicket: API_V1.User.TicketSaveParams) => {
    setIsSaving(true);
    try {
      // 调用 ticketSave API
      await ticketSave(newTicket);

      // 成功后关闭模态框
      setShowModal(false);

      // 重新获取工单列表数据
      await mutateTickets();

      // 显示成功提示
      toast.success(t('success.created'));
    } catch (error) {
      console.error('Failed to create ticket:', error);
      toast.error(t('createError'));
    } finally {
      setIsSaving(false);
    }
  };

  // 打开关闭工单确认模态框
  const handleOpenCloseModal = (ticket: API_V1.User.TicketItem) => {
    setTicketToClose(ticket);
    setShowCloseModal(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setShowCloseModal(false);
    setTicketToClose(null);
  };

  // 处理关闭工单的API调用
  const handleCloseTicket = async (params: API_V1.User.TicketCloseParams): Promise<void> => {
    await ticketClose(params);
  };

  // 工单关闭成功后的回调
  const handleCloseSuccess = async () => {
    // 重新获取工单列表数据
    await mutateTickets();
  };

  return (
    <div className="min-vh-100">
      <Container fluid>
        <Row className="mg-b-20">
          <Col xs={12}>
            <h4 className="main-title">
              <i className="ph-duotone ph-ticket me-2"></i>
              {t('title')}
            </h4>
          </Col>
        </Row>
        <Row className="ticket-app mg-b-10">
          <Col lg={12}>
            <div className="card create-ticket-card">
              <div className="card-body">
                <div className="col-xl-12">
                  <div className="row align-items-center">
                    {/* Text Content */}
                    <div className="col-sm-12 col-12">
                      <div className="ticket-create text-start">
                        <button
                          className="btn btn-primary"
                          id="create_ticket_key"
                          onClick={() => setShowModal(true)}
                        >
                          {t('create.button')}
                        </button>
                      </div>
                    </div>
                    {/* Image */}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={12}>
            <Card>
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">{t('list.title')}</h5>
                  <span className="text-muted">{t('list.total', { total: total ?? 0 })}</span>
                </div>
              </CardHeader>
              <CardBody className="px-0">
                {isLoading ? (
                  /* 加载状态占位符 */
                  <Loading text={tCommon('loading')} variant="spinner" />
                ) : !tickets || tickets.length === 0 ? (
                  /* 暂无数据占位符 */
                  <EmptyState icon="iconoir-glass-empty" title={tCommon('noData')} />
                ) : (
                  <TicketTable tickets={tickets} onOpenCloseModal={handleOpenCloseModal} />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        <TicketCreateModal
          isOpen={showModal}
          toggle={() => setShowModal(!showModal)}
          onSave={handleSaveTicket}
          isSubmitting={isSaving}
        />

        {/* 关闭工单确认模态框 */}
        {ticketToClose && (
          <TicketCloseConfirmModal
            isOpen={showCloseModal}
            ticket={ticketToClose}
            onClose={handleCloseModal}
            onSuccess={void handleCloseSuccess()}
            onCloseTicket={handleCloseTicket}
          />
        )}
      </Container>
    </div>
  );
};

export default TicketPage;
