import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Users, BookOpen, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description?: string;
    instructor: {
      name: string;
      avatar?: string;
    };
    progress?: number;
    duration: string;
    students: number;
    maxStudents?: number;
    startDate: string;
    endDate: string;
    rating?: number;
    tags: string[];
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    level: 'beginner' | 'intermediate' | 'advanced';
  };
  variant?: 'default' | 'compact' | 'detailed';
  onEnroll?: (courseId: string) => void;
  onViewDetails?: (courseId: string) => void;
  className?: string;
}

const statusConfig = {
  upcoming: { label: '即将开始', color: 'bg-blue-500' },
  ongoing: { label: '进行中', color: 'bg-green-500' },
  completed: { label: '已完成', color: 'bg-gray-500' },
  cancelled: { label: '已取消', color: 'bg-red-500' },
};

const levelConfig = {
  beginner: { label: '初级', color: 'bg-green-100 text-green-800' },
  intermediate: { label: '中级', color: 'bg-yellow-100 text-yellow-800' },
  advanced: { label: '高级', color: 'bg-red-100 text-red-800' },
};

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = 'default',
  onEnroll,
  onViewDetails,
  className
}) => {
  const statusInfo = statusConfig[course.status];
  const levelInfo = levelConfig[course.level];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (variant === 'compact') {
    return (
      <Card className={cn("hover:shadow-md transition-shadow", className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
              <AvatarFallback>{course.instructor.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{course.title}</h3>
              <p className="text-sm text-muted-foreground">{course.instructor.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={levelInfo.color}>
                  {levelInfo.label}
                </Badge>
                <div className={cn("w-2 h-2 rounded-full", statusInfo.color)} />
                <span className="text-xs text-muted-foreground">{statusInfo.label}</span>
              </div>
            </div>
            <Button size="sm" onClick={() => onViewDetails?.(course.id)}>
              查看
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                <AvatarFallback className="text-xs">{course.instructor.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{course.instructor.name}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className={levelInfo.color}>
              {levelInfo.label}
            </Badge>
            <div className="flex items-center gap-1">
              <div className={cn("w-2 h-2 rounded-full", statusInfo.color)} />
              <span className="text-xs text-muted-foreground">{statusInfo.label}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {course.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {course.description}
          </p>
        )}

        {course.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>课程进度</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(course.startDate)} - {formatDate(course.endDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>
              {course.students}{course.maxStudents ? `/${course.maxStudents}` : ''} 人
            </span>
          </div>
          {course.rating && (
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>{course.rating.toFixed(1)} 分</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {course.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {course.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{course.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          {course.status === 'upcoming' && (
            <Button className="flex-1" onClick={() => onEnroll?.(course.id)}>
              <BookOpen className="h-4 w-4 mr-2" />
              报名参加
            </Button>
          )}
          {course.status === 'ongoing' && course.progress !== undefined && (
            <Button className="flex-1" onClick={() => onViewDetails?.(course.id)}>
              继续学习
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails?.(course.id)}
          >
            查看详情
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};