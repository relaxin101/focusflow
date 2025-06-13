import React, { useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { StarIcon } from "lucide-react";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { LectureCard } from "../../components/LectureCard/LectureCard";
import { NavigationBar } from "../../components/NavigationBar";
import { useCourse } from "../../context/CourseContext";

export const LectureOverviewScreen = (): JSX.Element => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const { courseData, toggleLectureFavorite } = useCourse();

  const course = courseData[courseId || ""];

  // Memoize the toggle function
  const handleToggleFavorite = useCallback((lectureId: string) => {
    if (courseId) {
      toggleLectureFavorite(courseId, lectureId);
    }
  }, [courseId, toggleLectureFavorite]);

  // Filter lectures based on search query
  const filteredLectures = useMemo(() => {
    if (!course) return [];
    return course.lectures.filter(lecture =>
      lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lecture.date.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [course, searchQuery]);

  return (
    <div className="bg-white min-h-screen max-w-[393px] mx-auto relative">
      {/* Main content */}
      <main className="w-full h-[calc(100vh-60px)] overflow-y-auto p-4">
        {/* Search */}
        <div className="mb-4">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search lectures..."
          />
        </div>

        {!course ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-gray-500 text-lg">Course not found</p>
          </div>
        ) : filteredLectures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <StarIcon className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No lectures found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery ? "Try a different search term" : "No lectures available for this course"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-black mb-4">{course.title} Lectures</h2>
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
        )}
      </main>

      <NavigationBar />
    </div>
  );
};