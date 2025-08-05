require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb+srv://laaddivyansh97:lOh4uNKnSbfSMuTy@cluster0.enbywzt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Basic route
app.get('/', (req, res) => {
  res.send('AI Travel Planner Backend Running');
});

// Test endpoint to check environment variables
app.get('/test-env', (req, res) => {
  res.json({
    openaiKey: process.env.OPENAI_API_KEY ? 'Set' : 'Not set',
    emailUser: process.env.EMAIL_USER ? 'Set' : 'Not set',
    emailPass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
    port: process.env.PORT || 5000
  });
});

const travelPlansRouter = require('./routes/travelPlans');
app.use('/api/travel-plans', travelPlansRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment check:');
  console.log('- OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
  console.log('- Email User:', process.env.EMAIL_USER ? 'Set' : 'Not set');
  console.log('- Email Pass:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
});
