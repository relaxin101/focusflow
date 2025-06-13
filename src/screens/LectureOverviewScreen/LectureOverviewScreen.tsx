import React, { useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, FilterIcon, StarIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { LectureCard } from "../../components/LectureCard/LectureCard";
import { useCourse } from "../../context/CourseContext";

interface Lecture {
  id: string;
  title: string;
  date: string;
  isFavorited: boolean;
  hasNotification?: boolean;
}

export const LectureOverviewScreen = (): JSX.Element => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const { courseData, toggleLectureFavorite } = useCourse();
  
  const course = courseData[courseId as keyof typeof courseData];
  const [lectures, setLectures] = useState<Lecture[]>(course?.lectures || []);

  // Filter lectures based on search query
  const filteredLectures = useMemo(() => {
    return lectures.filter(lecture =>
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.date.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [lectures, searchQuery]);

  // Handle lecture favorite toggle
  const handleToggleFavorite = (lectureId: string) => {
    if (courseId) {
      toggleLectureFavorite(courseId, lectureId);
      setLectures(prevLectures =>
        prevLectures.map(lecture =>
          lecture.id === lectureId
            ? { ...lecture, isFavorited: !lecture.isFavorited }
            : lecture
        )
      );
    }
  };

  if (!course) {
    return (
      <div className="bg-white min-h-screen max-w-[393px] mx-auto relative">
        <div className="flex items-center justify-center h-screen">
          <p>Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen max-w-[393px] mx-auto relative">
      {/* Header */}
      <header className="fixed w-full max-w-[393px] h-[60px] top-0 left-1/2 -translate-x-1/2 bg-[#5586c94c]">
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
      <div className="fixed w-full max-w-[393px] h-[50px] top-[60px] left-1/2 -translate-x-1/2 bg-[#5586c94c] px-2 flex items-center space-x-2">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
        />
        <Button
          variant="ghost"
          className="w-[30px] h-[30px] bg-celestial-blue rounded-[5px] p-0 flex items-center justify-center"
        >
          <FilterIcon className="w-5 h-5 text-black" />
        </Button>
      </div>

      {/* Course Title */}
      <div className="fixed w-full max-w-[393px] top-[110px] left-1/2 -translate-x-1/2 px-4 py-2">
        <h2 className="text-lg font-medium text-black">
          {courseId} {course.title}
        </h2>
      </div>

      {/* Lectures List */}
      <main className="w-full h-[calc(100vh-170px)] mt-[170px] overflow-y-auto px-4">
        <div className="space-y-4">
          {filteredLectures.map((lecture) => (
            <LectureCard
              key={lecture.id}
              id={lecture.id}
              courseId={courseId || ""}
              title={lecture.title}
              date={lecture.date}
              isFavorited={lecture.isFavorited}
              hasNotification={lecture.hasNotification}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </main>

      {/* Navigation bar */}
      <nav className="fixed w-full max-w-[393px] h-[60px] bottom-0 left-1/2 -translate-x-1/2 bg-[#5586c94c] border-2 border-solid border-[#000000cc] flex justify-around items-center">
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
  );
};