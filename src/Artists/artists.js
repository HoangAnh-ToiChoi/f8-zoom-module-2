import * as artistsApi from "../api/ArtistsApi.js";
import * as artistsUI from "../ui/artistsUI.js";
import { getTracks } from "../api/trackApi.js";
import { showDetailView } from "../utils/uiHelpers.js";

export async function getArtists() {
    try {
        const { artists } = await artistsApi.getAllArtists();
        artistsUI.renderAllArtists(artists);
    } catch (e) {
        console.log(e);
    }
}

export async function playAr(e) {
    const artists = e.target.closest(".artist-card");
    if (!artists) return;

    showDetailView();

    const artistId = artists.getAttribute("data-id");
    try {
        const response = await artistsApi.getArtistsById(artistId);
        artistsUI.rederArChosed(response);
        getTracksByAr(artistId);
    } catch (e) {
        console.log(e);
    }
}

export async function getTracksByAr(artistId) {
    try {
        const { tracks } = await getTracks();
        const filteredTracks = tracks.filter((tr) => tr.artist_id === artistId);
        artistsUI.renderTrackbyAr(filteredTracks);
    } catch (e) {
        console.log(e);
    }
}
