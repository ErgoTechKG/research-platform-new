import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  MentorCard, 
  MatchSelector, 
  TaskBoard, 
  CourseCard, 
  ScoringComponent 
} from '@/components/business';
import { designTokens } from '@/styles/design-tokens';

const DesignSystemDemo: React.FC = () => {
  // Sample data for business components
  const sampleMentors = [
    {
      id: '1',
      name: '张教授',
      avatar: '/avatars/zhang.jpg',
      lab: '人工智能实验室',
      tags: ['深度学习', '计算机视觉', '机器学习'],
      availableSlots: '3-5',
      currentStudents: 12,
      isOnline: true,
    },
    {
      id: '2',
      name: '李副教授',
      avatar: '/avatars/li.jpg',
      lab: '数据挖掘实验室',
      tags: ['数据挖掘', '大数据', 'Python'],
      availableSlots: '2-4',
      currentStudents: 8,
      isOnline: false,
    },
  ];

  const [selectedMentors, setSelectedMentors] = useState<any[]>([]);
  
  const sampleTasks = [
    {
      id: '1',
      title: '完成文献调研报告',
      description: '针对深度学习在图像识别领域的应用进行文献调研',
      deadline: '2024-03-15',
      priority: 'high' as const,
      assignee: { id: '1', name: '张三', avatar: '/avatars/student1.jpg' },
      tags: ['文献调研', '深度学习'],
      status: 'todo' as const,
    },
    {
      id: '2',
      title: '数据预处理',
      description: '清洗和预处理实验数据集',
      deadline: '2024-03-20',
      priority: 'medium' as const,
      assignee: { id: '2', name: '李四', avatar: '/avatars/student2.jpg' },
      tags: ['数据处理'],
      status: 'in-progress' as const,
    },
    {
      id: '3',
      title: '模型训练',
      description: '训练神经网络模型',
      deadline: '2024-03-25',
      priority: 'low' as const,
      assignee: { id: '3', name: '王五', avatar: '/avatars/student3.jpg' },
      tags: ['模型训练', 'CNN'],
      status: 'done' as const,
    },
  ];

  const sampleCourse = {
    id: '1',
    title: '深度学习理论与实践',
    description: '本课程将深入讲解深度学习的理论基础，包括神经网络、卷积神经网络、循环神经网络等内容，并通过实际项目让学生掌握深度学习的应用技能。',
    instructor: {
      name: '张教授',
      avatar: '/avatars/zhang.jpg',
    },
    progress: 65,
    duration: '16周',
    students: 24,
    maxStudents: 30,
    startDate: '2024-02-20',
    endDate: '2024-06-15',
    rating: 4.8,
    tags: ['深度学习', '神经网络', '计算机视觉'],
    status: 'ongoing' as const,
    level: 'advanced' as const,
  };

  const scoringDimensions = [
    {
      id: 'innovation',
      name: '创新性',
      description: '研究内容的创新程度和独创性',
      maxScore: 100,
      weight: 30,
      criteriaType: 'slider' as const,
    },
    {
      id: 'technical',
      name: '技术质量',
      description: '技术方案的可行性和实现质量',
      maxScore: 5,
      weight: 25,
      criteriaType: 'star' as const,
    },
    {
      id: 'presentation',
      name: '答辩表现',
      description: '答辩过程中的表达能力和回答质量',
      maxScore: 100,
      weight: 20,
      criteriaType: 'category' as const,
      categories: [
        { value: 90, label: '优秀', description: '表达清晰，回答准确' },
        { value: 80, label: '良好', description: '表达较好，基本准确' },
        { value: 70, label: '及格', description: '表达一般，部分准确' },
        { value: 60, label: '待改进', description: '表达不清，回答有误' },
      ],
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">设计系统组件库</h1>
        <p className="text-muted-foreground">
          Research Platform Design System - 基于 Shadcn UI 的业务组件库
        </p>
      </div>

      <Tabs defaultValue="colors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="colors">色彩系统</TabsTrigger>
          <TabsTrigger value="typography">字体系统</TabsTrigger>
          <TabsTrigger value="spacing">间距系统</TabsTrigger>
          <TabsTrigger value="components">基础组件</TabsTrigger>
          <TabsTrigger value="business">业务组件</TabsTrigger>
          <TabsTrigger value="patterns">交互模式</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>主色调系统</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 gap-2">
                  {Object.entries(designTokens.colors.primary).map(([shade, color]) => (
                    <div key={shade} className="text-center space-y-2">
                      <div 
                        className="h-16 w-full rounded-lg border"
                        style={{ backgroundColor: color }}
                      />
                      <div className="text-xs">
                        <div className="font-medium">{shade}</div>
                        <div className="text-muted-foreground">{color}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>语义化色彩</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {['success', 'warning', 'danger'].map(colorName => (
                    <div key={colorName} className="space-y-2">
                      <h4 className="font-medium capitalize">{colorName}</h4>
                      <div className="grid grid-cols-5 gap-1">
                        {Object.entries(designTokens.colors[colorName as keyof typeof designTokens.colors]).slice(0, 5).map(([shade, color]) => (
                          <div key={shade} className="space-y-1">
                            <div 
                              className="h-12 w-full rounded border"
                              style={{ backgroundColor: color as string }}
                            />
                            <div className="text-xs text-center">{shade}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="typography">
          <Card>
            <CardHeader>
              <CardTitle>字体系统</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">字体大小</h3>
                <div className="space-y-4">
                  {Object.entries(designTokens.typography.fontSize).map(([size, value]) => (
                    <div key={size} className="flex items-center gap-4">
                      <div className="w-16 text-sm text-muted-foreground">{size}</div>
                      <div className="w-20 text-sm text-muted-foreground">{value}</div>
                      <div style={{ fontSize: value }}>
                        快速的棕色狐狸跳过懒惰的狗
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">字重系统</h3>
                <div className="space-y-2">
                  {Object.entries(designTokens.typography.fontWeight).map(([weight, value]) => (
                    <div key={weight} className="flex items-center gap-4">
                      <div className="w-20 text-sm text-muted-foreground">{weight}</div>
                      <div className="w-16 text-sm text-muted-foreground">{value}</div>
                      <div style={{ fontWeight: value }}>
                        字体重量示例文本
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spacing">
          <Card>
            <CardHeader>
              <CardTitle>间距系统</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-4">
                {Object.entries(designTokens.spacing).slice(1, 13).map(([size, value]) => (
                  <div key={size} className="text-center space-y-2">
                    <div className="text-sm font-medium">{size}</div>
                    <div className="text-xs text-muted-foreground">{value}</div>
                    <div className="flex justify-center">
                      <div 
                        className="bg-primary"
                        style={{ width: value, height: value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="components">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>按钮组件</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <Button>Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                  <div className="flex gap-4 items-center">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>标签组件</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>导师卡片组件</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleMentors.map(mentor => (
                    <MentorCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>课程卡片组件</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-w-md">
                  <CourseCard course={sampleCourse} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>双选匹配器</CardTitle>
              </CardHeader>
              <CardContent>
                <MatchSelector
                  availableMentors={sampleMentors}
                  selectedMentors={selectedMentors}
                  onSelectMentor={(mentor) => {
                    if (selectedMentors.length < 5 && !selectedMentors.find(m => m.id === mentor.id)) {
                      setSelectedMentors([...selectedMentors, mentor]);
                    }
                  }}
                  onRemoveMentor={(mentorId) => {
                    setSelectedMentors(selectedMentors.filter(m => m.id !== mentorId));
                  }}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>任务看板</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskBoard tasks={sampleTasks} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>评分组件</CardTitle>
              </CardHeader>
              <CardContent>
                <ScoringComponent
                  dimensions={scoringDimensions}
                  showTotal={true}
                  showWeights={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>交互模式演示</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">悬停效果</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <p>卡片悬停</p>
                        </CardContent>
                      </Card>
                      <Button className="hover:scale-105 transition-transform">
                        按钮悬停
                      </Button>
                      <Badge className="hover:bg-primary/80 transition-colors cursor-pointer">
                        标签悬停
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">加载状态</h3>
                    <div className="flex gap-4">
                      <Button disabled>
                        Loading...
                      </Button>
                      <div className="animate-pulse bg-muted h-4 w-32 rounded" />
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">状态反馈</h3>
                    <div className="space-y-2">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800">操作成功！数据已保存。</p>
                      </div>
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800">警告：请检查输入内容。</p>
                      </div>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">错误：操作失败，请重试。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignSystemDemo;