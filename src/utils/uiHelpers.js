import { playerController } from "../controllers/player.js";

export function showDetailView(type, id) {
    const hitsSection = document.querySelector(".hits-section");
    const albumsSection = document.querySelector(".albums-section");
    const artistsSection = document.querySelector(".artists-section");
    const detailContainer = document.querySelector(".detail-container");
    const playlistModal = document.querySelector(".playlist-detail-container");

    if (playlistModal) playlistModal.style.display = "none";
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
        if (playerController.isPlayingSource(type, id)) {
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
    const playlistDetailContainer = document.querySelector(
        ".playlist-detail-container",
    );

    if (hitsSection) hitsSection.style.display = "block";
    if (albumsSection) albumsSection.style.display = "block";
    if (artistsSection) artistsSection.style.display = "block";
    if (detailContainer) detailContainer.style.display = "none";
    if (playlistDetailContainer) playlistDetailContainer.style.display = "none";
}

export function hideAllMenus() {
    const menus = document.querySelectorAll(".popup-menu");
    menus.forEach((menu) => {
        if (menu.id.includes("context-menu") || menu.className.includes("context-menu")) {
            menu.style.display = "none";
        } else {
            menu.classList.remove("active", "show");
        }
    });
}
