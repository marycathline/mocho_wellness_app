🌸 MochoCare App
MochoCare is a women-led, health-focused web application designed to empower users with accurate reproductive and mental health information. It features milestone tracking, health education, access to expert resources, and an AI-powered assistant. The app is built using Express.js for the backend with EJS templates, along with modern CSS via Bootstrap/Tailwind on the frontend.

🧩 Features
💬 AI Health Assistant – Chat interface using OpenAI for women's health Q&A

🩺 Pregnancy Milestones – Week-by-week tracking of pregnancy development

📚 Educational Content – Menstrual health, fertility, menopause & mental wellness

🧘🏽 Holistic Wellness Section – Mental and physical self-care tips
🩸 Menstrual cycle and symptom tracker

👩‍⚕️ Expert Doctor Profiles – Browse health experts and get guidance

🌐 Responsive Design – Optimized for mobile and desktop users

🛠 Tech Stack
Category	Tools Used
Backend	Express.js, Node.js
View Engine	EJS (Embedded JavaScript Templates)
Styling	         CSS + Bootstrap (selectively)
AI Assistant	OpenAI API
Data Storage	MongoDB (via Mongoose)
Static Assets	Public folder (images, CSS, JS)
Deployment	Render, Koyeb, Netlify, or local server

🚀 Getting Started
1. Clone the repo
bash
Copy

git clone https://github.com/marycathline/Mocho_wellness_App.git
cd mochocare-app
2. Install server dependencies
bash
Copy

npm install
3. Set up environment variables
Create a .env file in the root of the project:

env
Copy

PORT=3000
MONGO_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_key
📁 Project Structure
bash
Copy

mochocare-app/
│
├── public/                # Static files (images, CSS, JS)
│   ├── css/
│   ├── js/
│   └── images/
│
├── views/                 # EJS templates
│   ├── partials/          # Header, footer, nav
│   ├── pages/             # Home, About, etc.
│   └── ai_chatbot.ejs     # AI assistant page
│
├── models/                # Mongoose schemas (Post, User, etc.)
│
├── routes/                # Route files (homeRoutes.js, apiRoutes.js)
│
├── .env                   # Environment variables
├── server.js              # App entry point
└── README.md
🔧 Scripts
bash
Copy

# Run app in development
npm run dev

# Run app in production
npm start
🧪 Testing (Coming Soon)
Manual testing on forms and chatbot

Unit testing with Mocha or Jest

E2E testing planned with Cypress

🌐 Deployment Options
Render for backend hosting

Render or Netlify for static site fallback

MongoDB Atlas for database

🔮 Upcoming Features
🔐 Authentication with session or JWT
📲 Push/email notifications

🌍 Multilingual content

✨ Admin dashboard for content management

📸 Screenshots
Add some screenshots of homepage, AI chatbot, or pregnancy tracker UI here

## 🌐 Live Demo

[🔗 MochoCare Live on Render](https://mocho-wellness-app.onrender.com/)

---

## 📊 Presentation Deck

[🖼️ MochoCare Pitch Deck on Canva](https://www.canva.com/design/DAGgZwacYn4/YYkKLhuaxwJSkTtXkarQuQ/view?utm_content=DAGgZwacYn4&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h87340a0291#14)

---

## 👩‍💻 Developer Portfolio

[💻 marycathline on GitHub](https://github.com/marycathline)



👩🏾‍💻 Author
Mary Cathline & Tabitha Wamboi
🚀 Developer | 💗 Health Innovator
[💻 marycathline on GitHub](https://github.com/marycathline)

📄 License
This project is licensed under the MIT License.

