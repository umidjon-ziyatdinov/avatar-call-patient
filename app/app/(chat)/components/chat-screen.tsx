
import { useState, useEffect, useRef, ChangeEvent } from "react";

import { ArrowLeft, Play, Pause, Volume2 } from "lucide-react";

import { Avatar, Patient, User } from "@/lib/db/schema";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import MobileVideoChat from "./mobile-videochat";


interface AudioPlayerProps {
  audioUrl: string;
}

interface ChatScreenProps {
  avatar: Avatar;
  onBack: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayPause = (): void => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onTimeUpdate = (): void => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = (): void => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const time = Number(event.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <Card className="w-full bg-gray-50">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-primary text-white hover:bg-primary/90"
            type="button"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <div className="flex-1">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleTimeChange}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <Volume2 size={20} className="text-gray-600" />
        </div>

        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

interface MobileVideoChatProps {
  patient: {
    patientDetails?: any; // Replace 'any' with your actual patient details type
  } | undefined;
  avatar: Avatar;
  onBack?: (url?: string) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ avatar, onBack }) => {
  const [showDottedFace, setShowDottedFace] = useState<boolean>(true);
  const [showLoading, setShowLoading] = useState<boolean>(true);
  const [isInCall, setIsInCall] = useState<boolean>(false);


  const { data: patient, isLoading, mutate } = useSWR<Patient>(`/api/patient`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    setShowLoading(true);
    if (patient) {
      setShowLoading(false);
    }
  }, [patient]);

  const onStart = (): void => {
    setShowDottedFace(false);
    setIsInCall(true);
  };

  const onClose = (): void => {
    setShowDottedFace(true);
    setIsInCall(false);
  };


  if (showLoading || isLoading) {
    return (
      <div className="flex flex-col w-full h-[50vh] items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <h2>Loading....</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-center gap-6 p-6 rounded-lg">
  
      
      <div className="flex flex-col w-full">
        <MobileVideoChat
          patient={patient}
          avatar={avatar}
          
        />
      </div>
    </div>
  );
};

export default ChatScreen;