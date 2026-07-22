import * as albumApi from "../api/albumsApi.js";
import * as albumsUI from "../ui/albumsUI.js";
import { getTracks } from "../api/trackApi.js";
import { showToast } from "../utils/toast.js";
import { showDetailView, hideAllMenus } from "../utils/uiHelpers.js";
import { addAlbumToSidebar } from "../ui/slidebarUI.js";

export async function getAlbums() {
    try {
        const { albums } = await albumApi.getAllAlbums();
        albumsUI.renderAllAlbums(albums);
    } catch (e) {
        console.log(e);
    }
}

export async function playAB(e) {
    const hit = e.target.closest(".hit-card");
    if (!hit) return;

    const albumId = hit.getAttribute("data-id");
    showDetailView("albums", albumId);
    try {
        const response = await albumApi.getAlbumById(albumId);
        albumsUI.rederABChosed(response);
        getTracksAB(albumId);
    } catch (e) {
        console.log(e);
    }
}

export async function getTracksAB(albumId) {
    try {
        const { tracks } = await getTracks();
        const filteredTracks = tracks.filter((tr) => tr.album_id === albumId);
        albumsUI.renderTrackbyAB(filteredTracks);
    } catch (e) {
        console.log(e);
    }
}

export function handleTextMenu() {
    const ablumsGrid = document.querySelector(".albums-grid");
    const albumsMenu = document.querySelector("#albums-context-menu");
    const addAlbum = albumsMenu.querySelector("#menu-album-add-library");

    ablumsGrid.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideAllMenus();
        const ablum = e.target.closest(".hit-card");
        if (!ablum) return;
        const albumId = ablum.getAttribute("data-id");
        albumsMenu.setAttribute("data-active-id", albumId || "");
        console.log(albumsMenu);
        if (e.button === 2) {
            albumsMenu.style.display = "block";
            albumsMenu.style.left = `${e.clientX}px`;
            albumsMenu.style.top = `${e.clientY}px`;
        }
    });

    addAlbum.addEventListener("click", handleFollowAlbum);
}

async function handleFollowAlbum() {
    const albumsMenu = document.querySelector("#albums-context-menu");
    const id = albumsMenu?.getAttribute("data-active-id");
    if (id) {
        try {
            await albumApi.likeAlbum(id);

            const album = await albumApi.getAlbumById(id);

            addAlbumToSidebar(album);

            showToast("Đã thêm Album vào Thư viện thành công!", "success");
        } catch (e) {
            console.error("Lỗi khi like Album:", e);
            showToast("Album đã được thêmvào Thư viện", "error");
        }
    }
}

document.addEventListener("unfollow-album", async (e) => {
    const id = e.detail.id;
    try {
        await albumApi.unlikeAlbum(id);
        const item = document.querySelector(
            `.library-item[data-id="${id}"][data-type="album"]`,
        );
        item.remove();
        showToast("Đã xóa Album khỏi Thư viện thành công!", "success");
    } catch (e) {
        console.error("Lỗi khi xóa Album:", e);
        showToast("Có lỗi xảy ra khi xóa Album!", "error");
    }
});
