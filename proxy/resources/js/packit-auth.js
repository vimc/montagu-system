class PackitAuth {
    constructor(packitApiRoot, jwt_decode) {
        this.packitApiRoot = packitApiRoot;
        this.jwt_decode = jwt_decode;
    }

    login(montaguToken) {
        // This route configured in nginx for headers preauth login
        const loginUrl = this.packitApiRoot + "auth/login/montagu";
        return $.ajax({
            type: "GET",
            url: loginUrl,
            data,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${montaguToken}`
            }
        });
    }

    saveUser(loginResponse) {
        const token = loginResponse.token;
        const decoded = this.jwt_decode(token);
        const user = {
            token,
            exp: decoded.exp ?? 0,
            displayName: decoded.displayName ?? "",
            userName: decoded.userName ?? "",
            authorities: decoded.au ?? []
        };
        localStorage.setItem("user", JSON.stringify(user)); // TODO: don't save prototype!
    }

    deleteUser() {
        localStorage.removeItem("user");
    }

}