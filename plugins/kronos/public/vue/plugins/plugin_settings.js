Vue.component('plugin-settings', {
    props: ['pluginUid', 'settings'],
    data: function () {
        return {
            _settings: this.settings
        }
    },
    methods: {
        submit: function () {
            this.$http.post(`/actions/kronos/plugins/${this.pluginUid}/settings`, {settings: this.settings})
                .then((resp) => {
                    this.$bus.$emit('show-success-message', {message: resp.data, refresh: true});
                })
                .catch((err) => {
                    this.$bus.$emit('show-error-message', err.data);
                });
        }
    },
    template: `
        <div class="admin-plugin-settings-list">
            <div v-for="setting in settings">
                <setting-group-header :setting="setting" v-if="setting.isHeading && setting.heading !== 'Default'"></setting-group-header>
                <text-setting :setting="setting" v-if="setting.type === 'text'"></text-setting>
                <boolean-setting :setting="setting" v-if="setting.type === 'checkbox'"></boolean-setting>
            </div>
            <hr> 
            <div class="admin-plugin-setting-control-bar">
                <a class="btn btn-default" href="/kronos/plugins">
                    <i class="fa fa-ban"></i>&nbsp;Cancel
                </a>
                <a class="btn btn-save" @click="submit">
                    <i class="fa fa-save" ng-class="{'fa-save': !saving, 'fa-circle-o-notch fa-spin': saving}"></i>&nbsp;Save
                </a>
            </div>   
        </div>
    `
});
