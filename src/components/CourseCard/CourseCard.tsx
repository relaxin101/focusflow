import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { useDarkMode } from "../../context/DarkModeContext";

interface CourseCardProps {
  id: string;
  title: string;
  isPinned: boolean;
  onTogglePin: () => void;
  notifications?: number;
  isLive?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  isPinned,
  onTogglePin,
  notifications = 0,
  isLive = false,
}) => {
  const { isDarkMode } = useDarkMode();

  return (
    <Card className={`w-[372px] h-[198px] mx-auto border-none shadow-none transition-colors duration-200 ${
      isDarkMode ? 'bg-transparent' : 'bg-white'
    }`}>
      <CardContent className="p-0 relative">
        {/* Course image placeholder - now clickable */}
        <Link to={`/course/${id}`}>
          <div className={`relative w-[349px] h-[150px] mx-auto cursor-pointer hover:opacity-90 transition-all duration-200 ${
            isDarkMode ? 'bg-[#2f3136]' : 'bg-celestial-blue'
          }`}>
            <img
              className="w-full h-full"
              alt="Course placeholder"
              src="/01-images---placeholder.svg"
            />

            {/* Notification badges */}
            {notifications > 0 && (
              <div className="absolute w-[22px] h-5 top-2 right-2">
                <div className="relative w-5 h-5 bg-[url(/ellipse-8.svg)] bg-[100%_100%]">
                  <div className={`absolute w-2.5 h-5 top-0 left-[5px] [font-family:'Inter',Helvetica] font-normal text-xs text-center tracking-[0] leading-5 whitespace-nowrap transition-colors duration-200 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>
                    {notifications}
                  </div>
                </div>
              </div>
            )}

            {/* Live indicator */}
            {isLive && (
              <div className="absolute w-9 h-4 top-2.5 right-10">
                <Badge className="absolute w-[26px] h-4 top-0 left-2 bg-transparent text-[#a40000] text-xs text-center tracking-[0] leading-5 whitespace-nowrap p-0">
                  LIVE
                </Badge>
                <div className="absolute w-1.5 h-1.5 top-[5px] left-0 bg-[#a40000] rounded-[3px]" />
              </div>
            )}
          </div>
        </Link>

        {/* Course title */}
        <div className="flex justify-between items-center mt-2 px-6">
          <h2 className={`[font-family:'Inter',Helvetica] font-normal text-xl tracking-[0] leading-5 transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            {id}&nbsp;&nbsp;{title}
          </h2>

          {/* Clickable pin icon */}
          <Button
            variant="ghost"
            className="p-0 h-auto w-auto hover:bg-transparent"
            onClick={onTogglePin}
          >
            {isPinned ? (
              <img
                className="w-[32px] h-[32px] object-cover"
                alt="Pin filled"
                src="/icons8-pin-50-1--3.png"
              />
            ) : (
              <img
                className="w-[32px] h-[32px] object-cover"
                alt="Pin outline"
                src="/icons8-pin-50(2).png"
              />
            )}
          </Button>
        </div>

        <Separator className={`mt-3 w-[370px] mx-auto transition-colors duration-200 ${
          isDarkMode ? 'bg-[#4f545c]' : 'bg-gray-200'
        }`} />
      </CardContent>
    </Card>
  );
}; 