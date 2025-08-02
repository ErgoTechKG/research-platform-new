import { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface PermissionWrapperProps {
  children: ReactNode
  permission?: string
  role?: string
  allowedRoles?: string[]
  fallback?: ReactNode
  requireActive?: boolean
}

const PermissionWrapper = ({ 
  children, 
  permission, 
  role, 
  allowedRoles = [],
  fallback = null,
  requireActive = true
}: PermissionWrapperProps) => {
  const { user, hasPermission, hasRole } = useAuth()

  // If no user is logged in, don't render anything
  if (!user) {
    return <>{fallback}</>
  }

  // Check if account is active (if required)
  if (requireActive && !user.isActive) {
    return <>{fallback}</>
  }

  // Check role-based access
  if (role && !hasRole(role)) {
    return <>{fallback}</>
  }

  // Check if user role is in allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>
  }

  // Check permission-based access
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  // All checks passed, render the content
  return <>{children}</>
}

export default PermissionWrapper