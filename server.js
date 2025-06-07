// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const open = require('open').default;
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const csrf = require('csurf');
const { Sequelize, DataTypes } = require('sequelize');
const expressLayouts = require('express-ejs-layouts');
const openai = require('openai');


// OpenAI API key
openai.apiKey = process.env.OPENAI_API_KEY;

// Initialize express app
const app = express();

// Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // use layout.ejs by default

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

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL || 'sqlite:women_health.db', {
  dialect: 'sqlite',
  logging: false
});

// Import models
const initModels = require('./models');
const models = initModels(sequelize);

// Sync database and create categories
(async () => {
  await sequelize.sync();

  const categories = await models.ForumCategory.findAll();
  if (!categories.length) {
    await models.ForumCategory.bulkCreate([
      { name: 'General Discussion', description: 'General discussions about women\'s health and wellness.' },
      { name: 'Menstrual Health', description: 'Discuss topics related to menstrual cycles, period health, and related concerns.' },
      { name: 'Pregnancy & Childbirth', description: 'Share experiences and questions about pregnancy, childbirth, and postpartum care.' },
      { name: 'Fertility & Family Planning', description: 'Discussions about fertility, conception, and family planning methods.' },
      { name: 'Menopause', description: 'Support and discussions related to perimenopause, menopause, and post-menopause experiences.' },
      { name: 'Sexual Health', description: 'Discussions about sexual health, intimacy, and related topics.' },
      { name: 'Mental Health', description: 'Support and discussions about mental health challenges and wellness strategies.' },
      { name: 'Success Stories', description: 'Share your success stories and positive experiences.' }
    ]);
  }
})();

// Routes
const trackingRoutes = require('./routes/tracking');
const educationRoutes = require('./routes/education');
const wellnessRoutes = require('./routes/wellness');
const forumRoutes = require('./routes/forum');
const chatbotRoutes = require('./routes/chatbot');

app.get('/', (req, res) => res.render('index'));
app.use('/tracking', trackingRoutes);
app.use('/education', educationRoutes);
app.use('/wellness', wellnessRoutes);
app.use('/community-forum', forumRoutes);
app.use('/ai-chatbot', chatbotRoutes);

app.get('/about', (req, res) => res.render('about'));
app.get('/partners', (req, res) => res.render('partners'));
app.get('/contact', (req, res) => res.render('contact'));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});