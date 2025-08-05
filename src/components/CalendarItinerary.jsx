import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Download, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const CalendarItinerary = ({ itinerary, onExportPDF, onSendEmail }) => {
  const [expandedDays, setExpandedDays] = useState(new Set());
  const [activeDay, setActiveDay] = useState(0);

  if (!itinerary) return null;

  const toggleDay = (dayIndex) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayIndex)) {
      newExpanded.delete(dayIndex);
    } else {
      newExpanded.add(dayIndex);
    }
    setExpandedDays(newExpanded);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sightseeing': return '🏛️';
      case 'food': return '🍽️';
      case 'adventure': return '🏔️';
      case 'culture': return '🎭';
      case 'shopping': return '🛍️';
      case 'relaxation': return '🧘';
      default: return '📍';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'sightseeing': return '#3B82F6';
      case 'food': return '#EF4444';
      case 'adventure': return '#10B981';
      case 'culture': return '#8B5CF6';
      case 'shopping': return '#F59E0B';
      case 'relaxation': return '#06B6D4';
      default: return '#6B7280';
    }
  };

  // Handle both structured and raw itinerary formats
  const itineraryData = itinerary.itinerary || [];
  const isStructured = Array.isArray(itineraryData);

  if (!isStructured) {
    return (
      <div className="itinerary-container">
        <div className="itinerary-card">
          <div className="itinerary-header">
            <h3>📋 Your Travel Itinerary</h3>
            <div className="itinerary-actions">
              <button onClick={() => onExportPDF(itinerary)} className="action-btn">
                <Download size={16} />
                Export PDF
              </button>
              <button onClick={() => onSendEmail(itinerary)} className="action-btn">
                <Mail size={16} />
                Send via Email
              </button>
            </div>
          </div>
          <div className="raw-itinerary">
            <pre>{itinerary}</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="itinerary-container">
      <div className="itinerary-card">
        <div className="itinerary-header">
          <div className="itinerary-title">
            <h3>🗓️ Your Travel Itinerary</h3>
            <p className="destination-info">
              {itinerary.destination} • {itinerary.duration}
            </p>
          </div>
          <div className="itinerary-actions">
            <button onClick={() => onExportPDF(itinerary)} className="action-btn">
              <Download size={16} />
              Export PDF
            </button>
            <button onClick={() => onSendEmail(itinerary)} className="action-btn">
              <Mail size={16} />
              Send via Email
            </button>
          </div>
        </div>

        {itinerary.interests && itinerary.interests.length > 0 && (
          <div className="interests-display">
            <h4>Your Interests:</h4>
            <div className="interests-tags">
              {itinerary.interests.map((interest, index) => (
                <span key={index} className="interest-tag">{interest}</span>
              ))}
            </div>
          </div>
        )}

        <div className="days-container">
          {itineraryData.map((day, dayIndex) => (
            <div key={dayIndex} className="day-card">
              <div 
                className="day-header"
                onClick={() => toggleDay(dayIndex)}
              >
                <div className="day-info">
                  <Calendar size={20} />
                  <div>
                    <h4>Day {day.day}</h4>
                    <p>{day.date}</p>
                  </div>
                </div>
                <div className="day-toggle">
                  {expandedDays.has(dayIndex) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedDays.has(dayIndex) && (
                <div className="activities-container">
                  {day.activities.map((activity, actIndex) => (
                    <div key={actIndex} className="activity-item">
                      <div className="activity-time">
                        <Clock size={16} />
                        <span>{activity.time}</span>
                      </div>
                      <div className="activity-content">
                        <div className="activity-header">
                          <span className="activity-icon">
                            {getActivityIcon(activity.type)}
                          </span>
                          <h5>{activity.activity}</h5>
                          <span 
                            className="activity-type"
                            style={{ backgroundColor: getActivityColor(activity.type) }}
                          >
                            {activity.type}
                          </span>
                        </div>
                        {activity.location && (
                          <div className="activity-location">
                            <MapPin size={14} />
                            <span>{activity.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarItinerary;
