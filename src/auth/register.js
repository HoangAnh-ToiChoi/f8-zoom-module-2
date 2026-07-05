import { register as reg } from "../api/authApi.js";
import { showError, clearError } from "../ui/authUI.js";
import * as storage from "../utils/stogare.js";

export async function register() {
    clearError("#signupForm");
    try {
        const email = document.querySelector("#signupEmail").value;
        const password = document.querySelector("#signupPassword").value;
        const { user, access_token } = await reg({ email, password });
        storage.setToken(access_token);
        storage.setUser(user);
    } catch (error) {
        if (error.code === "EMAIL_EXISTS") {
            showError("#signupEmail", error.details.message);
        } else if (error.code === "VALIDATION_ERROR") {
            error.details.forEach((detail) => {
                if (detail.field === "email") {
                    showError("#signupEmail", detail.message);
                } else if (detail.field === "password") {
                    showError("#signupPassword", detail.message);
                }
            });
        }
    }
}
