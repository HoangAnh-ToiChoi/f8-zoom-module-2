import * as playlistApi from "../api/playlistsApi.js";
import * as playlistsUI from "../ui/playlistsUI.js";
import { addPlaylistToSidebar } from "../ui/slidebarUI.js";
import { showDetailView, hideAllMenus } from "../utils/uiHelpers.js";
import { showToast } from "../utils/toast.js";

class PlaylistsController {
    async getPlaylists() {
        try {
            const { playlists } = await playlistApi.getAllPlaylists();
            playlistsUI.renderAllPlaylists(playlists);
        } catch (e) {
            console.error(e);
        }
    }

    async ChosePlaylist(e) {
        const hit = e.target.closest(".hit-card");
        if (!hit) return;

        const hitId = hit.getAttribute("data-id");
        showDetailView("playlists", hitId);
        try {
            const response = await playlistApi.getPlaylistById(hitId);
            playlistsUI.renderPlaylistDetail(response);
        } catch (e) {
            console.error(e);
        }
    }

    handleTextMenu() {
        const hitGird = document.querySelector(".hits-grid");
        const hitMenu = document.getElementById("hits-context-menu");
        const addPlaylist = document.getElementById("menu-add-library");

        if (!hitGird || !hitMenu || !addPlaylist) return;

        hitGird.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideAllMenus();
            const hit = e.target.closest(".hit-card");
            if (!hit) return;
            const hitId = hit.getAttribute("data-id");
            hitMenu.setAttribute("data-active-id", hitId || "");

            if (e.button === 2) {
                hitMenu.style.display = "block";
                let menuLeft = e.clientX;
                let menuTop = e.clientY;
                let menuWidth = hitMenu.offsetWidth;
                let menuHeight = hitMenu.offsetHeight;

                if (window.innerWidth - menuLeft < menuWidth) {
                    menuLeft = menuLeft - menuWidth;
                }
                if (window.innerHeight - menuTop < menuHeight) {
                    menuTop = menuTop - menuHeight;
                }
                hitMenu.style.left = `${menuLeft}px`;
                hitMenu.style.top = `${menuTop}px`;
            }
        });

        addPlaylist.addEventListener("click", () =>
            this.#handleAddSongToPlaylist(),
        );
    }

    async #handleAddSongToPlaylist() {
        const hitMenu = document.getElementById("hits-context-menu");
        const hitId = hitMenu ? hitMenu.getAttribute("data-active-id") : null;

        if (!hitId) return;

        try {
            const response = await playlistApi.getPlaylistById(hitId);
            const playlist = response;
            let copiedPlaylists = [];

            const userData = JSON.parse(localStorage.getItem("user") || "{}");

            const cloneData = {
                id: playlist.id,
                name: playlist.name,
                type: "playlists",
                image_url: playlist.image_url,
                total_tracks: playlist.total_tracks || 0,
                user_username: playlist.user_username || "Hoàng Anh",
                user_id: playlist.user_id,
            };

            const createData = await playlistApi.createPlaylist(cloneData);
            const myNewPlaylist = createData.playlist;

            addPlaylistToSidebar(myNewPlaylist);
            playlistsUI.renderPlaylistDetail(myNewPlaylist);

            showToast("Đã thêm vào Thư viện thành công!", "success");
            try {
                copiedPlaylists = JSON.parse(
                    localStorage.getItem("copiedPlaylists") || "[]",
                );
            } catch (e) {
                copiedPlaylists = [];
            }

            copiedPlaylists.push(myNewPlaylist.id);
            localStorage.setItem(
                "copiedPlaylists",
                JSON.stringify(copiedPlaylists),
            );
        } catch (error) {
            console.error("Lỗi khi thêm playlist:", error);
            showToast("Có lỗi xảy ra khi thêm vào Thư viện!", "error");
        }
    }
}

export const playlistsController = new PlaylistsController();
