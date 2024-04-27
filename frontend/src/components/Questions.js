import React, { useState, useEffect, useRef } from 'react';
import { MdSend } from 'react-icons/md';
import './Questions.css';

function Questions() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);

  // Scroll to the bottom of the chat messages
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() !== '') {
      // Add user message
      const newMessages = [...messages, { text: input, sender: 'user' }];
      setMessages(newMessages);

      // Call backend to get GPT response
      try {
        const response = await fetch('/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({conversation: newMessages})
        });

        if (!response.ok) {
          throw new Error('Failed to fetch GPT response');
        }

        const data = await response.json();

        // Update conversation with the GPT response
        setMessages(currentMessages => [...currentMessages, { text: data.response, sender: 'gpt' }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(currentMessages => [...currentMessages, { text: "Sorry, I couldn't process that.", sender: 'gpt' }]);
      }

      setInput(''); // Clear the input field
    }
  };

  return (
    <div className="questions-page">
      <div className="getting-started-header">
        <h1>Getting Started</h1>
        <p>Chat with us to provide more information about your schedule. The system will ask up to 10 questions to understand your preferences better.</p>
      </div>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === 'user' ? 'user' : 'gpt'}`}>
              {msg.text}
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </div>
        <div className="message-input-container">
          <input 
            type="text" 
            className="message-input" 
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} 
          />
          <MdSend className="send-button" onClick={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}

export default Questions;
