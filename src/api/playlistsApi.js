import httpRequest from "../utils/httpRequest.js";

export async function getAllPlaylists() {
    return await httpRequest.get("playlists?limit=20&offset=0");
}
