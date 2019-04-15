Vue = typeof(Vue) === 'undefined' ? require("vue/dist/vue.js") : Vue;

const MontaguResetPasswordComponent = Vue.extend( {
    props: ['utils', 'passwordApi'],
    data: function() {
        return {
            email: this.utils.paramFromQueryString(location.search, "email"),
            showAcknowledgement: false,
            resetPasswordError: ""
        }
    },
    methods: {
        requestResetLink: function() {
            this.passwordApi.requestResetLink(this.email).then(
                () => {
                    this.showAcknowledgement = true;
                    this.resetPasswordError = "";
                },
                (jqXHR) => {
                    this.resetPasswordError = "An error occurred";
                }
            );
        }
    },
    template: `<div>
        <form action="javascript:void(0);" v-on:submit="requestResetLink">
            <input id="email-input" name="email" placeholder="Email address" type="email" v-model="email" required/>
            <button id="request-button" class="button" type="submit">
                Request password reset email
            </button>
        </form>     
        <div id="reset-password-error" class="text-danger">{{resetPasswordError}}</div>          
        <div v-if="showAcknowledgement" id="show-acknowledgement-text" class="alert alert-info rounded-0">
            Thank you. If we have an account registered for this email address you will receive a reset password link.    
        </div>
    </div>`
});

Vue.component("montagu-reset-password", MontaguResetPasswordComponent);

if (typeof module !== 'undefined') module.exports = MontaguResetPasswordComponent;
