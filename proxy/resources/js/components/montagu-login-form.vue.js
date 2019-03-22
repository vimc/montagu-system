const MontaguLoginForm =  {
    props: ['username', 'loginError'],
    template: `<div v-if="!username">
                <p>You will need to log in to access the Portals or APIs.</p>
                <div>
                    <input id="email-input" name="email" placeholder="Email address" type="text" value=""/>
                    <input id="password-input" name="password" placeholder="Password" type="password" value="">
                    <button id="login-button" class="button" type="submit" v-on:click="$emit('login')">Log in</button>
                </div>
                <div id="login-error" class="text-danger">{{loginError}}</div>
             </div>`
}

if (typeof module !== 'undefined') module.exports = MontaguLoginForm;
