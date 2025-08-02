import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DragAndDropProps {
  onDrop: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const DragAndDrop: React.FC<DragAndDropProps> = ({
  onDrop,
  accept,
  multiple = false,
  disabled = false,
  className,
  children
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onDrop(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onDrop(files);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      className={cn(
        'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-muted-foreground/25 hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
      {children || (
        <div className="space-y-2">
          <div className="text-lg">📁</div>
          <p className="text-sm text-muted-foreground">
            拖拽文件到此处或点击选择文件
          </p>
        </div>
      )}
    </div>
  );
};

interface HoverCardProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  className?: string;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  trigger,
  content,
  side = 'bottom',
  align = 'center',
  delayDuration = 300,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number>();

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, delayDuration);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          className={cn(
            'absolute z-50 min-w-[200px] p-3 bg-popover border rounded-md shadow-md',
            side === 'top' && 'bottom-full mb-2',
            side === 'bottom' && 'top-full mt-2',
            side === 'left' && 'right-full mr-2',
            side === 'right' && 'left-full ml-2',
            align === 'start' && (side === 'top' || side === 'bottom') && 'left-0',
            align === 'end' && (side === 'top' || side === 'bottom') && 'right-0',
            align === 'center' && (side === 'top' || side === 'bottom') && 'left-1/2 -translate-x-1/2',
            align === 'start' && (side === 'left' || side === 'right') && 'top-0',
            align === 'end' && (side === 'left' || side === 'right') && 'bottom-0',
            align === 'center' && (side === 'left' || side === 'right') && 'top-1/2 -translate-y-1/2',
            className
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </div>
      )}
    </div>
  );
};

interface ClickAwayProps {
  children: React.ReactNode;
  onClickAway: () => void;
  disabled?: boolean;
}

export const ClickAway: React.FC<ClickAwayProps> = ({
  children,
  onClickAway,
  disabled = false
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClickAway, disabled]);

  return <div ref={ref}>{children}</div>;
};

interface AutoSaveProps {
  value: string;
  onSave: (value: string) => void;
  delay?: number;
  children: (props: {
    value: string;
    onChange: (value: string) => void;
    saving: boolean;
    saved: boolean;
  }) => React.ReactNode;
}

export const AutoSave: React.FC<AutoSaveProps> = ({
  value: initialValue,
  onSave,
  delay = 1000,
  children
}) => {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timeoutRef = useRef<number>();

  useEffect(() => {
    if (value !== initialValue) {
      setSaved(false);
      clearTimeout(timeoutRef.current);
      
      timeoutRef.current = setTimeout(async () => {
        setSaving(true);
        try {
          await onSave(value);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setSaving(false);
        }
      }, delay);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [value, initialValue, onSave, delay]);

  return (
    <>
      {children({
        value,
        onChange: setValue,
        saving,
        saved
      })}
    </>
  );
};

interface KeyboardShortcutProps {
  combination: string[];
  onTrigger: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({
  combination,
  onTrigger,
  children,
  disabled = false
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const newPressedKeys = new Set(pressedKeys);
      newPressedKeys.add(key);
      setPressedKeys(newPressedKeys);

      // Check if all keys in combination are pressed
      const combinationSet = new Set(combination.map(k => k.toLowerCase()));
      const allPressed = Array.from(combinationSet).every(key => 
        newPressedKeys.has(key) || 
        (key === 'ctrl' && e.ctrlKey) ||
        (key === 'alt' && e.altKey) ||
        (key === 'shift' && e.shiftKey) ||
        (key === 'meta' && e.metaKey)
      );

      if (allPressed) {
        e.preventDefault();
        onTrigger();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const newPressedKeys = new Set(pressedKeys);
      newPressedKeys.delete(key);
      setPressedKeys(newPressedKeys);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [combination, onTrigger, pressedKeys, disabled]);

  return <>{children}</>;
};

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return <div ref={ref}>{children}</div>;
};