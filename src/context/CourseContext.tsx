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
}

interface CourseData {
  [key: string]: Course;
}

interface CourseContextType {
  courseData: CourseData;
  toggleLectureFavorite: (courseId: string, lectureId: string) => void;
}

const initialCourseData: CourseData = {
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

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courseData, setCourseData] = useState<CourseData>(initialCourseData);

  const toggleLectureFavorite = (courseId: string, lectureId: string) => {
    setCourseData(prevData => {
      const course = prevData[courseId];
      if (!course) return prevData;

      const updatedLectures = course.lectures.map(lecture =>
        lecture.id === lectureId
          ? { ...lecture, isFavorited: !lecture.isFavorited }
          : lecture
      );

      return {
        ...prevData,
        [courseId]: {
          ...course,
          lectures: updatedLectures
        }
      };
    });
  };

  return (
    <CourseContext.Provider value={{ courseData, toggleLectureFavorite }}>
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