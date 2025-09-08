import { Table } from 'reactstrap';
import { useTranslation } from 'react-i18next';

interface PlanNodeOverviewProps {
  nodeOverviews: API_V1.User.PlanNodeOverviewItem[];
}

const PlanNodeOverview: React.FC<PlanNodeOverviewProps> = ({ nodeOverviews }) => {
  const { t } = useTranslation('plan');

  // 获取线路类型图标和名称
  const getRouteTypeInfo = (routeType: string) => {
    const routeTypes: Record<string, { name: string; icon: string }> = {
      direct: {
        name: t('nodeOverview.routeTypes.direct'),
        icon: 'ph-duotone ph-arrow-right text-primary',
      },
      relay: {
        name: t('nodeOverview.routeTypes.relay'),
        icon: 'ph-duotone ph-arrows-clockwise text-warning',
      },
      hybrid: {
        name: t('nodeOverview.routeTypes.hybrid'),
        icon: 'ph-duotone ph-arrows-merge text-success',
      },
    };
    return routeTypes[routeType] || { name: routeType, icon: 'ph-duotone ph-question text-muted' };
  };

  return (
    <div className="table-responsive">
      <Table className="table table-hover mb-0">
        <colgroup>
          {/* 保持4列布局，但调整列宽比例 */}
          <col style={{ width: '35%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '25%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="text-dark small fw-bold pa-10">{t('nodeOverview.headers.region')}</th>
            <th className="text-dark small fw-bold pa-10 text-center">
              {/* 小屏幕下简化表头文字 */}
              <span className="d-none d-sm-inline">{t('nodeOverview.headers.nodeCount')}</span>
              <span className="d-sm-none">{t('nodeOverview.headers.nodeCountShort')}</span>
            </th>
            <th className="text-dark small fw-bold pa-10 text-center">
              {/* 小屏幕下简化表头文字 */}
              <span className="d-none d-sm-inline">{t('nodeOverview.headers.exitIPCount')}</span>
              <span className="d-sm-none">{t('nodeOverview.headers.exitIPCountShort')}</span>
            </th>
            <th className="text-dark small fw-bold pa-10 text-center">
              {/* 小屏幕下简化表头文字 */}
              <span className="d-none d-sm-inline">{t('nodeOverview.headers.routeType')}</span>
              <span className="d-sm-none">{t('nodeOverview.headers.routeTypeShort')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {nodeOverviews.map(item => {
            const routeTypeInfo = getRouteTypeInfo(item.route_type);

            return (
              <tr key={item.id}>
                {/* 地区列 - 小屏幕下垂直布局 */}
                <td className="align-middle pa-10">
                  <div className="d-flex align-items-center">
                    <span className="me-2 f-s-16 flex-shrink-0">{item.flag}</span>
                    <div className="min-w-0 flex-grow-1">
                      {/* 大屏幕：水平排列 */}
                      <div className="d-none d-sm-flex align-items-baseline gap-1">
                        <span className="fw-medium text-dark">{item.country}</span>
                        {item.city && (
                          <>
                            <span className="text-muted">·</span>
                            <span className="small text-muted text-truncate">{item.city}</span>
                          </>
                        )}
                      </div>
                      {/* 小屏幕：垂直排列，防止文字折叠 */}
                      <div className="d-sm-none">
                        <div className="fw-medium text-dark">{item.country}</div>
                        {item.city && <div className="small text-muted">{item.city}</div>}
                      </div>
                    </div>
                  </div>
                </td>

                {/* 节点数量列 - 小屏幕下简化显示 */}
                <td className="align-middle text-center pa-10">
                  <div className="d-flex justify-content-center align-items-baseline gap-1">
                    <span className="text-primary fw-bold">{item.node_count}</span>
                    {/* 大屏幕显示单位文字 */}
                    <span className="small text-muted d-none d-lg-inline">
                      {t('nodeOverview.units.nodes')}
                    </span>
                  </div>
                </td>

                {/* 出口IP数量列 - 小屏幕下简化显示 */}
                <td className="align-middle text-center pa-10">
                  <div className="d-flex justify-content-center align-items-baseline gap-1">
                    <span className="text-primary fw-bold">{item.exit_ip_count}</span>
                    {/* 大屏幕显示单位文字 */}
                    <span className="small text-muted d-none d-lg-inline">
                      {t('nodeOverview.units.exitIPs')}
                    </span>
                  </div>
                </td>

                {/* 线路类型列 - 小屏幕下只显示图标 */}
                <td className="align-middle text-center pa-10">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <i className={`${routeTypeInfo.icon} f-s-16`}></i>
                    {/* 大屏幕显示类型名称 */}
                    <span className="fw-medium text-dark small d-none d-md-inline">
                      {routeTypeInfo.name}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default PlanNodeOverview;
