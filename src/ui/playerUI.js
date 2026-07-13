import { getTrackByID } from "../api/trackApi.js";
import { audio, handleProcess } from "../controllers/player.js";

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

export async function renderMusicByID(id, timeCurrent = 0) {
    try {
        const track = await getTrackByID(id);
        renderMusicPlayer(track);

        if (timeCurrent) {
            const onLoaded = () => {
                audio.currentTime = parseFloat(timeCurrent);

                const processFill = document.querySelector(".progress-fill");
                const timeCurrentEl = document.querySelector(
                    ".progress-container .time:first-child",
                );
                if (audio.duration) {
                    const process = (audio.currentTime / audio.duration) * 100;
                    if (processFill) processFill.style.width = `${process}%`;
                }
                const formatDuration = (secs) => {
                    const minutes = Math.floor(secs / 60);
                    const seconds = Math.floor(secs % 60);
                    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
                };
                if (timeCurrentEl) {
                    timeCurrentEl.textContent = formatDuration(
                        audio.currentTime,
                    );
                }

                const timeTotalEl = document.querySelector(
                    ".progress-container .time:last-child",
                );
                if (timeTotalEl && audio.duration) {
                    timeTotalEl.textContent = formatDuration(audio.duration);
                }

                audio.removeEventListener("loadedmetadata", onLoaded);
            };
            audio.addEventListener("loadedmetadata", onLoaded);
        }

        audio.src = track.audio_url;

        const playBtn = document.querySelector(".play-btn");
        const playBtnLarge = document.querySelector(".play-btn-large");
        if (playBtn) playBtn.innerHTML = `<i class="fas fa-play"></i>`;
        if (playBtnLarge)
            playBtnLarge.innerHTML = `<i class="fas fa-play"></i>`;

        handleProcess();
    } catch (error) {
        console.log(error);
    }
}
