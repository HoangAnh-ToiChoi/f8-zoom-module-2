export function showError(inputSelector, message = "success") {
    const input = document.querySelector(inputSelector);
    if (!input) return;
    const formGroup = input.closest(".form-group");
    formGroup.classList.add("invalid");

    const errorContent = formGroup.querySelector(".error-message span");
    if (errorContent) errorContent.textContent = message;
}

export function clearError(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const formInvalid = form.querySelectorAll(".form-group.invalid");

    if (formInvalid) {
        formInvalid.forEach((element) => {
            element.classList.remove("invalid");
        });
    }
}

export function LoginUI(user) {
    document.querySelector(".auth-buttons").style.display = "none";
    document.querySelector(".user-avatar img").src =
        user.avatar || "./src/public/imgs/user.png";
}

export function logoutUI() {
    document.querySelector(".auth-buttons").style.display = "flex";
    document.querySelector(".user-avatar img").src =
        "./placeholder.svg?height=32&width=32";
}
