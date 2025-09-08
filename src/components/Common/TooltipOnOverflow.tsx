import React, { useState, useEffect, useRef } from 'react';
import { UncontrolledTooltip } from 'reactstrap';

interface TooltipOnOverflowProps {
  text: string;
  children: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  id?: string;
  fade?: boolean;
}

const TooltipOnOverflow: React.FC<TooltipOnOverflowProps> = ({
  text,
  children,
  placement = 'top',
  className = '',
  id,
  fade = false,
}) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [elementId, setElementId] = useState<string>('');
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Generate unique ID if not provided
    const uniqueId = id ?? `tooltip-overflow-${Math.random().toString(36).substr(2, 9)}`;
    setElementId(uniqueId);
  }, [id]);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const element = textRef.current;
        const isElementOverflowing =
          element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight;
        setIsOverflowing(isElementOverflowing);
      }
    };

    // Check overflow on mount and when content changes
    checkOverflow();

    // Check overflow on window resize
    const handleResize = () => {
      checkOverflow();
    };

    window.addEventListener('resize', handleResize);

    // Create a ResizeObserver to watch for element size changes
    let resizeObserver: ResizeObserver | null = null;
    if (textRef.current && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(checkOverflow);
      resizeObserver.observe(textRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [text]);

  return (
    <>
      {React.cloneElement(children as React.ReactElement, {
        ref: textRef,
        id: elementId,
        className:
          `${(children as React.ReactElement<{ className?: string }>).props.className ?? ''} ${className}`.trim(),
      })}
      {isOverflowing && elementId && (
        <UncontrolledTooltip target={elementId} placement={placement} fade={fade}>
          {text}
        </UncontrolledTooltip>
      )}
    </>
  );
};

export default TooltipOnOverflow;
