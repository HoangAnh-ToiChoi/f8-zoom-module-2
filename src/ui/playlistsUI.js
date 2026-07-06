export function renderAllPlaylists(playlists) {
    const hitGird = document.querySelector(".hits-grid");
    try {
        playlists.forEach((playlist) => {
            const hitCard = document.createElement("div");

            hitCard.classList.add("hit-card");
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
