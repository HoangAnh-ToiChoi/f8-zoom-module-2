import * as slidebarUI from "../ui/slidebarUI.js";
import {
    createPlaylist,
    getMyPlaylist,
    deletePlaylist,
} from "../api/playlistsApi.js";
import { showToast } from "../utils/toast.js";

let playlists = {
    name: "My New Playlist",
    description: "Playlist description",
    is_public: true,
    image_url: null,
};

export function handleLibrary(e) {
    const sortBtn = e.target.closest(".sort-btn");
    if (sortBtn) {
        slidebarUI.showLibraryFilter(e);
    }
}

export function createPlayplist() {
    const createBtn = document.querySelector(".create-btn");
    const title = document.getElementById("playlist-hero-title");
    const modalCloseBtn = document.getElementById("playlist-edit-close");
    const btnSave = document.getElementById("playlist-save-btn");

    createBtn.addEventListener("click", () => {
        slidebarUI.showPlaylistDetail();
    });

    title.addEventListener("click", () => {
        const detailContainer = document.querySelector(
            ".playlist-detail-container",
        );
        const data = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = data.id;
        const playlistOwnerId = detailContainer.getAttribute("data-user-id");
        if (playlistOwnerId !== userId) return;
        slidebarUI.showPlaylistEditModal();
    });

    modalCloseBtn.addEventListener("click", () => {
        slidebarUI.hidePlaylistEditModal();
    });

    changeImage();
    changeValue();

    btnSave.addEventListener("click", async () => {
        try {
            const response = await createPlaylist(playlists);
            const newPlaylist = response.playlist;

            slidebarUI.hidePlaylistEditModal();
            slidebarUI.renderPlaylistDetail(newPlaylist);
            slidebarUI.addPlaylistToSidebar(newPlaylist);
        } catch (e) {
            console.error(e);
            throw e;
        }
    });
}

function changeImage() {
    const playlistCover = document.querySelector(".playlist-cover");
    const inputImg = document.querySelector("#playlist-file-input");
    const img = document.querySelector("#playlist-modal-preview-img");
    const placeholder = document.querySelector(".picker-placeholder");
    const pickerOverlay = document.querySelector(".picker-overlay");

    playlistCover.addEventListener("click", () => {
        slidebarUI.showPlaylistEditModal();
        inputImg.click();
    });
    pickerOverlay.addEventListener("click", () => {
        inputImg.click();
    });

    inputImg.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const render = new FileReader();
            render.onload = (e) => {
                img.src = e.target.result;
                img.style.display = "block";
                placeholder.style.display = "none";
                playlists.image_url = img.src;
            };
            render.readAsDataURL(file);
        }
    });
}

function changeValue() {
    const name = document.querySelector(".form-group.floating-label");
    const inputName = document.querySelector("#playlist-name-input");
    const des = document.querySelector("#playlist-desc-input");

    name.addEventListener("click", () => {
        inputName.focus();
    });
    inputName.addEventListener("input", (e) => {
        playlists.name = e.target.value;
    });

    des.addEventListener("input", (e) => {
        playlists.description = e.target.value;
    });
}

export async function initLibrary() {
    try {
        const response = await getMyPlaylist();
        const myPlaylists = response.playlists;
        const libraryItems = [];
        if (Array.isArray(myPlaylists)) {
            myPlaylists.forEach((pl) => {
                libraryItems.push({
                    id: pl.id,
                    name: pl.name,
                    type: "playlists",
                    image_url: pl.image_url,
                    total_tracks: pl.total_tracks || 0,
                    user_username: pl.user_username || "Han",
                    user_id: pl.user_id,
                });
            });
        }

        slidebarUI.renderLibrary(libraryItems);
    } catch (e) {
        console.error(e);
    }
}

export function handleTextMenuSlidebar() {
    const slidebar = document.querySelector(".sidebar");
    const menu = document.querySelector(".custom-context-menu");
    const deleteBtn = document.querySelector("#menu-one");
    const removePlaylist = document.querySelector("#menu-two");

    let currentId = null;
    slidebar.addEventListener("contextmenu", (e) => {
        if (e.button === 2) {
            e.preventDefault();
            const item = e.target.closest(".library-item");
            const menuOne = document.querySelector("#menu-one span");
            const menuTwo = document.querySelector("#menu-two span");
            currentId = item.getAttribute("data-id");

            if (item) {
                const type = item.getAttribute("data-type");
                if (type === "playlists") {
                    menuOne.textContent = "Delete";
                    menuTwo.textContent = "Remove from profile";
                }

                menu.style.display = "flex";
                menu.style.top = `${e.clientY}px`;
                menu.style.left = `${e.clientX}px`;
            }
        }
    });

    document.addEventListener("click", (e) => {
        if (e.button === 0) {
            menu.style.display = "none";
        }
    });

    deleteBtn.addEventListener("click", async (e) => {
        try {
            const response = await deletePlaylist(currentId);
            if (response.message === "Playlist deleted successfully") {
                showToast("Xóa danh sách phát thành công!", "success");

                const item = document.querySelector(
                    `.library-item[data-id="${currentId}"]`,
                );
                if (item) item.remove();

                const detailContainer = document.querySelector(
                    ".playlist-detail-container",
                );

                if (
                    detailContainer &&
                    detailContainer.getAttribute("data-id") === currentId
                ) {
                    slidebarUI.hidePlaylistDetail();
                }
            }
        } catch (e) {
            throw e;
        }
    });
}
