import { useMemo, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import TrafficLogTable from '@components/Traffic/TrafficLogTable';
import TrafficHeatMap from '@components/Traffic/TrafficHeatMap';
import Pagination from '@components/Common/Pagination';
import { useTrafficLogs, useTrafficHeatMap } from '@/hooks/useUser';
import Loading from '@components/Common/Loading';
import EmptyState from '@components/Common/EmptyState';

interface TrafficHeatMapData {
  [date: string]: API_V1.User.TrafficHeatMapItem;
}

interface Stats {
  totalUp: string;
  totalDown: string;
  totalTraffic: string;
  totalRequests: number;
  avgDailyTraffic: string;
  daysCount: number;
}

const Traffic = () => {
  const { t } = useTranslation('traffic');
  const { t: tCommon } = useTranslation('common');
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 使用 useTrafficLogs hook 获取流量日志数据
  const {
    trafficLogs,
    total,
    isLoading,
    isError: _isError,
    error: _error,
  } = useTrafficLogs(
    {
      pageSize,
      current: currentPage,
    },
    true, // enabled
  );

  // 使用 useTrafficHeatMap hook 获取流量热力图数据
  const { trafficHeatMap: heatMapData, isLoading: heatMapLoading } = useTrafficHeatMap(
    {
      // start_at 参数可选，如果不传则获取所有数据
    },
    true, // enabled
  );

  // 计算统计数据
  const stats = useMemo((): Stats => {
    if (!heatMapData) {
      return {
        totalUp: '0.00',
        totalDown: '0.00',
        totalTraffic: '0.00',
        totalRequests: 0,
        avgDailyTraffic: '0.00',
        daysCount: 0,
      };
    }

    const values = Object.values(heatMapData as TrafficHeatMapData);

    // 安全的数值转换函数
    const safeNumber = (value: any): number => {
      const num = parseFloat(String(value));
      return isNaN(num) || !isFinite(num) ? 0 : num;
    };

    // 计算各项数据，确保数值安全
    const totalUpBytes = values.reduce((sum, item) => sum + safeNumber(item.u), 0);
    const totalDownBytes = values.reduce((sum, item) => sum + safeNumber(item.d), 0);
    const totalTrafficBytes = values.reduce((sum, item) => sum + safeNumber(item.total), 0);
    const totalRequests = values.reduce((sum, item) => sum + safeNumber(item.n), 0);

    // 转换为 GB
    const totalUp = totalUpBytes / (1024 * 1024 * 1024);
    const totalDown = totalDownBytes / (1024 * 1024 * 1024);
    const totalTraffic = totalTrafficBytes / (1024 * 1024 * 1024);

    const daysCount = values.length;
    const avgDailyTraffic = daysCount > 0 ? totalTraffic / daysCount : 0;

    // 确保所有数值都是有限的
    return {
      totalUp: isFinite(totalUp) ? totalUp.toFixed(2) : '0.00',
      totalDown: isFinite(totalDown) ? totalDown.toFixed(2) : '0.00',
      totalTraffic: isFinite(totalTraffic) ? totalTraffic.toFixed(2) : '0.00',
      totalRequests: isFinite(totalRequests) ? Math.floor(totalRequests) : 0,
      avgDailyTraffic: isFinite(avgDailyTraffic) ? avgDailyTraffic.toFixed(2) : '0.00',
      daysCount,
    };
  }, [heatMapData]);

  // 计算分页信息
  const totalPages = useMemo(() => {
    if (!total) return 0;
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const startIndex = useMemo(() => {
    return (currentPage - 1) * pageSize;
  }, [currentPage, pageSize]);

  // 分页操作函数
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 格式化请求次数显示（仅用于统计卡片）
  const formatRequestCount = (count: number): string => {
    // 确保输入是有效数字
    if (!isFinite(count) || isNaN(count) || count < 0) {
      return '0';
    }

    // 转换为整数
    const intCount = Math.floor(count);

    if (intCount >= 1000000) {
      return `${(intCount / 1000000).toFixed(1)} M`;
    } else if (intCount >= 1000) {
      return `${(intCount / 1000).toFixed(1)} K`;
    }
    return intCount.toString();
  };

  return (
    <div className="min-vh-100">
      <Container fluid className="py-4">
        {/* 顶部主标题 */}
        <Row className="mg-b-20">
          <Col xs={12}>
            <h4 className="main-title">
              <i className="ph-duotone ph-chart-bar me-2"></i>
              {t('title')}
            </h4>
          </Col>
        </Row>

        {/* 流量统计卡片 */}
        <Row className="mg-b-2">
          {heatMapLoading ? (
            <Col xs={12}>
              <Loading text={tCommon('loading')} variant="spinner" />
            </Col>
          ) : (
            <>
              {/* 第一行：3个统计卡片 */}
              <Col lg={4} md={6}>
                <Card className="text-center shadow-sm">
                  <CardBody className="py-3">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="ph-duotone ph-upload text-danger fs-3"></i>
                    </div>
                    <h5 className="text-danger mb-1">{stats.totalUp} GB</h5>
                    <p className="text-muted mb-0 small">{t('stats.totalUpload')}</p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={4} md={6} className="mb-2">
                <Card className="text-center shadow-sm">
                  <CardBody className="py-3">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="ph-duotone ph-download text-success fs-3"></i>
                    </div>
                    <h5 className="text-success mb-1">{stats.totalDown} GB</h5>
                    <p className="text-muted mb-0 small">{t('stats.totalDownload')}</p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={4} md={6} className="mb-2">
                <Card className="text-center shadow-sm">
                  <CardBody className="py-3">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="ph-duotone ph-chart-line text-primary fs-3"></i>
                    </div>
                    <h5 className="text-primary mb-1">{stats.totalTraffic} GB</h5>
                    <p className="text-muted mb-0 small">{t('stats.totalTraffic')}</p>
                  </CardBody>
                </Card>
              </Col>
              {/* 第二行：3个统计卡片 */}
              <Col lg={4} md={6} className="mb-2">
                <Card className="text-center shadow-sm">
                  <CardBody className="py-3">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="ph-duotone ph-graph text-info fs-3"></i>
                    </div>
                    <h5 className="text-info mb-1">{formatRequestCount(stats.totalRequests)}</h5>
                    <p className="text-muted mb-0 small">{t('stats.totalRequests')}</p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={4} md={6} className="mb-2">
                <Card className="text-center shadow-sm">
                  <CardBody className="py-3">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="ph-duotone ph-gauge text-secondary fs-3"></i>
                    </div>
                    <h5 className="text-secondary mb-1">{stats.avgDailyTraffic} GB</h5>
                    <p className="text-muted mb-0 small">{t('stats.avgDailyTraffic')}</p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg={4} md={6} className="mb-2">
                <Card className="text-center shadow-sm">
                  <CardBody className="py-3">
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <i className="ph-duotone ph-calendar text-info fs-3"></i>
                    </div>
                    <h5 className="text-info mb-1">{stats.daysCount}</h5>
                    <p className="text-muted mb-0 small">{t('stats.statisticsDays')}</p>
                  </CardBody>
                </Card>
              </Col>
            </>
          )}
        </Row>

        {/* 流量热力图 */}
        <Row className="mg-b-10">
          <Col xs={12}>
            <Card>
              <CardHeader>
                <h5 className="f-fw-600 mg-b-0 text-dark">
                  <i className="ph-duotone ph-chart-line-up me-2"></i>
                  {t('heatMap.title')}
                </h5>
              </CardHeader>
              <CardBody>
                {heatMapLoading ? (
                  <Loading text={tCommon('loading')} variant="spinner" />
                ) : (
                  <TrafficHeatMap data={heatMapData} />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* 流量日志列表 */}
        <Row className="mb-4 mg-b-20">
          <Col xs={12}>
            <Card className="mb-4">
              <CardHeader>
                <h5 className="f-fw-600 mg-b-0 text-dark">
                  <i className="ph-duotone ph-database me-2"></i>
                  {t('log.title')}
                </h5>
              </CardHeader>
              <CardBody>
                {isLoading ? (
                  <Loading text={tCommon('loading')} variant="spinner" />
                ) : !trafficLogs || trafficLogs.length === 0 ? (
                  <EmptyState icon="iconoir-glass-empty" title={tCommon('noData')} />
                ) : (
                  <>
                    <TrafficLogTable trafficLogsList={trafficLogs} startIndex={startIndex} />
                    {/* 分页组件 - 只在有数据时显示 */}
                    {total && total > 0 && (
                      <div className="mt-3">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Traffic;
