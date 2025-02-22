// @ts-nocheck
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  PhoneOff,
  AlertCircle,
  UserCircle2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useReactMediaRecorder } from 'react-media-recorder';
import { RealtimeClient } from "@openai/realtime-api-beta";
import { SimliClient } from "simli-client";
import RingingAnimation from "@/components/RingingAnimation";
import { Avatar, Patient, PatientDetails } from "@/lib/db/schema";
import { generateFinalPrompt } from "@/utils/utils";
import ChatControls from "./ChatControls";

interface Position {
  x: number;
  y: number;
}


interface CallMetrics {
  qualityMetrics: {
    audioQuality: number;
    videoQuality: number;
    networkLatency: number;
    dropouts: number;
  };
  conversationMetrics: {
    userSpeakingTime: number;
    avatarSpeakingTime: number;
    turnsCount: number;
    avgResponseTime: number;
  };
  technicalDetails: {
    browserInfo: string;
    deviceType: string;
    networkType: string;
    osVersion: string;
    startTime: string;
  };
  errorLogs: Array<{
    timestamp: string;
    error: string;
    context: string;
  }>;
}

const simliClient = new SimliClient();

const MobileVideoChat: React.FC<{
  avatar: Avatar;
  className?: string
  patient?: Patient
  onBack?: () => void;
}> = ({ avatar, onBack, className , patient}) => {

  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [callId, setCallId] = useState<string | null>(null);

  // Metrics State
  const [callMetrics, setCallMetrics] = useState<CallMetrics>({
    qualityMetrics: {
      audioQuality: 100,
      videoQuality: 100,
      networkLatency: 0,
      dropouts: 0
    },
    conversationMetrics: {
      userSpeakingTime: 0,
      avatarSpeakingTime: 0,
      turnsCount: 0,
      avgResponseTime: 0
    },
    technicalDetails: {
      browserInfo: navigator.userAgent,
      deviceType: /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent) ? 'mobile' : 'desktop',
      networkType: (navigator as any).connection?.type || 'unknown',
      osVersion: navigator.platform,
      startTime: ''
    },
    errorLogs: []
  });
  const callIdRef = useRef<string | null>(null); // Add this ref

  // Update the ref whenever callId changes
  const callMetricsRef = useRef<CallMetrics>(callMetrics);

  // Update refs whenever their corresponding states change
  useEffect(() => {
    callIdRef.current = callId;
  }, [callId]);

  useEffect(() => {
    callMetricsRef.current = callMetrics;
  }, [callMetrics]);

  // Chat State
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [userMessage, setUserMessage] = useState("...");

  // Refs
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoBoxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const openAIClientRef = useRef<RealtimeClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const audioChunkQueueRef = useRef<Int16Array[]>([]);
  const isProcessingChunkRef = useRef(false);
// Modify the useReactMediaRecorder initialization
const {
  startRecording: startAudioRecording,
  stopRecording: stopAudioRecording,
  mediaBlobUrl
} = useReactMediaRecorder({
  audio: {
    echoCancellation: false, // Disable echo cancellation
    noiseSuppression: false, // Disable noise suppression
    autoGainControl: false   // Disable auto gain
  },
  onStop: (blobUrl, blob) => handleAudioUpload(blob, callIdRef.current, callMetricsRef.current)
});


  // Camera Setup Functions
  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      setHasCamera(videoDevices.length > 0);
    } catch (error) {
      console.error("Error checking camera:", error);
      setHasCamera(false);
    }
  };

  const startVideoStream = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = mediaStream;
        // Ensure autoplay works on mobile
        userVideoRef.current.play().catch(e => console.error("Error auto-playing video:", e));
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCamera(false);
    }
  };

  const stopVideoStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Audio Processing Functions
  const applyLowPassFilter = (
    data: Int16Array,
    cutoffFreq: number,
    sampleRate: number
  ): Int16Array => {
    const numberOfTaps = 31;
    const coefficients = new Float32Array(numberOfTaps);
    const fc = cutoffFreq / sampleRate;
    const middle = (numberOfTaps - 1) / 2;

    for (let i = 0; i < numberOfTaps; i++) {
      if (i === middle) {
        coefficients[i] = 2 * Math.PI * fc;
      } else {
        const x = 2 * Math.PI * fc * (i - middle);
        coefficients[i] = Math.sin(x) / (i - middle);
      }
      coefficients[i] *=
        0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (numberOfTaps - 1));
    }

    const sum = coefficients.reduce((acc, val) => acc + val, 0);
    coefficients.forEach((_, i) => (coefficients[i] /= sum));

    const result = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < numberOfTaps; j++) {
        const idx = i - j + middle;
        if (idx >= 0 && idx < data.length) {
          sum += coefficients[j] * data[idx];
        }
      }
      result[i] = Math.round(sum);
    }

    return result;
  };

  const downsampleAudio = (
    audioData: Int16Array,
    inputSampleRate: number,
    outputSampleRate: number
  ): Int16Array => {
    if (inputSampleRate === outputSampleRate) {
      return audioData;
    }

    if (inputSampleRate < outputSampleRate) {
      throw new Error("Upsampling is not supported");
    }

    const filteredData = applyLowPassFilter(
      audioData,
      outputSampleRate * 0.45,
      inputSampleRate
    );

    const ratio = inputSampleRate / outputSampleRate;
    const newLength = Math.floor(audioData.length / ratio);
    const result = new Int16Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const position = i * ratio;
      const index = Math.floor(position);
      const fraction = position - index;

      if (index + 1 < filteredData.length) {
        const a = filteredData[index];
        const b = filteredData[index + 1];
        result[i] = Math.round(a + fraction * (b - a));
      } else {
        result[i] = filteredData[index];
      }
    }

    return result;
  };

  // Audio Queue Processing
  const processNextAudioChunk = useCallback(() => {
    if (
      audioChunkQueueRef.current.length > 0 &&
      !isProcessingChunkRef.current
    ) {
      isProcessingChunkRef.current = true;
      const audioChunk = audioChunkQueueRef.current.shift();

      if (audioChunk) {
        simliClient?.sendAudioData(audioChunk);
        console.log("Sent audio chunk to Simli:", audioChunk.length);
      }

      isProcessingChunkRef.current = false;

      if (audioChunkQueueRef.current.length > 0) {
        setTimeout(processNextAudioChunk, 50); // Add small delay between chunks
      }
    }
  }, []);

  // OpenAI Event Handlers
  const handleConversationUpdate = useCallback(
    (event: any) => {
      const { item, delta } = event;

      if (item.type === "message" && item.role === "assistant") {
        if (delta && delta.audio) {
          const downsampledAudio = downsampleAudio(delta.audio, 24000, 16000);
          audioChunkQueueRef.current.push(downsampledAudio);
          if (!isProcessingChunkRef.current) {
            processNextAudioChunk();
          }
        }
      } else if (item.type === "message" && item.role === "user") {
        setUserMessage(item.content[0].transcript);
      }
    },
    [processNextAudioChunk]
  );

  const handleSpeechStopped = useCallback((event: any) => {
    console.log("Speech stopped event received", event);
  }, []);

  const interruptConversation = useCallback(() => {
    console.warn("User interrupted the conversation");
    simliClient?.ClearBuffer();
    openAIClientRef.current?.cancelResponse("");
  }, []);

  // Initialize Clients
  const initializeSimliClient = useCallback(() => {
    if (!videoRef.current || !audioRef.current) {
      console.error("Video or Audio ref not available");
      return;
    }

    try {
      console.log("Initializing Simli Client");
      const SimliConfig = {
        apiKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY,
        faceID: avatar.simliFaceId,
        handleSilence: true,
        maxSessionLength: 6000,
        maxIdleTime: 6000,
        videoRef: videoRef.current,
        audioRef: audioRef.current,
        enableConsoleLogs: true,
        disableAudio: false, // Changed to false to enable audio
      };

      simliClient.Initialize(SimliConfig);
      console.log("Simli Client initialized successfully");
    } catch (error) {
      console.error("Error initializing Simli Client:", error);
      setError("Failed to initialize Simli Client");
    }
  }, [avatar.simliFaceId]);

  const initializeOpenAIClient = useCallback(async () => {
    try {
      console.log("Initializing OpenAI client...");
      openAIClientRef.current = new RealtimeClient({
        model: avatar.openaiModel,
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowAPIKeyInBrowser: true,
      });
      const prompt = generateFinalPrompt(patient,avatar,  avatar.personality)
      console.log('genrated prompt', prompt)
      await openAIClientRef.current.updateSession({
        instructions: prompt ,
        voice: avatar.openaiVoice,
        turn_detection: { type: "server_vad" },
        input_audio_transcription: { model: "whisper-1" },
       
      });

      openAIClientRef.current.on(
        "conversation.updated",
        handleConversationUpdate
      );
      openAIClientRef.current.on(
        "conversation.interrupted",
        interruptConversation
      );
      openAIClientRef.current.on(
        "input_audio_buffer.speech_stopped",
        handleSpeechStopped
      );

      await openAIClientRef.current.connect();
      console.log("OpenAI Client connected successfully");
      openAIClientRef.current.createResponse();

      setIsAvatarVisible(true);
    } catch (error: any) {
      console.error("Error initializing OpenAI client:", error);
      setError(`Failed to initialize OpenAI client: ${error.message}`);
    }
  }, [
    avatar.initialPrompt,
    avatar.openaiModel,
    avatar.openaiVoice,
    handleConversationUpdate,
    handleSpeechStopped,
    interruptConversation,
  ]);

  // Start/Stop Recording
  const startRecording = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }

    try {
      console.log("Starting audio recording...");
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const source = audioContextRef.current.createMediaStreamSource(
        streamRef.current
      );
      processorRef.current = audioContextRef.current.createScriptProcessor(
        2048,
        1,
        1
      );

      processorRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = new Int16Array(inputData.length);

        for (let i = 0; i < inputData.length; i++) {
          const sample = Math.max(-1, Math.min(1, inputData[i]));
          audioData[i] = Math.floor(sample * 32767);
        }

        openAIClientRef.current?.appendInputAudio(audioData);
      };

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      setIsRecording(true);
      console.log("Audio recording started");
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Error accessing microphone. Please check your permissions.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    console.log("Audio recording stopped");
  }, []);

  // Session Management
const handleStart = async () => {
    setIsLoading(true);
    setIsConnecting(true);
    setError("");
    console.log("Starting...");
    const startTime = new Date().toISOString();
    setCallMetrics(prev => ({
      ...prev,
      technicalDetails: {
        ...prev.technicalDetails,
        startTime
      }
    }));
    const prompt = generateFinalPrompt(patient,avatar,  avatar.personality)
    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
        body: JSON.stringify({
          avatarId: avatar.id,
          status: 'active',
          qualityMetrics: callMetrics.qualityMetrics,
          conversationMetrics: callMetrics.conversationMetrics,
          technicalDetails: {
            ...callMetrics.technicalDetails,
            startTime
          },
          prompt,
          metadata: {
            avatarName: avatar.name,
            avatarModel: avatar.openaiModel,
            avatarVoice: avatar.openaiVoice
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newCallId = data.id; // Capture the ID
      setCallId((prevCallId) => {
        console.log("Previous callId:", prevCallId); // Debugging
        return newCallId;
    });

      setIsRecording(true);
      startAudioRecording();

      try {
        await simliClient?.start();
        const cleanup = eventListenerSimli();
        await startRecording();

        return () => {
          if (cleanup) cleanup();
        };
      } catch (error: any) {
        console.error("Error starting interaction:", error);
        setError(`Error starting interaction: ${error.message}`);
      } finally {
        setIsAvatarVisible(true);
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Error creating call:", error);
      setError(`Failed to create call: ${error.message}`);
      setIsLoading(false);
      setIsConnecting(false);
    }
  };
  const handleAudioUpload = async (audioBlob: Blob, callID: string | null,   currentCallMetrics: CallMetrics ) => {
    const endTime = new Date();
    const startTime = new Date(currentCallMetrics.technicalDetails.startTime);
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'call-recording.webm');
    try {
      const response = await fetch("/api/upload-recording", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload aggregated audio");
      }
      const data = await response.json();
          // Extract and convert conversation metrics from strings to numbers
    const conversationMetricsRaw = data?.analysis?.conversation_metrics ||  {}
    
      
      const conversationMetrics = {
        userSpeakingTime: Number(conversationMetricsRaw.userSpeakingTime) || 0,
        avatarSpeakingTime: Number(conversationMetricsRaw.avatarSpeakingTime) || 0,
        turnsCount: Number(conversationMetricsRaw.turnsCount) || 0,
        avgResponseTime: Number(conversationMetricsRaw.avgResponseTime) || 0
      };
      await fetch(`/api/calls/${callID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'completed',
          endedAt: endTime.toISOString(),
          duration,
          recordingUrl: data?.url,
          analysis: data?.analysis,
          qualityMetrics: callMetrics.qualityMetrics,
          conversationMetrics,
          errorLogs: callMetrics.errorLogs
        })
      });
    } catch (error) {
      console.error("Error saving aggregated audio:", error);
      return { url: '' };
    }
  };

  const handleStop = async () => {
  
    console.log("Stopping interaction...");
    setIsLoading(false);
    setError("");
      // Stop the recording first
  stopAudioRecording();
    stopRecording();
    setIsAvatarVisible(false);
    simliClient?.close();
    openAIClientRef.current?.disconnect();
    setIsRecording(false);
   
    // Clear audio state
    audioChunkQueueRef.current = [];
    isProcessingChunkRef.current = false;

    if (audioContextRef.current) {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    }
 
    console.log("Interaction stopped");
  };

  // Event Listeners
  const eventListenerSimli = useCallback(() => {
    if (!simliClient) return;

    const onConnected = () => {
      console.log("SimliClient connected");
      initializeOpenAIClient()
        .then(() => {
          startRecording();
          setIsConnecting(false); // Add this line - connection complete
        })
        .catch((error) => {
          console.error("Error in OpenAI initialization:", error);
          setIsConnecting(false);
          setError("Failed to initialize OpenAI client");
        });
    };

    const onDisconnected = () => {
      console.log("SimliClient disconnected");
      stopRecording();
      openAIClientRef.current?.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current?.close();
        audioContextRef.current = null;
      }
    };

    simliClient.on("connected", onConnected);
    simliClient.on("disconnected", onDisconnected);

    return () => {
      simliClient.off("connected", onConnected);
      simliClient.off("disconnected", onDisconnected);
    };
  }, [initializeOpenAIClient, startRecording, stopRecording]);

  // UI Event Handlers
  const handleStartCall = () => {
    setIsOpen(true);
    setIsInCall(true);
    handleStart();
  };

  const handleEndCall = async () => {

    
    stopVideoStream();
    setIsOpen(false);
    setIsInCall(false);
    await handleStop();
    // onBack();
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  // Drag Handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleDrag = (e: TouchEvent | MouseEvent) => {
    if (!isDragging || !containerRef.current || !videoBoxRef.current) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const containerRect = containerRef.current.getBoundingClientRect();
    const videoBoxRect = videoBoxRef.current.getBoundingClientRect();

    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;

    const maxX = containerRect.width - videoBoxRect.width;
    const maxY = containerRect.height - videoBoxRect.height;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Effects
  useEffect(() => {
    checkCameraAvailability();
    return () => stopVideoStream();
  }, []);

  useEffect(() => {
    if (isOpen && hasCamera && isVideoEnabled) {
      startVideoStream();
    }
  }, [isOpen, hasCamera, isVideoEnabled]);

  useEffect(() => {
    if (isOpen && videoRef.current && audioRef.current) {
      initializeSimliClient();
    }
  }, [isOpen, videoRef.current, initializeSimliClient]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleDrag);
      window.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging]);

  return (
    <>
   <ChatControls
  isLoading={isLoading}
  onVideoCall={handleStartCall}
  onAudioCall={() => {
    // Handle audio call
  }}
/>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 gap-0 h-[100dvh] max-w-full bg-background dark:bg-gray-900">
          <div ref={containerRef} className="relative w-full h-full bg-gray-800">
            {/* Main Video Container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
                <audio 
                  ref={audioRef} 
                  autoPlay 
                  playsInline
                  className="hidden"
                />
              </div>

              {isConnecting && <RingingAnimation />}

              {isLoading && !isConnecting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="h-[20px] animate-loader">Loading...</span>
                </div>
              )}

              {error && (
                <Alert className="absolute bottom-20 left-4 right-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Draggable Video Box */}
            <div
              ref={videoBoxRef}
              className="absolute top-4 right-4 w-[120px] h-[160px] rounded-lg overflow-hidden border-2 border-white/20 shadow-lg cursor-move"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                touchAction: "none",
                zIndex: 20,
              }}
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              {hasCamera === false ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              ) : !isVideoEnabled ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <UserCircle2 className="w-12 h-12 text-gray-400" />
                </div>
              ) : (
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              )}
            </div>

            {/* Controls Bar - Modified for better visibility */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-black/80 z-30">
              <div className="flex justify-center items-center gap-6">
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full bg-gray-700 hover:bg-gray-600 p-6"
                  onClick={toggleVideo}
                  disabled={!hasCamera}
                >
                  {isVideoEnabled ? (
                    <Camera className="h-8 w-8 text-white" />
                  ) : (
                    <CameraOff className="h-8 w-8 text-red-500" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full bg-gray-700 hover:bg-gray-600 p-6"
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? (
                    <Mic className="h-8 w-8 text-white" />
                  ) : (
                    <MicOff className="h-8 w-8 text-red-500" />
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  className="rounded-full bg-red-600 hover:bg-red-700 p-6"
                  onClick={handleEndCall}
                
                >
                  <PhoneOff className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileVideoChat;
