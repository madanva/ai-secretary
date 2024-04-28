import React from 'react';
import './CalendarPage.css'; // Your custom CSS for styling

const CalendarPage = () => {
  const calendarUrl = "https://calendar.google.com/calendar/embed?src=varunrmadan%40gmail.com&ctz=America%2FLos_Angeles";

  return (
    <div className="calendar-page">
       <h1 className="title"> Your Calendar</h1> 
      <div className="google-calendar-container">
        <iframe 
          src={calendarUrl}
          style={{ border: 0, width: "100%", height: "100%" }}
          frameborder="0"
          scrolling="no"
        ></iframe>
      </div>
    </div>
  );
};

export default CalendarPage;
