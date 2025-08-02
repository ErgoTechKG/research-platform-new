import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { 
  RefreshCw, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Database,
  Clock,
  FileText,
  Settings,
  Download,
  Loader2,
  AlertTriangle,
  Activity
} from 'lucide-react'

interface SyncLog {
  id: string
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error'
  message: string
  details?: string
}

interface ImportStatus {
  totalRecords: number
  processedRecords: number
  successCount: number
  errorCount: number
  warningCount: number
  status: 'idle' | 'connecting' | 'syncing' | 'validating' | 'completed' | 'error'
}

interface DataMapping {
  sourceField: string
  targetField: string
  transformation?: string
}

export default function GradeImportSystem() {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected')
  const [importStatus, setImportStatus] = useState<ImportStatus>({
    totalRecords: 0,
    processedRecords: 0,
    successCount: 0,
    errorCount: 0,
    warningCount: 0,
    status: 'idle'
  })
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([])
  const [autoSync, setAutoSync] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<string>('2024-08-28 09:30:00')
  const [selectedSystem, setSelectedSystem] = useState('academic')
  
  const [dataMappings] = useState<DataMapping[]>([
    { sourceField: '学号', targetField: 'studentId' },
    { sourceField: '姓名', targetField: 'studentName' },
    { sourceField: '平时成绩', targetField: 'usualScore', transformation: 'number' },
    { sourceField: '期末成绩', targetField: 'finalScore', transformation: 'number' },
    { sourceField: '总评成绩', targetField: 'totalScore', transformation: 'calculated' }
  ])

  useEffect(() => {
    // 模拟连接状态检查
    const checkConnection = () => {
      if (connectionStatus === 'connecting') {
        setTimeout(() => {
          setConnectionStatus('connected')
          addLog('success', '成功连接到教务系统')
        }, 2000)
      }
    }
    checkConnection()
  }, [connectionStatus])

  useEffect(() => {
    // 模拟自动同步
    if (autoSync && connectionStatus === 'connected') {
      const interval = setInterval(() => {
        handleSync()
      }, 300000) // 5分钟
      return () => clearInterval(interval)
    }
  }, [autoSync, connectionStatus])

  const addLog = (type: SyncLog['type'], message: string, details?: string) => {
    const newLog: SyncLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('zh-CN'),
      type,
      message,
      details
    }
    setSyncLogs(prev => [newLog, ...prev].slice(0, 100)) // 保留最近100条
  }

  const handleConnect = () => {
    setConnectionStatus('connecting')
    addLog('info', '正在连接到教务系统...')
  }

  const handleSync = () => {
    if (connectionStatus !== 'connected') {
      addLog('error', '请先连接到教务系统')
      return
    }

    setImportStatus({
      totalRecords: 150,
      processedRecords: 0,
      successCount: 0,
      errorCount: 0,
      warningCount: 0,
      status: 'syncing'
    })

    addLog('info', '开始同步成绩数据...')

    // 模拟同步过程
    let processed = 0
    const interval = setInterval(() => {
      processed += 10
      const success = Math.floor(processed * 0.9)
      const warning = Math.floor(processed * 0.05)
      const error = processed - success - warning

      setImportStatus({
        totalRecords: 150,
        processedRecords: processed,
        successCount: success,
        errorCount: error,
        warningCount: warning,
        status: processed < 150 ? 'syncing' : 'completed'
      })

      if (processed >= 150) {
        clearInterval(interval)
        setLastSyncTime(new Date().toLocaleString('zh-CN'))
        addLog('success', `同步完成：成功 ${success} 条，警告 ${warning} 条，错误 ${error} 条`)
      }
    }, 100)
  }

  const handleRetry = () => {
    const errorRecords = importStatus.errorCount
    addLog('info', `正在重试 ${errorRecords} 条失败记录...`)
    
    setTimeout(() => {
      setImportStatus(prev => ({
        ...prev,
        errorCount: Math.floor(errorRecords * 0.2),
        successCount: prev.successCount + Math.floor(errorRecords * 0.8)
      }))
      addLog('success', `重试完成：成功恢复 ${Math.floor(errorRecords * 0.8)} 条记录`)
    }, 2000)
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'connecting':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getLogIcon = (type: SyncLog['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default:
        return <Activity className="w-4 h-4 text-blue-500" />
    }
  }

  const syncProgress = importStatus.totalRecords > 0 
    ? (importStatus.processedRecords / importStatus.totalRecords) * 100 
    : 0

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">成绩导入系统</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                <Clock className="w-4 h-4 mr-1" />
                最后同步: {lastSyncTime}
              </Badge>
              <Button
                variant={autoSync ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoSync(!autoSync)}
              >
                <RefreshCw className={`w-4 h-4 mr-1 ${autoSync ? 'animate-spin' : ''}`} />
                {autoSync ? '自动同步中' : '自动同步'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 连接状态 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>系统连接</span>
                  {getStatusIcon()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>选择系统</Label>
                    <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academic">教务系统</SelectItem>
                        <SelectItem value="library">图书馆系统</SelectItem>
                        <SelectItem value="lab">实验室系统</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>连接状态:</span>
                      <span className={`font-medium ${
                        connectionStatus === 'connected' ? 'text-green-600' : 
                        connectionStatus === 'error' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {connectionStatus === 'connected' ? '已连接' :
                         connectionStatus === 'connecting' ? '连接中...' :
                         connectionStatus === 'error' ? '连接失败' : '未连接'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>服务器:</span>
                      <span className="text-gray-600">academic.hust.edu.cn</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={handleConnect}
                    disabled={connectionStatus === 'connecting' || connectionStatus === 'connected'}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    {connectionStatus === 'connected' ? '已连接' : '连接系统'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 导入状态 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>导入状态</CardTitle>
              </CardHeader>
              <CardContent>
                {importStatus.status !== 'idle' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>同步进度</span>
                        <span>{importStatus.processedRecords}/{importStatus.totalRecords}</span>
                      </div>
                      <Progress value={syncProgress} className="h-3" />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-green-700">{importStatus.successCount}</div>
                        <div className="text-sm text-green-600">成功</div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-yellow-700">{importStatus.warningCount}</div>
                        <div className="text-sm text-yellow-600">警告</div>
                      </div>
                      <div className="p-3 bg-red-50 rounded-lg">
                        <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                        <div className="text-2xl font-bold text-red-700">{importStatus.errorCount}</div>
                        <div className="text-sm text-red-600">错误</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSync} 
                        disabled={importStatus.status === 'syncing'}
                        className="flex-1"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {importStatus.status === 'syncing' ? '同步中...' : '重新同步'}
                      </Button>
                      {importStatus.errorCount > 0 && (
                        <Button variant="outline" onClick={handleRetry}>
                          <AlertCircle className="w-4 h-4 mr-2" />
                          重试失败项
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">暂无同步任务</p>
                    <Button onClick={handleSync} disabled={connectionStatus !== 'connected'}>
                      <Upload className="w-4 h-4 mr-2" />
                      开始同步
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="logs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="logs">同步日志</TabsTrigger>
              <TabsTrigger value="mapping">数据映射</TabsTrigger>
              <TabsTrigger value="manual">手动导入</TabsTrigger>
            </TabsList>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>同步日志</span>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      导出日志
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {syncLogs.length > 0 ? (
                      syncLogs.map(log => (
                        <div key={log.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          {getLogIcon(log.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{log.message}</span>
                              <span className="text-xs text-gray-500">{log.timestamp}</span>
                            </div>
                            {log.details && (
                              <p className="text-xs text-gray-600 mt-1">{log.details}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        暂无日志记录
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mapping">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>数据映射配置</span>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      编辑映射
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        数据映射定义了源系统字段与目标系统字段的对应关系
                      </AlertDescription>
                    </Alert>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left p-3 font-medium">源字段</th>
                            <th className="text-left p-3 font-medium">目标字段</th>
                            <th className="text-left p-3 font-medium">转换规则</th>
                            <th className="text-left p-3 font-medium">状态</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataMappings.map((mapping, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-3">{mapping.sourceField}</td>
                              <td className="p-3">{mapping.targetField}</td>
                              <td className="p-3">
                                <Badge variant="outline">
                                  {mapping.transformation || '直接映射'}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Badge className="bg-green-100 text-green-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  正常
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle>手动导入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        支持 Excel (.xlsx, .xls) 和 CSV 格式的成绩文件导入
                      </AlertDescription>
                    </Alert>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">拖拽文件到此处或点击选择</p>
                      <p className="text-sm text-gray-500 mb-4">支持的格式: .xlsx, .xls, .csv</p>
                      <Input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                        id="file-upload"
                      />
                      <Label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer">
                          选择文件
                        </Button>
                      </Label>
                    </div>

                    <div className="flex items-center justify-between">
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        下载模板
                      </Button>
                      <Button disabled>
                        <Upload className="w-4 h-4 mr-2" />
                        开始导入
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}