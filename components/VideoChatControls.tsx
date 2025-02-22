import { Camera, CameraOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { Button } from "./ui/button";

interface VideoControlsProps {
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
    hasCamera: boolean | null;
    onVideoToggle: () => void;
    onAudioToggle: () => void;
    onEndCall: () => void;
  }
  
// Components
const VideoControls: React.FC<VideoControlsProps> = ({
    isVideoEnabled,
    isAudioEnabled,
    hasCamera,
    onVideoToggle,
    onAudioToggle,
    onEndCall
  }) => (
    <div className="fixed bottom-0 inset-x-0 p-6 bg-black/80 z-30">
      <div className="flex justify-center items-center gap-6">
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full bg-gray-700 hover:bg-gray-600 p-6"
          onClick={onVideoToggle}
          disabled={!hasCamera}
        >
          {isVideoEnabled ? (
            <Camera className="size-8 text-white" />
          ) : (
            <CameraOff className="size-8 text-red-500" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="rounded-full bg-gray-700 hover:bg-gray-600 p-6"
          onClick={onAudioToggle}
        >
          {isAudioEnabled ? (
            <Mic className="size-8 text-white" />
          ) : (
            <MicOff className="size-8 text-red-500" />
          )}
        </Button>
        <Button
          variant="destructive"
          size="lg"
          className="rounded-full bg-red-600 hover:bg-red-700 p-6"
          onClick={onEndCall}
        >
          <PhoneOff className="size-8" />
        </Button>
      </div>
    </div>
  );
  

  export default VideoControls;