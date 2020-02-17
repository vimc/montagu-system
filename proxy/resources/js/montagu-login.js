//Logic class for logging in and out of Montagu
class MontaguLogin {

    constructor(montaguAuth, jwt_decode, pako) {
        this.montaguAuth = montaguAuth;
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

    login(email, password) {
        return this.montaguAuth.login(email, password)
            .then((data) => this.montaguLoginSuccess(data))
            .catch((jqXHR) => {
                throw MontaguLogin.montaguApiError(jqXHR)
            })
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