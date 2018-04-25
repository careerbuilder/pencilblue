Vue.component('success-message', {
    created: function () {
        this.$bus.$on('show-success-message', (params) => this.updateMessage(params));
    },
    data: function () {
        return {
            message: ''
        };
    },
    methods: {
        updateMessage: function (params = {}) {
            this.message = params.message || params;
            setTimeout(() => params.refresh ? this.refreshPage() : this.clearMessage(), 2000);
        },
        clearMessage: function () {
          this.message = '';
        }
    },
    template: `
        <transition name="fade">
            <div v-if="message" class="alert alert-success"> 
                <span>{{message}} </span> <span class="alert-clear-btn" @click="clearMessage">X</span>
            </div>
        </transition>
    `
});
