'use client';

import React, { useEffect, useRef, useState } from 'react';

import '@/styles/rhythmGame.css';

import { hitNote, startGame } from '@/lib/gameLogic';
import { getTrackAnalysis } from '@/lib/spotify';

interface RhythmGameProps {
  token: string;
  currentTrack: string | null;
}

interface Note {
  id: number;
  lane: number;
  time: number;
  y: number;
}

const RhythmGame: React.FC<RhythmGameProps> = ({ token, currentTrack }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchBeats = async () => {
      if (currentTrack) {
        const analysis = await getTrackAnalysis(token, currentTrack);
        const newNotes = analysis.beats.map(
          (
            beat: SpotifyApi.AudioAnalysisResponse['beats'][0],
            index: number
          ) => ({
            id: index,
            lane: Math.floor(Math.random() * 7),
            time: beat.start * 1000,
            y: -50,
          })
        );
        setNotes(newNotes);
        startGame(newNotes, setNotes, setScore, canvasRef);
      }
    };
    fetchBeats();
  }, [currentTrack, token]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: number } = {
        s: 0,
        d: 1,
        f: 2,
        ' ': 3,
        j: 4,
        k: 5,
        l: 6,
      };
      if (keyMap[e.key]) {
        hitNote(keyMap[e.key], notes, setNotes, setScore);
      }
    };

    const handleTouch = (e: TouchEvent) => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        const laneWidth = canvas.width / 7;
        const lane = Math.floor(touchX / laneWidth);
        hitNote(lane, notes, setNotes, setScore);
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const laneWidth = canvas.width / 7;
        const lane = Math.floor(clickX / laneWidth);
        hitNote(lane, notes, setNotes, setScore);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    canvas?.addEventListener('touchstart', handleTouch);
    canvas?.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      canvas?.removeEventListener('touchstart', handleTouch);
      canvas?.removeEventListener('click', handleClick);
    };
  }, [notes]);

  return (
    <div className='game-container'>
      <h1>Score: {score}</h1>
      <canvas
        ref={canvasRef}
        width={700}
        height={500}
        className='game-canvas'
      />
    </div>
  );
};

export default RhythmGame;
