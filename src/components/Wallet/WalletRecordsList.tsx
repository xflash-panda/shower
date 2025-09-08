import { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@helpers/currency';
import EmptyState from '@components/Common/EmptyState';

interface WalletRecordsListProps {
  records: API_V1.User.WalletLogItem[];
  onFilteredCountChange?: (count: number, isFiltered: boolean) => void;
}

const WalletRecordsList: React.FC<WalletRecordsListProps> = ({
  records,
  onFilteredCountChange,
}) => {
  const { t } = useTranslation('wallet');

  // 类型映射
  const typeMap = {
    1: t('records.types.commissionTransfer'),
    2: t('records.types.balanceRecharge'),
    3: t('records.types.balanceTransfer'),
    4: t('records.types.commissionWithdraw'),
    5: t('records.types.balanceConsumption'),
  } as const;

  // 筛选状态
  const [filterType, setFilterType] = useState<'all' | keyof typeof typeMap>('all');

  // 筛选后的记录
  const filteredRecords = records.filter(record =>
    filterType === 'all' ? true : record.type === filterType,
  );

  // 当筛选后的记录数量发生变化时，通知父组件
  useEffect(() => {
    if (onFilteredCountChange) {
      const isFiltered = filterType !== 'all';
      onFilteredCountChange(filteredRecords.length, isFiltered);
    }
  }, [filteredRecords.length, filterType, onFilteredCountChange]);

  // 获取所有操作类型
  const operationTypes: Array<'all' | keyof typeof typeMap> = [
    'all',
    2, // 余额充值
    3, // 余额划转
    5, // 余额消费
    1, // 推广佣金划转
    4, // 推广佣金提现
  ];

  // 根据操作类型设置图标和颜色
  const getIconAndColor = (type: number) => {
    switch (type) {
      case 1: // 推广佣金划转
        return {
          icon: 'ti-arrows-exchange',
          color: 'text-primary',
        };
      case 2: // 余额充值
        return { icon: 'ti-wallet', color: 'text-success' };
      case 3: // 余额划转
        return { icon: 'ti-send', color: 'text-info' };
      case 4: // 推广佣金提现
        return { icon: 'ti-cash', color: 'text-dark' };
      case 5: // 余额消费
        return { icon: 'ti-shopping-cart', color: 'text-warning' };
      default:
        return { icon: 'ti-circle', color: 'text-secondary' };
    }
  };

  return (
    <>
      {/* 筛选按钮组 - 只在有记录时显示 */}
      {records.length > 0 && (
        <div className="mb-4">
          <div className="app-btn-list">
            {operationTypes.map(type => (
              <button
                key={type}
                type="button"
                className={`btn f-w-600 ${
                  filterType === type ? 'btn-primary' : 'btn-outline-primary'
                }`}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? t('records.types.all') : typeMap[type]}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredRecords.length > 0 ? (
        <ListGroup flush className="list-content">
          {filteredRecords.map(rec => {
            const { icon, color } = getIconAndColor(rec.type);

            return (
              <ListGroupItem key={rec.id} className="border-bottom-1 py-3">
                <div className="d-flex align-items-start">
                  <div className={`${color} me-3 mt-1`}>
                    <i className={`ti ${icon} fs-5`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="f-w-400 text-dark">{typeMap[rec.type]}</span>
                      <span className="text-muted font-monospace f-w-400">
                        {new Date(rec.created_at * 1000).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-secondary small f-w-400">
                      {rec.type === 5 ? (
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="f-w-400">
                            {t('records.details.consumptionAmount')}:{' '}
                            {formatCurrency(rec.message.amount)}
                          </span>
                          {rec.message.order_id && (
                            <Link
                              to={`/order/${rec.message.order_id}`}
                              className="text-primary f-w-500 text-decoration-none"
                            >
                              <i className="ti ti-external-link me-1"></i>
                              {t('records.details.orderNumber')}: {rec.message.order_id}
                            </Link>
                          )}
                        </div>
                      ) : rec.type === 2 ? (
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="f-w-400">
                            {t('records.details.rechargeAmount')}:{' '}
                            {formatCurrency(rec.message.amount)}
                          </span>
                          {rec.message.order_id && (
                            <span className="text-muted small">
                              {t('records.details.orderNumber')}: {rec.message.order_id}
                            </span>
                          )}
                        </div>
                      ) : rec.type === 3 ? (
                        <span className="f-w-400">
                          {rec.message.direction === 'out'
                            ? t('records.details.transferOut')
                            : t('records.details.transferIn')}
                          : {formatCurrency(rec.message.amount)}
                          {rec.message.to_user_contact &&
                            ` (${t('records.details.toUser', { user: rec.message.to_user_contact })})`}
                          {rec.message.from_user_contact &&
                            ` (${t('records.details.fromUser', { user: rec.message.from_user_contact })})`}
                        </span>
                      ) : rec.type === 4 ? (
                        <span className="f-w-400">
                          {t('records.details.withdrawAmount')}:{' '}
                          {formatCurrency(rec.message.amount)} (
                          {t('records.details.toAccount', {
                            method:
                              rec.message.withdraw_method === 'alipay'
                                ? t('paymentMethods.alipay')
                                : rec.message.withdraw_method,
                            account: rec.message.withdraw_account,
                          })}
                          )
                        </span>
                      ) : (
                        <span className="f-w-400">
                          {t('records.details.amount')}: {formatCurrency(rec.message.amount)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </ListGroupItem>
            );
          })}
        </ListGroup>
      ) : (
        // 筛选后没有记录时显示空状态
        records.length > 0 && (
          <EmptyState
            title={t('records.empty.title')}
            description={t('records.empty.description')}
            icon="iconoir-filter-alt"
          />
        )
      )}
    </>
  );
};

export default WalletRecordsList;
