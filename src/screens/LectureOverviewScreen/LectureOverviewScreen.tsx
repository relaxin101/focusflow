import React, { useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { StarIcon } from "lucide-react";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { LectureCard } from "../../components/LectureCard/LectureCard";
import { NavigationBar } from "../../components/NavigationBar";
import { useCourse } from "../../context/CourseContext";
import { useDarkMode } from "../../context/DarkModeContext";

export const LectureOverviewScreen = (): JSX.Element => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ showLive: false, showUnwatched: false });
  const { courseData, toggleLectureFavorite } = useCourse();
  const { isDarkMode } = useDarkMode();

  const course = courseData[courseId || ""];

  // Memoize the toggle function
  const handleToggleFavorite = useCallback((lectureId: string) => {
    if (courseId) {
      toggleLectureFavorite(courseId, lectureId);
    }
  }, [courseId, toggleLectureFavorite]);

  // Filter lectures based on search query and filters
  const filteredLectures = useMemo(() => {
    if (!course) return [];
    return course.lectures
      .filter(lecture => {
        const matchesSearch = 
          lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lecture.date.toLowerCase().includes(searchQuery.toLowerCase());
        
        // A lecture is considered unwatched if it has notifications or is live
        const isUnwatched = lecture.hasNotification || lecture.isLive;
        const matchesLiveFilter = !filters.showLive || lecture.isLive;
        const matchesUnwatchedFilter = !filters.showUnwatched || isUnwatched;

        return matchesSearch && matchesLiveFilter && matchesUnwatchedFilter;
      })
      .sort((a, b) => {
        // Handle both DD.MM.YYYY and YYYY-MM-DD formats
        let dateA: Date, dateB: Date;
        
        if (a.date.includes('-')) {
          // YYYY-MM-DD format
          dateA = new Date(a.date);
        } else {
          // DD.MM.YYYY format
          const [dayA, monthA, yearA] = a.date.split('.').map(Number);
          dateA = new Date(yearA, monthA - 1, dayA);
        }
        
        if (b.date.includes('-')) {
          // YYYY-MM-DD format
          dateB = new Date(b.date);
        } else {
          // DD.MM.YYYY format
          const [dayB, monthB, yearB] = b.date.split('.').map(Number);
          dateB = new Date(yearB, monthB - 1, dayB);
        }
        
        // First sort by date (descending)
        const dateComparison = dateB.getTime() - dateA.getTime();
        
        // If dates are equal, sort by title lexicographically descending
        if (dateComparison === 0) {
          return b.title.localeCompare(a.title);
        }
        
        return dateComparison;
      });
  }, [course, searchQuery, filters]);

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
            placeholder="Search lectures..."
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {!course ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className={`text-lg transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>Course not found</p>
          </div>
        ) : filteredLectures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <StarIcon className={`w-16 h-16 mb-4 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p className={`text-lg transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>No lectures found</p>
            <p className={`text-sm mt-2 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`}>
              {searchQuery ? "Try a different search term" : "No lectures available for this course"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className={`text-lg font-semibold mb-4 transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>{course.title} Lectures</h2>
            {filteredLectures.map((lecture) => (
              <LectureCard
                key={lecture.id}
                id={lecture.id}
                courseId={courseId || ""}
                title={lecture.title}
                date={lecture.date}
                isFavorited={lecture.isFavorited}
                hasNotification={lecture.hasNotification}
                isLive={lecture.isLive}
                videoId={lecture.videoId}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      <NavigationBar />
    </div>
  );
};