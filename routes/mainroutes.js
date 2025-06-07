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
router.get('/tracking/menstrual-cycle', (req, res) => res.render('tracking/menstrual_cycle'));
router.get('/tracking/ovulation-fertility', (req, res) => res.render('tracking/ovulation_fertility'));
router.get('/tracking/pregnancy-milestones', (req, res) => res.render('tracking/pregnancy_milestones'));
router.get('/tracking/postpartum-care', (req, res) => res.render('tracking/postpartum_care'));
router.get('/tracking/menopause-tracker', (req, res) => res.render('tracking/menopause_tracker'));

// Education routes
router.get('/education/sexual-reproductive-health', (req, res) => res.render('education/sexual_reproductive_health'));
router.get('/education/family-planning', (req, res) => res.render('education/family_planning'));
router.get('/education/antenatal-postnatal', (req, res) => res.render('education/antenatal_postnatal'));
router.get('/education/gynecological-issues', (req, res) => res.render('education/gynecological_issues'));
router.get('/education/vaccination', (req, res) => res.render('education/vaccination'));
router.get('/education/cancer-awareness', (req, res) => res.render('education/cancer_awareness'));

// Wellness routes
router.get('/wellness/mental-health', (req, res) => res.render('wellness/mental_health'));
router.get('/wellness/nutrition', (req, res) => res.render('wellness/nutrition'));
router.get('/wellness/fitness', (req, res) => res.render('wellness/fitness'));
router.get('/wellness/stress-management', (req, res) => res.render('wellness/stress_management'));
router.get('/wellness/healthy-habits', (req, res) => res.render('wellness/healthy_habits'));

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
router.get('/tracking/menstrual-cycle', (req, res) => {
  res.render('tracking/menstrual_cycle');
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
    res.redirect('/tracking/menstrual-cycle');
  } catch (e) {
    req.flash('danger', 'There was an error saving your data. Please try again.');
    res.redirect('/tracking/menstrual-cycle');
  }
});

// Add more routes for forum, appointments, etc. as needed

module.exports = router;