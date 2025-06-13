import React from "react";
import { Link } from "react-router-dom";
import { PlayIcon, StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface LectureCardProps {
  id: string;
  courseId: string;
  title: string;
  date: string;
  isFavorited: boolean;
  hasNotification?: boolean;
  onToggleFavorite?: (id: string) => void;
  showFavoriteButton?: boolean;
}

export const LectureCard: React.FC<LectureCardProps> = ({
  id,
  courseId,
  title,
  date,
  isFavorited,
  hasNotification,
  onToggleFavorite,
  showFavoriteButton = true,
}) => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-0">
        {/* Video thumbnail area */}
        <Link to={`/course/${courseId}/lecture/${id}`}>
          <div className="relative w-full h-[120px] bg-celestial-blue flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <PlayIcon className="w-12 h-12 text-white" />
            
            {/* Notification indicator */}
            {hasNotification && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-black">1</span>
              </div>
            )}
          </div>
        </Link>
        
        {/* Lecture info */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-black">
              {courseId}: {title} / {date}
            </p>
          </div>
          
          {/* Star toggle button */}
          {showFavoriteButton && onToggleFavorite && (
            <Button
              variant="ghost"
              className="p-0 h-auto w-auto hover:bg-transparent ml-2"
              onClick={() => onToggleFavorite(id)}
            >
              <StarIcon 
                className={`w-6 h-6 ${
                  isFavorited 
                    ? 'text-yellow-500 fill-yellow-500' 
                    : 'text-gray-400'
                }`}
              />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 