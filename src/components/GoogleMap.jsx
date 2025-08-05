import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

const GoogleMap = ({ destination }) => {
  if (!destination) return null;
  
  // For demo purposes, we'll use a placeholder. In production, you'd use your actual Google Maps API key
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(destination)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(destination)}`;
  
  return (
    <div className="map-container">
      <div className="map-card">
        <div className="map-header">
          <MapPin size={20} />
          <h3>📍 {destination}</h3>
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="map-link"
          >
            <ExternalLink size={16} />
            Open in Google Maps
          </a>
        </div>
        
        <div className="map-placeholder">
          <div className="map-content">
            <MapPin size={48} />
            <h4>Interactive Map</h4>
            <p>To enable the interactive map, please add your Google Maps API key to the configuration.</p>
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="map-button"
            >
              View on Google Maps
            </a>
          </div>
        </div>
        
        {/* Uncomment this when you have a Google Maps API key */}
        {/* 
        <iframe
          title="Google Map"
          width="100%"
          height="350"
          frameBorder="0"
          style={{ border: 0, borderRadius: '12px' }}
          src={mapSrc}
          allowFullScreen
        ></iframe>
        */}
      </div>
    </div>
  );
};

export default GoogleMap;
