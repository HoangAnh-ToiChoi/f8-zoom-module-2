import { getTracks } from "../api/trackApi.js";
import { renderMusicPlayer } from "../ui/playerUI.js";
import { formatDuration } from "../utils/format.js";

const audio = new Audio();
let currentSong = null;

export async function getMusic(e) {
    const track = e.target.closest(".track-item");
    const trackId = track?.getAttribute("data-id");
    const trackIndex = track?.getAttribute("data-index");
    currentSong = Number(trackIndex);
    try {
        const { tracks } = await getTracks();
        const filltracks = tracks.find((tr) => tr.id === trackId);
        renderMusicPlayer(filltracks);
        audio.src = filltracks.audio_url;
        audio.play();
        const playBtn = document.querySelector(".play-btn");
        playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
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
        handleProcess();
    } catch (e) {
        console.log(e);
    }
}

export function handleAllSong(e) {
    const playBtnLarge = document.querySelector(".play-btn-large");
    if (!playBtnLarge) return;
    if (audio.paused) {
        audio.play();
        playBtnLarge.innerHTML = `<i class="fas fa-pause"></i>`;
    } else {
        audio.pause();
        playBtnLarge.innerHTML = `<i class="fas fa-play"></i>`;
    }

    // logic xử lý
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

export function toggleShuffle() {
    const shuffleBtn = document.querySelector(".shuffle");
    if (!shuffleBtn) return;
    shuffleBtn.classList.toggle("active");
    handleForwardSong(1);
}

export function handleForwardSong(step) {
    const shuffleBtn = document.querySelector(".shuffle active");
    console.log(shuffleBtn);
    const trackItem = document.querySelectorAll(".track-item");
    let newSong;
    if (shuffleBtn) {
        newSong = Math.floor(Math.random() * trackItem.length);
    } else {
        newSong = (currentSong + step + trackItem.length) % trackItem.length;
    }
    const nextTrack = document.querySelector(
        `.track-item[data-index="${newSong}"]`,
    );
    if (nextTrack) {
        nextTrack.click();
    }
}

function handleProcess() {
    const processBar = document.querySelector(".progress-bar");
    const progressFill = document.querySelector(".progress-fill");
    processBar.addEventListener("mousedown", (e) => {
        audio.pause();
        updateProcessUI(e);
        progressFill.style.transition = "none";
        const onMouseMove = (e) => {
            updateProcessUI(e);
        };

        const onMouseUp = (e) => {
            const rect = processBar.getBoundingClientRect();
            audio.currentTime =
                ((e.clientX - rect.left) / processBar.clientWidth) *
                audio.duration;
            const playBtn = document.querySelector(".play-btn");
            audio.play();
            playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    function updateProcessUI(e) {
        const rect = processBar.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        let process = (offsetX / processBar.clientWidth) * 100;
        if (process < 0) process = 0;
        if (process > 100) process = 100;
        const progressFill = document.querySelector(".progress-fill");
        const timeCurrent = document.querySelector(
            ".progress-container .time:first-child",
        );
        progressFill.style.width = `${process}%`;
        timeCurrent.textContent = formatDuration(audio.currentTime);
    }
}

export function handleVolume() {
    const volumeBar = document.querySelector(".volume-bar");
    const volumeFill = document.querySelector(".volume-fill");
    if (!volumeBar || !volumeFill) return;
    volumeBar.addEventListener("mousedown", (e) => {
        updateVolumeUI(e);
        volumeFill.style.transition = "none";
        const onMouseMove = (e) => {
            updateVolumeUI(e);
        };
        const onMouseUp = (e) => {
            const rect = volumeBar.getBoundingClientRect();
            audio.volume = (e.clientX - rect.left) / rect.width;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
    function updateVolumeUI(e) {
        const rect = volumeBar.getBoundingClientRect();

        const offsetX = e.clientX - rect.left;
        let volume = offsetX / rect.width;
        if (volume < 0) volume = 0;
        if (volume > 1) volume = 1;
        audio.volume = volume;
        volumeFill.style.width = `${volume * 100}%`;
    }
}
