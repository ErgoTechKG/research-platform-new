import { useState, useRef } from 'react'
import { Upload, FileText, AlertCircle, CheckCircle, X, Download, RotateCcw, FileSpreadsheet, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Progress } from '../components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { ScrollArea } from '../components/ui/scroll-area'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'

interface ImportType {
  id: string
  name: string
  description: string
  fields: string[]
}

interface FieldMapping {
  excelColumn: string
  systemField: string
}

interface ValidationError {
  row: number
  column: string
  message: string
  value: string
}

interface ImportResult {
  totalRecords: number
  successCount: number
  errorCount: number
  errors: ValidationError[]
}

export default function BatchImportTool() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedImportType, setSelectedImportType] = useState<string>('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileData, setFileData] = useState<any[]>([])
  const [excelColumns, setExcelColumns] = useState<string[]>([])
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const importTypes: ImportType[] = [
    {
      id: 'students',
      name: '学生信息',
      description: '导入学生基本信息',
      fields: ['学生姓名', '学生ID', '所属班级', '联系电话', '邮箱地址']
    },
    {
      id: 'grades',
      name: '成绩数据',
      description: '导入学生成绩信息',
      fields: ['学生ID', '课程名称', '成绩', '学期', '学分']
    },
    {
      id: 'mentors',
      name: '导师信息',
      description: '导入导师基本信息',
      fields: ['导师姓名', '工号', '研究方向', '联系方式', '可带学生数']
    },
    {
      id: 'courses',
      name: '课程信息',
      description: '导入课程基本信息',
      fields: ['课程编号', '课程名称', '学分', '课时', '授课教师']
    }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // Simulate file parsing
      simulateFileData(file)
    }
  }

  const simulateFileData = (file: File) => {
    // Simulate Excel columns detection
    const columns = ['姓名', '学号', '班级', '电话', '邮箱']
    setExcelColumns(columns)
    
    // Simulate file data
    const data = [
      { '姓名': '张三', '学号': '2024001', '班级': '科研实验班1班', '电话': '13800138001', '邮箱': 'zhangsan@example.com' },
      { '姓名': '李四', '学号': '2024002', '班级': '科研实验班1班', '电话': '13800138002', '邮箱': 'lisi@example.com' },
      { '姓名': '王五', '学号': '2024003', '班级': '科研实验班2班', '电话': '13800138003', '邮箱': 'wangwu@example.com' },
      { '姓名': '赵六', '学号': '2024004', '班级': '科研实验班2班', '电话': '13800138004', '邮箱': 'zhaoliu@example.com' },
      { '姓名': '孙七', '学号': '2024005', '班级': '科研实验班1班', '电话': '13800138005', '邮箱': 'sunqi@example.com' }
    ]
    setFileData(data)
    setPreviewData(data.slice(0, 3)) // Preview first 3 rows
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setUploadedFile(file)
      simulateFileData(file)
    }
  }

  const handleAutoMatch = () => {
    const importType = importTypes.find(t => t.id === selectedImportType)
    if (!importType) return

    const mappings: FieldMapping[] = []
    
    // Simple auto-matching logic
    const matchMap: { [key: string]: string } = {
      '姓名': '学生姓名',
      '学号': '学生ID',
      '班级': '所属班级',
      '电话': '联系电话',
      '邮箱': '邮箱地址'
    }

    excelColumns.forEach(column => {
      const systemField = matchMap[column] || ''
      if (systemField && importType.fields.includes(systemField)) {
        mappings.push({
          excelColumn: column,
          systemField: systemField
        })
      }
    })

    setFieldMappings(mappings)
  }

  const handleFieldMappingChange = (excelColumn: string, systemField: string) => {
    setFieldMappings(prev => {
      const existing = prev.find(m => m.excelColumn === excelColumn)
      if (existing) {
        return prev.map(m => 
          m.excelColumn === excelColumn 
            ? { ...m, systemField } 
            : m
        )
      } else {
        return [...prev, { excelColumn, systemField }]
      }
    })
  }

  const validateData = () => {
    const errors: ValidationError[] = []
    
    fileData.forEach((row, index) => {
      // Simulate validation
      if (!row['学号'] || row['学号'].length !== 7) {
        errors.push({
          row: index + 1,
          column: '学号',
          message: '学号格式不正确',
          value: row['学号'] || ''
        })
      }
      
      if (row['邮箱'] && !row['邮箱'].includes('@')) {
        errors.push({
          row: index + 1,
          column: '邮箱',
          message: '邮箱格式不正确',
          value: row['邮箱']
        })
      }
    })
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleImport = async () => {
    setImporting(true)
    setImportProgress(0)
    
    // Simulate import progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setImportProgress(i)
    }
    
    // Simulate import result
    const result: ImportResult = {
      totalRecords: fileData.length,
      successCount: fileData.length - validationErrors.length,
      errorCount: validationErrors.length,
      errors: validationErrors
    }
    
    setImportResult(result)
    setImporting(false)
    setCurrentStep(4)
  }

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedImportType) {
      alert('请选择导入类型')
      return
    }
    
    if (currentStep === 2 && !uploadedFile) {
      alert('请上传文件')
      return
    }
    
    if (currentStep === 2 && uploadedFile) {
      // Auto-match fields when moving to step 3
      handleAutoMatch()
    }
    
    if (currentStep === 3) {
      // Validate data before import
      if (!validateData()) {
        alert('数据验证失败，请检查错误信息')
        return
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const resetImport = () => {
    setCurrentStep(1)
    setSelectedImportType('')
    setUploadedFile(null)
    setFileData([])
    setExcelColumns([])
    setFieldMappings([])
    setImportProgress(0)
    setImportResult(null)
    setPreviewData([])
    setValidationErrors([])
  }

  const downloadTemplate = () => {
    // Simulate template download
    const importType = importTypes.find(t => t.id === selectedImportType)
    if (importType) {
      alert(`下载${importType.name}导入模板`)
    }
  }

  const downloadErrorReport = () => {
    // Simulate error report download
    alert('下载错误报告')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">批量导入工具</h1>
          <p className="text-muted-foreground">向导式批量数据导入，支持Excel文件导入、字段映射和数据验证</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>批量数据导入向导</CardTitle>
              <span className="text-sm text-muted-foreground">步骤 {currentStep}/4</span>
            </div>
            <Progress value={currentStep * 25} className="mt-2" />
          </CardHeader>
          <CardContent>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label>选择导入类型</Label>
                  <Select value={selectedImportType} onValueChange={setSelectedImportType}>
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="请选择要导入的数据类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {importTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name} - {type.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedImportType && (
                  <div className="mt-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>导入须知</AlertTitle>
                      <AlertDescription>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• 支持 Excel (.xlsx, .xls) 格式文件</li>
                          <li>• 文件大小不超过 10MB</li>
                          <li>• 第一行应为列标题</li>
                          <li>• 确保数据格式正确，避免导入失败</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    <div className="mt-4">
                      <h3 className="font-medium mb-2">必需字段</h3>
                      <div className="flex flex-wrap gap-2">
                        {importTypes.find(t => t.id === selectedImportType)?.fields.map(field => (
                          <Badge key={field} variant="outline">{field}</Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={downloadTemplate}
                      variant="outline"
                      className="mt-4"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      下载导入模板
                    </Button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>文件上传</Label>
                  <div
                    className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                      拖拽Excel文件到此处
                    </p>
                    <p className="text-sm text-gray-500">或</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      选择文件
                    </Button>
                  </div>
                </div>

                {uploadedFile && (
                  <Alert>
                    <FileSpreadsheet className="h-4 w-4" />
                    <AlertTitle>文件已上传</AlertTitle>
                    <AlertDescription>
                      <div className="mt-2 space-y-1">
                        <p>文件名: {uploadedFile.name}</p>
                        <p>大小: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <p>检测到: {fileData.length} 条记录</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {previewData.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2">数据预览（前3条）</h3>
                    <ScrollArea className="h-[200px] w-full border rounded">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {excelColumns.map(col => (
                              <TableHead key={col}>{col}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((row, index) => (
                            <TableRow key={index}>
                              {excelColumns.map(col => (
                                <TableCell key={col}>{row[col]}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <Label>字段映射</Label>
                  <Button 
                    onClick={handleAutoMatch}
                    variant="outline"
                    size="sm"
                  >
                    自动匹配
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-2 font-medium text-sm">
                    <div className="col-span-2">Excel列</div>
                    <div className="text-center">→</div>
                    <div className="col-span-2">系统字段</div>
                  </div>
                  
                  {excelColumns.map(column => {
                    const mapping = fieldMappings.find(m => m.excelColumn === column)
                    const importType = importTypes.find(t => t.id === selectedImportType)
                    
                    return (
                      <div key={column} className="grid grid-cols-5 gap-2 items-center">
                        <div className="col-span-2 text-sm">
                          {column}
                        </div>
                        <div className="text-center">→</div>
                        <div className="col-span-2">
                          <Select
                            value={mapping?.systemField || ''}
                            onValueChange={(value) => handleFieldMappingChange(column, value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="选择系统字段" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">不导入</SelectItem>
                              {importType?.fields.map(field => (
                                <SelectItem key={field} value={field}>
                                  {field}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {validationErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>数据验证失败</AlertTitle>
                    <AlertDescription>
                      <ScrollArea className="h-[150px] mt-2">
                        <ul className="space-y-1 text-sm">
                          {validationErrors.map((error, index) => (
                            <li key={index}>
                              第{error.row}行 - {error.column}: {error.message} (值: {error.value})
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-muted-foreground">
                    已映射 {fieldMappings.length} / {excelColumns.length} 个字段
                  </p>
                  <Button
                    onClick={() => validateData()}
                    variant="outline"
                    size="sm"
                  >
                    验证数据
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                {importing ? (
                  <div className="space-y-4 py-8">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">正在导入数据...</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        请勿关闭页面，导入过程可能需要几分钟
                      </p>
                    </div>
                    <Progress value={importProgress} />
                    <p className="text-center text-sm text-muted-foreground">
                      {importProgress}%
                    </p>
                  </div>
                ) : importResult && (
                  <div className="space-y-4">
                    <Alert className={importResult.errorCount > 0 ? 'border-yellow-500' : 'border-green-500'}>
                      {importResult.errorCount > 0 ? (
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <AlertTitle>
                        {importResult.errorCount > 0 ? '导入部分成功' : '导入成功'}
                      </AlertTitle>
                      <AlertDescription>
                        <div className="mt-2 space-y-1">
                          <p>总记录数: {importResult.totalRecords}</p>
                          <p className="text-green-600">成功导入: {importResult.successCount} 条</p>
                          {importResult.errorCount > 0 && (
                            <p className="text-red-600">失败记录: {importResult.errorCount} 条</p>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>

                    {importResult.errors.length > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">错误详情</h3>
                          <Button 
                            onClick={downloadErrorReport}
                            variant="outline"
                            size="sm"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            下载错误报告
                          </Button>
                        </div>
                        <ScrollArea className="h-[200px] border rounded">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>行号</TableHead>
                                <TableHead>字段</TableHead>
                                <TableHead>错误信息</TableHead>
                                <TableHead>原始值</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {importResult.errors.map((error, index) => (
                                <TableRow key={index}>
                                  <TableCell>{error.row}</TableCell>
                                  <TableCell>{error.column}</TableCell>
                                  <TableCell>{error.message}</TableCell>
                                  <TableCell>{error.value}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </ScrollArea>
                      </div>
                    )}

                    <div className="flex justify-center gap-4 mt-6">
                      <Button 
                        onClick={resetImport}
                        variant="outline"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        重新导入
                      </Button>
                      <Button onClick={() => window.location.href = '/'}>
                        完成
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep < 4 && (
              <div className="flex justify-between mt-6">
                <Button
                  onClick={handlePrevStep}
                  variant="outline"
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  上一步
                </Button>
                <Button
                  onClick={currentStep === 3 ? handleImport : handleNextStep}
                  disabled={
                    (currentStep === 1 && !selectedImportType) ||
                    (currentStep === 2 && !uploadedFile)
                  }
                >
                  {currentStep === 3 ? '开始导入' : '下一步'}
                  {currentStep < 3 && <ChevronRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Import history */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>导入历史</CardTitle>
            <CardDescription>查看最近的导入记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>导入时间</TableHead>
                  <TableHead>数据类型</TableHead>
                  <TableHead>文件名</TableHead>
                  <TableHead>总记录数</TableHead>
                  <TableHead>成功数</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2024-01-20 14:30</TableCell>
                  <TableCell>学生信息</TableCell>
                  <TableCell>students_2024.xlsx</TableCell>
                  <TableCell>150</TableCell>
                  <TableCell>148</TableCell>
                  <TableCell>
                    <Badge variant="secondary">部分成功</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      查看详情
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-01-18 10:15</TableCell>
                  <TableCell>成绩数据</TableCell>
                  <TableCell>grades_final.xlsx</TableCell>
                  <TableCell>320</TableCell>
                  <TableCell>320</TableCell>
                  <TableCell>
                    <Badge variant="default">成功</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      查看详情
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-01-15 16:20</TableCell>
                  <TableCell>导师信息</TableCell>
                  <TableCell>mentors_list.xlsx</TableCell>
                  <TableCell>45</TableCell>
                  <TableCell>45</TableCell>
                  <TableCell>
                    <Badge variant="default">成功</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      查看详情
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}