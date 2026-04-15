import React, { useState, useEffect } from 'react';

const DbStatus = () => {
  const [status, setStatus] = useState({ database: 'checking', uptime: null });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const start = Date.now();
        const response = await fetch(`${apiUrl}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const latency = Date.now() - start;
        
        if (response.ok) {
          const data = await response.json();
          setStatus({
            database: data.database || 'connected',
            uptime: data.uptime || 'running',
            latency: `${latency}ms`
          });
        } else {
          setStatus({ database: 'disconnected', uptime: null });
        }
      } catch {
        setStatus({ database: 'disconnected', uptime: null });
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const isConnected = status.database === 'connected' || status.database === 'ok';
  const isChecking = status.database === 'checking';

  return (
    <div
      title={`DB: ${status.database}${status.latency ? ` · ${status.latency}` : ''}`}
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 glass-panel px-3 py-1.5 rounded-full cursor-default group hover:scale-105 transition-all duration-300"
    >
      <div className="relative flex h-2.5 w-2.5">
        {isChecking ? (
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400 animate-pulse" />
        ) : isConnected ? (
          <>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </>
        ) : (
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        )}
      </div>
      <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
        {isChecking ? 'Connecting...' : isConnected ? 'DB Online' : 'DB Offline'}
      </span>
    </div>
  );
};

export default DbStatus;
