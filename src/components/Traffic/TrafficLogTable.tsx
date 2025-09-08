import React from 'react';
import { Table } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatBytesToReadable } from '@/helpers/bytes';
import { formatTime, TIME_FORMATS } from '@/helpers/time';

interface TrafficLogTableProps {
  trafficLogsList: API_V1.User.TrafficLogItem[];
  startIndex: number;
}

const TrafficLogTable: React.FC<TrafficLogTableProps> = ({ trafficLogsList, startIndex }) => {
  const { t } = useTranslation('traffic');

  // 格式化流量显示
  const formatTraffic = (bytes: number): string => {
    return formatBytesToReadable(bytes);
  };

  // 格式化请求次数显示
  const formatRequestCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)} M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)} K`;
    }
    return count.toString();
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
            <th>{t('log.table.date')}</th>
            <th className="d-none d-lg-table-cell">{t('log.table.requestCount')}</th>
            <th className="d-none d-md-table-cell">{t('log.table.uploadTraffic')}</th>
            <th className="d-none d-md-table-cell">{t('log.table.downloadTraffic')}</th>
            <th>{t('log.table.totalTraffic')}</th>
          </tr>
        </thead>
        <tbody>
          {trafficLogsList.map((item, idx) => {
            const totalTraffic = Number(item.u).valueOf() + Number(item.d).valueOf();
            return (
              <tr key={item.id}>
                <td>{startIndex + idx + 1}</td>
                <td>
                  <span className="font-monospace">
                    {formatTime(item.log_at, TIME_FORMATS.DATE)}
                  </span>
                </td>
                <td className="d-none d-lg-table-cell">
                  <span className="text-info fw-semibold font-monospace">
                    <i className="ph-duotone ph-graph me-1"></i>
                    {formatRequestCount(item.n)}
                  </span>
                </td>
                <td className="d-none d-md-table-cell">
                  <span className="text-danger fw-semibold font-monospace">
                    <i className="ph-duotone ph-upload me-1"></i>
                    {formatTraffic(item.u)}
                  </span>
                </td>
                <td className="d-none d-md-table-cell">
                  <span className="text-success fw-semibold font-monospace">
                    <i className="ph-duotone ph-download me-1"></i>
                    {formatTraffic(item.d)}
                  </span>
                </td>
                <td>
                  <span className="text-primary fw-semibold font-monospace">
                    <i className="ph-duotone ph-chart-line me-1"></i>
                    {formatTraffic(totalTraffic)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default TrafficLogTable;
