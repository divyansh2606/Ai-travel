import React, { useState } from 'react';
import { MapPin, Calendar, Heart, Send, Loader2 } from 'lucide-react';

const INTEREST_OPTIONS = [
  'Nature',
  'Adventure',
  'Culture',
  'Food',
  'Shopping',
  'Nightlife',
  'Relaxation',
  'History',
  'Art',
  'Sports',
  'Family',
  'Romance',
  'Wildlife',
  'Beaches',
  'Mountains',
];

const TravelForm = ({ onSubmit, loading }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);

  const handleInterestClick = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      destination,
      startDate,
      endDate,
      interests: selectedInterests,
    });
  };

  return (
    <div className="travel-form-container">
      <div className="travel-form-card">
        <div className="form-header">
          <h2>✈️ Plan Your Dream Trip</h2>
          <p>Tell us where you want to go and what you love to do!</p>
        </div>

        <form onSubmit={handleSubmit} className="travel-form">
          <div className="form-group">
            <label htmlFor="destination">
              <MapPin size={20} />
              Destination
            </label>
            <input
              id="destination"
              type="text"
              placeholder="e.g., Paris, France"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="date-group">
            <div className="form-group">
              <label htmlFor="startDate">
                <Calendar size={20} />
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">
                <Calendar size={20} />
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <Heart size={20} />
              Select Your Interests
            </label>
            <div className="interests-grid">
              {INTEREST_OPTIONS.map((interest) => (
                <div
                  key={interest}
                  className={`interest-chip${selectedInterests.includes(interest) ? ' selected' : ''}`}
                  onClick={() => handleInterestClick(interest)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selectedInterests.includes(interest)}
                >
                  {interest}
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spinner" />
                Generating Your Itinerary...
              </>
            ) : (
              <>
                <Send size={20} />
                Create My Travel Plan
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TravelForm;
