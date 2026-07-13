import * as artistsApi from "../api/ArtistsApi.js";
import * as artistsUI from "../ui/artistsUI.js";
import { addArtistToSidebar } from "../ui/slidebarUI.js";
import { getTracks } from "../api/trackApi.js";
import { showDetailView } from "../utils/uiHelpers.js";
import { showToast } from "../utils/toast.js";

export async function getArtists() {
    try {
        const { artists } = await artistsApi.getAllArtists();
        artistsUI.renderAllArtists(artists);
    } catch (e) {
        console.error(e);
    }
}

export async function playAr(e) {
    const artists = e.target.closest(".artist-card");
    if (!artists) return;

    const artistId = artists.getAttribute("data-id");
    showDetailView("artist", artistId);
    try {
        const response = await artistsApi.getArtistsById(artistId);
        artistsUI.rederArChosed(response);
        getTracksByAr(artistId);
    } catch (e) {
        console.error(e);
    }
}

export async function getTracksByAr(artistId) {
    try {
        const { tracks } = await getTracks();
        const filteredTracks = tracks.filter((tr) => tr.artist_id === artistId);
        artistsUI.renderTrackbyAr(filteredTracks);
    } catch (e) {
        console.error(e);
    }
}

export function handleTextMenu() {
    const artistsGrid = document.querySelector(".artists-grid");
    const artistMenu = document.querySelector(".context-menu");
    const follow = artistMenu.querySelector("#menu-one");

    artistsGrid.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const artist = e.target.closest(".artist-card");
        if (!artist) return;
        const artistId = artist.getAttribute("data-id");
        artistMenu.setAttribute("data-active-id", artistId || "");
        console.log(artistMenu);
        if (e.button === 2) {
            artistMenu.style.display = "block";
            artistMenu.style.left = `${e.clientX}px`;
            artistMenu.style.top = `${e.clientY}px`;
        }
    });

    follow.addEventListener("click", handleFollowArtist);
}

async function handleFollowArtist() {
    const artistMenu = document.querySelector(".context-menu");
    const id = artistMenu?.getAttribute("data-active-id");
    if (id) {
        const response = await artistsApi.followArtist(id);
        console.log(response);
        if (response.is_following === true) {
            showToast("Đã theo dõi nghệ sĩ thành công!", "success");
            const artist = await artistsApi.getArtistsById(id);
            addArtistToSidebar(artist);
        }
    }
}
