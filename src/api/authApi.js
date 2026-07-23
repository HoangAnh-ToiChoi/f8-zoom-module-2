import httpRequest from "../utils/httpRequest.js";

export async function register({ username, email, password }) {
    return await httpRequest.post("auth/register", {
        name: username,
        email,
        password,
    });
}

export async function login({ email, password }) {
    return await httpRequest.post("auth/login", { email, password });
}

export async function currentUser() {
    return await httpRequest.get("users/me");
}
