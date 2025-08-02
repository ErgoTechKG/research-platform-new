import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MentorCardProps {
  mentor: {
    id: string;
    name: string;
    avatar?: string;
    lab: string;
    tags: string[];
    availableSlots: string;
    currentStudents: number;
    isOnline?: boolean;
  };
  onApply?: (mentorId: string) => void;
  onViewDetails?: (mentorId: string) => void;
  className?: string;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  onApply,
  onViewDetails,
  className
}) => {
  return (
    <Card className={cn("w-full max-w-sm hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <div className="relative">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
            <AvatarFallback>{mentor.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          {mentor.isOnline && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
          )}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold">{mentor.name}</h3>
          <p className="text-sm text-muted-foreground">{mentor.lab}</p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {mentor.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-lg font-semibold text-primary">
              {mentor.availableSlots}
            </div>
            <div className="text-xs text-muted-foreground">可带学生</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold">
              {mentor.currentStudents}
            </div>
            <div className="text-xs text-muted-foreground">当前学生</div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={() => onApply?.(mentor.id)}
          >
            申请加入
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onViewDetails?.(mentor.id)}
          >
            查看详情
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};