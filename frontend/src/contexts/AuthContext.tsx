import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface User {
  id: string
  email: string
  name: string
  studentId?: string
  role: 'student' | 'professor' | 'secretary' | 'admin'
  department: string
  phone?: string
  avatar?: string
  isActive: boolean
  lastLogin?: Date
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isTestMode: boolean
  switchRole: (role: 'student' | 'professor' | 'secretary' | 'admin') => void
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
  updateProfile: (data: Partial<User>) => Promise<boolean>
}

interface RegisterData {
  name: string
  studentId?: string
  email: string
  password: string
  role: 'student' | 'professor' | 'secretary' | 'admin'
  department: string
  phone?: string
}

// Role-based permissions
const ROLE_PERMISSIONS: Record<string, string[]> = {
  student: [
    'view_dashboard',
    'view_courses',
    'submit_reports',
    'view_grades',
    'participate_meetings',
    'use_messaging',
    'view_resources'
  ],
  professor: [
    'view_dashboard',
    'manage_courses',
    'grade_students',
    'view_student_progress',
    'schedule_meetings',
    'access_analytics',
    'manage_materials',
    'conduct_defense',
    'export_reports'
  ],
  secretary: [
    'view_dashboard',
    'manage_evaluations',
    'coordinate_schedules',
    'manage_expert_groups',
    'process_appeals',
    'generate_reports',
    'manage_notifications',
    'batch_operations'
  ],
  admin: [
    'full_access',
    'manage_users',
    'system_configuration',
    'view_all_data',
    'security_management',
    'backup_restore'
  ]
}

// Test mode users with proper role structure
const TEST_USERS: Record<string, User> = {
  student: {
    id: 'test-student-1',
    email: 'zhangsan@hust.edu.cn',
    name: '张三',
    studentId: 'D202377777',
    role: 'student',
    department: '机械科学与工程学院',
    phone: '13800138000',
    isActive: true,
    permissions: ROLE_PERMISSIONS.student,
    lastLogin: new Date()
  },
  professor: {
    id: 'test-professor-1',
    email: 'li.prof@hust.edu.cn',
    name: '李教授',
    role: 'professor',
    department: '机械科学与工程学院',
    phone: '13800138001',
    isActive: true,
    permissions: ROLE_PERMISSIONS.professor,
    lastLogin: new Date()
  },
  secretary: {
    id: 'test-secretary-1',
    email: 'chen.sec@hust.edu.cn',
    name: '陈秘书',
    role: 'secretary',
    department: '机械科学与工程学院',
    phone: '13800138002',
    isActive: true,
    permissions: ROLE_PERMISSIONS.secretary,
    lastLogin: new Date()
  },
  admin: {
    id: 'test-admin-1',
    email: 'wang.admin@hust.edu.cn',
    name: '王主任',
    role: 'admin',
    department: '机械科学与工程学院',
    phone: '13800138003',
    isActive: true,
    permissions: ROLE_PERMISSIONS.admin,
    lastLogin: new Date()
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  
  const isTestMode = import.meta.env.VITE_TEST_MODE === 'true'
  const defaultTestRole = import.meta.env.VITE_TEST_ROLE || 'student'

  useEffect(() => {
    // Check for test mode first
    if (isTestMode) {
      // Get role from URL query params
      const urlParams = new URLSearchParams(location.search)
      const roleParam = urlParams.get('role') as 'student' | 'professor' | 'secretary' | 'admin' | null
      const testRole = roleParam || defaultTestRole
      
      if (TEST_USERS[testRole]) {
        setUser(TEST_USERS[testRole])
        localStorage.setItem('user', JSON.stringify(TEST_USERS[testRole]))
        setIsLoading(false)
        
        // Remove role param from URL to clean it up
        if (roleParam) {
          urlParams.delete('role')
          const newSearch = urlParams.toString()
          navigate({
            pathname: location.pathname,
            search: newSearch ? `?${newSearch}` : ''
          }, { replace: true })
        }
      }
    } else {
      // Normal auth flow
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error('Error parsing stored user:', error)
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }
  }, [isTestMode, location.search, navigate, location.pathname, defaultTestRole])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Mock authentication - replace with real API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple mock validation
        if (email && password.length >= 6) {
          const role = email.includes('admin') ? 'admin' : 
                      email.includes('prof') ? 'professor' :
                      email.includes('sec') ? 'secretary' : 'student'
          
          const mockUser: User = {
            id: Date.now().toString(),
            email,
            name: email.split('@')[0],
            role,
            department: '机械科学与工程学院',
            isActive: true,
            permissions: ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.student,
            lastLogin: new Date()
          }
          
          setUser(mockUser)
          localStorage.setItem('user', JSON.stringify(mockUser))
          setIsLoading(false)
          resolve(true)
        } else {
          setIsLoading(false)
          resolve(false)
        }
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }
  
  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    
    // Mock registration API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate registration success
        resolve(true)
        setIsLoading(false)
      }, 2000)
    })
  }

  const switchRole = (role: 'student' | 'professor' | 'secretary' | 'admin') => {
    if (isTestMode && TEST_USERS[role]) {
      setUser(TEST_USERS[role])
      localStorage.setItem('user', JSON.stringify(TEST_USERS[role]))
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.permissions.includes('full_access')) return true
    return user.permissions.includes(permission)
  }

  const hasRole = (role: string): boolean => {
    if (!user) return false
    return user.role === role
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false
    
    setIsLoading(true)
    
    // Mock profile update API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...user, ...data }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setIsLoading(false)
        resolve(true)
      }, 1000)
    })
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isTestMode,
    switchRole,
    hasPermission,
    hasRole,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}