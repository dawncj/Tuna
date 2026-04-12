
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function transposeChord(chord: string, semitones: number): string {
  return chord.replace(/[A-G][b#]?/g, (match) => {
    // Normalize flats to sharps for calculation
    let normalized = match;
    if (match.endsWith('b')) {
      const root = match[0];
      const index = NOTES.indexOf(root);
      normalized = NOTES[(index - 1 + 12) % 12];
    }

    const index = NOTES.indexOf(normalized);
    if (index === -1) return match;

    const newIndex = (index + semitones + 12) % 12;
    return NOTES[newIndex];
  });
}

export function transposeLine(line: string, semitones: number): string {
  // Simple check for chord line: mostly uppercase, short words, common chord patterns
  const isChordLine = /^[A-G][b#]?(m|maj|min|dim|aug|sus|add|7|9|11|13)*(\/[A-G][b#]?)?(\s+[A-G][b#]?(m|maj|min|dim|aug|sus|add|7|9|11|13)*(\/[A-G][b#]?)?)*$/.test(line.trim());
  
  if (!isChordLine) return line;

  return line.replace(/[A-G][b#]?(m|maj|min|dim|aug|sus|add|7|9|11|13)*(\/[A-G][b#]?)?/g, (match) => {
    return transposeChord(match, semitones);
  });
}
