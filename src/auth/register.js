import { register as reg } from "../api/authApi.js";
import { showError, clearError } from "../ui/authUI.js";
import * as storage from "../utils/stogare.js";

export async function register() {
    clearError("#signupForm");
    try {
        const username = document.querySelector("#signupUsername").value;
        const email = document.querySelector("#signupEmail").value;
        const password = document.querySelector("#signupPassword").value;
        const confirmPassword = document.querySelector(
            "#signupConfirmPassword",
        ).value;
        const messagePassWord = validatePassWord(password);
        const messageConfirmPassWord = validateConfirmPassword(
            password,
            confirmPassword,
        );

        if (messagePassWord) {
            showError("#signupPassword", messagePassWord);
            return false;
        }
        if (messageConfirmPassWord) {
            showError("#signupConfirmPassword", messageConfirmPassWord);
            return false;
        }
        const { user, access_token } = await reg({ username, email, password });
        if (user && !user.username) {
            user.username = username;
        }
        storage.setToken(access_token);
        storage.setUser(user);
        return true;
    } catch (error) {
        if (error.code === "EMAIL_EXISTS") {
            showError("#signupEmail", error.message);
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

function validatePassWord(password) {
    if (password.length < 6) return "Password phải lớn hơn 6 ký tự";
    if (!/[A-Z]/.test(password)) return "Password phải có chữ hoa";
    if (!/[a-z]/.test(password)) return "Password phải có chữ thường";
    if (!/[0-9]/.test(password)) return "Password phải có chữ số";
    return "";
}

function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) return "Vui lòng nhập mật khẩu";
    if (password !== confirmPassword)
        return "Password và Confirm Password không trùng khớp";
    return "";
}
