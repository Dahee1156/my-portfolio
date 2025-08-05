const animeList = [
  {
    title: "Attack on Titan",
    genre: "Action",
    image: "https://m.media-amazon.com/images/M/MV5BZjliODY5MzQtMmViZC00MTZmLWFhMWMtMjMwM2I3OGY1MTRiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    episodes: [{ title: "Series Trailer", video: "https://www.youtube-nocookie.com/embed/_3uaePqt33o" }]
  },
  {
    title: "The Quintessential Quintuplets",
    genre: "Romance",
    image: "https://cdn.myanimelist.net/images/anime/1819/97947.jpg",
    episodes: [{ title: "Series Trailer", video: "https://www.youtube-nocookie.com/embed/cYhQRTmU0aA" }]
  },
  {
    title: "Classroom of The Elite",
    genre: "Psychological",
    image: "https://animetv-jp.net/wp-content/uploads/2024/09/GWXmq9yWQAAONS7-724x1024.jpeg",
    episodes: [{ title: "Series Trailer", video: "https://www.youtube-nocookie.com/embed/ur0xHlKFyOA" }]
  },
  {
    title: "Naruto",
    genre: "Adventure",
    image: "https://m.media-amazon.com/images/M/MV5BZTNjOWI0ZTAtOGY1OS00ZGU0LWEyOWYtMjhkYjdlYmVjMDk2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    episodes: [{ title: "Series Trailer", video: "https://www.youtube-nocookie.com/embed/yeUpnIKt6k4" }]
  },
  {
    title: "Danmachi",
    genre: "Fantasy",
    image: "https://m.media-amazon.com/images/M/MV5BN2NkOTJiMDMtYzY0ZC00YjAxLWFlYjUtMTk2NjhmZTEzMmI4XkEyXkFqcGc@._V1_.jpg",
    episodes: [{ title: "Series Trailer", video: "https://www.youtube-nocookie.com/embed/BLbcuKAw4Uw" }]
  },
  {
    title: "Domestic Girlfriend",
    genre: "Romance",
    image: "https://m.media-amazon.com/images/M/MV5BYmQyNWI1ZTgtMTgzNC00ZGIyLTg3NWMtZmM2ZjMzNTNjOTU5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    episodes: [{ title: "Series Trailer", video: "https://www.youtube-nocookie.com/embed/v-ajpK25ajw" }]
  }
];

// DOM references
const container = document.getElementById("animeList");
const searchInput = document.getElementById("searchAnime");
const genreFilter = document.getElementById("genreFilter");
const darkModeToggle = document.getElementById("darkModeToggle");

// LocalStorage
let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
let watched = JSON.parse(localStorage.getItem("watched") || "[]");

const saveLocal = (key, data) => localStorage.setItem(key, JSON.stringify(data));

let currentList = [...animeList];
let showOnlyFavorites = false;

// Display Anime
function displayAnimeList(list) {
  container.innerHTML = "";
  list.forEach(anime => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${anime.image}" alt="${anime.title}">
      <h3>${anime.title}</h3>
      <p>Genre: ${anime.genre}</p>
      <button class="fav-btn">${favorites.includes(anime.title) ? "❤️ Favorited" : "♡ Favorite"}</button>
      <div class="episodes" style="display:none;"></div>
    `;

    const favBtn = card.querySelector(".fav-btn");
    favBtn.onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(anime.title);
      favBtn.textContent = favorites.includes(anime.title) ? "❤️ Favorited" : "♡ Favorite";
    };

    const episodeDiv = card.querySelector(".episodes");

    anime.episodes.forEach(ep => {
      const epBlock = document.createElement("div");
      const epTitle = document.createElement("p");
      epTitle.textContent = ep.title;

      const playBtn = document.createElement("button");
      playBtn.textContent = "▶ Play";
      playBtn.onclick = (e) => {
        e.stopPropagation();
        const iframe = document.createElement("iframe");
        iframe.src = ep.video;
        iframe.width = "100%";
        iframe.height = "200";
        iframe.allowFullscreen = true;
        epBlock.replaceChild(iframe, playBtn);

        const key = anime.title + ep.title;
        if (!watched.includes(key)) {
          watched.push(key);
          saveLocal("watched", watched);
          updateWatchStats();
        }
      };

      const watchBtn = document.createElement("button");
      const key = anime.title + ep.title;
      watchBtn.textContent = watched.includes(key) ? "✅ Watched" : "🎬 Mark as Watched";
      watchBtn.onclick = (e) => {
        e.stopPropagation();
        toggleWatched(key);
        watchBtn.textContent = watched.includes(key) ? "✅ Watched" : "🎬 Mark as Watched";
      };

      epBlock.appendChild(epTitle);
      epBlock.appendChild(playBtn);
      epBlock.appendChild(watchBtn);
      episodeDiv.appendChild(epBlock);
    });

    card.onclick = (e) => {
      if (e.target.tagName !== "BUTTON") {
        episodeDiv.style.display = episodeDiv.style.display === "none" ? "block" : "none";
      }
    };

    container.appendChild(card);
  });

  updateWatchStats();
}

// Helper Functions
function toggleFavorite(title) {
  if (favorites.includes(title)) {
    favorites = favorites.filter(f => f !== title);
  } else {
    favorites.push(title);
  }
  saveLocal("favorites", favorites);
}

function toggleWatched(key) {
  if (watched.includes(key)) {
    watched = watched.filter(w => w !== key);
  } else {
    watched.push(key);
  }
  saveLocal("watched", watched);
}

function applyFilters() {
  const query = searchInput.value.toLowerCase();
  const genre = genreFilter.value;

  currentList = animeList.filter(anime => {
    const matchTitle = anime.title.toLowerCase().includes(query);
    const matchGenre = genre === "all" || anime.genre === genre;
    const matchFav = !showOnlyFavorites || favorites.includes(anime.title);
    return matchTitle && matchGenre && matchFav;
  });

  displayAnimeList(currentList);
}

function sortAnime(order = "asc") {
  currentList.sort((a, b) =>
    order === "asc"
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title)
  );
  displayAnimeList(currentList);
}

function toggleFavoriteFilter() {
  showOnlyFavorites = !showOnlyFavorites;
  applyFilters();
}

function resetAllFilters() {
  searchInput.value = "";
  genreFilter.value = "all";
  showOnlyFavorites = false;
  currentList = [...animeList];
  displayAnimeList(currentList);
}

function updateWatchStats() {
  const totalEpisodes = animeList.reduce((acc, anime) => acc + anime.episodes.length, 0);
  const watchedCount = watched.length;
  document.getElementById("watchStats").textContent = `🎬 Watched ${watchedCount} / ${totalEpisodes} episodes`;
}

// Events
document.getElementById("sortAZ").onclick = () => sortAnime("asc");
document.getElementById("sortZA").onclick = () => sortAnime("desc");
document.getElementById("showFavorites").onclick = toggleFavoriteFilter;
document.getElementById("resetFilters").onclick = resetAllFilters;
searchInput.addEventListener("input", applyFilters);
genreFilter.addEventListener("change", applyFilters);
darkModeToggle.onclick = () => {
  const isDark = !document.body.classList.contains("dark");
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem("darkMode", isDark);
};
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

// Initial Render
displayAnimeList(animeList);
