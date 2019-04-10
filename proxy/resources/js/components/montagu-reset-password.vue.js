const MontaguResetPassword =  {
    props: ['email', 'showAcknowledgement'],
    template: `<div>
        <form action="javascript:void(0);" v-on:submit="$emit('request-reset-link', email)">
            <input id="email-input" name="email" placeholder="Email address" type="email" v-model="email" required/>
            <button id="request-button" class="button" type="submit">
                Request password reset email
            </button>
        </form>               
        <div v-if="showAcknowledgement" id="show-acknowledgement-text" class="alert alert-info rounded-0">
            Thank you. If we have an account registered for this email address you will receive a reset password link.    
        </div>
</div>`
}

if (typeof module !== 'undefined') module.exports = MontaguResetPassword;