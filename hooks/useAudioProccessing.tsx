import { useRef } from "react";

export const useAudioProcessing = () => {
    const conversationAudioRef = useRef<{
      audio: Int16Array;
      timestamp: number;
      speaker: 'user' | 'assistant';
    }[]>([]);
    const initializeAudioRef = () => {
      conversationAudioRef.current = [];
    };
    const applyLowPassFilter = (data: Int16Array, cutoffFreq: number, sampleRate: number): Int16Array => {
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
        coefficients[i] *= 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / (numberOfTaps - 1));
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
      if (inputSampleRate === outputSampleRate) return audioData;
      if (inputSampleRate < outputSampleRate) throw new Error("Upsampling not supported");
  
      const filteredData = applyLowPassFilter(audioData, outputSampleRate * 0.45, inputSampleRate);
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
  
    return {
      conversationAudioRef,
      downsampleAudio,
      initializeAudioRef
    };
  };