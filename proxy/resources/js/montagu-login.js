//Logic class for logging in and out of Montagu
class MontaguLogin {

    constructor(montaguAuth, packitAuth, jwt_decode, pako) {
        this.montaguAuth = montaguAuth;
        this.packitAuth = packitAuth;
        this.jwt_decode = jwt_decode;
        this.pako = pako;
    }

    getUserName() {
        return this.montaguAuth.getUserDetails().then((result) => {
            if (result.status === "success") {
                return result.data.username
            }
            else {
                return ''
            }
        }).catch(() => {
            return ''
        })
    }

    tokenHasNotExpired(decodedToken) {
        const expiry = decodedToken.exp;
        const now = new Date().getTime() / 1000; //token exp doesn't include milliseconds
        return expiry > now
    }

    // Logs into Montagu and returns the username
    async login(email, password) {
        let responseData, username;
        try {
            responseData = await this.montaguAuth.login(email, password);
            username = await this.montaguLoginSuccess(responseData);
        } catch (jqXHR) {
            throw MontaguLogin.montaguApiError(jqXHR)
        }
        const montaguToken = responseData.access_token;
        // Allow possibility for Montagu login to succeed but Packit login to fail - do not throw error,
        // preventing Montagu login, but do return packitLoginError to be displayed
        let packitLoginError = '';
        try {
            const packitUser = await this.packitAuth.login(montaguToken)
            this.packitAuth.saveUser(packitUser);
        } catch(jqXHR) {
            packitLoginError = 'Montagu login succeeded, but Packit login failed.'
        }

        return {username, packitLoginError};
    }

    montaguLoginSuccess(data) {
        const token = data.access_token;

        return this.montaguAuth.setCookies(token).then(
            () => {
                const decodedToken = this.decodeToken(token);
                return decodedToken.sub;
            }
        );
    }

    logout() {
        // Logout of packit by deleting token from storage
        this.packitAuth.deleteUser();
        return this.montaguAuth.logout()
            .catch((jqXHR) => {
                throw MontaguLogin.montaguApiError(jqXHR)
            })
    }

    decodeToken(token) {
        const decoded = atob(token.replace(/_/g, '/').replace(/-/g, '+'));
        const inflated = this.pako.inflate(decoded, {to: 'string'});

        return this.jwt_decode(inflated);
    }

    static montaguApiError(jqXHR) {
        let errorText;
        if (jqXHR && jqXHR.status === 401) {
            errorText = "Your email address or password is incorrect.";
        } else {
            errorText = "An error occurred.";
        }
        return errorText;
    }

}

if (typeof module !== 'undefined') module.exports = MontaguLogin;