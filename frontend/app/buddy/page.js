'use client';

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import styles from './page.module.css';
import { getBackendUrl } from '@/lib/backendUrl';
import Icon from '@/components/Icon';

const moodOptions = [
  { id: 'calm', label: 'Calm' },
  { id: 'stressed', label: 'Stressed' },
  { id: 'sad', label: 'Down' },
  { id: 'anxious', label: 'Anxious' },
  { id: 'motivated', label: 'Motivated' },
  { id: 'social', label: 'Social' },
];

const interestOptions = [
  'Study',
  'Career',
  'Relationships',
  'Fitness',
  'Mindfulness',
  'Gaming',
  'Music',
  'General',
];

// getBackendUrl imported from @/lib/backendUrl

export default function BuddyChatPage() {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('idle');
  const [match, setMatch] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [peerAccepted, setPeerAccepted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedMood, setSelectedMood] = useState('calm');
  const [selectedInterests, setSelectedInterests] = useState(['General']);
  const [peerId, setPeerId] = useState(null);

  const peerRef = useRef(null);
  const connectionRef = useRef(null);
  const matchIdRef = useRef(null);
  const expectedPeerIdRef = useRef(null);
  const connectionTimerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const username = (() => {
    try {
      const raw = localStorage.getItem('mindlink-user');
      if (!raw) return 'Anonymous';
      const parsed = JSON.parse(raw);
      return parsed.username || 'Anonymous';
    } catch {
      return 'Anonymous';
    }
  })();





  const startSearch = () => {
    if (!socket || !peerId || status === 'searching' || status === 'matched' || status === 'connecting' || status === 'connected') {
      return;
    }
    setError('');
    setStatus('searching');
    socket.emit('match_join', {
      username,
      mood: selectedMood,
      interests: selectedInterests,
    });
  };

  const cancelSearch = () => {
    if (!socket) return;
    socket.emit('match_cancel');
    setStatus('idle');
  };

  const acceptMatch = () => {
    if (!socket || !matchIdRef.current) return;
    setIsAccepted(true);
    socket.emit('match_accept', { matchId: matchIdRef.current });
  };

  const rejectMatch = () => {
    if (!socket || !matchIdRef.current) return;
    socket.emit('match_reject', { matchId: matchIdRef.current });
    handleEnd('rejected');
  };

  const endChat = () => {
    if (socket && matchIdRef.current) {
      socket.emit('match_end', { matchId: matchIdRef.current, reason: 'ended' });
    }
    handleEnd('ended');
  };

  const startConnectionTimeout = () => {
    if (connectionTimerRef.current) {
      clearTimeout(connectionTimerRef.current);
    }
    connectionTimerRef.current = setTimeout(() => {
      if (statusRef.current !== 'connected') {
        if (socket && matchIdRef.current) {
          socket.emit('match_end', { matchId: matchIdRef.current, reason: 'timeout' });
        }
        handleEnd('timeout');
      }
    }, 15000);
  };

  const attachConnection = (conn) => {
    connectionRef.current = conn;
    conn.on('open', () => {
      setStatus('connected');
      if (connectionTimerRef.current) clearTimeout(connectionTimerRef.current);
    });
    conn.on('data', (data) => {
      try {
        const payload = typeof data === 'string' ? JSON.parse(data) : data;
        addMessage(payload.text || data, 'peer', payload.time);
      } catch {
        addMessage(String(data), 'peer');
      }
    });
    conn.on('close', () => {
      handleEnd('channel_closed');
    });
    conn.on('error', () => {
      setError('Chat channel error. Please try again.');
    });
  };

  const addMessage = (text, sender, timeOverride) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        text,
        sender,
        time: timeOverride || new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      },
    ]);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    if (!inputMessage.trim()) return;
    const conn = connectionRef.current;
    if (!conn || conn.open !== true) {
      setError('Connection is not ready yet.');
      return;
    }
    const payload = {
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      username,
    };
    conn.send(JSON.stringify(payload));
    addMessage(payload.text, 'me', payload.time);
    setInputMessage('');
  };

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        const next = prev.filter((item) => item !== interest);
        return next.length > 0 ? next : ['General'];
      }
      return [...prev, interest];
    });
  };

  const handleEnd = (reason) => {
    if (connectionTimerRef.current) clearTimeout(connectionTimerRef.current);
    if (connectionRef.current) {
      try {
        connectionRef.current.close();
      } catch { }
    }
    connectionRef.current = null;
    matchIdRef.current = null;
    expectedPeerIdRef.current = null;
    setIsAccepted(false);
    setPeerAccepted(false);
    setMatch(null);
    setMessages([]);
    setInputMessage('');
    setStatus('idle');

    if (reason && reason !== 'ended') {
      const readable = {
        timeout: 'Direct connection timed out. Please try again.',
        rejected: 'The other user declined the chat.',
        peer_disconnected: 'Peer disconnected.',
        disconnected: 'Disconnected from server.',
        connection_failed: 'Direct connection failed.',
        channel_closed: 'Chat ended.',
      };
      setError(readable[reason] || 'Chat ended.');
    }
  };

  useEffect(() => {
    const backendUrl = getBackendUrl();
    const newSocket = io(backendUrl, {
      transports: ['polling'],
      upgrade: false,
    });

    newSocket.on('connect', () => {
      setError('');
    });

    newSocket.on('disconnect', () => {
      handleEnd('disconnected');
    });

    newSocket.on('match_waiting', () => {
      setStatus('searching');
    });

    newSocket.on('match_found', (data) => {
      setStatus('matched');
      setMatch({ matchId: data.matchId, peer: data.peer });
      matchIdRef.current = data.matchId;
      expectedPeerIdRef.current = null;
      setIsAccepted(false);
      setPeerAccepted(false);
      setError('');

      // Re-register peer ID to ensure server has it for this match
      if (peerId) {
        newSocket.emit('peer_register', { peerId });
      }
    });

    newSocket.on('match_peer_accepted', () => {
      setPeerAccepted(true);
    });

    newSocket.on('peer_ready', (data) => {
      if (data.matchId !== matchIdRef.current) return;
      expectedPeerIdRef.current = data.peerId;
      setStatus('connecting');
      startConnectionTimeout();

      if (data.isInitiator && peerRef.current) {
        const conn = peerRef.current.connect(data.peerId, { reliable: true });
        attachConnection(conn);
      }
    });

    newSocket.on('match_rejected', () => {
      handleEnd('rejected');
    });

    newSocket.on('match_end', (data) => {
      handleEnd(data.reason || 'ended');
    });


    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const backendUrl = getBackendUrl();
    const parsedUrl = new URL(backendUrl);
    const peer = new Peer({
      host: parsedUrl.hostname,
      port: parseInt(parsedUrl.port) || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: '/peerjs',
      secure: parsedUrl.protocol === 'https:',
    });

    peer.on('open', (id) => {
      setPeerId(id);
      if (socket) {
        socket.emit('peer_register', { peerId: id });
      }
    });

    peer.on('connection', (conn) => {
      if (expectedPeerIdRef.current && conn.peer !== expectedPeerIdRef.current) {
        conn.close();
        return;
      }
      attachConnection(conn);
    });

    peer.on('error', () => {
      setError('Peer connection error. Please try again.');
      handleEnd('connection_failed');
    });

    peerRef.current = peer;
    return () => {
      peer.destroy();
      peerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Buddy Chat (P2P)</h1>
          <p>Match with another student and chat directly. No server message relay.</p>
        </div>
        <div className={styles.statusPill} data-status={status}>
          {status === 'idle' && 'Idle'}
          {status === 'searching' && 'Searching'}
          {status === 'matched' && 'Matched'}
          {status === 'connecting' && 'Connecting'}
          {status === 'connected' && 'Connected'}
        </div>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2>Your Match Preferences</h2>
          <label className={styles.label}>Mood</label>
          <div className={styles.moodRow}>
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                className={`${styles.chip} ${selectedMood === mood.id ? styles.activeChip : ''}`}
                onClick={() => setSelectedMood(mood.id)}
                type="button"
              >
                {mood.label}
              </button>
            ))}
          </div>

          <label className={styles.label}>Interests</label>
          <div className={styles.interestRow}>
            {interestOptions.map((interest) => (
              <button
                key={interest}
                className={`${styles.chip} ${selectedInterests.includes(interest) ? styles.activeChip : ''}`}
                onClick={() => toggleInterest(interest)}
                type="button"
              >
                {interest}
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={startSearch} disabled={!socket || !peerId || status !== 'idle'}>
              {peerId ? 'Find a Buddy' : 'Initializing...'}
            </button>
            <button className={styles.secondaryButton} onClick={cancelSearch} disabled={status !== 'searching'}>
              Cancel
            </button>
          </div>

          {error && <div className={styles.error}>{error}</div>}
          <p className={styles.note}>
            P2P-only: some networks block direct connections. If it fails, try again later or switch networks.
          </p>
        </section>

        <section className={styles.card}>
          <h2>Match Status</h2>
          {!match && <p>No match yet. Start searching to connect.</p>}

          {match && (
            <div className={styles.matchBox}>
              <div className={styles.matchHeader}>
                <span className={styles.peerAvatar}>
                  <Icon name="User" size={32} />
                </span>
                <div>
                  <strong>{match.peer.username || 'Anonymous'}</strong>
                  <div className={styles.peerMeta}>
                    Mood: {match.peer.mood || 'neutral'}
                  </div>
                  <div className={styles.peerMeta}>
                    Interests: {(match.peer.interests || []).join(', ') || 'General'}
                  </div>
                </div>
              </div>

              <div className={styles.consentRow}>
                <button
                  className={styles.primaryButton}
                  onClick={acceptMatch}
                  disabled={isAccepted}
                >
                  {isAccepted ? 'Accepted' : 'Accept Chat'}
                </button>
                <button className={styles.secondaryButton} onClick={rejectMatch}>
                  Decline
                </button>
              </div>

              <div className={styles.consentStatus}>
                <span>{isAccepted ? 'You accepted' : 'Waiting for your response'}</span>
                <span>{peerAccepted ? 'Peer accepted' : 'Waiting for peer'}</span>
              </div>
            </div>
          )}
        </section>
      </div>

      <section className={styles.chatCard}>
        <div className={styles.chatHeader}>
          <h2>Buddy Chat</h2>
          <button className={styles.ghostButton} onClick={endChat} disabled={status !== 'connected' && status !== 'connecting'}>
            End Chat
          </button>
        </div>
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              {status === 'connected' ? 'Say hi to start the conversation!' : 'Waiting for connection...'}
            </div>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${message.sender === 'me' ? styles.myMessage : styles.peerMessage}`}
            >
              <div className={styles.bubble}>{message.text}</div>
              <span className={styles.time}>{message.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className={styles.inputRow} onSubmit={sendMessage}>
          <input
            type="text"
            placeholder={status === 'connected' ? 'Type a supportive message...' : 'Connect to start chatting'}
            value={inputMessage}
            onChange={(event) => setInputMessage(event.target.value)}
            disabled={status !== 'connected'}
          />
          <button type="submit" disabled={status !== 'connected' || !inputMessage.trim()}>
            Send
          </button>
        </form>
      </section>
    </div>
  );
}
