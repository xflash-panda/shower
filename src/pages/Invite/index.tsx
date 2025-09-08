import { useState, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import toast from '@/helpers/toast';
import { useInvites, useInviteConfig, useInviteOrders } from '@/hooks/useUser';
import { inviteGenerate } from '@/api/v1/user';
import InviteCommissionDetail from '@components/Invite/InviteCommissionDetail';
import InviteCodeTable from '@components/Invite/InviteCodeTable';
import InviteHeader from '@components/Invite/InviteHeader';
import EmptyState from '@components/Common/EmptyState';
import Pagination from '@components/Common/Pagination';
import Loading from '@components/Common/Loading';
import { formatCurrency } from '@/helpers/currency';

// 分页配置
const PAGE_SIZE = 10;

const InvitePage = () => {
  const { t } = useTranslation('invite');
  const { t: tCommon } = useTranslation('common');
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  // 生成邀请码loading状态
  const [isGenerating, setIsGenerating] = useState(false);

  // 使用API获取邀请数据
  const {
    inviteCodes,
    inviteStats,
    isLoading: invitesLoading,
    mutate: mutateInvites,
  } = useInvites();
  const { inviteConfig, isLoading: configLoading } = useInviteConfig();

  // 使用API获取推广返利明细数据
  const {
    inviteOrders,
    total,
    isLoading: ordersLoading,
  } = useInviteOrders({
    pageSize: PAGE_SIZE,
    current: currentPage,
  });

  // 计算衍生状态
  const inviteGenLimit = useMemo(() => inviteConfig?.invite_gen_limit ?? 10, [inviteConfig]);
  const totalPages = useMemo(() => Math.ceil((total ?? 0) / PAGE_SIZE), [total]);
  const stat = useMemo(() => inviteStats ?? [0, 0, 0, 0], [inviteStats]);
  const codes = useMemo(() => inviteCodes ?? [], [inviteCodes]);

  // 统计卡片配置
  const statCardStyle = useMemo(
    () => [
      {
        bg: 'bg-primary',
        icon: 'ph-users',
        label: t('stats.registeredUsers'),
        key: 0,
        color: 'text-white',
      },
      {
        bg: 'bg-success',
        icon: 'ph-currency-circle-dollar',
        label: t('stats.validCommission'),
        key: 1,
        color: 'text-white',
      },
      {
        bg: 'bg-warning',
        icon: 'ph-clock',
        label: t('stats.pendingCommission'),
        key: 2,
        color: 'text-white',
      },
      {
        bg: 'bg-info',
        icon: 'ph-percent',
        label: t('stats.currentCommissionRate'),
        key: 3,
        color: 'text-white',
      },
    ],
    [t],
  );

  // 处理页码变化
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // 生成新邀请码
  const handleGenCode = useCallback(() => {
    if (codes.length >= inviteGenLimit) {
      toast.error(t('code.limitReached'));
      return;
    }

    void (async () => {
      try {
        setIsGenerating(true);
        const response = await inviteGenerate();

        if (response.status === 200 || response.data === true) {
          toast.success(t('code.generateSuccess'));
          // 重新获取邀请数据以更新列表
          await mutateInvites();
        } else {
          console.error('Failed to generate invite code:', response.message ?? 'Unknown error');
          toast.error(t('code.generateErrorRetry'));
        }
      } catch (error) {
        console.error('Failed to generate invite code:', error);
        toast.error(t('code.generateErrorRetry'));
      } finally {
        setIsGenerating(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codes.length, inviteGenLimit, mutateInvites]);

  // 复制邀请码
  const handleCopyCode = useCallback((code: string) => {
    void navigator.clipboard.writeText(code).then(() => {
      toast.success(t('code.copySuccess'));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 复制注册链接
  const handleCopyLink = useCallback(
    (code: string) => {
      const baseUrl = inviteConfig?.invite_url ?? window.location.origin;
      const base = baseUrl.replace(/\/+$/, '');
      const path = `/register?invite_code=${code}`;
      const link = base + path;
      void navigator.clipboard.writeText(link).then(() => {
        toast.success(t('link.copySuccess'));
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inviteConfig?.invite_url],
  );

  // 渲染统计卡片
  const renderStatCards = () => {
    if (invitesLoading) {
      return <Loading text={tCommon('loading')} variant="spinner" />;
    }

    return (
      <>
        {statCardStyle.map(item => (
          <Col md={3} sm={6} xs={12} key={item.key}>
            <Card
              className={`border-0 shadow-sm rounded-4 ${item.bg} ${item.color} position-relative overflow-hidden`}
            >
              <CardBody className="d-flex align-items-center gap-3 py-3 position-relative">
                <i
                  className={`ph ${item.icon} position-absolute top-0 end-0 pe-3 pt-3 fs-1 text-white text-opacity-10`}
                  aria-hidden="true"
                ></i>
                <div className="z-1">
                  <div className="fw-bold fs-2 mb-1 text-white">
                    {item.key === 0
                      ? `${stat[item.key]}`
                      : item.key === 3
                        ? `${stat[item.key]}%`
                        : formatCurrency(Number(stat[item.key]))}
                  </div>
                  <div className="fs-6 text-white-75">{item.label}</div>
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </>
    );
  };

  // 渲染邀请码管理内容
  const renderInviteCodeContent = () => {
    if (invitesLoading || configLoading) {
      return <Loading text={tCommon('loading')} variant="spinner" />;
    }

    const hasNoCodes = !codes || codes.length === 0;

    return (
      <>
        <InviteHeader
          codesLength={codes.length}
          inviteGenLimit={inviteGenLimit}
          onGenCode={handleGenCode}
          isGenerating={isGenerating}
        />
        {hasNoCodes ? (
          <EmptyState icon="iconoir-glass-empty" title={tCommon('noData')} />
        ) : (
          <InviteCodeTable codes={codes} onCopyCode={handleCopyCode} onCopyLink={handleCopyLink} />
        )}
      </>
    );
  };

  // 渲染推广返利明细内容
  const renderCommissionContent = () => {
    if (ordersLoading) {
      return <Loading text={tCommon('loading')} variant="spinner" />;
    }

    const hasNoOrders = !inviteOrders || inviteOrders.length === 0;

    if (hasNoOrders) {
      return <EmptyState icon="iconoir-glass-empty" title={tCommon('noData')} />;
    }

    return (
      <>
        <InviteCommissionDetail
          inviteOrders={inviteOrders}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
        />
        {totalPages > 1 && (
          <div className="d-flex justify-content-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-3"
            />
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-vh-100">
      <Container fluid className="py-4">
        {/* 顶部主标题 */}
        <Row className="mg-b-20">
          <Col xs={12}>
            <h4 className="main-title">
              <i className="ph-duotone ph-star me-2"></i>
              {t('title')}
            </h4>
          </Col>
        </Row>

        {/* 统计卡片 */}
        <Row className="g-4 mg-b-10">{renderStatCards()}</Row>

        {/* 邀请码管理 */}
        <Row className="mg-b-10">
          <Col xs={12}>
            <Card className="mb-4">
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <h5 className="f-fw-600 mg-b-0 text-dark">
                      <i className="ph-duotone ph-share-network me-2"></i>
                      {t('codeManagement.title')}
                    </h5>
                  </div>
                </div>
              </CardHeader>
              <CardBody>{renderInviteCodeContent()}</CardBody>
            </Card>
          </Col>
        </Row>

        {/* 推广返利明细 */}
        <Row className="mb-4">
          <Col xs={12}>
            <Card className="mb-4">
              <CardHeader>
                <h5 className="f-fw-600 mg-b-0 text-dark">
                  <i className="ph-duotone ph-coins me-2"></i>
                  {t('commissionDetail.title')}
                </h5>
              </CardHeader>
              <CardBody>{renderCommissionContent()}</CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InvitePage;
