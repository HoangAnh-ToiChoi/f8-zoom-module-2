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

export function getUser() {
    const userStr = localStorage.getItem(keys.user);
    try {
        return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        return null;
    }
}

export function removeAccount() {
    localStorage.removeItem(keys.accessToken);
    localStorage.removeItem(keys.user);
}
