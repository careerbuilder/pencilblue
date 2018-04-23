Vue.component('plugin-installed-options', {
    props: ['plugin', 'isActive'],
    methods: {
        resetSettings: function () {
            this.$http.post("/api/plugins/reset_settings/" + encodeURIComponent(this.plugin.uid))
                .then(() => window.location.refresh())
                .catch((error) => alert(error));
        },
        initializePlugin: function () {
            this.$http.post("/api/plugins/initialize/" + encodeURIComponent(this.plugin.uid))
                .then(() => window.location.refresh())
                .catch((error) => alert(error));
        },
        uninstallPlugin: function () {
            this.$http.post("/api/plugins/uninstall/" + encodeURIComponent(this.plugin.uid))
                .then((result) => {
                    let jobId = result.data;
                    this.$bus.$emit('show-modal', jobId);
                })
                .catch((error) => alert(error));
        }
    },
    template: `
        <div class="btn-group plugin-setting-btn-group">
            <a class="plugin-settings-btn" :href="'/kronos/plugins/' + plugin.uid + '/settings'">
                <i class="fa fa-cog"></i>&nbsp;Settings
            </a>
            <button type="button" class="btn btn-sm btn-default dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-sm fa-chevron-down"></i>
            </button>
            <ul class="dropdown-menu" role="menu">
                <li><a v-on:click="resetSettings"><i class="fa fa-fw fa-refresh"></i>&nbsp;Reset Settings</a></li>
                <li><a v-on:click="initializePlugin" v-if="!isActive"><i class="fa fa-fw fa-check"></i>&nbsp;Initialize</a></li>
                <li><a v-on:click="uninstallPlugin"><i class="fa fa-fw fa-ban"></i>&nbsp;Uninstall</a></li>
            </ul>
        </div>
    `
});

Vue.component('plugin-info-row', {
    props: ['plugin', 'settingState'],
    template: `
        <tr>        
            <td class="plugin-name-column regular"><a :href="'/kronos/plugins/' + plugin.uid">{{plugin.uid}}</a></td>
            <td></td>
            <td class="plugin-date-column">{{plugin.created | format-date}}</td>
            <td class="plugin-settings-column">
                <plugin-installed-options v-if="settingState === 'active'" :plugin="plugin" :isActive="true"></plugin-installed-options>
                <plugin-installed-options v-if="settingState === 'inactive'" :plugin="plugin" :isActive="false"></plugin-installed-options>
                <plugin-available-options v-if="settingState === 'available'" :plugin="plugin"></plugin-available-options>
            </td>
        </tr>
   `
});

Vue.component('plugin-uninstalled-info-row', {
    props: ['plugin'],
    methods: {
        install: function () {
            this.$http.post("/api/plugins/install/" + encodeURIComponent(this.plugin.uid))
                .then((result) => {
                    let jobId = result.data;
                    this.$bus.$emit('show-modal', jobId);
                })
                .catch((error) => alert(error));
        }
    },
    template: `
        <tr>
            <td class="plugin-name-column uninstall"><a :href="'/kronos/plugins/' + plugin.uid">{{plugin.uid}}</a></td>
            <td></td>
            <td class="plugin-description-column">{{plugin.description}}</td>
            <td class="plugin-settings-column">
                <div class="btn-group plugin-setting-btn-group">
                    <a class="plugin-settings-btn" v-on:click="install">
                        <span class="fa fa-hdd-o"></span>&nbsp;Install
                    </a>
                </div>
            </td>
        </tr>
   `
});
Vue.component('plugin-grid', {
    props: ['pluginList', 'listTitle', 'settingState'],
    template: `
   <div class="plugin-grid panel panel-default">
        <div class="panel-heading">
            {{listTitle}}&nbsp;
            <i class="fa fa-info-circle" data-toggle="tooltip" data-placement="bottom"></i>
        </div>
        <table class="table">
            <thead>
                <tr>                
                    <th>Name</th>
                    <th></th>
                    <th>Installed On</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <plugin-uninstalled-info-row  v-for="plugin in pluginList" :key="plugin.uid" v-if="settingState === 'available'" :plugin="plugin" :setting-state="settingState"></plugin-uninstalled-info-row>                
                <plugin-info-row  v-for="plugin in pluginList" :key="plugin.uid" v-if="settingState !== 'available'" :plugin="plugin" :setting-state="settingState"></plugin-info-row>                
            </tbody>
        </table>
    </div>
   `
});
