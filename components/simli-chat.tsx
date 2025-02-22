// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from "react";
import { RealtimeClient } from "@openai/realtime-api-beta";
import { SimliClient } from "simli-client";
import VideoBox from "./video-box";

interface SimliOpenAIProps {
  simli_faceid: string;
  openai_voice: "alloy"|"ash"|"ballad"|"coral"|"echo"|"sage"|"shimmer"|"verse";
  openai_model: string;
  initialPrompt: string;
  onStart: () => void;
  onClose: () => void;
  showDottedFace: boolean;
}

// Audio processing configuration
const AUDIO_CHUNK_SIZE = 2048;
const AUDIO_SAMPLE_RATE = 24000;
const AUDIO_CHUNK_INTERVAL = 20; // ms

const SimliOpenAI: React.FC<SimliOpenAIProps> = ({
  simli_faceid,
  openai_voice,
  openai_model,
  initialPrompt,
  onStart,
  onClose,
  showDottedFace,
}) => {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarVisible, setIsAvatarVisible] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [assistantMessage, setAssistantMessage] = useState("");

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const openAIClientRef = useRef<RealtimeClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const simliClientRef = useRef<SimliClient | null>(null);
  const isCleaningUpRef = useRef(false);
  const audioChunkQueueRef = useRef<Int16Array[]>([]);
  const audioIntervalRef = useRef<NodeJS.Timer | null>(null);

  // Process audio chunks at a regular interval
  const processAudioQueue = useCallback(() => {
    if (!simliClientRef.current || audioChunkQueueRef.current.length === 0) return;

    const chunk = audioChunkQueueRef.current.shift();
    if (chunk) {
   
      simliClientRef.current.sendAudioData(chunk);
    }
  }, []);

  useEffect(() => {
    // Set up interval for processing audio chunks
    if (isRecording && !audioIntervalRef.current) {
      audioIntervalRef.current = setInterval(processAudioQueue, AUDIO_CHUNK_INTERVAL);
    }

    return () => {
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
        audioIntervalRef.current = null;
      }
    };
  }, [isRecording, processAudioQueue]);

  // Cleanup function
  useEffect(() => {
    return () => {
      handleCleanup();
    };
  }, []);

  const handleConversationUpdate = useCallback((event: any) => {
    const { item, delta } = event;

    if (item.type === "message") {
      if (item.role === "assistant") {
        setAssistantMessage(item.content?.[0]?.text || "");
        if (delta?.audio) {
          const audioData = new Int16Array(delta.audio);
          audioChunkQueueRef.current.push(audioData);
        }
      } else if (item.role === "user") {
        setUserMessage(item.content?.[0]?.text || "");
      }
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: AUDIO_SAMPLE_RATE });
      }

      console.log("Starting audio recording...");
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: AUDIO_SAMPLE_RATE,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      const source = audioContextRef.current.createMediaStreamSource(streamRef.current);
      processorRef.current = audioContextRef.current.createScriptProcessor(AUDIO_CHUNK_SIZE, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        if (!openAIClientRef.current) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = new Int16Array(inputData.length);
        
        for (let i = 0; i < inputData.length; i++) {
          const sample = Math.max(-1, Math.min(1, inputData[i]));
          audioData[i] = Math.floor(sample * 32767);
        }

        try {
          openAIClientRef.current.appendInputAudio(audioData);
        } catch (error) {
          console.warn("Error appending audio:", error);
        }
      };

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);
      setIsRecording(true);
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
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const handleCleanup = useCallback(() => {
    if (isCleaningUpRef.current) return;
    isCleaningUpRef.current = true;

    try {
      console.log("Cleaning up resources...");
      stopRecording();

      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
        audioIntervalRef.current = null;
      }

      if (openAIClientRef.current) {
        openAIClientRef.current.disconnect();
        openAIClientRef.current = null;
      }

      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
        audioContextRef.current = null;
      }

      if (simliClientRef.current) {
        simliClientRef.current.close();
        simliClientRef.current = null;
      }

      audioChunkQueueRef.current = [];
    } catch (error) {
      console.error("Error during cleanup:", error);
    } finally {
      isCleaningUpRef.current = false;
    }
  }, [stopRecording]);

  const initializeOpenAI = async () => {
    try {
      console.log("Initializing OpenAI client...");
      openAIClientRef.current = new RealtimeClient({
        model: openai_model,
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowAPIKeyInBrowser: true,
      });

      // Set up event handlers
      openAIClientRef.current.on("conversation.updated", handleConversationUpdate);
      openAIClientRef.current.on("error", (error) => {
        console.error("OpenAI error:", error);
        setError("Error in OpenAI connection");
      });

      await openAIClientRef.current.updateSession({
        instructions: initialPrompt,
        voice: openai_voice,
        turn_detection: { type: "server_vad" },
        input_audio_transcription: { model: "whisper-1" },
      });

      await openAIClientRef.current.connect();
      openAIClientRef.current.createResponse();
      await startRecording();
    } catch (error) {
      console.error("Error initializing OpenAI:", error);
      throw error;
    }
  };

  const initializeSimliClient = useCallback(async () => {
    if (!videoRef.current || !audioRef.current) {
      throw new Error("Video or audio elements not available");
    }

    try {
      simliClientRef.current = new SimliClient();
      
      // Wait for elements to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      const SimliConfig = {
        apiKey: process.env.NEXT_PUBLIC_SIMLI_API_KEY,
        faceID: simli_faceid,
        handleSilence: true,
        maxSessionLength: 6000,
        maxIdleTime: 6000,
        videoRef: videoRef.current,
        audioRef: audioRef.current
      };

      console.log("Initializing Simli client with config");
      await simliClientRef.current.Initialize(SimliConfig);
      console.log("Simli Client initialized successfully");

      const handleConnect = async () => {
        if (!simliClientRef.current) return;
        
        console.log("SimliClient connected");
        const audioData = new Uint8Array(6000).fill(0);
        simliClientRef.current.sendAudioData(audioData);
        
        await initializeOpenAI();
      };

      const handleDisconnect = () => {
        if (!simliClientRef.current || isCleaningUpRef.current) return;
        console.log("SimliClient disconnected");
        handleCleanup();
      };

      // Set up event listeners
      simliClientRef.current.on("connected", handleConnect);
      simliClientRef.current.on("disconnected", handleDisconnect);

      await simliClientRef.current.start();
    } catch (error) {
      console.error("Error initializing Simli:", error);
      throw error;
    }
  }, [simli_faceid, handleCleanup]);

  const handleStart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      onStart();
      
      await initializeSimliClient();
      setIsAvatarVisible(true);
    } catch (error: any) {
      console.error("Error starting:", error);
      setError(`Failed to start: ${error.message}`);
      handleCleanup();
    } finally {
      setIsLoading(false);
    }
  }, [initializeSimliClient, onStart, handleCleanup]);

  const handleStop = useCallback(() => {
    setIsLoading(false);
    setError("");
    setIsAvatarVisible(false);
    handleCleanup();
    onClose();
  }, [handleCleanup, onClose]);

  return (
    <>
      <div className={`transition-all duration-300 max-w-full ${
        showDottedFace ? "h-0 overflow-hidden" : "h-auto"
      }`}>
        <VideoBox video={videoRef} audio={audioRef} />
      </div>
      
      <div className="flex flex-col items-center max-w-full">
        {!isAvatarVisible ? (
          <button
            onClick={handleStart}
            disabled={isLoading}
            className="w-full h-[52px] mt-4 disabled:bg-[#343434] disabled:text-white disabled:hover:rounded-[100px] bg-simliblue text-white py-3 px-6 rounded-[100px] transition-all duration-300 hover:text-black hover:bg-white hover:rounded-sm flex justify-center items-center"
          >
            {isLoading ? (
              <span className="h-[20px] animate-loader">Loading...</span>
            ) : (
              <span className="font-abc-repro-mono font-bold w-[164px]">
                Start Video Call
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="mt-4 group text-white flex-grow bg-red hover:rounded-sm hover:bg-white h-[52px] px-6 rounded-[100px] transition-all duration-300"
          >
            <span className="font-abc-repro-mono group-hover:text-black font-bold w-[164px] transition-all duration-300">
              Stop Video Call
            </span>
          </button>
        )}
      </div>
    </>
  );
};

export default SimliOpenAI;