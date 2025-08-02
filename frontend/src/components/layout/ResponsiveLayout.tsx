import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Menu, 
  Home, 
  Settings, 
  User, 
  Bell, 
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: number;
  children?: NavigationItem[];
}

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  navigation: NavigationItem[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebarCollapsible?: boolean;
  className?: string;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  navigation,
  header,
  footer,
  sidebarCollapsible = true,
  className
}) => {
  const { isMobile, isTablet } = useBreakpoint();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderNavigationItem = (item: NavigationItem, level = 0) => (
    <div key={item.id} className={cn('space-y-1', level > 0 && 'ml-4')}>
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start',
          sidebarCollapsed && level === 0 && 'justify-center px-2'
        )}
        onClick={() => {
          if (item.href) {
            window.location.href = item.href;
          }
          if (isMobile) {
            setSidebarOpen(false);
          }
        }}
      >
        <span className="mr-2">{item.icon}</span>
        {(!sidebarCollapsed || level > 0) && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
      {item.children && (!sidebarCollapsed || level > 0) && (
        <div className="space-y-1">
          {item.children.map(child => renderNavigationItem(child, level + 1))}
        </div>
      )}
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className={cn(
        'flex items-center justify-between p-4',
        sidebarCollapsed && 'justify-center'
      )}>
        {!sidebarCollapsed && (
          <h2 className="text-lg font-semibold">研究平台</h2>
        )}
        {sidebarCollapsible && !isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {navigation.map(item => renderNavigationItem(item))}
        </nav>
      </ScrollArea>
      
      {footer && (
        <>
          <Separator />
          <div className="p-4">{footer}</div>
        </>
      )}
    </div>
  );

  // Mobile layout with drawer
  if (isMobile) {
    return (
      <div className={cn('min-h-screen bg-background', className)}>
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                {sidebarContent}
              </SheetContent>
            </Sheet>
            
            <div className="flex-1">
              {header || (
                <div className="flex items-center justify-between">
                  <h1 className="text-lg font-semibold">研究平台</h1>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    );
  }

  // Desktop layout with sidebar
  return (
    <div className={cn('min-h-screen bg-background flex', className)}>
      {/* Desktop Sidebar */}
      <aside className={cn(
        'border-r bg-background transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}>
        {sidebarContent}
      </aside>

      {/* Desktop Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Desktop Header */}
        {header && (
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-6">
              {header}
            </div>
          </header>
        )}

        {/* Desktop Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

interface MobileBottomNavigationProps {
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
    badge?: number;
  }[];
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
  className?: string;
}

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  items,
  activeItem,
  onItemClick,
  className
}) => {
  const { isMobile } = useBreakpoint();

  if (!isMobile) {
    return null;
  }

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-50 bg-background border-t',
      className
    )}>
      <div className="grid grid-cols-5 h-16">
        {items.slice(0, 5).map(item => (
          <button
            key={item.id}
            className={cn(
              'flex flex-col items-center justify-center space-y-1 transition-colors',
              'hover:bg-muted active:bg-muted',
              activeItem === item.id ? 'text-primary' : 'text-muted-foreground'
            )}
            onClick={() => {
              onItemClick?.(item.id);
              if (item.href) {
                window.location.href = item.href;
              }
            }}
          >
            <div className="relative">
              {item.icon}
              {item.badge && item.badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs"
                >
                  {item.badge > 9 ? '9+' : item.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

interface ResponsiveCardGridProps {
  children: React.ReactNode;
  minCardWidth?: number;
  gap?: number;
  className?: string;
}

export const ResponsiveCardGrid: React.FC<ResponsiveCardGridProps> = ({
  children,
  minCardWidth = 280,
  gap = 24,
  className
}) => {
  return (
    <div
      className={cn('grid', className)}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
        gap: `${gap}px`
      }}
    >
      {children}
    </div>
  );
};