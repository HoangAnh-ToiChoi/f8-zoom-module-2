import { formatDuration } from "../utils/format.js";

export function renderAllAlbums(albums) {
    const albumsGrid = document.querySelector(".albums-grid");
    if (!albumsGrid) return;

    // Reset albums grid
    albumsGrid.innerHTML = "";

    try {
        // Filter out albums that don't have a cover image
        const validAlbums = albums.filter((al) => al.cover_image_url);

        validAlbums.forEach((album) => {
            const hitCard = document.createElement("div");
            hitCard.classList.add("hit-card");
            hitCard.setAttribute("data-id", album.id);
            albumsGrid.appendChild(hitCard);

            const hitCardCover = document.createElement("div");
            hitCardCover.classList.add("hit-card-cover");
            hitCard.appendChild(hitCardCover);

            const img = document.createElement("img");
            img.src = album.cover_image_url || "./placeholder.svg";
            img.alt = album.title;
            img.onerror = function () {
                img.src = "./placeholder.svg";
            };
            hitCardCover.appendChild(img);

            const btnPlay = document.createElement("button");
            btnPlay.classList.add("hit-play-btn");
            btnPlay.innerHTML = '<i class="fas fa-play"></i>';
            hitCardCover.appendChild(btnPlay);

            const hitCardInfo = document.createElement("div");
            hitCardInfo.classList.add("hit-card-info");
            hitCard.appendChild(hitCardInfo);

            const title = document.createElement("h3");
            title.classList.add("hit-card-title");
            title.textContent = album.title;
            hitCardInfo.appendChild(title);

            const subtitle = document.createElement("p");
            subtitle.classList.add("hit-card-artist");
            subtitle.textContent = album.artist_name || "Unknown";
            hitCardInfo.appendChild(subtitle);
        });
    } catch (e) {
        console.error(e);
    }
}

export function rederABChosed(album) {
    const artistHero = document.querySelector(".artist-hero");
    if (!artistHero) return;
    const detailContainer = document.querySelector(".detail-container");
    detailContainer.setAttribute("data-type", "albums");
    detailContainer.setAttribute("data-id", album.id);

    artistHero.innerHTML = "";

    const heroBackground = document.createElement("div");
    heroBackground.classList.add("hero-background");

    const img = document.createElement("img");
    img.src = album.cover_image_url || "./placeholder.svg";
    img.alt = album.artist_name || "Album Cover";
    img.classList.add("hero-image");
    img.onerror = function () {
        img.src = "./placeholder.svg";
    };
    heroBackground.appendChild(img);

    const heroOverlay = document.createElement("div");
    heroOverlay.classList.add("hero-overlay");
    heroBackground.appendChild(heroOverlay);

    artistHero.appendChild(heroBackground);

    const heroContent = document.createElement("div");
    heroContent.classList.add("hero-content");

    const verifiedBadge = document.createElement("div");
    verifiedBadge.classList.add("verified-badge");

    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-check-circle");
    verifiedBadge.appendChild(icon);

    const span = document.createElement("span");
    span.textContent = "Verified Artist";
    verifiedBadge.appendChild(span);

    heroContent.appendChild(verifiedBadge);

    const h1 = document.createElement("h1");
    h1.classList.add("artist-name");
    h1.textContent = album.title || "Unknown Album";
    heroContent.appendChild(h1);

    const p = document.createElement("p");
    p.classList.add("monthly-listeners");
    const plays =
        album.play_count !== undefined
            ? Number(album.play_count).toLocaleString()
            : "0";
    p.textContent = `${plays} plays`;
    heroContent.appendChild(p);

    artistHero.appendChild(heroContent);
}

export function renderTrackbyAB(filteredTracks) {
    const trackList = document.querySelector(".track-list");
    if (!trackList) return;
    trackList.innerHTML = "";
    try {
        filteredTracks.forEach((track, index) => {
            const trackItem = document.createElement("div");
            trackItem.classList.add("track-item");
            trackItem.setAttribute("data-id", track.id);
            trackItem.setAttribute("data-index", index);
            trackList.appendChild(trackItem);

            const trackNumber = document.createElement("div");
            trackNumber.classList.add("track-number");
            trackNumber.textContent = index + 1;
            trackItem.appendChild(trackNumber);

            const trackImage = document.createElement("div");
            trackImage.classList.add("track-image");
            trackItem.appendChild(trackImage);

            const img = document.createElement("img");
            img.src = track.image_url || "./placeholder.svg";
            img.alt = track.title;
            img.onerror = function () {
                img.src = "./placeholder.svg";
            };
            trackImage.appendChild(img);

            const trackInfo = document.createElement("div");
            trackInfo.classList.add("track-info");
            trackItem.appendChild(trackInfo);

            const trackName = document.createElement("div");
            trackName.classList.add("track-name");
            trackName.textContent = track.title || "Unknown Track";
            trackInfo.appendChild(trackName);

            const trackPlays = document.createElement("div");
            trackPlays.classList.add("track-plays");
            const plays =
                track.play_count !== undefined
                    ? Number(track.play_count).toLocaleString()
                    : "0";
            trackPlays.textContent = plays;
            trackItem.appendChild(trackPlays);

            const trackDuration = document.createElement("div");
            trackDuration.classList.add("track-duration");
            trackDuration.textContent = formatDuration(track.duration);
            trackItem.appendChild(trackDuration);

            const btnMenu = document.createElement("button");
            btnMenu.classList.add("track-menu-btn");
            btnMenu.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
            trackItem.appendChild(btnMenu);
        });
    } catch (err) {
        console.error(err);
    }
}
