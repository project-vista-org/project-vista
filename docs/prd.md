# 📘 Product Requirements Document (PRD) – Project Vista

---

## 🧠 Product Overview

**Name:** Project Vista  
**Type:** Knowledge tracking and exploration platform  
**Tagline:** *Expand your perspective, one track at a time.*  
**Goal:** Help individuals explore and retain essential knowledge through structured, track-based learning—using Wikipedia as the foundation and daily, social rhythm as the motivation.

---

## ✨ Philosophy

- **Bite-sized learning**: Articles and summaries that fit into daily, sustainable habits.
- **User-centric**: Track what *you* want to know—not what a course dictates.
- **Social alignment**: Learn together, like Daf Yomi for secular knowledge.
- **Knowledge graphs**: Topics are connected; learning is nonlinear and cumulative.
- **Wikipedia-based**: Open, transparent, and deep source of human knowledge.

---

## 🎯 App Purpose

To give users a structured, personal, and socially-aware way to read, track, and complete topics of knowledge from Wikipedia—organized into **tracks** (i.e., curated sequences of learning items).

---

## 🧭 Use Cases

1. **Self-directed knowledge building**
   - Users create their own tracks from Wikipedia on topics they want to master.
   - Tracks can be daily habits (1 item/day) or freeform.

2. **Shared learning journeys**
   - Users can follow trending or curated public tracks (e.g. *History of Modern Conflicts*, *Philosophy 101*, *Logical Fallacies*).
   - Tracks can be joined “live” with others or started independently.

3. **AI-assisted learning curation**
   - User types: *“I want to understand cyber warfare”* → app generates a 7-item track.

4. **Reflection & progress**
   - Users can see what they’ve learned, their streaks, summaries, and tracks completed.

5. **Exploration by dependency**
   - The system prompts: “You're ready to learn *X* because you already covered its prerequisites.”

---

## 👤 Typical User Flows

### 1. **Onboarding**
- Login with Google
- Choose interests (e.g., History, Science, Politics)
- Suggested tracks are shown
- User can join or create their first track

### 2. **Creating a Track**
- Click “Create a Track”
- Input title and description
- Search for Wikipedia articles (type-ahead)
- Add them as ordered items
- Save → Track appears in “My Tracks”

### 3. **Reading a Daily Item**
- Go to “My Tracks”
- Click on active track → today’s item is highlighted
- View in-app article (or summary)
- Click “Mark as Completed”
- Quiz (if enabled) → optional
- Progress updates + streak tracked

### 4. **Exploring Public Tracks**
- Go to “Explore”
- Browse trending / popular / curated tracks
- Click into one → preview content
- Click “Join Track” → it’s cloned into “My Tracks”

### 5. **Seeing Learning Graph**
- Go to “My Items”
- View map of read topics and their connections
- Prompts suggest “ready to learn” topics

---

## 📅 Phase Breakdown (Agile – 2 weeks per phase)

### **Phase 0: MVP**
- Login with Google
- User can create private tracks (title + list of Wikipedia articles)
- Tracks are stored and shown as cards in “My Tracks”
- Clicking an article redirects to Wikipedia

### **Phase 1: In-app Reader + Progress Tracking**
- Built-in reader for each article (no redirection)
- “Mark as completed” per item
- Visual progress bar per track

### **Phase 2: Magic Track Creation + Summarization**
- User types vague topic → ChatGPT generates:
  - Track title
  - Description
  - 7 linked Wikipedia articles
- ChatGPT generates 1500-word summaries per article

### **Phase 3: Explore Tab + Public Tracks**
- “Explore” view with public tracks
- Join button to copy to “My Tracks”
- Trending tracks shown with live user counts

### **Phase 4: Stats + Completion Feedback**
- Completion view: time taken, items completed, new suggestions
- Achievements: first track done, 7-day streak, etc.

### **Phase 5: Quizzes + Validation**
- 3–5 question multiple choice quiz per article
- Required for “completion” tracking
- Score stored for review

### **Phase 6: Smart Suggestions + Dependencies**
- Tracks suggest new items based on what you’ve already read
- Learning “graph” view unlocked

### **Phase 7: Offline Mode + Mobile Optimization**
- Download track for offline access
- Mobile-optimized UI and reading experience

---

## 🧱 Core Concepts & Terms

| Term    | Definition                                             |
|---------|--------------------------------------------------------|
| Track   | An ordered list of Wikipedia articles on a topic       |
| Item    | A single Wikipedia article inside a track              |
| Summary | AI-generated 1500-word digest of a Wikipedia article   |
| Completed | An item the user has marked as done (optionally with quiz) |
| Explore | The public view of trending and curated tracks         |

---

## 🔧 Tech Stack (Current Plan)

| Layer        | Stack                        |
|--------------|------------------------------|
| Frontend     | Next.js + Tailwind           |
| Backend      | FastAPI on AWS Lambda        |
| Auth         | Google OAuth                 |
| DB           | PostgreSQL (hosted)          |
| AI           | OpenAI (via GPT API)         |
| Storage      | S3 for summaries, images     |
| Deployment   | Vercel (FE), AWS Lambda (BE) |


---

## 🚀 Long-Term Vision

> Create the **Daf Yomi** of secular knowledge: shared, global, structured learning for curious minds—without classrooms or gatekeeping.

