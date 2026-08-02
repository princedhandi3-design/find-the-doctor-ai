# FindTheDoctor AI

**AI-powered symptom triage system that recommends medical specialties and helps users find nearby doctors.**

A healthcare AI application built for the C.O.D.E. Hack 7.0 Innovation Challenge (AI for Good theme).

---

## Problem Statement

Healthcare accessibility is a challenge. Users often don't know:
- What their symptoms might indicate
- Which medical specialty they should consult
- Where to find qualified doctors nearby

This delays care and increases uncertainty during health concerns.

## Solution

FindTheDoctor AI combines:
1. **AI Symptom Triage** — Google Gemini analyzes user symptoms, medical history, and context to recommend the appropriate medical specialty and urgency level
2. **Real Doctor Discovery** — Uses OpenStreetMap (OSM) API to locate nearby doctors based on user geolocation
3. **Instant Access** — No registration; works immediately in the browser

---

## Features

✅ **AI Symptom Analysis**
- Multi-step interview flow collecting symptoms, age, duration, pain severity, and medical history
- Google Gemini Flash latest model for fast, accurate triage
- Returns: recommended specialty, confidence score, urgency level, medical reasoning

✅ **Nearby Doctor Finder**
- Geolocation-based search using OpenStreetMap Overpass API
- Real-time doctor/clinic discovery within specified radius
- Detailed doctor profiles with addresses and specialties

✅ **Mobile-First Design**
- Fully responsive Tailwind CSS styling
- Accessible form inputs with validation
- Clear medical disclaimer on all results

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Google Gemini API key ([Get one free](https://aistudio.google.com/))

### Installation

1. Clone the repository and navigate to the project directory
   ```bash
   git clone <your-repo-url>
   cd find-the-doctor-ai
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173` in your browser

### Building for Production
```bash
npm run build
npm run preview
```

---

## Tech Stack

- **Frontend:** React 19 + TypeScript
- **Styling:** Tailwind CSS 4.3
- **Build Tool:** Vite 8
- **AI Model:** Google Gemini 2.0 Flash (`gemini-flash-latest`)
- **Location Services:** OpenStreetMap Overpass API (free, no API key required)
- **Routing:** React Router DOM v7
- **Icons:** Lucide React

---

## Architecture & Limitations

### Known Limitations
1. **Client-Side API Calls:** Currently calls Gemini API directly from the browser (for hackathon speed). Production deployment should use a backend proxy to keep API keys secure.
2. **localStorage State Management:** Results passed via localStorage between pages. A production app would use Redux/Zustand or server-side sessions.
3. **OSM Coverage:** Doctor discovery relies on OpenStreetMap data quality, which varies by region. Urban areas well-covered; rural areas may have gaps.

**Production Roadmap:**
- [ ] Backend service for Gemini API (Node.js/Python proxy)
- [ ] Secure authentication and session management
- [ ] Database storage for user history and feedback
- [ ] Integration with verified medical provider directories
- [ ] HIPAA compliance review for healthcare data

## Team

Armanjot Singh Dhandi (Team leader : ui and demo video)
Abhijot Singh Dhandi (Backend :backend ,presentation)
---

## AI Usage Disclosure

This project uses AI per C.O.D.E. Hack 7.0 guidelines:

### Tools Used
- **Google Gemini latest Flash API** — Medical symptom analysis and triage
- **Notebookllm - to write presentation

### Purpose of AI Usage
- **Symptom Analysis:** Gemini processes user symptoms/medical history to recommend specialty and urgency
- **Reasoning:** Explains the medical reasoning behind recommendations

### Extent of Contribution
- AI handles symptom triage logic (~40% of app value)
- Human engineering: UX flows, doctor discovery, state management, error handling

### Model Instructions
System prompt instructs Gemini to:
- Return only valid JSON (no markdown)
- Classify urgency as: "routine," "soon," "high," or "emergency"
- Recommend one of: Cardiologist, Dermatologist, Neurologist, etc.
- Include confidence % and medical reasoning

---

## Disclaimer

⚠️ **This is AI guidance only and NOT a medical diagnosis.**

FindTheDoctor AI is an educational triage tool. Users must consult licensed healthcare professionals for medical decisions. In emergency (chest pain, difficulty breathing, severe bleeding), call emergency services immediately.

---

## License

MIT

---

## Submission Materials

- **Demo Video:** See `/demo-video.mp4` (2-5 minutes showing working prototype)
- **Presentation:** See `/presentation.pptx` (problem, solution, tech stack, impact)
