const MontaguResetPassword =  {
    props: ['email', 'showAcknowledgement'],
    template: `<div>
        <input id="email-input" name="email" placeholder="Email address" type="text" v-model="email"/>
        <button id="request-button" class="button" type="submit" v-on:click="$emit('request-reset-link', email)">
            Request password reset email
        </button>
                       
        <div v-if="showAcknowledgement" id="show-acknowledgement-text" class="alert alert-info rounded-0">
            Thank you. If we have an account registered for this email address you will receive a reset password link.    
        </div>
</div>`
}

if (typeof module !== 'undefined') module.exports = MontaguResetPassword;