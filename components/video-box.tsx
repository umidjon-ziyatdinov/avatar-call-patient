import { Position } from "@/types/VideoCallTypes";
import { AlertCircle, UserCircle2 } from "lucide-react";

interface VideoBoxProps {
  hasCamera: boolean | null;
    isVideoEnabled: boolean;
    position: Position;
    onDragStart: (e: React.TouchEvent | React.MouseEvent) => void;
    videoRef: React.RefObject<HTMLVideoElement>;
  }

 const  VideoBox: React.FC<VideoBoxProps> = ({
    hasCamera,
    isVideoEnabled,
    position,
    onDragStart,
    videoRef
  }) => (
    <div
      className="absolute top-4 right-4 w-[120px] h-[160px] rounded-lg overflow-hidden border-2 border-white/20 shadow-lg cursor-move"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: "none",
        zIndex: 20,
      }}
      onMouseDown={onDragStart}
      onTouchStart={onDragStart}
    >
      {hasCamera === false ? (
        <div className="size-full bg-gray-800 flex items-center justify-center">
          <AlertCircle className="size-8 text-red-500" />
        </div>
      ) : !isVideoEnabled ? (
        <div className="size-full bg-gray-800 flex items-center justify-center">
          <UserCircle2 className="size-12 text-gray-400" />
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="size-full object-cover -scale-x-100"
        />
      )}
    </div>
  );

  export default VideoBox;