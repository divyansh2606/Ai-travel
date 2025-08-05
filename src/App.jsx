import { useState } from 'react'
import './App.css'
import TravelForm from './components/TravelForm'
import GoogleMap from './components/GoogleMap'
import FamousPlaces from './components/FamousPlaces'
import CalendarItinerary from './components/CalendarItinerary'
import { Plane } from 'lucide-react'

function App() {
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [destination, setDestination] = useState('')
  const [error, setError] = useState('')

  const handleFormSubmit = async (formData) => {
    setLoading(true)
    setError('')
    setDestination(formData.destination)
    
    try {
      const res = await fetch('http://localhost:5000/api/travel-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId: 'demo-user' }),
      })
      
      if (!res.ok) {
        throw new Error('Failed to generate itinerary')
      }
      
      const data = await res.json()
      console.log('Received data:', data)
      setItinerary(data.itinerary || data)
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async (itineraryData) => {
    try {
      const res = await fetch('http://localhost:5000/api/travel-plans/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: itineraryData }),
      })
      
      if (res.ok) {
        const blob = await res.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'travel-itinerary.pdf'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error('Error exporting PDF:', err)
      alert('Failed to export PDF')
    }
  }

  const handleSendEmail = async (itineraryData) => {
    const email = prompt('Enter email address:')
    if (!email) return
    
    const subject = prompt('Enter email subject (optional):', 'Your Travel Itinerary')
    
    try {
      const res = await fetch('http://localhost:5000/api/travel-plans/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary: itineraryData, email, subject }),
      })
      
      if (res.ok) {
        alert('Itinerary sent via email! 📧')
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Failed to send email')
      }
    } catch (err) {
      console.error('Error sending email:', err)
      alert('Failed to send email: ' + err.message)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Plane size={32} />
            <h1>AI Travel Planner</h1>
          </div>
          <p className="tagline">Plan your dream vacation with AI-powered recommendations</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <TravelForm onSubmit={handleFormSubmit} loading={loading} />
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}
          
          {destination && <GoogleMap destination={destination} />}
          {destination && <FamousPlaces city={destination} />}
          
          {itinerary && (
            <div className="itinerary-box">
              <h3>Your AI-Generated Itinerary</h3>
              <CalendarItinerary 
                itinerary={itinerary} 
                onExportPDF={handleExportPDF}
                onSendEmail={handleSendEmail}
              />
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2024 AI Travel Planner. Built with ❤️ using React & AI</p>
      </footer>
    </div>
  )
}

export default App
