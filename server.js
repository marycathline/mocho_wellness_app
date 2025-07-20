require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const expressLayouts = require('express-ejs-layouts');
const { OpenAI } = require('openai'); // ✅ Correct OpenAI import
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const mainRoutes = require('./routes/mainroutes'); // ✅ Or './routes' if you rename to index.js

// ✅ Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ✅ Initialize app and server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// ✅ View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // assumes you have views/layout.ejs

// ✅ Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'developmentsecretkey',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// ✅ CSRF protection
const csrfProtection = csrf();
app.use(csrfProtection);

// ✅ Socket.IO signaling
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

// ✅ Use routes
app.use('/', mainRoutes);

// ✅ Additional routes
app.get('/consultation', (req, res) => {
  res.render('consultation');
});
app.get('/video_call', (req, res) => {
  res.render('video_call', { title: 'Live Video Call' });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
