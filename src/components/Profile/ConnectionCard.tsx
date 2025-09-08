import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Button, Badge, CardHeader } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import TelegramBindStepsModal from '@components/Profile/TelegramBindStepsModal';

import TelegramUnbindConfirmModal from '@components/Profile/TelegramUnbindConfirmModal';
import { unbindTelegram } from '@/api/v1/user';
import { useTelegramBotInfo, useSubscribe } from '@/hooks/useUser';
import toast from '@helpers/toast';

interface ConnectionCardProps {
  userInfo?: API_V1.User.InfoItem;
  profileConfig?: API_V1.User.ProfileConfigItem;
  onUserInfoMutate?: () => Promise<void>;
}

const ConnectionCard: React.FC<ConnectionCardProps> = ({
  userInfo,
  profileConfig,
  onUserInfoMutate,
}) => {
  const { t } = useTranslation('profile');
  // 获取 Telegram Bot 信息
  const { telegramBotInfo } = useTelegramBotInfo();

  // 获取订阅信息
  const { subscribeInfo } = useSubscribe();

  // 模态框状态
  const [showUnbindModal, setShowUnbindModal] = useState<boolean>(false);
  const [showStepsModal, setShowStepsModal] = useState<boolean>(false);

  // 操作状态
  const [isUnbinding, setIsUnbinding] = useState<boolean>(false);

  // 获取 Telegram 讨论组链接
  const telegramDiscussLink =
    profileConfig?.telegram_discuss_link ?? 'https://t.me/your_group_name';

  // 获取机器人用户名
  const botUsername = telegramBotInfo?.username;

  // 检查是否已绑定
  const isBound = userInfo?.telegram_id != null;

  const handleTelegramJoin = (): void => {
    window.open(telegramDiscussLink, '_blank');
  };

  // 显示绑定步骤
  const handleShowBindSteps = (): void => {
    setShowStepsModal(true);
  };

  // 解绑Telegram
  const handleUnbindTelegram = async (): Promise<void> => {
    setIsUnbinding(true);

    try {
      await unbindTelegram();

      // 刷新用户信息
      if (onUserInfoMutate) {
        await onUserInfoMutate();
      }

      toast.success(t('telegram.success.unbound'));
      setShowUnbindModal(false);
    } catch (error) {
      console.error('Failed to unbind Telegram:', error);
      toast.error(t('telegram.error.unbindFailed'));
    } finally {
      setIsUnbinding(false);
    }
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <h5>{t('connection.title')}</h5>
        </CardHeader>
        <CardBody className="p-4">
          <Row className="g-4">
            {/* Telegram讨论组 */}
            <Col lg="6">
              <div className="border rounded-3 p-4 h-100">
                <div className="d-flex flex-column h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle p-2 me-3">
                      <i className="ph-duotone ph-telegram-logo fs-3 text-muted"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold">{t('connection.telegramGroup.title')}</h6>
                      <Badge color="info" className="badge-sm">
                        <i className="ph-users me-1"></i>
                        {t('connection.telegramGroup.badge')}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-muted mb-3 flex-grow-1 lh-base">
                    {t('connection.telegramGroup.description')}
                  </p>

                  <div className="mt-auto">
                    <Button
                      color="dark"
                      outline
                      size="sm"
                      onClick={handleTelegramJoin}
                      className="w-100"
                    >
                      <i className="ph-duotone ph-telegram-logo me-2"></i>
                      {t('connection.telegramGroup.joinButton')}
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            {/* Telegram机器人绑定 */}
            <Col lg="6">
              <div className="border rounded-3 p-4 h-100">
                <div className="d-flex flex-column h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle p-2 me-3">
                      <i className="ph-duotone ph-robot fs-3 text-muted"></i>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-1 fw-semibold">{t('connection.telegramBot.title')}</h6>
                      {isBound ? (
                        <Badge color="success" className="badge-sm">
                          <i className="ph-check me-1"></i>
                          {t('connection.telegramBot.status.bound')}
                        </Badge>
                      ) : (
                        <Badge color="secondary" className="badge-sm">
                          <i className="ph-x me-1"></i>
                          {t('connection.telegramBot.status.unbound')}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-muted mb-3 flex-grow-1 lh-base">
                    {isBound
                      ? t('connection.telegramBot.description.bound', {
                          telegramId: userInfo?.telegram_id ?? '',
                        })
                      : t('connection.telegramBot.description.unbound')}
                  </p>

                  <div className="mt-auto">
                    {isBound ? (
                      <Button
                        color="dark"
                        outline
                        size="sm"
                        onClick={() => setShowUnbindModal(true)}
                        disabled={isUnbinding}
                        className="w-100"
                      >
                        {isUnbinding ? (
                          <>
                            <i className="ph-spinner ph-spin me-2"></i>
                            {t('connection.telegramBot.actions.unbinding')}
                          </>
                        ) : (
                          <>
                            <i className="ph-link-break me-2"></i>
                            {t('connection.telegramBot.actions.unbind')}
                          </>
                        )}
                      </Button>
                    ) : botUsername && subscribeInfo?.subscribe_url ? (
                      <Button
                        color="primary"
                        size="sm"
                        onClick={handleShowBindSteps}
                        className="w-100"
                      >
                        <i className="ph-duotone ph-robot me-2"></i>
                        {t('connection.telegramBot.actions.bind')}
                      </Button>
                    ) : (
                      <Button color="secondary" size="sm" disabled className="w-100">
                        <i className="ph-robot me-2"></i>
                        {t('connection.telegramBot.actions.serviceUnavailable')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>

      {/* 绑定步骤说明模态框 */}
      {botUsername && subscribeInfo?.subscribe_url && (
        <TelegramBindStepsModal
          isOpen={showStepsModal}
          toggle={() => setShowStepsModal(false)}
          subscribeUrl={subscribeInfo.subscribe_url}
          botUsername={botUsername}
          onUserInfoMutate={onUserInfoMutate}
        />
      )}

      {/* 解绑确认模态框 */}
      <TelegramUnbindConfirmModal
        isOpen={showUnbindModal}
        toggle={() => setShowUnbindModal(false)}
        isUnbinding={isUnbinding}
        onConfirmUnbind={handleUnbindTelegram}
      />
    </>
  );
};

export default ConnectionCard;
