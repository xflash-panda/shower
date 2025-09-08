import { useEffect, useState, useCallback } from 'react';
import { Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '@/helpers/currency';

interface PaymentCelebrationProps {
  isVisible: boolean;
  orderAmount: number;
  onComplete: () => void;
  autoRedirectSeconds?: number;
  orderTradeNo?: string; // 新增订单号参数，用于跳转到具体订单详情
}

const PaymentCelebration: React.FC<PaymentCelebrationProps> = ({
  isVisible,
  orderAmount,
  onComplete,
  autoRedirectSeconds = 15,
  orderTradeNo,
}) => {
  const { t } = useTranslation('order');
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(autoRedirectSeconds);
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'celebrate' | 'exit'>('enter');

  // 浏览器通知函数
  const showBrowserNotification = useCallback(() => {
    // 请求通知权限
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(t('celebration.notification.title'), {
          body: t('celebration.notification.body', { amount: formatCurrency(orderAmount) }),
          icon: '/favicon.ico',
          tag: 'payment-success',
          requireInteraction: true,
        });
      } else if (Notification.permission !== 'denied') {
        void Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(t('celebration.notification.title'), {
              body: t('celebration.notification.body', { amount: formatCurrency(orderAmount) }),
              icon: '/favicon.ico',
              tag: 'payment-success',
              requireInteraction: true,
            });
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderAmount]);

  // 播放成功音效（可选）
  const playSuccessSound = useCallback(() => {
    try {
      // 创建一个简单的成功音效
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Sound playback failed:', error);
    }
  }, []);

  // 主要效果触发
  useEffect(() => {
    if (!isVisible) return;

    setAnimationPhase('enter');

    // 延迟触发庆祝效果
    const celebrationTimer = setTimeout(() => {
      setAnimationPhase('celebrate');
      showBrowserNotification();
      playSuccessSound();
    }, 500);

    return () => clearTimeout(celebrationTimer);
  }, [isVisible, showBrowserNotification, playSuccessSound]);

  // 移除自动跳转的倒计时逻辑，保留倒计时显示但不执行跳转
  useEffect(() => {
    if (!isVisible || animationPhase !== 'celebrate') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // 倒计时结束时只关闭庆祝动画，不跳转页面
          setAnimationPhase('exit');
          setTimeout(() => {
            onComplete();
            // 移除自动跳转逻辑
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, animationPhase, onComplete]);

  const handleGoToOrders = () => {
    setAnimationPhase('exit');
    setTimeout(() => {
      onComplete();
      // 如果有订单号，跳转到订单详情页面，否则跳转到订单列表
      if (orderTradeNo) {
        navigate(`/order/${orderTradeNo}`);
      } else {
        navigate('/order');
      }
    }, 300);
  };

  const handleGoToDashboard = () => {
    setAnimationPhase('exit');
    setTimeout(() => {
      onComplete();
      navigate('/dashboard');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 全屏遮罩 */}
      <div
        className={`position-fixed w-100 h-100 d-flex align-items-center justify-content-center order-payment-overlay ${animationPhase}`}
        style={{
          top: 0,
          left: 0,
          zIndex: 9999,
          background: `rgba(var(--success), 0.95)`,
        }}
      >
        <div className="text-center pa-20">
          {/* 成功图标 */}
          <div className="mg-b-30">
            <div
              className={`d-inline-flex align-items-center justify-content-center bg-success text-white b-r-50 ${
                animationPhase === 'celebrate' ? 'animate-bounce' : ''
              }`}
              style={{ width: '80px', height: '80px', fontSize: '2rem' }}
            >
              <i className="ti ti-check"></i>
            </div>
          </div>

          {/* 成功文字 */}
          <div className="mg-b-30">
            <h1
              className={`h1 f-fw-600 mg-b-20  text-white ${
                animationPhase === 'celebrate' ? 'animate-fadeInUp-delay-1' : ''
              }`}
            >
              {t('celebration.title')}
            </h1>
            <p
              className={`text-white  ${
                animationPhase === 'celebrate' ? 'animate-fadeInUp-delay-2' : ''
              }`}
            >
              {t('celebration.message', { amount: formatCurrency(orderAmount) })}
            </p>
          </div>

          {/* 倒计时和按钮 */}
          {animationPhase === 'celebrate' && (
            <div className={animationPhase === 'celebrate' ? 'animate-fadeInUp-delay-3' : ''}>
              <div className="mg-b-30 text-muted text-white">
                <i className="ti ti-clock me-2"></i>
                {t('celebration.countdown', { seconds: countdown })}
              </div>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button
                  color="light"
                  size="lg"
                  onClick={handleGoToOrders}
                  className="text-success f-fw-600"
                >
                  <i className="ti ti-list me-2"></i>
                  {t('celebration.actions.viewOrders')}
                </Button>
                <Button
                  color="light"
                  size="lg"
                  onClick={handleGoToDashboard}
                  outline
                  className="text-white border-white f-fw-600"
                >
                  <i className="ti ti-dashboard me-2"></i>
                  {t('celebration.actions.backToDashboard')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentCelebration;
