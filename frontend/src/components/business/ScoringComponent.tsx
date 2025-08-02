import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoringDimension {
  id: string;
  name: string;
  description?: string;
  maxScore: number;
  weight: number;
  criteriaType: 'slider' | 'star' | 'category';
  categories?: { value: number; label: string; description?: string }[];
}

interface ScoringComponentProps {
  dimensions: ScoringDimension[];
  initialScores?: Record<string, number>;
  comments?: Record<string, string>;
  onScoreChange?: (dimensionId: string, score: number) => void;
  onCommentChange?: (dimensionId: string, comment: string) => void;
  onSubmit?: (scores: Record<string, number>, comments: Record<string, string>) => void;
  readonly?: boolean;
  showWeights?: boolean;
  showTotal?: boolean;
  className?: string;
}

export const ScoringComponent: React.FC<ScoringComponentProps> = ({
  dimensions,
  initialScores = {},
  comments = {},
  onScoreChange,
  onCommentChange,
  onSubmit,
  readonly = false,
  showWeights = true,
  showTotal = true,
  className
}) => {
  const [scores, setScores] = useState<Record<string, number>>(initialScores);
  const [localComments, setLocalComments] = useState<Record<string, string>>(comments);
  const [hoveredStar, setHoveredStar] = useState<{ dimensionId: string; star: number } | null>(null);

  const handleScoreChange = (dimensionId: string, score: number) => {
    if (readonly) return;
    
    const newScores = { ...scores, [dimensionId]: score };
    setScores(newScores);
    onScoreChange?.(dimensionId, score);
  };

  const handleCommentChange = (dimensionId: string, comment: string) => {
    if (readonly) return;
    
    const newComments = { ...localComments, [dimensionId]: comment };
    setLocalComments(newComments);
    onCommentChange?.(dimensionId, comment);
  };

  const calculateTotalScore = () => {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    dimensions.forEach(dimension => {
      const score = scores[dimension.id] || 0;
      const normalizedScore = (score / dimension.maxScore) * 100;
      totalWeightedScore += normalizedScore * dimension.weight;
      totalWeight += dimension.weight;
    });

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  };

  const renderStarRating = (dimension: ScoringDimension) => {
    const currentScore = scores[dimension.id] || 0;
    const maxStars = dimension.maxScore;

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: maxStars }, (_, i) => {
          const starValue = i + 1;
          const isHovered = hoveredStar?.dimensionId === dimension.id && hoveredStar.star >= starValue;
          const isFilled = currentScore >= starValue;
          const isHalf = currentScore > i && currentScore < starValue;

          return (
            <button
              key={i}
              type="button"
              disabled={readonly}
              className="focus:outline-none disabled:cursor-default"
              onMouseEnter={() => !readonly && setHoveredStar({ dimensionId: dimension.id, star: starValue })}
              onMouseLeave={() => !readonly && setHoveredStar(null)}
              onClick={() => handleScoreChange(dimension.id, starValue)}
            >
              {isHalf ? (
                <StarHalf className={cn(
                  "h-6 w-6",
                  (isFilled || isHovered) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                )} />
              ) : (
                <Star className={cn(
                  "h-6 w-6",
                  (isFilled || isHovered) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                )} />
              )}
            </button>
          );
        })}
        <span className="ml-2 text-sm text-muted-foreground">
          {currentScore}/{maxStars}
        </span>
      </div>
    );
  };

  const renderSliderRating = (dimension: ScoringDimension) => {
    const currentScore = scores[dimension.id] || 0;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">0</span>
          <span className="text-sm font-medium">{currentScore}</span>
          <span className="text-sm">{dimension.maxScore}</span>
        </div>
        <Slider
          value={[currentScore]}
          max={dimension.maxScore}
          step={0.5}
          disabled={readonly}
          onValueChange={(value) => handleScoreChange(dimension.id, value[0])}
          className="w-full"
        />
      </div>
    );
  };

  const renderCategoryRating = (dimension: ScoringDimension) => {
    const currentScore = scores[dimension.id] || 0;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {dimension.categories?.map(category => (
          <Button
            key={category.value}
            variant={currentScore === category.value ? "default" : "outline"}
            size="sm"
            disabled={readonly}
            onClick={() => handleScoreChange(dimension.id, category.value)}
            className="h-auto p-3 text-left justify-start"
          >
            <div>
              <div className="font-medium">{category.label}</div>
              <div className="text-xs opacity-70">{category.value} 分</div>
              {category.description && (
                <div className="text-xs opacity-70 mt-1">{category.description}</div>
              )}
            </div>
          </Button>
        ))}
      </div>
    );
  };

  const renderScoringInterface = (dimension: ScoringDimension) => {
    switch (dimension.criteriaType) {
      case 'star':
        return renderStarRating(dimension);
      case 'slider':
        return renderSliderRating(dimension);
      case 'category':
        return renderCategoryRating(dimension);
      default:
        return renderSliderRating(dimension);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {showTotal && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>总分</span>
              <Badge variant="default" className="text-lg">
                {calculateTotalScore().toFixed(1)} 分
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>
      )}

      {dimensions.map(dimension => (
        <Card key={dimension.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                <span>{dimension.name}</span>
                {showWeights && (
                  <Badge variant="outline" className="ml-2">
                    权重 {dimension.weight}%
                  </Badge>
                )}
              </div>
              <Badge variant="secondary">
                {scores[dimension.id] || 0}/{dimension.maxScore}
              </Badge>
            </CardTitle>
            {dimension.description && (
              <p className="text-sm text-muted-foreground">{dimension.description}</p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {renderScoringInterface(dimension)}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">评价意见</label>
              <Textarea
                placeholder="请输入评价意见..."
                value={localComments[dimension.id] || ''}
                onChange={(e) => handleCommentChange(dimension.id, e.target.value)}
                disabled={readonly}
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {!readonly && onSubmit && (
        <div className="flex justify-end gap-4">
          <Button variant="outline">保存草稿</Button>
          <Button onClick={() => onSubmit(scores, localComments)}>
            提交评分
          </Button>
        </div>
      )}
    </div>
  );
};