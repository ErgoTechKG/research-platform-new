import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Search, 
  Heart, 
  Users, 
  BookOpen, 
  Award, 
  TrendingUp,
  X,
  Plus,
  Filter,
  Download,
  Star,
  MapPin,
  Clock,
  GraduationCap,
  Briefcase,
  Target,
  BarChart3,
  Eye,
  Share2
} from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  title: string;
  department: string;
  researchAreas: string[];
  requirements: {
    gpa: number;
    year: string;
    skills: string[];
    timeCommitment: string;
  };
  capacity: {
    total: number;
    available: number;
  };
  rating: number;
  matchScore?: number;
  highlights?: string[];
  graduateOutcomes: {
    phd: number;
    industry: number;
    postdoc: number;
  };
  recentPublications: number;
  fundingAmount: string;
  location: string;
  responseTime: string;
}

interface ComparisonCategory {
  key: string;
  label: string;
  type: 'text' | 'number' | 'array' | 'object' | 'rating';
}

const StudentMentorComparison: React.FC = () => {
  const [selectedMentors, setSelectedMentors] = useState<Mentor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState<string>('all');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

  // Mock mentor data
  const [allMentors] = useState<Mentor[]>([
    {
      id: 'mentor1',
      name: '张教授',
      title: '教授',
      department: '计算机科学系',
      researchAreas: ['机器学习', '深度学习', '计算机视觉'],
      requirements: {
        gpa: 3.5,
        year: '本科三年级以上',
        skills: ['Python', 'TensorFlow', '数学基础'],
        timeCommitment: '每周15小时'
      },
      capacity: { total: 8, available: 3 },
      rating: 4.8,
      matchScore: 92,
      highlights: ['顶级期刊发表', '国际合作项目', '就业率100%'],
      graduateOutcomes: { phd: 60, industry: 35, postdoc: 5 },
      recentPublications: 15,
      fundingAmount: '500万',
      location: '主楼A座',
      responseTime: '2小时内'
    },
    {
      id: 'mentor2',
      name: '李教授',
      title: '副教授',
      department: '计算机科学系',
      researchAreas: ['自然语言处理', '知识图谱', '推荐系统'],
      requirements: {
        gpa: 3.3,
        year: '本科二年级以上',
        skills: ['Python', 'Java', 'NLP基础'],
        timeCommitment: '每周12小时'
      },
      capacity: { total: 6, available: 2 },
      rating: 4.6,
      matchScore: 88,
      highlights: ['工业界经验丰富', '项目实践导向', '灵活时间安排'],
      graduateOutcomes: { phd: 40, industry: 55, postdoc: 5 },
      recentPublications: 12,
      fundingAmount: '300万',
      location: '主楼B座',
      responseTime: '4小时内'
    },
    {
      id: 'mentor3',
      name: '王教授',
      title: '教授',
      department: '人工智能研究院',
      researchAreas: ['强化学习', '多智能体系统', '机器人学'],
      requirements: {
        gpa: 3.7,
        year: '本科四年级',
        skills: ['Python', 'C++', 'ROS', '强化学习'],
        timeCommitment: '每周20小时'
      },
      capacity: { total: 5, available: 1 },
      rating: 4.9,
      matchScore: 85,
      highlights: ['前沿研究方向', '国际顶会发表', '严格学术训练'],
      graduateOutcomes: { phd: 80, industry: 15, postdoc: 5 },
      recentPublications: 18,
      fundingAmount: '800万',
      location: '智能研究楼',
      responseTime: '1天内'
    },
    {
      id: 'mentor4',
      name: '陈教授',
      title: '副教授',
      department: '软件工程系',
      researchAreas: ['软件工程', '系统架构', 'DevOps'],
      requirements: {
        gpa: 3.2,
        year: '本科三年级以上',
        skills: ['Java', 'Spring', '系统设计'],
        timeCommitment: '每周10小时'
      },
      capacity: { total: 10, available: 5 },
      rating: 4.4,
      matchScore: 78,
      highlights: ['企业合作项目', '实习机会多', '就业导向'],
      graduateOutcomes: { phd: 20, industry: 75, postdoc: 5 },
      recentPublications: 8,
      fundingAmount: '200万',
      location: '软件楼',
      responseTime: '6小时内'
    }
  ]);

  const comparisonCategories: ComparisonCategory[] = [
    { key: 'name', label: '导师姓名', type: 'text' },
    { key: 'title', label: '职称', type: 'text' },
    { key: 'department', label: '院系', type: 'text' },
    { key: 'researchAreas', label: '研究方向', type: 'array' },
    { key: 'requirements.gpa', label: 'GPA要求', type: 'number' },
    { key: 'requirements.year', label: '年级要求', type: 'text' },
    { key: 'requirements.skills', label: '技能要求', type: 'array' },
    { key: 'requirements.timeCommitment', label: '时间投入', type: 'text' },
    { key: 'capacity', label: '招生名额', type: 'object' },
    { key: 'rating', label: '评分', type: 'rating' },
    { key: 'matchScore', label: '匹配度', type: 'number' },
    { key: 'graduateOutcomes', label: '毕业去向', type: 'object' },
    { key: 'recentPublications', label: '近期发表', type: 'number' },
    { key: 'fundingAmount', label: '科研经费', type: 'text' },
    { key: 'location', label: '办公地点', type: 'text' },
    { key: 'responseTime', label: '回复时间', type: 'text' }
  ];

  const filteredMentors = allMentors.filter(mentor => {
    const searchMatch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       mentor.researchAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase())) ||
                       mentor.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterField === 'all') return searchMatch;
    
    // Add specific filters based on filterField
    return searchMatch;
  });

  const handleAddMentor = (mentor: Mentor) => {
    if (selectedMentors.length < 4 && !selectedMentors.find(m => m.id === mentor.id)) {
      setSelectedMentors([...selectedMentors, mentor]);
    }
  };

  const handleRemoveMentor = (mentorId: string) => {
    setSelectedMentors(selectedMentors.filter(m => m.id !== mentorId));
  };

  const toggleFavorite = (mentorId: string) => {
    setFavoriteIds(prev => 
      prev.includes(mentorId) 
        ? prev.filter(id => id !== mentorId)
        : [...prev, mentorId]
    );
  };

  const getValueByPath = (obj: any, path: string) => {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  };

  const renderCellValue = (mentor: Mentor, category: ComparisonCategory) => {
    const value = getValueByPath(mentor, category.key);
    
    switch (category.type) {
      case 'array':
        return (
          <div className="flex flex-wrap gap-1">
            {(value as string[])?.map((item, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        );
      case 'object':
        if (category.key === 'capacity') {
          return `${value.available}/${value.total}`;
        }
        if (category.key === 'graduateOutcomes') {
          return (
            <div className="text-xs space-y-1">
              <div>博士: {value.phd}%</div>
              <div>工业界: {value.industry}%</div>
              <div>博后: {value.postdoc}%</div>
            </div>
          );
        }
        return JSON.stringify(value);
      case 'rating':
        return (
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 mr-1" />
            {value}
          </div>
        );
      case 'number':
        if (category.key === 'matchScore') {
          return `${value}%`;
        }
        return value;
      default:
        return value;
    }
  };

  const isDifferent = (category: ComparisonCategory) => {
    if (selectedMentors.length < 2) return false;
    
    const values = selectedMentors.map(mentor => getValueByPath(mentor, category.key));
    const firstValue = JSON.stringify(values[0]);
    
    return values.some(value => JSON.stringify(value) !== firstValue);
  };

  const visibleCategories = showDifferencesOnly 
    ? comparisonCategories.filter(isDifferent)
    : comparisonCategories;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">导师信息对比</h1>
          <p className="text-gray-600 mt-2">并排对比多个导师的信息，帮助您做出最适合的选择</p>
        </div>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          <Users className="h-4 w-4 mr-1" />
          智能对比系统
        </Badge>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            导师搜索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label htmlFor="search">搜索导师</Label>
              <Input
                id="search"
                placeholder="搜索导师姓名、研究方向或院系..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="filter">筛选条件</Label>
              <Select value={filterField} onValueChange={setFilterField}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="available">有名额</SelectItem>
                  <SelectItem value="high-rating">高评分(4.5+)</SelectItem>
                  <SelectItem value="quick-response">快速回复</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                高级筛选
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMentors.map((mentor) => (
              <Card 
                key={mentor.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedMentors.find(m => m.id === mentor.id) ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(mentor.id);
                      }}
                    >
                      <Heart 
                        className={`h-4 w-4 ${
                          favoriteIds.includes(mentor.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'
                        }`} 
                      />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">{mentor.title}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        {mentor.rating}
                      </div>
                    </div>
                    
                    <p className="text-gray-600">{mentor.department}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {mentor.researchAreas.slice(0, 2).map((area, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                      {mentor.researchAreas.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{mentor.researchAreas.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>名额: {mentor.capacity.available}/{mentor.capacity.total}</span>
                      {mentor.matchScore && (
                        <span className="text-green-600">匹配度: {mentor.matchScore}%</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddMentor(mentor)}
                      disabled={selectedMentors.length >= 4 || selectedMentors.find(m => m.id === mentor.id) !== undefined}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {selectedMentors.find(m => m.id === mentor.id) ? '已添加' : '对比'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedMentors.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                导师对比表 ({selectedMentors.length}/4)
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDifferencesOnly(!showDifferencesOnly)}
                >
                  {showDifferencesOnly ? '显示全部' : '仅显示差异'}
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  导出对比
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  分享
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium text-gray-900 w-40">对比项目</th>
                    {selectedMentors.map((mentor) => (
                      <th key={mentor.id} className="text-left p-3 font-medium text-gray-900 min-w-48">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold">{mentor.name}</div>
                            <div className="text-sm text-gray-600">{mentor.title}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMentor(mentor.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleCategories.map((category) => (
                    <tr key={category.key} className={`border-b hover:bg-gray-50 ${isDifferent(category) ? 'bg-yellow-50' : ''}`}>
                      <td className="p-3 font-medium text-gray-700">
                        {category.label}
                        {isDifferent(category) && (
                          <Badge variant="outline" className="ml-2 text-xs text-orange-600 border-orange-200">
                            差异
                          </Badge>
                        )}
                      </td>
                      {selectedMentors.map((mentor) => (
                        <td key={mentor.id} className="p-3 text-gray-900">
                          {renderCellValue(mentor, category)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  
                  {/* Highlights Row */}
                  <tr className="border-b bg-blue-50">
                    <td className="p-3 font-medium text-gray-700">优势亮点</td>
                    {selectedMentors.map((mentor) => (
                      <td key={mentor.id} className="p-3">
                        <div className="space-y-1">
                          {mentor.highlights?.map((highlight, idx) => (
                            <Badge key={idx} variant="default" className="block text-xs bg-blue-100 text-blue-800">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {selectedMentors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>快速操作</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {selectedMentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{mentor.name}:</span>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    详情
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="h-3 w-3 mr-1" />
                    收藏
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Favorites Section */}
      {favoriteIds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              我的收藏 ({favoriteIds.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {favoriteIds.map(id => {
                const mentor = allMentors.find(m => m.id === id);
                return mentor ? (
                  <div key={id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{mentor.name}</div>
                      <div className="text-sm text-gray-600">{mentor.department}</div>
                    </div>
                    <Button size="sm" variant="outline">查看</Button>
                  </div>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedMentors.length === 0 && (
        <Alert>
          <BookOpen className="h-4 w-4" />
          <AlertDescription>
            请从上方搜索结果中选择2-4个导师进行对比分析。系统将高亮显示关键差异项，帮助您做出最适合的选择。
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default StudentMentorComparison;