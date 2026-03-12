import joblib
import pandas as pd

# ===============================
# Load Models
# ===============================
kmeans = joblib.load("models/kmeans_model.pkl")
scaler = joblib.load("models/scaler.pkl")
pca = joblib.load("models/pca_model.pkl")
nn_model = joblib.load("models/nn_model.pkl")

# ===============================
# Load Dataset
# ===============================
df = pd.read_csv("data/clustered_songs.csv")

# ===============================
# Mood → Cluster Mapping
# ===============================
mood_to_cluster = {
    "happy": 0,
    "sad": 1,
    "energetic": 2,
    "workout": 3,
    "angry": 3,
    "chill": 4,
    "calm": 4,
    "party": 5
}

# ===============================
# Recommendation Function
# ===============================
def recommend_by_mood(mood, n=10):

    if mood not in mood_to_cluster:
        return "Invalid mood"

    cluster_id = mood_to_cluster[mood]

    cluster_songs = df[df["cluster"] == cluster_id]

    # pick random seed song
    seed_index = cluster_songs.sample(1).index[0]

    distances, indices = nn_model.kneighbors([pca.transform(
        scaler.transform(
            df.loc[[seed_index], [
                'energy','valence','danceability',
                'acousticness','instrumentalness','liveness'
            ]]
        )
    )[0]])

    recommended = df.iloc[indices[0][1:n+1]]

    return recommended[["track_name","artists"]]


# ===============================
# Test Function
# ===============================
if __name__ == "__main__":

    mood = "sad"

    songs = recommend_by_mood(mood)

    print(f"\nRecommended songs for mood: {mood}\n")

    print(songs)