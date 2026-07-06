import { getTracks } from "../api/trackApi.js";
import { renderMusicPlayer } from "../ui/playerUI.js";
import { formatDuration } from "../utils/format.js";
const audio = new Audio();
export async function getMusic(e) {
    const track = e.target.closest(".track-item");
    const trackId = track?.getAttribute("data-id");

    try {
        const { tracks } = await getTracks();
        const filltracks = tracks.find((tr) => tr.id === trackId);
        renderMusicPlayer(filltracks);
        audio.src = filltracks.audio_url;
        audio.play();
        audio.onloadedmetadata = function () {
            const timeUpdate = document.querySelector(
                ".progress-container .time:last-child",
            );
            timeUpdate.textContent = formatDuration(audio.duration);
        };
        audio.ontimeupdate = function () {
            const process = (audio.currentTime / audio.duration) * 100;
            const progressFill = document.querySelector(".progress-fill");
            const timeCurrent = document.querySelector(
                ".progress-container .time:first-child",
            );
            if (progressFill) progressFill.style.width = `${process}%`;
            if (timeCurrent)
                timeCurrent.textContent = formatDuration(audio.currentTime);
        };
    } catch (e) {
        console.log(e);
    }
}

export function handleSong() {
    const playBtn = document.querySelector(".play-btn");
    if (!playBtn) return;
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
    } else {
        audio.pause();
        playBtn.innerHTML = `<i class="fas fa-play"></i>`;
    }
}
