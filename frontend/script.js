const container = document.getElementById("songContainer")
const loading = document.getElementById("loading")
const historyContainer = document.getElementById("historyContainer")

let songs = []


async function getSongs(mood){

loading.style.display = "block"

try{

const response = await fetch("http://localhost:3000/predict/api/recommend",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({name:mood})
})

const data = await response.json()

songs = data

displaySongs(songs)

saveHistory(mood)

}
catch(error){

console.error("Error fetching songs:", error)
alert("Failed to fetch recommendations")

}

loading.style.display = "none"

}


function displaySongs(songList){

container.innerHTML = ""

songList.forEach(song => {

let card = document.createElement("div")

card.className = "song-card"

card.innerHTML = `

${song.album_art ? `<img src="${song.album_art}">` : ''}

<h3>${song.track_name || 'Unknown'}</h3>

<p>${song.artists || 'Unknown'}</p>

<div class="music-buttons">

${song.spotify_url ? `<button onclick="window.open('${song.spotify_url}')">
Spotify
</button>` : ''}

<button onclick="window.open('https://music.youtube.com/search?q=${encodeURIComponent((song.track_name || '') + ' ' + (song.artists || ''))}')">
YT Music
</button>

</div>

${song.spotify_id ? `<iframe 
src="https://open.spotify.com/embed/track/${song.spotify_id}" 
loading="lazy">
</iframe>` : ''}

<div class="feedback">

<button onclick="likeSong('${(song.track_name || '').replace(/'/g, "\\'")}')">👍</button>
<button onclick="dislikeSong('${(song.track_name || '').replace(/'/g, "\\'")}')">👎</button>

</div>

`

container.appendChild(card)

})

}


function refreshSongs(){

songs.sort(() => Math.random() - 0.5)

displaySongs(songs)

}


function likeSong(song){

alert("You liked " + song)

}


function dislikeSong(song){

alert("You disliked " + song)

}


function filterGenre(){

let genre = document.getElementById("genreFilter").value

if(genre === "all"){

displaySongs(songs)

}

else{

let filtered = songs.filter(s => s.genre === genre)

displaySongs(filtered)

}

}


function toggleMode(){

document.body.classList.toggle("light")

}


function saveHistory(mood){

let item = document.createElement("div")

item.textContent = "Mood: " + mood

historyContainer.appendChild(item)

}