import * as artistsApi from "../api/ArtistsApi.js";
import * as artistsUI from "../ui/artistsUI.js";
import { addArtistToSidebar } from "../ui/slidebarUI.js";
import { getTracks } from "../api/trackApi.js";
import { showDetailView, hideAllMenus } from "../utils/uiHelpers.js";
import { showToast } from "../utils/toast.js";

class ArtistsController {
    constructor() {
        document.addEventListener("unfollow-artist", (e) =>
            this.#handleUnfollowArtist(e),
        );
    }

    async getArtists() {
        try {
            const { artists } = await artistsApi.getAllArtists();
            artistsUI.renderAllArtists(artists);
        } catch (e) {
            console.error(e);
        }
    }

    async playAr(e) {
        const artists = e.target.closest(".artist-card");
        if (!artists) return;

        const artistId = artists.getAttribute("data-id");
        showDetailView("artist", artistId);
        try {
            const response = await artistsApi.getArtistsById(artistId);
            artistsUI.rederArChosed(response);
            this.getTracksByAr(artistId);
        } catch (e) {
            console.error(e);
        }
    }

    async getTracksByAr(artistId) {
        try {
            const { tracks } = await getTracks();
            const filteredTracks = tracks.filter(
                (tr) => tr.artist_id === artistId,
            );
            artistsUI.renderTrackbyAr(filteredTracks);
        } catch (e) {
            console.error(e);
        }
    }

    handleTextMenu() {
        const artistsGrid = document.querySelector(".artists-grid");
        const artistMenu = document.querySelector(".context-menu");
        const follow = artistMenu?.querySelector("#menu-one");

        if (!artistsGrid || !artistMenu || !follow) return;

        artistsGrid.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            hideAllMenus();
            const artist = e.target.closest(".artist-card");
            if (!artist) return;
            const artistId = artist.getAttribute("data-id");
            artistMenu.setAttribute("data-active-id", artistId || "");

            if (e.button === 2) {
                artistMenu.style.display = "block";
                let menuLeft = e.clientX;
                let menuTop = e.clientY;
                let menuWidth = artistMenu.offsetWidth;
                let menuHeight = artistMenu.offsetHeight;

                if (window.innerWidth - menuLeft < menuWidth) {
                    menuLeft = menuLeft - menuWidth;
                }
                if (window.innerHeight - menuTop < menuHeight) {
                    menuTop = menuTop - menuHeight;
                }
                artistMenu.style.left = `${menuLeft}px`;
                artistMenu.style.top = `${menuTop}px`;
            }
        });

        follow.addEventListener("click", () => this.#handleFollowArtist());
    }

    async #handleFollowArtist() {
        const artistMenu = document.querySelector(".context-menu");
        const id = artistMenu?.getAttribute("data-active-id");
        if (id) {
            try {
                const response = await artistsApi.followArtist(id);
                console.log(response);
                if (response.is_following === true) {
                    showToast("Đã theo dõi nghệ sĩ thành công!", "success");
                    const artist = await artistsApi.getArtistsById(id);
                    addArtistToSidebar(artist);
                }
            } catch (e) {
                console.error(e);
                showToast("Bạn đã theo dõi nghệ sĩ này", "info");
            }
        }
    }

    async #handleUnfollowArtist(e) {
        const id = e.detail.id;
        try {
            await artistsApi.unfollowArtist(id);
            const item = document.querySelector(
                `.library-item[data-id="${id}"][data-type="artist"]`,
            );
            if (item) item.remove();
            showToast("Đã xóa nghệ sĩ khỏi Thư viện thành công!", "success");
        } catch (e) {
            console.error(e);
            showToast("Có lỗi xảy ra khi xóa nghệ sĩ!", "error");
        }
    }
}

export const artistsController = new ArtistsController();
