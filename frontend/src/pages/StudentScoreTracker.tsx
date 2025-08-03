import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  Trophy, 
  RefreshCw, 
  BarChart3, 
  Calendar,
  Award,
  BookOpen,
  Lightbulb,
  Users,
  Star,
  Clock,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Zap,
  Globe,
  Heart,
  Gauge
} from 'lucide-react';
import { GaugeChart } from '@/components/charts/GaugeChart';

interface DimensionScore {
  id: string;
  name: string;
  emoji: string;
  currentScore: number;
  maxScore: number;
  weight: number;
  level: 'excellent' | 'good' | 'average' | 'needs_improvement';
  subItems: {
    name: string;
    score: number;
    maxScore: number;
    description: string;
  }[];
}

interface RankingInfo {
  gradeRank: number;
  gradeTotal: number;
  gradePercentile: number;
  majorRank: number;
  majorTotal: number;
  majorPercentile: number;
  monthlyChange: number;
  trendDirection: 'up' | 'down' | 'stable';
}

interface HistoricalData {
  month: string;
  score: number;
  rank: number;
}

interface RecentActivity {
  date: string;
  activity: string;
  scoreChange: number;
  category: string;
}

const StudentScoreTracker: React.FC = () => {
  const [currentScore, setCurrentScore] = useState(87.5);
  const [targetScore, setTargetScore] = useState(90);
  const [lastUpdated, setLastUpdated] = useState('2分钟前');
  const [monthlyChange, setMonthlyChange] = useState(3.2);

  const [dimensionScores] = useState<DimensionScore[]>([
    {
      id: 'academic',
      name: '学术表现',
      emoji: '📚',
      currentScore: 26.1,
      maxScore: 30,
      weight: 30,
      level: 'excellent',
      subItems: [
        { name: '学业成绩', score: 9.2, maxScore: 10, description: 'GPA 3.8' },
        { name: '学术论文', score: 8.5, maxScore: 10, description: '2篇SCI论文' },
        { name: '科研项目', score: 8.4, maxScore: 10, description: '3个国家级项目参与' }
      ]
    },
    {
      id: 'innovation',
      name: '创新能力',
      emoji: '🎯',
      currentScore: 20.8,
      maxScore: 25,
      weight: 25,
      level: 'excellent',
      subItems: [
        { name: '技术成果', score: 7.8, maxScore: 10, description: '开源项目贡献' },
        { name: '专利申请', score: 6.5, maxScore: 8, description: '2项发明专利' },
        { name: '竞赛获奖', score: 6.5, maxScore: 7, description: '省级一等奖1项' }
      ]
    },
    {
      id: 'social',
      name: '社会实践',
      emoji: '🤝',
      currentScore: 16.2,
      maxScore: 20,
      weight: 20,
      level: 'good',
      subItems: [
        { name: '实习经历', score: 6.8, maxScore: 8, description: '2次企业实习' },
        { name: '志愿服务', score: 5.4, maxScore: 7, description: '累计120小时' },
        { name: '社团活动', score: 4.0, maxScore: 5, description: '学生会部长' }
      ]
    },
    {
      id: 'comprehensive',
      name: '综合素质',
      emoji: '💪',
      currentScore: 11.7,
      maxScore: 15,
      weight: 15,
      level: 'good',
      subItems: [
        { name: '领导能力', score: 4.2, maxScore: 5, description: '团队项目负责人' },
        { name: '沟通能力', score: 3.8, maxScore: 5, description: '演讲比赛获奖' },
        { name: '学习能力', score: 3.7, maxScore: 5, description: '自学新技术能力' }
      ]
    },
    {
      id: 'special',
      name: '特色加分',
      emoji: '🌟',
      currentScore: 8.7,
      maxScore: 10,
      weight: 10,
      level: 'excellent',
      subItems: [
        { name: '国际交流', score: 3.2, maxScore: 4, description: '交换生经历' },
        { name: '语言能力', score: 2.8, maxScore: 3, description: '托福105分' },
        { name: '特殊才能', score: 2.7, maxScore: 3, description: '钢琴十级' }
      ]
    }
  ]);

  const [rankingInfo] = useState<RankingInfo>({
    gradeRank: 12,
    gradeTotal: 156,
    gradePercentile: 8,
    majorRank: 5,
    majorTotal: 45,
    majorPercentile: 11,
    monthlyChange: 3,
    trendDirection: 'up'
  });

  const [historicalData] = useState<HistoricalData[]>([
    { month: '10月', score: 76.2, rank: 25 },
    { month: '11月', score: 78.5, rank: 22 },
    { month: '12月', score: 80.8, rank: 18 },
    { month: '1月', score: 82.3, rank: 18 },
    { month: '2月', score: 84.1, rank: 15 },
    { month: '3月', score: 87.5, rank: 12 }
  ]);

  const [recentActivities] = useState<RecentActivity[]>([
    { date: '今天 14:30', activity: 'SCI论文被期刊接收', scoreChange: 2.1, category: '学术表现' },
    { date: '昨天 09:15', activity: '完成企业实习评估', scoreChange: 1.5, category: '社会实践' },
    { date: '3天前 16:20', activity: '获得专利申请受理', scoreChange: 1.8, category: '创新能力' },
    { date: '1周前 11:45', activity: '参与志愿服务20小时', scoreChange: 0.8, category: '社会实践' },
    { date: '2周前 10:30', activity: '开源项目获得100+ stars', scoreChange: 1.2, category: '创新能力' }
  ]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'text-green-600 bg-green-50';
      case 'good':
        return 'text-yellow-600 bg-yellow-50';
      case 'average':
        return 'text-orange-600 bg-orange-50';
      case 'needs_improvement':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'excellent':
        return '🟢';
      case 'good':
        return '🟡';
      case 'average':
        return '🟠';
      case 'needs_improvement':
        return '🔴';
      default:
        return '⚫';
    }
  };

  const getScoreLevel = (score: number) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'average';
    return 'needs_improvement';
  };

  const getScoreLevelText = (score: number) => {
    if (score >= 85) return '优秀 (85-100)';
    if (score >= 70) return '良好 (70-84)';
    if (score >= 55) return '中等 (55-69)';
    return '待提升 (0-54)';
  };

  const refreshScore = () => {
    setLastUpdated('刚刚');
    // Simulate small score update
    setCurrentScore(prev => prev + Math.random() * 0.5 - 0.25);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  综合素质评价 - 实时分数追踪器
                </h1>
                <p className="text-gray-600 mt-1">
                  实时跟踪您的综合素质评价分数和排名变化
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={refreshScore}
              >
                <RefreshCw className="h-4 w-4" />
                刷新
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                详细报告
              </Button>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              总分概览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Dashboard */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                    <span className="text-2xl font-bold">当前总分: {currentScore}分</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    更新时间: {lastUpdated}
                  </div>
                </div>

                {/* Gauge Chart */}
                <div className="flex justify-center">
                  <div className="relative">
                    <GaugeChart 
                      value={currentScore} 
                      max={100} 
                      size={200}
                      className="mx-auto"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900">{currentScore}</div>
                        <div className="text-sm text-gray-600">总分</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Levels */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <span>🟢</span>
                    <span>优秀 (85-100)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🟡</span>
                    <span>良好 (70-84)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🟠</span>
                    <span>中等 (55-69)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🔴</span>
                    <span>待提升 (0-54)</span>
                  </div>
                </div>
              </div>

              {/* Stats and Goals */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="font-medium">本月变化</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-green-600 font-bold">+{monthlyChange}分</span>
                        <ArrowUp className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">排名</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{rankingInfo.gradeRank}/{rankingInfo.gradeTotal}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <ArrowUp className="h-3 w-3 text-green-600" />
                          上升{rankingInfo.monthlyChange}位
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        <span className="font-medium">目标进度</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{targetScore}分</div>
                        <div className="text-sm text-gray-600">
                          还差{(targetScore - currentScore).toFixed(1)}分
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">当前水平</span>
                  </div>
                  <div className="text-blue-800">
                    {getLevelIcon(getScoreLevel(currentScore))} {getScoreLevelText(currentScore)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dimension Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              维度分数明细
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {dimensionScores.map((dimension) => (
              <div key={dimension.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{dimension.emoji}</span>
                    <span className="font-medium text-lg">
                      {dimension.name} (权重{dimension.weight}%):
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">
                      {dimension.currentScore}/{dimension.maxScore}分
                    </span>
                    <span className="text-lg">{getLevelIcon(dimension.level)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <Progress 
                    value={(dimension.currentScore / dimension.maxScore) * 100} 
                    className="h-3"
                  />
                  <div className="text-sm text-gray-600">
                    完成度: {((dimension.currentScore / dimension.maxScore) * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Sub Items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                  {dimension.subItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{item.name}:</span>
                        <span className="text-sm font-bold">
                          {item.score}/{item.maxScore}分
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">{item.description}</div>
                      <Progress 
                        value={(item.score / item.maxScore) * 100} 
                        className="h-1 mt-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Ranking and Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                排名与比较
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Rankings */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {rankingInfo.gradeRank}/{rankingInfo.gradeTotal}
                  </div>
                  <div className="text-sm text-blue-800">年级排名</div>
                  <div className="text-xs text-blue-600">TOP {rankingInfo.gradePercentile}%</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {rankingInfo.majorRank}/{rankingInfo.majorTotal}
                  </div>
                  <div className="text-sm text-green-800">专业排名</div>
                  <div className="text-xs text-green-600">TOP {rankingInfo.majorPercentile}%</div>
                </div>
              </div>

              {/* Ranking Trend */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  排名趋势:
                </h4>
                <div className="text-sm text-gray-700">
                  1月: 18位 → 2月: 15位 → 3月: 12位 
                  <Badge variant="default" className="ml-2 bg-green-100 text-green-800">
                    持续上升
                  </Badge>
                </div>
              </div>

              {/* Gap Analysis */}
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  与目标差距分析:
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <div>• 距离TOP 5%: 还需提升 4.2分</div>
                  <div>• 距离年级第1名: 还需提升 8.3分</div>
                  <div>• 最有潜力提升项: 社会实践 (+3.8分潜力)</div>
                </div>
              </div>

              {/* Strengths and Suggestions */}
              <div className="space-y-2">
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="font-medium text-green-800 mb-1 flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    优势项目:
                  </div>
                  <div className="text-sm text-green-700">
                    学术表现 (年级第2) | 创新能力 (年级第3)
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="font-medium text-yellow-800 mb-1 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    改进建议:
                  </div>
                  <div className="text-sm text-yellow-700">
                    增加志愿服务时长，参与更多社会实践活动
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Historical Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                历史趋势图
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Trend Chart Placeholder */}
              <div className="space-y-2">
                <h4 className="font-medium">📈 6个月分数变化趋势:</h4>
                <div className="h-48 bg-gray-50 rounded-lg p-4">
                  <div className="h-full flex items-end justify-between">
                    {historicalData.map((data, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div 
                          className="bg-blue-500 rounded-t"
                          style={{ 
                            height: `${(data.score / 100) * 150}px`,
                            width: '20px'
                          }}
                        ></div>
                        <div className="text-xs font-medium">{data.score}</div>
                        <div className="text-xs text-gray-600 transform -rotate-45">
                          {data.month}
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col items-center gap-2">
                      <div 
                        className="bg-red-500 rounded-t border-2 border-red-300"
                        style={{ 
                          height: `${(targetScore / 100) * 150}px`,
                          width: '20px'
                        }}
                      ></div>
                      <div className="text-xs font-medium text-red-600">{targetScore}</div>
                      <div className="text-xs text-red-600 transform -rotate-45">
                        目标
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trend Analysis */}
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="font-medium text-purple-800 mb-1 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  趋势分析:
                </div>
                <div className="text-sm text-purple-700">
                  稳步上升，平均每月提升1.8分，按此趋势6月可达目标分数
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              近期活动记录
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h4 className="font-medium">🔄 最新更新记录:</h4>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-gray-500">{activity.date}</div>
                      <div className="font-medium">{activity.activity}</div>
                      <Badge variant="outline" className="text-xs">
                        {activity.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-bold">+{activity.scoreChange}分</span>
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentScoreTracker;