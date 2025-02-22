class AudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    if (inputs[0].length > 0) {
      const inputBuffer = inputs[0][0];
      const int16Array = new Int16Array(inputBuffer.length);

      for (let i = 0; i < inputBuffer.length; i++) {
        int16Array[i] = Math.max(-1, Math.min(1, inputBuffer[i])) * 32767;
      }

      this.port.postMessage(int16Array);
    }
    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
