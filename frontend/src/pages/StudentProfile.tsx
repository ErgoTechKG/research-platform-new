import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  BarChart3, 
  Download, 
  Star,
  Calendar,
  Award,
  Brain,
  Users,
  Target,
  TrendingUp,
  BookOpen,
  Lightbulb,
  MessageCircle,
  Trophy
} from 'lucide-react'

interface StudentProfileProps {
  studentId?: string
}

const StudentProfile: React.FC<StudentProfileProps> = ({ studentId = '2021-CS-001' }) => {
  // Mock student data based on the UI design requirements
  const studentData = {
    basicInfo: {
      name: '李明华',
      studentId: '2021-CS-001',
      email: 'liminghua@university.edu.cn',
      major: '计算机科学与技术',
      grade: '2021级本科',
      gpa: 3.8,
      maxGpa: 4.0,
      advisor: '王教授',
      lab: 'AI-Lab-205',
      avatar: '/avatars/student-01.jpg'
    },
    abilities: {
      theoretical: 88,
      practical: 85,
      innovation: 92,
      communication: 76
    },
    interests: [
      { name: '机器学习', percentage: 85, category: 'research' },
      { name: '软件开发', percentage: 70, category: 'development' },
      { name: '数据分析', percentage: 60, category: 'analysis' },
      { name: '游戏开发', percentage: 45, category: 'development' },
      { name: '网络安全', percentage: 35, category: 'security' }
    ],
    personality: {
      extraversion: 70,
      conscientiousness: 90,
      openness: 80,
      agreeableness: 60,
      emotionalStability: 85
    },
    collaborationHistory: [
      {
        id: 1,
        period: '2024.03 - 2024.05',
        title: '机器学习项目',
        type: 'research',
        teamSize: 3,
        rating: 4.8,
        achievement: '获ACM竞赛二等奖'
      },
      {
        id: 2,
        period: '2023.09 - 2024.01',
        title: '数据挖掘课程项目',
        type: 'course',
        teamSize: 4,
        rating: 4.2,
        achievement: '发表会议论文1篇'
      },
      {
        id: 3,
        period: '2023.06 - 2023.08',
        title: '软件工程实习',
        type: 'internship',
        teamSize: 1,
        rating: 4.5,
        achievement: '获得返聘offer'
      }
    ],
    recommendations: [
      {
        id: 1,
        title: '深度学习实验室',
        matchPercentage: 95,
        reason: '兴趣高度吻合',
        category: 'high'
      },
      {
        id: 2,
        title: '大数据分析项目',
        matchPercentage: 92,
        reason: '技能互补性强',
        category: 'high'
      },
      {
        id: 3,
        title: '网络安全研究',
        matchPercentage: 76,
        reason: '需补充理论基础',
        category: 'medium'
      }
    ],
    classRanking: {
      overall: { rank: 3, total: 45, percentage: 7 },
      gpa: { rank: 5, total: 45, percentage: 11 },
      research: { rank: 2, total: 45, percentage: 4 }
    },
    trends: {
      theoretical: 12,
      practical: 8,
      innovation: 15,
      communication: 5
    }
  }

  const AbilityRadarChart = () => (
    <div className="relative w-full h-64 flex items-center justify-center">
      <div className="relative w-48 h-48">
        {/* Radar chart background */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          {/* Grid lines */}
          <g stroke="#e2e8f0" strokeWidth="1" fill="none">
            {[20, 40, 60, 80].map((radius) => (
              <polygon
                key={radius}
                points="100,20 150,65 150,135 100,180 50,135 50,65"
                transform={`scale(${radius / 80})`}
                transformOrigin="100 100"
              />
            ))}
            {/* Axis lines */}
            <line x1="100" y1="20" x2="100" y2="180" />
            <line x1="150" y1="65" x2="50" y2="135" />
            <line x1="150" y1="135" x2="50" y2="65" />
          </g>
          
          {/* Data polygon */}
          <polygon
            points={`
              100,${20 + (100 - studentData.abilities.theoretical) * 0.8}
              ${50 + studentData.abilities.practical * 0.5},${65 + (100 - studentData.abilities.practical) * 0.35}
              ${50 + studentData.abilities.communication * 0.5},${135 - (100 - studentData.abilities.communication) * 0.35}
              100,${180 - (100 - studentData.abilities.innovation) * 0.8}
            `}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
        </svg>
        
        {/* Labels */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-medium">
          理论基础
        </div>
        <div className="absolute top-12 right-1 text-xs font-medium">
          实践能力
        </div>
        <div className="absolute bottom-12 right-1 text-xs font-medium">
          沟通协作
        </div>
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-medium">
          创新思维
        </div>
      </div>
      
      {/* Scores */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>• 理论基础: {studentData.abilities.theoretical}/100</div>
          <div>• 实践能力: {studentData.abilities.practical}/100</div>
          <div>• 创新思维: {studentData.abilities.innovation}/100</div>
          <div>• 沟通协作: {studentData.abilities.communication}/100</div>
        </div>
      </div>
    </div>
  )

  const PersonalityChart = () => (
    <div className="space-y-4">
      {Object.entries(studentData.personality).map(([trait, value]) => {
        const traitNames: Record<string, string> = {
          extraversion: '外向性',
          conscientiousness: '严谨性',
          openness: '开放性',
          agreeableness: '宜人性',
          emotionalStability: '情绪稳定'
        }
        
        return (
          <div key={trait} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{traitNames[trait]}</span>
              <span>{value}%</span>
            </div>
            <Progress value={value} className="h-2" />
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">学生档案分析仪表盘</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              搜索
            </Button>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" />
              对比
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </div>

        {/* Student Basic Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <img src={studentData.basicInfo.avatar} alt="Student Avatar" className="object-cover" />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {studentData.basicInfo.name}
                  </h2>
                  <Badge variant="secondary">
                    {studentData.basicInfo.studentId}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{studentData.basicInfo.major}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{studentData.basicInfo.grade}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4" />
                    <span>GPA: {studentData.basicInfo.gpa}/{studentData.basicInfo.maxGpa}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>导师: {studentData.basicInfo.advisor}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <span>📧 {studentData.basicInfo.email}</span>
                  <span className="ml-6">📍 实验室: {studentData.basicInfo.lab}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Ability Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>学生能力雷达图</span>
              </CardTitle>
              <p className="text-sm text-gray-600">综合能力评估</p>
            </CardHeader>
            <CardContent>
              <AbilityRadarChart />
              <div className="mt-4 flex space-x-4">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  详细分析
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  趋势
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Interest & Personality Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-green-600" />
                <span>兴趣与性格分析</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="interests">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="interests">兴趣领域分布</TabsTrigger>
                  <TabsTrigger value="personality">性格特质分析</TabsTrigger>
                </TabsList>
                
                <TabsContent value="interests" className="space-y-3 mt-4">
                  {studentData.interests.map((interest, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>🔬 {interest.name}</span>
                        <span>{interest.percentage}%</span>
                      </div>
                      <Progress value={interest.percentage} className="h-2" />
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="personality" className="mt-4">
                  <PersonalityChart />
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Lightbulb className="h-4 w-4 inline mr-1" />
                      <strong>性格解读:</strong> 典型的研究型人格，适合深度钻研复杂问题，具备良好的执行力
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Collaboration History Timeline */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span>合作历史时间轴</span>
            </CardTitle>
            <p className="text-sm text-gray-600">学术合作历程 (最近2年)</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {studentData.collaborationHistory.map((collab, index) => (
                <div key={collab.id} className="relative flex items-start space-x-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    {index < studentData.collaborationHistory.length - 1 && (
                      <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-900">
                          {collab.period}
                        </span>
                        <Badge variant="outline">
                          {collab.type === 'research' ? '🔬' : collab.type === 'course' ? '📊' : '🔧'} 
                          {collab.title}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          (团队{collab.teamSize}人)
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < Math.floor(collab.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          ({collab.rating}/5.0)
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      🏆 {collab.achievement}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <p className="text-sm">
                <TrendingUp className="h-4 w-4 inline mr-1 text-green-600" />
                <strong>合作趋势:</strong> 团队协作能力逐年提升，已成为项目核心成员
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Grid - Recommendations and Planning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Condition-based Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span>条件匹配推荐</span>
              </CardTitle>
              <p className="text-sm text-gray-600">推荐匹配项目</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-red-600 mb-3">🔥 高匹配度 (&gt;90%):</h4>
                  {studentData.recommendations.filter(r => r.category === 'high').map((rec) => (
                    <div key={rec.id} className="p-3 border border-red-200 rounded-lg mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">🤖 {rec.title}</span>
                        <Badge variant="destructive">{rec.matchPercentage}%</Badge>
                      </div>
                      <p className="text-sm text-gray-600">原因: {rec.reason}</p>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-yellow-600 mb-3">🟡 中匹配度 (70-89%):</h4>
                  {studentData.recommendations.filter(r => r.category === 'medium').map((rec) => (
                    <div key={rec.id} className="p-3 border border-yellow-200 rounded-lg mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">🌐 {rec.title}</span>
                        <Badge variant="secondary">{rec.matchPercentage}%</Badge>
                      </div>
                      <p className="text-sm text-gray-600">原因: {rec.reason}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    查看更多
                  </Button>
                  <Button variant="outline" size="sm">
                    📋 应用
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-green-600" />
                <span>培养建议与规划</span>
              </CardTitle>
              <p className="text-sm text-gray-600">个性化培养建议</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">💡 短期建议 (近6个月):</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• 加强团队沟通技能培训</li>
                    <li>• 参与跨学科合作项目</li>
                    <li>• 准备研究生入学考试</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">🎯 中期规划 (1-2年):</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• 申请国际交换生项目</li>
                    <li>• 发表高质量学术论文</li>
                    <li>• 获得实习或工作经验</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">🚀 长期目标 (3-5年):</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• 攻读相关领域研究生学位</li>
                    <li>• 在顶级会议发表论文</li>
                    <li>• 成为技术领域专家</li>
                  </ul>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    制定计划
                  </Button>
                  <Button variant="outline" size="sm">
                    🔔 设置提醒
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Analysis */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <span>对比分析与统计</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Class Ranking */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📊 班级排名对比</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>综合能力:</span>
                    <span className="font-medium">{studentData.classRanking.overall.rank}/{studentData.classRanking.overall.total} (前{studentData.classRanking.overall.percentage}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GPA排名:</span>
                    <span className="font-medium">{studentData.classRanking.gpa.rank}/{studentData.classRanking.gpa.total} (前{studentData.classRanking.gpa.percentage}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>科研能力:</span>
                    <span className="font-medium">{studentData.classRanking.research.rank}/{studentData.classRanking.research.total} (前{studentData.classRanking.research.percentage}%)</span>
                  </div>
                </div>
              </div>

              {/* Development Trends */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">📈 能力发展趋势</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>理论:</span>
                    <span className="text-green-600 font-medium">▲+{studentData.trends.theoretical}分(6月内)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>实践:</span>
                    <span className="text-green-600 font-medium">▲+{studentData.trends.practical}分(6月内)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>创新:</span>
                    <span className="text-green-600 font-medium">▲+{studentData.trends.innovation}分(6月内)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>沟通:</span>
                    <span className="text-green-600 font-medium">▲+{studentData.trends.communication}分(6月内)</span>
                  </div>
                </div>
              </div>

              {/* Similar Students */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">🎯 同类学生对比</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>相似学生:</span>
                    <span className="font-medium">找到8位</span>
                  </div>
                  <div className="flex justify-between">
                    <span>平均GPA:</span>
                    <span className="font-medium">3.6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>发展轨迹:</span>
                    <span className="font-medium">89%相似</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <Award className="h-4 w-4 inline mr-1" />
                  <strong>优势:</strong> 学术能力突出
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <MessageCircle className="h-4 w-4 inline mr-1" />
                  <strong>关注:</strong> 沟通能力有提升空间
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StudentProfile