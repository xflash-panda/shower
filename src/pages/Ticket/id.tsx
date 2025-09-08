import { useState, useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, Col, Container, Row, Button } from 'reactstrap';
import { useTicket } from '@/hooks/useUser';
import { ticketClose, ticketReply } from '@/api/v1/user';
import TicketCloseConfirmModal from '@components/Ticket/TicketCloseConfirmModal';
import TicketReplyModal from '@components/Ticket/TicketReplyModal';
import Loading from '@components/Common/Loading';
import toast from '@/helpers/toast';
import { formatTime } from '@helpers/time';

const TicketDetailPage = (): JSX.Element => {
  const { t } = useTranslation('ticket');
  const { id } = useParams<{ id: string }>();
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [showCloseModal, setShowCloseModal] = useState<boolean>(false);
  const [_isReplying, setIsReplying] = useState<boolean>(false);
  const [_isClosing, setIsClosing] = useState<boolean>(false);

  // 使用 useTicket Hook 获取工单详情
  const { ticket, isLoading, mutate } = useTicket(
    { random_id: id ?? '' },
    !!id, // 只有当 id 存在时才启用
  );

  // 添加滚动容器的引用
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 滚动到底部的函数
  const scrollToBottom = (): void => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // 当工单数据加载或消息更新时自动滚动到底部
  useEffect(() => {
    if (ticket?.message) {
      scrollToBottom();
    }
  }, [ticket?.message]);

  // 处理加载状态
  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center order-loading-bg">
        <Loading text={t('detail.loading')} size="lg" variant="spinner" />
      </div>
    );
  }

  // 如果未找到工单，重定向到404页面
  if (!ticket) {
    return <Navigate to="/404" replace />;
  }

  const getStatusText = (status: number): string => {
    switch (status) {
      case 0:
        return t('detail.statusOpen');
      case 1:
        return t('detail.statusClosed');
      default:
        return t('detail.statusUnknown');
    }
  };

  const getPriorityText = (level: number): string => {
    switch (level) {
      case 0:
        return t('detail.priorityLow');
      case 1:
        return t('detail.priorityMedium');
      case 2:
        return t('detail.priorityHigh');
      default:
        return t('detail.priorityUnknown');
    }
  };

  const getStatusBadgeClass = (status: number): string => {
    switch (status) {
      case 0:
        return 'badge text-outline-success';
      case 1:
        return 'badge text-outline-secondary';
      default:
        return 'badge text-outline-warning';
    }
  };

  const getPriorityBadgeClass = (level: number): string => {
    switch (level) {
      case 0:
        return 'badge text-outline-info';
      case 1:
        return 'badge text-outline-warning';
      case 2:
        return 'badge text-outline-danger';
      default:
        return 'badge text-outline-secondary';
    }
  };

  // 处理工单回复的API调用
  const handleTicketReply = async (content: string): Promise<void> => {
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    setIsReplying(true);
    try {
      // 调用真实的API
      await ticketReply({
        random_id: ticket.random_id.toString(),
        message: content,
      });

      // 成功后关闭模态框
      setShowReplyModal(false);

      // 重新获取工单数据以获取最新消息
      await mutate();

      // 显示成功提示
      toast.success(t('success.replySubmitted'));
    } catch (error) {
      console.error('Failed to submit reply:', error);
      toast.error(t('error.replyFailed'));
      throw error;
    } finally {
      setIsReplying(false);
    }
  };

  // 处理关闭工单的API调用
  const handleCloseTicket = async (params: { random_id: string }): Promise<void> => {
    setIsClosing(true);
    try {
      await ticketClose(params);

      // 重新获取工单数据以获取最新状态
      await mutate();

      // 显示成功提示
      toast.success(t('success.closed'));
    } catch (error) {
      console.error('Failed to close ticket:', error);
      toast.error(t('error.closeFailedRetry'));
      throw error;
    } finally {
      setIsClosing(false);
    }
  };

  // 工单关闭成功后的回调
  const handleCloseSuccess = (): void => {
    setShowCloseModal(false);
  };

  // 关闭模态框的回调
  const handleCloseModal = (): void => {
    setShowCloseModal(false);
  };

  return (
    <Container fluid className="py-4">
      <Row className="m-1">
        <Col xs={12}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="main-title mb-0">
              <i className="ph-duotone ph-ticket me-2"></i>
              <span className="me-2">{t('detail.title')} -</span>
              <span className="text-secondary">#{ticket.random_id.toString().substring(0, 6)}</span>
            </h4>
            {/* 在标题区域添加快速返回按钮 */}
            <Link to="/ticket" className="btn btn-secondary btn-sm">
              <i className="ti ti-arrow-left me-1"></i>
              {t('detail.backToList')}
            </Link>
          </div>
        </Col>
      </Row>

      <Row>
        {/* 工单信息卡片 - 小屏幕时显示在上方，大屏幕时显示在右侧 */}
        <Col xs={12} lg={4} className="order-1 order-lg-2 mb-3 mb-lg-0">
          <Card>
            <CardBody>
              <h6 className="card-title">
                <i className="fa-solid fa-ticket me-2 text-dark"></i>
                {t('detail.ticketInfo')}
              </h6>
              <div className="ticket-info">
                <p>
                  <strong>{t('detail.ticketNumber')}：</strong> #
                  {ticket.random_id.toString().substring(0, 6)}
                </p>
                <p>
                  <strong>{t('detail.status')}：</strong>
                  <span className={getStatusBadgeClass(ticket.status)}>
                    {getStatusText(ticket.status)}
                  </span>
                </p>
                <p>
                  <strong>{t('detail.priority')}：</strong>
                  <span className={getPriorityBadgeClass(ticket.level)}>
                    {getPriorityText(ticket.level)}
                  </span>
                </p>
                <p>
                  <strong>{t('detail.createdAt')}：</strong> {formatTime(ticket.created_at)}
                </p>
                <p>
                  <strong>{t('detail.updatedAt')}：</strong> {formatTime(ticket.updated_at)}
                </p>
                <p>
                  <strong>{t('detail.replyCount')}：</strong> {ticket.message?.length || 0}{' '}
                  {t('detail.replies')}
                </p>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* 工单对话内容 - 小屏幕时显示在下方，大屏幕时显示在左侧 */}
        <Col xs={12} lg={8} className="order-2 order-lg-1">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">{ticket.subject}</h5>
                <div>
                  <span className={getStatusBadgeClass(ticket.status)}>
                    {getStatusText(ticket.status)}
                  </span>
                  <span className={`${getPriorityBadgeClass(ticket.level)} ms-2`}>
                    {getPriorityText(ticket.level)}
                  </span>
                </div>
              </div>

              {/* 工单对话内容 */}
              <div className="ticket-conversation position-relative">
                <div className="text-center mb-3">
                  <span className="badge text-light-secondary">
                    {t('detail.todayConversation')}
                  </span>
                </div>
                <div className="chat-container app-scroll h-400" ref={chatContainerRef}>
                  {ticket.message && ticket.message.length > 0 ? (
                    ticket.message.map((message: API_V1.User.TicketMessageItem) => (
                      <Col key={message.id} xs="12" className="position-relative">
                        {message.is_me ? (
                          /* 用户消息 - 右侧对齐 */
                          <>
                            <div className="chat-box-right">
                              <div>
                                <p className="chat-text">{message.message}</p>
                                <p className="text-muted">{formatTime(message.created_at)}</p>
                              </div>
                            </div>
                            <div className="chatdp h-35 w-35 b-r-50 position-absolute end-0 top-0 bg-primary">
                              <div className="h-35 w-35 d-flex-center b-r-50 text-white">
                                <i className="ti ti-user"></i>
                              </div>
                            </div>
                          </>
                        ) : (
                          /* 客服消息 - 左侧对齐 */
                          <>
                            <div className="chatdp h-35 w-35 b-r-50 position-absolute start-0 bg-success">
                              <div className="h-35 w-35 d-flex-center b-r-50 text-white">
                                <i className="ti ti-headset"></i>
                              </div>
                            </div>
                            <div className="chat-box">
                              <div>
                                <p className="chat-text">{message.message}</p>
                                <p className="text-muted">{formatTime(message.created_at)}</p>
                              </div>
                            </div>
                          </>
                        )}
                      </Col>
                    ))
                  ) : (
                    <div className="text-center text-muted py-5">
                      <i className="ph-duotone ph-chat-circle f-s-48 mb-3 opacity-50"></i>
                      <h6 className="mb-2">{t('detail.noConversation')}</h6>
                      <p className="mb-0">{t('detail.noConversationDesc')}</p>
                    </div>
                  )}
                </div>

                {/* 工单关闭时的蒙层 */}
                {ticket.status === 1 && (
                  <div className="position-absolute top-0 start-0 end-0 bottom-0 d-flex-center bg-dark bg-opacity-50">
                    <div className="text-center text-white">
                      <div className="bg-secondary h-80 w-80 d-flex-center b-r-50 mx-auto mb-3">
                        <i className="ti ti-lock f-s-32"></i>
                      </div>
                      <h4 className="mb-2 f-w-600 text-white">{t('detail.ticketClosed')}</h4>
                      <p className="mb-0 f-w-500 text-light">{t('detail.ticketClosedDesc')}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 响应式按钮布局 */}
              <div className="mt-4">
                {/* 大屏幕：水平布局 */}
                <div className="d-none d-md-flex justify-content-between align-items-center">
                  <div>
                    <Button color="primary" outline onClick={() => setShowReplyModal(true)}>
                      <i className="ti ti-message-circle me-2"></i>
                      {ticket.status === 1
                        ? t('detail.continueConversation')
                        : t('detail.replyTicket')}
                    </Button>
                  </div>
                  {/* 只有工单未关闭时才显示关闭按钮 */}
                  {ticket.status === 0 && (
                    <div>
                      <Button color="danger" onClick={() => setShowCloseModal(true)}>
                        <i className="ti ti-lock me-2"></i>
                        {t('detail.closeTicket')}
                      </Button>
                    </div>
                  )}
                </div>

                {/* 小屏幕：垂直布局 */}
                <div className="d-md-none">
                  <div className="d-grid gap-2">
                    <Button
                      outline
                      color="primary"
                      onClick={() => setShowReplyModal(true)}
                      size="lg"
                    >
                      <i className="ti ti-message-circle me-2"></i>
                      {ticket.status === 1 ? t('detail.reopenAndReply') : t('detail.replyTicket')}
                    </Button>
                    {/* 只有工单未关闭时才显示关闭按钮 */}
                    {ticket.status === 0 && (
                      <Button
                        color="danger"
                        onClick={() => setShowCloseModal(true)}
                        className="w-100"
                      >
                        <i className="ti ti-lock me-2"></i>
                        {t('detail.closeTicket')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* 回复模态框 */}
      <TicketReplyModal
        isOpen={showReplyModal}
        onToggle={() => setShowReplyModal(!showReplyModal)}
        onSubmit={handleTicketReply}
        onCancel={() => setShowReplyModal(false)}
      />

      {/* 关闭工单确认模态框 */}
      {ticket && (
        <TicketCloseConfirmModal
          isOpen={showCloseModal}
          ticket={ticket}
          onClose={handleCloseModal}
          onSuccess={handleCloseSuccess}
          onCloseTicket={handleCloseTicket}
        />
      )}
    </Container>
  );
};

export default TicketDetailPage;
