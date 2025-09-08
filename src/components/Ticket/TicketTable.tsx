import { Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TooltipOnOverflow from '@components/Common/TooltipOnOverflow';
import { formatTime, TIME_FORMATS } from '@helpers/time';

interface TicketTableProps {
  tickets: API_V1.User.TicketItem[];
  onOpenCloseModal: (ticket: API_V1.User.TicketItem) => void;
}

const TicketTable = ({ tickets, onOpenCloseModal }: TicketTableProps) => {
  const { t } = useTranslation('ticket');

  const getStatusText = (status: number): string => {
    switch (status) {
      case 0:
        return t('table.statusOpen');
      case 1:
        return t('table.statusClosed');
      default:
        return t('table.statusUnknown');
    }
  };

  const getPriorityText = (level: number): string => {
    switch (level) {
      case 0:
        return t('table.priorityLow');
      case 1:
        return t('table.priorityMedium');
      case 2:
        return t('table.priorityHigh');
      default:
        return t('table.priorityUnknown');
    }
  };

  const getStatusBadgeClass = (status: number): string => {
    switch (status) {
      case 0:
        return 'badge text-outline-success'; // 开放状态 - 绿色
      case 1:
        return 'badge text-outline-secondary'; // 关闭状态 - 灰色
      default:
        return 'badge text-outline-warning';
    }
  };

  const getPriorityBadgeClass = (level: number): string => {
    switch (level) {
      case 0:
        return 'badge text-outline-info'; // 低优先级 - 蓝色
      case 1:
        return 'badge text-outline-warning'; // 中等优先级 - 黄色
      case 2:
        return 'badge text-outline-danger'; // 高优先级 - 红色
      default:
        return 'badge text-outline-secondary';
    }
  };

  return (
    <div className="table-responsive">
      <Table className="table-bottom-border table table-hover mb-0">
        <thead>
          <tr>
            <th>{t('table.number')}</th>
            <th>{t('table.subject')}</th>
            <th className="d-none d-md-table-cell">{t('table.priority')}</th>
            <th>{t('table.status')}</th>
            <th className="d-none d-lg-table-cell">{t('table.createdAt')}</th>
            <th className="d-none d-lg-table-cell">{t('table.updatedAt')}</th>
            <th>{t('table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.random_id}>
              <td>
                <Link
                  to={`/ticket/${ticket.random_id}`}
                  className="text-primary text-decoration-none fw-medium fw-bold cursor-pointer font-monospace"
                >
                  #{ticket.random_id?.toString().substring(0, 6)}
                </Link>
              </td>
              <td className="position-relative">
                <TooltipOnOverflow text={ticket.subject} placement="top" fade={false}>
                  <span className="txt-ellipsis-1 cursor-pointer d-inline-block w-105">
                    {ticket.subject}
                  </span>
                </TooltipOnOverflow>
              </td>
              <td className="d-none d-md-table-cell">
                <span className={getPriorityBadgeClass(ticket.level)}>
                  {getPriorityText(ticket.level)}
                </span>
              </td>
              <td>
                <span className={getStatusBadgeClass(ticket.status)}>
                  {getStatusText(ticket.status)}
                </span>
              </td>
              <td className="d-none d-lg-table-cell">
                <span className="font-monospace">
                  {formatTime(ticket.created_at, TIME_FORMATS.DATETIME)}
                </span>
              </td>
              <td className="d-none d-lg-table-cell">
                <span className="font-monospace">
                  {formatTime(ticket.updated_at, TIME_FORMATS.DATETIME)}
                </span>
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
                      <Link className="dropdown-item" to={`/ticket/${ticket.random_id}`}>
                        <i className="ti ti-eye text-primary me-2"></i>
                        {t('table.view')}
                      </Link>
                    </li>
                    {ticket.status === 0 && (
                      <li>
                        <button
                          className="dropdown-item text-warning border-0 bg-transparent w-100 text-start"
                          onClick={() => onOpenCloseModal(ticket)}
                        >
                          <i className="ti ti-lock text-warning me-2"></i>
                          {t('table.close')}
                        </button>
                      </li>
                    )}
                  </ul>
                </div>

                {/* 大屏幕按钮组 */}
                <div className="d-none d-md-flex justify-content-start">
                  <Link
                    className="btn btn-outline-primary icon-btn w-30 h-30 b-r-22 me-2"
                    to={`/ticket/${ticket.random_id}`}
                    title={t('table.viewTitle')}
                  >
                    <i className="ti ti-eye"></i>
                  </Link>
                  {ticket.status === 0 && (
                    <button
                      type="button"
                      className="icon-btn w-30 h-30 b-r-22 btn btn-outline-danger"
                      onClick={() => onOpenCloseModal(ticket)}
                      title={t('table.closeTitle')}
                    >
                      <i className="ti ti-lock"></i>
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

export default TicketTable;
