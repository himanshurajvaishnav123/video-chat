import React, { useState } from 'react';
import {
  LiveKitRoom,
  VideoConference,
} from '@livekit/components-react';
import '@livekit/components-styles';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export default function App() {
  const [roomName, setRoomName] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [token, setToken] = useState('');
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  // LiveKit Token Fetching + MongoDB Entry Request
  const handleJoinCall = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !participantName.trim()) {
      return alert('Dono fields enter karna zaroori hai!');
    }

    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/get-join-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, participantName }),
      });

      const data = await response.json();

      if (data.token) {
        setToken(data.token);
        setJoined(true);
      } else {
        alert(data.error || 'Token generate nahi ho paya!');
      }
    } catch (err) {
      console.error(err);
      alert('Backend server se connection fail ho gaya!');
    } finally {
      setLoading(false);
    }
  };

  // Join Screen Form (Tailwind CSS)
  if (!joined) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 font-sans p-4">
        <div className="w-full max-w-md rounded-xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
          <h2 className="mb-6 text-center text-2xl font-bold text-white tracking-wide">
            Video Call Room
          </h2>

          <form onSubmit={handleJoinCall} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-400">
                Room Name
              </label>
              <input
                type="text"
                placeholder="e.g. general-room"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-400">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Himanshu"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3 text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-blue-600 py-3 text-base font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : (
                'Join Call'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Video Room Screen
  return (
    <div className="h-screen w-screen bg-slate-950">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={LIVEKIT_URL}
        onDisconnected={() => setJoined(false)}
        data-lk-theme="default"
        className="h-full w-full"
      >
        <VideoConference />
      </LiveKitRoom>
    </div>
  );
}