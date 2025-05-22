
import React from "react";
import { Topic } from "./TopicGenerator";
import TopicCard from "./TopicCard";
import { Bookmark } from "lucide-react";

interface FavoriteTopicsProps {
  favorites: Topic[];
  onRemove: (topic: Topic) => void;
}

const FavoriteTopics: React.FC<FavoriteTopicsProps> = ({
  favorites,
  onRemove,
}) => {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-16 bg-muted/30 rounded-lg">
        <div className="flex justify-center mb-4">
          <Bookmark size={48} className="text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-muted-foreground">
          您还没有收藏任何话题
        </h3>
        <p className="text-sm text-muted-foreground/70 mt-2">
          生成话题后，点击星标即可添加收藏
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          isFavorite={true}
          onToggleFavorite={() => onRemove(topic)}
        />
      ))}
    </div>
  );
};

export default FavoriteTopics;
