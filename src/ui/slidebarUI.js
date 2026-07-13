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
    detailContainer.setAttribute("data-user-id", playlist.user_id || "");

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
    const hitsSection = document.querySelector(".hits-section");
    const albumsSection = document.querySelector(".albums-section");
    const artistsSection = document.querySelector(".artists-section");

    if (hitsSection) hitsSection.style.display = "block";
    if (albumsSection) albumsSection.style.display = "block";
    if (artistsSection) artistsSection.style.display = "block";
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

    const activeTab = document.querySelector(".nav-tabs .nav-tab.active");
    const activeType = activeTab
        ? activeTab.getAttribute("data-type")
        : "playlists";

    items.forEach((item) => {
        const libraryItem = document.createElement("div");
        libraryItem.classList.add("library-item");
        libraryItem.setAttribute("data-id", item.id || "");
        libraryItem.setAttribute("data-type", item.type);

        const isMatch =
            (activeType === "playlists" && (item.type === "playlists" || item.type === "album")) ||
            (activeType === "artist" && item.type === "artist");
        if (!isMatch) {
            libraryItem.style.display = "none";
        }

        libraryItem.setAttribute(
            "data-user-username",
            item.user_username || "",
        );

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
            itemSubtitle.textContent = `Playlist • ${item.total_tracks || "0"} songs`;
        } else if (item.type === "artist") {
            itemSubtitle.textContent = "Artist";
        } else if (item.type === "album") {
            itemSubtitle.textContent = `Album • ${item.artist_name || "Unknown"}`;
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
                const event = new CustomEvent("artistClick", { detail: { id: item.id } });
                document.dispatchEvent(event);
            } else if (item.type === "album") {
                const event = new CustomEvent("albumClick", { detail: { id: item.id } });
                document.dispatchEvent(event);
            }
        });

        libraryContent.appendChild(libraryItem);
    });
}

export function addItemToSidebar(item) {
    const libraryContent = document.querySelector(".library-content");
    if (!libraryContent || !item) return;

    const id = item.id;
    const type = item.type;
    const titleText = item.name || item.title || "";
    const imgUrl =
        item.image_url || item.cover_image_url || "./placeholder.svg";

    const existItem = libraryContent.querySelector(
        `.library-item[data-id="${id}"][data-type="${type}"]`,
    );
    if (existItem) {
        const title = existItem.querySelector(".item-title");
        const img = existItem.querySelector(".item-image");
        if (title) title.textContent = titleText;
        if (img && imgUrl) {
            img.src = imgUrl;
            img.style.display = "block";
        }
        return;
    }

    const libraryItem = document.createElement("div");
    libraryItem.classList.add("library-item");
    libraryItem.setAttribute("data-id", id || "");
    libraryItem.setAttribute("data-type", type || "");

    const activeTab = document.querySelector(".nav-tabs .nav-tab.active");
    if (activeTab) {
        const activeType = activeTab.getAttribute("data-type");
        const isMatch =
            (activeType === "playlists" &&
                (type === "playlists" || type === "album")) ||
            (activeType === "artist" && type === "artist");
        if (!isMatch) {
            libraryItem.style.display = "none";
        }
    }

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = titleText;
    img.className = "item-image";
    if (type === "artist") {
        img.style.borderRadius = "50%";
    }
    img.onerror = () => {
        img.src = "./placeholder.svg";
    };
    libraryItem.appendChild(img);

    const itemInfo = document.createElement("div");
    itemInfo.classList.add("item-info");

    const itemTitle = document.createElement("div");
    itemTitle.classList.add("item-title");
    itemTitle.textContent = titleText;
    itemInfo.appendChild(itemTitle);

    const itemSubtitle = document.createElement("div");
    itemSubtitle.classList.add("item-subtitle");

    if (type === "playlists") {
        itemSubtitle.textContent = `Playlist • ${item.total_tracks || 0} songs`;
    } else if (type === "artist") {
        itemSubtitle.textContent = "Artist";
    } else if (type === "album") {
        itemSubtitle.textContent = `Album • ${item.artist_name || "Unknown"}`;
    }
    itemInfo.appendChild(itemSubtitle);
    libraryItem.appendChild(itemInfo);

    libraryItem.addEventListener("click", () => {
        document.querySelectorAll(".library-item").forEach((el) => {
            el.classList.remove("active");
        });
        libraryItem.classList.add("active");

        if (type === "playlists") {
            renderPlaylistDetail(item);
        } else if (type === "artist") {
            const event = new CustomEvent("artistClick", {
                detail: { id: id },
            });
            document.dispatchEvent(event);
        } else if (type === "album") {
            const event = new CustomEvent("albumClick", { detail: { id: id } });
            document.dispatchEvent(event);
        }
    });

    libraryContent.appendChild(libraryItem);
}

export function addPlaylistToSidebar(playlist) {
    addItemToSidebar({ ...playlist, type: "playlists" });
}

export function addArtistToSidebar(artist) {
    addItemToSidebar({ ...artist, type: "artist" });
}

export function addAlbumToSidebar(album) {
    addItemToSidebar({ ...album, type: "album" });
}
