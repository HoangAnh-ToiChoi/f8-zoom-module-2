import * as login from "./src/auth/auth.js";
import * as register from "./src/auth/register.js";
import * as storage from "./src/utils/stogare.js";
import { playlistsController } from "./src/controllers/playlists.js";
import { albumsController } from "./src/controllers/albums.js";
import { artistsController } from "./src/controllers/artists.js";
import { hideDetailView, hideAllMenus } from "./src/utils/uiHelpers.js";
import { playerController } from "./src/controllers/player.js";
import { sidebarController } from "./src/controllers/slidebar.js";
import { renderMusicByID } from "./src/ui/playerUI.js";

document.addEventListener("DOMContentLoaded", async function () {
    const signupBtn = document.querySelector(".signup-btn");
    const loginBtn = document.querySelector(".login-btn");
    const authModal = document.getElementById("authModal");
    const modalClose = document.getElementById("modalClose");
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const showLoginBtn = document.getElementById("showLogin");
    const showSignupBtn = document.getElementById("showSignup");
    
    const albumsGrid = document.querySelector(".albums-grid");
    const artistsGrid = document.querySelector(".artists-grid");
    const trackList = document.querySelector(".track-list");
    const hitsGrid = document.querySelector(".hits-grid");
    
    const userAvatar = document.getElementById("userAvatar");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");
    
    const homeBtn = document.querySelector(".home-btn");
    const logo = document.querySelector(".logo i");
    
    const playBtn = document.querySelector(".play-btn");
    const shuffleBtn = document.querySelector(".shuffle");
    const preBtn = document.querySelector(".pre-btn");
    const nextBtn = document.querySelector(".next-btn");
    const playBtnLarge = document.querySelector(".play-btn-large");
    const repeatBtn = document.querySelector(".repeat");
    const muteBtn = document.querySelector(".mute-btn");
    
    const sortBtn = document.querySelector(".sort-btn");
    const navTab = document.querySelector(".nav-tabs");
    const searchBtn = document.querySelector(".search-library-btn");

    const currentTrack = localStorage.getItem("currentTrack");
    const timeCurrent = localStorage.getItem("timeCurrrent");
    const volume = localStorage.getItem("volume");
    const shuffleStored = localStorage.getItem("isShuffle") === "true";
    const rePeatStored = localStorage.getItem("isRepeat") === "true";

    if (currentTrack && timeCurrent) {
        await renderMusicByID(currentTrack, timeCurrent);
        playerController.audio.volume = Number(volume);
        const volumeFill = document.querySelector(".volume-fill");
        if (volumeFill) {
            volumeFill.style.width = `${volume * 100}%`;
        }
    }

    if (shuffleStored && shuffleBtn) {
        shuffleBtn.classList.add("active");
    }

    if (rePeatStored && repeatBtn) {
        repeatBtn.classList.add("active");
    }

    function showSignupForm() {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    }

    function showLoginForm() {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    }

    function openModal() {
        authModal.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        authModal.classList.remove("show");
        document.body.style.overflow = "auto";
    }

    if (signupBtn) {
        signupBtn.addEventListener("click", () => {
            showSignupForm();
            openModal();
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            showLoginForm();
            openModal();
        });
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);

    if (authModal) {
        authModal.addEventListener("click", (e) => {
            if (e.target === authModal) closeModal();
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && authModal && authModal.classList.contains("show")) {
            closeModal();
        }
    });

    if (showLoginBtn) showLoginBtn.addEventListener("click", showLoginForm);
    if (showSignupBtn) showSignupBtn.addEventListener("click", showSignupForm);

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await register.register();
            await login.checkAuthState();
            closeModal();
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            await login.handleLogin();
            login.checkAuthState();
            closeModal();
        });
    }

    if (userAvatar) {
        userAvatar.addEventListener("click", (e) => {
            e.stopPropagation();
            if (storage.getToken() && storage.getUser() && userDropdown) {
                userDropdown.classList.toggle("show");
            }
        });
    }

    document.addEventListener("click", (e) => {
        if (
            userAvatar && !userAvatar.contains(e.target) &&
            userDropdown && !userDropdown.contains(e.target)
        ) {
            userDropdown.classList.remove("show");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && userDropdown && userDropdown.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
    });

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (userDropdown) userDropdown.classList.remove("show");
            login.handleLogout();
        });
    }

    if (homeBtn) homeBtn.addEventListener("click", hideDetailView);
    if (logo) logo.addEventListener("click", hideDetailView);

    if (albumsGrid) albumsGrid.addEventListener("click", (e) => albumsController.playAB(e));
    if (artistsGrid) artistsGrid.addEventListener("click", (e) => artistsController.playAr(e));
    if (trackList) trackList.addEventListener("click", (e) => playerController.getMusic(e));
    if (hitsGrid) hitsGrid.addEventListener("click", (e) => playlistsController.ChosePlaylist(e));

    if (playBtn) playBtn.addEventListener("click", () => playerController.handleSong());

    if (shuffleBtn) {
        shuffleBtn.addEventListener("click", () => {
            playerController.toggleShuffle();
            const isShuffle = shuffleBtn.classList.contains("active");
            localStorage.setItem("isShuffle", isShuffle);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            playerController.handleForwardSong(1);
        });
    }

    if (preBtn) {
        preBtn.addEventListener("click", () => {
            playerController.handleForwardSong(-1);
        });
    }

    if (playBtnLarge) {
        playBtnLarge.addEventListener("click", (e) => playerController.handleAllSong(e));
    }

    if (repeatBtn) {
        repeatBtn.addEventListener("click", () => {
            playerController.handleRepeatSong();
            const isRepeat = repeatBtn.classList.contains("active");
            localStorage.setItem("isRepeat", isRepeat);
        });
    }

    if (muteBtn) muteBtn.addEventListener("click", () => playerController.handleMute());
    
    playerController.handleVolume();

    if (sortBtn) sortBtn.addEventListener("click", (e) => sidebarController.handleLibrary(e));
    if (navTab) navTab.addEventListener("click", (e) => sidebarController.showLibrarySlidebar(e));
    if (searchBtn) searchBtn.addEventListener("click", () => sidebarController.handleSearch());

    sidebarController.createPlayplist();
    sidebarController.handleTextMenuSlidebar();
    playlistsController.handleTextMenu();
    artistsController.handleTextMenu();
    albumsController.handleTextMenu();

    document.onclick = () => {
        hideAllMenus();
    };

    window.addEventListener("scroll", hideAllMenus, true);

    await login.checkAuthState();
    await playlistsController.getPlaylists();
    await sidebarController.initLibrary();
    await albumsController.getAlbums();
    await artistsController.getArtists();
});
