import httpRequest from "../utils/httpRequest.js";

export async function getAllArtists() {
    return await httpRequest.get("artists?limit=20&offset=0");
}

export async function getArtistsById(id) {
    return await httpRequest.get(`artists/${id}`);
}
