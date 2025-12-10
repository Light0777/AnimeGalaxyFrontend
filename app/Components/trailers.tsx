"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface TrailerPlayerProps {
    youtubeId: string;
    title: string;
    className?: string;
    autoPlay?: boolean;
}

export default function TrailerPlayer({
    youtubeId,
    title,
    className = "",
    autoPlay = true,
}: TrailerPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isMuted, setIsMuted] = useState(true);
    const [showControls, setShowControls] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Build YouTube URL with YouTube API enabled
    const getYouTubeUrl = (playing: boolean, muted: boolean) => {
        const params = new URLSearchParams({
            // Basic parameters
            autoplay: playing ? '1' : '0',
            mute: muted ? '1' : '0',

            // Loop parameters
            loop: '1',
            playlist: youtubeId,

            // KEY: Enable YouTube API for control
            enablejsapi: '1',
            
            // Remove overlays but keep API access
            controls: '0',
            modestbranding: '1',
            rel: '0',
            showinfo: '0',
            iv_load_policy: '3',
            disablekb: '1',
            fs: '0',
            playsinline: '1',
            cc_load_policy: '0',
            end: '0',
            widget_referrer: window.location.origin || 'http://localhost:3000',
        });

        return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`;
    };

    // Send command to YouTube player
    const sendYouTubeCommand = (command: string) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                JSON.stringify({
                    event: 'command',
                    func: command,
                    args: []
                }),
                '*'
            );
        }
    };

    // Handle play/pause
    const togglePlayPause = () => {
        if (isPlaying) {
            sendYouTubeCommand('pauseVideo');
        } else {
            sendYouTubeCommand('playVideo');
        }
        setIsPlaying(!isPlaying);
    };

    // Handle mute/unmute
    const toggleMute = () => {
        if (isMuted) {
            sendYouTubeCommand('unMute');
        } else {
            sendYouTubeCommand('mute');
        }
        setIsMuted(!isMuted);
    };

    // Handle mouse events
    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShowControls(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 1000);
    };

    // Initialize YouTube player with API
    useEffect(() => {
        // Set up message listener for YouTube API
        const handleMessage = (event: MessageEvent) => {
            // YouTube API sends messages about player state
            try {
                if (event.origin === 'https://www.youtube.com' && event.data) {
                    const data = JSON.parse(event.data);
                    if (data.event === 'infoDelivery') {
                        // Update playing state from YouTube
                        if (data.info.playerState === 1) {
                            setIsPlaying(true);
                        } else if (data.info.playerState === 2) {
                            setIsPlaying(false);
                        }
                    }
                }
            } catch (e) {
                // Ignore non-JSON messages
            }
        };

        window.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('message', handleMessage);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`relative aspect-video bg-black rounded-xl overflow-hidden cursor-pointer ${className}`}
            onClick={togglePlayPause}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            tabIndex={0}
            aria-label={`${title} trailer video player`}
        >
            {/* YouTube iframe with API enabled */}
            <iframe
                ref={iframeRef}
                src={getYouTubeUrl(isPlaying, isMuted)}
                title={`${title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-[calc(100%+8px)] h-[calc(100%+60px)] -top-[60px] -left-1 border-0 pointer-events-none"
                sandbox="allow-scripts allow-same-origin allow-presentation"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
            />

            {/* Controls - visible based on state */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                {/* Glass morphism play/pause button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        togglePlayPause();
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                   w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full
                   flex items-center justify-center border border-white/20
                   shadow-lg shadow-black/30 z-10"
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                    }}
                >
                    {isPlaying ? (
                        <Pause className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    ) : (
                        <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" />
                    )}
                </button>

                {/* Glass morphism mute/unmute button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                    }}
                    className="absolute bottom-4 right-4
                   w-10 h-10 bg-black/40 backdrop-blur-md rounded-full
                   flex items-center justify-center border border-white/20
                   shadow-lg shadow-black/30 z-10"
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                    style={{
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                    }}
                >
                    {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                    ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                    )}
                </button>
            </div>

            {/* Always show play button when paused */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlayPause();
                        }}
                        className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full
                     flex items-center justify-center border-2 border-white/30
                     shadow-lg shadow-black/40 z-10"
                        aria-label="Play video"
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            backdropFilter: 'blur(8px)',
                            WebkitBackdropFilter: 'blur(8px)',
                        }}
                    >
                        <Play className="w-10 h-10 text-white ml-1" />
                    </button>
                </div>
            )}
        </div>
    );
}