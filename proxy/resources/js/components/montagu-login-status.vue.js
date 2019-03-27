const MontaguLoginStatus =  {
    props: ['username'],
    template: `<span v-if="username">Logged in as {{username}} |<span 
                  id="logout-button" v-on:click="$emit('logout')"> Log out</span>
               </span>`
}

if (typeof module !== 'undefined') module.exports = MontaguLoginStatus;
