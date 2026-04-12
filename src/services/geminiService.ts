
import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function parseSongFromContent(content: string): Promise<Partial<Song>> {
  if (!content) throw new Error("No content provided to parse");
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Extract the song title, artist, tuning, and lyrics/chords from the following content. 
    Format the lyrics and chords with section headers in brackets like [Verse 1], [Chorus], etc.
    Place chords on their own lines above the lyrics they correspond to.
    
    Content:
    ${content.substring(0, 10000)}`, // Limit content size
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          artist: { type: Type.STRING },
          tuning: { type: Type.STRING },
          content: { type: Type.STRING, description: "The lyrics and chords in the requested format" },
        },
        required: ["title", "artist", "tuning", "content"],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to parse song content");
  }
}

export async function getSongRecommendations(currentSongs: Song[]): Promise<Array<{ title: string; artist: string; reason: string }>> {
  const songList = currentSongs.map(s => `${s.title} by ${s.artist}`).join(", ");
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on the following songs in my library: ${songList}, recommend 5 new songs I might like to play on guitar. 
    Provide the title, artist, and a brief reason why it's a good recommendation for a guitar player.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            reason: { type: Type.STRING },
          },
          required: ["title", "artist", "reason"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse recommendations", e);
    return [];
  }
}

export async function getSongContent(title: string, artist: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Provide the lyrics and chords for the song "${title}" by "${artist}".
    Format it with section headers in brackets like [Verse 1], [Chorus], etc.
    Place chords on their own lines above the lyrics they correspond to.
    Include the standard tuning for this song at the beginning.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });

  return response.text || "";
}

export async function searchAndAddSong(query: string): Promise<Partial<Song>> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Find the lyrics and chords for the song matching this query: "${query}".
    Return the song title, artist, standard tuning, and the full lyrics with chords.
    Format the lyrics and chords with section headers in brackets like [Verse 1], [Chorus], etc.
    Place chords on their own lines above the lyrics they correspond to.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          artist: { type: Type.STRING },
          tuning: { type: Type.STRING },
          content: { type: Type.STRING },
        },
        required: ["title", "artist", "tuning", "content"],
      },
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse search result", e);
    throw new Error("Failed to find song content");
  }
}
