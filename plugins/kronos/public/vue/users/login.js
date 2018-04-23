Vue.component('loginForm', {
    data: function () {
        return {
            defaultGlobalErrorMessage: 'Sorry, an error occurred.  Please try again later.',
            username: '',
            usernameError: '',
            password: '',
            passwordError: '',
            globalError: ''
        }
    },
    props: ['postQuery'],
    methods: {
        login: function () {
            this.usernameError = this.username && this.username.length >= 2 ? '' : 'Username is not long enough';
            this.passwordError = this.password ? '' : 'Password is required';

            if(this.passwordError || this.usernameError) {
                return;
            }
            this.$http.post('/actions/kronos/login' + (this.postQuery || ''), {
                username: this.username,
                password: this.password
            }).then((result) => {
                let data = result.data || {};
                if(data.url) {
                    return window.location.href = result.data.url;
                }
                this.globalError = data.error || this.defaultGlobalErrorMessage;
            }).catch(() => {
                this.globalError = this.defaultGlobalErrorMessage;
            });
        }
    },
    template: `
        <div class="login-form">
            <span :if="globalError" class="error global-error"> {{globalError}}</span>
            <label>Username or email address</label>
            <input class="form-control input-field" :class="{'error': usernameError}" v-model="username" required>
            <span class="error">{{usernameError}}</span>
            <label>Password</label>
            <input class="form-control input-field" :class="{'error': passwordError}" type="password" v-model="password" required>
            <span :if="passwordError" class="error">{{passwordError}}</span>
            <button class="btn login-btn" v-on:click="login">Login</button>
        </div>
   `
});
