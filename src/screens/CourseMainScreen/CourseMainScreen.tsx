import {
  FilterIcon,
  HomeIcon,
  SearchIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";

export const CourseMainScreen = (): JSX.Element => {
  // Course data with pin state management
  const [courses, setCourses] = useState([
    {
      id: "193.127",
      title: "Interface and Interaction Design",
      isLive: true,
      notifications: 2,
      isPinned: true,
    },
    {
      id: "185.A92",
      title: "Introduction to Programming 2",
      isLive: false,
      notifications: 0,
      isPinned: true,
    },
    {
      id: "186.866",
      title: "Algorithms and Data Structures",
      isLive: false,
      notifications: 1,
      isPinned: true,
    },
  ]);

  // Toggle pin status
  const togglePin = (courseId: string) => {
    setCourses(prevCourses =>
      prevCourses.map(course =>
        course.id === courseId
          ? { ...course, isPinned: !course.isPinned }
          : course
      )
    );
  };

  // Sort courses: pinned first, then unpinned
  const sortedCourses = [...courses].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="bg-white min-h-screen max-w-[393px] mx-auto relative">
      {/* SearchIcon header */}
      <header className="fixed w-full max-w-[393px] h-[60px] top-0 left-1/2 -translate-x-1/2 bg-[#5586c94c]">
        <div className="absolute w-[336px] h-[30px] top-4 left-1/2 -translate-x-1/2">
          <div className="relative w-[334px] h-[30px] bg-celestial-blue rounded-[5px] border-b [border-bottom-style:solid] border-[#000000cc] flex items-center px-2">
            <Input
              className="h-[30px] border-none bg-transparent pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Search"
            />
            <SearchIcon className="w-6 h-6 text-black" />
          </div>
        </div>

        <Button
          variant="ghost"
          className="absolute w-[30px] h-[30px] top-4 right-4 bg-celestial-blue rounded-[5px] p-0 flex items-center justify-center"
        >
          <FilterIcon className="w-6 h-6 text-black" />
        </Button>
      </header>

      {/* Course list */}
      <main className="w-full h-[calc(100vh-120px)] mt-[60px] overflow-y-auto">
        {sortedCourses.slice(0, 3).map((course, index) => (
          <Card
            key={course.id}
            className="w-[372px] h-[198px] mx-auto mb-5 border-none shadow-none"
          >
            <CardContent className="p-0 relative">
              {/* Course image placeholder - now clickable */}
              <Link to={`/course/${course.id}`}>
                <div className="relative w-[349px] h-[150px] mx-auto bg-celestial-blue cursor-pointer hover:opacity-90 transition-opacity">
                  <img
                    className="w-full h-full"
                    alt="Course placeholder"
                    src="/01-images---placeholder.svg"
                  />

                  {/* Notification badges */}
                  {course.notifications > 0 && (
                    <div className="absolute w-[22px] h-5 top-2 right-2">
                      <div className="relative w-5 h-5 bg-[url(/ellipse-8.svg)] bg-[100%_100%]">
                        <div className="absolute w-2.5 h-5 top-0 left-[5px] [font-family:'Inter',Helvetica] font-normal text-black text-xs text-center tracking-[0] leading-5 whitespace-nowrap">
                          {course.notifications}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live indicator */}
                  {course.isLive && (
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
              <div className="flex justify-between items-center mt-2 px-2">
                <h2 className="[font-family:'Inter',Helvetica] font-normal text-black text-xl tracking-[0] leading-5">
                  {course.id}&nbsp;&nbsp;{course.title}
                </h2>

                {/* Clickable pin icon */}
                <Button
                  variant="ghost"
                  className="p-0 h-auto w-auto hover:bg-transparent"
                  onClick={() => togglePin(course.id)}
                >
                  {course.isPinned ? (
                    <img
                      className="w-[25px] h-[25px] object-cover"
                      alt="Pin filled"
                      src="/icons8-pin-50-1--3.png"
                    />
                  ) : (
                    <svg
                      className="w-[25px] h-[25px] text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M9 9V5a3 3 0 0 1 6 0v4"/>
                      <path d="M12 9v13"/>
                      <path d="M9 22h6"/>
                      <path d="M8 9h8l-1 7H9L8 9z"/>
                    </svg>
                  )}
                </Button>
              </div>

              <Separator className="mt-3 w-[370px] mx-auto" />
            </CardContent>
          </Card>
        ))}
      </main>

      {/* Navigation bar */}
      <nav className="fixed w-full max-w-[393px] h-[60px] bottom-0 left-1/2 -translate-x-1/2 bg-[#5586c94c] border-2 border-solid border-[#000000cc] flex justify-around items-center">
        <Link
          className="w-20 h-10 bg-white rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center"
          to="/favorites"
        >
          <StarIcon className="w-[31px] h-[31px]" />
        </Link>

        <Button className="w-20 h-10 bg-fern-green rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center p-0">
          <HomeIcon className="w-[30px] h-[30px]" />
        </Button>

        <Link
          className="w-20 h-10 bg-white rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center"
          to="/profile"
        >
          <UserIcon className="w-[30px] h-[30px]" />
        </Link>
      </nav>
    </div>
  );
};