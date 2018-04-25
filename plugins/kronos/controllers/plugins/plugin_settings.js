module.exports = function (pb) {

    class PluginSettingsController extends require('../admin_base_controller')(pb) {

        init (context, cb) {
            super.init(context, () => {
                this.pluginRenderingService = this.createService('PluginSettingsRenderingService', 'kronos');
                cb(null, true);
            });
        }

        async render (cb) {
            let pluginUid = this.pathVars.id;
            // Ensures that the plugin whose setting we are going to check exists on this site
            this.plugin = await this.pluginService.getPluginBySiteAsync(pluginUid);
            if(!this.plugin) {
                return this.reqHandler.serve404();
            }

            let settings = {};
            try {
                settings = await this.pluginRenderingService.buildSettingsObject(pluginUid);
            } catch (err) {
                return this.reqHandler.serve404();
            }

            this.vueModelService.add({
                navigation: this.AdminNavigationService.get(this.session, ['plugins', 'manage'], this.ls, this.site),
                pills: this.pills,
                settings,
                pluginUid
            });

            return this.load('/plugins/plugin_settings', cb);
        }
        get pills() {
           return [
               {
                   name: 'admin_home',
                   title: `Home`,
                   icon: 'home',
                   href: '/kronos'
               },
               {
                   name: 'manage_plugins',
                   title: `Manage Plugins`,
                   icon: 'chevron-left',
                   href: '/kronos/plugins'
               },
               {
                   name: `${this.plugin.name}_plugin_settings`,
                   title: `${this.plugin.name} ${this.ls.g('admin.SETTINGS')}`,
                   icon: 'cog',
                   href: `/kronos/plugins/${this.plugin.name}`
               }
            ];
        }

        static getRoutes(cb) {
            cb(null, [{
                method: 'get',
                path: "/kronos/plugins/:id/settings",
                auth_required: true,
                inactive_site_access: true,
                access_level: pb.SecurityService.ACCESS_MANAGING_EDITOR,
                content_type: 'text/html'
            }]);
        }
    }

    return PluginSettingsController;
};
