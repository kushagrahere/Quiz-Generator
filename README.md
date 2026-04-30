# 🧠 QuizAI — AI-Powered Quiz Generator

QuizAI is a full-stack web application that instantly generates multiple-choice quizzes from any text or PDF document using AI. Built with React, Node.js, and powered by Groq's Llama 3 model.

!\[QuizAI Banner](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge) !\[License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge) !\[Node](https://img.shields.io/badge/Node.js-v20+-brightgreen?style=for-the-badge)

\---

## ✨ Features

* 📄 **PDF Upload** — Upload any PDF and generate a quiz from it instantly
* ✍️ **Text Input** — Paste raw text (lecture notes, articles, anything) to create a quiz
* 🤖 **AI-Generated Questions** — 10 multiple-choice questions with explanations for every answer
* ⏱️ **Per-Question Timer** — 30-second countdown per question to keep things challenging
* 📊 **Progress Dashboard** — Track your quiz history and score trends over time
* 💾 **Auto-Save Results** — Every quiz session is saved to a local SQLite database
* 🎨 **Smooth Animations** — Framer Motion animations for correct/wrong answer feedback
* 📱 **Mobile Responsive** — Works on all screen sizes

\---

## 🛠️ Tech Stack

|Layer|Technology|
|-|-|
|Frontend|React + Vite + Tailwind CSS + Framer Motion|
|Backend|Node.js + Express|
|Database|SQLite (sql.js)|
|AI Model|Llama 3.1 via Groq API|
|PDF Parsing|pdf-parse|

\---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org) v18 or higher
* A free [Groq API Key](https://console.groq.com)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/kushagrahere/quiz-generator.git
cd quiz-generator
```

**2. Install dependencies**

```bash
npm install
cd backend \&\& npm install
cd ../frontend \&\& npm install
cd ..
```

**3. Set up your API key**

Create a `.env` file inside the `backend/` folder:

```
GROQ\_API\_KEY=your\_groq\_api\_key\_here
```

Get your free API key at 👉 [console.groq.com](https://console.groq.com)

**4. Start the app**

```bash
npm run dev
```

Open your browser and go to **http://localhost:3000** 🎉

\---

## 📁 Project Structure

```
quiz-generator/
├── backend/
│   ├── routes/
│   │   ├── quiz.js        # Quiz generation API
│   │   └── progress.js    # Progress tracking API
│   ├── database.js        # SQLite setup
│   ├── server.js          # Express server
│   └── .env               # API keys (never commit this!)
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Home.jsx
│       │   ├── QuizPlayer.jsx
│       │   ├── Results.jsx
│       │   └── ProgressDashboard.jsx
│       └── App.jsx
└── package.json
```

\---

## 🎮 How to Use

1. **Home Screen** — Choose to upload a PDF or paste text
2. **Generate** — Click "Generate Quiz" and wait a few seconds
3. **Take the Quiz** — Answer 10 questions with a 30s timer each
4. **See Results** — Get your score with detailed explanations
5. **Track Progress** — View your history and improvement over time

\---

## 📊 Scoring

|Score|Message|
|-|-|
|90-100%|Excellent! 🎉|
|70-89%|Good job! 👍|
|50-69%|Keep practicing 📚|
|Below 50%|Review the material and try again 💪|

\---

## 🔒 Security Notes

* Never commit your `.env` file
* Your API key is stored locally and never exposed to the frontend
* The `.gitignore` file already excludes `.env` and `node\_modules/`

\---

## 🤝 Contributing

Pull requests are welcome! Feel free to open an issue for any bugs or feature requests.

\---

## 📄 License

This project is licensed under the MIT License.

\---

## 🙏 Acknowledgements

* Built with [Google Antigravity](https://antigravity.google) agentic IDE
* AI powered by [Groq](https://groq.com) — free and blazing fast
* UI components styled with [Tailwind CSS](https://tailwindcss.com)

