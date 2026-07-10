import httpRequest from "../utils/httpRequest.js";

export async function getAllPlaylists() {
    return await httpRequest.get("playlists?limit=20&offset=0");
}

export async function createPlaylist(data) {
    return await httpRequest.post("playlists", data);
}

export async function getMyPlaylist() {
    return await httpRequest.get("me/playlists");
}
