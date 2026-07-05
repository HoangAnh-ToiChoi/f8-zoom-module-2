import * as storage from "../utils/stogare.js";
import { login } from "../api/authApi.js";
import { showError, clearError } from "../ui/authUI.js";

export function checkAuthState() {
    const token = storage.getToken();
    const user = storage.getUser();
    if (token && user) {
        document.querySelector(".auth-buttons").style.display = "none";
        document.querySelector(".user-avatar img").src =
            user.avatar || "./src/public/imgs/user.png";
    } else {
        document.querySelector(".auth-buttons").style.display = "flex";
        document.querySelector(".user-avatar img").src =
            "../../placeholder.svg?height=32&width=32";
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
