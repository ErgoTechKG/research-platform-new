import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5 },
  gap = 4,
  className
}) => {
  const { currentBreakpoint } = useBreakpoint();
  
  const getCurrentCols = () => {
    switch (currentBreakpoint) {
      case 'xs': return cols.xs || 1;
      case 'sm': return cols.sm || 2;
      case 'md': return cols.md || 3;
      case 'lg': return cols.lg || 4;
      case 'xl':
      case '2xl': return cols.xl || 5;
      default: return 3;
    }
  };

  return (
    <div
      className={cn(
        'grid',
        `grid-cols-${getCurrentCols()}`,
        `gap-${gap}`,
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${getCurrentCols()}, 1fr)`,
        gap: `${gap * 0.25}rem`
      }}
    >
      {children}
    </div>
  );
};

interface MobileMenuProps {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  trigger,
  children,
  title = '菜单',
  className
}) => {
  const { isMobile } = useBreakpoint();
  const [open, setOpen] = useState(false);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </SheetContent>
    </Sheet>
  );
};

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  forceCollapsible?: boolean;
  className?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = true,
  forceCollapsible = false,
  className
}) => {
  const { isMobile } = useBreakpoint();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const shouldCollapse = forceCollapsible || isMobile;

  if (!shouldCollapse) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto"
          onClick={() => setIsOpen(!isOpen)}
        >
          <CardTitle className="text-left">{title}</CardTitle>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      {isOpen && <CardContent>{children}</CardContent>}
    </Card>
  );
};

interface ResponsiveTableProps {
  headers: string[];
  rows: (string | React.ReactNode)[][];
  className?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  headers,
  rows,
  className
}) => {
  const { isMobile } = useBreakpoint();

  if (isMobile) {
    return (
      <div className={cn('space-y-4', className)}>
        {rows.map((row, rowIndex) => (
          <Card key={rowIndex}>
            <CardContent className="p-4 space-y-2">
              {headers.map((header, colIndex) => (
                <div key={colIndex} className="flex justify-between items-center">
                  <span className="font-medium text-sm text-muted-foreground">
                    {header}
                  </span>
                  <span className="text-sm">{row[colIndex]}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse border border-border">
        <thead>
          <tr className="bg-muted">
            {headers.map((header, index) => (
              <th key={index} className="border border-border p-3 text-left font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-muted/50">
              {row.map((cell, colIndex) => (
                <td key={colIndex} className="border border-border p-3">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className,
  priority = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  if (error) {
    return (
      <div className={cn('bg-muted rounded-lg flex items-center justify-center p-8', className)}>
        <span className="text-muted-foreground">图片加载失败</span>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
};

interface TouchFriendlyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export const TouchFriendlyButton: React.FC<TouchFriendlyButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false
}) => {
  const { isMobile } = useBreakpoint();
  
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
  };
  
  const sizeClasses = {
    sm: isMobile ? 'h-11 px-4 text-sm' : 'h-9 px-3 text-sm',
    md: isMobile ? 'h-12 px-6 text-base' : 'h-10 px-4 text-sm',
    lg: isMobile ? 'h-14 px-8 text-lg' : 'h-11 px-8 text-base',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isMobile && 'active:scale-95 transition-transform',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      style={{
        minHeight: isMobile ? '44px' : 'auto',
        minWidth: isMobile ? '44px' : 'auto',
      }}
    >
      {children}
    </button>
  );
};

interface BreakpointIndicatorProps {
  className?: string;
}

export const BreakpointIndicator: React.FC<BreakpointIndicatorProps> = ({
  className
}) => {
  const { currentBreakpoint, windowWidth } = useBreakpoint();
  
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className={cn('fixed bottom-4 right-4 z-50', className)}>
      <Badge variant="outline" className="bg-background">
        {currentBreakpoint} ({windowWidth}px)
      </Badge>
    </div>
  );
};