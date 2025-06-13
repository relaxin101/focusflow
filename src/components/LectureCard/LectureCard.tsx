import React from "react";
import { Link } from "react-router-dom";
import { PlayIcon, StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

interface LectureCardProps {
  id: string;
  courseId: string;
  title: string;
  date: string;
  isFavorited: boolean;
  hasNotification?: boolean;
  onToggleFavorite?: (courseId: string) => void;
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
    <Card className="w-[372px] h-[198px] mx-auto border-none shadow-none">
      <CardContent className="p-0">
        {/* Video thumbnail area */}
        <Link to={`/course/${courseId}/lecture/${id}`}>
          <div className="relative w-[349px] h-[150px] mx-auto bg-celestial-blue flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
            <PlayIcon className="w-12 h-12 text-white" />
            
            {/* Notification indicator */}
            {hasNotification && (
              <div className="absolute w-[22px] h-5 top-2 right-2">
                <div className="relative w-5 h-5 bg-[url(/ellipse-8.svg)] bg-[100%_100%]">
                  <div className="absolute w-2.5 h-5 top-0 left-[5px] [font-family:'Inter',Helvetica] font-normal text-black text-xs text-center tracking-[0] leading-5 whitespace-nowrap">
                    1
                  </div>
                </div>
              </div>
            )}
          </div>
        </Link>
        
        {/* Lecture info */}
        <div className="flex justify-start items-center mt-2 px-6">
          <h2 className="[font-family:'Inter',Helvetica] font-normal text-black text-xl tracking-[0] leading-5 max-w-[300px] break-words">
            {courseId}&nbsp;&nbsp;{title} / {date}
          </h2>
          
          {/* Star toggle button */}
          {showFavoriteButton && onToggleFavorite && (
            <Button
              variant="ghost"
              className="p-0 h-auto w-auto hover:bg-transparent flex items-center"
              onClick={() => onToggleFavorite(courseId)}
            >
              <StarIcon 
                className={`!w-[32px] !h-[32px] stroke-[2.5] ${
                  isFavorited 
                    ? 'text-yellow-500 fill-yellow-500 stroke-black' 
                    : 'text-gray-400 stroke-black'
                }`}
                style={{ width: '32px', height: '32px' }}
              />
            </Button>
          )}
        </div>

        <Separator className="mt-3 w-[370px] mx-auto" />
      </CardContent>
    </Card>
  );
}; 