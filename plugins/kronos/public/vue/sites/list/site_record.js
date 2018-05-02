Vue.component('site-record', {
    props: ['site', 'siteType'],
    data: function () {
        return {
            _site: this.site,
            _siteType: this.siteType,
            _searchTerm: ''
        };
    },
    methods: {
        authUserToSite: function () {
            this.$http.post(`/actions/admin/sites/auth_token/${encodeURIComponent(this.site.uid)}`)
                .then((res) => {
                    this.$bus.$emit('show-success-message', res.data.message);
                    this._handleTokenCreation(res.data.data);
                })
                .catch((err) => this.$bus.$emit('show-error-message', err.message));
        },
        _handleTokenCreation: function (data) {
            let url = '//' + this.site.hostname + '/actions/admin/sites/token_login?token=' + data.token;
            this.$http.jsonp(url)
                .then((result) => {
                    this.$bus.$emit('show-success-message', result.data.message);
                    setTimeout(() => window.location = `//${this.site.hostname}/kronos`, 1500);
                })
                .catch((err) => this.$bus.$emit('show-error-message', err.message));
        }
    },
    template: `
        <tr>
            <td class="simulated-link" @click="authUserToSite">{{site.displayName}}</td>
            <td>{{site.hostname}}</td>
            <td>{{site.created | format-date}}</td>
            <td class="setting-column">
                <active-site-setting-btn v-if="siteType === 'active'" :site="site"></active-site-setting-btn>
                <inactive-site-setting-btn v-if="siteType === 'inactive'" :site="site"></inactive-site-setting-btn>
            </td>
        </tr>
    `
});
