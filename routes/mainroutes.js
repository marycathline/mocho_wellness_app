const express = require('express');
const router = express.Router();


// Import models
const ChatHistory = require('../models/ChatHistory');
const CycleData = require('../models/CycleData');
const ForumCategory = require('../models/ForumCategory');
const ForumPost = require('../models/ForumPost');
const ForumComment = require('../models/ForumComment');
const MenstrualCycle = require('../models/MenstrualCycle');
const DoctorAppointment = require('../models/DoctorAppointment');
const User = require('../models/User');

// Example: Home page
router.get('/', (req, res) => {
  res.render('index');
});


// Tracking routes
router.get('/views/menstrual-cycle', (req, res) => res.render('views/menstrual_cycle'));
router.get('/views/ovulation-fertility', (req, res) => res.render('views/ovulation_fertility'));
router.get('/views/pregnancy-milestones', (req, res) => res.render('views/pregnancy_milestones'));
router.get('/views/postpartum-care', (req, res) => res.render('views/postpartum_care'));
router.get('/views/menopause-tracker', (req, res) => res.render('views/menopause_tracker'));

// Education routes
router.get('/views/sexual-reproductive-health', (req, res) => res.render('views/sexual_reproductive_health'));
router.get('/views/family-planning', (req, res) => res.render('views/family_planning'));
router.get('/views/antenatal-postnatal', (req, res) => res.render('views/antenatal_postnatal'));
router.get('/views/gynecological-issues', (req, res) => res.render('views/gynecological_issues'));
router.get('/views/vaccination', (req, res) => res.render('views/vaccination'));
router.get('/views/cancer-awareness', (req, res) => res.render('views/cancer_awareness'));

// Wellness routes
router.get('/views/mental-health', (req, res) => res.render('views/mental_health'));
router.get('/views/nutrition', (req, res) => res.render('views/nutrition'));
router.get('/views/fitness', (req, res) => res.render('views/fitness'));
router.get('/views/stress-management', (req, res) => res.render('views/stress_management'));
router.get('/views/healthy-habits', (req, res) => res.render('views/healthy_habits'));

// Static pages
router.get('/about', (req, res) => res.render('about'));
router.get('/partners', (req, res) => res.render('partners'));
router.get('/contact', (req, res) => res.render('contact'));

// Example: AI Chatbot page
router.get('/ai-chatbot', async (req, res) => {
  let chat_history = [];
  if (req.session.user_id) {
    chat_history = await ChatHistory.find({ user_id: req.session.user_id })
      .sort({ created_at: -1 })
      .limit(10)
      .exec();
  }
  res.render('ai_chatbot', { chat_history });
});

// Example: Save AI chat message (call this after getting AI response)
router.post('/save-chat', async (req, res) => {
  try {
    const { message, response } = req.body;
    const user_id = req.session.user_id;
    if (!user_id) return res.status(401).json({ status: 'error', message: 'Not logged in' });

    await ChatHistory.create({ user_id, message, response });
    res.json({ status: 'success' });
  } catch (e) {
    res.json({ status: 'error', message: 'Could not save chat history' });
  }
});

// Example: Menstrual cycle tracking page
router.get('/views/menstrual-cycle', (req, res) => {
  res.render('views/menstrual_cycle');
});

// Example: Save cycle data
router.post('/save-cycle-data', async (req, res) => {
  try {
    const { date, flow_level, pain_level, mood, energy_level, stress_level, notes } = req.body;
    const cramping = !!req.body.cramping;
    const headache = !!req.body.headache;
    const breast_tenderness = !!req.body.breast_tenderness;
    const bloating = !!req.body.bloating;
    const user_id = req.session.user_id || null;

    await CycleData.create({
      user_id,
      date,
      flow_level,
      pain_level,
      cramping,
      headache,
      breast_tenderness,
      bloating,
      mood,
      energy_level,
      stress_level,
      notes
    });

    req.flash('success', 'Your cycle data has been saved!');
    res.redirect('/views/menstrual-cycle');
  } catch (e) {
    req.flash('danger', 'There was an error saving your data. Please try again.');
    res.redirect('/views/menstrual-cycle');
  }
});

// Add more routes for forum, appointments, etc. as needed

router.get('/join-consultation/:id', async (req, res) => {
  try {
    // your logic here, e.g. fetch appointment info
    const appointment = await getAppointmentById(req.params.id);

    res.render('join_consultation', {
      appointment,
      user_id: req.session.userId, // or however you pass user ID
      // other data needed by the view
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;