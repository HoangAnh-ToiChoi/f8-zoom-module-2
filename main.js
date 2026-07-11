import httpRequest from "./src/utils/httpRequest.js";
import * as login from "./src/auth/auth.js";
import * as register from "./src/auth/register.js";
import * as storage from "./src/utils/stogare.js";
import * as playlists from "./src/controllers/playlists.js";
import * as albums from "./src/controllers/albums.js";
import * as artists from "./src/controllers/artists.js";
import { hideDetailView } from "./src/utils/uiHelpers.js";
import * as player from "./src/controllers/player.js";
import * as slidebar from "./src/controllers/slidebar.js";

// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", async function () {
    // Get DOM elements
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
    const currentTrack = localStorage.getItem("currentTrack");
    const timeCurrent = localStorage.getItem("timeCurrrent");

    // if (currentTrack && timeCurrent) {
    //     await renderMusicByID(currentTrack);
    // }
    // Function to show signup form
    function showSignupForm() {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    }

    // Function to show login form
    function showLoginForm() {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    }

    // Function to open modal
    function openModal() {
        authModal.classList.add("show");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    // Open modal with Sign Up form when clicking Sign Up button
    signupBtn.addEventListener("click", function () {
        showSignupForm();
        openModal();
    });

    // Open modal with Login form when clicking Login button
    loginBtn.addEventListener("click", function () {
        showLoginForm();
        openModal();
    });

    // Close modal function
    function closeModal() {
        authModal.classList.remove("show");
        document.body.style.overflow = "auto"; // Restore scrolling
    }

    // Close modal when clicking close button
    modalClose.addEventListener("click", closeModal);

    // Close modal when clicking overlay (outside modal container)
    authModal.addEventListener("click", function (e) {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authModal.classList.contains("show")) {
            closeModal();
        }
    });

    // Switch to Login form
    showLoginBtn.addEventListener("click", function () {
        showLoginForm();
    });

    // Switch to Signup form
    showSignupBtn.addEventListener("click", function () {
        showSignupForm();
    });

    // Signup form submit
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        await register.register();
        await checkAuthState();
        closeModal();
    });

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        await login.handleLogin();
        login.checkAuthState();
        closeModal();
    });

    albumsGrid.addEventListener("click", albums.playAB);
    artistsGrid.addEventListener("click", artists.playAr);
    trackList.addEventListener("click", player.getMusic);
    hitsGrid.addEventListener("click", playlists.ChosePlaylist);
    player.handleVolume();
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
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
    const slideContent = document.querySelector(".library-content");

    const shuffleStored = localStorage.getItem("isShuffle") === "true";
    const rePeatStored = localStorage.getItem("isRepeat") === "true";

    if (shuffleStored) {
        shuffleBtn.classList.add("active");
    }

    if (rePeatStored) {
        repeatBtn.classList.add("active");
    }

    // Toggle dropdown when clicking avatar
    userAvatar.addEventListener("click", function (e) {
        e.stopPropagation();
        if (storage.getToken() && storage.getUser()) {
            userDropdown.classList.toggle("show");
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (
            !userAvatar.contains(e.target) &&
            !userDropdown.contains(e.target)
        ) {
            userDropdown.classList.remove("show");
        }
    });

    // Close dropdown when pressing Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && userDropdown.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
    });

    // Handle logout button click
    logoutBtn.addEventListener("click", function () {
        // Close dropdown first
        userDropdown.classList.remove("show");
        login.handleLogout();
    });

    homeBtn.addEventListener("click", hideDetailView);

    logo.addEventListener("click", hideDetailView);

    playBtn.addEventListener("click", player.handleSong);

    shuffleBtn.addEventListener("click", () => {
        player.toggleShuffle();
        const isShuffle = shuffleBtn.classList.contains("active");
        localStorage.setItem("isShuffle", isShuffle);
    });

    nextBtn.addEventListener("click", () => {
        player.handleForwardSong(1);
    });

    preBtn.addEventListener("click", () => {
        player.handleForwardSong(-1);
    });

    playBtnLarge.addEventListener("click", player.handleAllSong);

    repeatBtn.addEventListener("click", () => {
        player.handleRepeatSong();
        const isRepeat = repeatBtn.classList.contains("active");
        localStorage.setItem("isRepeat", isRepeat);
    });

    muteBtn.addEventListener("click", player.handleMute);

    sortBtn.addEventListener("click", slidebar.handleLibrary);
    slidebar.createPlayplist();

    slidebar.handleTextMenuSlidebar();
});

// Other functionality
document.addEventListener("DOMContentLoaded", async function () {
    // TODO: Implement other functionality here
    await login.checkAuthState();
    await playlists.getPlaylists();
    await slidebar.initLibrary();
    await albums.getAlbums();
    await artists.getArtists();
});
