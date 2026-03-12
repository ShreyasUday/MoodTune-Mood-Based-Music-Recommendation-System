# MoodTune 🎧

A mood-based music recommendation system that uses **Machine Learning (K-Means Clustering + KNN)** to suggest songs based on how you're feeling. Songs are enriched with Spotify metadata (album art, preview players, direct links) via the Spotify Web API.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **ML Service** | Python, FastAPI, scikit-learn, pandas, joblib |
| **API Gateway** | Node.js, Express.js |
| **Frontend** | HTML, CSS, JavaScript (Vanilla) |
| **External API** | Spotify Web API |

---

## Architecture

```
Frontend (HTML/JS)
    │
    ▼  POST /predict/api/recommend
Node.js API (Express, port 3000)
    │
    ├──▶ POST /songs → FastAPI ML Service (port 8000)
    │        └── K-Means + KNN recommendation
    │
    └──▶ Spotify Web API
             └── Enriches songs with album art, links, embeds
```

---

## Features

- 🎭 **Mood-based recommendations** — Choose from Happy, Sad, Calm, Angry, or Energetic
- 🤖 **ML-powered** — Uses K-Means clustering and K-Nearest Neighbors for song similarity
- 🎵 **Spotify integration** — Album art, embedded players, and direct Spotify links
- 🎶 **YouTube Music links** — One-click search on YouTube Music
- 🌙 **Dark/Light mode** — Toggle between themes
- 🔀 **Refresh & shuffle** — Shuffle recommendations without re-querying
- 👍👎 **Feedback buttons** — Like/dislike songs
- 🎸 **Genre filter** — Filter recommendations by genre

---

## Project Structure

```
PROJECT/
├── backend/
│   ├── ml-service/          # FastAPI Python backend
│   │   └── app.py           # ML API endpoint
│   └── node-api/            # Express.js API gateway
│       └── src/
│           ├── app.js        # Express app setup
│           ├── server.js     # Server entry point
│           ├── controller/   # Request handlers
│           └── routes/       # API routes
├── frontend/
│   ├── index.html            # Main UI
│   ├── script.js             # Frontend logic
│   └── style.css             # Styling
├── models/                   # Trained ML models (.pkl)
├── data/                     # Dataset (not included in repo)
├── notebooks/                # Jupyter notebook (model training)
├── recommendation.py         # Core recommendation logic
├── requirements.txt          # Python dependencies
├── package.json              # Node.js dependencies
└── .env                      # Spotify API credentials (not tracked)
```

> 📁 **Dataset**: The `data/` folder is not included in this repo. [Download it from Google Drive](https://drive.google.com/drive/folders/1Kt4jyh1KxrUtFktTSthiDZ-l2rrOHkv3?usp=sharing) and place it in the project root.

---

## Setup & Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- Spotify Developer Account ([Create one here](https://developer.spotify.com/dashboard))

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/MoodTune.git
cd MoodTune
```

### 2. Create a `.env` file in the project root

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_SECRET=your_spotify_client_secret
```

### 3. Setup Python backend

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install fastapi uvicorn pydantic scikit-learn pandas joblib
```

### 4. Setup Node.js API

```bash
npm install
```

---

## Running the Application

You need **3 terminals** open, all from the project root directory.

### Terminal 1 — FastAPI ML Service (port 8000)

```bash
venv\Scripts\activate
uvicorn backend.ml-service.app:app --port 8000 --reload
```

### Terminal 2 — Node.js API Gateway (port 3000)

```bash
node backend/node-api/src/server.js
```

### Terminal 3 — Frontend

Open `frontend/index.html` in your browser, or use VS Code Live Server.

---

## How It Works

1. **User selects a mood** on the frontend (e.g., "Happy")
2. **Frontend** sends a `POST` request to the Node.js API (`/predict/api/recommend`)
3. **Node.js API** forwards the mood to the FastAPI ML service (`/songs`)
4. **FastAPI** uses the trained ML models to:
   - Map the mood to a cluster (K-Means)
   - Find similar songs using K-Nearest Neighbors
   - Return song names and artists
5. **Node.js API** enriches each song with Spotify metadata (album art, preview URL, Spotify link)
6. **Frontend** displays the enriched song cards with playback options

---

## ML Model Details

- **Dataset**: Spotify songs dataset with audio features (energy, valence, danceability, acousticness, instrumentalness, liveness)
- **Clustering**: K-Means (6 clusters mapped to moods)
- **Similarity**: K-Nearest Neighbors on PCA-reduced, scaled features
- **Training notebook**: `notebooks/reccomender.ipynb`

---

## License

This project is for educational purposes.
