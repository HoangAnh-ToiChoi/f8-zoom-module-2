import { formatDuration } from "../utils/format.js";

export function renderAllArtists(artists) {
    const artistGird = document.querySelector(".artists-grid");
    if (!artistGird) return;

    try {
        const validArtists = artists.filter((ar) => ar.image_url);

        validArtists.forEach((ar) => {
            const artistCard = document.createElement("div");
            artistCard.classList.add("artist-card");
            artistCard.setAttribute("data-id", ar.id);
            artistGird.appendChild(artistCard);

            const artistCardCover = document.createElement("div");
            artistCardCover.classList.add("artist-card-cover");
            artistCard.appendChild(artistCardCover);

            const img = document.createElement("img");
            img.src = ar.image_url;
            img.alt = ar.name;
            artistCardCover.appendChild(img);

            const btnPlay = document.createElement("button");
            btnPlay.classList.add("artist-play-btn");
            btnPlay.innerHTML = '<i class="fas fa-play"></i>';
            artistCardCover.appendChild(btnPlay);

            const artistCardInfo = document.createElement("div");
            artistCardInfo.classList.add("artist-card-info");
            artistCard.appendChild(artistCardInfo);

            const title = document.createElement("h3");
            title.classList.add("artist-card-name");
            title.textContent = ar.name;
            artistCardInfo.appendChild(title);

            const subtitle = document.createElement("p");
            subtitle.classList.add("artist-card-type");
            subtitle.textContent = "Artist";
            artistCardInfo.appendChild(subtitle);
        });
    } catch (e) {
        console.log(e);
    }
}

export function rederArChosed(artists) {
    const artistHero = document.querySelector(".artist-hero");
    if (!artistHero) return;

    // Reset container
    artistHero.innerHTML = "";

    const heroBackground = document.createElement("div");
    heroBackground.classList.add("hero-background");

    const img = document.createElement("img");
    img.src = artists.image_url || "./placeholder.svg";
    img.alt = artists.name || "Artist Cover";
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
    h1.textContent = artists.name || "Unknown Artist";
    heroContent.appendChild(h1);

    const p = document.createElement("p");
    p.classList.add("monthly-listeners");
    const plays =
        artists.monthly_listeners !== undefined
            ? Number(artists.monthly_listeners).toLocaleString()
            : "0";
    p.textContent = `${plays} monthly listeners`;
    heroContent.appendChild(p);

    artistHero.appendChild(heroContent);
}

export function renderTrackbyAr(filteredTracks) {
    const trackList = document.querySelector(".track-list");
    if (!trackList) return;
    trackList.innerHTML = "";
    try {
        filteredTracks.forEach((track, index) => {
            const trackItem = document.createElement("div");
            trackItem.classList.add("track-item");
            trackItem.setAttribute("data-id", track.id);
            trackList.appendChild(trackItem);

            // 1. Số thứ tự bài hát
            const trackNumber = document.createElement("div");
            trackNumber.classList.add("track-number");
            trackNumber.textContent = index + 1;
            trackItem.appendChild(trackNumber);

            // 2. Hình ảnh bài hát
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

            // 3. Thông tin bài hát (Tên)
            const trackInfo = document.createElement("div");
            trackInfo.classList.add("track-info");
            trackItem.appendChild(trackInfo);

            const trackName = document.createElement("div");
            trackName.classList.add("track-name");
            trackName.textContent = track.title || "Unknown Track";
            trackInfo.appendChild(trackName);

            // 4. Lượt nghe (play_count)
            const trackPlays = document.createElement("div");
            trackPlays.classList.add("track-plays");
            const plays =
                track.play_count !== undefined
                    ? Number(track.play_count).toLocaleString()
                    : "0";
            trackPlays.textContent = plays;
            trackItem.appendChild(trackPlays);

            // 5. Thời lượng (duration)
            const trackDuration = document.createElement("div");
            trackDuration.classList.add("track-duration");
            trackDuration.textContent = formatDuration(track.duration);
            trackItem.appendChild(trackDuration);

            // 6. Nút ba chấm option
            const btnMenu = document.createElement("button");
            btnMenu.classList.add("track-menu-btn");
            btnMenu.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
            trackItem.appendChild(btnMenu);
        });
    } catch (err) {
        console.error(err);
    }
}
