Vue = typeof(Vue) === 'undefined' ? require("vue/dist/vue.js") : Vue;

const MontaguNewPasswordComponent =  Vue.extend( {
    props: ['utils', 'passwordApi', 'loginLogic'],
    data: function() {
        const token = this.utils.paramFromQueryString(location.search, "token");
        const tokenIsValid = this.loginLogic.tokenHasNotExpired(this.loginLogic.decodeToken(token));
        return {
            password: "",
            token: token,
            tokenIsValid: tokenIsValid,
            setPasswordSuccess: false,
            setPasswordError: ""
        }
    },
    methods: {
        updatePassword: function() {
            this.passwordApi.setPassword(this.password, this.token).then(
                () => {
                    this.setPasswordSuccess= true;
                },
                (jqXHR) => {
                    this.setPasswordSuccess = false;
                    this.setPasswordError = "An error occurred";
                }
            );
        }
    },
    template: `<div>
        <div v-if="tokenIsValid" id="token-valid">
            <div v-if="!setPasswordSuccess">
                <form action="javascript:void(0);" v-on:submit="updatePassword">
                    <input id="password-input" name="password" placeholder="Password" type="password" v-model="password" 
                        minlength="8" required/>
                    <button id="update-button" class="button" type="submit">
                        Update
                    </button>
                </form>     
                <div id="set-password-error" class="text-danger">{{setPasswordError}}</div>     
            </div>     
            <div v-if="setPasswordSuccess" id="set-password-success">
                Thank you, your password has been updated. <a id="set-password-success-link" href="/">Click here</a> to return to Montagu.    
            </div>
        </div>
        <div v-if="!tokenIsValid" id="token-invalid">
            <div id="token-invalid-text" class="alert alert-warning rounded-0">
                This password reset link has expired. Please request a new one.  
            </div>
            <div>
                <a href="reset-password" id="request-new-reset-link-button" class="button"">Request new reset password link</a>
            </div>
        </div>
</div>`
});

Vue.component("montagu-new-password", MontaguNewPasswordComponent);

if (typeof module !== 'undefined') module.exports = MontaguNewPasswordComponent;