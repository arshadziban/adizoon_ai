# Adizoon AI

[![GitHub](https://img.shields.io/badge/GitHub-adizoon__ai-blue?logo=github)](https://github.com/arshadziban/adizoon_ai)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://python.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688?logo=fastapi)](https://fastapi.tiangolo.com)

Adizoon is an intelligent conversational AI chatbot that integrates real-time audio transcription with interactive dialogue. Users can record audio or type text within the system, which is transcribed and processed through the chatbot to deliver intelligent responses and engaging conversations.

## Features

![Features](./img/key_features.png?v=2)

## Screenshots

### Login Page
![Login](./img/1.png?v=2)

### Chat Interface
![OTP Code Interface](./img/2.png?v=2)

### Voice Recording
![User Profile](./img/3.png?v=2)

### AI Response
![AI Response](./img/4.png?v=2)

### Profile Page
![Voice Recording Page](./img/5.png?v=2)

### Settings
![AI Response](./img/6.png?v=2)

### About Page
![Upgrade Plan](./img/7.png?v=2)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | FastAPI (Python 3.11) |
| Speech-to-Text | OpenAI Whisper |
| AI Chat | Perplexity AI (sonar-pro) |


### Backend Setup

```bash
cd backend
python -m venv env
env\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create `.env` file:
```
PERPLEXITY_API_KEY=your_api_key_here
```

Run the server:
```bash
uvicorn main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## How It Works

![System Flow](./img/system%20flow_chat.png?v=2)

## Project Structure

```
adizoon_ai/
├── backend/
│   ├── main.py           # FastAPI app
│   ├── whisper_service.py # Speech-to-text
│   ├── rewrite_service.py # AI chat
│   └── config.py         # Configuration
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main component
│   │   ├── ChatWindow.jsx
│   │   ├── Sidebar.jsx
│   │   └── ...
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/transcribe` | Transcribe audio and get AI response |
| POST | `/chat` | Text-based chat |

## Author

**Arshad Ziban** - [GitHub](https://github.com/arshadziban)


