import httpRequest from "../utils/httpRequest.js";

export async function getTracks() {
    return await httpRequest.get("tracks?limit=20&offset=0");
}
