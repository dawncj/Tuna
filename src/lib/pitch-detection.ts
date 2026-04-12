
/**
 * Simple Autocorrelation algorithm for pitch detection.
 * Based on various open source implementations.
 */
export function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
  // Perform a quick check to see if we have enough signal
  let size = buffer.length;
  let rms = 0;

  for (let i = 0; i < size; i++) {
    let val = buffer[i];
    rms += val * val;
  }
  rms = Math.sqrt(rms / size);
  if (rms < 0.01) {
    // Not enough signal
    return -1;
  }

  let r1 = 0;
  let r2 = size - 1;
  let threshold = 0.2;

  for (let i = 0; i < size / 2; i++) {
    if (Math.abs(buffer[i]) < threshold) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < size / 2; i++) {
    if (Math.abs(buffer[size - i]) < threshold) {
      r2 = size - i;
      break;
    }
  }

  buffer = buffer.slice(r1, r2);
  size = buffer.length;

  let c = new Float32Array(size).fill(0);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - i; j++) {
      c[i] = c[i] + buffer[j] * buffer[j + i];
    }
  }

  let d = 0;
  while (c[d] > c[d + 1]) d++;
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < size; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  let T0 = maxpos;

  // Interpolation
  let x1 = c[T0 - 1];
  let x2 = c[T0];
  let x3 = c[T0 + 1];
  let a = (x1 + x3 - 2 * x2) / 2;
  let b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  return sampleRate / T0;
}

/**
 * Finds the closest note for a given frequency.
 */
export function getNoteFromFrequency(frequency: number): { note: string; cents: number } {
  const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const n = 12 * (Math.log(frequency / 440) / Math.log(2));
  const noteNum = Math.round(n) + 69;
  const note = noteStrings[noteNum % 12] + (Math.floor(noteNum / 12) - 1);
  const cents = Math.floor(1200 * (Math.log(frequency / (440 * Math.pow(2, (noteNum - 69) / 12))) / Math.log(2)));
  return { note, cents };
}
