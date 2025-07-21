const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Import models
const ChatHistory = require('../models/ChatHistory');
const CycleData = require('../models/CycleData');
const DoctorAppointment = require('../models/DoctorAppointment');
const User = require('../models/User'); // Assuming doctors are users with role 'doctor'

// Home
router.get('/', (req, res) => {
  res.render('index', {
    messages: [], 
    appointment: null
  });
});

// Views - Health Tracking
router.get('/menstrual_cycle', (req, res) => res.render('menstrual_cycle'));
router.get('/ovulation_fertility', (req, res) => res.render('ovulation_fertility'));
router.get('/pregnancy_milestones', (req, res) => res.render('pregnancy_milestones'));
router.get('/postpartum_care', (req, res) => res.render('postpartum_care'));
router.get('/menopause_tracker', (req, res) => res.render('menopause_tracker'));

// Views - Education
router.get('/sexual_reproductive_health', (req, res) => res.render('sexual_reproductive_health'));
router.get('/family_planning', (req, res) => res.render('family_planning'));

// Antenatal and Postnatal Care
router.get('/antenatal_postnatal2', (req, res) => {
  res.render('antenatal_postnatal', {
    title: 'Pre & Postnatal Care',
    pregnancyMilestonesUrl: '/pregnancy_milestones'
  });
});

router.get('/antenatal_postnatal', (req, res) => {
  res.render('antenatal_postnatal', {
    title: 'Pregnancy Milestones Tracker',
    pregnancyMilestonesUrl: '/pregnancy_milestones2'
  });
});



router.get('/gynecological_issues', (req, res) => res.render('gynecological_issues'));
router.get('/vaccination', (req, res) => res.render('vaccination'));
router.get('/cancer_awareness', (req, res) => res.render('cancer_awareness'));

// Views - Wellness
router.get('/mental_health', (req, res) => res.render('mental_health'));
router.get('/nutrition', (req, res) => res.render('nutrition'));
router.get('/fitness', (req, res) => res.render('fitness'));
router.get('/stress_management', (req, res) => res.render('stress_management'));
router.get('/healthy_habits', (req, res) => res.render('healthy_habits'));

// Static Pages
router.get('/about', (req, res) => res.render('about'));
router.get('/partners', (req, res) => res.render('partners'));
router.get('/contact', (req, res) => res.render('contact'));

// Doctor consultation page
router.get('/doctor_consultation', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });
    const user_appointments = await DoctorAppointment.find({ user_id: req.session.user_id });
    const doctor_specialties = {}; 
    res.render('doctor_consultation', {
      doctors,
      user_appointments,
      doctor_specialties,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Appointment booking form
router.get('/book_appointment', async (req, res) => {
  try {
    const doctorId = req.query.doctor_id;
    const doctor = await User.findById(doctorId);

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).send('Doctor not found');
    }

    res.render('book_appointment', { doctor });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.post('/book_appointment', async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_type } = req.body;
    const appointment = new DoctorAppointment({
      user_id: req.session.user_id,
      doctor_id,
      appointment_date,
      appointment_type,
      status: 'scheduled',
    });
    await appointment.save();
    res.redirect('/doctor_consultation');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to book appointment');
  }
});

// AI Chatbot
router.get('/ai_chatbot', async (req, res) => {
  let chat_history = [];
  if (req.session.user_id) {
    chat_history = await ChatHistory.find({ user_id: req.session.user_id })
      .sort({ created_at: -1 })
      .limit(10);
  }
  res.render('ai_chatbot', {
    chat_history,
    csrfToken: req.csrfToken()
  });
});

router.post('/ai_chatbot', async (req, res) => {
  const { message } = req.body;
  const user_id = req.session.user_id;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful health assistant at MochoCare.' },
        { role: 'user', content: message }
      ]
    });

    const aiResponse = completion.choices[0].message.content;

    if (user_id) {
      await ChatHistory.create({ user_id, message, response: aiResponse });
    }

    res.json({ status: 'success', response: aiResponse });

  } catch (err) {
    console.error('❌ OpenAI error:', err.response?.data || err.message);
    res.status(500).json({
      status: 'error',
      message: 'AI failed to respond. Please try again later.'
    });
  }
});

router.post('/save_chat', async (req, res) => {
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

// Menstrual Cycle Tracking
router.post('/save-cycle-data', async (req, res) => {
  try {
    const {
      date, flow_level, pain_level, mood, energy_level,
      stress_level, notes, cramping, headache,
      breast_tenderness, bloating
    } = req.body;
    const user_id = req.session.user_id || null;

    await CycleData.create({
      user_id,
      date,
      flow_level,
      pain_level,
      cramping: !!cramping,
      headache: !!headache,
      breast_tenderness: !!breast_tenderness,
      bloating: !!bloating,
      mood,
      energy_level,
      stress_level,
      notes
    });

    req.flash('success', 'Your cycle data has been saved!');
    res.redirect('/menstrual_cycle');
  } catch (e) {
    req.flash('danger', 'There was an error saving your data. Please try again.');
    res.redirect('/menstrual_cycle');
  }
});

// Community Forum
const categories = [
  { id: 'general', name: 'General Discussion' },
  { id: 'menstrual', name: 'Menstrual Health' },
  { id: 'pregnancy', name: 'Pregnancy & Childbirth' },
  { id: 'fertility', name: 'Fertility & Family Planning' },
  { id: 'menopause', name: 'Menopause' },
  { id: 'sexual-health', name: 'Sexual Health' },
  { id: 'mental-health', name: 'Mental Health' },
  { id: 'success', name: 'Success Stories' }
];

router.get('/community_forum', (req, res) => {
  const recent_posts = [
    {
      id: 'post1',
      title: 'How to track your cycle accurately',
      author: { username: 'Grace' },
      category: { name: 'Menstrual Health' },
      created_at: new Date(),
      views: 30,
      comments: [{}, {}],
      likes: 12
    },
    {
      id: 'post2',
      title: 'First trimester tips',
      author: { username: 'MamaK' },
      category: { name: 'Pregnancy & Childbirth' },
      created_at: new Date(),
      views: 45,
      comments: [{}],
      likes: 8
    }
  ];

  res.render('community_forum', {
    categories,
    recent_posts
  });
});

router.get('/forum/category/:categoryId', (req, res) => {
  const categoryId = req.params.categoryId;
  res.send(`Posts for category: ${categoryId}`);
});

router.get('/forum/new', (req, res) => {
  res.render('new_forum_post', { categories });
});

// Video Consultation
router.get('/join-consultation/:id', async (req, res) => {
  try {
    const appointment = await getAppointmentById(req.params.id);
    res.render('join_consultation', {
      appointment,
      user_id: req.session.user_id
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Educational Resource Duplication Handling
router.get('/cancer', (req, res) => {
  res.render('cancer_awareness', { title: 'Cancer Awareness' });
});

router.get('/cancer_awareness', (req, res) => {
  res.render('cancer_awareness', { title: 'Cancer Awareness (v2)' });
});
// Alternate or v2 Views
router.get('/family_planning2', (req, res) => {
  res.render('family_planning2', { title: 'Family Planning (v2)' });
});

router.get('/gynecological_issues2', (req, res) => {
  res.render('gynecological_issues2', { title: 'Gynecological Health (v2)' });
});
router.get('/gynecological_issues', (req, res) => {
  res.render('gynecological_issues', { title: 'Gynecological Health' });
});

router.get('/menopause_tracker2', (req, res) => {
  res.render('menopause_tracker2', { title: 'Menopause Management (v2)' });
});

router.get('/menstrual_cycle2', (req, res) => {
  res.render('menstrual_cycle2', { title: 'Menstrual Cycle Tracking (v2)' });
});

router.get('/ovulation_fertility2', (req, res) => {
  res.render('ovulation_fertility2', { title: 'Ovulation & Fertility (v2)' });
});

router.get('/postpartum_care2', (req, res) => {
  res.render('postpartum_care2', { title: 'Postpartum Care (v2)' });
});

router.get('/pregnancy_milestones2', (req, res) => {
  res.render('pregnancy_milestones2', { title: 'Pregnancy Milestones (v2)' });
});

router.get('/sexual_reproductive_health2', (req, res) => {
  res.render('sexual_reproductive_health2', { title: 'Sexual & Reproductive Health (v2)' });
});
router.get('/ovulation_fertility', (req, res) => {
  res.render('ovulation_fertility');
});





module.exports = router;
