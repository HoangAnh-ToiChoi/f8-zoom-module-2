export function showLibraryFilter(e) {
    const sreachLibrary = document.querySelector(".search-library");
    const libraryFilterDropdown = document.querySelector(
        ".library-filter-dropdown",
    );

    if (libraryFilterDropdown) libraryFilterDropdown.classList.toggle("active");

    // const rect = sreachLibrary.getBoundingClientRect();
    // const right = rect.width - (e.clientX - rect.left);
    // const top = e.clientY - rect.top;

    // libraryFilterDropdown.style.right = `${right}px`;
    // libraryFilterDropdown.style.top = `${top}px`;
}

export function hideLibraryFilter() {
    const libraryFilterDropdown = document.querySelector(
        ".library-filter-dropdown",
    );
    if (libraryFilterDropdown) libraryFilterDropdown.classList.remove("active");
}

export function showPlaylistDetail() {
    const hitsSection = document.querySelector(".hits-section");
    const albumsSection = document.querySelector(".albums-section");
    const artistsSection = document.querySelector(".artists-section");
    const playlistModal = document.querySelector(".playlist-detail-container");

    if (hitsSection) hitsSection.style.display = "none";
    if (albumsSection) albumsSection.style.display = "none";
    if (artistsSection) artistsSection.style.display = "none";
    if (playlistModal) playlistModal.style.display = "block";
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
            let finalUrl = playlist.image_url;
            if (finalUrl.startsWith("/")) {
                finalUrl = `https://spotify.f8team.dev${finalUrl}`;
            }

            coverImg.src = finalUrl;
            coverImg.style.display = "block";

            coverImg.onerror = () => {
                coverImg.style.display = "none";
                if (coverIcon) coverIcon.style.display = "block";
            };
        }
        if (coverIcon) coverIcon.style.display = "none";
    } else {
        if (coverImg) coverImg.style.display = "none";
        if (coverIcon) coverIcon.style.display = "block";
    }

    const typeTxt = detailContainer.querySelector("#playlist-hero-type");
    const titleTxt = detailContainer.querySelector("#playlist-hero-title");
    const descTxt = detailContainer.querySelector("#playlist-hero-desc");

    if (typeTxt) {
        typeTxt.textContent = playlist.is_public
            ? "Danh sách phát công khai"
            : "Danh sách phát riêng tư";
    }
    if (titleTxt) {
        titleTxt.textContent = playlist.name || "Danh sách phát của tôi";
    }
    if (descTxt) {
        if (playlist.description) {
            descTxt.textContent = playlist.description;
            descTxt.style.display = "block";
        } else {
            descTxt.style.display = "none";
        }
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

export function hidePlaylistDetail() {
    const playlistModal = document.querySelector(".playlist-detail-container");
    if (playlistModal) playlistModal.style.display = "none";
}

export function showPlaylistEditModal() {
    const playlistModal = document.querySelector("#playlist-edit-modal");
    const inputName = document.querySelector("#playlist-name-input");
    const des = document.querySelector("#playlist-desc-input");
    inputName.value = "";
    des.value = "";

    if (playlistModal) {
        playlistModal.style.display = "flex";
    }
}
export function hidePlaylistEditModal() {
    const playlistModal = document.querySelector("#playlist-edit-modal");
    if (playlistModal) playlistModal.style.display = "none";
}

export function renderLibrary(items) {
    const libraryContent = document.querySelector(".library-content");
    if (!libraryContent || !items) return;

    libraryContent.innerHTML = "";

    items.forEach((item) => {
        const libraryItem = document.createElement("div");
        libraryItem.classList.add("library-item");
        libraryItem.setAttribute("data-id", item.id || "");
        libraryItem.setAttribute("data-type", item.type);

        if (item.type === "liked") {
            const iconDiv = document.createElement("div");
            iconDiv.className = "item-icon liked-songs";
            iconDiv.innerHTML = '<i class="fas fa-heart"></i>';
            libraryItem.appendChild(iconDiv);
        } else {
            const img = document.createElement("img");
            img.src = item.image_url || "./placeholder.svg";
            img.alt = item.name;
            img.className = "item-image";

            if (item.type === "artist") {
                img.style.borderRadius = "50%";
            }

            img.onerror = () => {
                img.src = "./placeholder.svg";
            };
            libraryItem.appendChild(img);
        }

        const itemInfo = document.createElement("div");
        itemInfo.classList.add("item-info");

        const itemTitle = document.createElement("div");
        itemTitle.classList.add("item-title");
        itemTitle.textContent = item.name;
        itemInfo.appendChild(itemTitle);

        const itemSubtitle = document.createElement("div");
        itemSubtitle.classList.add("item-subtitle");

        if (item.type === "liked") {
            itemSubtitle.innerHTML =
                '<i class="fas fa-thumbtack" style="color: var(--accent-primary); margin-right: 4px;"></i> Playlist • 3 songs';
        } else if (item.type === "playlists") {
            itemSubtitle.textContent = `Playlist • ${item.user_username || "Han"}`;
        } else if (item.type === "artist") {
            itemSubtitle.textContent = "Artist";
        }
        itemInfo.appendChild(itemSubtitle);
        libraryItem.appendChild(itemInfo);

        libraryItem.addEventListener("click", () => {
            document.querySelectorAll(".library-item").forEach((el) => {
                el.classList.remove("active");
            });
            libraryItem.classList.add("active");

            if (item.type === "playlists") {
                renderPlaylistDetail(item);
            } else if (item.type === "artist") {
                console.log("Click Artist:", item.id);
            }
        });

        libraryContent.appendChild(libraryItem);
    });
}

export function addPlaylistToSidebar(playlist) {
    const libraryContent = document.querySelector(".library-content");
    if (!libraryContent || !playlist) return;

    const existItem = libraryContent.querySelector(
        `.library-item[data-id="${playlist.id}"]`,
    );
    if (existItem) {
        const title = existItem.querySelector(".item-title");
        const img = existItem.querySelector(".item-image");
        if (title) title.textContent = playlist.name;
        if (img && playlist.image_url) {
            img.src = playlist.image_url;
            img.style.display = "block";
        }
        return;
    }

    const libraryItem = document.createElement("div");
    libraryItem.classList.add("library-item");
    libraryItem.setAttribute("data-id", playlist.id || "");
    libraryItem.setAttribute("data-type", "playlists");

    const img = document.createElement("img");
    img.src = playlist.image_url || "./placeholder.svg";
    img.alt = playlist.name;
    img.className = "item-image";
    img.onerror = () => {
        img.src = "./placeholder.svg";
    };
    libraryItem.appendChild(img);

    const itemInfo = document.createElement("div");
    itemInfo.classList.add("item-info");

    const itemTitle = document.createElement("div");
    itemTitle.classList.add("item-title");
    itemTitle.textContent = playlist.name;
    itemInfo.appendChild(itemTitle);

    const itemSubtitle = document.createElement("div");
    itemSubtitle.classList.add("item-subtitle");
    itemSubtitle.textContent = `Playlist • ${playlist.user_username || "Han"}`;
    itemInfo.appendChild(itemSubtitle);

    libraryItem.appendChild(itemInfo);

    libraryItem.addEventListener("click", () => {
        document.querySelectorAll(".library-item").forEach((el) => {
            el.classList.remove("active");
        });
        libraryItem.classList.add("active");
        renderPlaylistDetail(playlist);
    });

    libraryContent.appendChild(libraryItem);
}
