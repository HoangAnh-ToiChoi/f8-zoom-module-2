import * as playlistApi from "../api/playlistsApi.js";
import * as playlistsUI from "../ui/playlistsUI.js";

export async function getPlaylists() {
    try {
        const { playlists } = await playlistApi.getAllPlaylists();
        playlistsUI.renderAllPlaylists(playlists);
    } catch (e) {
        console.log(e);
    }
}
