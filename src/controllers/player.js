import { getTracks } from "../api/trackApi.js";
import { renderMusicPlayer } from "../ui/playerUI.js";
import { formatDuration } from "../utils/format.js";

class PlayerController {
    #currentSong = null;
    #currentTrack = null;
    audio = new Audio();

    #setIconUI(isplayingState) {
        const playBtnLarge = document.querySelector(".play-btn-large");
        const playBtn = document.querySelector(".play-btn");
        const iconClass = isplayingState ? "fa-pause" : "fa-play";
        if (playBtnLarge)
            playBtnLarge.innerHTML = `<i class="fas ${iconClass}"></i>`;
        if (playBtn) playBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
    }

    #processBarUI(currentTime, duration) {
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

    isPlayingSource(type, id) {
        if (!this.#currentTrack || this.audio.paused) return false;
        if (type === "albums") {
            return this.#currentTrack.album_id === id;
        }
        if (type === "artist") {
            return this.#currentTrack.artist_id === id;
        }
        return false;
    }

    async getMusic(e) {
        const track = e.target.closest(".track-item");
        const trackId = track?.getAttribute("data-id");
        const trackIndex = track?.getAttribute("data-index");
        this.#currentSong = Number(trackIndex);
        try {
            const { tracks } = await getTracks();
            const filltracks = tracks.find((tr) => tr.id === trackId);

            renderMusicPlayer(filltracks);
            this.#currentTrack = filltracks;
            this.audio.src = filltracks.audio_url;
            this.audio.play();
            this.#setIconUI(true);
            localStorage.setItem("currentTrack", this.#currentTrack.id);
            localStorage.setItem("timeCurrrent", this.audio.currentTime);

            document.querySelectorAll(".track-item").forEach((track) => {
                track.classList.remove("playing");
            });
            track.classList.add("playing");

            this.audio.onloadedmetadata = () => {
                const timeUpdate = document.querySelector(
                    ".progress-container .time:last-child",
                );
                if (timeUpdate) {
                    timeUpdate.textContent = formatDuration(this.audio.duration);
                }
                localStorage.setItem("currentTrack", this.#currentTrack.id);
                localStorage.setItem("timeCurrrent", 0);
            };

            this.audio.ontimeupdate = () => {
                this.#processBarUI(this.audio.currentTime, this.audio.duration);
                localStorage.setItem("timeCurrrent", this.audio.currentTime);
            };

            this.audio.onended = () => {
                const repeatActive = document.querySelector(".repeat.active");
                if (repeatActive) {
                    this.handleForwardSong(0);
                } else {
                    this.handleForwardSong(1);
                }
            };

            this.handleProcess();
        } catch (e) {
            console.log(e);
        }
    }

    async handleAllSong(e) {
        const detailContainer = document.querySelector(".detail-container");
        const type = detailContainer?.getAttribute("data-type");
        const id = detailContainer?.getAttribute("data-id");

        if (!this.audio.src || !this.isPlayingSource(type, id)) {
            const firstTrack = document.querySelector(
                `.track-item[data-index="0"]`,
            );
            if (firstTrack) firstTrack.click();
            this.#setIconUI(true);
            return;
        }

        this.handleSong();
    }

    handleSong() {
        if (this.audio.paused) {
            this.audio.play();
            this.#setIconUI(true);
        } else {
            this.audio.pause();
            this.#setIconUI(false);
        }
    }

    handleForwardSong(step) {
        const shuffleBtn = document.querySelector(".shuffle.active");
        const trackItem = document.querySelectorAll(".track-item");
        let newSong;
        const length = trackItem.length;
        if (shuffleBtn) {
            do {
                newSong = Math.floor(Math.random() * length);
            } while (newSong === this.#currentSong);
        } else {
            newSong = (this.#currentSong + step + length) % length;
        }
        const nextTrack = document.querySelector(
            `.track-item[data-index="${newSong}"]`,
        );
        if (nextTrack) {
            nextTrack.click();
        }
    }

    handleProcess() {
        const processBar = document.querySelector(".progress-bar");
        const processFill = document.querySelector(".progress-fill");
        if (!processBar || !processFill) return;

        processBar.addEventListener("mousedown", (e) => {
            this.audio.pause();
            processFill.style.transition = "none";

            const onMouseMove = (e) => {
                const rect = processBar.getBoundingClientRect();
                let radio = (e.clientX - rect.left) / rect.width;
                if (radio < 0) radio = 0;
                if (radio > 1) radio = 1;
                this.#processBarUI(radio * this.audio.duration, this.audio.duration);
            };

            const onMouseUp = (e) => {
                const rect = processBar.getBoundingClientRect();
                let radio = (e.clientX - rect.left) / rect.width;
                if (radio < 0) radio = 0;
                if (radio > 1) radio = 1;
                this.audio.currentTime = radio * this.audio.duration;
                this.audio.play();
                this.#setIconUI(true);
                processFill.style.transition = "";
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    }

    handleVolume() {
        const volumeBar = document.querySelector(".volume-bar");
        const volumeFill = document.querySelector(".volume-fill");

        if (!volumeBar || !volumeFill) return;

        volumeBar.addEventListener("mousedown", (e) => {
            this.#updateVolumeUI(e.clientX);
            volumeFill.style.transition = "none";

            const onMouseMove = (e) => {
                this.#updateVolumeUI(e.clientX);
            };

            const onMouseUp = (e) => {
                const rect = volumeBar.getBoundingClientRect();
                let radio = (e.clientX - rect.left) / rect.width;
                if (radio < 0) radio = 0;
                if (radio > 1) radio = 1;
                this.audio.volume = radio;
                localStorage.setItem("volume", radio);
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
            };

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    }

    #updateVolumeUI(clientX) {
        const volumeBar = document.querySelector(".volume-bar");
        const volumeFill = document.querySelector(".volume-fill");
        if (!volumeBar || !volumeFill) return;

        const rect = volumeBar.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        let volume = offsetX / rect.width;
        if (volume < 0) volume = 0;
        if (volume > 1) volume = 1;
        this.audio.volume = volume;
        volumeFill.style.width = `${volume * 100}%`;
    }

    handleRepeatSong() {
        const repeatBtn = document.querySelector(".repeat");
        if (repeatBtn) repeatBtn.classList.toggle("active");
    }

    handleMute() {
        const muteBtn = document.querySelector(".mute-btn");
        const volumeContainer = document.querySelector(".volume-container");
        if (!muteBtn) return;

        this.audio.muted = !this.audio.muted;

        const volumeFill = document.querySelector(".volume-fill");
        const volumeBar = document.querySelector(".volume-bar");
        const icon = volumeContainer ? volumeContainer.querySelector("i") : null;
        if (!volumeFill || !volumeBar || !icon) return;

        volumeFill.style.width = this.audio.muted ? "0%" : "100%";

        if (this.audio.muted) {
            icon.className = "fas fa-volume-mute";
        } else {
            icon.className = "fas fa-volume-down";
        }
    }

    toggleShuffle() {
        const shuffleBtn = document.querySelector(".shuffle");
        if (!shuffleBtn) return;
        shuffleBtn.classList.toggle("active");
    }
}

export const playerController = new PlayerController();
