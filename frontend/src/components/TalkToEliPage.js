import React, { useState, useEffect, useRef } from 'react';
import './TalkToEliPage.css';

const TalkToEliPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState([]);
  const websocket = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const toggleCount = useRef(0);

  const [checklistItems, setChecklistItems] = useState([
      { id: 1, text: 'Organize Meeting with Stakeholders - Schedule from 9 AM to 10 AM, confirm attendees, prepare and distribute agenda.', checked: false },
      { id: 2, text: 'Prepare Daily Briefing - Summarize scheduled meetings, key emails, and urgent tasks by 8 AM each morning.', checked: false },
      { id: 3, text: 'Arrange Travel Plans - Book flights and hotels for next week’s business trip, confirm all destination meetings.', checked: false },
      { id: 4, text: 'Block Family Time - Ensure no work calls or emails from 8 PM to 10 PM, set a reminder 30 minutes before.', checked: false },
      { id: 5, text: 'Schedule Health Check-Up - Set appointment for next Thursday at 3 PM, confirm with the doctor’s office, set reminders.', checked: false }
  
]);


  const handleCheck = (itemId) => {
    setChecklistItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };
  useEffect(() => {
    websocket.current = new WebSocket('ws://localhost:6789');
    websocket.current.onopen = () => console.log('WebSocket Connected');
    websocket.current.onmessage = event => setResponses(prev => [...prev, event.data]);
    websocket.current.onclose = () => console.log('WebSocket Disconnected');

    return () => websocket.current && websocket.current.close();
  }, []);

  const toggleRecording = async () => {
    toggleCount.current += 1
    if (isRecording) {
      mediaRecorder.current.stop();
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = event => event.data.size > 0 && audioChunks.current.push(event.data);
      mediaRecorder.current.onstop = sendAudioToServer;
      mediaRecorder.current.start();
    }
    setIsRecording(!isRecording);
    if (toggleCount.current === 4) {
      setTimeout(() => {
        setChecklistItems(prevItems => [
          ...prevItems,
          { id: prevItems.length + 1, text: '', checked: false }
        ]);
      }, 1800); // Delay in milliseconds (1800 ms = 1.8 seconds)
    }
  };

  const sendAudioToServer = () => {
    if (websocket.current.readyState === WebSocket.OPEN) {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      websocket.current.send(audioBlob);
      audioChunks.current = [];
    }
  };

  return (
    <div className="talk-to-hedoria-page">
      <h1 className="title"><span className="hedoria-gradient">Eli</span> Live Chat </h1> 
      <div className="content">
        <div className="agent-section">
          <div className="avatar-container">
            <div className="avatar-image"></div>
            <div className={`microphone-icon ${isRecording ? 'recording' : ''}`} onClick={toggleRecording}>
              {/* SVG for microphone icon */}
              <svg width="40" height="40" viewBox="0 0 24 24">
                <path d="M12 14a3 3 0 003-3V4a3 3 0 10-6 0v7a3 3 0 003 3zm7-3v2a7 7 0 01-14 0V11m14 0a9 9 0 01-18 0m18 0H5" />
              </svg>
            </div>
          </div>
          <div>

          </div>
        </div>
        <div className="checklist-section">
        <h2 className="checklist-title">Your Tasks</h2>
        <ul className="checklist">
          {checklistItems.map(item => (
            <li key={item.id} className={`checklist-item ${item.checked ? 'checked' : ''}`}>
              <label htmlFor={`checklist-item-${item.id}`} className="checklist-label">
                <input
                  type="checkbox"
                  id={`checklist-item-${item.id}`}
                  className="checklist-checkbox"
                  checked={item.checked}
                  onChange={() => handleCheck(item.id)}
                />
                <span className="checklist-custom-checkbox"></span>
                {item.text}
              </label>
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
};

export default TalkToEliPage;