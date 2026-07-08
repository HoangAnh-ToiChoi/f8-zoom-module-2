export function renderMusicPlayer(track) {
    const playerLeft = document.querySelector(".player-left");
    if (!playerLeft) return;

    playerLeft.innerHTML = "";

    const img = document.createElement("img");
    img.src = track.image_url || "./placeholder.svg";
    img.alt = track.title || "Current track";
    img.classList.add("player-image");
    img.onerror = function () {
        img.src = track.image_url || "./placeholder.svg";
    };
    playerLeft.appendChild(img);

    const playerInfo = document.createElement("div");
    playerInfo.classList.add("player-info");
    const playerTitle = document.createElement("div");
    playerTitle.classList.add("player-title");
    playerTitle.textContent = track.title || "Unknown Track";
    playerInfo.appendChild(playerTitle);

    const playerArtist = document.createElement("div");
    playerArtist.classList.add("player-artist");
    playerArtist.textContent = track.artist_name || "Unknown Artist";
    playerInfo.appendChild(playerArtist);
    playerLeft.appendChild(playerInfo);

    const btnAdd = document.createElement("button");
    btnAdd.classList.add("add-btn");
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-plus");
    btnAdd.appendChild(icon);
    playerLeft.appendChild(btnAdd);
}

export async function renderMusicByID(id) {
    const track = await getTrackByID(id);
    renderMusicPlayer(track);
    audio.src = track.audio_url;
    audio.currentTime = timeCurrent;
}
