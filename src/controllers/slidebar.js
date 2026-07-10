import * as slidebarUI from "../ui/slidebarUI.js";
import { createPlaylist, getMyPlaylist } from "../api/playlistsApi.js";

let playlists = {
    name: "My New Playlist",
    description: "Playlist description",
    is_public: true,
    image_url: null,
};

export function handleLibrary(e) {
    const sortBtn = e.target.closest(".sort-btn");
    if (sortBtn) {
        console.log(e.clientX);
        slidebarUI.showLibraryFilter(e);
    }
}

export function createPlayplist() {
    const createBtn = document.querySelector(".create-btn");
    const title = document.querySelector("#playlist-hero-title");
    const modalCloseBtn = document.querySelector("#playlist-edit-close");
    const btnSave = document.getElementById("playlist-save-btn");

    createBtn.addEventListener("click", () => {
        slidebarUI.showPlaylistDetail();
    });

    title.addEventListener("click", () => {
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
            console.error("Lỗi khi tạo playlist:", e);
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

        const libraryItems = [
            { id: "liked", name: "Liked Songs", type: "liked" },
        ];
        if (Array.isArray(myPlaylists)) {
            myPlaylists.forEach((pl) => {
                libraryItems.push({
                    id: pl.id,
                    name: pl.name,
                    type: "playlists",
                    image_url: pl.image_url,
                    user_username: pl.user_username || "Han",
                });
            });
        }

        slidebarUI.renderLibrary(libraryItems);
    } catch (e) {
        console.error("Lỗi khi load thư viện:", e);
    }
}
