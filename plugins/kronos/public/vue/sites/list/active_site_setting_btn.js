Vue.component('active-site-setting-btn', {
    props: ['site'],
    methods: {
        deleteSite: function () {
            this.$http.delete('/actions/admin/sites/delete/' + this.site.uid)
                .then((res) => this.$bus.$emit('show-success-message', res.message))
                .catch((err) => this.$bus.$emit('show-error-message', err.message));
        },
        deactivateSite: function () {
            console.log('Deactivating...');
            this.$http.post('/actions/admin/sites/deactivate/' + this.site.uid)
                .then((result) => this.$bus.$emit('show-modal', result.data))
                .catch((error) => this.$bus.$emit('show-error-message', error.message))
        },
        tokenJump: function () {
            let data = {}; // this has a token and should be on this or something
            let url = '//' + this.site.hostname + '/actions/admin/sites/token_login?callback=angular.callbacks._0&token=' + data.token;
            this.$http.jsonp(url)
                .then((result) => {
                    this.$bus.$emit('show-success-message', result.message);
                    setTimeout(() => window.location = `//${this.site.hostname}/kronos`, 1500);
                })
                .catch((err) => this.$bus.$emit('show-error-message', err.message));
        }
    },
    template: `
        <div class="btn-group site-setting-btn-group">
            <a class="btn btn-standard site-settings-btn" :href="'/kronos/sites/' + site.uid">
                <i class="fa fa-cog"></i>&nbsp;Edit Site
            </a>
            <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-sm fa-chevron-down"></i>
            </button>
            <ul class="dropdown-menu" role="menu">
                <li><a @click="deactivateSite"><i class="fa fa-fw fa-remove"></i>&nbsp;Deactivate</a></li>
            </ul>
        </div>
   `
});
