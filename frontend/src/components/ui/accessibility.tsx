import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Type, 
  Palette, 
  Zap, 
  Keyboard,
  ArrowDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityPanelProps {
  className?: string;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  className
}) => {
  const { preferences, updatePreferences } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const fontSizeOptions = [
    { value: 'small', label: '小', size: '14px' },
    { value: 'medium', label: '中', size: '16px' },
    { value: 'large', label: '大', size: '18px' },
    { value: 'extra-large', label: '特大', size: '20px' },
  ];

  return (
    <div className={cn('fixed bottom-4 left-4 z-50', className)}>
      <Card className="w-80">
        <CardHeader>
          <Button
            variant="ghost"
            className="w-full justify-between p-0 h-auto"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="accessibility-panel"
          >
            <CardTitle className="text-left flex items-center gap-2">
              <Eye className="h-4 w-4" />
              无障碍设置
            </CardTitle>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CardHeader>
        
        {isOpen && (
          <CardContent id="accessibility-panel" className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <Label htmlFor="high-contrast">高对比度</Label>
              </div>
              <Switch
                id="high-contrast"
                checked={preferences.highContrast}
                onCheckedChange={(checked) => 
                  updatePreferences({ highContrast: checked })
                }
                aria-describedby="high-contrast-desc"
              />
            </div>
            <p id="high-contrast-desc" className="text-xs text-muted-foreground">
              增强颜色对比度，改善视觉效果
            </p>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <Label htmlFor="reduced-motion">减少动画</Label>
              </div>
              <Switch
                id="reduced-motion"
                checked={preferences.reducedMotion}
                onCheckedChange={(checked) => 
                  updatePreferences({ reducedMotion: checked })
                }
                aria-describedby="reduced-motion-desc"
              />
            </div>
            <p id="reduced-motion-desc" className="text-xs text-muted-foreground">
              减少页面动画和过渡效果
            </p>

            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                <Label>字体大小</Label>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {fontSizeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={preferences.fontSize === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updatePreferences({ fontSize: option.value as any })}
                    aria-pressed={preferences.fontSize === option.value}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Screen Reader Optimization */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <Label htmlFor="screen-reader">屏幕阅读器优化</Label>
              </div>
              <Switch
                id="screen-reader"
                checked={preferences.screenReaderOptimized}
                onCheckedChange={(checked) => 
                  updatePreferences({ screenReaderOptimized: checked })
                }
                aria-describedby="screen-reader-desc"
              />
            </div>
            <p id="screen-reader-desc" className="text-xs text-muted-foreground">
              为屏幕阅读器用户优化页面结构
            </p>

            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                <Label htmlFor="keyboard-nav">键盘导航</Label>
              </div>
              <Switch
                id="keyboard-nav"
                checked={preferences.keyboardNavigation}
                onCheckedChange={(checked) => 
                  updatePreferences({ keyboardNavigation: checked })
                }
                aria-describedby="keyboard-nav-desc"
              />
            </div>
            <p id="keyboard-nav-desc" className="text-xs text-muted-foreground">
              启用增强的键盘导航功能
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  href,
  children,
  className
}) => {
  return (
    <a
      href={href}
      className={cn(
        'absolute left-4 top-4 z-50 -translate-y-16 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium',
        'focus:translate-y-0 transition-transform',
        className
      )}
      onFocus={(e) => {
        // Announce to screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.textContent = '跳转链接已激活';
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
      }}
    >
      {children}
    </a>
  );
};

interface LiveRegionProps {
  children: React.ReactNode;
  level?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  level = 'polite',
  atomic = true,
  className
}) => {
  return (
    <div
      aria-live={level}
      aria-atomic={atomic}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  );
};

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const AccessibleHeading: React.FC<HeadingProps> = ({
  level,
  children,
  className,
  id
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Tag
      id={id}
      className={cn(
        'scroll-mt-4', // Account for sticky headers
        level === 1 && 'text-2xl md:text-4xl font-bold',
        level === 2 && 'text-xl md:text-3xl font-semibold',
        level === 3 && 'text-lg md:text-2xl font-semibold',
        level === 4 && 'text-base md:text-xl font-medium',
        level === 5 && 'text-sm md:text-lg font-medium',
        level === 6 && 'text-sm md:text-base font-medium',
        className
      )}
    >
      {children}
    </Tag>
  );
};

interface FocusableProps {
  children: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  tabIndex?: number;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export const Focusable: React.FC<FocusableProps> = ({
  children,
  onFocus,
  onBlur,
  className,
  tabIndex = 0,
  role,
  ...ariaProps
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div
      tabIndex={tabIndex}
      role={role}
      className={cn(
        'outline-none transition-all',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        focused && 'ring-2 ring-ring ring-offset-2',
        className
      )}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.();
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.();
      }}
      {...ariaProps}
    >
      {children}
    </div>
  );
};

interface StatusMessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
  announce?: boolean;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  children,
  className,
  announce = true
}) => {
  const { announceToScreenReader } = useAccessibility();

  useEffect(() => {
    if (announce && typeof children === 'string') {
      announceToScreenReader(children);
    }
  }, [children, announce, announceToScreenReader]);

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'p-4 border rounded-lg',
        typeStyles[type],
        className
      )}
    >
      {children}
    </div>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  showPercentage?: boolean;
}

export const AccessibleProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  className,
  showPercentage = true
}) => {
  const percentage = Math.round((value / max) * 100);
  const progressId = React.useId();
  const labelId = React.useId();

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label id={labelId} htmlFor={progressId}>
          {label}
          {showPercentage && ` (${percentage}%)`}
        </Label>
      )}
      <div
        id={progressId}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-labelledby={label ? labelId : undefined}
        aria-valuetext={`${percentage}% 完成`}
        className="h-2 bg-muted rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <LiveRegion>
        进度更新：{percentage}% 完成
      </LiveRegion>
    </div>
  );
};