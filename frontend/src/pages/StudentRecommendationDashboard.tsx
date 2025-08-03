import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  Target, 
  TrendingUp, 
  Heart, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw,
  Star,
  Users,
  BookOpen,
  Briefcase,
  MapPin,
  Clock,
  Award,
  Brain,
  Zap,
  Eye,
  Mail,
  Settings,
  BarChart3,
  Calendar,
  User
} from 'lucide-react';

interface StudentProfile {
  interests: string[];
  skills: string[];
  careerGoals: string[];
  workStyle: string;
  timePreference: string;
  gpa: number;
  year: string;
  experience: string[];
}

interface Recommendation {
  id: string;
  mentorName: string;
  title: string;
  department: string;
  matchPercentage: number;
  researchAreas: string[];
  reasoning: {
    strengths: string[];
    alignment: string[];
    opportunities: string[];
  };
  successProbability: number;
  competition: 'low' | 'medium' | 'high';
  estimatedResponse: string;
  location: string;
  timeCommitment: string;
  funding: string;
  recentWork: string[];
  studentFeedback?: number;
}

interface FeedbackHistory {
  recommendationId: string;
  mentorName: string;
  feedback: 'positive' | 'negative';
  reason: string;
  timestamp: string;
}

const StudentRecommendationDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [profile, setProfile] = useState<StudentProfile>({
    interests: ['机器学习', '深度学习', '计算机视觉'],
    skills: ['Python', 'TensorFlow', 'PyTorch', '数据分析'],
    careerGoals: ['学术研究', '工业界AI'],
    workStyle: '自主学习',
    timePreference: '灵活安排',
    gpa: 3.7,
    year: '本科三年级',
    experience: ['机器学习项目', '数据科学竞赛']
  });
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 'rec1',
      mentorName: '张教授',
      title: '教授',
      department: '计算机科学系',
      matchPercentage: 94,
      researchAreas: ['机器学习', '深度学习', '计算机视觉'],
      reasoning: {
        strengths: ['研究方向完全匹配', 'GPA符合要求', '项目经验相关'],
        alignment: ['学术研究导向', '技术栈匹配度高', '工作方式契合'],
        opportunities: ['顶级期刊发表机会', '国际会议参与', '深度学习前沿研究']
      },
      successProbability: 85,
      competition: 'medium',
      estimatedResponse: '2-3天',
      location: '主楼A座',
      timeCommitment: '每周15小时',
      funding: '充足',
      recentWork: ['CVPR 2024论文', 'AI医疗项目', '自动驾驶合作'],
      studentFeedback: undefined
    },
    {
      id: 'rec2',
      mentorName: '李教授',
      title: '副教授',
      department: '人工智能研究院',
      matchPercentage: 88,
      researchAreas: ['强化学习', '机器学习', '智能系统'],
      reasoning: {
        strengths: ['技术能力匹配', '学习能力强', '适应性好'],
        alignment: ['研究兴趣重叠', '工作时间灵活', '成长潜力大'],
        opportunities: ['前沿强化学习研究', '机器人项目参与', '工业合作机会']
      },
      successProbability: 78,
      competition: 'low',
      estimatedResponse: '1-2天',
      location: '智能研究楼',
      timeCommitment: '每周12小时',
      funding: '充足',
      recentWork: ['强化学习突破', '智能机器人项目', 'DeepMind合作'],
      studentFeedback: undefined
    },
    {
      id: 'rec3',
      mentorName: '王教授',
      title: '教授',
      department: '计算机科学系',
      matchPercentage: 82,
      researchAreas: ['自然语言处理', '机器学习', '知识图谱'],
      reasoning: {
        strengths: ['基础技能扎实', '数学背景好', '编程能力强'],
        alignment: ['跨领域学习兴趣', '技术探索精神', '创新思维'],
        opportunities: ['NLP前沿研究', '多模态学习', '大模型应用']
      },
      successProbability: 72,
      competition: 'high',
      estimatedResponse: '3-5天',
      location: '主楼B座',
      timeCommitment: '每周18小时',
      funding: '充足',
      recentWork: ['ChatGPT相关研究', '多模态模型', '工业NLP应用'],
      studentFeedback: undefined
    }
  ]);

  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackHistory[]>([
    {
      recommendationId: 'prev1',
      mentorName: '陈教授',
      feedback: 'positive',
      reason: '研究方向很匹配，导师很有耐心',
      timestamp: '2024-01-10'
    },
    {
      recommendationId: 'prev2',
      mentorName: '刘教授',
      feedback: 'negative',
      reason: '时间要求太严格，不太适合我的安排',
      timestamp: '2024-01-08'
    }
  ]);

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleProfileUpdate = async () => {
    setIsUpdatingProfile(true);
    // Simulate profile update
    setTimeout(() => {
      setIsUpdatingProfile(false);
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
        // Update recommendations based on new profile
      }, 2000);
    }, 1000);
  };

  const handleFeedback = (recommendationId: string, feedback: 'positive' | 'negative', reason: string) => {
    const recommendation = recommendations.find(r => r.id === recommendationId);
    if (recommendation) {
      // Update recommendation feedback
      setRecommendations(prev => 
        prev.map(r => 
          r.id === recommendationId 
            ? { ...r, studentFeedback: feedback === 'positive' ? 1 : -1 }
            : r
        )
      );

      // Add to feedback history
      setFeedbackHistory(prev => [...prev, {
        recommendationId,
        mentorName: recommendation.mentorName,
        feedback,
        reason,
        timestamp: new Date().toISOString().split('T')[0]
      }]);
    }
  };

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompetitionLabel = (competition: string) => {
    switch (competition) {
      case 'low': return '竞争较小';
      case 'medium': return '竞争适中';
      case 'high': return '竞争激烈';
      default: return '未知';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">智能导师推荐</h1>
          <p className="text-gray-600 mt-2">基于您的兴趣背景和历史数据，为您推荐最匹配的导师</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-blue-600 border-blue-200">
            <Brain className="h-4 w-4 mr-1" />
            AI推荐引擎
          </Badge>
          <Button 
            onClick={() => setIsRefreshing(true)}
            disabled={isRefreshing}
            variant="outline"
          >
            {isRefreshing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            刷新推荐
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">推荐结果</TabsTrigger>
          <TabsTrigger value="profile">个人画像</TabsTrigger>
          <TabsTrigger value="feedback">反馈历史</TabsTrigger>
          <TabsTrigger value="analysis">匹配分析</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          {isRefreshing ? (
            <Card>
              <CardContent className="p-8 text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">正在更新推荐...</h3>
                <p className="text-gray-600">AI算法正在分析您的最新偏好和导师信息</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <Card key={rec.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-8 w-8 text-white" />
                          </div>
                          <Badge className="absolute -top-2 -right-2 bg-green-500">
                            #{index + 1}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{rec.mentorName}</h3>
                          <p className="text-gray-600">{rec.title} • {rec.department}</p>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-500">{rec.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{rec.matchPercentage}%</div>
                        <p className="text-sm text-gray-600">匹配度</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left Column - Basic Info */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">研究方向</Label>
                          <div className="flex flex-wrap gap-2">
                            {rec.researchAreas.map((area, idx) => (
                              <Badge key={idx} variant="secondary">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-700">成功概率</Label>
                            <div className="flex items-center mt-1">
                              <Progress value={rec.successProbability} className="flex-1 mr-2" />
                              <span className="font-medium">{rec.successProbability}%</span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-700">竞争程度</Label>
                            <Badge className={`mt-1 ${getCompetitionColor(rec.competition)}`}>
                              {getCompetitionLabel(rec.competition)}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span>回复时间: {rec.estimatedResponse}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span>时间投入: {rec.timeCommitment}</span>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">近期工作</Label>
                          <div className="space-y-1">
                            {rec.recentWork.map((work, idx) => (
                              <div key={idx} className="text-sm text-gray-600 flex items-center">
                                <Award className="h-3 w-3 text-yellow-500 mr-2" />
                                {work}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Reasoning */}
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            推荐理由
                          </Label>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-green-700 mb-1">匹配优势</h4>
                              <ul className="space-y-1">
                                {rec.reasoning.strengths.map((strength, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-blue-700 mb-1">契合度分析</h4>
                              <ul className="space-y-1">
                                {rec.reasoning.alignment.map((align, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                    {align}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium text-purple-700 mb-1">发展机会</h4>
                              <ul className="space-y-1">
                                {rec.reasoning.opportunities.map((opp, idx) => (
                                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                                    {opp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Eye className="h-4 w-4 mr-1" />
                          查看详情
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          发送邮件
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="h-4 w-4 mr-1" />
                          收藏
                        </Button>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeedback(rec.id, 'positive', '推荐很准确')}
                          disabled={rec.studentFeedback !== undefined}
                          className={rec.studentFeedback === 1 ? 'bg-green-100 text-green-700' : ''}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          有帮助
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleFeedback(rec.id, 'negative', '不太匹配')}
                          disabled={rec.studentFeedback !== undefined}
                          className={rec.studentFeedback === -1 ? 'bg-red-100 text-red-700' : ''}
                        >
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          不匹配
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                个人画像更新
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="interests">研究兴趣</Label>
                  <Textarea 
                    id="interests"
                    value={profile.interests.join(', ')}
                    onChange={(e) => setProfile(prev => ({
                      ...prev, 
                      interests: e.target.value.split(', ')
                    }))}
                    placeholder="请输入您的研究兴趣，用逗号分隔"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">技能专长</Label>
                  <Textarea 
                    id="skills"
                    value={profile.skills.join(', ')}
                    onChange={(e) => setProfile(prev => ({
                      ...prev, 
                      skills: e.target.value.split(', ')
                    }))}
                    placeholder="请输入您的技能专长，用逗号分隔"
                  />
                </div>

                <div>
                  <Label htmlFor="career-goals">职业规划</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择职业规划" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">学术研究</SelectItem>
                      <SelectItem value="industry">工业界</SelectItem>
                      <SelectItem value="startup">创业</SelectItem>
                      <SelectItem value="mixed">多元发展</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="work-style">工作风格</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择工作风格" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="independent">自主学习</SelectItem>
                      <SelectItem value="guided">指导学习</SelectItem>
                      <SelectItem value="collaborative">协作学习</SelectItem>
                      <SelectItem value="structured">结构化学习</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gpa">当前GPA</Label>
                  <Input 
                    id="gpa"
                    type="number"
                    step="0.1"
                    value={profile.gpa}
                    onChange={(e) => setProfile(prev => ({
                      ...prev, 
                      gpa: parseFloat(e.target.value)
                    }))}
                  />
                </div>

                <div>
                  <Label htmlFor="year">年级</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="选择年级" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sophomore">本科二年级</SelectItem>
                      <SelectItem value="junior">本科三年级</SelectItem>
                      <SelectItem value="senior">本科四年级</SelectItem>
                      <SelectItem value="graduate">研究生</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleProfileUpdate}
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {isUpdatingProfile ? '更新中...' : '更新画像'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                反馈历史
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackHistory.map((feedback, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <h4 className="font-medium">{feedback.mentorName}</h4>
                        <Badge 
                          className={`ml-2 ${
                            feedback.feedback === 'positive' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {feedback.feedback === 'positive' ? '👍 有帮助' : '👎 不匹配'}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">{feedback.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600">{feedback.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  匹配趋势分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600">平均匹配度</Label>
                    <div className="text-2xl font-bold text-blue-600">88%</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">推荐精准度</Label>
                    <div className="text-2xl font-bold text-green-600">92%</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">成功申请率</Label>
                    <div className="text-2xl font-bold text-purple-600">78%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  推荐优化建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      建议更新您的技能专长信息，有助于提高推荐精准度
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <BookOpen className="h-4 w-4" />
                    <AlertDescription>
                      添加更多项目经验描述，算法将更好地理解您的能力
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Heart className="h-4 w-4" />
                    <AlertDescription>
                      多给推荐结果反馈，系统会不断学习您的偏好
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentRecommendationDashboard;