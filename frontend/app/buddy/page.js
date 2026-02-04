'use client';

 import { useEffect, useRef, useState } from 'react';
 import { io } from 'socket.io-client';
 import styles from './page.module.css';

 const moodOptions = [
   { id: 'calm', label: 'Calm 😌' },
   { id: 'stressed', label: 'Stressed 😰' },
   { id: 'sad', label: 'Down 🌧️' },
   { id: 'anxious', label: 'Anxious 😟' },
   { id: 'motivated', label: 'Motivated 💪' },
   { id: 'social', label: 'Social 🙂' },
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

 const iceServers = [
   { urls: 'stun:stun.l.google.com:19302' },
   { urls: 'stun:stun1.l.google.com:19302' },
 ];

 function getBackendUrl() {
   if (typeof window === 'undefined') return 'http://localhost:5000';
   return `http://${window.location.hostname}:5000`;
 }

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

   const peerConnectionRef = useRef(null);
   const dataChannelRef = useRef(null);
   const matchIdRef = useRef(null);
   const connectionTimerRef = useRef(null);
   const messagesEndRef = useRef(null);

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

   useEffect(() => {
     const backendUrl = getBackendUrl();
     const newSocket = io(backendUrl, {
       transports: ['websocket', 'polling'],
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
       setIsAccepted(false);
       setPeerAccepted(false);
       setError('');
     });

     newSocket.on('match_peer_accepted', () => {
       setPeerAccepted(true);
     });

     newSocket.on('match_ready', async (data) => {
       if (data.matchId !== matchIdRef.current) return;
       setStatus('connecting');
       await startWebRtc(data.isInitiator);
       startConnectionTimeout();
     });

     newSocket.on('match_rejected', () => {
       handleEnd('rejected');
     });

     newSocket.on('match_end', (data) => {
       handleEnd(data.reason || 'ended');
     });

     newSocket.on('webrtc_offer', async (data) => {
       if (data.matchId !== matchIdRef.current) return;
       await handleOffer(data.sdp);
     });

     newSocket.on('webrtc_answer', async (data) => {
       if (data.matchId !== matchIdRef.current) return;
       await handleAnswer(data.sdp);
     });

     newSocket.on('webrtc_ice', async (data) => {
       if (data.matchId !== matchIdRef.current) return;
       await handleIceCandidate(data.candidate);
     });

     setSocket(newSocket);
     return () => {
       newSocket.disconnect();
     };
   }, []);

   useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const startSearch = () => {
     if (!socket || status === 'searching' || status === 'matched' || status === 'connecting' || status === 'connected') {
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
       if (status !== 'connected') {
         if (socket && matchIdRef.current) {
           socket.emit('match_end', { matchId: matchIdRef.current, reason: 'timeout' });
         }
         handleEnd('timeout');
       }
     }, 15000);
   };

   const createPeerConnection = () => {
     const connection = new RTCPeerConnection({ iceServers });
     connection.onicecandidate = (event) => {
       if (event.candidate && socket && matchIdRef.current) {
         socket.emit('webrtc_ice', { matchId: matchIdRef.current, candidate: event.candidate });
       }
     };
     connection.onconnectionstatechange = () => {
       if (connection.connectionState === 'connected') {
         setStatus('connected');
         if (connectionTimerRef.current) clearTimeout(connectionTimerRef.current);
       }
       if (['failed', 'disconnected', 'closed'].includes(connection.connectionState)) {
         handleEnd('connection_failed');
       }
     };
     connection.ondatachannel = (event) => {
       setupDataChannel(event.channel);
     };
     peerConnectionRef.current = connection;
     return connection;
   };

   const setupDataChannel = (channel) => {
     dataChannelRef.current = channel;
     channel.onopen = () => {
       setStatus('connected');
       if (connectionTimerRef.current) clearTimeout(connectionTimerRef.current);
     };
     channel.onmessage = (event) => {
       try {
         const payload = JSON.parse(event.data);
         addMessage(payload.text || event.data, 'peer', payload.time);
       } catch {
         addMessage(event.data, 'peer');
       }
     };
     channel.onclose = () => {
       handleEnd('channel_closed');
     };
     channel.onerror = () => {
       setError('Chat channel error. Please try again.');
     };
   };

   const startWebRtc = async (isInitiator) => {
     const connection = createPeerConnection();
     if (isInitiator) {
       const channel = connection.createDataChannel('buddy-chat');
       setupDataChannel(channel);
       const offer = await connection.createOffer();
       await connection.setLocalDescription(offer);
       if (socket && matchIdRef.current) {
         socket.emit('webrtc_offer', { matchId: matchIdRef.current, sdp: connection.localDescription });
       }
     }
   };

   const handleOffer = async (sdp) => {
     let connection = peerConnectionRef.current;
     if (!connection) {
       connection = createPeerConnection();
     }
     await connection.setRemoteDescription(new RTCSessionDescription(sdp));
     const answer = await connection.createAnswer();
     await connection.setLocalDescription(answer);
     if (socket && matchIdRef.current) {
       socket.emit('webrtc_answer', { matchId: matchIdRef.current, sdp: connection.localDescription });
     }
   };

   const handleAnswer = async (sdp) => {
     const connection = peerConnectionRef.current;
     if (!connection) return;
     await connection.setRemoteDescription(new RTCSessionDescription(sdp));
   };

   const handleIceCandidate = async (candidate) => {
     const connection = peerConnectionRef.current;
     if (!connection || !candidate) return;
     try {
       await connection.addIceCandidate(new RTCIceCandidate(candidate));
     } catch {
       // Ignore invalid candidates
     }
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
     const channel = dataChannelRef.current;
     if (!channel || channel.readyState !== 'open') {
       setError('Connection is not ready yet.');
       return;
     }
     const payload = {
       text: inputMessage.trim(),
       time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
       username,
     };
     channel.send(JSON.stringify(payload));
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
     if (dataChannelRef.current) {
       try {
         dataChannelRef.current.close();
       } catch {}
     }
     if (peerConnectionRef.current) {
       try {
         peerConnectionRef.current.close();
       } catch {}
     }
     dataChannelRef.current = null;
     peerConnectionRef.current = null;
     matchIdRef.current = null;
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
             <button className={styles.primaryButton} onClick={startSearch} disabled={!socket || status !== 'idle'}>
               Find a Buddy
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
                 <span className={styles.peerAvatar}>👤</span>
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
