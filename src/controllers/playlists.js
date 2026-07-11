import * as playlistApi from "../api/playlistsApi.js";
import * as playlistsUI from "../ui/playlistsUI.js";
import { showDetailView } from "../utils/uiHelpers.js";
export async function getPlaylists() {
    try {
        const { playlists } = await playlistApi.getAllPlaylists();
        playlistsUI.renderAllPlaylists(playlists);
    } catch (e) {
        console.log(e);
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
        console.log(e);
    }
}
