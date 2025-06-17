import React from "react";
import { Link } from "react-router-dom";
import { PlayIcon, StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useDarkMode } from "../../context/DarkModeContext";

interface LectureCardProps {
  id: string;
  courseId: string;
  title: string;
  date: string;
  isFavorited: boolean;
  hasNotification?: boolean;
  isLive?: boolean;
  videoId?: string;
  onToggleFavorite?: (lectureId: string) => void;
  showFavoriteButton?: boolean;
}

export const LectureCard: React.FC<LectureCardProps> = ({
  id,
  courseId,
  title,
  date,
  isFavorited,
  hasNotification,
  isLive,
  videoId,
  onToggleFavorite,
  showFavoriteButton = true,
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <Card className={`w-[372px] h-[198px] mx-auto border-none shadow-none transition-colors duration-200 ${
      isDarkMode ? 'bg-transparent' : 'bg-white'
    }`}>
      <CardContent className="p-0">
        {/* Video thumbnail area */}
        <Link to={`/course/${courseId}/lecture/${id}`}>
          <div className={`relative w-[349px] h-[150px] mx-auto flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-200 overflow-hidden ${
            isDarkMode ? 'bg-[#2f3136]' : 'bg-celestial-blue'
          }`}>
            {videoId ? (
              <>
                <img 
                  src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                  alt={`${title} thumbnail`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to default background if thumbnail fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <PlayIcon className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
              </>
            ) : (
              <PlayIcon className="w-12 h-12 text-white" />
            )}
            
            {/* Notification indicator */}
            {(hasNotification || isLive) && (
              <div className="absolute w-[22px] h-5 top-2 right-2 z-10">
                <div className="relative w-5 h-5 bg-[url(/ellipse-8.svg)] bg-[100%_100%]">
                  <div className={`absolute w-2.5 h-5 top-0 left-[5px] [font-family:'Inter',Helvetica] font-normal text-xs text-center tracking-[0] leading-5 whitespace-nowrap transition-colors duration-200 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    1
                  </div>
                </div>
              </div>
            )}

            {/* Live indicator */}
            {isLive && (
              <div className="absolute w-9 h-4 top-2.5 right-10 z-10">
                <Badge className="absolute w-[26px] h-4 top-0 left-2 bg-transparent text-[#a40000] text-xs text-center tracking-[0] leading-5 whitespace-nowrap p-0">
                  LIVE
                </Badge>
                <div className="absolute w-1.5 h-1.5 top-[5px] left-0 bg-[#a40000] rounded-[3px]" />
              </div>
            )}
          </div>
        </Link>
        
        {/* Lecture info */}
        <div className="flex justify-start items-center mt-2 px-6">
          <h2 className={`[font-family:'Inter',Helvetica] font-normal text-xl tracking-[0] leading-5 max-w-[300px] break-words transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            {courseId}&nbsp;&nbsp;{title} / {date}
          </h2>
          
          {/* Star toggle button */}
          {showFavoriteButton && onToggleFavorite && (
            <Button
              variant="ghost"
              className="p-0 h-auto w-auto hover:bg-transparent flex items-center"
              onClick={() => onToggleFavorite(id)}
            >
              <StarIcon 
                className={`!w-[32px] !h-[32px] stroke-[2.5] transition-colors duration-200 ${
                  isFavorited 
                    ? 'text-yellow-500 fill-yellow-500 stroke-black' 
                    : isDarkMode 
                      ? 'text-gray-500 stroke-gray-500' 
                      : 'text-gray-400 stroke-black'
                }`}
                style={{ width: '32px', height: '32px' }}
              />
            </Button>
          )}
        </div>

        <Separator className={`mt-3 w-[370px] mx-auto transition-colors duration-200 ${
          isDarkMode ? 'bg-[#4f545c]' : 'bg-gray-200'
        }`} />
      </CardContent>
    </Card>
  );
}; 