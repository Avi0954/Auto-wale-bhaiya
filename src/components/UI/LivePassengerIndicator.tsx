import React, { useState, useEffect } from 'react';

export const LivePassengerIndicator: React.FC = () => {
  const [count, setCount] = useState<number>(1); // Defaults to 1 (the current user)
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    // In production, you would point this to your deployed WebSocket URL
    // e.g. wss://your-backend-url.com
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';
    
    let ws: WebSocket;
    let reconnectTimer: number;

    const connect = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'COUNT_UPDATE' && typeof data.count === 'number') {
            setCount(data.count);
          }
        } catch (err) {
          console.error("Failed to parse websocket message", err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimer = window.setTimeout(connect, 3000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error", error);
        ws.close(); // Force close to trigger reconnect logic
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 md:top-6 md:right-8 z-50 flex items-center justify-center animate-in fade-in duration-1000">
      <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-black/40 backdrop-blur-md border border-white/5 rounded-full shadow-lg">
        <span className="text-sm md:text-base">🛺</span>
        
        <div className="flex items-baseline gap-1.5 md:gap-2">
          {/* Subtle number transition using key to re-trigger small bump if needed, or just standard text */}
          <span 
            className="font-mono text-xs md:text-sm font-bold text-auto-yellow tracking-widest tabular-nums transition-all duration-300"
          >
            {count}
          </span>
          <span className="text-[8px] md:text-[10px] tracking-widest text-zinc-400 font-medium uppercase mt-0.5">
            Passengers on ride
          </span>
        </div>
        
        {/* Pulse Dot */}
        <div className="relative flex h-2 w-2 md:h-2.5 md:w-2.5 items-center justify-center ml-1">
          {isConnected && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-auto-yellow opacity-40"></span>
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 ${isConnected ? 'bg-auto-yellow' : 'bg-zinc-600'}`}></span>
        </div>
      </div>
    </div>
  );
};
