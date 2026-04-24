import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw } from 'lucide-react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

export default function SnakeGame({ 
  onScoreUpdate, 
  onHighScoreUpdate 
}: { 
  onScoreUpdate: (s: number) => void; 
  onHighScoreUpdate: (s: number) => void;
}) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setIsGameOver(false);
    setScore(0);
    onScoreUpdate(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    let ateFood = false;
    let collision = false;
    let nextSnake: Point[] = [];

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        collision = true;
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        collision = true;
        return prevSnake;
      }

      nextSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        ateFood = true;
        // setFood(generateFood()) will be called via useEffect or outside
      } else {
        nextSnake.pop();
      }

      return nextSnake;
    });

    // Handle updates outside setSnake to avoid "Cannot update while rendering" errors
    if (collision) {
      setIsGameOver(true);
    } else if (ateFood) {
      setScore(s => {
        const next = s + 10;
        onScoreUpdate(next);
        return next;
      });
      setFood(generateFood());
    }
  }, [direction, food, isGameOver, generateFood, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': case 'w': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': case 's': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': case 'a': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': case 'd': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, Math.max(80, INITIAL_SPEED - score / 5));
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, score]);

  useEffect(() => {
    onHighScoreUpdate(score);
  }, [score, onHighScoreUpdate]);

  return (
    <div id="snake-game-container" className="flex flex-col items-center gap-6 w-full max-w-[400px]">
      <div className="relative h-full w-full">
        <div 
          className="relative grid bg-[#000] border-2 border-neon-cyan glitch-border overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: '100%',
            aspectRatio: '1/1',
          }}
        >
          {snake.map((segment, index) => (
            <div
              key={`${index}-${segment.x}-${segment.y}`}
              className={`absolute w-[5%] h-[5%] transition-all duration-75 ${index === 0 ? 'bg-neon-cyan z-10' : 'bg-neon-cyan/40'}`}
              style={{
                left: `${segment.x * 5}%`,
                top: `${segment.y * 5}%`,
                boxShadow: index === 0 ? '0 0 10px #00f3ff' : 'none',
              }}
            />
          ))}
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.6, 1, 0.6],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
            className="absolute w-[5%] h-[5%] bg-neon-magenta shadow-[0_0_15px_#ff00ff]"
            style={{
              left: `${food.x * 5}%`,
              top: `${food.y * 5}%`,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }}
          />
          
          <AnimatePresence>
            {isGameOver && (
              <motion.div
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-4 text-center"
              >
                <h2 className="text-5xl font-black italic text-neon-magenta mb-4 tracking-tighter glitch-text" data-text="GAME_OVER">GAME_OVER</h2>
                <div className="text-2xl font-mono text-neon-cyan mb-8 tracking-widest">FINAL_SCORE: {score}</div>
                <button
                  onClick={resetGame}
                  className="cyber-button"
                >
                  REINITIALIZE_SYSTEM()
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center items-center w-full px-2">
         <div className="flex gap-4 text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">
            <span>[ WASD_INPUT_DETECTED ]</span>
         </div>
      </div>
    </div>
  );
}
