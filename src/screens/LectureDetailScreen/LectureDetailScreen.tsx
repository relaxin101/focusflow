import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon, StarIcon, HomeIcon, UserIcon, PlayIcon, Trash2Icon, PenIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { NavigationBar } from "../../components/NavigationBar";
import ReactMarkdown from 'react-markdown';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

interface Anchor {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  timestampSeconds: number;
}

interface AnchorChange {
  type: 'added' | 'updated' | 'deleted';
  anchor: Anchor;
  timestamp: number;
}

interface NewAnchor {
  title: string;
  hours: string;
  minutes: string;
  seconds: string;
  description: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const LectureDetailScreen = (): JSX.Element => {
  const { courseId, lectureId } = useParams<{ courseId: string; lectureId: string }>();
  const playerRef = useRef<any>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [anchorChanges, setAnchorChanges] = useState<AnchorChange[]>([]);
  
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnchor, setEditedAnchor] = useState<{ title: string; description: string }>({
    title: "",
    description: ""
  });

  // Initialize YouTube Player API
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: lecture?.videoId,
        height: '200',
        width: '100%',
        playerVars: {
          'playsinline': 1,
          'controls': 1
        },
        events: {
          'onReady': () => {
            setIsPlayerReady(true);
            setDuration(playerRef.current.getDuration());
          },
          'onStateChange': (event: any) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          }
        }
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [lecture?.videoId]);

  // Update current time and handle anchor scrolling
  useEffect(() => {
    if (!isPlayerReady || !isPlaying) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);

        // Find the current anchor
        const currentAnchor = anchors.find(anchor => 
          anchor.timestampSeconds <= time && 
          (anchors[anchors.indexOf(anchor) + 1]?.timestampSeconds > time || !anchors[anchors.indexOf(anchor) + 1])
        );

        // Scroll to the current anchor
        if (currentAnchor && timelineRef.current) {
          const anchorElement = document.getElementById(`anchor-${currentAnchor.id}`);
          if (anchorElement) {
            const containerRect = timelineRef.current.getBoundingClientRect();
            const anchorRect = anchorElement.getBoundingClientRect();
            
            if (anchorRect.top < containerRect.top || anchorRect.bottom > containerRect.bottom) {
              anchorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlayerReady, isPlaying, anchors]);

  // Function to get current video time
  const getCurrentVideoTime = () => {
    if (!playerRef.current || !isPlayerReady) return null;
    const currentTime = playerRef.current.getCurrentTime();
    return Math.floor(currentTime);
  };

  // Function to format seconds into hours, minutes, seconds
  const formatTimeFromSeconds = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: hours.toString(),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  // Convert time to seconds for sorting
  const timeToSeconds = (hours: number, minutes: number, seconds: number): number => {
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Format seconds to timestamp string
  const formatTimestamp = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (duration < 3600) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle adding new anchor
  const handleAddAnchor = () => {
    const currentTime = getCurrentVideoTime();
    if (currentTime !== null) {
      const { hours, minutes, seconds } = formatTimeFromSeconds(currentTime);
      setNewAnchor(prev => ({
        ...prev,
        hours,
        minutes,
        seconds
      }));
    }
    setIsAddDialogOpen(true);
  };

  // Handle saving the new anchor
  const handleSaveAnchor = () => {
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
    
    // Record the change
    setAnchorChanges(prev => [...prev, {
      type: 'added',
      anchor,
      timestamp: Date.now()
    }]);
    
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

  // Add this new function to handle editing
  const handleEditAnchor = () => {
    if (selectedAnchor) {
      const updatedAnchor = {
        ...selectedAnchor,
        title: editedAnchor.title,
        description: editedAnchor.description
      };

      setAnchors(prevAnchors =>
        prevAnchors.map(anchor =>
          anchor.id === selectedAnchor.id ? updatedAnchor : anchor
        )
      );

      // Record the change
      setAnchorChanges(prev => [...prev, {
        type: 'updated',
        anchor: updatedAnchor,
        timestamp: Date.now()
      }]);

      setIsEditing(false);
      setSelectedAnchor(null);
    }
  };

  // Add this new function to handle deletion
  const handleDeleteAnchor = () => {
    if (selectedAnchor) {
      setAnchors(prevAnchors => prevAnchors.filter(anchor => anchor.id !== selectedAnchor.id));
      
      // Record the change
      setAnchorChanges(prev => [...prev, {
        type: 'deleted',
        anchor: selectedAnchor,
        timestamp: Date.now()
      }]);

      setSelectedAnchor(null);
    }
  };

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
      {/* YouTube Video */}
      <div className="w-full h-[200px] bg-black">
        <div id="youtube-player"></div>
      </div>

      {/* Title */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-medium text-black">
          {lecture.title} / {lecture.date}
        </h1>
      </div>

      {/* Timeline & Controls */}
      <div className="w-full h-[calc(100vh-300px)] flex flex-col bg-[#8bb3e0]">
        {/* Toggles */}
        <div className="flex flex-row items-center justify-between px-4 pt-2 pb-2">
          <div className="flex items-center gap-3">
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
          {/* Add Anchor Button */}
          {!showGlobalAnchors && (
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-black bg-transparent hover:bg-white/10 transition"
              onClick={handleAddAnchor}
            >
              <PlusIcon className="w-4 h-4 text-black" />
            </button>
          )}
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="flex-1 overflow-y-auto px-6 pb-6 relative">
          {/* Progress bar */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-300 rounded-full z-0" style={{marginLeft: '-2px'}}>
            <div 
              className="absolute top-0 left-0 w-full bg-blue-600 rounded-full transition-all duration-1000"
              style={{ 
                height: `${(currentTime / duration) * 100}%`,
                transition: 'height 1s linear'
              }}
            />
          </div>

          <div className="relative z-10" style={{ height: '100%' }}>
            {(() => {
              // Group anchors by their position (with a small threshold for overlap)
              const groupedAnchors = timelineAnchors.reduce((groups, anchor) => {
                const position = (anchor.timestampSeconds / duration) * 100;
                const existingGroup = groups.find(group => 
                  Math.abs(group.position - position) < 5 // 5% threshold for overlap
                );
                
                if (existingGroup) {
                  existingGroup.anchors.push({ ...anchor, position });
                } else {
                  groups.push({ position, anchors: [{ ...anchor, position }] });
                }
                return groups;
              }, [] as { position: number; anchors: (Anchor & { position: number })[] }[]);

              return groupedAnchors.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="absolute left-0 right-0"
                  style={{
                    top: `${group.position}%`,
                    transform: 'translateY(-50%)'
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Timeline node */}
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        showGlobalAnchors ? 'border-blue-700 bg-white' : 'border-blue-400 bg-white'
                      } group-hover:bg-blue-100 transition ${
                        currentTime >= group.anchors[0].timestampSeconds ? 'border-blue-600' : ''
                      }`}>
                        <span className="text-[10px] font-bold text-blue-700">
                          {group.anchors.length > 1 ? group.anchors.length : group.anchors[0].title[0]}
                        </span>
                      </div>
                    </div>
                    {/* Anchor cards */}
                    <div className="flex gap-2 overflow-x-auto">
                      {group.anchors.map((anchor) => (
                        <div
                          key={anchor.id}
                          className={`flex-shrink-0 bg-white rounded-lg px-3 py-1.5 shadow-sm border border-blue-100 hover:bg-blue-50 transition cursor-pointer ${
                            currentTime >= anchor.timestampSeconds ? 'border-blue-400' : ''
                          }`}
                          onClick={() => {
                            setSelectedAnchor(anchor);
                          }}
                        >
                          <div className="flex items-center">
                            <span className="font-medium text-sm text-blue-900 truncate max-w-[150px]">
                              {anchor.title}
                            </span>
                            {group.anchors.length === 1 && (
                              <span className="text-xs text-blue-600 font-mono whitespace-nowrap ml-2">
                                {anchor.timestamp}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ));
            })()}
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
                  {duration >= 3600 && (
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
                  )}
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
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit">
                    <Textarea
                      id="description"
                      value={newAnchor.description}
                      onChange={(e) => setNewAnchor(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Write your markdown here..."
                      rows={4}
                      className="font-mono"
                    />
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="prose prose-sm max-w-none p-4 border rounded-md min-h-[100px]">
                      <ReactMarkdown>{newAnchor.description}</ReactMarkdown>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveAnchor}
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
              onClick={() => {
                setSelectedAnchor(null);
                setIsEditing(false);
              }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.seekTo(selectedAnchor.timestampSeconds);
                    playerRef.current.playVideo();
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <PlayIcon className="w-5 h-5 text-blue-600" />
              </button>
              <span className="text-base font-semibold text-blue-600">{selectedAnchor.timestamp}</span>
              {!isEditing && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setEditedAnchor({
                      title: selectedAnchor.title,
                      description: selectedAnchor.description
                    });
                  }}
                  className="ml-2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <PenIcon className="w-4 h-4 text-blue-600" />
                </button>
              )}
            </div>
            {isEditing ? (
              <>
                <Input
                  value={editedAnchor.title}
                  onChange={(e) => setEditedAnchor(prev => ({ ...prev, title: e.target.value }))}
                  className="mb-2"
                />
                <Tabs defaultValue="edit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="edit">
                    <Textarea
                      value={editedAnchor.description}
                      onChange={(e) => setEditedAnchor(prev => ({ ...prev, description: e.target.value }))}
                      className="mb-4 font-mono"
                      rows={6}
                      placeholder="Write your markdown here..."
                    />
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="prose prose-sm max-w-none p-4 border rounded-md min-h-[150px]">
                      <ReactMarkdown>{editedAnchor.description}</ReactMarkdown>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleEditAnchor}>
                    Save Changes
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2 text-black">{selectedAnchor.title}</h2>
                <div className="prose prose-sm max-w-none mb-4">
                  <ReactMarkdown>{selectedAnchor.description}</ReactMarkdown>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAnchor}
                    className="flex items-center gap-2"
                  >
                    <Trash2Icon className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <NavigationBar />
    </div>
  );
};