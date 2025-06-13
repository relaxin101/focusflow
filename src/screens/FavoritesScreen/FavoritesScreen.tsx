import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, StarIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface FavoriteLecture {
  id: string;
  courseId: string;
  courseTitle: string;
  lectureTitle: string;
  date: string;
}

export const FavoritesScreen = (): JSX.Element => {
  // Mock favorited lectures data - in a real app this would come from a global state or API
  const [favoriteLectures, setFavoriteLectures] = useState<FavoriteLecture[]>([
    {
      id: "1",
      courseId: "193.127",
      courseTitle: "Interface and Interaction Design",
      lectureTitle: "Color Theory",
      date: "08.05.2025",
    },
    {
      id: "2", 
      courseId: "185.A92",
      courseTitle: "Introduction to Programming 2",
      lectureTitle: "Data Structures",
      date: "12.05.2025",
    },
    {
      id: "3",
      courseId: "186.866", 
      courseTitle: "Algorithms and Data Structures",
      lectureTitle: "Graph Theory",
      date: "17.05.2025",
    },
  ]);

  return (
    <div className="bg-white min-h-screen max-w-[393px] mx-auto relative">
      {/* Header */}
      <header className="fixed w-full max-w-[393px] h-[60px] top-0 left-1/2 -translate-x-1/2 bg-[#5586c94c] flex items-center px-4">
        <Link to="/" className="mr-4">
          <ArrowLeftIcon className="w-6 h-6 text-black" />
        </Link>
        <h1 className="text-xl font-semibold text-black">Favorites</h1>
      </header>

      {/* Favorites list */}
      <main className="w-full h-[calc(100vh-120px)] mt-[60px] overflow-y-auto p-4">
        {favoriteLectures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <StarIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No favorite lectures yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Star lectures from course screens to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-black mb-4">Favorite Lectures</h2>
            {favoriteLectures.map((lecture) => (
              <Card key={lecture.id} className="border border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-black">
                        {lecture.courseId} - {lecture.lectureTitle}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {lecture.courseTitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {lecture.date}
                      </p>
                    </div>
                    <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="w-full h-20 bg-celestial-blue rounded-md flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Navigation bar */}
      <nav className="fixed w-full max-w-[393px] h-[60px] bottom-0 left-1/2 -translate-x-1/2 bg-[#5586c94c] border-2 border-solid border-[#000000cc] flex justify-around items-center">
        <Button className="w-20 h-10 bg-fern-green rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center p-0">
          <StarIcon className="w-[31px] h-[31px]" />
        </Button>

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
  );
};