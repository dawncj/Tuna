
export interface Tuning {
  name: string;
  notes: string[];
  frequencies: number[];
  isCustom?: boolean;
}

const NOTE_STRINGS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function getFrequencyFromNote(note: string): number {
  const name = note.slice(0, -1);
  const octave = parseInt(note.slice(-1));
  const semitones = NOTE_STRINGS.indexOf(name) + (octave + 1) * 12;
  return 440 * Math.pow(2, (semitones - 69) / 12);
}

export const TUNINGS: Tuning[] = [
  {
    name: "Standard",
    notes: ["E2", "A2", "D3", "G3", "B3", "E4"],
    frequencies: [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]
  },
  {
    name: "Open D",
    notes: ["D2", "A2", "D3", "F#3", "A3", "D4"],
    frequencies: [73.42, 110.00, 146.83, 185.00, 220.00, 293.66]
  },
  {
    name: "Drop D",
    notes: ["D2", "A2", "D3", "G3", "B3", "E4"],
    frequencies: [73.42, 110.00, 146.83, 196.00, 246.94, 329.63]
  },
  {
    name: "DADGAD",
    notes: ["D2", "A2", "D3", "G3", "A3", "D4"],
    frequencies: [73.42, 110.00, 146.83, 196.00, 220.00, 293.66]
  },
  {
    name: "Open G",
    notes: ["D2", "G2", "D3", "G3", "B3", "D4"],
    frequencies: [73.42, 98.00, 146.83, 196.00, 246.94, 293.66]
  },
  {
    name: "Half Step Down",
    notes: ["Eb2", "Ab2", "Db3", "Gb3", "Bb3", "Eb4"],
    frequencies: [77.78, 103.83, 138.59, 185.00, 233.08, 311.13]
  }
];

export interface Song {
  id: string;
  title: string;
  artist: string;
  tuning: string;
  content: string; // Markdown or custom format for lyrics and chords
}

export const SONGS: Song[] = [
  {
  id: "best-part",
  title: "Best Part",
  artist: "Daniel Caesar & H.E.R.",
  tuning: "Standard",
  content: `
[Intro]
A#maj7   Fm7   D#maj7   F#maj7

[Verse 1]
A#maj7
     You don't know babe
Fm7
    When you hold me
D#maj7
     And kiss me slowly
         F#maj7
It's the sweetest thing
[Intro]
A#maj7   Fm7   D#maj7   F#maj7
 
[Verse 1]
A#maj7
     You don't know babe
Fm7
    When you hold me
D#maj7
     And kiss me slowly
         F#maj7
It's the sweetest thing
A#maj7
     And it don't change
Fm7
    If I had it my way
D#maj7                        F#maj7
     You would know that you are
 
[Pre-Chorus 1]
A#maj7
   You're the coffee that I need in the morning
Fm7
  You're my sunshine in the rain when it's pouring
D#maj7
   Won't you give yourself to me
        F#maj7
Give it all, oh
 
[Chorus]
             A#maj7
I just wanna see
               Fm7                  D#maj7
I just wanna see how beautiful you are
                  F#maj7
You know that I see it
                 A#maj7
I know you're a star
                Fm7
Where you go I follow
               D#maj7
No matter how far
              F#maj7
If life is a movie
                      A#maj7 Fm7
Oh, you're the best part, oh
                 D#maj7  F#maj7
You're the best part, oh
      A#maj7
Best part
 
[Verse 2]
A#maj7
It's the sunrise
Fm7
    And those brown eyes, yes
D#maj7                        F#maj7
     You're the one that I desire
A#maj7
     When we wake up
Fm7
    And then we make love
D#maj7                    F#maj7
     It makes me feel so nice
 
[Pre-Chorus 2]
A#maj7
   You're my water when I'm stuck in the desert
Fm7
  You're the Tylenol I take when my head hurts
D#maj7                        F#maj7
   You're the sunshine on my life
 
[Chorus]
A#maj7               Fm7                  D#maj7
     I just wanna see how beautiful you are
                  F#maj7
You know that I see it
                 A#maj7
I know you're a star
                Fm7
Where you go I follow
               D#maj7
No matter how far
              F#maj7
If life is a movie
                       A#maj7 Fm7
Then you're the best part, oh
                 D#maj7  F#maj7
You're the best part, oh
      A#maj7
Best part
 
[Outro]
A#maj7
If you love me won't you say something
Fm7
  If you love me won't you
Won't you
D#maj7
   If you love me won't you say something
F#maj7
    If you love me won't you
Love me, won't you
 
A#maj7
   If you love me won't you say something
Fm7
  If you love me won't you
D#maj7
   If you love me won't you say something
F#maj7
    If you love me won't you
Love me, won't you
 
A#maj7
   If you love me won't you say something
Fm7
  If you love me won't you
D#maj7
   If you love me won't you say something
F#maj7
    If you love me won't you
Love me, won't you
  `
  },
  {
    id: "1",
    title: "Wish You Were Here",
    artist: "Pink Floyd",
    tuning: "Standard",
    content: `
[Intro]
G Em7 G Em7 G Em7 A7sus4 G

[Verse 1]
C                     D
So, so you think you can tell
            Am
Heaven from Hell
                G
Blue skies from pain
                     D
Can you tell a green field
                  C
From a cold steel rail?
               Am
A smile from a veil?
                     G
Do you think you can tell?

[Chorus]
                    C
And did they get you to trade
                D
Your heroes for ghosts?
               Am
Hot ashes for trees?
                G
Hot air for a cool breeze?
                D
Cold comfort for change?
            C
Did you exchange
                      Am
A walk on part in the war
                         G
For a lead role in a cage?
    `
  },
  {
    id: "2",
    title: "Blackbird",
    artist: "The Beatles",
    tuning: "Standard",
    content: `
[Verse 1]
G        Am7      G/B
Blackbird singing in the dead of night
C          D          D#dim7    Em
Take these broken wings and learn to fly
D    C#dim7 C      Cm
All your life
G/B          A7          D7      G
You were only waiting for this moment to arise

[Verse 2]
G        Am7      G/B
Blackbird singing in the dead of night
C          D          D#dim7    Em
Take these sunken eyes and learn to see
D    C#dim7 C      Cm
All your life
G/B          A7          D7      G
You were only waiting for this moment to be free
    `
  },
  {
    id: "3",
    title: "Everlong",
    artist: "Foo Fighters",
    tuning: "Drop D",
    content: `
[Intro]
Dmaj7 Bsus2 Gsus2 Bsus2 (x2)

[Verse 1]
Dmaj7
Hello
Bsus2
I've waited here for you
Gsus2   Bsus2
Everlong
Dmaj7
Tonight
Bsus2
I throw myself into
Gsus2
And out of the red
Bsus2
Out of her head she sang

[Chorus]
A
And I wonder
G
When I sing along with you
A
If everything could ever feel this real forever
G
If anything could ever be this good again
A
The only thing I'll ever ask of you
G
You've got to promise not to stop when I say when
Dmaj7
She sang
    `
  }
];
