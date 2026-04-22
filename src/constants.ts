
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
  },
  {id: "4",
    title: "Heal",
    artist: "Tom Odell",
    tuning: "Standard",
    content: `
  
Capo 1
 
 
[Intro]
Am G C/E F
Am G C/E F
 
[Verse 1]
Am       G       C/E      F
Take my mind and take my pain
         Am     G     C/E       F
Like an empty bottle takes the rain
      Am G/B      F/C C     C/E    F
And    heal,       heal,    heal, heal
 
Am      G        C/E      F
Take my past and take my sins
         Am    G   C/E        F
Like an empty sail takes the wind
      Am G/B      F/C C     C/E    F
And    heal,       heal,    heal, heal
 
[Chorus]
             G     C    F/D
And tell me some things last
             G     C    F/D
And tell me some things last
 
Am G C/E F
Am G C/E F
 
[Verse 2]
Am       G        C/E      F
Take my heart and take my hand
         Am    G         C/E   F
Like an ocean takes the dirty sand
      Am G/B      F/C C     C/E    F
And    heal,       heal,    heal, heal
 
Am       G       C/E      F
Take my mind and take my pain
         Am    G     C/E        F
Like an empty bottle takes the rain
      Am G/B      F/C C     C/E    F
And    heal,       heal,    heal, heal
 
[Chorus]
             G    C     F/D
And tell me some things last
             G    C     F/D
And tell me some things last
             G    C     F/D
And tell me some things last
             G    C     F/D
And tell me some things last
`
  },
  {id: "5",
    title: "She Wolf",
    artist: "David Guetta & Sia",
    tuning: "Standard",
    content: `
[Intro]
Em Bm D A
 
[Verse 1]
Em             Bm        D      A
   A shot in the dark a past lost in space
Em             Bm       D             A
   where do i start the past and the chase
Em                Bm          D       A
   you hunted me down like a wolf a predator 
Em               Bm      D          A
   i felt like a deer in love Lights
 
[Pre-chorus]
D           Bm        F#m       A
   You love me and i froze in time 
D        Bm        F#m        A
   Hungry for that flesh of mine 
D                  Bm           F#m
   but i cant compete with that she-wolf
         A               D
who has brought me to my knees 
D              Bm                  F#m
   what do you see in those yellow eyes
        A                   Em
Cause I'm falling to pieces
 
[Chorus]
     Em               Bm
I'm falling to pieces
     Bm               D
I'm falling to pieces
     D                A
I'm falling to pieces
     A
I'm falling to pieces
 
Em Bm D A 
x2
 
[Verse 2]
Em               Bm        D         A
   Did she lie in wait was i bait to pull you in
Em                   Bm       D         A
   The thrill of the kill you feel is a sin
Em              Bm     D        A
   i lay with the wolves alone it seems
Em                 Bm       D      A
   i thought i was part of you
 
[Pre-chorus]
D           Bm        F#m       A
   You loved me and i froze in time 
D        Bm        F#m        A
   Hungry for that flesh of mine 
D                  Bm           F#m
   but i cant compete with that she-wolf
         A               D
who has brought me to my knees 
D              Bm                  F#m
   what do you see in those yellow eyes
        A                   Em
As I'm falling to pieces
 
[Chorus]
     Em               Bm
I'm falling to pieces
     Bm               D
I'm falling to pieces
     D                A
I'm falling to pieces
     A
I'm falling to pieces
 
Em Bm D A 
x4
 
[Chorus]
     Em               Bm
I'm falling to pieces
     Bm               D
I'm falling to pieces
     D                A
I'm falling to pieces
     A
I'm falling to pieces
 
[Outro]
Em Bm D A
`
  },
  {id: "6",
    title: "Ceilings",
    artist: "Lizzy McAlpine",
    tuning: "Standard",
    content: `
Capo 2

[Intro]
Cadd9   Em
Cadd9   G D
Cadd9   Em
D
 
[Verse 1]
Cadd9      Em
  Ceilings, plaster
Cadd9            G            D
  Can't you just make it move faster?
Cadd9   Em                 D
  Lovely to be sitting here with you
                          Cadd9   Em
You're kinda cute but it's raining harder
Cadd9          G           D
  My shoes are now full of water
Cadd9   Em               D
  Lovely to be rained on with you
                       Cadd9
It's kinda cute but it's
 
[Chorus]
Cadd9
So short
                        G
Then you're driving me home
                  D
And I don't wanna leave
                Cadd9
But I have to go
 
You kiss me in your car
       G                         D
And it feels like the start of a movie
         Em
I've seen before
  D
Before
 
[Verse 2]
Cadd9        Em
  Bed sheets, no clothes
Cadd9           G       D
  Touch me like nobody else does
Cadd9   Em               D
  Lovely to just lay here with you
                       Cadd9    Em
You're kinda cute and I would say all of this
Cadd9               G         D
  But I don't wanna ruin the moment
Cadd9       B7                 C          D
  Lovely to sit between comfort and chaos
 
[Chorus]
Cadd9
  But it's over
                        G
Then you're driving me home
                   D                   Cadd9
And it kinda comes out as I get up to go
 
You kiss me in your car
       G                         D
And it feels like the start of a movie
 
I've seen before
 
Cadd9
  But it's not real
                G
And you don't exist
              D                        Cadd9
And I can't recall the last time I was kissed
 
It hits me in the car
       G                       D
And it feels like the end of a movie
          Emadd9
I've seen        before
  D
Before
`
  },
  {id: "7",
    title: "When we were young",
    artist: "Adele",
    tuning: "Standard",
    content: `
Capo 1

[INTRO]
 
Bm   D/F#   G   D/F#
Em          D
 
 
[VERSE]
 
Bm         D/F#                G       D/F#
Everybody loves the things you do
                  Em                  D
From the way you talk to the way you move
Bm        D/F#             G       D/F#
Everybody here is watching you
                     Em                          D
Cause you feel like home, you're like a dream come true
 
Bm        D/F#              G       D/F#
But if by chance you're here alone
             Em              D
Can I have a moment before I go
Bm                 D/F#              G       D/F#
Cause I've been by myself all night long
               Em                A
Hoping you're someone I used to know
 
 
[PRE-CHORUS]
 
                  G       A
You look like a movie, 
                  F#m       G
You sound like a song
               G        A
My god this reminds me   
                  F#m     A
Of when we were young
 
 
[CHORUS]
 
         D           F#m                G              A
Let me photograph you in this light, in case it is the last time
         D       F#m            G              A
So it might be exactly like we were before we realized
         Bm            D/F#               G              Gm
We were sad of getting old, it made us restless
                    Em                   A     F#m
It was just like a movie, it was just a song
 
 
[VERSE]
 
Bm        D/F#              G       D/F#
I was so scared to face my fears
              Em                   D
Cause nobody told me that you'd be here
Bm             D/F#         G       D/F#
And I swear if you moved overseas
               Em                 D
That's what you said when you left me
 
 
[PRE-CHORUS]
 
                      G       A
You still look like a movie, 
                       F#m       G
You still sound like a song
               G        A
My god this reminds me   
                  F#m     A
Of when we were young
 
 
[CHORUS]
 
         D           F#m                G              A
Let me photograph you in this light, in case it is the last time
         D       F#m            G              A
So it might be exactly like we were before we realized
         Bm            D/F#               G              Gm
We were sad of getting old, it made us restless
                    Em                   A     F#m
It was just like a movie, it was just a song
 
 
[BRIDGE]
 
      Bm            D/A
(When we were young)
      G            D/F#
(When we were young)
      Em
(When we were young)
      A            A#
(When we were young)
 
      Bm      D/A      G               D/F#
It's hard to admit that everything just takes me back
       Em
To when you were there
         A            A
To when you were there
         Bm              D/A     G               D/F#
And the part of me keeps hoping on just in case it hasn't gone
        Em
I guess I still care
     A#             F#m
Do you still care?
 
[PRE-CHORUS]
 
                    G       A
It was just like a movie, 
                    F#m       G
It was just like a song
               G        A
My god this reminds me   
                  F#m     A
Of when we were young
 
[CHORUS]
 
      D                  F#m
(When we were young)
      G                  A
(When we were young)
      D                  F#m
(When we were young)
      G                  A
(When we were young)
 
         D           F#m                G              A
Let me photograph you in this light, in case it is the last time
         D       F#m            G              A
So it might be exactly like we were before we realized
         Bm            D/F#              G              A
We were sad of getting old, it made us restless
            Bm            D/F#               G          Gm
Oh, I'm so mad I'm getting old, it makes me reckless
 
[OUTRO]
 
                    Em                        A
It was just like a movie, it was just like a song
              D
When we were young
`
  },
  {id: "8",
    title: "Where's my love",
    artist: "SYML",
    tuning: "Standard",
    content: `
Capo 3

[Intro]
Bm D G Em
 
 
[Verse 1]
Bm    D    G                   Em
Cold bones, yeah that’s my love
Bm          D          G    Em
She hides away, like a ghost
   Bm                     D              G Em
Ooh does she know that we bleed the same?
   Bm                     D              G
Ooh don’t wanna cry but I break that way
 
 
[Link]
Bm D G Em
 
 
[Verse 2]
Bm    D     G                    Em
Cold sheets, but where’s my love?
Bm             D                   G           Em
I am searching high, I’m searching low in the night
   Bm                     D              G  Em
Ooh does she know that we bleed the same?
   Bm                     D              G
Ooh don’t wanna cry but I break that way
 
 
[Chorus]
A                 F#m                        G
Did she run away, did she run away, I don’t know
A                 F#m                        G
If she ran away, if she ran away, come back home
 
Just come home
 
 
[Link]
Bm D G Em
Bm D G Em
 
 
[Verse 3]
Bm      D    G              Em
I got a fear, oh in my blood
Bm              D           G               Em
She was carried up into the clouds, high above
   Bm             D             G Em
Ooh if you bled I bleed the same
   Am                    G         D
Ooh if you’re scared I’m on my way
 
 
[Chorus]
A                 F#m                        G
Did you run away, did you run away, I don’t need to know
A                 F#m                        G
If you ran away, if you ran away, come back home
 
Just come home
 
 
[Outro]
Bm D G Em
Bm D G Em
Bm
`
  },
  {id: "9",
    title: "Need you now",
    artist: "Lady A",
    tuning: "Standard",
    content: `
Capo 4

[Intro]
F Am
 
[Verse 1]
F                                                   Am
Picture perfect memories scattered all around the floor
F                                                  Am
Reaching for the phone 'cause I can't fight it anymore
      F                            Am
And I wonder if I ever cross your mind
          F                F
For me it happens all the time
 
[Chorus]
       C                                      Em
It's a quarter after one, I'm all alone and I need you now
C                                                  Em
Said I wouldn't call, but I lost all control and I need you now
       F                               F                  F Am
And I don't know how I can do without, I just need you now
 
[Verse 2]
 F                                                 Am
Another shot of whiskey, can't stop looking at the door
F                                                 Am
Wishing you'd come sweeping in the way you did before
      F                            Am
And I wonder if I ever cross your mind
          F                F
For me it happens all the time
 
[Chorus]
       C                                           Em
It's a quarter after one, I'm a little drunk and I need you now
C                                                  Em
Said I wouldn't call, but I lost all control and I need you now
       F                               F
And I don't know how I can do without, I just need you now
 
[Bridge]
Am G/B C F Gsus (x2)
         F                               Am G
Yes I'd rather hurt than feel nothing at all
 
[Chorus]
       C                                      Em
It's a quarter after one, I'm all alone and I need you now
      C                                                  Em
And I said I wouldn't call, but I'm a little drunk and I need you now
       F                               F               C
And I don't know how I can do without, I just need you now
 
[Outro]
Em               C  Em C
 I just need you now
Em                  C  Em C
 Oh baby I need you now
`
  },
  {id: "10",
    title: "Slipping through my fingers",
    artist: "ABBA",
    tuning: "Standard",
    content: `
Capo 3

[Verse 1]
 
G               Gm
Schoolbag in hand
            D           F#m
She leaves home in the early morning
G       Gm
Waving goodbye
        D               F#m
With an absent-minded smile
G           Gm
I watch her go
        D               F#m
With a surge of that well-known sadness
G               A               D
And I have to sit down for a while
 
 
[Pre-Chorus]
 
    G                A/C#          D       F#
The feeling that I'm losing her forever
    G              A            D        D/F#
And without really entering her world
    G              A/C#           D              Asus4         Dsus4   D
I'm glad whenever I can share her laughter, that funny little girl
 
 
[Chorus]
 
                      G             D
Slipping through my fingers all the time
          F#m           Em
I try to capture every minute
     G       D
The feeling in it
                     Asus4  A       D
Slipping through my fingers all the time
             G                D
Do I really see what's in her mind
            F#m                 Em
Each time I think I'm close to knowing
      G        D
She keeps on growing
                      Asus4  A      D
Slipping through my fingers all the time
 
 
[Verse 2]
 
G             Gm
Sleep in our eyes
        D         F#m
Her and me at the breakfast table
G         Gm
  Barely awake
      D                F#m
I let precious time go by
G                Gm
Then when she's gone
             D         F#m
There's that odd melancholy feeling
G               A              D
And a sense of guilt I can't deny
 
 
[Pre-Chorus]
 
        G             A/C#       D       F#
What happened to the wonderful adventures
        G        A                 D  D/F#
The places I had planned for us to go (slipping through my fingers all the time)
G                    A/C#
Well some of that we did
             D
But most we didn't
   Asus4             Dsus4   D
And why I just don't know
 
 
[Chorus]
 
                      G             D
Slipping through my fingers all the time
          F#m           Em
I try to capture every minute
     G       D
The feeling in it
                     Asus4  A       D
Slipping through my fingers all the time
             G                D
Do I really see what's in her mind
            F#m                 Em
Each time I think I'm close to knowing
      G        D
She keeps on growing
                      Asus4  A      D
Slipping through my fingers all the time
 
 
[Verse]
 
G                      A                  D       F#
Sometimes I wish that I could freeze the picture
G                     A               D
And save it from the funny tricks of time
  D/F#               G   A  D
Slipping through my fingers
 
 
[Solo]
 
G D F#m Em G D Asus4 A D
 
G D F#m Em G D                    Asus4           D
              Slipping through my fingers all the time
 
 
[Outro]
 
G             Gm
Schoolbag in hand
            D          F#m
She leaves home in the early morning
G       Gm              D            F#m
Waving goodbye with an absent-minded smile
`
   },
   {id: "11",
    title: "Strangers like me",
    artist: "Phil Collins",
    tuning: "Standard",
    content: `
Capo 1
 
 
[Intro]
A  D  A  G Bm
A  D  A  G
 
 
[Verse 1]
A         D       A   G         Bm
 Whatever you do,    I'll do it too
A     D                 A       G
 Show me everything and tell me how
A       D                A      G      Bm   A     D    A    G
 It all means something    and yet nothing to me
 
 
[Pre-chorus 1]
D                       G
  I can see there's so much to learn
     E                 A
It's all so close and yet so far
F#                     B
  I've seen myself as people see me
   G                                         A
Oh I just know there's something bigger out there
 
 
[Chorus]
A      D      A         G   Bm
 I wanna know, can you show me?
A      D                    A       G
 I wanna know about these strangers like me
A        D    A        G   Bm
 Tell me more, please show me
A            D                    A         G
 Something's familiar about these strangers like me
 
 
[Interlude]
A  D  A  G Bm
A  D  A  G
 
 
[Verse 2]
A     D         A     G        Bm      A
  Every gesture,  every move that she makes
      D            A       G
Makes me feel like never before
A        D      A          G        Bm  A     D       A   G
  Why do I have   this growing need to be beside her?
 
 
[Pre-chorus 2]
D                       G
 Ooh, these emotions I never knew
   E                        A
Of some other world far beyond this place
F#                   B
 Beyond the trees, above the clouds
   G                          A
Oh I see before me a new horizon
 
 
[Chorus]
A      D      A         G   Bm
 I wanna know, can you show me?
A      D                    A       G
 I wanna know about these strangers like me
A        D    A        G   Bm
 Tell me more, please show me
A            D                    A         G
 Something's familiar about these strangers like me
 
 
[Bridge]
F#m           G                D
    Come with me now to see my world
              Em                 D
Where there's beauty beyond your dreams
        G                 Dm
Can you feel the things I feel
      Em
Right now, with you?
Em  D      G
     Take my hand
          Em      D         G   A
There's a world I need to know---
 
D  A  G Bm A
D  A  G
 
 
[Chorus]
Bb     Eb     Bb        Ab  Cm
 I wanna know, can you show me?
Bb     Eb                   Bb      Ab
 I wanna know about these strangers like me
Bb       Eb   Bb       Ab  Cm
 Tell me more, please show me
Bb           Eb                   Bb        Ab
 Something's familiar about these strangers like me
Ab
...I wanna know
 
Bb
`
   }
];
