Vue.component('site-routing-form', {
   props: ['site'],
   data: function () {
        return {
            _site: this.site
        }
   },
    methods: {

    },
    template: `
        <div class="site-routing-row">
            <label>Display Name</label>
            <input class="form-control" v-model="site.displayName">
            <label>Hostname</label>
            <input class="form-control" v-model="site.hostname">
        </div>
        `
});
