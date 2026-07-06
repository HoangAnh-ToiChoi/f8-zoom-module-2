import * as storage from "../utils/stogare.js";
import { login, currentUser } from "../api/authApi.js";
import { showError, clearError, LoginUI, logoutUI } from "../ui/authUI.js";

export async function checkAuthState() {
    const token = storage.getToken();
    const user = storage.getUser();
    if (token && user) {
        LoginUI(user);
        try {
            const { user } = await currentUser();
            if (user) {
                storage.setUser(user);
            }
        } catch (e) {
            storage.removeAccount();
            logoutUI();
        }
    } else {
        logoutUI();
    }
}

export async function handleLogin() {
    clearError("#loginForm");
    try {
        const email = document.querySelector("#loginEmail").value;
        const password = document.querySelector("#loginPassword").value;
        const { user, access_token } = await login({ email, password });
        storage.setToken(access_token);
        storage.setUser(user);
    } catch (error) {
        if (error.code === "EMAIL_EXISTS") {
            showError("#loginEmail", error.details.message);
        } else if (error.code === "VALIDATION_ERROR") {
            error.details.forEach((detail) => {
                if (detail.field === "email") {
                    showError("#loginEmail", detail.message);
                } else if (detail.field === "password") {
                    showError("#loginPassword", detail.message);
                }
            });
        }
    }
}

export function handleLogout() {
    storage.removeAccount();
    logoutUI();
}
