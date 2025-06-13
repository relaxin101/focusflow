import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CourseMainScreen } from "./screens/CourseMainScreen";
import { FavoritesScreen } from "./screens/FavoritesScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { LectureOverviewScreen } from "./screens/LectureOverviewScreen";
import { LectureDetailScreen } from "./screens/LectureDetailScreen";

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
  return <RouterProvider router={router} />;
};