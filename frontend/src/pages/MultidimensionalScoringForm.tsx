import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Progress } from '../components/ui/progress';
import { Slider } from '../components/ui/slider';
import { 
  Calculator, Save, FileDown, RefreshCw, 
  ClipboardList, Presentation, FileText, MessageSquare,
  AlertCircle, CheckCircle, Star, TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SubScore {
  name: string;
  weight: number;
  score: number;
  maxScore: number;
}

interface ScoreCategory {
  name: string;
  icon: React.ElementType;
  weight: number;
  subScores: SubScore[];
  comment: string;
}

interface Student {
  id: string;
  name: string;
  studentId: string;
}

export default function MultidimensionalScoringForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [overallComment, setOverallComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Mock students data
  const students: Student[] = [
    { id: '1', name: '张三', studentId: '2024001' },
    { id: '2', name: '李四', studentId: '2024002' },
    { id: '3', name: '王五', studentId: '2024003' },
    { id: '4', name: '赵六', studentId: '2024004' },
  ];
  
  const [scoreCategories, setScoreCategories] = useState<ScoreCategory[]>([
    {
      name: '过程表现',
      icon: ClipboardList,
      weight: 30,
      subScores: [
        { name: '出勤情况', weight: 25, score: 0, maxScore: 100 },
        { name: '实验态度', weight: 25, score: 0, maxScore: 100 },
        { name: '团队协作', weight: 25, score: 0, maxScore: 100 },
        { name: '进度把控', weight: 25, score: 0, maxScore: 100 },
      ],
      comment: ''
    },
    {
      name: '海报质量',
      icon: Presentation,
      weight: 20,
      subScores: [
        { name: '设计美观', weight: 30, score: 0, maxScore: 100 },
        { name: '内容完整', weight: 40, score: 0, maxScore: 100 },
        { name: '创新性', weight: 30, score: 0, maxScore: 100 },
      ],
      comment: ''
    },
    {
      name: '大报告内容',
      icon: FileText,
      weight: 30,
      subScores: [
        { name: '文献综述', weight: 20, score: 0, maxScore: 100 },
        { name: '研究方法', weight: 25, score: 0, maxScore: 100 },
        { name: '数据分析', weight: 30, score: 0, maxScore: 100 },
        { name: '结论讨论', weight: 25, score: 0, maxScore: 100 },
      ],
      comment: ''
    },
    {
      name: '答辩表现',
      icon: MessageSquare,
      weight: 20,
      subScores: [
        { name: '表达清晰', weight: 35, score: 0, maxScore: 100 },
        { name: '回答准确', weight: 35, score: 0, maxScore: 100 },
        { name: '时间控制', weight: 30, score: 0, maxScore: 100 },
      ],
      comment: ''
    }
  ]);
  
  // Calculate category score
  const calculateCategoryScore = (category: ScoreCategory): number => {
    const totalWeight = category.subScores.reduce((sum, sub) => sum + sub.weight, 0);
    const weightedScore = category.subScores.reduce(
      (sum, sub) => sum + (sub.score * sub.weight / sub.maxScore), 
      0
    );
    return (weightedScore / totalWeight) * 100;
  };
  
  // Calculate total score
  const calculateTotalScore = (): number => {
    const totalWeight = scoreCategories.reduce((sum, cat) => sum + cat.weight, 0);
    const weightedScore = scoreCategories.reduce(
      (sum, cat) => sum + (calculateCategoryScore(cat) * cat.weight / 100), 
      0
    );
    return (weightedScore / totalWeight) * 100;
  };
  
  // Get grade based on score
  const getGrade = (score: number): { grade: string; color: string } => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600' };
    if (score >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (score >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (score >= 60) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };
  
  // Update sub-score
  const updateSubScore = (categoryIndex: number, subIndex: number, score: number) => {
    const newCategories = [...scoreCategories];
    newCategories[categoryIndex].subScores[subIndex].score = score;
    setScoreCategories(newCategories);
  };
  
  // Update category comment
  const updateCategoryComment = (categoryIndex: number, comment: string) => {
    const newCategories = [...scoreCategories];
    newCategories[categoryIndex].comment = comment;
    setScoreCategories(newCategories);
  };
  
  // Update category weight
  const updateCategoryWeight = (categoryIndex: number, weight: number) => {
    const newCategories = [...scoreCategories];
    newCategories[categoryIndex].weight = weight;
    setScoreCategories(newCategories);
  };
  
  // Reset all scores
  const resetScores = () => {
    const resetCategories = scoreCategories.map(category => ({
      ...category,
      subScores: category.subScores.map(sub => ({ ...sub, score: 0 })),
      comment: ''
    }));
    setScoreCategories(resetCategories);
    setOverallComment('');
  };
  
  // Submit scores
  const handleSubmit = async () => {
    if (!selectedStudent) {
      alert('请选择学生');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  // Export scores
  const handleExport = () => {
    const student = students.find(s => s.id === selectedStudent);
    const totalScore = calculateTotalScore();
    const grade = getGrade(totalScore);
    
    const exportData = {
      student: student?.name,
      studentId: student?.studentId,
      totalScore: totalScore.toFixed(2),
      grade: grade.grade,
      categories: scoreCategories.map(cat => ({
        name: cat.name,
        score: calculateCategoryScore(cat).toFixed(2),
        weight: cat.weight,
        comment: cat.comment,
        subScores: cat.subScores
      })),
      overallComment,
      evaluator: user?.name,
      date: new Date().toLocaleDateString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `score_${student?.studentId}_${Date.now()}.json`;
    a.click();
  };
  
  const totalScore = calculateTotalScore();
  const grade = getGrade(totalScore);
  const totalWeight = scoreCategories.reduce((sum, cat) => sum + cat.weight, 0);
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">多维度评分表</h1>
          <p className="text-gray-600 mt-1">对学生进行全面的过程、成果和能力评价</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={resetScores}
            disabled={isSubmitting}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重置评分
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={!selectedStudent || isSubmitting}
          >
            <FileDown className="w-4 h-4 mr-2" />
            导出成绩
          </Button>
        </div>
      </div>
      
      {/* Student Selection */}
      <Card>
        <CardHeader>
          <CardTitle>选择评分学生</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger>
              <SelectValue placeholder="请选择要评分的学生" />
            </SelectTrigger>
            <SelectContent>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.studentId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {selectedStudent && (
        <>
          {/* Score Summary */}
          <Card>
            <CardHeader>
              <CardTitle>评分总览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl font-bold">{totalScore.toFixed(1)}</div>
                  <div className={`text-3xl font-bold ${grade.color}`}>
                    {grade.grade}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">权重总和</p>
                  <p className={`text-lg font-semibold ${totalWeight !== 100 ? 'text-red-600' : 'text-green-600'}`}>
                    {totalWeight}%
                  </p>
                </div>
              </div>
              <Progress value={totalScore} className="h-3" />
              {totalWeight !== 100 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    权重总和不等于100%，请调整各项权重
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
          
          {/* Score Categories */}
          {scoreCategories.map((category, categoryIndex) => {
            const categoryScore = calculateCategoryScore(category);
            const Icon = category.icon;
            
            return (
              <Card key={category.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Icon className="w-5 h-5" />
                      <span>{category.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label>权重:</Label>
                        <Input
                          type="number"
                          value={category.weight}
                          onChange={(e) => updateCategoryWeight(categoryIndex, parseInt(e.target.value) || 0)}
                          className="w-20"
                          min="0"
                          max="100"
                        />
                        <span>%</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">得分</p>
                        <p className="text-xl font-bold">{categoryScore.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Sub-scores */}
                  <div className="space-y-3">
                    {category.subScores.map((subScore, subIndex) => (
                      <div key={subScore.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">
                            {subScore.name} (权重: {subScore.weight}%)
                          </Label>
                          <span className="text-sm font-medium">
                            {subScore.score}/{subScore.maxScore}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Slider
                            value={[subScore.score]}
                            onValueChange={(value) => updateSubScore(categoryIndex, subIndex, value[0])}
                            max={subScore.maxScore}
                            step={1}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={subScore.score}
                            onChange={(e) => updateSubScore(categoryIndex, subIndex, parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="0"
                            max={subScore.maxScore}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Category Comment */}
                  <div className="space-y-2">
                    <Label>评语</Label>
                    <Textarea
                      placeholder={`请输入${category.name}的评价...`}
                      value={category.comment}
                      onChange={(e) => updateCategoryComment(categoryIndex, e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {/* Overall Comment */}
          <Card>
            <CardHeader>
              <CardTitle>总体评价</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="请输入对学生的总体评价..."
                value={overallComment}
                onChange={(e) => setOverallComment(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || totalWeight !== 100}
            >
              {isSubmitting ? (
                <>
                  <Calculator className="w-4 h-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  保存评分
                </>
              )}
            </Button>
          </div>
          
          {/* Success Message */}
          {showSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                评分已成功保存！
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
}