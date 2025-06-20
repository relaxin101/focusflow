import React, { useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Separator } from "../../components/ui/separator";
import { Link } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import type { GlobalAnchor } from '../../context/CourseContext';
import { NavigationBar } from "../../components/NavigationBar";
import { useDarkMode } from "../../context/DarkModeContext";

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
  const { isDarkMode } = useDarkMode();

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

  const handleDumpContext = () => {
    const dataStr = JSON.stringify(courseData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'course-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
    <div className={`min-h-screen w-full relative p-4 transition-colors duration-200 ${
      isDarkMode ? 'bg-[#36393f]' : 'bg-white'
    }`}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className={`text-2xl font-bold transition-colors duration-200 ${
          isDarkMode ? 'text-white' : 'text-black'
        }`}>Admin Panel</h1>
        <div>
          <Button onClick={handleDumpContext} className="mr-2">Dump Context</Button>
          <Link to="/profile">
            <Button variant="ghost">Back to Profile</Button>
          </Link>
        </div>
      </div>
      <Card className={`mb-6 transition-colors duration-200 ${
        isDarkMode ? 'border-[#4f545c] bg-[#2f3136]' : 'border-gray-200 bg-white'
      }`}>
        <CardContent className="p-4">
          <h2 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>Create Course</h2>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Course ID"
              value={newCourseId}
              onChange={(e) => setNewCourseId(e.target.value)}
              className={isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white placeholder:text-gray-400' : ''}
            />
            <Input
              placeholder="Course Title"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              className={isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white placeholder:text-gray-400' : ''}
            />
            <Button onClick={handleAddCourse}>Add</Button>
          </div>
          <Separator className={isDarkMode ? 'bg-[#4f545c]' : 'bg-gray-200'} />
          <h3 className={`mt-4 mb-2 font-medium transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>Courses</h3>
          <ul>
            {Object.entries(courseData).map(([id, course]) => (
              <li key={id} className="flex items-center justify-between mb-2">
                <span
                  className={`cursor-pointer transition-colors duration-200 ${
                    selectedCourseId === id ? "font-bold" : ""
                  } ${isDarkMode ? 'text-white' : 'text-black'}`}
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
        <Card className={`transition-colors duration-200 ${
          isDarkMode ? 'border-[#4f545c] bg-[#2f3136]' : 'border-gray-200 bg-white'
        }`}>
          <CardContent className="p-4">
            <h2 className={`text-lg font-semibold mb-2 transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>Manage Lectures</h2>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Lecture Title"
                value={newLectureTitle}
                onChange={(e) => setNewLectureTitle(e.target.value)}
                className={isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white placeholder:text-gray-400' : ''}
              />
              <Input
                placeholder="Date"
                value={newLectureDate}
                onChange={(e) => setNewLectureDate(e.target.value)}
                type="date"
                className={isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white placeholder:text-gray-400' : ''}
              />
              <Input
                placeholder="YouTube Video ID or URL"
                value={newLectureVideoId}
                onChange={(e) => setNewLectureVideoId(e.target.value)}
                className={isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white placeholder:text-gray-400' : ''}
              />
              <Button onClick={handleAddLecture}>Add</Button>
            </div>
            <Separator className={isDarkMode ? 'bg-[#4f545c]' : 'bg-gray-200'} />
            <h3 className={`mt-4 mb-2 font-medium transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>Lectures</h3>
            <ul>
              {courseData[selectedCourseId].lectures
                .sort((a, b) => {
                  const [dayA, monthA, yearA] = a.date.split('.').map(Number);
                  const [dayB, monthB, yearB] = b.date.split('.').map(Number);
                  const dateA = new Date(yearA, monthA - 1, dayA);
                  const dateB = new Date(yearB, monthB - 1, dayB);
                  return dateB.getTime() - dateA.getTime();
                })
                .map((lecture) => (
                <li key={lecture.id} className="flex items-center justify-between mb-2">
                  <span className={`transition-colors duration-200 ${
                    isDarkMode ? 'text-white' : 'text-black'
                  }`}>{lecture.title} ({lecture.date})</span>
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
        <div className={`mt-4 p-4 border rounded transition-colors duration-200 ${
          isDarkMode ? 'border-[#4f545c] bg-[#2f3136]' : 'border-gray-200 bg-gray-50'
        }`}>
          <h4 className={`font-semibold mb-2 transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>Add Global Anchor</h4>
          <Input
            placeholder="Title"
            value={globalAnchorTitle}
            onChange={e => setGlobalAnchorTitle(e.target.value)}
            className={`mb-2 ${isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white placeholder:text-gray-400' : ''}`}
          />
          <Input
            placeholder="Timestamp (hh:mm:ss or mm:ss)"
            value={globalAnchorTimestamp}
            onChange={e => setGlobalAnchorTimestamp(e.target.value)}
            className={`mb-2 ${isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white placeholder:text-gray-400' : ''}`}
          />
          <textarea
            placeholder="Description"
            value={globalAnchorDescription}
            onChange={e => setGlobalAnchorDescription(e.target.value)}
            className={`mb-2 w-full border rounded p-2 transition-colors duration-200 ${
              isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white placeholder:text-gray-400' : ''
            }`}
            rows={3}
          />
          <Input
            placeholder="Author"
            value={globalAnchorAuthor}
            onChange={e => setGlobalAnchorAuthor(e.target.value)}
            className={`mb-2 ${isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white placeholder:text-gray-400' : ''}`}
          />
          <Button onClick={handleAddGlobalAnchor}>Add Global Anchor</Button>
        </div>
      )}
      <NavigationBar />
    </div>
  );
}; 