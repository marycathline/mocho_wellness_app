require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const expressLayouts = require('express-ejs-layouts');
const openai = require('openai');
const mongoose = require('mongoose');

// OpenAI API key
openai.apiKey = process.env.OPENAI_API_KEY;

// Initialize express app
const app = express();

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Serve static files
app.use(express.static(path.join(__dirname, 'static')));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'developmentsecretkey',
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
const csrfProtection = csrf();
app.use(csrfProtection);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Import main routes
const mainroutes = require('./routes/mainroutes');
app.use('/', mainroutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});