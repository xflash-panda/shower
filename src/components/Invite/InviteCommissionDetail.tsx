import React from 'react';
import { Table } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatTime, TIME_FORMATS } from '@/helpers';
import { formatCurrency } from '@/helpers/currency';

interface InviteCommissionDetailProps {
  /** 推广返利明细数据 */
  inviteOrders: API_V1.User.InviteOrderItem[];
  /** 当前页码（用于计算序号） */
  currentPage: number;
  /** 每页大小（用于计算序号） */
  pageSize: number;
  /** 自定义样式类 */
  className?: string;
}

const InviteCommissionDetail: React.FC<InviteCommissionDetailProps> = ({
  inviteOrders,
  currentPage,
  pageSize,
}) => {
  const { t } = useTranslation('invite');
  // 渲染佣金状态徽章
  const renderCommissionStatus = (status: number) => {
    switch (status) {
      case 1:
        return (
          <span className="badge b-r-15 txt-bg-success pa-4 d-inline-flex align-items-center justify-content-start gap-1 w-80">
            <i className="ph ph-check-circle"></i>
            {t('commission.status.paid')}
          </span>
        );
      case 2:
        return (
          <span className="badge b-r-15 txt-bg-warning pa-4 d-inline-flex align-items-center justify-content-start gap-1 w-80">
            <i className="ph ph-clock"></i>
            {t('commission.status.pending')}
          </span>
        );
      default:
        return (
          <span className="badge b-r-15 txt-bg-secondary pa-4 d-inline-flex align-items-center justify-content-start gap-1 w-80">
            <i className="ph ph-x-circle"></i>
            {t('commission.status.invalid')}
          </span>
        );
    }
  };

  return (
    <div className="table-responsive">
      <Table
        className="table table-bottom-border align-middle mb-0 text-start"
        hover
        size="sm"
        responsive
      >
        <thead>
          <tr className="text-dark fw-semibold align-middle">
            <th style={{ width: 60 }}>#</th>
            <th>{t('commission.table.completedAt')}</th>
            <th className="d-none d-md-table-cell">{t('commission.table.orderAmount')}</th>
            <th className="d-none d-md-table-cell text-start">
              {t('commission.table.commissionRate')}
            </th>
            <th>{t('commission.table.commission')}</th>
            <th className="text-start">{t('commission.table.status')}</th>
          </tr>
        </thead>
        <tbody>
          {inviteOrders.map((item, idx) => (
            <tr key={item.id}>
              <td>{(currentPage - 1) * pageSize + idx + 1}</td>
              <td>
                <span className="font-monospace">
                  {formatTime(item.created_at, TIME_FORMATS.DATETIME)}
                </span>
              </td>
              <td className="d-none d-md-table-cell">
                <span className="fw-semibold text-primary font-monospace">
                  {formatCurrency(item.total_amount)}
                </span>
              </td>
              <td className="d-none d-md-table-cell text-start">
                <span className="badge b-r-15 txt-bg-info font-monospace pa-4 d-inline-block w-60">
                  {item.commission_rate ?? 0}%
                </span>
              </td>
              <td>
                <span className="fw-bold font-monospace text-success">
                  {formatCurrency(item.commission_balance)}
                </span>
              </td>
              <td className="text-start">{renderCommissionStatus(item.commission_status)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default InviteCommissionDetail;
