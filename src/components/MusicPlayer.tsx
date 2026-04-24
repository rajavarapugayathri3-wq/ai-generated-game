import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Disc, VolumeX } from 'lucide-react';
import { DUMMY_TRACKS } from '../types';

export default function MusicPlayer({ mode = 'full' }: { mode?: 'full' | 'sidebar' | 'controller' }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const track = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleNext();
            return 0;
          }
          return prev + (100 / track.duration);
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, track.duration, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (percent: number) => {
    const totalSeconds = (percent / 100) * track.duration;
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (mode === 'sidebar') {
    return (
      <div className="bg-black border border-white/20 h-full flex flex-col p-4 shadow-[4px_4px_0_rgba(255,255,255,0.1)]">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-6 italic underline decoration-neon-magenta">Master_Queue</h2>
        <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
          {DUMMY_TRACKS.map((t, idx) => {
            const isActive = idx === currentTrackIndex;
            return (
              <button
                key={t.id}
                onClick={() => { setCurrentTrackIndex(idx); setProgress(0); setIsPlaying(true); }}
                className={`w-full p-2 flex items-center gap-3 transition-none group ${isActive ? 'bg-neon-magenta text-black shadow-[-4px_4px_0_#00f3ff]' : 'border border-white/10 text-white/40 hover:text-white hover:border-white/40'}`}
              >
                <div className={`text-[10px] font-black ${isActive ? 'text-black' : 'text-white/20'}`}>
                  [{String(idx + 1).padStart(2, '0')}]
                </div>
                <div className="overflow-hidden text-left leading-none">
                  <p className="text-[10px] font-black truncate uppercase tracking-tighter">{t.title}</p>
                </div>
                {isActive && (
                   <div className="ml-auto w-1 h-3 bg-black animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (mode === 'controller') {
    return (
      <div className="flex items-center h-full px-8 gap-12 bg-[#000] relative">
        <div className="absolute top-0 left-0 h-[100%] w-1 bg-neon-magenta animate-pulse" />
        
        <div className="flex items-center gap-6 w-1/3">
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="w-12 h-12 border-2 border-neon-cyan flex items-center justify-center shrink-0"
          >
            <Disc className="text-neon-cyan w-6 h-6" />
          </motion.div>
          <div className="overflow-hidden">
            <p className="text-sm font-black truncate uppercase tracking-tighter text-white glitch-text" data-text={track.title}>{track.title}</p>
            <p className="text-[9px] text-neon-magenta uppercase font-black tracking-widest mt-1 italic">{track.artist} // SYST_OUT</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-10">
            <button onClick={handlePrev} className="text-white hover:text-neon-cyan transition-none">
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:scale-110 active:scale-95 transition-none"
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
            </button>
            <button onClick={handleNext} className="text-white hover:text-neon-magenta transition-none">
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-[9px] font-black text-white/30 tabular-nums">{formatTime(progress)}</span>
             <div className="flex-1 h-1 bg-white/10 relative overflow-hidden">
                <motion.div 
                  className="h-full bg-neon-cyan"
                  style={{ width: `${progress}%` }}
                  transition={{ type: 'tween', ease: 'linear' }}
                />
             </div>
             <span className="text-[9px] font-black italic text-white/30 tabular-nums">{formatTime(100)}</span>
          </div>
        </div>

        <div className="w-1/4 flex justify-end items-center gap-4">
           <VolumeX className="w-4 h-4 text-white/20" />
           <div className="text-[9px] font-black text-neon-cyan uppercase tracking-widest">[ DECODING_AUDIO ]</div>
        </div>
      </div>
    );
  }

  return <div>Legacy Mode Not Supported</div>;
}
