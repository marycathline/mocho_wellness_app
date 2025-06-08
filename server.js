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

// 📡 Add HTTP and Socket.IO for video chat
const http = require('http');
const { Server } = require('socket.io');

// OpenAI API key
openai.apiKey = process.env.OPENAI_API_KEY;

// Initialize express app
const app = express();

// 📡 Create HTTP server and socket instance
const server = http.createServer(app);
const io = new Server(server);

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

// 🌐 Add consultation video page route
app.get('/consultation', (req, res) => {
  res.render('consultation');
});

app.get('/video_call', (req, res) => {
  res.render('video_call', { title: 'Live Video Call' });
});


// Import main routes
const mainroutes = require('./routes/mainroutes');
app.use('/', mainroutes);

// 📡 Handle WebRTC signaling with Socket.IO
io.on('connection', (socket) => {
  socket.on('join-room', ({ appointmentId, userId }) => {
    socket.join(appointmentId);
    socket.to(appointmentId).emit('user-joined');
  });

  socket.on('offer', ({ appointmentId, offer }) => {
    socket.to(appointmentId).emit('offer', { offer });
  });

  socket.on('answer', ({ appointmentId, answer }) => {
    socket.to(appointmentId).emit('answer', { answer });
  });

  socket.on('ice-candidate', ({ appointmentId, candidate }) => {
    socket.to(appointmentId).emit('ice-candidate', { candidate });
  });
});


// 📡 Start server using http server (not app.listen)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
