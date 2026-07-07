import { audio, isPlaying } from "../player/player.js";

export function showDetailView(type, id) {
    const hitsSection = document.querySelector(".hits-section");
    const albumsSection = document.querySelector(".albums-section");
    const artistsSection = document.querySelector(".artists-section");
    const detailContainer = document.querySelector(".detail-container");

    if (hitsSection) hitsSection.style.display = "none";
    if (albumsSection) albumsSection.style.display = "none";
    if (artistsSection) artistsSection.style.display = "none";
    if (detailContainer) {
        detailContainer.style.display = "block";
        detailContainer.setAttribute("data-id", id);
        detailContainer.setAttribute("data-type", type);
    }

    const playBtnLarge = document.querySelector(".play-btn-large");
    if (playBtnLarge) {
        if (isPlaying(type, id)) {
            playBtnLarge.innerHTML = `<i class="fas fa-pause"></i>`;
        } else {
            playBtnLarge.innerHTML = `<i class="fas fa-play"></i>`;
        }
    }
}

export function hideDetailView() {
    const hitsSection = document.querySelector(".hits-section");
    const albumsSection = document.querySelector(".albums-section");
    const artistsSection = document.querySelector(".artists-section");
    const detailContainer = document.querySelector(".detail-container");

    if (hitsSection) hitsSection.style.display = "block";
    if (albumsSection) albumsSection.style.display = "block";
    if (artistsSection) artistsSection.style.display = "block";
    if (detailContainer) detailContainer.style.display = "none";
}
