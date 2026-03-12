

const get_token = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_SECRET
            })
        }
    )
    const data = await result.json()
    return data.access_token
}

const searchSpotifyTrack = async (trackName, artistName, token) => {
    const cleanArtist = artistName.replace(/[\[\]']/g, '');
    const query = encodeURIComponent(`track:${trackName} artist:${cleanArtist}`);

    const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await result.json();
    if (data.tracks && data.tracks.items.length > 0) {
        return data.tracks.items[0];
    }
    return null;
}

export const recommend = async (req, res) => {
    try {
        const mood = req.body.name
        const result = await fetch("http://localhost:8000/songs",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: mood })
            }
        )

        if (!result.ok) {
            console.error("FastAPI error:", result.status, await result.text())
            return res.status(500).json({ error: "ML service error" })
        }

        const rawSongs = await result.json()

        if (!Array.isArray(rawSongs) || rawSongs.length === 0) {
            return res.json([])
        }

        let token = null
        try {
            token = await get_token()
        } catch (e) {
            console.error("Spotify token error:", e.message)
        }

        const enrichedSongsPromises = rawSongs.map(async (song) => {
            if (!token) return { track_name: song.track_name, artists: song.artists };
            try {
                const trackDetails = await searchSpotifyTrack(song.track_name, song.artists, token)
                if (trackDetails) {
                    return {
                        ...song,
                        spotify_id: trackDetails.id,
                        spotify_url: trackDetails.external_urls.spotify,
                        album_art: trackDetails.album.images[0]?.url
                    };
                }
            } catch (e) {
                console.error("Spotify search error for:", song.track_name, e.message)
            }
            return { track_name: song.track_name, artists: song.artists };
        });

        const enrichedSongs = await Promise.all(enrichedSongsPromises);
        res.json(enrichedSongs);
    } catch (error) {
        console.error("Recommend error:", error.message)
        res.status(500).json({ error: "Something went wrong" })
    }
}