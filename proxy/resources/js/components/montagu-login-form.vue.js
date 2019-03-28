const MontaguLoginForm =  {
    props: ['username', 'loginError'],
    data() {
      return { email: "", password: ""}
    },
    template: `<div v-if="!username">
                <p>You will need to log in to access the Portals or APIs.</p>
                <div>
                    <input id="email-input" name="email" placeholder="Email address" type="text" v-model="email"/>
                    <input id="password-input" name="password" placeholder="Password" type="password" v-model="password"
                            v-on:keyup.enter="$emit('login', email, password)"/>
                    <button id="login-button" class="button" type="submit" v-on:click="$emit('login', email, password)">Log in</button>
                </div>
                <div id="login-error" class="text-danger">{{loginError}}</div>
             </div>`
}

if (typeof module !== 'undefined') module.exports = MontaguLoginForm;
