import React from 'react';
import { useTheme } from '@/hooks';

const HeaderMode: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="header-dark" onClick={toggleTheme}>
      <div className={`sun-logo head-icon ${theme === 'dark' ? 'sun' : ''}`}>
        <i className="ph ph-moon-stars" />
      </div>
      <div className={`moon-logo head-icon ${theme === 'dark' ? 'moon' : ''}`}>
        <i className="ph ph-sun-dim" />
      </div>
    </div>
  );
};

export default HeaderMode;
