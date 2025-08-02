import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'faculty' | 'admin'
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isTestMode: boolean
  switchRole: (role: 'student' | 'faculty' | 'admin') => void
}

// Test mode users
const TEST_USERS: Record<string, User> = {
  student: {
    id: 'test-student-1',
    email: 'zhangsan@hust.edu.cn',
    name: '张三',
    role: 'student'
  },
  faculty: {
    id: 'test-faculty-1',
    email: 'li.prof@hust.edu.cn',
    name: '李教授',
    role: 'faculty'
  },
  admin: {
    id: 'test-admin-1',
    email: 'wang.admin@hust.edu.cn',
    name: '王主任',
    role: 'admin'
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
      const roleParam = urlParams.get('role') as 'student' | 'faculty' | 'admin' | null
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
          const mockUser: User = {
            id: '1',
            email,
            name: email.split('@')[0],
            role: email.includes('admin') ? 'admin' : 
                  email.includes('faculty') ? 'faculty' : 'student'
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
  
  const switchRole = (role: 'student' | 'faculty' | 'admin') => {
    if (isTestMode && TEST_USERS[role]) {
      setUser(TEST_USERS[role])
      localStorage.setItem('user', JSON.stringify(TEST_USERS[role]))
    }
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
    isTestMode,
    switchRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}