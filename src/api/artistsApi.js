import httpRequest from "../utils/httpRequest.js";

export async function getAllArtists() {
    return await httpRequest.get("artists?limit=20&offset=0");
}

export async function getArtistsById(id) {
    return await httpRequest.get(`artists/${id}`);
}

export async function followArtist(id) {
    return await httpRequest.post(`artists/${id}/follow`);
}

export async function unfollowArtist(id) {
    return await httpRequest.del(`artists/${id}/follow`);
}
