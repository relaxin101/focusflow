import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { Link } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import type { GlobalAnchor } from '../../context/CourseContext';
import { NavigationBar } from "../../components/NavigationBar";

// Function to extract YouTube video ID from URL
const extractVideoId = (url: string): string => {
  // Handle youtu.be URLs
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1].split('?')[0];
  }
  // Handle youtube.com URLs
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    return urlParams.get('v') || '';
  }
  // If it's already just an ID, return as is
  return url;
};

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
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [globalAnchorTitle, setGlobalAnchorTitle] = useState("");
  const [globalAnchorTimestamp, setGlobalAnchorTimestamp] = useState("");
  const [globalAnchorDescription, setGlobalAnchorDescription] = useState("");
  const [globalAnchorAuthor, setGlobalAnchorAuthor] = useState("");

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
    const videoId = extractVideoId(newLectureVideoId);
    addLecture(selectedCourseId, {
      id: Date.now().toString(),
      title: newLectureTitle,
      date: newLectureDate,
      videoId: videoId,
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

  // Add handler to add a global anchor
  const handleAddGlobalAnchor = () => {
    if (!selectedCourseId || !selectedLectureId || !globalAnchorTitle.trim() || !globalAnchorTimestamp.trim() || !globalAnchorDescription.trim() || !globalAnchorAuthor.trim()) return;
    const timestampParts = globalAnchorTimestamp.split(":").map(Number);
    let timestampSeconds = 0;
    if (timestampParts.length === 3) {
      timestampSeconds = timestampParts[0] * 3600 + timestampParts[1] * 60 + timestampParts[2];
    } else if (timestampParts.length === 2) {
      timestampSeconds = timestampParts[0] * 60 + timestampParts[1];
    }
    const newGlobalAnchor: GlobalAnchor = {
      id: Date.now().toString(),
      title: globalAnchorTitle,
      timestamp: globalAnchorTimestamp,
      timestampSeconds,
      description: globalAnchorDescription,
      author: globalAnchorAuthor,
      likes: 0,
      dislikes: 0
    };
    // Update the lecture's globalAnchors in context
    updateLecture(selectedCourseId, selectedLectureId, {
      globalAnchors: [
        ...(courseData[selectedCourseId]?.lectures.find(l => l.id === selectedLectureId)?.globalAnchors || []),
        newGlobalAnchor
      ]
    });
    setGlobalAnchorTitle("");
    setGlobalAnchorTimestamp("");
    setGlobalAnchorDescription("");
    setGlobalAnchorAuthor("");
  };

  return (
    <div className="bg-white min-h-screen w-full relative p-4">
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
                placeholder="YouTube Video ID or URL"
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
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => setSelectedLectureId(lecture.id)}>
                      Add Global Anchor
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteLecture(lecture.id)}>
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      {/* Global Anchor Creation UI */}
      {selectedLectureId && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Add Global Anchor</h4>
          <Input
            placeholder="Title"
            value={globalAnchorTitle}
            onChange={e => setGlobalAnchorTitle(e.target.value)}
            className="mb-2"
          />
          <Input
            placeholder="Timestamp (hh:mm:ss or mm:ss)"
            value={globalAnchorTimestamp}
            onChange={e => setGlobalAnchorTimestamp(e.target.value)}
            className="mb-2"
          />
          <textarea
            placeholder="Description"
            value={globalAnchorDescription}
            onChange={e => setGlobalAnchorDescription(e.target.value)}
            className="mb-2 w-full border rounded p-2"
            rows={3}
          />
          <Input
            placeholder="Author"
            value={globalAnchorAuthor}
            onChange={e => setGlobalAnchorAuthor(e.target.value)}
            className="mb-2"
          />
          <Button onClick={handleAddGlobalAnchor}>Add Global Anchor</Button>
        </div>
      )}
      <NavigationBar />
    </div>
  );
}; 