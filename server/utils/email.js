const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Format itinerary for email
function formatItineraryForEmail(itinerary) {
  let emailContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .day-card { border: 1px solid #e5e7eb; border-radius: 8px; margin: 15px 0; overflow: hidden; }
          .day-header { background: #f9fafb; padding: 15px; border-bottom: 1px solid #e5e7eb; }
          .activity-item { padding: 15px; border-bottom: 1px solid #f3f4f6; }
          .activity-time { color: #6b7280; font-size: 14px; margin-bottom: 5px; }
          .activity-title { font-weight: bold; margin-bottom: 5px; }
          .activity-location { color: #6b7280; font-size: 14px; }
          .activity-type { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; color: white; margin-left: 10px; }
          .interests { margin: 20px 0; }
          .interest-tag { display: inline-block; background: #e5e7eb; padding: 5px 10px; border-radius: 15px; margin: 2px; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✈️ Your Travel Itinerary</h1>
          <p>${itinerary.destination} • ${itinerary.duration}</p>
        </div>
        <div class="container">
  `;

  if (itinerary.interests && itinerary.interests.length > 0) {
    emailContent += `
      <div class="interests">
        <h3>Your Interests:</h3>
        <div>
          ${itinerary.interests.map(interest => `<span class="interest-tag">${interest}</span>`).join('')}
        </div>
      </div>
    `;
  }

  const itineraryData = itinerary.itinerary || [];
  
  itineraryData.forEach((day, dayIndex) => {
    emailContent += `
      <div class="day-card">
        <div class="day-header">
          <h3>Day ${day.day} - ${day.date}</h3>
        </div>
    `;

    day.activities.forEach((activity, actIndex) => {
      const typeColors = {
        'sightseeing': '#3B82F6',
        'food': '#EF4444',
        'adventure': '#10B981',
        'culture': '#8B5CF6',
        'shopping': '#F59E0B',
        'relaxation': '#06B6D4'
      };
      
      emailContent += `
        <div class="activity-item">
          <div class="activity-time">🕐 ${activity.time}</div>
          <div class="activity-title">
            ${activity.activity}
            <span class="activity-type" style="background-color: ${typeColors[activity.type] || '#6B7280'}">${activity.type}</span>
          </div>
          ${activity.location ? `<div class="activity-location">📍 ${activity.location}</div>` : ''}
        </div>
      `;
    });

    emailContent += `</div>`;
  });

  emailContent += `
        </div>
      </body>
    </html>
  `;

  return emailContent;
}

// Send email with itinerary
async function sendItineraryEmail(to, itinerary, subject = 'Your Travel Itinerary') {
  try {
    const transporter = createTransporter();
    const emailContent = formatItineraryForEmail(itinerary);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: emailContent
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email: ' + error.message);
  }
}

module.exports = { 
  sendItineraryEmail, 
  formatItineraryForEmail 
}; 