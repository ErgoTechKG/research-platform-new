import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  assignee: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

interface TaskColumn {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  color: string;
}

interface TaskBoardProps {
  tasks: TaskItem[];
  columns?: TaskColumn[];
  onTaskMove?: (taskId: string, newStatus: TaskItem['status']) => void;
  onTaskClick?: (task: TaskItem) => void;
  onAddTask?: (status: TaskItem['status']) => void;
  className?: string;
}

const defaultColumns: TaskColumn[] = [
  { id: 'todo', title: '待开始', status: 'todo', color: 'bg-gray-100' },
  { id: 'in-progress', title: '进行中', status: 'in-progress', color: 'bg-blue-100' },
  { id: 'review', title: '待审核', status: 'review', color: 'bg-yellow-100' },
  { id: 'done', title: '已完成', status: 'done', color: 'bg-green-100' },
];

const priorityColors = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
};

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  columns = defaultColumns,
  onTaskMove,
  onTaskClick,
  onAddTask,
  className
}) => {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const getTasksByStatus = (status: TaskItem['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskItem['status']) => {
    e.preventDefault();
    if (draggedTask) {
      onTaskMove?.(draggedTask, status);
      setDraggedTask(null);
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `已逾期 ${Math.abs(diffDays)} 天`;
    } else if (diffDays === 0) {
      return '今天截止';
    } else if (diffDays === 1) {
      return '明天截止';
    } else {
      return `${diffDays} 天后截止`;
    }
  };

  return (
    <div className={cn("flex gap-6 overflow-x-auto pb-4", className)}>
      {columns.map(column => {
        const columnTasks = getTasksByStatus(column.status);
        
        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.status)}
          >
            <Card className="h-full">
              <CardHeader className={cn("pb-4", column.color)}>
                <CardTitle className="flex items-center justify-between">
                  <span>{column.title}</span>
                  <Badge variant="secondary" className="ml-2">
                    {columnTasks.length}
                  </Badge>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAddTask?.(column.status)}
                  className="mt-2 w-full justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  添加任务
                </Button>
              </CardHeader>
              
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {columnTasks.map(task => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onClick={() => onTaskClick?.(task)}
                    className="cursor-pointer hover:shadow-md transition-shadow border-l-4"
                    style={{ borderLeftColor: priorityColors[task.priority] }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {task.title}
                          </h4>
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full flex-shrink-0 ml-2",
                              priorityColors[task.priority]
                            )}
                          />
                        </div>
                        
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDeadline(task.deadline)}</span>
                        </div>
                        
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                              <AvatarFallback className="text-xs">
                                {task.assignee.name.slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {task.assignee.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p className="text-sm">暂无任务</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
};