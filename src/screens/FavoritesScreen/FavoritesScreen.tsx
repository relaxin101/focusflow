import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { StarIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { LectureCard } from "../../components/LectureCard/LectureCard";
import { NavigationBar } from "../../components/NavigationBar";
import { useCourse } from "../../context/CourseContext";
import { useDarkMode } from "../../context/DarkModeContext";

interface Lecture {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  date: string;
  isFavorited: boolean;
  hasNotification?: boolean;
  isLive?: boolean;
  videoId?: string;
}

export const FavoritesScreen = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ showLive: false, showUnwatched: false });
  const { courseData, toggleLectureFavorite } = useCourse();
  const { isDarkMode } = useDarkMode();

  // Get all favorited lectures from all courses
  const favoriteLectures = useMemo(() => {
    const allLectures: Lecture[] = [];
    
    Object.entries(courseData).forEach(([courseId, course]) => {
      course.lectures.forEach(lecture => {
        if (lecture.isFavorited) {
          allLectures.push({
            ...lecture,
            courseId,
            courseTitle: course.title
          });
        }
      });
    });
    
    return allLectures;
  }, [courseData]);

  // Filter favorite lectures based on search query and filters
  const filteredFavoriteLectures = useMemo(() => {
    return favoriteLectures.filter(lecture => {
      const matchesSearch = 
        lecture.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.date.toLowerCase().includes(searchQuery.toLowerCase());
      
      // A lecture is considered unwatched if it has notifications or is live
      const isUnwatched = lecture.hasNotification || lecture.isLive;
      const matchesLiveFilter = !filters.showLive || lecture.isLive;
      const matchesUnwatchedFilter = !filters.showUnwatched || isUnwatched;

      return matchesSearch && matchesLiveFilter && matchesUnwatchedFilter;
    });
  }, [favoriteLectures, searchQuery, filters]);

  // Handle lecture favorite toggle
  const handleToggleFavorite = (lectureId: string, courseId: string) => {
    toggleLectureFavorite(courseId, lectureId);
  };

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-200 ${
      isDarkMode ? 'bg-[#36393f]' : 'bg-white'
    }`}>
      {/* Main content */}
      <main className="w-full h-[calc(100vh-60px)] overflow-y-auto p-4">
        {/* Search */}
        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search favorites..."
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {filteredFavoriteLectures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <StarIcon className={`w-16 h-16 mb-4 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p className={`text-lg transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>No favorite lectures found</p>
            <p className={`text-sm mt-2 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`}>
              {searchQuery ? "Try a different search term" : "Star lectures from course screens to see them here"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>Favorite Lectures</h2>
            {filteredFavoriteLectures.map((lecture) => (
              <LectureCard
                key={`${lecture.courseId}-${lecture.id}`}
                id={lecture.id}
                courseId={lecture.courseId}
                title={lecture.title}
                date={lecture.date}
                isFavorited={lecture.isFavorited}
                hasNotification={lecture.hasNotification}
                isLive={lecture.isLive}
                videoId={lecture.videoId}
                onToggleFavorite={() => handleToggleFavorite(lecture.id, lecture.courseId)}
              />
            ))}
          </div>
        )}
      </main>

      <NavigationBar />
    </div>
  );
};