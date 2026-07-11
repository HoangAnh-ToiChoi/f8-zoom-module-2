export function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-card ${type}`;

    let icon = '<i class="fas fa-check-circle"></i>';
    if (type === "error") {
        icon = '<i class="fas fa-exclamation-circle"></i>';
    } else if (type === "info") {
        icon = '<i class="fas fa-info-circle"></i>';
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
            container.remove();
        }
    }, 3000);
}
