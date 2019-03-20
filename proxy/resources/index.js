const montaguLogin = ( function() {

    const API_ROOT = "/api/v1/";
    const TOKEN_KEY = "accessToken";

    let montaguUserName;

    function updateLoginView(loggedIn = false) {
        let statusHtml, formHtml
        if (loggedIn) {
            statusHtml =
                `<span>Logged in as ${montaguUserName} |</span>
             <span id="logout-button"> Log out</span>`
            formHtml = '';

        }
        else {
            formHtml = `
        <div>You will need to log in to access the Portals or APIs.</div>
        <div>
            <input id="email-input" name="email" placeholder="Email address" type="text" value=""/>
            <input id="password-input" name="password" placeholder="Password" type="password" value="">
            <button id="login-button">Log in</button>
        </div>`

            statusHtml = '';
        }

        $(".login-status").html(statusHtml);
        $(".login-form").html(formHtml);

        $("#login-button").click(montaguLogin);
        $("#logout-button").click(montaguLogout);
    }

    function montaguLogin() {
        const email = $("#email-input").val();
        const password = $("#password-input").val()
        $.ajax({
            type: "POST",
            url: API_ROOT + "authenticate/",
            data: "grant_type=client_credentials",
            headers: {
                "Authorization": "Basic " + btoa(`${email}:${password}`),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            error: montaguApiError,
            success: montaguLoginSuccess
        });
    }

    function montaguLogout() {
        writeTokenToLocalStorage('');
        $.ajax({
            type: "GET",
            url: API_ROOT + "/logout/",
            error: montaguApiError,
            success: montaguLogoutSuccess
        });
    }

    function montaguApiError() {
        alert("api error");
    }

    function montaguLoginSuccess(data) {

        const token = data.access_token;
        const decodedToken = decodeToken(token);

        montaguUserName = decodedToken.sub;

        writeTokenToLocalStorage(token);

        //Call set-cookies to complete login
        $.ajax({
            type: "GET",
            url: API_ROOT + "set-cookies/",
            headers: {
                "Authorization": "Bearer " + token
            },
            error: montaguApiError,
            success: montaguSetCookiesSuccess
        });
    }

    function decodeToken(token) {
        const decoded = atob(token.replace(/_/g, '/').replace(/-/g, '+'));
        const inflated = pako.inflate(decoded, {to: 'string'});

        return jwt_decode(inflated);
    }

    function montaguLogoutSuccess(data) {
        updateLoginView(false);
    }

    function montaguSetCookiesSuccess(data) {
        updateLoginView(true);
    }

    function writeTokenToLocalStorage(token) {
        window.localStorage.setItem(TOKEN_KEY, token);
    }

    function readTokenFromLocalStorage() {
        return window.localStorage.getItem(TOKEN_KEY);
    }

    return {
        initialise: function () {
            let loggedIn = false;

            //Check if we are logged in
            const token = readTokenFromLocalStorage();
            if (token && token !== "null") {
                const decodedToken = decodeToken(token);

                //don't allow login if expiry is past
                const expiry = decodedToken.exp;
                const now = new Date().getTime() / 1000; //token exp doesn't include milliseconds

                if (expiry > now) {
                    loggedIn = true;
                    montaguUserName = decodedToken.sub;
                }
            }

            updateLoginView(loggedIn);
        }
    };

})();

$( document ).ready(function() {
    montaguLogin.initialise();
});