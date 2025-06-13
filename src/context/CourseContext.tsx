import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Lecture {
  id: string;
  title: string;
  date: string;
  isFavorited: boolean;
  hasNotification?: boolean;
}

interface Course {
  title: string;
  lectures: Lecture[];
  isPinned: boolean;
  isLive?: boolean;
}

interface CourseData {
  [key: string]: Course;
}

interface CourseContextType {
  courseData: CourseData;
  toggleLectureFavorite: (courseId: string, lectureId: string) => void;
  toggleCoursePin: (courseId: string) => void;
}

const initialCourseData: CourseData = {
  "193.127": {
    title: "Interface and Interaction Design",
    lectures: [
      { id: "1", title: "Color Theory", date: "08.05.2025", isFavorited: true },
      { id: "2", title: "Guest Lecture", date: "10.04.2025", isFavorited: false },
      { id: "3", title: "Wireframes", date: "03.04.2025", isFavorited: false, hasNotification: true },
    ],
    isPinned: true,
    isLive: true
  },
  "185.A92": {
    title: "Introduction to Programming 2",
    lectures: [
      { id: "1", title: "Object-Oriented Programming", date: "15.05.2025", isFavorited: false },
      { id: "2", title: "Data Structures", date: "12.05.2025", isFavorited: true },
      { id: "3", title: "Algorithms", date: "08.05.2025", isFavorited: false },
    ],
    isPinned: true,
    isLive: false
  },
  "186.866": {
    title: "Algorithms and Data Structures",
    lectures: [
      { id: "1", title: "Sorting Algorithms", date: "20.05.2025", isFavorited: false },
      { id: "2", title: "Graph Theory", date: "17.05.2025", isFavorited: true },
      { id: "3", title: "Dynamic Programming", date: "14.05.2025", isFavorited: false },
    ],
    isPinned: true,
    isLive: false
  }
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courseData, setCourseData] = useState<CourseData>(initialCourseData);

  const toggleLectureFavorite = (courseId: string, lectureId: string) => {
    setCourseData(prevData => {
      const course = prevData[courseId];
      if (!course) return prevData;

      const updatedLectures = course.lectures.map(lecture => {
        if (lecture.id === lectureId) {
          return { ...lecture, isFavorited: !lecture.isFavorited };
        }
        return lecture;
      });

      const newData = {
        ...prevData,
        [courseId]: {
          ...course,
          lectures: updatedLectures
        }
      };

      console.log('Toggling favorite:', { courseId, lectureId, newData });
      return newData;
    });
  };

  const toggleCoursePin = (courseId: string) => {
    setCourseData(prevData => {
      const course = prevData[courseId];
      if (!course) return prevData;

      const newData = {
        ...prevData,
        [courseId]: {
          ...course,
          isPinned: !course.isPinned
        }
      };

      console.log('Toggling course pin:', { courseId, newData });
      return newData;
    });
  };

  return (
    <CourseContext.Provider value={{ courseData, toggleLectureFavorite, toggleCoursePin }}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
}; 