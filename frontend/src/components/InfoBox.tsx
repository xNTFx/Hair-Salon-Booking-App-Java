import { useEffect, useRef } from 'react';

interface InfoBoxType {
  onClickOutside: () => void;
  children: React.ReactNode;
  className?: string;
}

export function InfoBox({
  onClickOutside,
  className = '',
  children,
}: InfoBoxType) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside && onClickOutside();
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [onClickOutside]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
