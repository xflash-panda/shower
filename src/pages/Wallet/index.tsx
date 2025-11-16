import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';

import { useUserInfo, useWalletLogs, useProfileConfig } from '@/hooks/useUser';
import {
  recharge,
  unpaidOrder,
  transferBalance,
  transferCommissionBalance,
  ticketWithdraw,
} from '@/api/v1/user';
import toast from '@/helpers/toast';
import { isErrorType } from '@/helpers/error';

import PromoTransferModal from '@components/Wallet/PromoTransferModal';
import RechargeModal from '@components/Wallet/RechargeModal';
import TransferToUserModal from '@components/Wallet/TransferToUserModal';
import WithdrawModal from '@components/Wallet/WithdrawModal';
import WalletBalanceCard from '@components/Wallet/WalletBalanceCard';
import WalletRecordsList from '@components/Wallet/WalletRecordsList';
import Loading from '@components/Common/Loading';
import EmptyState from '@components/Common/EmptyState';
import UnpaidOrderModal from '@components/Common/UnpaidOrderModal';

// 定义模态类型
type ModalType = 'promo' | 'recharge' | 'toUser' | 'withdraw' | 'unpaidOrder' | null;

const WalletPage = () => {
  const { t } = useTranslation(['wallet', 'common']);
  const navigate = useNavigate();

  // 获取用户信息
  const { userInfo, isLoading: isUserInfoLoading, mutate: refreshUserInfo } = useUserInfo();

  // 获取钱包日志
  const {
    wallLogs,
    total,
    isLoading: isWalletLogsLoading,
    mutate: refreshWalletLogs,
  } = useWalletLogs();

  // 获取用户配置
  const { profileConfig: rawProfileConfig, isError: isProfileConfigError } = useProfileConfig();

  // 类型安全的配置数据
  const profileConfig = !isProfileConfigError && rawProfileConfig ? rawProfileConfig : null;

  // 从 API 响应中获取余额数据，如果没有数据则使用默认值
  const balance = userInfo?.balance ?? 0;
  const promoBalance = userInfo?.commission_balance ?? 0;

  // 弹窗控制
  const [modalType, setModalType] = useState<ModalType>(null);

  // 加载状态
  const [loadingStates, setLoadingStates] = useState({
    promo: false,
    recharge: false,
    toUser: false,
    withdraw: false,
  });

  // 未支付订单状态
  const [currentUnpaidOrder, setCurrentUnpaidOrder] = useState<API_V1.User.OrderItem | null>(null);

  // 筛选后的记录数量状态
  const [filteredRecordsCount, setFilteredRecordsCount] = useState<number>(0);
  const [isFiltered, setIsFiltered] = useState<boolean>(false);

  // 使用真实的钱包日志数据
  const records = wallLogs ?? [];
  const recordsLoading = isWalletLogsLoading;

  // 弹窗控制函数
  const openModal = (type: ModalType) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    // 关闭Modal时重置加载状态
    setLoadingState('recharge', false);
  };

  // 设置加载状态
  const setLoadingState = (type: keyof typeof loadingStates, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [type]: loading }));
  };

  // 推广佣金划转API调用
  const handlePromoTransfer = async (amount: number): Promise<void> => {
    setLoadingState('promo', true);
    try {
      // 调用推广佣金划转API
      await transferCommissionBalance({
        transfer_amount: amount,
      });

      // 显示成功提示
      toast.success(t('wallet:commission.transferSuccess'));

      // 刷新用户信息以获取最新余额
      await refreshUserInfo();

      // 刷新钱包日志
      await refreshWalletLogs();
    } catch (error) {
      console.error('Failed to transfer commission balance:', error);
      toast.error(t('wallet:commission.transferError'));
      throw error;
    } finally {
      setLoadingState('promo', false);
    }
  };

  // 检查未支付订单的函数
  const checkUnpaidOrderBeforeRecharge = async (): Promise<boolean> => {
    try {
      const result = await unpaidOrder();
      const unpaidOrderData = result.data;

      if (unpaidOrderData) {
        // 有未支付订单，保存数据并显示提醒Modal
        setCurrentUnpaidOrder(unpaidOrderData);
        setModalType('unpaidOrder');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to check unpaid order:', error);
      // 如果检查失败，允许继续充值流程
      return true;
    }
  };

  // 余额充值API调用
  const handleRecharge = async (amount: number): Promise<void> => {
    setLoadingState('recharge', true);
    try {
      // 检查是否有未支付订单
      if (!(await checkUnpaidOrderBeforeRecharge())) {
        // 有未支付订单，重置加载状态并抛出错误阻止Modal关闭
        setLoadingState('recharge', false);
        throw new Error('UNPAID_ORDER_FOUND');
      }

      // 调用充值接口
      const result = await recharge({
        recharge_amount: amount,
      });

      // 显示成功提示
      toast.success(t('wallet:recharge.success'));

      // 刷新用户信息以获取最新余额
      await refreshUserInfo();

      // 刷新钱包日志
      await refreshWalletLogs();

      // 跳转到订单详情页面，使用返回的订单号
      if (result.data) {
        navigate(`/order/${result.data}`);
      }

      // 只有成功完成充值后才重置加载状态
      setLoadingState('recharge', false);
    } catch (error) {
      console.error('Failed to recharge:', error);

      // 如果是未支付订单错误，不显示错误提示，因为已经显示了未支付订单Modal
      if (isErrorType(error, 'UNPAID_ORDER_FOUND')) {
        throw error;
      }

      console.error('Failed to recharge:', error);
      toast.error(t('wallet:recharge.error'));
    } finally {
      setLoadingState('recharge', false);
    }
  };

  // 余额划转给他人API调用
  const handleToUserTransfer = async (toUser: string, amount: number): Promise<void> => {
    setLoadingState('toUser', true);
    try {
      // 调用真实的转账API
      const result = await transferBalance({
        transfer_amount: amount,
        transfer_user: toUser,
      });

      // 显示成功提示，包含接收方邮箱信息
      if (result.data) {
        toast.success(t('wallet:transfer.success'));
      }

      // 刷新用户信息以获取最新余额
      await refreshUserInfo();

      // 刷新钱包日志
      await refreshWalletLogs();
    } catch (error) {
      console.error('Failed to transfer balance:', error);
      toast.error(t('wallet:transfer.error'));
    } finally {
      setLoadingState('toUser', false);
    }
  };

  // 推广佣金提现API调用
  const handleWithdraw = async (method: string, account: string): Promise<void> => {
    setLoadingState('withdraw', true);
    try {
      // 调用实际的提现API
      await ticketWithdraw({
        withdraw_method: method,
        withdraw_account: account,
      });

      // 显示成功提示
      toast.success(t('wallet:withdraw.success'));

      // 刷新用户信息以获取最新余额
      await refreshUserInfo();

      // 刷新钱包日志
      await refreshWalletLogs();
    } catch (error) {
      console.error('Failed to submit withdrawal application:', error);
      toast.error(t('wallet:withdraw.error'));
    } finally {
      setLoadingState('withdraw', false);
    }
  };

  // 处理订单取消成功后的回调
  const handleOrderCancelled = async () => {
    try {
      // 清除当前未支付订单状态
      setCurrentUnpaidOrder(null);
      // 刷新用户信息
      await refreshUserInfo();
      toast.success(t('wallet:order.cancelSuccess'));
    } catch (error) {
      console.error('Failed to refresh user info after order cancellation:', error);
      toast.error(t('wallet:order.cancelError'));
    }
  };

  // 处理筛选后记录数量变化的回调
  const handleFilteredCountChange = (count: number, filtered: boolean) => {
    setFilteredRecordsCount(count);
    setIsFiltered(filtered);
  };

  return (
    <div className="min-vh-100">
      <Container fluid className="py-4">
        <Row className="mg-b-20">
          <Col>
            <h4 className="main-title d-flex align-items-center f-w-700">
              <i className="ti ti-wallet me-2 fs-5"></i>
              {t('wallet:title')}
            </h4>
          </Col>
        </Row>
        <Row className="justify-content-center mg-b-10">
          {/* 信息区（左栏） */}
          {isUserInfoLoading ? (
            <Col
              xs={12}
              md={4}
              lg={5}
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: '400px' }}
            >
              <Loading text={t('common:loading')} variant="spinner" />
            </Col>
          ) : (
            <WalletBalanceCard balance={balance} promoBalance={promoBalance} />
          )}
          {/* 操作区（右栏） */}
          <Col xs={12} md={8} lg={7}>
            <Card className="h-100">
              <CardBody>
                <h5 className="f-w-700 mb-3">{t('wallet:quickActions.title')}</h5>
                <ListGroup flush>
                  {/* 余额充值 - 根据 recharge_close 配置控制显示 */}
                  {profileConfig && profileConfig.recharge_close === 0 && (
                    <ListGroupItem className="d-flex align-items-center justify-content-between py-3">
                      <div>
                        <i className="ti ti-wallet text-success me-2 fs-5"></i>
                        <span className="f-w-600 fs-6">{t('wallet:actions.recharge')}</span>
                        <div className="text-muted mb-0 f-w-500 small">
                          {t('wallet:actions.rechargeDescription')}
                        </div>
                      </div>
                      <Button
                        color="success"
                        outline
                        onClick={() => openModal('recharge')}
                        className="f-w-600"
                      >
                        {t('wallet:actions.rechargeButton')}
                      </Button>
                    </ListGroupItem>
                  )}

                  {/* 余额划转 - 根据 transfer_balance_close 配置控制显示 */}
                  {profileConfig && profileConfig.transfer_balance_close === 0 && (
                    <ListGroupItem className="d-flex align-items-center justify-content-between py-3">
                      <div>
                        <i className="ti ti-send text-info me-2 fs-5"></i>
                        <span className="f-w-600 fs-6">{t('wallet:actions.transfer')}</span>
                        <div className="text-muted mb-0 f-w-500 small">
                          {t('wallet:actions.transferDescription')}
                        </div>
                      </div>
                      <Button
                        color="info"
                        outline
                        onClick={() => openModal('toUser')}
                        className="f-w-600"
                      >
                        {t('wallet:actions.transferButton')}
                      </Button>
                    </ListGroupItem>
                  )}

                  {/* 推广佣金划转 - 根据 transfer_commission_balance_close 配置控制显示 */}
                  {profileConfig && profileConfig.transfer_commission_balance_close === 0 && (
                    <ListGroupItem className="d-flex align-items-center justify-content-between py-3">
                      <div>
                        <i className="ti ti-arrows-exchange text-primary me-2 fs-5"></i>
                        <span className="f-w-600 fs-6">{t('wallet:actions.commission')}</span>
                        <div className="text-muted mb-0 f-w-500 small">
                          {t('wallet:actions.commissionDescription')}
                        </div>
                      </div>
                      <Button
                        color="primary"
                        outline
                        onClick={() => openModal('promo')}
                        className="f-w-600"
                      >
                        {t('wallet:actions.commissionButton')}
                      </Button>
                    </ListGroupItem>
                  )}

                  {/* 推广佣金提现 - 根据 withdraw_close 配置控制显示 */}
                  {profileConfig && profileConfig.withdraw_close === 0 && (
                    <ListGroupItem className="d-flex align-items-center justify-content-between py-3">
                      <div>
                        <i className="ti ti-cash text-dark me-2 fs-5"></i>
                        <span className="f-w-600 fs-6">{t('wallet:actions.withdraw')}</span>
                        <div className="text-muted mb-0 f-w-500 small">
                          {t('wallet:actions.withdrawDescription')}
                        </div>
                      </div>
                      <Button
                        color="dark"
                        outline
                        onClick={() => openModal('withdraw')}
                        className="f-w-600"
                      >
                        {t('wallet:actions.withdrawButton')}
                      </Button>
                    </ListGroupItem>
                  )}
                </ListGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* Modal 组件区 */}
        <PromoTransferModal
          isOpen={modalType === 'promo'}
          toggle={closeModal}
          promoBalance={promoBalance}
          onTransfer={handlePromoTransfer}
          isLoading={loadingStates.promo}
          minBalanceRequired={
            profileConfig ? profileConfig.transfer_commission_balance_min_amount : 0
          }
        />

        <RechargeModal
          isOpen={modalType === 'recharge'}
          toggle={closeModal}
          onRecharge={handleRecharge}
          isLoading={loadingStates.recharge}
          minAmount={profileConfig ? profileConfig.min_recharge_amount : 100}
          maxAmount={profileConfig ? profileConfig.max_recharge_amount : 99999900}
          // 充值奖励相关配置
          rechargeRebateEnable={profileConfig ? profileConfig.recharge_rebate_enable : 0}
          rechargeRebateMode={profileConfig ? profileConfig.recharge_rebate_mode : 'normal'}
          rechargeRebateNormalMinAmount={
            profileConfig ? profileConfig.recharge_rebate_normal_min_amount : 0
          }
          rechargeRebateNormalRate={profileConfig ? profileConfig.recharge_rebate_normal_rate : 0}
          rechargeRebateFullThresholdAmount={
            profileConfig ? profileConfig.recharge_rebate_full_threshold_amount : 0
          }
          rechargeRebateFullValue={profileConfig ? profileConfig.recharge_rebate_full_value : 0}
        />

        <TransferToUserModal
          isOpen={modalType === 'toUser'}
          toggle={closeModal}
          balance={balance}
          currentUserEmail={userInfo?.email}
          onTransfer={handleToUserTransfer}
          isLoading={loadingStates.toUser}
        />

        <WithdrawModal
          isOpen={modalType === 'withdraw'}
          toggle={closeModal}
          promoBalance={promoBalance}
          availableWithdrawMethods={profileConfig?.withdraw_methods}
          commissionWithdrawLimit={profileConfig?.commission_withdraw_limit}
          onWithdraw={handleWithdraw}
          isLoading={loadingStates.withdraw}
        />

        <UnpaidOrderModal
          isOpen={modalType === 'unpaidOrder'}
          toggle={closeModal}
          unpaidOrder={currentUnpaidOrder}
          onOrderCancelled={() => {
            handleOrderCancelled().catch(console.error);
          }}
          onOrderCancelError={error => {
            toast.error(error);
          }}
          isLoading={loadingStates.recharge}
        />
        <Row>
          <Col>
            <Card className="mb-4 mg-b-20">
              <CardHeader>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className="ti ti-history me-2"></i>
                    {t('wallet:records.title')}
                  </h5>
                  <span className="text-muted">
                    {t('wallet:records.total', {
                      total: isFiltered ? filteredRecordsCount : (total ?? records.length),
                    })}
                  </span>
                </div>
              </CardHeader>
              <CardBody>
                {recordsLoading ? (
                  <Loading text={t('common:loading')} variant="spinner" />
                ) : records.length === 0 ? (
                  <EmptyState title={t('common:noData')} icon="iconoir-glass-empty" />
                ) : (
                  <WalletRecordsList
                    records={records}
                    onFilteredCountChange={handleFilteredCountChange}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default WalletPage;
