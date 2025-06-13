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
  
  // Mock lecture data
  const lectureData = {
    "193.127": {
      "1": {
        title: "Color Theory",
        date: "08.05.2025",
        videoId: "dQw4w9WgXcQ", // Example YouTube video ID
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

  const lecture = lectureData[courseId]?.[lectureId];
  
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

  if (!lecture) {
    return (
      <div className="bg-white flex flex-row justify-center w-full">
        <div className="bg-white overflow-hidden border border-solid border-black w-[393px] h-[852px] relative flex items-center justify-center">
          <p>Lecture not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden border border-solid border-black w-[393px] h-[852px] relative">
        {/* Header */}
        <header className="absolute w-[393px] h-[50px] top-0 left-0 bg-[#5586c94c]">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center">
              <Link to={`/course/${courseId}`} className="mr-3">
                <ArrowLeftIcon className="w-5 h-5 text-black" />
              </Link>
              <h1 className="text-sm font-medium text-black">
                IID: {lecture.title}
              </h1>
            </div>
            
            {/* Add anchor button */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-8 h-8 p-0 flex items-center justify-center"
                >
                  <PlusIcon className="w-5 h-5 text-black" />
                </Button>
              </DialogTrigger>
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
          </div>
        </header>

        {/* YouTube Video */}
        <div className="absolute top-[50px] left-0 w-full h-[200px] bg-black">
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

        {/* Content Area */}
        <div className="absolute top-[250px] left-0 w-full h-[542px] flex">
          {/* Anchor List */}
          <div className={`${selectedAnchor ? 'w-1/2' : 'w-full'} h-full overflow-y-auto border-r border-gray-200`}>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-black">IID: Color Theory</h3>
              <div className="space-y-2">
                {anchors.map((anchor) => (
                  <Card 
                    key={anchor.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedAnchor?.id === anchor.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAnchor(anchor)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{anchor.timestamp.split(':')[1]}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-black">{anchor.title}</h4>
                          <p className="text-xs text-gray-500">{anchor.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Anchor Details */}
          {selectedAnchor && (
            <div className="w-1/2 h-full overflow-y-auto bg-blue-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-black">
                    IID: Color Theory - {selectedAnchor.title}
                  </h3>
                  <Button
                    variant="ghost"
                    className="w-6 h-6 p-0"
                    onClick={() => setSelectedAnchor(null)}
                  >
                    ×
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <PlayIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">{selectedAnchor.timestamp}</span>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-black mb-2">{selectedAnchor.title}</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedAnchor.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation bar */}
        <nav className="absolute w-[393px] h-[60px] bottom-0 left-0 bg-[#5586c94c] border-2 border-solid border-[#000000cc] flex justify-around items-center">
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
    </div>
  );
};