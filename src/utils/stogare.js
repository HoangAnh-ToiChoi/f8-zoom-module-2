const keys = {
    accessToken: "accessToken",
    refreshToken: "refreshToken",
    user: "user",
};

export function setToken(token) {
    localStorage.setItem(keys.accessToken, token);
}

export function getToken() {
    return localStorage.getItem(keys.accessToken);
}

export function setUser(user) {
    localStorage.setItem(keys.user, JSON.stringify(user));
}

export function getUser(user) {
    return localStorage.getItem(keys.user, JSON.stringify(user));
}

export function removeAccount() {
    localStorage.removeItem(keys.accessToken);
    localStorage.removeItem(keys.user);
}
