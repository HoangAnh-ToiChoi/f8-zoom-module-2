import * as playlistApi from "../api/playlistsApi.js";
import * as playlistsUI from "../ui/playlistsUI.js";
import { renderLibrary, addPlaylistToSidebar } from "../ui/slidebarUI.js";
import { showDetailView } from "../utils/uiHelpers.js";
import { showToast } from "../utils/toast.js";

export async function getPlaylists() {
    try {
        const { playlists } = await playlistApi.getAllPlaylists();
        playlistsUI.renderAllPlaylists(playlists);
    } catch (e) {
        console.error(e);
    }
}

export async function ChosePlaylist(e) {
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

export function handleTextMenu() {
    const hitGird = document.querySelector(".hits-grid");
    const hitMenu = document.getElementById("hits-context-menu");
    const addPlaylist = document.getElementById("menu-add-library");

    hitGird.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const hit = e.target.closest(".hit-card");
        if (!hit) return;
        const hitId = hit.getAttribute("data-id");
        hitMenu.setAttribute("data-active-id", hitId || "");

        if (e.button === 2) {
            hitMenu.style.display = "block";
            hitMenu.style.left = `${e.clientX}px`;
            hitMenu.style.top = `${e.clientY}px`;
        }
    });

    document.onclick = () => {
        hitMenu.style.display = "none";
    };

    addPlaylist.addEventListener("click", handleAddSongToPlaylist);
}

async function handleAddSongToPlaylist() {
    const hitMenu = document.getElementById("hits-context-menu");
    const hitId = hitMenu ? hitMenu.getAttribute("data-active-id") : null;

    if (!hitId) return;

    try {
        const response = await playlistApi.getPlaylistById(hitId);
        const playlist = response;

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
    } catch (error) {
        console.error("Lỗi khi thêm playlist:", error);
        showToast("Có lỗi xảy ra khi thêm vào Thư viện!", "error");
    }
}
