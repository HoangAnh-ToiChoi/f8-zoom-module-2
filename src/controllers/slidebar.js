import * as slidebarUI from "../ui/slidebarUI.js";
import {
    createPlaylist,
    getMyPlaylist,
    deletePlaylist,
} from "../api/playlistsApi.js";
import { showToast } from "../utils/toast.js";
import * as artistsApi from "../api/ArtistsApi.js";
import * as albumsApi from "../api/albumsApi.js";

let playlists = {
    name: "My New Playlist",
    description: "Playlist description",
    is_public: true,
    image_url: null,
};

export async function showLibrarySlidebar(e) {
    const button = e.target.closest(".nav-tab");
    const selectType = button?.getAttribute("data-type");

    if (!button) return;
    const navTabs = document.querySelector(".nav-tabs");
    if (navTabs) {
        navTabs.querySelectorAll(".nav-tab").forEach((item) => {
            item.classList.remove("active");
        });
        button.classList.add("active");
    }

    const libraryContent = document.querySelector(".library-content");
    const listLibrary = libraryContent.querySelectorAll(".library-item");
    listLibrary.forEach((item) => {
        const dataType = item.getAttribute("data-type");
        const isMatch =
            (selectType === "playlists" &&
                (dataType === "playlists" || dataType === "album")) ||
            (selectType === "artist" && dataType === "artist");
        item.style.display = isMatch ? "flex" : "none";
    });
}

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

        if (playlistOwnerId && String(playlistOwnerId) !== String(userId))
            return;

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

        let followedArtists = [];
        try {
            const artistResponse = await artistsApi.getAllArtists();
            const allArtists = artistResponse.artists;
            if (Array.isArray(allArtists)) {
                followedArtists = allArtists.filter(
                    (ar) =>
                        ar.is_following === true ||
                        ar.is_following === 1 ||
                        ar.is_following === "true",
                );
            }
        } catch (err) {
            console.error(err);
        }

        let followedAlbums = [];
        try {
            const albumResponse = await albumsApi.getAllAlbums();
            const allAlbums = albumResponse.albums;
            if (Array.isArray(allAlbums)) {
                followedAlbums = allAlbums.filter(
                    (al) =>
                        al.is_liked === true ||
                        al.is_liked === 1 ||
                        al.is_liked === "true",
                );
            }
        } catch (err) {
            console.error(err);
        }

        const libraryItems = [];

        if (Array.isArray(myPlaylists)) {
            myPlaylists.forEach((pl) => {
                libraryItems.push({
                    id: pl.id,
                    name: pl.name,
                    type: "playlists",
                    image_url: pl.image_url,
                    total_tracks: pl.total_tracks || 0,
                    user_username: pl.user_username || "Hoàng Anh",
                    user_id: pl.user_id,
                });
            });
        }

        followedArtists.forEach((art) => {
            libraryItems.push({
                id: art.id,
                name: art.name,
                type: "artist",
                image_url: art.image_url,
            });
        });

        followedAlbums.forEach((ab) => {
            libraryItems.push({
                id: ab.id,
                name: ab.title,
                type: "album",
                image_url: ab.cover_image_url,
                artist_name: ab.artist_name || "",
            });
        });

        slidebarUI.renderLibrary(libraryItems);
    } catch (e) {
        const libraryContent = document.querySelector(".library-content");
        if (!libraryContent) return;
        if (
            (e && e.code === "AUTH_HEADER_MISSING") ||
            e.status === 401 ||
            (e.message && e.message.includes("Authorization"))
        ) {
            libraryContent.innerHTML = `
                <div class="library-promo-box" style="background-color: #242424; padding: 16px 20px; border-radius: 8px; margin: 8px; color: #fff;">
                    <span style="font-weight: 700; font-size: 14px; display: block; margin-bottom: 8px;">Tạo danh sách phát đầu tiên của bạn</span>
                    <span style="font-size: 12px; color: #b3b3b3; display: block; margin-bottom: 16px;">Rất dễ, chúng tôi sẽ giúp bạn</span>
                    <button class="promo-login-btn" style="background-color: #fff; color: #000; border: none; padding: 6px 16px; border-radius: 500px; font-size: 12px; font-weight: 700; cursor: pointer;">Đăng nhập</button>
                </div>
            `;
            libraryContent
                .querySelector(".promo-login-btn")
                ?.addEventListener("click", () => {
                    const userBtn = document.querySelector(".user-btn");
                    if (userBtn) userBtn.click();
                });
        } else {
            libraryContent.innerHTML = ``;
            libraryContent
                .querySelector(".promo-retry-btn")
                ?.addEventListener("click", () => {
                    initLibrary();
                });
        }
    }
}

export function handleTextMenuSlidebar() {
    const slidebar = document.querySelector(".sidebar");
    const menu = document.querySelector(".custom-context-menu");
    const deleteBtn = document.querySelector("#menu-one");
    const removePlaylist = document.querySelector("#menu-two");

    let currentId = null;
    let type = null;
    let copiedPlaylists = [];

    slidebar.addEventListener("contextmenu", (e) => {
        if (e.button === 2) {
            e.preventDefault();
            const item = e.target.closest(".library-item");
            const menuOne = document.querySelector("#menu-one span");
            const menuTwo = document.querySelector("#menu-two span");
            currentId = item?.getAttribute("data-id");
            type = item?.getAttribute("data-type");

            copiedPlaylists = JSON.parse(
                localStorage.getItem("copiedPlaylists") || "[]",
            );
            const isCopied = copiedPlaylists
                .map(String)
                .includes(String(currentId));

            deleteBtn.style.display = "flex";
            removePlaylist.style.display = "flex";

            if (item) {
                if (type === "playlists") {
                    if (isCopied) {
                        deleteBtn.style.display = "none";
                        menuTwo.textContent = "Remove playlists from profile";
                    } else {
                        menuOne.textContent = "Delete";
                        removePlaylist.style.display = "none";
                    }
                }
                if (type === "album") {
                    menuOne.textContent = "Unlike";
                    menuTwo.textContent = "Remove from your library";
                }
                if (type === "artist") {
                    deleteBtn.style.display = "none";
                    menuTwo.textContent = "Remove from your library";
                }
                menu.style.display = "flex";
                menu.style.top = `${e.clientY}px`;
                menu.style.left = `${e.clientX}px`;
            }
        }
    });

    deleteBtn.addEventListener("click", async () => {
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

    removePlaylist.addEventListener("click", () => {
        if (currentId && type === "playlists") {
            deleteBtn.click();
        }
        if (currentId && type === "album") {
            const event = new CustomEvent("unfollow-album", {
                detail: { id: currentId },
            });
            document.dispatchEvent(event);
        }
        if (currentId && type === "artist") {
            const event = new CustomEvent("unfollow-artist", {
                detail: { id: currentId },
            });
            document.dispatchEvent(event);
        }
    });
}

export async function handleSearch() {
    const searchLibrary = document.querySelector(".search-library");
    const searchInput = document.querySelector("#sidebar-search-input");
    if (!searchInput) return;
    searchLibrary.classList.toggle("active-search");

    if (searchLibrary.classList.contains("active-search")) {
        searchInput.focus();
    }

    searchLibrary.addEventListener("keyup", (e) => {
        const valueSearch = e.target.value.toLowerCase().trim();
        const listItem = document.querySelectorAll(".library-item");
        listItem.forEach((item) => {
            const itemTile = item.querySelector(".item-title");
            let title = itemTile.textContent.toLowerCase().trim();
            if (!title.includes(valueSearch)) {
                item.style.display = "none";
            } else {
                item.style.display = "flex";
            }
        });
    });
}
