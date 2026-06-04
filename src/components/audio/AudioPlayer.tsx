import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, SkipForward, SkipBack, CirclePlay, Loader2, Music4 } from "lucide-react";
import { Episode, AudiobookChapter } from "@/types";

interface AudioPlayerProps {
  activeTrack: {
    title: string;
    artist: string;
    artwork: string;
    url: string;
    duration?: number;
  } | null;
  onClose?: () => void;
}

export default function AudioPlayer({ activeTrack }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (audioRef.current && activeTrack) {
      setIsReady(false);
      audioRef.current.load();
      // Auto play on track change
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [activeTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || activeTrack?.duration || 0);
      setIsReady(true);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const cycleSpeed = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  if (!activeTrack) return null;

  return (
    <div id="audio-persistent-player" className="fixed bottom-0 left-0 right-0 z-50 bg-[#12141c]/95 border-t border-slate-800 text-slate-200 shadow-2xl backdrop-blur-md px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Track Metadata */}
        <div className="flex items-center gap-3 w-full md:w-1/3">
          {activeTrack.artwork ? (
            <img
              src={activeTrack.artwork}
              alt={activeTrack.title}
              className="w-12 h-12 rounded object-cover border border-slate-700 shadow-md referrerPolicy='no-referrer'"
            />
          ) : (
            <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center">
              <Music4 className="w-5 h-5 text-slate-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-medium truncate text-white">{activeTrack.title}</h4>
            <p className="text-xs text-slate-400 truncate">{activeTrack.artist}</p>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex flex-col items-center gap-1.5 w-full md:w-2/3 max-w-xl">
          {/* Main Playbar Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => { if (audioRef.current) audioRef.current.currentTime -= 10; }}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Rewind 10s"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all shadow-md-indigo shadow-inner shadow-sm"
            >
              {!isReady && isPlaying ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => { if (audioRef.current) audioRef.current.currentTime += 30; }}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Forward 30s"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={cycleSpeed}
              className="text-xs font-mono px-2 py-1 rounded bg-slate-800 border border-slate-700 font-semibold text-slate-300 hover:text-white hover:bg-slate-700"
              title="Playback Rate"
            >
              {playbackRate}x
            </button>
          </div>

          {/* Time scrubber */}
          <div className="flex items-center gap-3 w-full text-xs font-mono">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleScrub}
              className="flex-1 accent-indigo-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume controls */}
        <div className="hidden md:flex items-center gap-3 w-1/3 justify-end text-slate-400">
          <Volume2 className="w-4 h-4" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 accent-indigo-400 h-1 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={activeTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}
