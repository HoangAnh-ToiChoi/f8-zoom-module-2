import httpRequest from "../utils/httpRequest.js";

export async function getTracks() {
    return await httpRequest.get("tracks?limit=20&offset=0");
}

export async function getTrackByID(id) {
    return await httpRequest.get(`tracks/${id}`);
}
