const MontaguLoginForm =  {
    props: ['username', 'loginError', 'redirectMessage'],
    data() {
      return { email: "", password: ""}
    },
    template: `<div>
                <div v-if="!username">
                    <p>You will need to log in to access the Portals or APIs.</p>
                    <div>
                        <input id="email-input" name="email" placeholder="Email address" type="text" v-model="email"/>
                        <input id="password-input" name="password" placeholder="Password" type="password" v-model="password"
                                v-on:keyup.enter="$emit('login', email, password)"/>
                        <button id="login-button" class="button" type="submit" v-on:click="$emit('login', email, password)">Log in</button>
                    </div>
                    <div id="login-error" class="text-danger">{{loginError}}</div>
                    <div id="reset-password">
                        Forgotten your password? <a id="reset-password-link" v-bind:href="'reset-password?email='+email">Click here</a>
                    </div>
                 </div>
                 <div v-if="redirectMessage" id="redirect-message" v-html="redirectMessage" class="alert alert-warning rounded-0"></div>
             </div>`
}

if (typeof module !== 'undefined') module.exports = MontaguLoginForm;
