/**
 * Helper to show detail view and hide homepage sections
 */
export function showDetailView() {
    const hitsSection = document.querySelector(".hits-section");
    const albumsSection = document.querySelector(".albums-section");
    const artistsSection = document.querySelector(".artists-section");
    const detailContainer = document.querySelector(".detail-container");

    if (hitsSection) hitsSection.style.display = "none";
    if (albumsSection) albumsSection.style.display = "none";
    if (artistsSection) artistsSection.style.display = "none";
    if (detailContainer) detailContainer.style.display = "block";
}

export function hideDetailView() {
    const hitsSection = document.querySelector(".hits-section");
    const albumsSection = document.querySelector(".albums-section");
    const artistsSection = document.querySelector(".artists-section");
    const detailContainer = document.querySelector(".detail-container");

    if (hitsSection) hitsSection.style.display = "block";
    if (albumsSection) albumsSection.style.display = "block";
    if (artistsSection) artistsSection.style.display = "block";
    if (detailContainer) detailContainer.style.display = "none";
}
