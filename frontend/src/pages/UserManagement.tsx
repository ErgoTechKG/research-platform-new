import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'

interface User {
  id: string
  email: string
  name: string
  studentId?: string
  role: 'student' | 'professor' | 'secretary' | 'admin'
  department: string
  phone?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
}

const UserManagement = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    studentId: '',
    role: 'student' as 'student' | 'professor' | 'secretary' | 'admin',
    department: '',
    phone: '',
    password: ''
  })

  // Mock users data
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockUsers: User[] = [
        {
          id: '1',
          name: '张三',
          email: 'zhangsan@hust.edu.cn',
          studentId: 'D202377777',
          role: 'student',
          department: '机械科学与工程学院',
          phone: '13800138000',
          isActive: true,
          lastLogin: new Date('2024-01-15'),
          createdAt: new Date('2024-01-01')
        },
        {
          id: '2',
          name: '李教授',
          email: 'li.prof@hust.edu.cn',
          role: 'professor',
          department: '机械科学与工程学院',
          phone: '13800138001',
          isActive: true,
          lastLogin: new Date('2024-01-16'),
          createdAt: new Date('2024-01-01')
        },
        {
          id: '3',
          name: '陈秘书',
          email: 'chen.sec@hust.edu.cn',
          role: 'secretary',
          department: '机械科学与工程学院',
          phone: '13800138002',
          isActive: true,
          lastLogin: new Date('2024-01-14'),
          createdAt: new Date('2024-01-01')
        },
        {
          id: '4',
          name: '王小明',
          email: 'wangxiaoming@hust.edu.cn',
          studentId: 'D202377778',
          role: 'student',
          department: '机械科学与工程学院',
          phone: '13800138003',
          isActive: false,
          lastLogin: new Date('2024-01-10'),
          createdAt: new Date('2024-01-01')
        }
      ]
      
      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      setIsLoading(false)
    }

    loadUsers()
  }, [])

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.studentId && user.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Role filter
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => 
        selectedStatus === 'active' ? user.isActive : !user.isActive
      )
    }

    setFilteredUsers(filtered)
  }, [users, searchTerm, selectedRole, selectedStatus])

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-100 text-blue-800'
      case 'professor': return 'bg-green-100 text-green-800'
      case 'secretary': return 'bg-orange-100 text-orange-800'
      case 'admin': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student': return '学生'
      case 'professor': return '教授'
      case 'secretary': return '秘书'
      case 'admin': return '管理员'
      default: return role
    }
  }

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const userToUpdate = users.find(u => u.id === userId)
      if (!userToUpdate) return

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, isActive: !user.isActive }
            : user
        )
      )

      setMessage(`用户 ${userToUpdate.name} 已${userToUpdate.isActive ? '禁用' : '激活'}`)
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('操作失败，请重试')
      setMessageType('error')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？此操作无法撤销。')) {
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      setMessage('用户删除成功')
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('删除失败，请重试')
      setMessageType('error')
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUserData.name || !newUserData.email || !newUserData.password) {
      setMessage('请填写所有必填字段')
      setMessageType('error')
      return
    }

    try {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newUser: User = {
        id: Date.now().toString(),
        ...newUserData,
        isActive: true,
        createdAt: new Date()
      }

      setUsers(prevUsers => [...prevUsers, newUser])
      setShowCreateDialog(false)
      setNewUserData({
        name: '',
        email: '',
        studentId: '',
        role: 'student',
        department: '',
        phone: '',
        password: ''
      })
      setMessage('用户创建成功')
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('创建失败，请重试')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute requiredPermission="manage_users">
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Users className="w-8 h-8 mr-3" />
                  用户管理
                </h1>
                <p className="mt-2 text-gray-600">管理系统中的所有用户账户</p>
              </div>
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    添加用户
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>创建新用户</DialogTitle>
                    <DialogDescription>
                      添加新的用户账户到系统中
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-name">姓名 *</Label>
                      <Input
                        id="create-name"
                        value={newUserData.name}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-email">邮箱 *</Label>
                      <Input
                        id="create-email"
                        type="email"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-password">密码 *</Label>
                      <Input
                        id="create-password"
                        type="password"
                        value={newUserData.password}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-role">角色</Label>
                      <Select value={newUserData.role} onValueChange={(value: any) => setNewUserData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">学生</SelectItem>
                          <SelectItem value="professor">教授</SelectItem>
                          <SelectItem value="secretary">秘书</SelectItem>
                          <SelectItem value="admin">管理员</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-department">院系</Label>
                      <Input
                        id="create-department"
                        value={newUserData.department}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                    {newUserData.role === 'student' && (
                      <div className="space-y-2">
                        <Label htmlFor="create-studentId">学号</Label>
                        <Input
                          id="create-studentId"
                          value={newUserData.studentId}
                          onChange={(e) => setNewUserData(prev => ({ ...prev, studentId: e.target.value }))}
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="create-phone">电话</Label>
                      <Input
                        id="create-phone"
                        value={newUserData.phone}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? '创建中...' : '创建用户'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Message */}
          {message && (
            <Alert className={`mb-6 ${messageType === 'success' ? 'border-green-200 bg-green-50' : ''}`}>
              {messageType === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription className={messageType === 'success' ? 'text-green-700' : ''}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">搜索用户</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      placeholder="姓名、邮箱或学号"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-filter">角色筛选</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有角色</SelectItem>
                      <SelectItem value="student">学生</SelectItem>
                      <SelectItem value="professor">教授</SelectItem>
                      <SelectItem value="secretary">秘书</SelectItem>
                      <SelectItem value="admin">管理员</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status-filter">状态筛选</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">所有状态</SelectItem>
                      <SelectItem value="active">已激活</SelectItem>
                      <SelectItem value="inactive">已禁用</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>统计信息</Label>
                  <div className="text-sm text-gray-600">
                    总用户: {users.length} | 激活: {users.filter(u => u.isActive).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>用户列表</CardTitle>
              <CardDescription>
                显示 {filteredUsers.length} 个用户
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-gray-600">加载中...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>用户信息</TableHead>
                        <TableHead>角色</TableHead>
                        <TableHead>院系</TableHead>
                        <TableHead>状态</TableHead>
                        <TableHead>最后登录</TableHead>
                        <TableHead>操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.studentId && (
                                <div className="text-xs text-gray-400">{user.studentId}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {getRoleLabel(user.role)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{user.department}</TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? 'default' : 'secondary'}>
                              {user.isActive ? '正常' : '禁用'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {user.lastLogin ? user.lastLogin.toLocaleDateString('zh-CN') : '从未登录'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user)
                                  setShowUserDialog(true)
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleUserStatus(user.id)}
                                className={user.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                              >
                                {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                              </Button>
                              
                              {user.id !== currentUser?.id && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      没有找到匹配的用户
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Detail Dialog */}
          <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>用户详情</DialogTitle>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4">
                  <div>
                    <Label>姓名</Label>
                    <p className="text-sm font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <Label>邮箱</Label>
                    <p className="text-sm">{selectedUser.email}</p>
                  </div>
                  {selectedUser.studentId && (
                    <div>
                      <Label>学号</Label>
                      <p className="text-sm">{selectedUser.studentId}</p>
                    </div>
                  )}
                  <div>
                    <Label>角色</Label>
                    <p className="text-sm">
                      <Badge className={getRoleBadgeColor(selectedUser.role)}>
                        {getRoleLabel(selectedUser.role)}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <Label>院系</Label>
                    <p className="text-sm">{selectedUser.department}</p>
                  </div>
                  {selectedUser.phone && (
                    <div>
                      <Label>电话</Label>
                      <p className="text-sm">{selectedUser.phone}</p>
                    </div>
                  )}
                  <div>
                    <Label>账户状态</Label>
                    <p className="text-sm">
                      <Badge variant={selectedUser.isActive ? 'default' : 'secondary'}>
                        {selectedUser.isActive ? '正常' : '禁用'}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <Label>创建时间</Label>
                    <p className="text-sm">{selectedUser.createdAt.toLocaleString('zh-CN')}</p>
                  </div>
                  <div>
                    <Label>最后登录</Label>
                    <p className="text-sm">
                      {selectedUser.lastLogin ? selectedUser.lastLogin.toLocaleString('zh-CN') : '从未登录'}
                    </p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default UserManagement