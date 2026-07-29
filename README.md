# InterviewPilot AI — 5-Month Development Roadmap

**Stack:** Laravel 13 (PHP 8.3+) + React 19.2 + TypeScript + Vite
**Pace:** ~3 hours/day, 5–6 days/week (15–18 hours/week)
**Duration:** 20 weeks (≈ 4.5–5 months)

## Development Strategy

Build the **MVP first**, then expand with advanced features. This project is ambitious, so trying to implement everything at once will likely lead to burnout and an unfinished product. The core interview workflow should be fully functional before adding "wow" features such as animated avatars, gamification, or company-specific interview modes.

---

# MONTH 1 — Foundation (Backend + Frontend Skeleton + Authentication)

## Week 1: Project Setup

* Create the monorepo structure (`apps/frontend`, `apps/backend`)
* Set up Laravel 13 (PHP 8.3+), PostgreSQL, and Redis
* Set up React 19.2 + Vite + TypeScript + Tailwind CSS
* Initialize Git repository, README skeleton, `.env.example`, and the first Docker Compose configuration (PostgreSQL + Redis only)
* Configure ESLint, Prettier, and Laravel Pint

## Week 2: Authentication System

* Build Register/Login/Logout APIs using Laravel Sanctum
* Create Login/Register pages using React Hook Form + Zod validation
* Manage authentication state with Zustand
* Configure Axios interceptors for token handling
* Install and configure Spatie Permission (roles: `user`, `admin`)

## Week 3: Database Schema

* Create migrations for:

  * Users
  * Interviews
  * Questions
  * Answers
  * Skills
  * Reports
* Define Eloquent model relationships
* Create database seeders for testing
* Configure Swagger/OpenAPI and document the first API endpoints

## Week 4: Dashboard Skeleton & Routing

* Configure React Router
* Create pages:

  * Dashboard
  * Profile
  * Interview
  * Settings
* Integrate TanStack Query for API fetching and caching
* Build a basic Dashboard UI using static data
* Add page transition animations with Framer Motion
* Create the Profile page with a CV upload UI (frontend only)

### Month 1 Outcome

Users can register, log in, and access a basic dashboard.

---

# MONTH 2 — Core AI Interview Flow

## Week 5: AI Provider Abstraction

* Explore Laravel 13 AI SDK and its provider-agnostic architecture
* Create a Strategy Pattern inside `ai/providers`
* Define `AiProviderInterface`

  * `sendMessage()`
  * `streamResponse()`
* Install Ollama locally
* Test models such as:

  * Llama 3.1 8B
  * Qwen

## Week 6: System Prompt Engine

* Generate dynamic system prompts based on interview type:

  * Backend
  * Frontend
  * HR
  * etc.
* Create the `InterviewSession` model
* Store conversation history
* Use Laravel Queues to process AI responses asynchronously

## Week 7: Interview API Flow

Build the complete interview pipeline:

* Start interview
* Fetch first question
* Submit answer
* Generate next question
* Maintain conversation memory
* Test the entire workflow using Postman and Swagger

## Week 8: Frontend Interview UI

* Build the interview chat interface
* Display AI questions
* Allow text-based answers (voice comes later)
* Add typing indicators / streaming effect
* Let users select:

  * Interview type
  * Difficulty level

### Month 2 Outcome

A fully functional AI-powered text interview system—the core intelligence of the project.

---

# MONTH 3 — Voice & Avatar

## Week 9: Speech-to-Text

* Install Whisper.cpp or Faster-Whisper
* Create an endpoint for audio transcription
* Implement microphone recording using the MediaRecorder API

## Week 10: Text-to-Speech

* Install Kokoro TTS (or Piper)
* Convert AI responses into speech
* Add audio playback
* Display an "AI Speaking" indicator

## Week 11: Avatar (Initial Version)

Start simple:

* SVG avatar
* Lottie animation
* CSS-based avatar

Save advanced solutions (Live2D or Three.js) for future versions.

Features:

* Basic lip-sync based on audio amplitude
* Listening animation
* Speaking animation

## Week 12: Realtime Communication

* Install Laravel Reverb (WebSockets)
* Stream:

  * Speech-to-Text
  * LLM responses
  * Text-to-Speech
* Optimize latency and realtime communication

### Month 3 Outcome

A voice-enabled interview experience with a simple animated AI avatar.

---

# MONTH 4 — Reports, Analytics & Gamification

## Week 13: AI Evaluation System

After the interview:

* Send the full transcript to the AI
* Receive structured JSON feedback

Evaluation categories:

* Technical Skills
* Communication
* Confidence
* Architecture
* Security

Store:

* Overall score
* Score breakdown
* Strengths
* Weaknesses
* Transcript

## Week 14: Report UI

Create the report page featuring:

* Overall interview score
* Radar chart
* Transcript viewer
* Recommended learning path (initially static)

## Week 15: Dashboard Analytics

Display:

* Today's practice
* Average score
* Completed interviews
* Weekly and monthly progress charts (Recharts)
* Skill radar based on real interview data

## Week 16: Lightweight Gamification

Implement:

* XP system
* Level progression
* Daily streak tracking
* 5–6 achievement badges

Keep the first version simple.

### Month 4 Outcome

Users receive detailed AI feedback and can track their long-term improvement.

---

# MONTH 5 — CV Matching, Admin Panel & Release

## Week 17: CV & Job Description Matching

* Upload CV (PDF)
* Extract text on the backend
* Generate interview questions based on the candidate's CV
* (Optional) Upload a Job Description to generate role-specific interviews

## Week 18: Minimal Admin Panel

Build an admin dashboard using Filament:

* Users
* Interviews
* Reports
* Basic analytics:

  * Total users
  * Total interviews

## Week 19: Provider Configuration & Docker

* Configure AI/STT/TTS providers through `.env`
* Make providers easily switchable
* Create a complete Docker Compose environment including:

  * Laravel
  * React
  * PostgreSQL
  * Redis
  * Ollama
* Perform bug fixing and performance optimization

## Week 20: Documentation & Release

* Write a comprehensive README:

  * Installation
  * Configuration
  * Screenshots
  * Roadmap
* Create demo videos and GIFs
* Clean up the GitHub repository
* Choose the MIT License
* Publish the **v1.0 Release**

### Month 5 Outcome

A production-ready, fully documented, Dockerized, open-source AI interview platform that can be easily installed and extended by developers.




## Text-to-Speech Setup (Piper)

InterviewPilot AI uses **Piper TTS** for local text-to-speech synthesis.

### 1. Download Piper

Download the latest Windows release from the Piper GitHub releases page and extract it to:

```text
services/tts/piper/
```

### 2. Download a voice model

Download an English voice model (for example, `en_US-amy-medium`) and place these files in:

```text
services/tts/piper/voices/
```

Required files:

```text
en_US-amy-medium.onnx
en_US-amy-medium.onnx.json
```

> Voice models are not included in this repository to keep the project lightweight.

### 3. Test Piper

Run the following command inside `services/tts/piper`:

```powershell
echo "Hello, this is a test." | .\piper.exe --model voices\en_US-amy-medium.onnx --output_file test.wav
```

If `test.wav` is generated and plays correctly, Piper is configured successfully.