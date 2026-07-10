import { getTracks } from "../api/trackApi.js";
import { renderMusicPlayer } from "../ui/playerUI.js";
import { formatDuration } from "../utils/format.js";

let currentSong = null;
let currentTrack = null;
export const audio = new Audio();

// Handle UI

function setIconUI(isplayingState) {
    const playBtnLarge = document.querySelector(".play-btn-large");
    const playBtn = document.querySelector(".play-btn");
    const iconClass = isplayingState ? "fa-pause" : "fa-play";
    if (playBtnLarge)
        playBtnLarge.innerHTML = `<i class="fas ${iconClass}"></i>`;
    if (playBtn) playBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
}

function processBarUI(currentTime, duration) {
    const processFill = document.querySelector(".progress-fill");
    const timeCurrent = document.querySelector(
        ".progress-container .time:first-child",
    );
    if (duration && !isNaN(duration)) {
        const process = (currentTime / duration) * 100;
        if (processFill) processFill.style.width = `${process}%`;
    }

    if (timeCurrent) timeCurrent.textContent = formatDuration(currentTime);
}

// Handle Logic

export function isPlayingSource(type, id) {
    if (!currentTrack || audio.paused) return false;
    if (type === "albums") {
        return currentTrack.album_id === id;
    }
    if (type === "artist") {
        return currentTrack.artist_id === id;
    }
    return false;
}

export async function getMusic(e) {
    const track = e.target.closest(".track-item");
    const trackId = track?.getAttribute("data-id");
    const trackIndex = track?.getAttribute("data-index");
    currentSong = Number(trackIndex);
    try {
        const { tracks } = await getTracks();
        const filltracks = tracks.find((tr) => tr.id === trackId);

        renderMusicPlayer(filltracks);
        currentTrack = filltracks;
        audio.src = filltracks.audio_url;
        audio.play();
        setIconUI(true);
        localStorage.setItem("currentTrack", JSON.stringify(currentTrack.id));
        localStorage.setItem("timeCurrrent", JSON.stringify(audio.currentTime));

        document.querySelectorAll(".track-item").forEach((track) => {
            track.classList.remove("playing");
        });
        track.classList.add("playing");

        audio.onloadedmetadata = function () {
            const timeUpdate = document.querySelector(
                ".progress-container .time:last-child",
            );
            timeUpdate.textContent = formatDuration(audio.duration);
            localStorage.setItem(
                "currentTrack",
                JSON.stringify(currentTrack.id),
            );
            localStorage.setItem("timeCurrrent", JSON.stringify(0));
        };

        audio.ontimeupdate = function () {
            processBarUI(audio.currentTime, audio.duration);
            localStorage.setItem(
                "timeCurrrent",
                JSON.stringify(audio.currentTime),
            );
        };
        audio.onended = () => {
            const repeatActive = document.querySelector(".repeat.active");
            if (repeatActive) {
                handleForwardSong(0);
            } else {
                handleForwardSong(1);
            }
        };

        handleProcess();
    } catch (e) {
        console.log(e);
    }
}

export async function handleAllSong(e) {
    const detailContainer = document.querySelector(".detail-container");
    const type = detailContainer?.getAttribute("data-type");
    const id = detailContainer?.getAttribute("data-id");

    if (!audio.src || !isPlayingSource(type, id)) {
        const firstTrack = document.querySelector(
            `.track-item[data-index="0"]`,
        );
        if (firstTrack) firstTrack.click();
        setIconUI(true);
        return;
    }

    handleSong();
}

export function handleSong() {
    if (audio.paused) {
        audio.play();
        setIconUI(true);
    } else {
        audio.pause();
        setIconUI(false);
    }
}

export function handleForwardSong(step) {
    const shuffleBtn = document.querySelector(".shuffle.active");
    const trackItem = document.querySelectorAll(".track-item");
    let newSong;
    const length = trackItem.length;
    if (shuffleBtn) {
        do {
            newSong = Math.floor(Math.random() * length);
        } while (newSong === currentSong);
    } else {
        newSong = (currentSong + step + length) % length;
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
    const processFill = document.querySelector(".progress-fill");
    if (!processBar || !processFill) return;

    processBar.addEventListener("mousedown", (e) => {
        audio.pause();
        processFill.style.transition = "none";

        const onMouseMove = (e) => {
            const rect = processFill.getBoundingClientRect();
            let radio = (e.clientX - rect.left) / rect.width;
            if (radio < 0) radio = 0;
            if (radio > 1) radio = 1;
            processBarUI(radio * audio.duration, audio.duration);
        };

        const onMouseUp = (e) => {
            const rect = processBar.getBoundingClientRect();
            let radio = (e.clientX - rect.left) / rect.width;
            if (radio < 0) radio = 0;
            if (radio > 1) radio = 1;
            audio.currentTime = radio * audio.duration;
            audio.play();
            setIconUI(true);
            processFill.style.transition = "";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
}

export function handleVolume() {
    const volumeBar = document.querySelector(".volume-bar");
    const volumeFill = document.querySelector(".volume-fill");

    if (!volumeBar || !volumeFill) return;

    volumeBar.addEventListener("mousedown", (e) => {
        updateVolumeUI(e.clientX);
        volumeFill.style.transition = "none";

        const onMouseMove = (e) => {
            updateVolumeUI(e.clientX);
        };

        const onMouseUp = (e) => {
            const rect = volumeBar.getBoundingClientRect();
            let radio = (e.clientX - rect.left) / rect.width;
            if (radio < 0) radio = 0;
            if (radio > 1) radio = 1;
            audio.volume = radio;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
    function updateVolumeUI(clientX) {
        const rect = volumeBar.getBoundingClientRect();

        const offsetX = clientX - rect.left;
        let volume = offsetX / rect.width;
        if (volume < 0) volume = 0;
        if (volume > 1) volume = 1;
        audio.volume = volume;
        volumeFill.style.width = `${volume * 100}%`;
    }
}

export function handleRepeatSong() {
    const repeatBtn = document.querySelector(".repeat");
    repeatBtn.classList.toggle("active");
}

export function handleMute() {
    const muteBtn = document.querySelector(".mute-btn");
    const volumeContainer = document.querySelector(".volume-container");
    if (!muteBtn) return;

    audio.muted = !audio.muted;

    const volumeFill = document.querySelector(".volume-fill");
    const volumeBar = document.querySelector(".volume-bar");
    const icon = volumeContainer.querySelector("i");
    if (!volumeFill || !volumeBar || !icon) return;

    volumeFill.style.width = audio.muted ? "0%" : "100%";

    if (audio.muted) {
        icon.className = "fas fa-volume-mute";
    } else {
        icon.className = "fas fa-volume-down";
    }
}

export function toggleShuffle() {
    const shuffleBtn = document.querySelector(".shuffle");
    if (!shuffleBtn) return;
    shuffleBtn.classList.toggle("active");
}
