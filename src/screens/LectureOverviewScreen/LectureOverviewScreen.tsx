import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, FilterIcon, SearchIcon, StarIcon, HomeIcon, UserIcon, PlayIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

interface Lecture {
  id: string;
  title: string;
  date: string;
  isFavorited: boolean;
  hasNotification?: boolean;
}

export const LectureOverviewScreen = (): JSX.Element => {
  const { courseId } = useParams<{ courseId: string }>();
  
  // Mock course data
  const courseData = {
    "193.127": {
      title: "Interface and Interaction Design",
      lectures: [
        { id: "1", title: "Color Theory", date: "08.05.2025", isFavorited: true },
        { id: "2", title: "Guest Lecture", date: "10.04.2025", isFavorited: false },
        { id: "3", title: "Wireframes", date: "03.04.2025", isFavorited: false, hasNotification: true },
      ]
    },
    "185.A92": {
      title: "Introduction to Programming 2",
      lectures: [
        { id: "1", title: "Object-Oriented Programming", date: "15.05.2025", isFavorited: false },
        { id: "2", title: "Data Structures", date: "12.05.2025", isFavorited: true },
        { id: "3", title: "Algorithms", date: "08.05.2025", isFavorited: false },
      ]
    },
    "186.866": {
      title: "Algorithms and Data Structures",
      lectures: [
        { id: "1", title: "Sorting Algorithms", date: "20.05.2025", isFavorited: false },
        { id: "2", title: "Graph Theory", date: "17.05.2025", isFavorited: true },
        { id: "3", title: "Dynamic Programming", date: "14.05.2025", isFavorited: false },
      ]
    }
  };

  const course = courseData[courseId as keyof typeof courseData];
  const [lectures, setLectures] = useState<Lecture[]>(course?.lectures || []);

  // Toggle lecture favorite status
  const toggleLectureFavorite = (lectureId: string) => {
    setLectures(prevLectures =>
      prevLectures.map(lecture =>
        lecture.id === lectureId
          ? { ...lecture, isFavorited: !lecture.isFavorited }
          : lecture
      )
    );
  };

  if (!course) {
    return (
      <div className="bg-white flex flex-row justify-center w-full">
        <div className="bg-white overflow-hidden border border-solid border-black w-[393px] h-[852px] relative flex items-center justify-center">
          <p>Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden border border-solid border-black w-[393px] h-[852px] relative">
        {/* Header */}
        <header className="absolute w-[393px] h-[60px] top-0 left-0 bg-[#5586c94c]">
          <div className="flex items-center px-4 h-full">
            <Link to="/" className="mr-3">
              <ArrowLeftIcon className="w-6 h-6 text-black" />
            </Link>
            <h1 className="text-sm font-medium text-black flex-1">
              IID - Lecture Screen
            </h1>
          </div>
        </header>

        {/* Search and Filter */}
        <div className="absolute w-[393px] h-[50px] top-[60px] left-0 bg-[#5586c94c] px-2 flex items-center space-x-2">
          <div className="relative flex-1 h-[30px] bg-celestial-blue rounded-[5px] border-b [border-bottom-style:solid] border-[#000000cc] flex items-center px-2">
            <Input
              className="h-[30px] border-none bg-transparent pl-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              placeholder="Search"
            />
            <SearchIcon className="w-5 h-5 text-black" />
          </div>
          <Button
            variant="ghost"
            className="w-[30px] h-[30px] bg-celestial-blue rounded-[5px] p-0 flex items-center justify-center"
          >
            <FilterIcon className="w-5 h-5 text-black" />
          </Button>
        </div>

        {/* Course Title */}
        <div className="absolute top-[110px] left-0 w-full px-4 py-2">
          <h2 className="text-lg font-medium text-black">
            {courseId} {course.title}
          </h2>
        </div>

        {/* Lectures List */}
        <main className="absolute top-[150px] left-0 w-full h-[642px] overflow-y-auto px-4">
          <div className="space-y-4">
            {lectures.map((lecture) => (
              <Card key={lecture.id} className="border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  {/* Video thumbnail area - now clickable */}
                  <Link to={`/course/${courseId}/lecture/${lecture.id}`}>
                    <div className="relative w-full h-[120px] bg-celestial-blue flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                      <PlayIcon className="w-12 h-12 text-white" />
                      
                      {/* Notification indicator */}
                      {lecture.hasNotification && (
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
                        IID: {lecture.title} / {lecture.date}
                      </p>
                    </div>
                    
                    {/* Star toggle button */}
                    <Button
                      variant="ghost"
                      className="p-0 h-auto w-auto hover:bg-transparent ml-2"
                      onClick={() => toggleLectureFavorite(lecture.id)}
                    >
                      <StarIcon 
                        className={`w-6 h-6 ${
                          lecture.isFavorited 
                            ? 'text-yellow-500 fill-yellow-500' 
                            : 'text-gray-400'
                        }`}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>

        {/* Navigation bar */}
        <nav className="absolute w-[393px] h-[60px] bottom-0 left-0 bg-[#5586c94c] border-2 border-solid border-[#000000cc] flex justify-around items-center">
          <Link
            className="w-20 h-10 bg-white rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center"
            to="/favorites"
          >
            <StarIcon className="w-[31px] h-[31px]" />
          </Link>

          <Link
            className="w-20 h-10 bg-white rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center"
            to="/"
          >
            <HomeIcon className="w-[30px] h-[30px]" />
          </Link>

          <Link
            className="w-20 h-10 bg-white rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center"
            to="/profile"
          >
            <UserIcon className="w-[30px] h-[30px]" />
          </Link>
        </nav>
      </div>
    </div>
  );
};