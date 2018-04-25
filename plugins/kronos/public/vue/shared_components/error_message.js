Vue.component('error-message', {
    created: function () {
        this.$bus.$on('show-error-message', (message) => this.updateMessage(message));
    },
    data: function () {
        return {
            message: ''
        };
    },
    methods: {
        updateMessage: function (message) {
            this.message = message;
        },
        clearMessage: function () {
            this.message = '';
        }
    },
    template: `
        <div v-if="message" class="alert alert-danger"> 
            <span>{{message}} </span><span class="alert-clear-btn" @click="clearMessage">X</span>
        </div>
    `
});
