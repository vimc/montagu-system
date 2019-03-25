const montaguLogin = ( function() {




    let montaguUserName;

    /*function updateLoginView(loggedIn = false) {
        let statusHtml, formHtml
        if (loggedIn) {
            statusHtml =
                `<span>Logged in as ${montaguUserName} |</span>
             <span id="logout-button"> Log out</span>`
            formHtml = '';

        }
        else {
            formHtml = `
            <p>You will need to log in to access the Portals or APIs.</p>
            <div>
                <input id="email-input" name="email" placeholder="Email address" type="text" value=""/>
                <input id="password-input" name="password" placeholder="Password" type="password" value="">
                <button id="login-button" class="button" type="submit">Log in</button>
            </div>
            <div id="login-error" class="text-danger"></div>`

            statusHtml = '';
        }

        $(".login-status").html(statusHtml);
        $(".login-form").html(formHtml);

        $("#login-button").click(montaguLogin);
        $("#logout-button").click(montaguLogout);
    }*/

    /*function montaguLogin() {
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
    }*/

   /* function montaguLogout() {
        writeTokenToLocalStorage('');
        $.ajax({
            type: "GET",
            url: API_ROOT + "/logout/",
            error: montaguApiError,
            success: montaguLogoutSuccess
        });
    }*/

    /*function montaguApiError( jqXHR, textStatus, errorThrown ) {
        let errorText;
        if (jqXHR && jqXHR.status === 401) {
            errorText = "Your email address or password is incorrect.";
        } else {
            errorText = "An error occurred.";
        }
        $("#login-error").html(errorText);
    }*/

    /*function montaguLoginSuccess(data) {

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
    }*/

    function montaguLogoutSuccess(data) {
        updateLoginView(false);
    }

    /*function montaguSetCookiesSuccess(data) {
        updateLoginView(true);
    }*/

    return {
         /*initialise: function () {
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
        }*/
    };

})();

