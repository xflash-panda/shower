import { Suspense, useEffect } from 'react';
import type { ReactElement } from 'react';
import { HashRouter } from 'react-router-dom';
import Routes from './routes';
import AppRouteListener from '@/components/Common/AppRouteListener';
import { SwrProvider } from '@/providers';
import { cleanupExpiredEmailCodeCountdowns } from '@/hooks/useEmailCodeCountdown';
import './App';
import '../public/assets/css/style.css';
import './scss/style.scss';
import './scss/responsive.scss';
import PageLoader from '@/components/Common/PageLoader';

const App = (): ReactElement => {
  // 应用启动时清理过期的倒计时记录
  useEffect(() => {
    cleanupExpiredEmailCodeCountdowns();
  }, []);

  return (
    <Suspense fallback={<PageLoader />}>
      <HashRouter>
        <SwrProvider>
          <AppRouteListener />
          <Routes />
        </SwrProvider>
      </HashRouter>
    </Suspense>
  );
};

export default App;
