class HttpRequest {
    constructor() {
        this.baseUrl = "https://spotify.f8team.dev/api/";
    }

    async _send(path, method, data, options = {}) {
        try {
            const _option = {
                method: method,
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
            };

            if (data) {
                _option.body = JSON.stringify(data);
            }

            const token = localStorage.getItem("accessToken");
            if (token) {
                _option.headers.Authorization = `Bearer ${token}`;
            }

            const res = await fetch(`${this.baseUrl}${path}`, _option);

            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("user");
                    throw {
                        code: "UNAUTHORIZED",
                        message:
                            "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!",
                    };
                }
                const errorText = await res.json().catch(() => {});
                throw errorText.error;
            }

            const response = await res.json();
            return response;
        } catch (error) {
            throw error;
        }
    }

    async get(path, options) {
        return await this._send(path, "GET", null, options);
    }

    async post(path, data, options) {
        return await this._send(path, "POST", data, options);
    }

    async put(path, data, options) {
        return await this._send(path, "PUT", data, options);
    }

    async patch(path, data, options) {
        return await this._send(path, "PATCH", data, options);
    }

    async del(path, options) {
        return await this._send(path, "DELETE", null, options);
    }
}

const httpRequest = new HttpRequest();

export default httpRequest;
