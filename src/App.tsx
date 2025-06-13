import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CourseMainScreen } from "./screens/CourseMainScreen/CourseMainScreen";
import { LectureOverviewScreen } from "./screens/LectureOverviewScreen/LectureOverviewScreen";
import { LectureDetailScreen } from "./screens/LectureDetailScreen/LectureDetailScreen";
import { FavoritesScreen } from "./screens/FavoritesScreen/FavoritesScreen";
import { ProfileScreen } from "./screens/ProfileScreen/ProfileScreen";
import { CourseProvider } from "./context/CourseContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CourseMainScreen />,
  },
  {
    path: "/favorites",
    element: <FavoritesScreen />,
  },
  {
    path: "/profile",
    element: <ProfileScreen />,
  },
  {
    path: "/course/:courseId",
    element: <LectureOverviewScreen />,
  },
  {
    path: "/course/:courseId/lecture/:lectureId",
    element: <LectureDetailScreen />,
  },
]);

export const App = () => {
  return (
    <CourseProvider>
      <RouterProvider router={router} />
    </CourseProvider>
  );
};