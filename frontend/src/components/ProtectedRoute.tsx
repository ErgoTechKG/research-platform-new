import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertTriangle } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
  requiredRole?: string
  allowedRoles?: string[]
  fallbackPath?: string
}

const ProtectedRoute = ({ 
  children, 
  requiredPermission, 
  requiredRole, 
  allowedRoles = [],
  fallbackPath = '/login' 
}: ProtectedRouteProps) => {
  const { user, isLoading, hasPermission, hasRole } = useAuth()
  const location = useLocation()

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">验证身份中...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check if account is active
  if (!user.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              您的账户已被禁用，请联系管理员。
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Alert className="border-orange-200 bg-orange-50">
            <Shield className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700">
              您没有访问此页面的权限。需要 {requiredRole} 角色。
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Check if user role is in allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Alert className="border-orange-200 bg-orange-50">
            <Shield className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700">
              您没有访问此页面的权限。需要以下角色之一: {allowedRoles.join(', ')}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <Alert className="border-orange-200 bg-orange-50">
            <Shield className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-700">
              您没有执行此操作的权限。需要权限: {requiredPermission}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // All checks passed, render the protected content
  return <>{children}</>
}

export default ProtectedRoute