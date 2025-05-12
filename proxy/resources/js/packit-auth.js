// The local storage key which packit uses to store its current user details
const USER_KEY = "user";

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
            headers: {
                "Authorization": `Bearer ${montaguToken}`
            }
        });
    }

    isLoggedIn() {
        return !!localStorage.getItem(USER_KEY);
    }

    // Save packit user details to local storage where packit will find them
    saveUser(loginResponse) {
        const token = loginResponse.token;
        const decoded = this.jwt_decode(token);
        const user = {
            token,
            exp: decoded.exp || 0,
            displayName: decoded.displayName || "",
            userName: decoded.userName || "",
            authorities: decoded.au || []
        };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    deleteUser() {
        localStorage.removeItem(USER_KEY);
    }
}

if (typeof module !== 'undefined') module.exports = PackitAuth;