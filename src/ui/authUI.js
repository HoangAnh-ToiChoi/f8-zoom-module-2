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
