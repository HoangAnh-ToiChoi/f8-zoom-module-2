export function renderAllPlaylists(playlists) {
    const hitGird = document.querySelector(".hits-grid");
    try {
        playlists.forEach((playlist) => {
            const hitCard = document.createElement("div");

            hitCard.classList.add("hit-card");
            hitCard.setAttribute("data-id", playlist.id || "");
            hitCard.setAttribute("data-type", "playlists");
            hitGird.appendChild(hitCard);

            const hitCardCover = document.createElement("div");
            hitCardCover.classList.add("hit-card-cover");
            hitCard.appendChild(hitCardCover);

            const img = document.createElement("img");
            img.src = playlist.image_url || "./placeholder.svg";
            img.alt = playlist.name;
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
            title.textContent = playlist.name;
            hitCardInfo.appendChild(title);

            const subtitle = document.createElement("p");
            subtitle.classList.add("hit-card-artist");
            subtitle.textContent =
                playlist.artist_name || playlist.user_username || "unknonw";
            hitCardInfo.appendChild(subtitle);
        });
    } catch (e) {
        console.log(e);
    }
}

export function renderPlaylistDetail(playlist) {
    const detailContainer = document.querySelector(
        ".playlist-detail-container",
    );
    if (!detailContainer || !playlist) return;

    detailContainer.setAttribute("data-id", playlist.id || "");
    detailContainer.setAttribute("data-type", "playlists");

    const coverIcon = detailContainer.querySelector(
        ".playlist-cover i.fa-music",
    );
    const coverImg = detailContainer.querySelector("#playlist-hero-img");

    if (playlist.image_url) {
        if (coverImg) {
            coverImg.src = playlist.image_url;
            coverImg.style.display = "block";
        }
        if (coverIcon) coverIcon.style.display = "none";
    } else {
        if (coverImg) coverImg.style.display = "none";
        if (coverIcon) coverIcon.style.display = "block";
    }

    const typeTxt = detailContainer.querySelector("#playlist-hero-type");
    const titleTxt = detailContainer.querySelector("#playlist-hero-title");

    if (typeTxt) {
        typeTxt.textContent = playlist.is_public
            ? "Danh sách phát công khai"
            : "Danh sách phát riêng tư";
    }
    if (titleTxt) {
        titleTxt.textContent = playlist.name || "Danh sách phát của tôi";
    }

    const hitsSection = document.querySelector(".hits-section");
    const albumsSection = document.querySelector(".albums-section");
    const artistsSection = document.querySelector(".artists-section");
    const artistDetailContainer = document.querySelector(".detail-container");

    if (hitsSection) hitsSection.style.display = "none";
    if (albumsSection) albumsSection.style.display = "none";
    if (artistsSection) artistsSection.style.display = "none";
    if (artistDetailContainer) artistDetailContainer.style.display = "none";

    detailContainer.style.display = "block";
}
