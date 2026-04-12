
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Settings2, Music, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TUNINGS, Tuning, getFrequencyFromNote } from '@/src/constants';
import { autoCorrelate, getNoteFromFrequency } from '@/src/lib/pitch-detection';

export default function Tuner() {
  const [isListening, setIsListening] = useState(false);
  const [customTunings, setCustomTunings] = useState<Tuning[]>([]);
  const [currentTuning, setCurrentTuning] = useState<Tuning>(TUNINGS[0]);
  const [pitch, setPitch] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [cents, setCents] = useState<number>(0);
  const [targetNote, setTargetNote] = useState<string | null>(null);

  // New tuning form state
  const [newTuningName, setNewTuningName] = useState('');
  const [newTuningNotes, setNewTuningNotes] = useState(['E2', 'A2', 'D3', 'G3', 'B3', 'E4']);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Load custom tunings
  useEffect(() => {
    const saved = localStorage.getItem('custom_tunings');
    if (saved) {
      setCustomTunings(JSON.parse(saved));
    }
  }, []);

  const allTunings = [...TUNINGS, ...customTunings];

  const handleCreateTuning = () => {
    if (!newTuningName) return;
    const newTuning: Tuning = {
      name: newTuningName,
      notes: newTuningNotes,
      frequencies: newTuningNotes.map(n => getFrequencyFromNote(n)),
      isCustom: true
    };
    const updated = [...customTunings, newTuning];
    setCustomTunings(updated);
    localStorage.setItem('custom_tunings', JSON.stringify(updated));
    setCurrentTuning(newTuning);
    setIsDialogOpen(false);
    setNewTuningName('');
  };

  const handleDeleteTuning = (name: string) => {
    const updated = customTunings.filter(t => t.name !== name);
    setCustomTunings(updated);
    localStorage.setItem('custom_tunings', JSON.stringify(updated));
    if (currentTuning.name === name) {
      setCurrentTuning(TUNINGS[0]);
    }
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
    setPitch(null);
    setNote(null);
    setCents(0);
  };

  const updatePitch = () => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const buffer = new Float32Array(analyserRef.current.fftSize);
    analyserRef.current.getFloatTimeDomainData(buffer);
    
    const frequency = autoCorrelate(buffer, audioContextRef.current.sampleRate);
    
    if (frequency !== -1) {
      const { note: detectedNote, cents: detectedCents } = getNoteFromFrequency(frequency);
      setPitch(frequency);
      setNote(detectedNote);
      setCents(detectedCents);

      // Find if this note is part of the current tuning
      const target = currentTuning.notes.find(n => n.startsWith(detectedNote.replace(/[0-9]/g, '')));
      setTargetNote(target || null);
    }

    animationFrameRef.current = requestAnimationFrame(updatePitch);
  };

  useEffect(() => {
    return () => stopListening();
  }, []);

  const getCentsColor = (c: number) => {
    if (Math.abs(c) < 5) return 'text-emerald-500';
    if (Math.abs(c) < 15) return 'text-yellow-500';
    return 'text-rose-500';
  };

  const getCentsRotation = (c: number) => {
    // Map -50 to 50 cents to -45 to 45 degrees
    return (c / 50) * 45;
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto p-4">
      <Card className="bg-zinc-950 border-zinc-800 text-zinc-100 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 to-transparent pointer-events-none" />
        
        <CardHeader className="relative z-10 border-b border-zinc-800/50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Music className="w-6 h-6 text-emerald-500" />
                StrumTune
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Precision Guitar Tuner
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select 
                value={currentTuning.name} 
                onValueChange={(val) => setCurrentTuning(allTunings.find(t => t.name === val) || TUNINGS[0])}
              >
                <SelectTrigger className="w-[180px] bg-zinc-900 border-zinc-800 text-zinc-300">
                  <Settings2 className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Select Tuning" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                  {allTunings.map(t => (
                    <div key={t.name} className="flex items-center justify-between px-2 py-1 hover:bg-zinc-800 rounded-md group">
                      <SelectItem value={t.name} className="flex-1">{t.name}</SelectItem>
                      {t.isCustom && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTuning(t.name);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger render={<Button variant="outline" size="icon" className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-emerald-500" />}>
                  <Plus className="w-4 h-4" />
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                  <DialogHeader>
                    <DialogTitle>Create Custom Tuning</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Tuning Name</Label>
                      <Input 
                        id="name" 
                        placeholder="e.g. Open D" 
                        className="bg-zinc-900 border-zinc-800"
                        value={newTuningName}
                        onChange={(e) => setNewTuningName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Notes (6 strings, e.g. E2, A2...)</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {newTuningNotes.map((note, i) => (
                          <Input 
                            key={i}
                            className="bg-zinc-900 border-zinc-800 font-mono"
                            value={note}
                            onChange={(e) => {
                              const updated = [...newTuningNotes];
                              updated[i] = e.target.value.toUpperCase();
                              setNewTuningNotes(updated);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateTuning} className="bg-emerald-600 hover:bg-emerald-500">
                      Save Tuning
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 pt-12 pb-16 flex flex-col items-center gap-12">
          {/* Tuner Gauge */}
          <div className="relative w-64 h-32 flex justify-center items-end overflow-hidden">
            {/* Gauge Background */}
            <div className="absolute bottom-0 w-64 h-64 border-4 border-zinc-800 rounded-full" />
            
            {/* Gauge Markings */}
            <div className="absolute bottom-0 w-full flex justify-between px-4 pb-2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
              <span>Flat</span>
              <span>Sharp</span>
            </div>

            {/* Center Line */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-24 bg-zinc-800" />
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-1 h-4 bg-emerald-500/50 blur-[2px]" />

            {/* Needle */}
            <motion.div 
              className="absolute bottom-0 left-1/2 w-1 h-28 origin-bottom bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              animate={{ rotate: getCentsRotation(cents) }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              style={{ x: '-50%' }}
            />

            {/* Target Zone */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-32 bg-emerald-500/5 pointer-events-none" />
          </div>

          {/* Note Display */}
          <div className="flex flex-col items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.div 
                key={note || 'none'}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-8xl font-black tracking-tighter text-zinc-100"
              >
                {note || '--'}
              </motion.div>
            </AnimatePresence>
            
            <div className={`text-sm font-mono font-medium uppercase tracking-[0.2em] ${getCentsColor(cents)}`}>
              {note ? (Math.abs(cents) < 5 ? 'Perfect' : `${cents > 0 ? '+' : ''}${cents} cents`) : 'Waiting for signal...'}
            </div>
          </div>

          {/* Tuning Reference */}
          <div className="grid grid-cols-6 gap-3 w-full max-w-md">
            {currentTuning.notes.map((n, i) => (
              <div 
                key={i} 
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all duration-300 ${
                  note?.replace(/[0-9]/g, '') === n.replace(/[0-9]/g, '') 
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                    : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
                }`}
              >
                <span className="text-xs font-mono opacity-50">{i + 1}</span>
                <span className="text-lg font-bold">{n.replace(/[0-9]/g, '')}</span>
              </div>
            ))}
          </div>

          <Button 
            size="lg"
            variant={isListening ? "destructive" : "default"}
            className={`w-full max-w-xs h-14 text-lg font-bold uppercase tracking-widest transition-all duration-300 ${
              !isListening ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : ''
            }`}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? (
              <><MicOff className="w-5 h-5 mr-2" /> Stop Tuning</>
            ) : (
              <><Mic className="w-5 h-5 mr-2" /> Start Tuning</>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-zinc-900 border-zinc-800 text-zinc-400">
        <CardContent className="p-4 text-xs leading-relaxed">
          <p>
            <strong className="text-zinc-200">Pro Tip:</strong> For best results, pluck the string clearly and let it ring. 
            Ensure your environment is quiet. The needle shows how far you are from the perfect pitch.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
