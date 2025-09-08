import { Link } from 'react-router-dom';
import { Table } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/helpers/currency';

interface StatusInfo {
  text: string;
  color: string;
}

interface OrderTableProps {
  orders: API_V1.User.OrderItem[];
  currentPage: number;
  pageSize: number;
  onCloseOrder: (order: API_V1.User.OrderItem) => void;
}

const OrderTable = ({
  orders,
  currentPage,
  pageSize,
  onCloseOrder,
}: OrderTableProps): JSX.Element => {
  const { t } = useTranslation('order');

  // 配置映射
  const statusMap: Record<number, StatusInfo> = {
    0: { text: t('table.status.pending'), color: 'warning' },
    1: { text: t('table.status.processing'), color: 'info' },
    2: { text: t('table.status.cancelled'), color: 'secondary' },
    3: { text: t('table.status.completed'), color: 'success' },
    4: { text: t('table.status.credited'), color: 'dark' },
  };

  // 工具函数
  const formatTime = (timestamp: number | null): string => {
    if (!timestamp) return '-';
    return new Date(timestamp * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="table-responsive">
      <Table className="table-bottom-border align-middle mb-0 text-start">
        <thead>
          <tr>
            <th className="d-none d-md-table-cell">#</th>
            <th>{t('table.headers.orderNumber')}</th>
            <th>{t('table.headers.amount')}</th>
            <th>{t('table.headers.status')}</th>
            <th className="d-none d-md-table-cell">{t('table.headers.createTime')}</th>
            <th>{t('table.headers.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.trade_no}>
              <td className="d-none d-md-table-cell">
                <small>{(currentPage - 1) * pageSize + index + 1}</small>
              </td>
              <td className="text-nowrap">
                <Link
                  to={`/order/${order.trade_no}`}
                  className="font-monospace text-primary fw-semibold d-block text-decoration-none cursor-pointer"
                  title={order.trade_no}
                >
                  <span className="d-md-none ">
                    {/* 小屏幕显示前8位...后4位 */}
                    {order.trade_no.length > 12
                      ? `${order.trade_no.substring(0, 8)}...${order.trade_no.slice(-4)}`
                      : order.trade_no}
                  </span>
                  <span className="d-none d-md-inline">
                    {/* 大屏幕显示完整订单号 */}
                    {order.trade_no}
                  </span>
                </Link>
              </td>
              <td className="text-nowrap">
                <span className="fw-semibold d-block ">{formatCurrency(order.total_amount)}</span>
              </td>
              <td className="text-nowrap">
                <span
                  className={`badge ${
                    order.status === 4
                      ? 'bg-dark text-white'
                      : `text-light-${statusMap[order.status]?.color ?? 'secondary'}`
                  }`}
                >
                  {statusMap[order.status]?.text ?? '-'}
                </span>
              </td>
              <td className="d-none d-md-table-cell">
                <span className="font-monospace">{formatTime(order.created_at)}</span>
              </td>
              <td className="text-start">
                {/* 小屏幕下拉菜单 */}
                <div className="btn-group dropdown-icon-none d-md-none">
                  <button
                    className="btn border-0 icon-btn b-r-4 dropdown-toggle active btn-sm"
                    type="button"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="true"
                    aria-expanded="false"
                  >
                    <i className="ti ti-dots-vertical"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to={`/order/${order.trade_no}`}>
                        <i className="ti ti-eye text-primary me-2"></i>
                        {t('table.actions.view')}
                      </Link>
                    </li>
                    {(order.status === 0 || order.status === 1) && (
                      <li>
                        <button
                          className="dropdown-item text-danger border-0 bg-transparent w-100 text-start"
                          onClick={() => onCloseOrder(order)}
                        >
                          <i className="ti ti-ban text-danger me-2"></i>
                          {t('table.actions.close')}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                {/* 大屏幕按钮组 */}
                <div className="d-none d-md-flex justify-content-start">
                  <Link
                    className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                    to={`/order/${order.trade_no}`}
                    title={t('detail.actions.viewOrderDetails')}
                  >
                    <i className="ti ti-eye"></i>
                  </Link>
                  {(order.status === 0 || order.status === 1) && (
                    <button
                      type="button"
                      className="icon-btn w-30 h-30 b-r-22 btn btn-outline-danger"
                      onClick={() => onCloseOrder(order)}
                      title={t('detail.actions.closeOrder')}
                    >
                      <i className="ti ti-ban"></i>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderTable;
