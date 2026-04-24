/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { useState, useEffect } from 'react';

export default function App() {
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour12: false }));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-dark-bg flex items-center justify-center p-4 selection:bg-neon-magenta selection:text-black">
      <div className="noise" />
      <div className="w-full max-w-6xl h-[800px] bg-black text-white p-8 font-mono overflow-hidden border-2 border-neon-cyan relative shadow-[10px_10px_0_#ff00ff]">
        <div className="scanline" />
        
        <div className="grid grid-cols-4 grid-rows-6 gap-6 h-full relative z-10">
          
          {/* Header / Branding */}
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="col-span-3 row-span-1 bg-black border border-neon-cyan p-6 flex items-center shadow-[-5px_-5px_0_#00f3ff]"
          >
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-neon-cyan glitch-text" data-text="SYST_NEXUS_V.2.4">SYST_NEXUS_V.2.4</h1>
              <p className="text-[10px] uppercase tracking-[0.5em] text-neon-magenta font-bold mt-1">Dual-Core / Kernel 0.99.1 / Auth_Root</p>
            </div>
            <div className="ml-auto flex items-center gap-8">
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Core_Temp</p>
                <div className="flex items-center gap-2 justify-end">
                    <span className="text-sm text-neon-lime font-bold">STABLE // 302K</span>
                </div>
              </div>
              <div className="h-10 w-[2px] bg-neon-magenta/30"></div>
              <div className="text-right min-w-32">
                <p className="text-2xl font-black leading-none tracking-tighter text-white tabular-nums">{time}</p>
              </div>
            </div>
          </motion.div>

          {/* Current Score Cell */}
          <motion.div 
             initial={{ y: -50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             className="col-span-1 row-span-1 bg-black border border-neon-magenta p-4 flex flex-col justify-center items-center shadow-[5px_5px_0_#ff00ff]"
          >
            <span className="text-[10px] text-neon-magenta uppercase font-black tracking-widest mb-1 italic">Current_Val</span>
            <span className="text-5xl font-black text-white tracking-tighter tabular-nums">{String(score).padStart(5, '0')}</span>
          </motion.div>

          {/* Music Queue (Sidebar) */}
          <div className="col-span-1 row-span-4 flex flex-col gap-4 overflow-hidden">
             <MusicPlayer mode="sidebar" />
          </div>

          {/* Snake Game Module (Main Window) */}
          <div className="col-span-2 row-span-4 bg-black border-2 border-neon-cyan relative overflow-hidden group">
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0, 243, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 243, 255, 0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             <div className="h-full w-full flex items-center justify-center p-4">
                <SnakeGame onScoreUpdate={setScore} onHighScoreUpdate={setHighScore} />
             </div>
             <div className="absolute top-4 left-4">
                <div className="px-2 py-0.5 bg-neon-cyan text-black text-[9px] font-black uppercase tracking-tighter">[ GRID_ACTIVE ]</div>
             </div>
          </div>

          {/* Performance Stats */}
          <div className="col-span-1 row-span-2 bg-black border border-white/20 p-5">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-4 italic">Environment_Flow</h2>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] mb-2 uppercase font-bold tracking-tighter text-neon-cyan">
                  <span>Logic_Load</span>
                  <span>42%</span>
                </div>
                <div className="h-1 bg-white/10 overflow-hidden relative">
                  <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-neon-cyan relative z-10" />
                  <div className="absolute top-0 left-0 h-full w-full bg-neon-cyan/20 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-2 uppercase font-bold tracking-tighter text-neon-magenta">
                  <span>Wave_Sync</span>
                  <span>98%</span>
                </div>
                <div className="h-1 bg-white/10 overflow-hidden relative">
                  <motion.div initial={{ width: 0 }} animate={{ width: '98%' }} className="h-full bg-neon-magenta relative z-10" />
                  <div className="absolute top-0 left-0 h-full w-full bg-neon-magenta/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* High Score Cell */}
          <div className="col-span-1 row-span-2 bg-black border border-white/20 p-5 flex flex-col justify-between">
             <h2 className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Global_Record</h2>
             <div>
               <p className="text-4xl font-black text-neon-lime tracking-tighter tabular-nums">{String(highScore).padStart(5, '0')}</p>
               <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">Pos_Index: 0x000F</p>
             </div>
             <div className="w-full h-[1px] bg-neon-cyan/20" />
          </div>

          {/* Music Player Controller (Bottom) */}
          <div className="col-span-4 row-span-1 bg-black border border-neon-cyan/50 p-0 overflow-hidden">
             <MusicPlayer mode="controller" />
          </div>

        </div>
      </div>
    </main>
  );
}
