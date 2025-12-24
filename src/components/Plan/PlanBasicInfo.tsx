import React, { useMemo } from 'react';
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { formatBytesToReadable } from '@helpers/bytes';

interface PlanBasicInfoProps {
  plan: API_V1.User.PlanItem;
  nodeOverviews: API_V1.User.PlanNodeOverviewItem[];
}

// 基于真实数据计算统计信息
const getNodeStats = (nodeOverviews: API_V1.User.PlanNodeOverviewItem[]) => {
  const totalCountries = nodeOverviews.length;
  const totalNodes = nodeOverviews.reduce((sum, item) => sum + item.node_count, 0);
  const totalDirectNodes = nodeOverviews.reduce((sum, item) => sum + item.node_direct_count, 0);
  const totalRelayNodes = nodeOverviews.reduce((sum, item) => sum + item.node_relay_count, 0);
  const totalExitIPs = nodeOverviews.reduce((sum, item) => sum + item.exit_ip_count, 0);

  // 统计所有支持的协议
  const allProtocols = new Set<string>();
  nodeOverviews.forEach(item => {
    item.protocols?.forEach(protocol => {
      allProtocols.add(protocol);
    });
  });

  return {
    totalCountries,
    totalNodes,
    totalDirectNodes,
    totalRelayNodes,
    totalExitIPs,
    supportedProtocols: Array.from(allProtocols).sort(),
  };
};

const PlanBasicInfo: React.FC<PlanBasicInfoProps> = ({ plan, nodeOverviews }) => {
  const { t } = useTranslation('plan');

  const nodeStats = useMemo(() => {
    if (!nodeOverviews || nodeOverviews.length === 0) {
      return {
        totalCountries: 0,
        totalNodes: 0,
        totalDirectNodes: 0,
        totalRelayNodes: 0,
        totalExitIPs: 0,
        supportedProtocols: [],
      };
    }
    return getNodeStats(nodeOverviews);
  }, [nodeOverviews]);

  return (
    <div>
      {/* 第一行：流量配额 + 节点地区 */}
      <Row>
        <Col md={6}>
          <div className="plan-data-item d-flex align-items-center justify-content-between">
            <span className="text-dark small fw-medium">
              {t('basicInfo.labels.trafficQuota')}：
            </span>
            <span className="text-dark small fw-bold">
              <span className="text-primary">{formatBytesToReadable(plan.quota_bytes)}</span>
            </span>
          </div>
        </Col>
        <Col md={6}>
          <div className="plan-data-item d-flex align-items-center justify-content-between">
            <span className="text-dark small fw-medium">{t('basicInfo.labels.nodeRegions')}：</span>
            <span className="text-dark small fw-bold">
              <span className="text-primary fw-bold">{nodeStats.totalCountries}</span>{' '}
              {t('basicInfo.values.countries')}
            </span>
          </div>
        </Col>
      </Row>

      {/* 第二行：续费支持 + 出口IP */}
      <Row>
        <Col md={6}>
          <div className="plan-data-item d-flex align-items-center justify-content-between">
            <span className="text-dark small fw-medium">{t('basicInfo.labels.renewable')}：</span>
            <span className="text-dark small fw-bold">
              {plan.renew ? t('basicInfo.values.supported') : t('basicInfo.values.notSupported')}
            </span>
          </div>
        </Col>
        <Col md={6}>
          <div className="plan-data-item d-flex align-items-center justify-content-between">
            <span className="text-dark small fw-medium">{t('basicInfo.labels.nodeExitIPs')}：</span>
            <span className="text-dark small fw-bold">
              <span className="text-primary">{nodeStats.totalExitIPs}</span>{' '}
              {t('basicInfo.values.ips')}
            </span>
          </div>
        </Col>
      </Row>

      {/* 第三行：支持协议 + 总节点数 */}
      <Row className="mg-b-0">
        <Col md={6}>
          <div className="plan-data-item d-flex align-items-center justify-content-between">
            <span className="text-dark small fw-medium">
              {t('basicInfo.labels.nodeProtocols')}：
            </span>
            <span className="text-dark small fw-bold">
              {nodeStats.supportedProtocols.length > 0
                ? nodeStats.supportedProtocols.join(', ')
                : '-'}
            </span>
          </div>
        </Col>
        <Col md={6}>
          <div className="plan-data-item d-flex align-items-center justify-content-between">
            <span className="text-dark small fw-medium">{t('basicInfo.labels.totalNodes')}：</span>
            <span className="text-dark small fw-bold">
              <span className="text-primary fw-bold">{nodeStats.totalNodes}</span>{' '}
              {t('basicInfo.values.nodes')}
              {(() => {
                const hasDirectNodes = nodeStats.totalDirectNodes > 0;
                const hasRelayNodes = nodeStats.totalRelayNodes > 0;

                if (hasDirectNodes && hasRelayNodes) {
                  return (
                    <span className="text-muted small ms-1">
                      ({t('basicInfo.values.directNodes')}{' '}
                      <span className="text-primary f-fw-600">{nodeStats.totalDirectNodes}</span>
                      个，
                      {t('basicInfo.values.relayNodes')}{' '}
                      <span className="text-primary f-fw-600">{nodeStats.totalRelayNodes}</span>个)
                    </span>
                  );
                } else if (hasDirectNodes) {
                  return (
                    <span className="text-muted small ms-1">
                      ({t('basicInfo.values.directNodes')}{' '}
                      <span className="text-primary f-fw-600">{nodeStats.totalDirectNodes}</span>个)
                    </span>
                  );
                } else if (hasRelayNodes) {
                  return (
                    <span className="text-muted small ms-1">
                      ({t('basicInfo.values.relayNodes')}{' '}
                      <span className="text-primary f-fw-600">{nodeStats.totalRelayNodes}</span>个)
                    </span>
                  );
                }
                return null;
              })()}
            </span>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PlanBasicInfo;
