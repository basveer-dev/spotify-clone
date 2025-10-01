console.log("lets go javascript");
let currentSong = new Audio();
let songs;
let currFolder;
let manifest;

async function loadManifest() {
  try {
    const res = await fetch("songs/manifest.json", { cache: "no-cache" });
    if (res.ok) {
      manifest = await res.json();
      console.log("Loaded manifest", manifest);
    }
  } catch (e) {
    console.warn("No manifest found or failed to load. Falling back to directory listing.");
  }
}

function formatTime(sec) {
  if (isNaN(sec) || sec < 0) return "00:00"; // fallback
  sec = Math.floor(sec);
  let minutes = Math.floor(sec / 60);
  let seconds = sec % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

async function getSongs(folder) {
  // If manifest is present, build the list from it
  if (manifest && manifest.albums) {
    const albumFolder = folder.startsWith("songs/") ? folder.split("/")[1] : folder;
    const album = manifest.albums.find((a) => a.folder === albumFolder);
    currFolder = `songs/${albumFolder}`;
    songs = album ? [...album.tracks] : [];
  } else {
    currFolder = folder; // Store the current folder globally
    // Fall back to directory listing (works locally when server exposes indexes)
    let a = await fetch(`${folder}/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
      const element = as[index];
      if (element.href.endsWith(".mp3")) {
        songs.push(element.href.split(`/${folder}/`)[1]);
      }
    }
  }

  // show all the songs in the playlist
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
                <img  src="src/assets/music.svg" alt="">
                <div class="info">
                  <div>${song.replaceAll("%20", " ")}</div>
                  <div></div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img src="src/assets/play.svg" alt="">
                </div>
                </li>`;
  }
  // Attach an event listeners to each song
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML);
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "src/assets/pause.svg";
  }

  document.querySelector(".songinfo > span").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let cardcontainer = document.querySelector(".cardcontainer");
  cardcontainer.innerHTML = "";
  // If manifest is present, render from it; else, attempt directory listing
  if (manifest && manifest.albums) {
    for (const album of manifest.albums) {
      try {
        let metaRes = await fetch(`songs/${album.folder}/info.json`);
        let meta = metaRes.ok ? await metaRes.json() : { Title: album.folder, Description: "" };
        cardcontainer.innerHTML =
          cardcontainer.innerHTML +
          `<div data-folder="${album.folder}" class="card">
              <div class="play">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="48" fill="#1ED760" />
                  <polygon points="40,30 70,50 40,70" fill="black" />
                </svg>
              </div>
              <img src="songs/${album.folder}/cover.jpg" alt="" />
              <h3>${meta.Title ?? album.folder}</h3>
              <p>${meta.Description ?? ""}</p>
            </div>`;
      } catch (err) {
        console.error("Failed to render album from manifest", album.folder, err);
      }
    }
  } else {
    let a = await fetch(`songs/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      const url = new URL(e.getAttribute("href"), window.location.origin);
      const parts = url.pathname.split("/").filter(Boolean); // ["songs", "<folder>"]
      const isAlbumFolder = parts.length === 2 && parts[0] === "songs";
      if (!isAlbumFolder) continue;
      const folder = parts[1];
      try {
        let metaRes = await fetch(`songs/${folder}/info.json`);
        if (!metaRes.ok) continue;
        let meta = await metaRes.json();
        cardcontainer.innerHTML =
          cardcontainer.innerHTML +
          `<div data-folder="${folder}" class="card">
              <div class="play">
                <svg
                  width="45"
                  height="45"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="50" cy="50" r="48" fill="#1ED760" />
                  <polygon points="40,30 70,50 40,70" fill="black" />
                </svg>
              </div>
              <img src="songs/${folder}/cover.jpg" alt="" />
              <h3>${meta.Title ?? folder}</h3>
              <p>${meta.Description ?? ""}</p>
            </div>`;
      } catch (err) {
        console.error("Failed to load album metadata for", folder, err);
      }
    }
  }
  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      song = await getSongs(`songs/${item.currentTarget.dataset.folder}`); 
      playMusic(song[0] );
    });
  });
}

async function main() {
  await loadManifest();
  // Choose default album
  if (manifest && manifest.albums && manifest.albums.length > 0) {
    await getSongs(`songs/${manifest.albums[0].folder}`);
  } else {
    await getSongs("songs/ncs");
  }
  if (songs && songs.length > 0) {
    playMusic(songs[0], true);
  }

  // Display all the albums on the page
  displayAlbums();

  // Attach event listeners to the play, previous, and next buttons
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "src/assets/pause.svg"; // Change play button to pause icon
    } else {
      currentSong.pause();
      play.src = "src/assets/play.svg"; // Change play button to play icon
    }
  });
  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentSong.currentTime
    )} / ${formatTime(currentSong.duration)}`;
    if (isFinite(currentSong.duration) && currentSong.duration > 0) {
      document.querySelector(".circle").style.left =
        (currentSong.currentTime / currentSong.duration) * 100 + "%";
    }
  });

  // Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    if (!isFinite(currentSong.duration) || currentSong.duration <= 0) return;
    document.querySelector(".circle").style.left =
      (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
    const seekTime =
      (e.offsetX / e.target.getBoundingClientRect().width) *
      currentSong.duration;
    currentSong.currentTime = seekTime;
  });

  // Add an event listener for hamburger menu
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // Add an event listener for close menu
  document.querySelector(".left").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  // Add an event listener to previous
  previous.addEventListener("click", () => {
    console.log("previous clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  // Add an event listener to next
  next.addEventListener("click", () => {
    currentSong.pause();
    console.log("next clicked");
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  // Add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      console.log("Setting volume to", e.target.value, "/100");
      currentSong.volume = parseInt(e.target.value) / 100;
    });

    // Add event listener to mute the track
    document.querySelector(".volume > img").addEventListener("click",  e=> {
      if(e.target.src.includes("volume.svg")){
        e.target.src = e.target.src.replace("volume.svg","mute.svg");
        currentSong.volume = 0;
        document
    .querySelector(".range").getElementsByTagName("input")[0].value = 0;
      }
      else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg");
        currentSong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
      }
    });
}
main();
