class MontaguLogin {

    constructor(montaguAuth) {
        this.TOKEN_KEY = "accessToken";
        this.montaguAuth = montaguAuth;
    }

    initialise() {
        let montaguUserName = ''

        //Check if we are logged in
        const token = this.readTokenFromLocalStorage();
        if (token && token !== "null") {
            const decodedToken = this.decodeToken(token);

            //don't allow login if expiry is past
            const expiry = decodedToken.exp;
            const now = new Date().getTime() / 1000; //token exp doesn't include milliseconds

            if (expiry > now) {
                montaguUserName = decodedToken.sub;
            }
        }

        return montaguUserName;
    }

    writeTokenToLocalStorage(token) {
        window.localStorage.setItem(this.TOKEN_KEY, token);
    }

    readTokenFromLocalStorage() {
        return window.localStorage.getItem(this.TOKEN_KEY);
    }

    decodeToken(token) {
        const decoded = atob(token.replace(/_/g, '/').replace(/-/g, '+'));
        const inflated = pako.inflate(decoded, {to: 'string'});

        return jwt_decode(inflated);
    }

    login(email, password) {
        return new Promise(
            ((resolve, reject) => {
                this.montaguAuth.login(email, password).then(

                    ((data) => { this.montaguLoginSuccess(data, resolve, reject); }).bind(this),

                    (jqXHR) => { MontaguLogin.montaguApiError(jqXHR, reject); }
                 );

            }).bind(this));
    }

    montaguLoginSuccess(data, resolve, reject) {

        const token = data.access_token;
        const decodedToken = this.decodeToken(token);

        const montaguUserName = decodedToken.sub;

        this.writeTokenToLocalStorage(token);

        this.montaguAuth.setCookies(token).then(
            () => { resolve(montaguUserName); },
            (jqXHR) => { MontaguLogin.montaguApiError(jqXHR, reject); }
        );
    }

    static montaguApiError( jqXHR, reject ) {
        let errorText;
        if (jqXHR && jqXHR.status === 401) {
            errorText = "Your email address or password is incorrect.";
        } else {
            errorText = "An error occurred.";
        }
       reject(errorText);
    }

    logout() {
        alert("logic logout");
    }
}