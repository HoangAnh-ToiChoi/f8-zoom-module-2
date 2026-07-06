import httpRequest from "../utils/httpRequest.js";

export async function getAllAlbums() {
    return await httpRequest.get("albums?limit=20&offset=0");
}

export async function getAlbumById(id) {
    return await httpRequest.get(`albums/${id}`);
}
