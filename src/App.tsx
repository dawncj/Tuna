import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music, BookOpen, Guitar } from 'lucide-react';
import Tuner from '@/src/components/Tuner';
import SongLibrary from '@/src/components/SongLibrary';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Rail / Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Guitar className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">StrumTune</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">Community</span>
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">Lessons</span>
            <span className="hover:text-emerald-500 transition-colors cursor-pointer">Settings</span>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
        <Tabs defaultValue="tuner" className="w-full flex flex-col gap-8">
          <div className="flex justify-center">
            <TabsList className="bg-zinc-900 border border-zinc-800 h-14 p-1 rounded-2xl shadow-2xl">
              <TabsTrigger 
                value="tuner" 
                className="rounded-xl px-8 h-full data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400 data-[state=active]:shadow-lg transition-all duration-300"
              >
                <Music className="w-4 h-4 mr-2" />
                <span className="font-bold uppercase tracking-widest text-[10px]">Tuner</span>
              </TabsTrigger>
              <TabsTrigger 
                value="library" 
                className="rounded-xl px-8 h-full data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-400 data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                <span className="font-bold uppercase tracking-widest text-[10px]">Library</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tuner" className="mt-0 focus-visible:outline-none">
            <Tuner />
          </TabsContent>
          
          <TabsContent value="library" className="mt-0 focus-visible:outline-none h-full">
            <SongLibrary />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <div className="flex items-center gap-2">
              <Guitar className="w-5 h-5 text-emerald-500" />
              <span className="font-black tracking-tighter uppercase italic">StrumTune</span>
            </div>
            <p className="text-zinc-600 text-xs tracking-wide uppercase">© 2026 Professional Guitar Tools. All rights reserved.</p>
          </div>
          
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
