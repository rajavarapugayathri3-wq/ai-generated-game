export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  color: string;
}

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Drift',
    artist: 'AI Synth-01',
    duration: 184,
    color: 'neon-cyan',
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'AI Synth-02',
    duration: 212,
    color: 'neon-magenta',
  },
  {
    id: '3',
    title: 'Grid Runner',
    artist: 'AI Synth-03',
    duration: 156,
    color: 'neon-lime',
  },
];

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}
