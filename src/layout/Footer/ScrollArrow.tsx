import React, { useState, useEffect, useRef } from 'react';

const ScrollArrow: React.FC = () => {
  const [showGoTop, setShowGoTop] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = (): void => {
      const pos = document.documentElement.scrollTop;
      const calcHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const newScrollValue = Math.round((pos * 100) / calcHeight);

      // 更新 CSS 变量以控制进度条
      if (scrollRef.current) {
        scrollRef.current.style.setProperty('--scroll-progress', `${newScrollValue}%`);
      }

      if (pos > 100) {
        setShowGoTop(true);
      } else {
        setShowGoTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = (): void => {
    document.documentElement.scrollTop = 0;
  };

  return (
    <div
      ref={scrollRef}
      className={`go-top ${showGoTop ? 'd-grid' : 'd-none'}`}
      onClick={handleClick}
      style={{
        background: `conic-gradient(
          rgba(var(--info),1),
          rgba(var(--primary),1),
          rgba(var(--danger),1),
          rgba(var(--info-dark),1),
          rgba(var(--primary-dark),1),
          rgba(var(--danger-dark),1),
          var(--scroll-progress, 0%),
          rgba(var(--primary),.3) var(--scroll-progress, 0%)
        )`,
      }}
    >
      <span className="progress-value">
        <i className="ti ti-arrow-up"></i>
      </span>
    </div>
  );
};

export default ScrollArrow;
