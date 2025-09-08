import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { getCurrentTimestamp } from '../../helpers/time';
import { getProtocolColor } from '../../helpers/protocol';

// 定义代理协议类型

// 定义组件Props接口
interface ServerNodeCardProps {
  server: API_V1.User.ServerItem;
  index: number;
}

// 判断节点是否在线的函数 - 15分钟超时
const isServerOnline = (lastCheckAt: number): boolean => {
  const currentTime = getCurrentTimestamp();
  const timeDiff = currentTime - lastCheckAt;
  return timeDiff < 900; // 15分钟 = 900秒
};

const ServerNodeCard: React.FC<ServerNodeCardProps> = ({ server, index }) => {
  const { t } = useTranslation('dashboard');
  const isOnline = isServerOnline(server.last_check_at);

  // 获取状态文本
  const getStatusText = (isOnline: boolean): string => {
    return isOnline ? t('serverNode.status.online') : t('serverNode.status.offline');
  };

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <Card className="h-100 b-r-15 border server-node-card">
        <CardBody className="pa-20 position-relative">
          {/* 卡片顶部：序号 + 名称 + 在线状态 */}
          <div className="d-flex justify-content-between align-items-start mg-b-18">
            <div className="d-flex align-items-center flex-grow-1 mg-e-12">
              <span className="badge txt-bg-primary f-fw-700 mg-e-12 pa-4 pa-s-10 pa-e-10 b-r-8">
                #{String(index + 1).padStart(2, '0')}
              </span>
              <h6 className="f-fw-600 text-dark mg-b-0">{server.name}</h6>
            </div>
            {/* 在线状态指示器 */}
            <div className="position-relative">
              <span
                className={`badge f-fw-600 pa-4 pa-s-10 pa-e-10 b-r-20 d-flex align-items-center ${
                  isOnline ? 'txt-bg-success' : 'txt-bg-danger'
                }`}
              >
                <i
                  className={`ph-duotone ${isOnline ? 'ph-check-circle' : 'ph-x-circle'} mg-e-6`}
                ></i>
                {getStatusText(isOnline)}
              </span>
            </div>
          </div>

          {/* 协议和倍率信息行 */}
          <div className="d-flex align-items-center justify-content-between mg-b-16">
            <div className="d-flex align-items-center" style={{ gap: '8px' }}>
              {/* 协议徽章 - 带图标和颜色 */}
              <span
                className={`badge f-fw-600 pa-4 pa-s-10 pa-e-10 b-r-8 d-flex align-items-center ${getProtocolColor(server.type)}`}
              >
                {server.type.toUpperCase()}
              </span>
              {/* 倍率徽章 */}
              <span
                className={`badge f-fw-600 pa-4 pa-s-10 pa-e-10 b-r-8 d-flex align-items-center ${
                  +server.display_rate >= 1
                    ? 'txt-bg-success'
                    : +server.display_rate >= 0.9
                      ? 'txt-bg-warning'
                      : 'txt-bg-secondary'
                }`}
              >
                <i className="ph-duotone ph-gauge mg-e-6"></i>
                {server.display_rate}x
              </span>
            </div>
            {/* 标签计数指示器 */}
            <div className="d-flex align-items-center text-secondary">
              <i className="ph-duotone ph-tag mg-e-6"></i>
              <span className="f-fw-500">
                {server.tags && server.tags.length > 0 ? server.tags.length : 0}
              </span>
            </div>
          </div>

          {/* 标签区域 - 优化样式和布局 */}
          <div className="tags-container mg-t-6">
            {server.tags && server.tags.length > 0 ? (
              <div className="d-flex flex-wrap" style={{ gap: '6px' }}>
                {server.tags.slice(0, 4).map((tag: string) => (
                  <span
                    key={`${server.id}-tag-${tag}`}
                    className="badge txt-bg-info f-fw-500 pa-2 pa-s-8 pa-e-8 b-r-12"
                  >
                    {tag}
                  </span>
                ))}
                {server.tags.length > 4 && (
                  <span className="badge txt-bg-secondary f-fw-500 pa-2 pa-s-8 pa-e-8 b-r-12">
                    +{server.tags.length - 4}
                  </span>
                )}
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-end pa-6 b-r-6">
                <i className="ph-duotone ph-tag-simple mg-e-6 text-secondary"></i>
                <span className="f-fw-400 text-secondary">{t('serverNode.noTags')}</span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ServerNodeCard;
