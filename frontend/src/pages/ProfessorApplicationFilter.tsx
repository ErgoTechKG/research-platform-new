import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Filter, 
  Search, 
  Download, 
  Eye, 
  CheckSquare, 
  X, 
  MoreHorizontal,
  User,
  GraduationCap,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  FileText,
  Mail,
  Clock,
  Award,
  BookOpen,
  Briefcase,
  Target,
  BarChart3
} from 'lucide-react';

interface StudentApplication {
  id: string;
  name: string;
  studentId: string;
  year: string;
  major: string;
  gpa: number;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  researchInterests: string[];
  skills: string[];
  experience: string[];
  statement: string;
  previousProjects: number;
  internships: number;
  publications: number;
  awards: string[];
  recommendation: string;
  timeCommitment: string;
  startDate: string;
  priority: 'high' | 'medium' | 'low';
  matchScore?: number;
}

interface FilterCriteria {
  gpaMin: number;
  gpaMax: number;
  year: string[];
  major: string[];
  status: string[];
  skills: string[];
  minProjects: number;
  minPublications: number;
  hasInternship: boolean | null;
  hasAwards: boolean | null;
  appliedDateFrom: string;
  appliedDateTo: string;
  searchTerm: string;
}

const ProfessorApplicationFilter: React.FC = () => {
  const [applications, setApplications] = useState<StudentApplication[]>([
    {
      id: 'app1',
      name: '张三',
      studentId: '2021001',
      year: '本科三年级',
      major: '计算机科学',
      gpa: 3.8,
      appliedDate: '2024-01-15',
      status: 'pending',
      researchInterests: ['机器学习', '深度学习', '计算机视觉'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV'],
      experience: ['机器学习项目', '计算机视觉竞赛'],
      statement: '对机器学习和计算机视觉有浓厚兴趣，希望在实验室进行深入研究...',
      previousProjects: 3,
      internships: 1,
      publications: 0,
      awards: ['优秀学生奖学金', 'ACM竞赛三等奖'],
      recommendation: '导师推荐信',
      timeCommitment: '每周20小时',
      startDate: '2024-03-01',
      priority: 'high',
      matchScore: 92
    },
    {
      id: 'app2',
      name: '李四',
      studentId: '2021002',
      year: '本科四年级',
      major: '软件工程',
      gpa: 3.6,
      appliedDate: '2024-01-12',
      status: 'pending',
      researchInterests: ['自然语言处理', '知识图谱'],
      skills: ['Python', 'Java', 'NLP', 'Neo4j'],
      experience: ['NLP项目实习', '知识图谱构建'],
      statement: '在自然语言处理方面有实际项目经验，希望深入研究...',
      previousProjects: 2,
      internships: 2,
      publications: 1,
      awards: ['企业奖学金'],
      recommendation: '企业导师推荐',
      timeCommitment: '每周15小时',
      startDate: '2024-02-15',
      priority: 'medium',
      matchScore: 87
    },
    {
      id: 'app3',
      name: '王五',
      studentId: '2022001',
      year: '本科二年级',
      major: '人工智能',
      gpa: 3.9,
      appliedDate: '2024-01-10',
      status: 'reviewed',
      researchInterests: ['强化学习', '多智能体系统'],
      skills: ['Python', 'C++', 'RL算法'],
      experience: ['强化学习课程项目'],
      statement: '对强化学习充满热情，希望在多智能体领域探索...',
      previousProjects: 1,
      internships: 0,
      publications: 0,
      awards: ['新生奖学金', '数学竞赛一等奖'],
      recommendation: '任课教师推荐',
      timeCommitment: '每周25小时',
      startDate: '2024-03-15',
      priority: 'high',
      matchScore: 85
    },
    {
      id: 'app4',
      name: '赵六',
      studentId: '2020001',
      year: '研究生一年级',
      major: '计算机技术',
      gpa: 3.5,
      appliedDate: '2024-01-08',
      status: 'pending',
      researchInterests: ['系统架构', '分布式系统'],
      skills: ['Java', 'Spring', 'Docker', 'Kubernetes'],
      experience: ['分布式系统实习', '微服务架构项目'],
      statement: '具有丰富的系统开发经验，希望在分布式系统方向深入研究...',
      previousProjects: 4,
      internships: 3,
      publications: 2,
      awards: ['优秀毕业生', '技术创新奖'],
      recommendation: '企业高级工程师推荐',
      timeCommitment: '每周30小时',
      startDate: '2024-02-01',
      priority: 'medium',
      matchScore: 78
    }
  ]);

  const [filters, setFilters] = useState<FilterCriteria>({
    gpaMin: 0,
    gpaMax: 4.0,
    year: [],
    major: [],
    status: [],
    skills: [],
    minProjects: 0,
    minPublications: 0,
    hasInternship: null,
    hasAwards: null,
    appliedDateFrom: '',
    appliedDateTo: '',
    searchTerm: ''
  });

  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState('filter');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const filteredApplications = applications.filter(app => {
    // Basic filters
    if (app.gpa < filters.gpaMin || app.gpa > filters.gpaMax) return false;
    if (filters.year.length > 0 && !filters.year.includes(app.year)) return false;
    if (filters.major.length > 0 && !filters.major.includes(app.major)) return false;
    if (filters.status.length > 0 && !filters.status.includes(app.status)) return false;
    
    // Skills filter
    if (filters.skills.length > 0) {
      const hasRequiredSkills = filters.skills.some(skill => 
        app.skills.some(appSkill => appSkill.toLowerCase().includes(skill.toLowerCase()))
      );
      if (!hasRequiredSkills) return false;
    }

    // Project and publication filters
    if (app.previousProjects < filters.minProjects) return false;
    if (app.publications < filters.minPublications) return false;

    // Experience filters
    if (filters.hasInternship !== null) {
      if (filters.hasInternship && app.internships === 0) return false;
      if (!filters.hasInternship && app.internships > 0) return false;
    }
    
    if (filters.hasAwards !== null) {
      if (filters.hasAwards && app.awards.length === 0) return false;
      if (!filters.hasAwards && app.awards.length > 0) return false;
    }

    // Search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      const matchesSearch = 
        app.name.toLowerCase().includes(searchLower) ||
        app.studentId.includes(searchLower) ||
        app.major.toLowerCase().includes(searchLower) ||
        app.researchInterests.some(interest => interest.toLowerCase().includes(searchLower)) ||
        app.skills.some(skill => skill.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    return true;
  });

  const handleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id));
    }
  };

  const handleSelectApplication = (appId: string) => {
    setSelectedApplications(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const handleBatchAction = (action: string) => {
    // Implement batch actions
    console.log(`Performing ${action} on ${selectedApplications.length} applications`);
    
    if (action === 'approve') {
      setApplications(prev => 
        prev.map(app => 
          selectedApplications.includes(app.id) 
            ? { ...app, status: 'accepted' as const }
            : app
        )
      );
    } else if (action === 'reject') {
      setApplications(prev => 
        prev.map(app => 
          selectedApplications.includes(app.id) 
            ? { ...app, status: 'rejected' as const }
            : app
        )
      );
    }
    
    setSelectedApplications([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '待审核';
      case 'reviewed': return '已审核';
      case 'accepted': return '已录取';
      case 'rejected': return '已拒绝';
      default: return '未知';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">学生申请筛选器</h1>
          <p className="text-gray-600 mt-2">高效筛选和审核实验室轮转申请，提升审核质量和效率</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Filter className="h-4 w-4 mr-1" />
          智能筛选系统
        </Badge>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="filter">筛选条件</TabsTrigger>
          <TabsTrigger value="applications">申请列表 ({filteredApplications.length})</TabsTrigger>
          <TabsTrigger value="statistics">统计分析</TabsTrigger>
        </TabsList>

        <TabsContent value="filter" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  基础筛选
                </CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  {showAdvancedFilters ? '隐藏' : '显示'}高级筛选
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="search">搜索关键词</Label>
                  <Input
                    id="search"
                    placeholder="姓名、学号、专业、技能..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>GPA范围</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      placeholder="最低"
                      step="0.1"
                      value={filters.gpaMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, gpaMin: parseFloat(e.target.value) || 0 }))}
                    />
                    <Input
                      type="number"
                      placeholder="最高"
                      step="0.1"
                      value={filters.gpaMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, gpaMax: parseFloat(e.target.value) || 4.0 }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>申请状态</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择状态" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="pending">待审核</SelectItem>
                      <SelectItem value="reviewed">已审核</SelectItem>
                      <SelectItem value="accepted">已录取</SelectItem>
                      <SelectItem value="rejected">已拒绝</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {showAdvancedFilters && (
                <div className="pt-4 border-t space-y-4">
                  <h4 className="font-semibold text-gray-900">高级筛选条件</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>年级</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择年级" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部年级</SelectItem>
                          <SelectItem value="sophomore">本科二年级</SelectItem>
                          <SelectItem value="junior">本科三年级</SelectItem>
                          <SelectItem value="senior">本科四年级</SelectItem>
                          <SelectItem value="graduate">研究生</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>专业</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="选择专业" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部专业</SelectItem>
                          <SelectItem value="cs">计算机科学</SelectItem>
                          <SelectItem value="ai">人工智能</SelectItem>
                          <SelectItem value="se">软件工程</SelectItem>
                          <SelectItem value="ct">计算机技术</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>最少项目数</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minProjects}
                        onChange={(e) => setFilters(prev => ({ ...prev, minProjects: parseInt(e.target.value) || 0 }))}
                      />
                    </div>

                    <div>
                      <Label>最少发表数</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.minPublications}
                        onChange={(e) => setFilters(prev => ({ ...prev, minPublications: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="has-internship"
                        checked={filters.hasInternship === true}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, hasInternship: checked ? true : null }))
                        }
                      />
                      <Label htmlFor="has-internship">有实习经验</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="has-awards"
                        checked={filters.hasAwards === true}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, hasAwards: checked ? true : null }))
                        }
                      />
                      <Label htmlFor="has-awards">有获奖经历</Label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-600">
                  找到 {filteredApplications.length} 个匹配的申请
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    导出筛选结果
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setFilters({
                      gpaMin: 0,
                      gpaMax: 4.0,
                      year: [],
                      major: [],
                      status: [],
                      skills: [],
                      minProjects: 0,
                      minPublications: 0,
                      hasInternship: null,
                      hasAwards: null,
                      appliedDateFrom: '',
                      appliedDateTo: '',
                      searchTerm: ''
                    })}
                  >
                    清除筛选
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          {/* Batch Operations */}
          {selectedApplications.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">
                      已选择 {selectedApplications.length} 个申请
                    </span>
                    <Button size="sm" variant="outline" onClick={() => setSelectedApplications([])}>
                      取消选择
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleBatchAction('approve')}>
                      批量通过
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBatchAction('reject')}>
                      批量拒绝
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBatchAction('email')}>
                      批量邮件
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBatchAction('export')}>
                      批量导出
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Applications List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  申请列表
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline" onClick={handleSelectAll}>
                    <CheckSquare className="h-4 w-4 mr-1" />
                    {selectedApplications.length === filteredApplications.length ? '取消全选' : '全选'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <Card key={app.id} className={`transition-all hover:shadow-md ${selectedApplications.includes(app.id) ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Checkbox
                            checked={selectedApplications.includes(app.id)}
                            onCheckedChange={() => handleSelectApplication(app.id)}
                          />
                          
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                                <span className="text-sm text-gray-500">({app.studentId})</span>
                                <Badge className={getStatusColor(app.status)}>
                                  {getStatusLabel(app.status)}
                                </Badge>
                                <Badge className={getPriorityColor(app.priority)}>
                                  {app.priority === 'high' ? '高优先级' : app.priority === 'medium' ? '中优先级' : '低优先级'}
                                </Badge>
                              </div>
                              {app.matchScore && (
                                <div className="text-right">
                                  <div className="text-lg font-bold text-blue-600">{app.matchScore}%</div>
                                  <div className="text-xs text-gray-500">匹配度</div>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="flex items-center text-gray-600 mb-1">
                                  <GraduationCap className="h-4 w-4 mr-1" />
                                  学术信息
                                </div>
                                <div>年级: {app.year}</div>
                                <div>专业: {app.major}</div>
                                <div>GPA: <span className="font-semibold">{app.gpa}</span></div>
                              </div>

                              <div>
                                <div className="flex items-center text-gray-600 mb-1">
                                  <Briefcase className="h-4 w-4 mr-1" />
                                  经历统计
                                </div>
                                <div>项目: {app.previousProjects}个</div>
                                <div>实习: {app.internships}次</div>
                                <div>发表: {app.publications}篇</div>
                              </div>

                              <div>
                                <div className="flex items-center text-gray-600 mb-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  申请信息
                                </div>
                                <div>申请时间: {app.appliedDate}</div>
                                <div>期望开始: {app.startDate}</div>
                                <div>时间投入: {app.timeCommitment}</div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <span className="text-sm font-medium text-gray-700">研究兴趣: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {app.researchInterests.map((interest, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {interest}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="text-sm font-medium text-gray-700">技能: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {app.skills.map((skill, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {app.awards.length > 0 && (
                                <div>
                                  <span className="text-sm font-medium text-gray-700">获奖经历: </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {app.awards.map((award, idx) => (
                                      <Badge key={idx} variant="default" className="text-xs bg-yellow-100 text-yellow-800">
                                        <Award className="h-3 w-3 mr-1" />
                                        {award}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            查看详情
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-1" />
                            发送邮件
                          </Button>
                          <Button size="sm" variant="outline">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredApplications.length === 0 && (
                <Alert>
                  <Search className="h-4 w-4" />
                  <AlertDescription>
                    没有找到符合筛选条件的申请。请调整筛选条件后重试。
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
                <div className="text-sm text-gray-600">总申请数</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {applications.filter(app => app.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">待审核</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {applications.filter(app => app.status === 'accepted').length}
                </div>
                <div className="text-sm text-gray-600">已录取</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {(applications.reduce((sum, app) => sum + app.gpa, 0) / applications.length).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">平均GPA</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                审核统计分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    过去一周收到 {applications.length} 份申请，审核效率提升 25%，平均审核时间 2.3 天。
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">专业分布</h4>
                    <div className="space-y-2">
                      {['计算机科学', '人工智能', '软件工程', '计算机技术'].map(major => {
                        const count = applications.filter(app => app.major === major).length;
                        const percentage = (count / applications.length * 100).toFixed(1);
                        return (
                          <div key={major} className="flex justify-between">
                            <span className="text-sm">{major}</span>
                            <span className="text-sm font-medium">{count}个 ({percentage}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">年级分布</h4>
                    <div className="space-y-2">
                      {['本科二年级', '本科三年级', '本科四年级', '研究生一年级'].map(year => {
                        const count = applications.filter(app => app.year === year).length;
                        const percentage = (count / applications.length * 100).toFixed(1);
                        return (
                          <div key={year} className="flex justify-between">
                            <span className="text-sm">{year}</span>
                            <span className="text-sm font-medium">{count}个 ({percentage}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessorApplicationFilter;