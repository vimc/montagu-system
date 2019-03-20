const API_ROOT = "/api/v1/"

var montaguUserName;

function updateLoginView(loggedIn=false){
    var statusHtml, formHtml
    if (loggedIn) {
        statusHtml =
            `<span>Logged in as ${montaguUserName} |</span>
             <span id="logout-button"> Log out</span>`
        formHtml = '';

    }
    else {
        formHtml = `
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
    $.ajax( {
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

    //inflate token
    const token = data.access_token;
    const decoded = atob(token.replace(/_/g, '/').replace(/-/g, '+'));
    const inflated = pako.inflate(decoded, {to: 'string'});

    //jwt decode token
    const jwtDecoded = jwt_decode(inflated);
    montaguUserName = jwtDecoded.sub;

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

function montaguLogoutSuccess(data) {
    updateLoginView(false);
}

function montaguSetCookiesSuccess(data) {
   updateLoginView(true);
}

$( document ).ready(function() {
    //TODO: Check login status
    updateLoginView();
});