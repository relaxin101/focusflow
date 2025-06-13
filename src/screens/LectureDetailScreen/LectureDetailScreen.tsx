import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon, StarIcon, HomeIcon, UserIcon, PlayIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

interface Anchor {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  timestampSeconds: number;
}

interface NewAnchor {
  title: string;
  hours: string;
  minutes: string;
  seconds: string;
  description: string;
}

export const LectureDetailScreen = (): JSX.Element => {
  const { courseId, lectureId } = useParams<{ courseId: string; lectureId: string }>();
  
  // Explicitly type lectureData for string indexing
  const lectureData: Record<string, Record<string, {
    title: string;
    date: string;
    videoId: string;
    anchors: Anchor[];
  }>> = {
    "193.127": {
      "1": {
        title: "Color Theory",
        date: "08.05.2025",
        videoId: "dQw4w9WgXcQ",
        anchors: [
          {
            id: "1",
            title: "Iteration Info",
            timestamp: "00:05:30",
            timestampSeconds: 330,
            description: "Iteration is the repetition of a process or set of instructions in computer programming. Each repetition of the process is a single iteration, and the outcome of each iteration is then the starting point of the next iteration."
          },
          {
            id: "2", 
            title: "Automation",
            timestamp: "00:12:45",
            timestampSeconds: 765,
            description: "Automation refers to the use of technology to perform tasks without human intervention."
          },
          {
            id: "3",
            title: "Human vs Machine",
            timestamp: "00:18:20",
            timestampSeconds: 1100,
            description: "Comparison between human capabilities and machine efficiency in various tasks."
          }
        ]
      }
    }
  };

  // Mock global anchors
  const globalAnchors: Anchor[] = [
    {
      id: "g1",
      title: "AVL-Baum",
      timestamp: "00:10:00",
      timestampSeconds: 600,
      description: "Ein AVL-Baum ist ein balancierter binärer Suchbaum."
    },
    {
      id: "g2",
      title: "Arten von Ausnahmen",
      timestamp: "00:20:00",
      timestampSeconds: 1200,
      description: "Unterschiedliche Arten von Ausnahmen in der Programmierung."
    },
    {
      id: "g3",
      title: "Hash-Tabelle",
      timestamp: "00:30:00",
      timestampSeconds: 1800,
      description: "Eine Hash-Tabelle ist eine Datenstruktur, die Schlüssel-Wert-Paare speichert."
    }
  ];

  const lecture = lectureData[courseId as string]?.[lectureId as string];
  
  const [anchors, setAnchors] = useState<Anchor[]>(lecture?.anchors || []);
  const [selectedAnchor, setSelectedAnchor] = useState<Anchor | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAnchor, setNewAnchor] = useState<NewAnchor>({
    title: "",
    hours: "0",
    minutes: "0", 
    seconds: "0",
    description: ""
  });
  const [showGlobalAnchors, setShowGlobalAnchors] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Convert time to seconds for sorting
  const timeToSeconds = (hours: number, minutes: number, seconds: number): number => {
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Format seconds to timestamp string
  const formatTimestamp = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle adding new anchor
  const handleAddAnchor = () => {
    const hours = parseInt(newAnchor.hours) || 0;
    const minutes = parseInt(newAnchor.minutes) || 0;
    const seconds = parseInt(newAnchor.seconds) || 0;
    const timestampSeconds = timeToSeconds(hours, minutes, seconds);
    
    const anchor: Anchor = {
      id: Date.now().toString(),
      title: newAnchor.title,
      timestamp: formatTimestamp(timestampSeconds),
      timestampSeconds,
      description: newAnchor.description
    };

    // Add and sort anchors by timestamp
    const updatedAnchors = [...anchors, anchor].sort((a, b) => a.timestampSeconds - b.timestampSeconds);
    setAnchors(updatedAnchors);
    
    // Reset form
    setNewAnchor({
      title: "",
      hours: "0",
      minutes: "0",
      seconds: "0", 
      description: ""
    });
    setIsAddDialogOpen(false);
  };

  // Handle toggles
  const handleGlobalAnchorsToggle = () => setShowGlobalAnchors((prev) => !prev);
  const handleTranscriptToggle = () => setShowTranscript((prev) => !prev);

  if (!lecture) {
    return (
      <div className="bg-white min-h-screen max-w-[393px] mx-auto relative">
        <div className="flex items-center justify-center h-screen">
          <p>Lecture not found</p>
        </div>
      </div>
    );
  }

  // Timeline anchors to show
  const timelineAnchors = showGlobalAnchors ? globalAnchors : anchors;

  return (
    <div className="bg-[#8bb3e0] min-h-screen max-w-[393px] mx-auto relative">
      {/* Header */}
      <header className="fixed w-full max-w-[393px] h-[50px] top-0 left-1/2 -translate-x-1/2 bg-[#5586c94c] z-10">
        <div className="flex items-center justify-between px-4 h-full">
          <div className="flex items-center">
            <Link to={`/course/${courseId}`} className="mr-3">
              <ArrowLeftIcon className="w-5 h-5 text-black" />
            </Link>
            <h1 className="text-sm font-medium text-black">
              {lecture.title} / {lecture.date}
            </h1>
          </div>
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#dbeafe] rounded-xl flex items-center justify-center border-2 border-white">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#222" strokeWidth="1.5"/><rect x="7" y="9" width="2" height="6" rx="1" fill="#222"/><rect x="11" y="9" width="2" height="6" rx="1" fill="#222"/><rect x="15" y="9" width="2" height="6" rx="1" fill="#222"/></svg>
            </div>
          </div>
        </div>
      </header>

      {/* YouTube Video */}
      <div className="w-full h-[200px] bg-black">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${lecture.videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Timeline & Controls */}
      <div className="w-full h-[calc(100vh-250px)] flex flex-col bg-[#8bb3e0]">
        {/* Toggles */}
        <div className="flex flex-row items-center px-4 pt-4 pb-2 gap-3">
          {/* Global Anchors Toggle */}
          <button
            className={`flex items-center px-2 py-1 rounded-full border ${showGlobalAnchors ? 'bg-white border-blue-500' : 'bg-[#8bb3e0] border-gray-400'} transition`}
            onClick={handleGlobalAnchorsToggle}
          >
            <span className="mr-2 inline-block w-5 h-5 text-blue-700">🌐</span>
            <span className="text-sm font-medium text-black">global anchors</span>
            <span className={`ml-2 w-5 h-5 rounded-full border-2 ${showGlobalAnchors ? 'bg-blue-500 border-blue-500' : 'bg-gray-200 border-gray-400'}`}></span>
          </button>
          {/* Transcript Toggle */}
          <button
            className={`flex items-center px-2 py-1 rounded-full border ${showTranscript ? 'bg-white border-blue-500' : 'bg-[#8bb3e0] border-gray-400'} transition`}
            onClick={handleTranscriptToggle}
          >
            <span className="mr-2 inline-block w-5 h-5 text-blue-700">📝</span>
            <span className="text-sm font-medium text-black">transcript</span>
          </button>
        </div>

        {/* Add Anchor Button (only if not global) */}
        {!showGlobalAnchors && (
          <div className="px-4 pb-2">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center border border-dashed border-blue-400 bg-white text-blue-700 hover:bg-blue-50"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Anchor
            </Button>
          </div>
        )}

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 relative">
          {/* Timeline vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-300 rounded-full z-0" style={{marginLeft: '-2px'}}></div>
          <div className="flex flex-col gap-8 relative z-10">
            {timelineAnchors.map((anchor, idx) => (
              <div key={anchor.id} className="flex items-center gap-4 cursor-pointer group" onClick={() => setSelectedAnchor(anchor)}>
                {/* Timeline node */}
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-4 ${showGlobalAnchors ? 'border-blue-700 bg-white' : 'border-blue-400 bg-white'} group-hover:bg-blue-100 transition`}>
                    <span className="text-xs font-bold text-blue-700">{anchor.title[0]}</span>
                  </div>
                  {idx !== timelineAnchors.length - 1 && (
                    <div className="w-1 flex-1 bg-blue-300" style={{minHeight: '24px'}}></div>
                  )}
                </div>
                {/* Anchor info */}
                <div className="flex-1 bg-white rounded-lg px-4 py-2 shadow-sm border border-blue-100 group-hover:bg-blue-50 transition">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-blue-900">{anchor.title}</span>
                    <span className="text-xs text-blue-600 font-mono">{anchor.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Anchor Dialog */}
      {!showGlobalAnchors && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="w-[350px]">
            <DialogHeader>
              <DialogTitle>Add New Anchor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAnchor.title}
                  onChange={(e) => setNewAnchor(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter anchor title"
                />
              </div>
              <div>
                <Label>Timestamp</Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="hours" className="text-xs">Hours</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="0"
                      value={newAnchor.hours}
                      onChange={(e) => setNewAnchor(prev => ({ ...prev, hours: e.target.value }))}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="minutes" className="text-xs">Minutes</Label>
                    <Input
                      id="minutes"
                      type="number"
                      min="0"
                      max="59"
                      value={newAnchor.minutes}
                      onChange={(e) => setNewAnchor(prev => ({ ...prev, minutes: e.target.value }))}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="seconds" className="text-xs">Seconds</Label>
                    <Input
                      id="seconds"
                      type="number"
                      min="0"
                      max="59"
                      value={newAnchor.seconds}
                      onChange={(e) => setNewAnchor(prev => ({ ...prev, seconds: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAnchor.description}
                  onChange={(e) => setNewAnchor(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter anchor description"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddAnchor}
                  disabled={!newAnchor.title.trim() || !newAnchor.description.trim()}
                >
                  Add Anchor
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Anchor Details Modal Overlay */}
      {selectedAnchor && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-[90vw] max-w-md p-6 relative flex flex-col">
            <button
              className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-black"
              onClick={() => setSelectedAnchor(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex items-center space-x-2 mb-4">
              <PlayIcon className="w-5 h-5 text-blue-600" />
              <span className="text-base font-semibold text-blue-600">{selectedAnchor.timestamp}</span>
            </div>
            <h2 className="text-xl font-bold mb-2 text-black">{selectedAnchor.title}</h2>
            <p className="text-gray-700 mb-4">{selectedAnchor.description}</p>
            <Button onClick={() => setSelectedAnchor(null)} className="self-end mt-2">Back</Button>
          </div>
        </div>
      )}

      {/* Navigation bar */}
      <nav className="fixed w-full max-w-[393px] h-[60px] bottom-0 left-1/2 -translate-x-1/2 bg-[#5586c94c] border-2 border-solid border-[#000000cc] flex justify-around items-center z-20">
        <Link
          className="w-20 h-10 bg-white rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center"
          to="/favorites"
        >
          <StarIcon className="w-[31px] h-[31px]" />
        </Link>

        <Link
          className="w-20 h-10 bg-white rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center"
          to="/"
        >
          <HomeIcon className="w-[30px] h-[30px]" />
        </Link>

        <Link
          className="w-20 h-10 bg-white rounded-[20px] border-2 border-solid border-[#000000cc] flex items-center justify-center"
          to="/profile"
        >
          <UserIcon className="w-[30px] h-[30px]" />
        </Link>
      </nav>
    </div>
  );
};