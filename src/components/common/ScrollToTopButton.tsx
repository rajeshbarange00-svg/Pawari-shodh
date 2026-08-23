import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);

      if (scrollTop > 250) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-6 right-6 z-40 print:hidden animate-in fade-in slide-in-from-bottom-3 duration-200'>
      <button
        onClick={scrollToTop}
        title='Scroll to Top'
        aria-label='Scroll to top'
        className='relative group w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-red-950 hover:bg-red-900 text-amber-300 shadow-xl flex items-center justify-center border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-300 transform hover:scale-105 cursor-pointer'
      >
        <svg className='absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-0.5'>
          <circle
            cx='24'
            cy='24'
            r='20'
            className='stroke-amber-900/40 fill-none'
            strokeWidth='2.5'
          />
          <circle
            cx='24'
            cy='24'
            r='20'
            className='stroke-amber-400 fill-none transition-all duration-100'
            strokeWidth='2.5'
            strokeDasharray={125}
            strokeDashoffset={125 - (125 * scrollProgress) / 100}
            strokeLinecap='round'
          />
        </svg>

        <ArrowUp className='w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200' />
      </button>
    </div>
  );
};
