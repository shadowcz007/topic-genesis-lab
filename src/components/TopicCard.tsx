
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Topic } from "./TopicGenerator";

interface TopicCardProps {
  topic: Topic;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <Card className="topic-card overflow-hidden border border-muted">
      <CardContent className="p-4 flex items-start gap-2">
        <div className="flex-1">
          <p className="text-base">{topic.content}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFavorite}
          className={cn(
            "rounded-full p-2 h-auto",
            isFavorite ? "text-yellow-500" : "text-muted-foreground"
          )}
          aria-label={isFavorite ? "移除收藏" : "添加收藏"}
        >
          <Star
            size={16}
            className={cn(isFavorite ? "fill-yellow-500" : "")}
          />
        </Button>
      </CardContent>
    </Card>
  );
};

export default TopicCard;
