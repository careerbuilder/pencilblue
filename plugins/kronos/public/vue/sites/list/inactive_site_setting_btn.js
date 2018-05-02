Vue.component('inactive-site-setting-btn', {
    props: ['site'],
    methods: {
        activateSite: function () {
            this.$http.post('/actions/admin/sites/activate/' + this.site.uid)
                .then((res) => this.$bus.$emit('show-modal', res.data))
                .catch((err) => this.$bus.$emit('show-error-message', err.message))
        },
        deleteSite: function () {
            this.$http.delete('/actions/admin/sites/delete/' + this.site.uid)
                .then((res) => this.$bus.$emit('show-success-message', res.message))
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
                <li><a @click="activateSite"><i class="fa fa-fw fa-plus"></i>&nbsp;Activate</a></li>
                <li><a @click="deleteSite"><i class="fa fa-fw fa-trash"></i>&nbsp;Delete</a></li>
            </ul>
        </div>
   `
});
