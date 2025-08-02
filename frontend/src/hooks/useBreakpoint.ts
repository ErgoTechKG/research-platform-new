import { useState, useEffect } from 'react';
import { designTokens } from '@/styles/design-tokens';

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpointValues = {
  xs: parseInt(designTokens.breakpoints.xs),
  sm: parseInt(designTokens.breakpoints.sm),
  md: parseInt(designTokens.breakpoints.md),
  lg: parseInt(designTokens.breakpoints.lg),
  xl: parseInt(designTokens.breakpoints.xl),
  '2xl': parseInt(designTokens.breakpoints['2xl']),
};

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('lg');
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width < breakpointValues.sm) {
        setCurrentBreakpoint('xs');
      } else if (width < breakpointValues.md) {
        setCurrentBreakpoint('sm');
      } else if (width < breakpointValues.lg) {
        setCurrentBreakpoint('md');
      } else if (width < breakpointValues.xl) {
        setCurrentBreakpoint('lg');
      } else if (width < breakpointValues['2xl']) {
        setCurrentBreakpoint('xl');
      } else {
        setCurrentBreakpoint('2xl');
      }
    }

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isBreakpoint = (breakpoint: Breakpoint): boolean => {
    return currentBreakpoint === breakpoint;
  };

  const isAboveBreakpoint = (breakpoint: Breakpoint): boolean => {
    const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    const targetIndex = breakpointOrder.indexOf(breakpoint);
    return currentIndex >= targetIndex;
  };

  const isBelowBreakpoint = (breakpoint: Breakpoint): boolean => {
    const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    const targetIndex = breakpointOrder.indexOf(breakpoint);
    return currentIndex < targetIndex;
  };

  const isMobile = currentBreakpoint === 'xs' || currentBreakpoint === 'sm';
  const isTablet = currentBreakpoint === 'md';
  const isDesktop = currentBreakpoint === 'lg' || currentBreakpoint === 'xl' || currentBreakpoint === '2xl';

  return {
    currentBreakpoint,
    windowWidth,
    isBreakpoint,
    isAboveBreakpoint,
    isBelowBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
  };
}