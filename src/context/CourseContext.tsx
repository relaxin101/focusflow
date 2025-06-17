import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Anchor {
  id: string;
  title: string;
  timestamp: string;
  timestampSeconds: number;
  description: string;
}

export interface GlobalAnchor extends Anchor {
  author: string;
  likes: number;
  dislikes: number;
}

interface Lecture {
  id: string;
  title: string;
  date: string;
  isFavorited: boolean;
  hasNotification?: boolean;
  isLive?: boolean;
  videoId: string;
  anchors: Anchor[];
  globalAnchors?: GlobalAnchor[];
}

interface Course {
  title: string;
  lectures: Lecture[];
  isPinned: boolean;
}

interface CourseData {
  [key: string]: Course;
}

interface CourseContextType {
  courseData: CourseData;
  toggleLectureFavorite: (courseId: string, lectureId: string) => void;
  toggleCoursePin: (courseId: string) => void;
  addCourse: (id: string, title: string, isPinned?: boolean) => void;
  updateCourse: (id: string, title: string, isPinned?: boolean) => void;
  deleteCourse: (id: string) => void;
  addLecture: (courseId: string, lecture: Omit<Lecture, 'isFavorited'> & { isFavorited?: boolean }) => void;
  updateLecture: (courseId: string, lectureId: string, updates: Partial<Lecture>) => void;
  deleteLecture: (courseId: string, lectureId: string) => void;
}

const initialCourseData: CourseData = {
  "Group.26": {
    title: "IID Exercises",
    lectures: [
      { id: "1", title: "SCAMPER", date: "26.03.2025", isFavorited: false, videoId: "CF9jLC2unDk", anchors: [], hasNotification: true },
      { id: "2", title: "Low-Fi", date: "09.04.2025", isFavorited: false, videoId: "ZXWsHqZl0dM", anchors: [], hasNotification: true },
      { id: "3", title: "Mid-Fi", date: "20.05.2025", isFavorited: false, videoId: "uzOrrXnX7VM", anchors: [], hasNotification: true },
      { id: "4", title: "Hi-Fi", date: "12.06.2025", isFavorited: false, videoId: "-hLtZYg1-vE", anchors: [], hasNotification: true },
    ],
    isPinned: true
  },
  "193.127": {
    title: "Interface and Interaction Design",
    lectures: [
      { id: "1", title: "Color Theory", date: "08.05.2025", isFavorited: true, isLive: true, videoId: "dQw4w9WgXcQ", anchors: [], globalAnchors: [{id: "1", title: "Color Theory", timestamp: "00:10:00", timestampSeconds: 10, description: "Ein AVL-Baum ist ein balancierter binärer Suchbaum.", author: "Alice", likes: 5, dislikes: 1}]},
      { id: "2", title: "Guest Lecture", date: "10.04.2025", isFavorited: false, videoId: "", anchors: [] },
      { id: "3", title: "Wireframes", date: "03.04.2025", isFavorited: false, hasNotification: true, videoId: "", anchors: [] },
    ],
    isPinned: true
  },
  "185.A92": {
    title: "Introduction to Programming 2",
    lectures: [
      { id: "1", title: "Object-Oriented Programming", date: "15.05.2025", isFavorited: false, isLive: true, videoId: "", anchors: [] },
      { id: "2", title: "Data Structures", date: "12.05.2025", isFavorited: true, videoId: "", anchors: [] },
      { id: "3", title: "Algorithms", date: "08.05.2025", isFavorited: false, videoId: "", anchors: [] },
    ],
    isPinned: true
  },
  "186.866": {
    title: "Algorithms and Data Structures",
    lectures: [
      { id: "1", title: "Sorting Algorithms", date: "20.05.2025", isFavorited: false, videoId: "", anchors: [] },
      { id: "2", title: "Graph Theory", date: "17.05.2025", isFavorited: true, isLive: true, videoId: "", anchors: [] },
      { id: "3", title: "Dynamic Programming", date: "14.05.2025", isFavorited: false, videoId: "", anchors: [] },
    ],
    isPinned: true
  },
  "104.218": {
    title: "Statistics",
    lectures: [
      { id: "1", title: "Probability Theory", date: "22.05.2025", isFavorited: false, videoId: "", anchors: [] },
      { id: "2", title: "Statistical Inference", date: "19.05.2025", isFavorited: false, videoId: "", anchors: [] },
      { id: "3", title: "Regression Analysis", date: "16.05.2025", isFavorited: false, videoId: "", anchors: [] },
    ],
    isPinned: false
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

  const addCourse = (id: string, title: string, isPinned: boolean = false) => {
    setCourseData(prev => ({
      ...prev,
      [id]: { title, lectures: [], isPinned }
    }));
  };

  const updateCourse = (id: string, title: string, isPinned?: boolean) => {
    setCourseData(prev => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          title: title ?? prev[id].title,
          isPinned: isPinned !== undefined ? isPinned : prev[id].isPinned
        }
      };
    });
  };

  const deleteCourse = (id: string) => {
    setCourseData(prev => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  const addLecture = (courseId: string, lecture: Omit<Lecture, 'isFavorited'> & { isFavorited?: boolean }) => {
    setCourseData(prev => {
      const course = prev[courseId];
      if (!course) return prev;
      return {
        ...prev,
        [courseId]: {
          ...course,
          lectures: [
            ...course.lectures,
            { ...lecture, isFavorited: lecture.isFavorited ?? false, anchors: lecture.anchors ?? [], videoId: lecture.videoId ?? "" }
          ]
        }
      };
    });
  };

  const updateLecture = (courseId: string, lectureId: string, updates: Partial<Lecture>) => {
    setCourseData(prev => {
      const course = prev[courseId];
      if (!course) return prev;
      return {
        ...prev,
        [courseId]: {
          ...course,
          lectures: course.lectures.map(l =>
            l.id === lectureId ? { ...l, ...updates } : l
          )
        }
      };
    });
  };

  const deleteLecture = (courseId: string, lectureId: string) => {
    setCourseData(prev => {
      const course = prev[courseId];
      if (!course) return prev;
      return {
        ...prev,
        [courseId]: {
          ...course,
          lectures: course.lectures.filter(l => l.id !== lectureId)
        }
      };
    });
  };

  return (
    <CourseContext.Provider value={{
      courseData,
      toggleLectureFavorite,
      toggleCoursePin,
      addCourse,
      updateCourse,
      deleteCourse,
      addLecture,
      updateLecture,
      deleteLecture
    }}>
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