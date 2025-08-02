import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  Search, Filter, Heart, MessageCircle, Share2, Download, 
  Eye, Trophy, Calendar, User, ThumbsUp, Award, TrendingUp,
  Grid, List, ChevronLeft, ChevronRight, ExternalLink, Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Achievement {
  id: string;
  title: string;
  author: string;
  authorId: string;
  category: 'research' | 'design' | 'experiment' | 'review';
  thumbnail: string;
  description: string;
  createdAt: Date;
  likes: number;
  comments: number;
  views: number;
  tags: string[];
  isLiked?: boolean;
  downloadUrl?: string;
  awardLevel?: 'gold' | 'silver' | 'bronze';
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export default function AchievementShowcase() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'mostViewed'>('latest');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  
  // Mock data
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: '深度学习在医学图像分析中的应用',
      author: '王小明',
      authorId: 'user1',
      category: 'research',
      thumbnail: '/api/placeholder/400/300',
      description: '本研究探讨了深度学习技术在医学图像分析中的创新应用，包括病变检测、图像分割和疾病诊断等方面。',
      createdAt: new Date('2025-01-15'),
      likes: 156,
      comments: 23,
      views: 892,
      tags: ['深度学习', '医学图像', 'AI'],
      isLiked: false,
      awardLevel: 'gold'
    },
    {
      id: '2',
      title: '新型纳米材料的合成与表征',
      author: '李小红',
      authorId: 'user2',
      category: 'experiment',
      thumbnail: '/api/placeholder/400/300',
      description: '成功合成了一种新型纳米材料，并对其物理化学性质进行了全面表征，展现出优异的光电性能。',
      createdAt: new Date('2025-01-10'),
      likes: 98,
      comments: 15,
      views: 567,
      tags: ['纳米材料', '材料科学', '实验'],
      isLiked: true,
      awardLevel: 'silver'
    },
    {
      id: '3',
      title: '基因编辑技术的伦理思考',
      author: '张教授',
      authorId: 'prof1',
      category: 'review',
      thumbnail: '/api/placeholder/400/300',
      description: '从生物伦理学角度深入探讨基因编辑技术的应用边界和社会影响。',
      createdAt: new Date('2025-01-08'),
      likes: 234,
      comments: 45,
      views: 1203,
      tags: ['基因编辑', '生物伦理', '综述'],
      isLiked: false,
      awardLevel: 'gold'
    },
    {
      id: '4',
      title: '创新UI设计系统构建',
      author: '陈设计师',
      authorId: 'user3',
      category: 'design',
      thumbnail: '/api/placeholder/400/300',
      description: '构建了一套完整的UI设计系统，包含组件库、设计规范和交互模式。',
      createdAt: new Date('2025-01-05'),
      likes: 167,
      comments: 28,
      views: 734,
      tags: ['UI设计', '设计系统', '用户体验'],
      isLiked: false
    }
  ]);
  
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      userId: 'user10',
      userName: '学术爱好者',
      content: '非常精彩的研究，学到了很多！',
      createdAt: new Date('2025-01-16')
    },
    {
      id: '2',
      userId: 'prof2',
      userName: '李教授',
      content: '研究方法很创新，建议可以进一步探讨临床应用。',
      createdAt: new Date('2025-01-17')
    }
  ]);
  
  const categories = [
    { value: 'all', label: '全部作品' },
    { value: 'research', label: '研究成果' },
    { value: 'experiment', label: '实验报告' },
    { value: 'design', label: '设计作品' },
    { value: 'review', label: '文献综述' }
  ];
  
  const statistics = {
    totalWorks: achievements.length,
    totalViews: achievements.reduce((sum, a) => sum + a.views, 0),
    totalLikes: achievements.reduce((sum, a) => sum + a.likes, 0),
    awardedWorks: achievements.filter(a => a.awardLevel).length
  };
  
  // Filter and sort achievements
  const filteredAchievements = achievements
    .filter(achievement => {
      const matchesCategory = selectedCategory === 'all' || achievement.category === selectedCategory;
      const matchesSearch = achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          achievement.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          achievement.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'mostViewed':
          return b.views - a.views;
        case 'latest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });
  
  const handleLike = (achievementId: string) => {
    setAchievements(achievements.map(achievement => 
      achievement.id === achievementId
        ? { 
            ...achievement, 
            isLiked: !achievement.isLiked,
            likes: achievement.isLiked ? achievement.likes - 1 : achievement.likes + 1
          }
        : achievement
    ));
  };
  
  const handleViewDetail = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowDetailDialog(true);
    
    // Increment view count
    setAchievements(achievements.map(a => 
      a.id === achievement.id ? { ...a, views: a.views + 1 } : a
    ));
  };
  
  const handleAddComment = () => {
    if (newComment.trim() && selectedAchievement) {
      const comment: Comment = {
        id: Date.now().toString(),
        userId: user?.id || 'anonymous',
        userName: user?.name || '匿名用户',
        content: newComment,
        createdAt: new Date()
      };
      setComments([...comments, comment]);
      setNewComment('');
      
      // Update comment count
      setAchievements(achievements.map(a => 
        a.id === selectedAchievement.id ? { ...a, comments: a.comments + 1 } : a
      ));
    }
  };
  
  const handleShare = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setShowShareDialog(true);
  };
  
  const handleDownload = (achievement: Achievement) => {
    if (achievement.downloadUrl || user) {
      alert(`正在下载 "${achievement.title}"...`);
    } else {
      alert('请登录后下载');
    }
  };
  
  const getAwardIcon = (level?: 'gold' | 'silver' | 'bronze') => {
    switch (level) {
      case 'gold':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 'silver':
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 'bronze':
        return <Trophy className="w-5 h-5 text-orange-600" />;
      default:
        return null;
    }
  };
  
  const shareUrl = selectedAchievement 
    ? `${window.location.origin}/achievement/${selectedAchievement.id}`
    : '';
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">成果展示墙</h1>
          <p className="text-gray-600 mt-1">展示优秀的学术成果和创新作品</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Award className="w-4 h-4" />
            <span>{statistics.awardedWorks} 获奖作品</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            <span>{statistics.totalViews.toLocaleString()} 总浏览</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ThumbsUp className="w-4 h-4" />
            <span>{statistics.totalLikes} 总点赞</span>
          </div>
        </div>
      </div>
      
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索作品标题、作者或标签..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">最新发布</SelectItem>
                <SelectItem value="popular">最受欢迎</SelectItem>
                <SelectItem value="mostViewed">最多浏览</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Achievement Gallery */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAchievements.map(achievement => (
            <Card 
              key={achievement.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewDetail(achievement)}
            >
              <div className="relative">
                <img
                  src={achievement.thumbnail}
                  alt={achievement.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {achievement.awardLevel && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg">
                    {getAwardIcon(achievement.awardLevel)}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{achievement.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{achievement.author}</span>
                  </div>
                  <Badge variant="secondary">{categories.find(c => c.value === achievement.category)?.label}</Badge>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {achievement.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-3">
                    <button 
                      className={`flex items-center space-x-1 hover:text-red-600 transition-colors ${achievement.isLiked ? 'text-red-600' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(achievement.id);
                      }}
                    >
                      <Heart className={`w-4 h-4 ${achievement.isLiked ? 'fill-current' : ''}`} />
                      <span>{achievement.likes}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{achievement.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{achievement.views}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      className="hover:text-blue-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(achievement);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="hover:text-green-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(achievement);
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAchievements.map(achievement => (
            <Card 
              key={achievement.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewDetail(achievement)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={achievement.thumbnail}
                    alt={achievement.title}
                    className="w-32 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1 flex items-center space-x-2">
                          <span>{achievement.title}</span>
                          {achievement.awardLevel && getAwardIcon(achievement.awardLevel)}
                        </h3>
                        <p className="text-gray-600 mb-3">{achievement.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{achievement.author}</span>
                        </div>
                        <Badge variant="secondary">{categories.find(c => c.value === achievement.category)?.label}</Badge>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{achievement.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <button 
                          className={`flex items-center space-x-1 hover:text-red-600 transition-colors ${achievement.isLiked ? 'text-red-600' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(achievement.id);
                          }}
                        >
                          <Heart className={`w-4 h-4 ${achievement.isLiked ? 'fill-current' : ''}`} />
                          <span>{achievement.likes}</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{achievement.comments}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{achievement.views}</span>
                        </div>
                        <button 
                          className="hover:text-blue-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(achievement);
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button 
                          className="hover:text-green-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(achievement);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {filteredAchievements.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">没有找到相关作品</p>
          </CardContent>
        </Card>
      )}
      
      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          {selectedAchievement && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span>{selectedAchievement.title}</span>
                    {selectedAchievement.awardLevel && getAwardIcon(selectedAchievement.awardLevel)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(selectedAchievement)}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      分享
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(selectedAchievement)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 overflow-y-auto max-h-[calc(90vh-8rem)]">
                <img
                  src={selectedAchievement.thumbnail}
                  alt={selectedAchievement.title}
                  className="w-full rounded-lg"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">{selectedAchievement.author}</span>
                    </div>
                    <Badge variant="secondary">
                      {categories.find(c => c.value === selectedAchievement.category)?.label}
                    </Badge>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{selectedAchievement.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button 
                      className={`flex items-center space-x-1 hover:text-red-600 transition-colors ${selectedAchievement.isLiked ? 'text-red-600' : ''}`}
                      onClick={() => handleLike(selectedAchievement.id)}
                    >
                      <Heart className={`w-5 h-5 ${selectedAchievement.isLiked ? 'fill-current' : ''}`} />
                      <span>{selectedAchievement.likes}</span>
                    </button>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <MessageCircle className="w-5 h-5" />
                      <span>{selectedAchievement.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Eye className="w-5 h-5" />
                      <span>{selectedAchievement.views}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">作品描述</h3>
                  <p className="text-gray-700">{selectedAchievement.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">标签</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAchievement.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">评论 ({comments.length})</h3>
                  <div className="space-y-3 mb-4">
                    {comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {comment.createdAt.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  {user && (
                    <div className="flex space-x-2">
                      <Textarea
                        placeholder="发表评论..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={2}
                      />
                      <Button onClick={handleAddComment}>
                        发送
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>分享作品</DialogTitle>
          </DialogHeader>
          {selectedAchievement && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">分享链接</label>
                <div className="flex space-x-2">
                  <Input value={shareUrl} readOnly />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(shareUrl);
                      alert('链接已复制到剪贴板');
                    }}
                  >
                    复制
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">分享到</label>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    微信
                  </Button>
                  <Button variant="outline" size="sm">
                    QQ
                  </Button>
                  <Button variant="outline" size="sm">
                    微博
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    复制链接
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}