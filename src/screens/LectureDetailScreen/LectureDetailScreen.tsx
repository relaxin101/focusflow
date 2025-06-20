import React, { useState, useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon, PlusIcon, StarIcon, HomeIcon, UserIcon, PlayIcon, Trash2Icon, PenIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { NavigationBar } from "../../components/NavigationBar";
import ReactMarkdown from 'react-markdown';
import { useCourse } from "../../context/CourseContext";
import { useDarkMode } from "../../context/DarkModeContext";
import type { GlobalAnchor } from '../../context/CourseContext';

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
  const { courseData, updateLecture } = useCourse();
  const { isDarkMode } = useDarkMode();
  const playerRef = useRef<any>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [anchorChanges, setAnchorChanges] = useState<AnchorChange[]>([]);
  
  const lecture = courseData[courseId as string]?.lectures.find(l => l.id === lectureId);
  
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
  const [selectedGlobalAnchor, setSelectedGlobalAnchor] = useState<GlobalAnchor | null>(null);
  const [publishAsGlobal, setPublishAsGlobal] = useState(false);
  const [showNextLectureDialog, setShowNextLectureDialog] = useState(false);
  const [isMarkdownPreview, setIsMarkdownPreview] = useState(false);

  // Use globalAnchors from the lecture object if present, otherwise fallback to []
  const globalAnchors = lecture?.globalAnchors || [];

  // Set hasNotification to false when lecture is visited
  useEffect(() => {
    if (lecture && lecture.hasNotification && courseId && lectureId) {
      updateLecture(courseId, lectureId, { hasNotification: false });
    }
  }, [lecture, courseId, lectureId, updateLecture]);

  // Helper function to find the next lecture
  const getNextLecture = () => {
    if (!courseId || !lectureId || !courseData[courseId]) return null;
    
    const course = courseData[courseId];
    const currentIndex = course.lectures.findIndex(l => l.id === lectureId);
    
    if (currentIndex === -1 || currentIndex === course.lectures.length - 1) {
      return null; // No next lecture
    }
    
    return course.lectures[currentIndex + 1];
  };

  const nextLecture = getNextLecture();

  // Initialize YouTube Player API
  useEffect(() => {
    let scriptTag: HTMLScriptElement | null = null;
    let currentTime = 0;
    let isPlaying = false;
    let isInitializing = false;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Store current state when tab becomes hidden
        if (playerRef.current) {
          currentTime = playerRef.current.getCurrentTime();
          isPlaying = playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING;
        }
      } else {
        // Restore state when tab becomes visible
        if (playerRef.current) {
          playerRef.current.seekTo(currentTime);
          if (isPlaying) {
            playerRef.current.playVideo();
          }
        }
      }
    };

    const initializePlayer = () => {
      if (isInitializing) return;
      isInitializing = true;

      // Reset player state
      setIsPlayerReady(false);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);

      // Destroy existing player first
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying existing player:', error);
        }
        playerRef.current = null;
      }

      // Clear the player container
      const playerContainer = document.getElementById(`youtube-player-${lecture?.id || 'default'}`);
      if (playerContainer) {
        playerContainer.innerHTML = '';
      }

      // Create new player
      if (window.YT && window.YT.Player && lecture?.videoId) {
        try {
          playerRef.current = new window.YT.Player(`youtube-player-${lecture.id}`, {
            videoId: lecture.videoId,
            height: '100%',
            width: '100%',
            playerVars: {
              'playsinline': 1,
              'controls': 1,
              'cc_load_policy': 1,
              'cc_lang_pref': 'en',
              'enablejsapi': 1,
              'origin': window.location.origin
            },
            events: {
              'onReady': () => {
                setIsPlayerReady(true);
                isInitializing = false;
                if (playerRef.current) {
                  setDuration(playerRef.current.getDuration());
                }
              },
              'onStateChange': (event: any) => {
                setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
                // Check if video has ended
                if (event.data === window.YT.PlayerState.ENDED) {
                  setShowNextLectureDialog(true);
                }
              },
              'onError': (event: any) => {
                console.error('YouTube player error:', event.data);
                isInitializing = false;
                // Don't retry on error to avoid infinite loops
                setIsPlayerReady(false);
              }
            }
          });
        } catch (error) {
          console.error('Error creating YouTube player:', error);
          isInitializing = false;
          setIsPlayerReady(false);
        }
      } else {
        isInitializing = false;
      }
    };

    const loadYouTubeAPI = () => {
      // Check if API is already loaded
      if (window.YT && window.YT.Player) {
        initializePlayer();
        return;
      }

      // Check if script is already loading
      if (document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        // Script is already loading, wait for it
        const originalOnReady = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
          if (originalOnReady) originalOnReady();
          initializePlayer();
        };
        return;
      }

      // Load the YouTube API script
      scriptTag = document.createElement('script');
      scriptTag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(scriptTag, firstScriptTag);

      // Set up the callback
      window.onYouTubeIframeAPIReady = initializePlayer;
    };

    // Start loading the API
    loadYouTubeAPI();

    // Add visibility change listener
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup function
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Destroy the player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying YouTube player:', error);
        }
        playerRef.current = null;
      }

      // Reset state
      setIsPlayerReady(false);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      isInitializing = false;

      // Remove the script tag if we added it
      if (scriptTag && scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag);
      }

      // Clear the onYouTubeIframeAPIReady callback if it's our function
      if (window.onYouTubeIframeAPIReady === initializePlayer) {
        window.onYouTubeIframeAPIReady = () => {};
      }
    };
  }, [lecture?.videoId, lecture?.id]);

  // Cleanup effect for component unmount
  useEffect(() => {
    return () => {
      // Ensure player is destroyed when component unmounts
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying YouTube player on unmount:', error);
        }
        playerRef.current = null;
      }
      
      // Reset all player-related state
      setIsPlayerReady(false);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    };
  }, []);

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

    // If publishing as global anchor
    if (publishAsGlobal && lecture) {
      const author = "Admin"; // You can replace this with actual user info if available
      const newGlobalAnchor: GlobalAnchor = {
        id: Date.now().toString(),
        title: newAnchor.title,
        timestamp: formatTimestamp(timestampSeconds),
        timestampSeconds,
        description: newAnchor.description,
        author,
        likes: 0,
        dislikes: 0
      };
      // Add to globalAnchors in lecture
      if (!lecture.globalAnchors) lecture.globalAnchors = [];
      lecture.globalAnchors = [...lecture.globalAnchors, newGlobalAnchor];
    }
    
    // Reset form
    setNewAnchor({
      title: "",
      hours: "0",
      minutes: "0",
      seconds: "0", 
      description: ""
    });
    setPublishAsGlobal(false);
    setIsAddDialogOpen(false);
  };

  // Handle toggles
  const handleGlobalAnchorsToggle = () => setShowGlobalAnchors((prev) => !prev);
  const handleTranscriptToggle = () => setShowTranscript((prev) => !prev);

  // Time input validation and formatting functions
  const validateAndFormatTimeInput = (value: string, maxValue: number, field: 'hours' | 'minutes' | 'seconds') => {
    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue === '') {
      return '0';
    }
    
    let numValue = parseInt(numericValue);
    
    // Ensure the value is within valid range
    if (numValue < 0) {
      numValue = 0;
    } else if (numValue > maxValue) {
      numValue = maxValue;
    }
    
    // For minutes and seconds, ensure they're padded with leading zero if needed
    if (field === 'minutes' || field === 'seconds') {
      return numValue.toString().padStart(2, '0');
    }
    
    return numValue.toString();
  };

  const handleTimeInputChange = (value: string, field: 'hours' | 'minutes' | 'seconds') => {
    let maxValue: number;
    
    switch (field) {
      case 'hours':
        maxValue = Math.floor(duration / 3600);
        break;
      case 'minutes':
        maxValue = duration >= 3600 ? 59 : Math.floor((duration % 3600) / 60);
        break;
      case 'seconds':
        maxValue = 59;
        break;
      default:
        maxValue = 59;
    }
    
    const formattedValue = validateAndFormatTimeInput(value, maxValue, field);
    
    setNewAnchor(prev => ({ ...prev, [field]: formattedValue }));
  };

  const handleTimeInputBlur = (field: 'hours' | 'minutes' | 'seconds') => {
    // Ensure proper formatting on blur
    const currentValue = newAnchor[field];
    let maxValue: number;
    
    switch (field) {
      case 'hours':
        maxValue = Math.floor(duration / 3600);
        break;
      case 'minutes':
        maxValue = duration >= 3600 ? 59 : Math.floor((duration % 3600) / 60);
        break;
      case 'seconds':
        maxValue = 59;
        break;
      default:
        maxValue = 59;
    }
    
    const formattedValue = validateAndFormatTimeInput(currentValue, maxValue, field);
    
    if (formattedValue !== currentValue) {
      setNewAnchor(prev => ({ ...prev, [field]: formattedValue }));
    }
  };

  const handleTimeInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'hours' | 'minutes' | 'seconds') => {
    // Allow: backspace, delete, tab, escape, enter, arrow keys, and numbers
    if ([8, 9, 27, 13, 37, 38, 39, 40, 46].includes(e.keyCode) || 
        (e.keyCode >= 48 && e.keyCode <= 57) || 
        (e.keyCode >= 96 && e.keyCode <= 105)) {
      
      // Handle up/down arrow keys for increment/decrement
      if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
        const currentValue = parseInt(newAnchor[field]) || 0;
        let maxValue: number;
        
        switch (field) {
          case 'hours':
            maxValue = Math.floor(duration / 3600);
            break;
          case 'minutes':
            maxValue = duration >= 3600 ? 59 : Math.floor((duration % 3600) / 60);
            break;
          case 'seconds':
            maxValue = 59;
            break;
          default:
            maxValue = 59;
        }
        
        let newValue: number;
        if (e.keyCode === 38) { // Up arrow
          newValue = currentValue >= maxValue ? 0 : currentValue + 1;
        } else { // Down arrow
          newValue = currentValue <= 0 ? maxValue : currentValue - 1;
        }
        
        const formattedValue = field === 'minutes' || field === 'seconds' 
          ? newValue.toString().padStart(2, '0') 
          : newValue.toString();
        
        setNewAnchor(prev => ({ ...prev, [field]: formattedValue }));
        return;
      }
      
      return;
    }
    
    // Prevent any other key input
    e.preventDefault();
  };

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
      <div className={`min-h-screen w-full relative transition-colors duration-200 ${
        isDarkMode ? 'bg-[#36393f]' : 'bg-white'
      }`}>
        <div className="flex items-center justify-center h-screen">
          <p className={`transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>Lecture not found</p>
        </div>
      </div>
    );
  }

  // Timeline anchors to show
  const timelineAnchors = showGlobalAnchors ? globalAnchors : anchors;

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-200 ${
      isDarkMode ? 'bg-[#36393f]' : 'bg-[#8bb3e0]'
    }`}>
      {/* YouTube Video or Transcript */}
      <div className="w-full h-[33vh] bg-black relative">
        {lecture?.videoId ? (
          <div id={`youtube-player-${lecture.id}`} className="w-full h-full"></div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <p>No video available for this lecture</p>
          </div>
        )}
        {showTranscript && (
          <div className="absolute inset-0 w-full h-full overflow-y-auto p-4 text-white bg-black/90">
            <h2 className="text-xl font-bold mb-4">Transcript</h2>
            <p className="text-sm text-gray-400">
              YouTube's built-in transcript feature is now enabled. Click the CC button in the video player to view the transcript.
            </p>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="px-4 pt-4 pb-2">
        <h1 className={`text-lg font-medium transition-colors duration-200 ${
          isDarkMode ? 'text-white' : 'text-black'
        }`}>
          {lecture.title} / {lecture.date}
        </h1>
      </div>

      {/* Timeline & Controls */}
      <div className={`w-full h-[calc(100vh-33vh-150px)] flex flex-col transition-colors duration-200 ${
        isDarkMode ? 'bg-[#36393f]' : 'bg-[#8bb3e0]'
      }`}>
        {/* Toggles */}
        <div className="flex flex-row items-center justify-between px-4 pt-2 pb-2">
          <div className="flex items-center gap-3">
            {/* Global Anchors Toggle */}
            <button
              className={`flex items-center px-2 py-1 rounded-full border transition-colors duration-200 ${
                showGlobalAnchors 
                  ? isDarkMode 
                    ? 'bg-[#40444b] border-blue-500' 
                    : 'bg-white border-blue-500' 
                  : isDarkMode 
                    ? 'bg-[#2f3136] border-[#4f545c]' 
                    : 'bg-[#8bb3e0] border-gray-400'
              }`}
              onClick={handleGlobalAnchorsToggle}
            >
              <span className="mr-2 inline-block w-5 h-5 text-blue-700">🌐</span>
              <span className={`text-sm font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>global anchors</span>
              <span className={`ml-2 w-5 h-5 rounded-full border-2 transition-colors duration-200 ${
                showGlobalAnchors ? 'bg-blue-500 border-blue-500' : isDarkMode ? 'bg-[#4f545c] border-[#4f545c]' : 'bg-gray-200 border-gray-400'
              }`}></span>
            </button>
            {/* Transcript Toggle */}
            <button
              className={`flex items-center px-2 py-1 rounded-full border transition-colors duration-200 ${
                showTranscript 
                  ? isDarkMode 
                    ? 'bg-[#40444b] border-blue-500' 
                    : 'bg-white border-blue-500' 
                  : isDarkMode 
                    ? 'bg-[#2f3136] border-[#4f545c]' 
                    : 'bg-[#8bb3e0] border-gray-400'
              }`}
              onClick={handleTranscriptToggle}
            >
              <span className="mr-2 inline-block w-5 h-5 text-blue-700">📝</span>
              <span className={`text-sm font-medium transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>transcript</span>
            </button>
          </div>
          {/* Add Anchor Button */}
          {!showGlobalAnchors && (
            <button
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-transparent hover:bg-white/10 transition-colors duration-200 ${
                isDarkMode ? 'border-white hover:bg-[#40444b]' : 'border-black'
              }`}
              onClick={handleAddAnchor}
            >
              <PlusIcon className={`w-4 h-4 transition-colors duration-200 ${
                isDarkMode ? 'text-white' : 'text-black'
              }`} />
            </button>
          )}
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="flex-1 overflow-y-auto px-6 pb-6 pt-4 relative">
          {/* Progress bar */}
          <div className="absolute left-8 top-4 bottom-0 w-1 bg-blue-300 rounded-full z-0" style={{marginLeft: '-2px'}}>
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
              const groupedAnchors = timelineAnchors.reduce((groups: { position: number; anchors: (Anchor | GlobalAnchor & { position: number })[] }[], anchor: Anchor | GlobalAnchor) => {
                // Add offset to prevent anchors at 0:00 from being cut off
                const position = Math.max(4, (anchor.timestampSeconds / duration) * 100);
                const existingGroup = groups.find((group) =>
                  Math.abs(group.position - position) < 12 // 15% threshold for overlap
                );
                if (existingGroup) {
                  existingGroup.anchors.push({ ...anchor, position });
                } else {
                  groups.push({ position, anchors: [{ ...anchor, position }] });
                }
                return groups;
              }, []);

              return groupedAnchors.map((group: { position: number; anchors: (Anchor | GlobalAnchor & { position: number })[] }, groupIndex: number) => (
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
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
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
                      {group.anchors.map((anchor: Anchor | GlobalAnchor & { position: number }) => (
                        <div
                          key={anchor.id}
                          className={`flex-shrink-0 rounded-lg px-3 py-1.5 shadow-sm border transition-colors duration-200 cursor-pointer ${
                            isDarkMode 
                              ? 'bg-[#2f3136] border-[#4f545c] hover:bg-[#40444b]' 
                              : 'bg-white border-blue-100 hover:bg-blue-50'
                          } ${
                            currentTime >= anchor.timestampSeconds ? 'border-blue-400' : ''
                          }`}
                          onClick={() => {
                            if (showGlobalAnchors) {
                              setSelectedGlobalAnchor(anchor as GlobalAnchor);
                            } else {
                              setSelectedAnchor(anchor as Anchor);
                            }
                          }}
                        >
                          <div className="flex items-center">
                            <span className={`font-medium text-sm truncate max-w-[150px] transition-colors duration-200 ${
                              isDarkMode ? 'text-white' : 'text-blue-900'
                            }`}>
                              {anchor.title}
                            </span>
                            {group.anchors.length === 1 && (
                              <span className={`text-xs font-mono whitespace-nowrap ml-2 transition-colors duration-200 ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                              }`}>
                                {anchor.timestamp}
                              </span>
                            )}
                            {/* Show author for global anchors */}
                            {showGlobalAnchors && 'author' in anchor && anchor.author && (
                              <span className={`ml-2 text-xs transition-colors duration-200 ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>by {anchor.author}</span>
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
          <DialogContent className={`max-w-[800px] w-full max-h-[800px] mx-auto rounded-xl p-4 transition-colors duration-200 ${
            isDarkMode ? 'bg-[#2f3136] text-white' : 'bg-blue-900 text-white'
          }`}>
            <DialogHeader>
              <DialogTitle>Add New Anchor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Timestamp</Label>
                <div className={`flex items-center rounded-md p-2 justify-start space-x-1 transition-colors duration-200 ${
                  isDarkMode ? 'bg-[#40444b]' : 'bg-blue-900'
                }`}>
                  {duration >= 3600 && (
                    <div className="flex items-center">
                      <Input
                        id="hours"
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={newAnchor.hours}
                        onChange={(e) => handleTimeInputChange(e.target.value, 'hours')}
                        onBlur={() => handleTimeInputBlur('hours')}
                        onKeyDown={(e) => handleTimeInputKeyDown(e, 'hours')}
                        className={`w-12 text-xs px-1 py-0.5 text-white focus:outline-none focus:ring-0 text-center transition-colors duration-200 ${
                          isDarkMode ? 'bg-[#40444b] border-[#4f545c]' : 'bg-blue-900'
                        }`}
                      />
                      <Label htmlFor="hours" className="text-xs text-white ml-1 mr-2">h</Label>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Input
                      id="minutes"
                      type="text"
                      inputMode="numeric"
                      placeholder="00"
                      value={newAnchor.minutes}
                      onChange={(e) => handleTimeInputChange(e.target.value, 'minutes')}
                      onBlur={() => handleTimeInputBlur('minutes')}
                      onKeyDown={(e) => handleTimeInputKeyDown(e, 'minutes')}
                      className={`w-12 text-xs px-1 py-0.5 text-white focus:outline-none focus:ring-0 text-center transition-colors duration-200 ${
                        isDarkMode ? 'bg-[#40444b] border-[#4f545c]' : 'bg-blue-900'
                      }`}
                    />
                    <Label htmlFor="minutes" className="text-xs text-white ml-1 mr-2">min</Label>
                  </div>
                  <div className="flex items-center">
                    <Input
                      id="seconds"
                      type="text"
                      inputMode="numeric"
                      placeholder="00"
                      value={newAnchor.seconds}
                      onChange={(e) => handleTimeInputChange(e.target.value, 'seconds')}
                      onBlur={() => handleTimeInputBlur('seconds')}
                      onKeyDown={(e) => handleTimeInputKeyDown(e, 'seconds')}
                      className={`w-12 text-xs px-1 py-0.5 text-white focus:outline-none focus:ring-0 text-center transition-colors duration-200 ${
                        isDarkMode ? 'bg-[#40444b] border-[#4f545c]' : 'bg-blue-900'
                      }`}
                    />
                    <Label htmlFor="seconds" className="text-xs text-white ml-1 mr-2">s</Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
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
                    }}
                    className={`ml-4 px-2 py-1 text-xs text-white rounded transition-colors ${
                      isDarkMode ? 'bg-[#40444b] hover:bg-[#4f545c]' : 'bg-blue-700 hover:bg-blue-600'
                    }`}
                  >
                    Use Current Time
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="title" className="text-white">Title</Label>
                <Input
                  id="title"
                  value={newAnchor.title}
                  onChange={(e) => setNewAnchor(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter anchor title"
                  className={`transition-colors duration-200 ${
                    isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white placeholder:text-gray-400' : 'bg-blue-900 text-white placeholder:text-gray-400'
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="description" className="text-white">Description</Label>
                  <button
                    type="button"
                    onClick={() => setIsMarkdownPreview(!isMarkdownPreview)}
                    className={`px-3 py-1 text-xs rounded transition-colors duration-200 ${
                      isMarkdownPreview
                        ? isDarkMode 
                          ? 'bg-[#40444b] text-white' 
                          : 'bg-blue-800 text-white'
                        : isDarkMode 
                          ? 'bg-transparent border border-[#4f545c] text-white hover:bg-[#40444b]' 
                          : 'bg-transparent border border-blue-300 text-white hover:bg-blue-800'
                    }`}
                  >
                    {isMarkdownPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                <div className={`border rounded-md transition-colors duration-200 ${
                  isDarkMode ? 'border-[#4f545c]' : 'border-blue-700'
                }`}>
                  {isMarkdownPreview ? (
                    /* Markdown Preview */
                    <div className={`p-3 min-h-[144px] overflow-y-auto transition-colors duration-200 ${
                      isDarkMode ? 'bg-[#40444b]' : 'bg-blue-800'
                    }`}>
                      {newAnchor.description ? (
                        <div className="prose prose-sm max-w-none text-white">
                          <ReactMarkdown>{newAnchor.description}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className={`text-sm transition-colors duration-200 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-300'
                        }`}>
                          No content to preview...
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Markdown Editor */
                    <Textarea
                      id="description"
                      value={newAnchor.description}
                      onChange={(e) => setNewAnchor(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Write your markdown here..."
                      rows={6}
                      className={`font-mono border-0 rounded-md resize-none transition-colors duration-200 ${
                        isDarkMode ? 'bg-[#40444b] text-white placeholder:text-gray-400' : 'bg-blue-900 text-white placeholder:text-gray-400'
                      }`}
                    />
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="publishAsGlobal"
                  checked={publishAsGlobal}
                  onChange={e => setPublishAsGlobal(e.target.checked)}
                  className="accent-blue-500"
                />
                <Label htmlFor="publishAsGlobal" className="text-white">Publish as global anchor</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  onClick={handleSaveAnchor}
                  disabled={!newAnchor.title.trim()}
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
          <div className={`rounded-xl shadow-lg w-[90vw] max-w-md p-6 relative flex flex-col transition-colors duration-200 ${
            isDarkMode ? 'bg-[#2f3136] text-white' : 'bg-white text-black'
          }`}>
            <button
              className={`absolute top-2 right-2 text-2xl hover:text-black transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'
              }`}
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
                className={`p-1 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-[#40444b]' : 'hover:bg-gray-100'
                }`}
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
                  className={`ml-2 p-1 rounded-full transition-colors ${
                    isDarkMode ? 'hover:bg-[#40444b]' : 'hover:bg-gray-100'
                  }`}
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
                  className={`mb-2 transition-colors duration-200 ${
                    isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white' : ''
                  }`}
                />
                <Textarea
                  value={editedAnchor.description}
                  onChange={(e) => setEditedAnchor(prev => ({ ...prev, description: e.target.value }))}
                  className={`mb-4 font-mono transition-colors duration-200 ${
                    isDarkMode ? 'bg-[#40444b] border-[#4f545c] text-white' : ''
                  }`}
                  rows={6}
                  placeholder="Write your markdown here..."
                />
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
                <h2 className={`text-xl font-bold mb-2 transition-colors duration-200 ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>{selectedAnchor.title}</h2>
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

      {/* Global Anchor Modal */}
      {selectedGlobalAnchor && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className={`rounded-xl shadow-lg w-[90vw] max-w-md p-6 relative flex flex-col transition-colors duration-200 ${
            isDarkMode ? 'bg-[#2f3136] text-white' : 'bg-white text-black'
          }`}>
            <button
              className={`absolute top-2 right-2 text-2xl hover:text-black transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'
              }`}
              onClick={() => setSelectedGlobalAnchor(null)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={() => {
                  if (playerRef.current) {
                    playerRef.current.seekTo(selectedGlobalAnchor.timestampSeconds);
                    playerRef.current.playVideo();
                  }
                }}
                className={`p-1 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-[#40444b]' : 'hover:bg-gray-100'
                }`}
              >
                <PlayIcon className="w-5 h-5 text-blue-600" />
              </button>
              <span className="text-base font-semibold text-blue-600">{selectedGlobalAnchor.timestamp}</span>
              <span className={`text-xs transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>by {selectedGlobalAnchor.author}</span>
            </div>
            <h2 className={`text-xl font-bold mb-2 transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>{selectedGlobalAnchor.title}</h2>
            <div className="prose prose-sm max-w-none mb-4">
              <ReactMarkdown>{selectedGlobalAnchor.description}</ReactMarkdown>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedGlobalAnchor({
                    ...selectedGlobalAnchor,
                    likes: selectedGlobalAnchor.likes + 1
                  });
                }}
              >
                👍 {selectedGlobalAnchor.likes}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedGlobalAnchor({
                    ...selectedGlobalAnchor,
                    dislikes: selectedGlobalAnchor.dislikes + 1
                  });
                }}
              >
                👎 {selectedGlobalAnchor.dislikes}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Next Lecture Dialog */}
      <Dialog open={showNextLectureDialog} onOpenChange={setShowNextLectureDialog}>
        <DialogContent className={`max-w-md mx-auto rounded-xl p-6 transition-colors duration-200 ${
          isDarkMode ? 'bg-[#2f3136] text-white' : 'bg-blue-900 text-white'
        }`}>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              {nextLecture ? 'Continue Learning?' : 'Video Complete!'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {nextLecture ? (
              <>
                <p className="text-sm text-gray-300">
                  Would you like to continue with the next lecture?
                </p>
                <div className={`p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode ? 'bg-[#40444b] border-[#4f545c]' : 'bg-blue-800 border-blue-700'
                }`}>
                  <h3 className="font-semibold text-white">
                    {nextLecture.title}
                  </h3>
                  <p className="text-sm mt-1 text-gray-300">
                    {nextLecture.date}
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setShowNextLectureDialog(false)}
                    className={`transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-transparent border-white text-white hover:bg-[#40444b]' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Stay Here
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNextLectureDialog(false);
                      window.location.href = `/course/${courseId}/lecture/${nextLecture.id}`;
                    }}
                    className={`transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-transparent border-white text-white hover:bg-[#40444b]' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Play Next Lecture
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-300">
                  You've completed all lectures in this course!
                </p>
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setShowNextLectureDialog(false)}
                    className={`transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-transparent border-white text-white hover:bg-[#40444b]' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setShowNextLectureDialog(false);
                      window.location.href = `/course/${courseId}`;
                    }}
                    className={`transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-transparent border-white text-white hover:bg-[#40444b]' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    Back to Course
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <NavigationBar />
    </div>
  );
};