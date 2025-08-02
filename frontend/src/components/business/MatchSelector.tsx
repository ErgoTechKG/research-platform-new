import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, ChevronRight, ChevronLeft, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Mentor {
  id: string;
  name: string;
  avatar?: string;
  lab: string;
  tags: string[];
}

interface MatchSelectorProps {
  availableMentors: Mentor[];
  selectedMentors: Mentor[];
  onSelectMentor?: (mentor: Mentor) => void;
  onRemoveMentor?: (mentorId: string) => void;
  onReorderPriority?: (fromIndex: number, toIndex: number) => void;
  maxSelections?: number;
  className?: string;
}

export const MatchSelector: React.FC<MatchSelectorProps> = ({
  availableMentors,
  selectedMentors,
  onSelectMentor,
  onRemoveMentor,
  onReorderPriority,
  maxSelections = 5,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const filteredMentors = availableMentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.lab.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const canSelectMore = selectedMentors.length < maxSelections;

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorderPriority?.(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
      {/* Available Mentors Panel */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>可选导师</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索导师..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredMentors.map(mentor => (
              <div
                key={mentor.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback>{mentor.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{mentor.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{mentor.lab}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {mentor.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!canSelectMore || selectedMentors.some(s => s.id === mentor.id)}
                  onClick={() => onSelectMentor?.(mentor)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions Panel */}
      <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            已选择 {selectedMentors.length}/{maxSelections}
          </p>
          <div className="flex lg:flex-col gap-2">
            <Button size="sm" variant="outline" className="w-full">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Selected Mentors Panel */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>我的志愿</CardTitle>
          <p className="text-sm text-muted-foreground">
            拖拽调整优先级顺序
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedMentors.map((mentor, index) => (
              <div
                key={mentor.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 cursor-move transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="default" className="min-w-[24px] h-6 justify-center">
                    {index + 1}
                  </Badge>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback className="text-xs">{mentor.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{mentor.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{mentor.lab}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveMentor?.(mentor.id)}
                  className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {selectedMentors.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>还未选择任何导师</p>
                <p className="text-sm">请从左侧选择导师</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};