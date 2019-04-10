const MontaguNewPassword =  {
    props: ['setPasswordSuccess', 'setPasswordError'],
    data() {
        return { password: ""}
    },
    template: `<div>
        <div v-if="!setPasswordSuccess">
            <form action="javascript:void(0);" v-on:submit="$emit('update-password', password)">
                <input id="password-input" name="password" placeholder="Password" type="password" v-model="password" 
                    minlength="8" required/>
                <button id="update-button" class="button" type="submit">
                    Update
                </button>
            </form>     
            <div id="set-password-error" class="text-danger">{{setPasswordError}}</div>     
        </div>     
        <div v-if="setPasswordSuccess" id="set-password-sucess">
            Thank you, your password has been updated. <a href="/">Click here</a> to return to Montagu.    
        </div>
</div>`
}

if (typeof module !== 'undefined') module.exports = MontaguNewPassword;