# Ai-travel
AI Travel Planner is a full stack app that uses AI to generate custom travel itineraries, discover famous places, and help you plan trips. Enter your destination, dates, and interests to get a smart, day-by-day plan, see top attractions, and export or share your itinerary. Built with React and Node.js.

AI Travel Planner is a full stack app that uses AI to generate custom travel itineraries, discover famous places, and help you plan trips. Enter your destination, dates, and interests to get a smart, day-by-day plan, see top attractions, and export or share your itinerary. Built with React and Node.js.

# ✈️ AI Travel Planner

A modern, AI-powered travel planning application that creates personalized itineraries based on your interests and preferences.

## 🚀 Features

### 🎯 AI-Powered Itinerary Generation
- **Personalized Planning**: GPT-3.5 generates custom itineraries based on your interests
- **Structured Activities**: Daily schedules with timing, locations, and activity types
- **Local Insights**: Recommendations for popular attractions and hidden gems
- **Cultural Experiences**: Authentic local experiences and cuisine suggestions

### 🗺️ Interactive Maps
- **Google Maps Integration**: Visual representation of destinations
- **Location Services**: Easy navigation to recommended places
- **Place Information**: Real-time data about attractions and venues

### 📅 Beautiful Calendar Interface
- **Expandable Days**: Click to view detailed daily activities
- **Activity Categories**: Color-coded by type (sightseeing, food, adventure, etc.)
- **Time Management**: Structured scheduling with realistic timing
- **Visual Design**: Modern, intuitive interface with smooth animations

### 📄 PDF Export
- **Professional Formatting**: Clean, print-ready itineraries
- **Complete Information**: All activities, locations, and details included
- **Easy Sharing**: Download and share with travel companions

### 📧 Email Integration
- **Instant Sharing**: Send itineraries directly to friends and family via email
- **Professional Formatting**: Beautiful HTML emails with styled itineraries
- **Easy Sharing**: Perfect for sharing with travel companions and family

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Lucide React** - Beautiful, customizable icons
- **Date-fns** - Date manipulation utilities
- **Modern CSS** - Responsive design with gradients and animations

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for storing travel plans
- **Mongoose** - MongoDB object modeling

### AI & Integrations
- **OpenAI GPT-3.5** - AI-powered itinerary generation
- **Google Maps API** - Location services and mapping
- **Nodemailer** - Email sending functionality
- **PDFKit** - PDF generation and formatting

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key
- Google Maps API key (optional)
- Gmail account (for email functionality)

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-travel-planner

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

Create a `config.env` file in the `server` directory:

```env
MONGODB_URI=mongodb+srv://laaddivyansh97:lOh4uNKnSbfSMuTy@cluster0.enbywzt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
OPENAI_API_KEY=your_openai_api_key_here
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
PORT=5000
```

### 3. Start the Application

```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend development server
npm run dev
```

### 4. Open Your Browser

Navigate to `http://localhost:5173` to start planning your dream vacation!

## 📖 How to Use

### 1. Plan Your Trip
- Enter your destination (city, country, or specific location)
- Select your travel dates
- Choose from predefined interests or add custom ones
- Click "Create My Travel Plan"

### 2. Review Your Itinerary
- View your AI-generated itinerary in a beautiful calendar format
- Expand each day to see detailed activities
- See activity types, locations, and timing

### 3. Export and Share
- Download your itinerary as a PDF
- Send it via email to friends and family
- View your destination on an interactive map

## 🔧 API Endpoints

### Travel Plans
- `POST /api/travel-plans` - Create a new travel plan
- `GET /api/travel-plans/:userId` - Get travel plans for a user

### Export Features
- `POST /api/travel-plans/export-pdf` - Export itinerary as PDF
- `POST /api/travel-plans/send-email` - Send itinerary via email

## 🎨 Design Features

### Modern UI/UX
- **Gradient Backgrounds**: Beautiful purple-blue gradients
- **Glass Morphism**: Frosted glass effects with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Responsive Design**: Works perfectly on all devices
- **Accessibility**: Keyboard navigation and screen reader support

### Interactive Elements
- **Interest Selection**: Clickable chips for easy interest selection
- **Expandable Days**: Smooth accordion-style day expansion
- **Loading States**: Beautiful loading animations
- **Error Handling**: User-friendly error messages

## 🌟 Key Features in Detail

### AI Itinerary Generation
The AI analyzes your interests and creates a comprehensive itinerary that includes:
- **Optimal Timing**: Realistic scheduling based on activity duration
- **Local Recommendations**: Popular and hidden gem locations
- **Cultural Integration**: Authentic local experiences
- **Practical Tips**: Transportation, costs, and useful information

### Smart Interest Matching
Choose from predefined categories:
- 🏛️ Sightseeing & Landmarks
- 🍽️ Food & Dining
- 🏔️ Adventure & Outdoor
- 🎭 Culture & History
- 🛍️ Shopping
- 🌿 Nature & Outdoors
- 🎨 Art & Museums
- 🌙 Nightlife
- 🧘 Relaxation
- 📸 Photography
- 🏘️ Local Experiences
- 🏛️ Architecture

### Enhanced PDF Export
Professional PDFs include:
- **Branded Header**: Beautiful formatting with your destination
- **Structured Layout**: Clear day-by-day organization
- **Activity Details**: Times, locations, and descriptions
- **Visual Elements**: Icons and color coding
- **Print Ready**: Optimized for printing and sharing

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure responsive design works on all devices

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT API
- **Google Maps** for location services
- **Nodemailer** for email functionality
- **React Team** for the amazing framework
- **Vite Team** for the fast build tool

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

---

**Happy Traveling! ✈️🌍**

*Built with ❤️ using React & AI*

# AI Travel Planner

A full stack AI-powered travel planning app that helps you generate personalized itineraries, discover famous places, and manage your trips with ease.

## Features
- **AI Itinerary Generation:** Get smart, day-by-day travel plans using OpenAI GPT.
- **Famous Places Discovery:** See top attractions for any city (OpenTripMap, OpenStreetMap, no paid APIs required).
- **Interactive Map:** Visualize your destination with Google Maps.
- **PDF Export:** Download your itinerary as a beautiful PDF.
- **WhatsApp Bot:** (Optional) Send your itinerary to WhatsApp.
- **Email Sharing:** (Optional) Email your itinerary to yourself or friends.
- **Responsive UI:** Modern, mobile-friendly design (React + Vite).
- **Secure:** API keys and sensitive data are managed via environment variables.

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **AI:** OpenAI GPT
- **Maps/Places:** OpenTripMap, OpenStreetMap, Google Maps (for map display only)

## How It Works
1. Enter your destination, dates, and interests.
2. The app generates a custom itinerary and shows famous places for your city.
3. View your plan, export as PDF, or share via email/WhatsApp.

## Deployment
- Backend: Easily deployable to Render, Railway, or Cyclic.
- Frontend: Deploy to Vercel or Netlify.
- All API keys and secrets should be set in environment variables (never committed).

## Setup
1. Clone the repo.
2. Set up your `.env` file (see `.env.example`).
3. Run backend and frontend separately (`npm install && npm start` in each folder).
4. Visit the frontend URL and start planning your trip!

---

**Built with ❤️ by Divyansh.**
