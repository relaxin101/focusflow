import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { Link } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";

export const AdminScreen = () => {
  const {
    courseData,
    addCourse,
    updateCourse,
    deleteCourse,
    addLecture,
    updateLecture,
    deleteLecture
  } = useCourse();

  const [newCourseId, setNewCourseId] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [newLectureDate, setNewLectureDate] = useState("");
  const [newLectureVideoId, setNewLectureVideoId] = useState("");

  // Add a new course
  const handleAddCourse = () => {
    if (!newCourseId.trim() || !newCourseTitle.trim()) return;
    addCourse(newCourseId, newCourseTitle);
    setNewCourseId("");
    setNewCourseTitle("");
  };

  // Delete a course
  const handleDeleteCourse = (id: string) => {
    deleteCourse(id);
    if (selectedCourseId === id) setSelectedCourseId(null);
  };

  // Add a lecture to selected course
  const handleAddLecture = () => {
    if (!selectedCourseId || !newLectureTitle.trim() || !newLectureDate.trim() || !newLectureVideoId.trim()) return;
    addLecture(selectedCourseId, {
      id: Date.now().toString(),
      title: newLectureTitle,
      date: newLectureDate,
      videoId: newLectureVideoId,
      anchors: []
    });
    setNewLectureTitle("");
    setNewLectureDate("");
    setNewLectureVideoId("");
  };

  // Delete a lecture from selected course
  const handleDeleteLecture = (lectureId: string) => {
    if (!selectedCourseId) return;
    deleteLecture(selectedCourseId, lectureId);
  };

  return (
    <div className="bg-white min-h-screen max-w-[393px] mx-auto relative p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <Link to="/profile">
          <Button variant="ghost">Back to Profile</Button>
        </Link>
      </div>
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2">Create Course</h2>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Course ID"
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
            />
            <Input
              placeholder="Course Title"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
            />
            <Button onClick={handleAddCourse}>Add</Button>
          </div>
          <Separator />
          <h3 className="mt-4 mb-2 font-medium">Courses</h3>
          <ul>
            {Object.entries(courseData).map(([id, course]) => (
              <li key={id} className="flex items-center justify-between mb-2">
                <span
                  className={`cursor-pointer ${selectedCourseId === id ? "font-bold" : ""}`}
                  onClick={() => setSelectedCourseId(id)}
                >
                  {id} - {course.title}
                </span>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(id)}>
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      {selectedCourseId && courseData[selectedCourseId] && (
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Manage Lectures</h2>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Lecture Title"
                value={newLectureTitle}
                onChange={(e) => setNewLectureTitle(e.target.value)}
              />
              <Input
                placeholder="Date"
                value={newLectureDate}
                onChange={(e) => setNewLectureDate(e.target.value)}
                type="date"
              />
              <Input
                placeholder="YouTube Video ID"
                value={newLectureVideoId}
                onChange={(e) => setNewLectureVideoId(e.target.value)}
              />
              <Button onClick={handleAddLecture}>Add</Button>
            </div>
            <Separator />
            <h3 className="mt-4 mb-2 font-medium">Lectures</h3>
            <ul>
              {courseData[selectedCourseId].lectures.map((lecture) => (
                <li key={lecture.id} className="flex items-center justify-between mb-2">
                  <span>{lecture.title} ({lecture.date})</span>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteLecture(lecture.id)}>
                    Delete
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 