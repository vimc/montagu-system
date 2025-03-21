class PackitAuth {
    constructor(packitApiRoot, jwt_decode) {
        this.packitApiRoot = packitApiRoot;
        this.jwt_decode = jwt_decode;
    }

    // TODO: We should be using Authorization header here instead, like Montagu does - update after mrc-5176
    login(email, password) {
        const data = JSON.stringify({email, password});
        const loginUrl = this.packitApiRoot + "auth/login/basic"; // TODO; has this changed?
        return $.ajax({
            type: "POST",
            url: loginUrl,
            data,
            headers: {
                "Content-Type": "application/json"
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
            userName: decoded.userName ?? ""
        };
        // TODO: has this changed?
        localStorage.setItem("user", JSON.stringify(user)); // TODO: don't save prototype!
    }

    deleteUser() {
        localStorage.removeItem("user");
    }

}