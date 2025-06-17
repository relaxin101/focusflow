import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { StarIcon, HomeIcon, UserIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { CourseCard } from "../../components/CourseCard/CourseCard";
import { NavigationBar } from "../../components/NavigationBar";
import { useCourse } from "../../context/CourseContext";
import { useDarkMode } from "../../context/DarkModeContext";

export const CourseMainScreen = (): JSX.Element => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ showLive: false, showUnwatched: false });
  const { courseData, toggleCoursePin } = useCourse();
  const { isDarkMode } = useDarkMode();

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    const courses = Object.entries(courseData).map(([id, course]) => {
      // Calculate if any lecture is live
      const hasLiveLecture = course.lectures.some(lecture => lecture.isLive);
      // Count lectures with notifications
      const notifications = course.lectures.filter(l => l.hasNotification).length;
      // A course has unwatched content if it has notifications or any live lecture
      const hasUnwatchedContent = notifications > 0 || hasLiveLecture;

      return {
        id,
        title: course.title,
        isLive: hasLiveLecture,
        notifications,
        isPinned: course.isPinned,
        hasUnwatchedContent
      };
    });

    const filtered = courses.filter(course => {
      const matchesSearch = 
        course.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLiveFilter = !filters.showLive || course.isLive;
      const matchesUnwatchedFilter = !filters.showUnwatched || course.hasUnwatchedContent;

      return matchesSearch && matchesLiveFilter && matchesUnwatchedFilter;
    });

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [courseData, searchQuery, filters]);

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
            placeholder="Search courses..."
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        {filteredAndSortedCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <StarIcon className={`w-16 h-16 mb-4 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-300'
            }`} />
            <p className={`text-lg transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-500'
            }`}>No courses found</p>
            <p className={`text-sm mt-2 transition-colors duration-200 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`}>
              {searchQuery ? "Try a different search term" : "Add courses to see them here"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                isPinned={course.isPinned}
                onTogglePin={() => toggleCoursePin(course.id)}
                notifications={course.notifications}
                isLive={course.isLive}
              />
            ))}
          </div>
        )}
      </main>

      <NavigationBar />
    </div>
  );
};