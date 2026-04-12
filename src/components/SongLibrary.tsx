
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Music, ChevronRight, ArrowLeft, BookOpen, Guitar, Plus, Minus, Save, Trash2, Globe, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SONGS, Song } from '@/src/constants';
import { transposeLine } from '@/src/lib/chords';
import { parseSongFromContent, getSongRecommendations, getSongContent, searchAndAddSong } from '@/src/services/geminiService';

export default function SongLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [transposition, setTransposition] = useState(0);
  const [customSongs, setCustomSongs] = useState<Song[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<{ title: string; artist: string; reason: string }>>([]);
  const [isRecommending, setIsRecommending] = useState(false);
  const [addingRecommended, setAddingRecommended] = useState<string | null>(null);

  // New song form state
  const [newSong, setNewSong] = useState({ title: '', artist: '', tuning: 'Standard', content: '' });

  useEffect(() => {
    const saved = localStorage.getItem('custom_songs');
    if (saved) {
      setCustomSongs(JSON.parse(saved));
    }
  }, []);

  const allSongs = [...SONGS, ...customSongs];

  const filteredSongs = allSongs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateSong = () => {
    if (!newSong.title || !newSong.content) return;
    const song: Song = {
      ...newSong,
      id: Date.now().toString()
    };
    const updated = [...customSongs, song];
    setCustomSongs(updated);
    localStorage.setItem('custom_songs', JSON.stringify(updated));
    setIsDialogOpen(false);
    setNewSong({ title: '', artist: '', tuning: 'Standard', content: '' });
  };

  const handleDeleteSong = (id: string) => {
    const updated = customSongs.filter(s => s.id !== id);
    setCustomSongs(updated);
    localStorage.setItem('custom_songs', JSON.stringify(updated));
    if (selectedSong?.id === id) setSelectedSong(null);
  };

  const handleImportFromUrl = async () => {
    if (!importUrl) return;
    setIsImporting(true);
    try {
      const fetchRes = await fetch('/api/fetch-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: importUrl })
      });
      
      if (fetchRes.ok) {
        const { content } = await fetchRes.json();
        const parsedSong = await parseSongFromContent(content);
        
        if (parsedSong.title && parsedSong.content) {
          const song: Song = {
            id: Date.now().toString(),
            title: parsedSong.title,
            artist: parsedSong.artist || 'Unknown',
            tuning: parsedSong.tuning || 'Standard',
            content: parsedSong.content
          };
          const updated = [...customSongs, song];
          setCustomSongs(updated);
          localStorage.setItem('custom_songs', JSON.stringify(updated));
          setIsImportDialogOpen(false);
          setImportUrl('');
          return;
        }
      }

      // Fallback: If fetch fails (e.g. 403) or parsing fails, try searching by URL content/metadata
      console.log("Direct fetch failed or returned no content, trying AI search fallback...");
      const parsedSong = await searchAndAddSong(importUrl);
      
      if (parsedSong.title && parsedSong.content) {
        const song: Song = {
          id: Date.now().toString(),
          title: parsedSong.title,
          artist: parsedSong.artist || 'Unknown',
          tuning: parsedSong.tuning || 'Standard',
          content: parsedSong.content
        };
        const updated = [...customSongs, song];
        setCustomSongs(updated);
        localStorage.setItem('custom_songs', JSON.stringify(updated));
        setIsImportDialogOpen(false);
        setImportUrl('');
      }
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleGetRecommendations = async () => {
    setIsRecommending(true);
    try {
      const recs = await getSongRecommendations(allSongs);
      setRecommendations(recs);
    } catch (error) {
      console.error("Recommendations failed:", error);
    } finally {
      setIsRecommending(false);
    }
  };

  const handleAddRecommended = async (title: string, artist: string) => {
    setAddingRecommended(`${title}-${artist}`);
    try {
      const content = await getSongContent(title, artist);
      const song: Song = {
        id: Date.now().toString(),
        title,
        artist,
        tuning: 'Standard', // Default, content might specify
        content
      };
      const updated = [...customSongs, song];
      setCustomSongs(updated);
      localStorage.setItem('custom_songs', JSON.stringify(updated));
      setRecommendations(prev => prev.filter(r => r.title !== title));
    } catch (error) {
      console.error("Failed to add recommended song:", error);
    } finally {
      setAddingRecommended(null);
    }
  };

  const formatContent = (content: string, transpose: number) => {
    return content.split('\n').map((line, i) => {
      const transposedLine = transpose !== 0 ? transposeLine(line, transpose) : line;
      
      const isChordLine = /^[A-G][b#]?(m|maj|min|dim|aug|sus|add|7|9|11|13)*(\/[A-G][b#]?)?(\s+[A-G][b#]?(m|maj|min|dim|aug|sus|add|7|9|11|13)*(\/[A-G][b#]?)?)*$/.test(transposedLine.trim());
      const isSectionHeader = transposedLine.trim().startsWith('[') && transposedLine.trim().endsWith(']');

      if (isSectionHeader) {
        return <div key={i} className="text-emerald-500 font-bold mt-4 mb-1 text-sm uppercase tracking-wider">{transposedLine}</div>;
      }
      if (isChordLine) {
        return <div key={i} className="text-amber-500 font-bold font-mono text-lg leading-none py-1">{transposedLine}</div>;
      }
      return <div key={i} className="text-zinc-300 min-h-[1.5rem]">{transposedLine}</div>;
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 h-full flex flex-col gap-6">
      <AnimatePresence mode="wait">
        {!selectedSong ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6"
          >
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-emerald-500" />
                  Song Library
                </h2>
                <p className="text-zinc-500">Browse your collection of chords and lyrics.</p>
              </div>
              
              <div className="flex gap-3">
                <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                  <DialogTrigger render={<Button variant="outline" className="border-zinc-800 text-zinc-400 hover:text-emerald-500" />}>
                    <span><Globe className="w-4 h-4 mr-2" /> Import URL</span>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                    <DialogHeader>
                      <DialogTitle>Import from Website</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="url">Ultimate Guitar or Tab URL</Label>
                        <Input 
                          id="url" 
                          placeholder="https://tabs.ultimate-guitar.com/..."
                          className="bg-zinc-900 border-zinc-800"
                          value={importUrl}
                          onChange={(e) => setImportUrl(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleImportFromUrl} 
                        disabled={isImporting}
                        className="bg-emerald-600 hover:bg-emerald-500"
                      >
                        {isImporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                        {isImporting ? 'Importing...' : 'Import Song'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger render={<Button className="bg-emerald-600 hover:bg-emerald-500" />}>
                  <span><Plus className="w-4 h-4 mr-2" /> Add Song</span>
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Song</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input 
                          id="title" 
                          className="bg-zinc-900 border-zinc-800"
                          value={newSong.title}
                          onChange={(e) => setNewSong({...newSong, title: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="artist">Artist</Label>
                        <Input 
                          id="artist" 
                          className="bg-zinc-900 border-zinc-800"
                          value={newSong.artist}
                          onChange={(e) => setNewSong({...newSong, artist: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="content">Lyrics & Chords</Label>
                      <Textarea 
                        id="content" 
                        placeholder="[Verse 1]\nG  C  D\nLyrics go here..."
                        className="bg-zinc-900 border-zinc-800 font-mono h-[300px]"
                        value={newSong.content}
                        onChange={(e) => setNewSong({...newSong, content: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateSong} className="bg-emerald-600 hover:bg-emerald-500">
                      Save Song
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <Input 
                placeholder="Search songs or artists..." 
                className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSongs.map(song => (
                <Card 
                  key={song.id} 
                  className="bg-zinc-900 border-zinc-800 hover:border-emerald-500/50 transition-all cursor-pointer group relative"
                  onClick={() => {
                    setSelectedSong(song);
                    setTransposition(0);
                  }}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                        <Music className="w-6 h-6 text-zinc-500 group-hover:text-emerald-500" />
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-100">{song.title}</h3>
                        <p className="text-sm text-zinc-500">{song.artist}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-zinc-800/50 border-zinc-700 text-zinc-400 font-mono text-[10px]">
                        {song.tuning}
                      </Badge>
                      {customSongs.some(s => s.id === song.id) && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSong(song.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommendations Section */}
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  AI Recommendations
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-zinc-800 text-zinc-400 hover:text-amber-500"
                  onClick={handleGetRecommendations}
                  disabled={isRecommending}
                >
                  {isRecommending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  {recommendations.length > 0 ? 'Refresh Suggestions' : 'Get Recommendations'}
                </Button>
              </div>

              {recommendations.length > 0 && (
                <div className="grid grid-cols-1 gap-3">
                  {recommendations.map((rec, idx) => (
                    <Card key={idx} className="bg-zinc-900/50 border-zinc-800 border-dashed">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-zinc-100">{rec.title}</span>
                            <span className="text-zinc-500 text-sm">— {rec.artist}</span>
                          </div>
                          <p className="text-xs text-zinc-500 italic">{rec.reason}</p>
                        </div>
                        <Button 
                          size="sm" 
                          className="bg-amber-600 hover:bg-amber-500"
                          onClick={() => handleAddRecommended(rec.title, rec.artist)}
                          disabled={addingRecommended === `${rec.title}-${rec.artist}`}
                        >
                          {addingRecommended === `${rec.title}-${rec.artist}` ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4 mr-2" />
                          )}
                          Add to Library
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-6 h-full"
          >
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                onClick={() => setSelectedSong(null)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
              </Button>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg p-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setTransposition(prev => prev - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <div className="px-3 text-xs font-bold font-mono min-w-[60px] text-center">
                    {transposition > 0 ? `+${transposition}` : transposition}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setTransposition(prev => prev + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1">
                  <Guitar className="w-3 h-3 mr-1" /> {selectedSong.tuning} Tuning
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-emerald-500"
                  onClick={() => {
                    const transposedContent = selectedSong.content.split('\n').map(line => transposeLine(line, transposition)).join('\n');
                    const newSongObj: Song = {
                      ...selectedSong,
                      id: `copy-${Date.now()}`,
                      title: `${selectedSong.title} (${transposition > 0 ? '+' : ''}${transposition})`,
                      content: transposedContent
                    };
                    const updated = [...customSongs, newSongObj];
                    setCustomSongs(updated);
                    localStorage.setItem('custom_songs', JSON.stringify(updated));
                    setSelectedSong(newSongObj);
                    setTransposition(0);
                  }}
                >
                  <Save className="w-4 h-4 mr-2" /> Save to My Songs
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-black tracking-tighter text-zinc-100">{selectedSong.title}</h1>
              <p className="text-xl text-zinc-500 font-medium">{selectedSong.artist}</p>
            </div>

            <Card className="bg-zinc-950 border-zinc-800 flex-1 overflow-hidden">
              <ScrollArea className="h-[calc(100vh-350px)] p-8">
                <div className="font-sans whitespace-pre-wrap leading-relaxed max-w-2xl mx-auto">
                  {formatContent(selectedSong.content, transposition)}
                </div>
              </ScrollArea>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
