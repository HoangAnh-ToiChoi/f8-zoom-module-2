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
    
    const userMenu = document.querySelector(".user-menu");
    const userAvatarBtn = document.querySelector(".user-avatar");
    
    if (userMenu && userAvatarBtn) {
        const existingName = userMenu.querySelector(".username-display");
        if (existingName) {
            existingName.remove();
        }

        const nameSpan = document.createElement("span");
        nameSpan.classList.add("username-display");
        nameSpan.textContent = user.username || user.name || "";
        nameSpan.style.marginRight = "10px";
        nameSpan.style.fontWeight = "600";
        nameSpan.style.fontSize = "14px";
        nameSpan.style.color = "#ffffff";
        nameSpan.style.userSelect = "none";

        userMenu.insertBefore(nameSpan, userAvatarBtn);

        const avatarImg = userAvatarBtn.querySelector("img");
        if (avatarImg) {
            avatarImg.src = user.avatar || "./src/public/imgs/user.png";
        }
        userAvatarBtn.style.display = "block";
    }
}

export function logoutUI() {
    document.querySelector(".auth-buttons").style.display = "flex";
    const userMenu = document.querySelector(".user-menu");
    const userAvatarBtn = document.querySelector(".user-avatar");
    
    if (userMenu) {
        const existingName = userMenu.querySelector(".username-display");
        if (existingName) {
            existingName.remove();
        }
    }
    if (userAvatarBtn) {
        userAvatarBtn.style.display = "none";
        const avatarImg = userAvatarBtn.querySelector("img");
        if (avatarImg) {
            avatarImg.src = "./placeholder.svg?height=32&width=32";
        }
    }
}
