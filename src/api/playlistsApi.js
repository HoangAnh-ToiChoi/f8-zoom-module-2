import httpRequest from "../utils/httpRequest.js";

export async function getAllPlaylists() {
    return await httpRequest.get("playlists?limit=20&offset=0");
}

export async function getPlaylistById(playlistId) {
    return await httpRequest.get(`playlists/${playlistId}`);
}

export async function createPlaylist(data) {
    return await httpRequest.post("playlists", data);
}

export async function getMyPlaylist() {
    return await httpRequest.get("me/playlists");
}

export async function deletePlaylist(playlistId) {
    return await httpRequest.del(`playlists/${playlistId}`);
}
