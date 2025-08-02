import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Navigate } from 'react-router-dom'
import { 
  Type, Square, Image, BarChart, Undo, Redo, Save, Eye, Send,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  Plus, Download, Upload, Users, Circle, Triangle
} from 'lucide-react'

interface DesignElement {
  id: string
  type: 'text' | 'shape' | 'image' | 'chart'
  x: number
  y: number
  width: number
  height: number
  content?: string
  fontSize?: number
  fontFamily?: string
  color?: string
  backgroundColor?: string
  alignment?: 'left' | 'center' | 'right'
  bold?: boolean
  italic?: boolean
  underline?: boolean
  src?: string
  shapeType?: 'rectangle' | 'circle' | 'triangle'
}

interface Template {
  id: string
  name: string
  thumbnail: string
  elements: DesignElement[]
}

interface Collaborator {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastActive: Date
}

export default function PosterDesigner() {
  const { user } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<DesignElement[]>([])
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null)
  const [selectedTool, setSelectedTool] = useState<string>('select')
  const [history, setHistory] = useState<DesignElement[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Mock templates
    setTemplates([
      {
        id: '1',
        name: '学术海报模板1',
        thumbnail: '/templates/academic1.jpg',
        elements: [
          {
            id: 'title',
            type: 'text',
            x: 50,
            y: 50,
            width: 700,
            height: 100,
            content: '研究项目标题',
            fontSize: 48,
            fontFamily: '黑体',
            color: '#000000',
            alignment: 'center',
            bold: true
          }
        ]
      },
      {
        id: '2',
        name: '学术海报模板2',
        thumbnail: '/templates/academic2.jpg',
        elements: []
      },
      {
        id: '3',
        name: '简约风格',
        thumbnail: '/templates/minimal.jpg',
        elements: []
      }
    ])

    // Mock collaborators
    setCollaborators([
      {
        id: '1',
        name: '张同学',
        isOnline: true,
        lastActive: new Date()
      },
      {
        id: '2',
        name: '李同学',
        isOnline: false,
        lastActive: new Date(Date.now() - 1000 * 60 * 5)
      }
    ])

    // Initialize with a title element
    const initialElements = [{
      id: Date.now().toString(),
      type: 'text' as const,
      x: 100,
      y: 50,
      width: 600,
      height: 80,
      content: '研究海报标题',
      fontSize: 36,
      fontFamily: '黑体',
      color: '#000000',
      alignment: 'center' as const,
      bold: true
    }]
    setElements(initialElements)
    setHistory([initialElements])
    setHistoryIndex(0)
  }, [])

  useEffect(() => {
    drawCanvas()
  }, [elements, selectedElement])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Draw white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#f0f0f0'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw elements
    elements.forEach(element => {
      if (element.type === 'text') {
        ctx.font = `${element.bold ? 'bold ' : ''}${element.italic ? 'italic ' : ''}${element.fontSize}px ${element.fontFamily}`
        ctx.fillStyle = element.color || '#000000'
        ctx.textAlign = element.alignment || 'left'
        ctx.textBaseline = 'top'
        
        const textX = element.alignment === 'center' ? element.x + element.width / 2 :
                     element.alignment === 'right' ? element.x + element.width : element.x
        
        ctx.fillText(element.content || '', textX, element.y)
        
        if (element.underline) {
          const metrics = ctx.measureText(element.content || '')
          ctx.beginPath()
          ctx.moveTo(textX - (element.alignment === 'center' ? metrics.width / 2 : 0), element.y + element.fontSize)
          ctx.lineTo(textX + (element.alignment === 'center' ? metrics.width / 2 : metrics.width), element.y + element.fontSize)
          ctx.strokeStyle = element.color || '#000000'
          ctx.stroke()
        }
      } else if (element.type === 'shape') {
        ctx.fillStyle = element.backgroundColor || '#000000'
        if (element.shapeType === 'rectangle') {
          ctx.fillRect(element.x, element.y, element.width, element.height)
        } else if (element.shapeType === 'circle') {
          ctx.beginPath()
          ctx.arc(element.x + element.width / 2, element.y + element.height / 2, Math.min(element.width, element.height) / 2, 0, 2 * Math.PI)
          ctx.fill()
        } else if (element.shapeType === 'triangle') {
          ctx.beginPath()
          ctx.moveTo(element.x + element.width / 2, element.y)
          ctx.lineTo(element.x, element.y + element.height)
          ctx.lineTo(element.x + element.width, element.y + element.height)
          ctx.closePath()
          ctx.fill()
        }
      }

      // Draw selection border
      if (selectedElement?.id === element.id) {
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(element.x - 5, element.y - 5, element.width + 10, element.height + 10)
        ctx.setLineDash([])
      }
    })
  }

  const addElement = (type: DesignElement['type']) => {
    const newElement: DesignElement = {
      id: Date.now().toString(),
      type,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 40 : 100,
      content: type === 'text' ? '新文本' : undefined,
      fontSize: type === 'text' ? 16 : undefined,
      fontFamily: type === 'text' ? 'Arial' : undefined,
      color: type === 'text' ? '#000000' : undefined,
      backgroundColor: type === 'shape' ? '#3b82f6' : undefined,
      shapeType: type === 'shape' ? 'rectangle' : undefined,
      alignment: type === 'text' ? 'left' : undefined
    }
    
    const newElements = [...elements, newElement]
    setElements(newElements)
    setSelectedElement(newElement)
    updateHistory(newElements)
  }

  const updateElement = (updates: Partial<DesignElement>) => {
    if (!selectedElement) return
    
    const newElements = elements.map(el => 
      el.id === selectedElement.id ? { ...el, ...updates } : el
    )
    setElements(newElements)
    setSelectedElement({ ...selectedElement, ...updates })
    updateHistory(newElements)
  }

  const updateHistory = (newElements: DesignElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newElements)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if clicked on an element
    const clickedElement = elements.find(el => 
      x >= el.x && x <= el.x + el.width &&
      y >= el.y && y <= el.y + el.height
    )

    if (clickedElement) {
      setSelectedElement(clickedElement)
    } else {
      setSelectedElement(null)
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedElement) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (x >= selectedElement.x && x <= selectedElement.x + selectedElement.width &&
        y >= selectedElement.y && y <= selectedElement.y + selectedElement.height) {
      setIsDragging(true)
      setDragStart({ x: x - selectedElement.x, y: y - selectedElement.y })
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    updateElement({
      x: x - dragStart.x,
      y: y - dragStart.y
    })
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
  }

  const loadTemplate = (template: Template) => {
    setElements(template.elements)
    updateHistory(template.elements)
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check if user has permission (students only)
  if (user.role !== 'student') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">海报设计器</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => console.log('Save')}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
            <Button variant="outline" onClick={() => console.log('Preview')}>
              <Eye className="h-4 w-4 mr-2" />
              预览
            </Button>
            <Button onClick={() => console.log('Submit')}>
              <Send className="h-4 w-4 mr-2" />
              提交
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex gap-2 border-r pr-4">
                <Button
                  variant={selectedTool === 'text' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedTool('text')
                    addElement('text')
                  }}
                >
                  <Type className="h-4 w-4" />
                  文字
                </Button>
                <Button
                  variant={selectedTool === 'shape' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedTool('shape')
                    addElement('shape')
                  }}
                >
                  <Square className="h-4 w-4" />
                  图形
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <Image className="h-4 w-4" />
                  图片
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <BarChart className="h-4 w-4" />
                  图表
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="h-4 w-4" />
                  撤销
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo className="h-4 w-4" />
                  重做
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-4">
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="cursor-pointer"
                    onClick={handleCanvasClick}
                    onMouseDown={handleCanvasMouseDown}
                    onMouseMove={handleCanvasMouseMove}
                    onMouseUp={handleCanvasMouseUp}
                    onMouseLeave={handleCanvasMouseUp}
                  />
                </div>
                
                {/* Collaborators */}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                  <span>协作者:</span>
                  {collaborators.map(collaborator => (
                    <div key={collaborator.id} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                        {collaborator.name[0]}
                      </div>
                      <span>{collaborator.name}</span>
                      {collaborator.isOnline ? (
                        <Badge variant="secondary" className="text-xs">在线</Badge>
                      ) : (
                        <span className="text-xs text-gray-500">
                          {Math.floor((Date.now() - collaborator.lastActive.getTime()) / 60000)}分钟前
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-4">
            {/* Properties Panel */}
            {selectedElement && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">属性面板</CardTitle>
                  <p className="text-sm text-gray-500">
                    选中元素：{selectedElement.type === 'text' ? '文本' : '图形'}
                  </p>
                </CardHeader>
                <CardContent>
                  {selectedElement.type === 'text' && (
                    <div className="space-y-4">
                      <div>
                        <Label>文本内容</Label>
                        <Input
                          value={selectedElement.content || ''}
                          onChange={(e) => updateElement({ content: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>字体</Label>
                        <Select
                          value={selectedElement.fontFamily}
                          onValueChange={(value) => updateElement({ fontFamily: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="黑体">黑体</SelectItem>
                            <SelectItem value="宋体">宋体</SelectItem>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>大小: {selectedElement.fontSize}px</Label>
                        <Slider
                          value={[selectedElement.fontSize || 16]}
                          onValueChange={([value]) => updateElement({ fontSize: value })}
                          min={12}
                          max={72}
                          step={1}
                        />
                      </div>
                      <div>
                        <Label>颜色</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={selectedElement.color}
                            onChange={(e) => updateElement({ color: e.target.value })}
                            className="w-20"
                          />
                          <Input
                            value={selectedElement.color}
                            onChange={(e) => updateElement({ color: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>对齐</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedElement.alignment === 'left' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateElement({ alignment: 'left' })}
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={selectedElement.alignment === 'center' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateElement({ alignment: 'center' })}
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={selectedElement.alignment === 'right' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateElement({ alignment: 'right' })}
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>样式</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedElement.bold ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateElement({ bold: !selectedElement.bold })}
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={selectedElement.italic ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateElement({ italic: !selectedElement.italic })}
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                          <Button
                            variant={selectedElement.underline ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateElement({ underline: !selectedElement.underline })}
                          >
                            <Underline className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {selectedElement.type === 'shape' && (
                    <div className="space-y-4">
                      <div>
                        <Label>形状类型</Label>
                        <Select
                          value={selectedElement.shapeType}
                          onValueChange={(value: 'rectangle' | 'circle' | 'triangle') => 
                            updateElement({ shapeType: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rectangle">
                              <div className="flex items-center gap-2">
                                <Square className="h-4 w-4" />
                                矩形
                              </div>
                            </SelectItem>
                            <SelectItem value="circle">
                              <div className="flex items-center gap-2">
                                <Circle className="h-4 w-4" />
                                圆形
                              </div>
                            </SelectItem>
                            <SelectItem value="triangle">
                              <div className="flex items-center gap-2">
                                <Triangle className="h-4 w-4" />
                                三角形
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>背景色</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={selectedElement.backgroundColor}
                            onChange={(e) => updateElement({ backgroundColor: e.target.value })}
                            className="w-20"
                          />
                          <Input
                            value={selectedElement.backgroundColor}
                            onChange={(e) => updateElement({ backgroundColor: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Template Library */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">模板库</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {templates.map(template => (
                      <Button
                        key={template.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => loadTemplate(template)}
                      >
                        {template.name}
                      </Button>
                    ))}
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      自定义模板
                    </Button>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}