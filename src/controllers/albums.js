import * as albumApi from "../api/albumsApi.js";
import * as albumsUI from "../ui/albumsUI.js";
import { getTracks } from "../api/trackApi.js";
import { showToast } from "../utils/toast.js";
import { showDetailView, hideAllMenus } from "../utils/uiHelpers.js";
import { addAlbumToSidebar } from "../ui/slidebarUI.js";

class AlbumsController {
    constructor() {
        document.addEventListener("unfollow-album", (e) =>
            this.#handleUnfollowAlbum(e),
        );
        document.addEventListener("albumClick", (e) =>
            this.showAlbumDetailById(e.detail.id),
        );
    }

    async getAlbums() {
        try {
            const { albums } = await albumApi.getAllAlbums();
            albumsUI.renderAllAlbums(albums);
        } catch (e) {
            console.log(e);
        }
    }

    async playAB(e) {
        const hit = e.target.closest(".hit-card");
        if (!hit) return;

        const albumId = hit.getAttribute("data-id");
        this.showAlbumDetailById(albumId);
    }

    async showAlbumDetailById(albumId) {
        showDetailView("albums", albumId);
        try {
            const response = await albumApi.getAlbumById(albumId);
            albumsUI.rederABChosed(response);
            this.getTracksAB(albumId);
        } catch (e) {
            console.log(e);
        }
    }

    async getTracksAB(albumId) {
        try {
            const { tracks } = await getTracks();
            const filteredTracks = tracks.filter(
                (tr) => tr.album_id === albumId,
            );
            albumsUI.renderTrackbyAB(filteredTracks);
        } catch (e) {
            console.log(e);
        }
    }

    handleTextMenu() {
        const ablumsGrid = document.querySelector(".albums-grid");
        const albumsMenu = document.querySelector("#albums-context-menu");
        const addAlbum = albumsMenu?.querySelector("#menu-album-add-library");

        if (!ablumsGrid || !albumsMenu || !addAlbum) return;

        ablumsGrid.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideAllMenus();
            const ablum = e.target.closest(".hit-card");
            if (!ablum) return;
            const albumId = ablum.getAttribute("data-id");
            albumsMenu.setAttribute("data-active-id", albumId || "");

            if (e.button === 2) {
                albumsMenu.style.display = "block";
                let menuLeft = e.clientX;
                let menuTop = e.clientY;
                let menuWidth = addAlbum.offsetWidth;
                let menuHeight = addAlbum.offsetHeight;

                if (window.innerWidth - menuLeft < menuWidth) {
                    menuLeft = menuLeft - menuWidth;
                }
                if (window.innerHeight - menuTop < menuHeight) {
                    menuTop = menuTop - menuHeight;
                }
                albumsMenu.style.left = `${menuLeft}px`;
                albumsMenu.style.top = `${menuTop}px`;
            }
        });

        addAlbum.addEventListener("click", () => this.#handleFollowAlbum());
    }

    async #handleFollowAlbum() {
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
                showToast("Album đã được thêm vào Thư viện", "error");
            }
        }
    }

    async #handleUnfollowAlbum(e) {
        const id = e.detail.id;
        try {
            await albumApi.unlikeAlbum(id);
            const item = document.querySelector(
                `.library-item[data-id="${id}"][data-type="album"]`,
            );
            if (item) item.remove();
            showToast("Đã xóa Album khỏi Thư viện thành công!", "success");
        } catch (e) {
            console.error("Lỗi khi xóa Album:", e);
            showToast("Có lỗi xảy ra khi xóa Album!", "error");
        }
    }
}

export const albumsController = new AlbumsController();
