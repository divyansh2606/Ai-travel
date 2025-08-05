import React, { useState } from 'react'

function FamousPlaces({ city }) {
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  React.useEffect(() => {
    if (!city) return
    setLoading(true)
    setError('')
    fetch(`http://localhost:5000/api/travel-plans/places?city=${encodeURIComponent(city)}`)
      .then(res => res.json())
      .then(data => {
        setPlaces(data.places || [])
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load places')
        setLoading(false)
      })
  }, [city])

  if (!city) return null

  return (
    <div className="famous-places-box" style={{marginBottom: '2rem'}}>
      <h4>Famous Places in {city}</h4>
      {loading && <div className="loading">Loading places...</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="places-list">
        {places.length === 0 && !loading && !error && <p>No places found.</p>}
        {places.map(place => (
          <div key={place.xid} className="place-item" style={{marginBottom: '1rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
              {place.image && <img src={place.image} alt={place.name} style={{width: 60, height: 60, borderRadius: 8, objectFit: 'cover'}} />}
              <div>
                <strong>{place.name}</strong>
                <div style={{fontSize: '0.95rem', color: '#666'}}>{place.address}</div>
                {place.wikipedia && <div style={{fontSize: '0.9rem', marginTop: 4}}>{place.wikipedia}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FamousPlaces
