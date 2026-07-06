import * as albumApi from "../api/albumsApi.js";
import * as albumsUI from "../ui/albumsUI.js";
import { getTracks } from "../api/trackApi.js";
import { showDetailView } from "../utils/uiHelpers.js";

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
    
    showDetailView();

    const albumId = hit.getAttribute("data-id");
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
