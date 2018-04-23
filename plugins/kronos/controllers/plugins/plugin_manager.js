module.exports = function (pb) {

    class PluginManagerController extends require('../admin_base_controller')(pb) {

        initSync() {
            this.pluginService = new pb.PluginService(this.getServiceContext());
            this.globalPluginService = new pb.PluginService({});
        };

        async render(cb) {
            let sitePluginMap = this.pluginService.getPluginMapAsync();
            let globalPluginMap = this.globalPluginService.getPluginMapAsync();

            let [sitePlugins, globalPlugins] = await Promise.all([sitePluginMap, globalPluginMap]);

            let availablePluginsMinusGlobal = sitePlugins.available
                .filter(plugin => !globalPlugins.active.some(globalPlugin => globalPlugin.uid === plugin.uid));

            this.vueModelService.add({
                navigation: this.AdminNavigationService.get(this.session, ['plugins', 'manage'], this.ls, this.site),
                pills: this.pills,
                pluginData: {
                    installedPlugins: sitePlugins.active,
                    inactivePlugins: sitePlugins.inactive,
                    availablePlugins: availablePluginsMinusGlobal,
                    globalPlugins: globalPlugins.active
                },
                site: this.site
            });

            return this.load('/plugins/plugin_index', cb);
        };

        get pills() {
            return [
                {
                    name: 'home',
                    title: this.ls.g('HOME'),
                    icon: 'home',
                    href: '/kronos'
                },
                {
                    name: 'manage_plugins',
                    title: this.ls.g('plugins.MANAGE_PLUGINS'),
                    icon: 'refresh',
                    href: '/kronos/plugins'
                }
            ];
        }

        static getRoutes (cb) {
            cb(null, [        {
                method: 'get',
                path: "/kronos/plugins",
                auth_required: true,
                inactive_site_access: true,
                access_level: pb.SecurityService.ACCESS_MANAGING_EDITOR,
                content_type: 'text/html'
            }]);
        }
    }

    return PluginManagerController;
};
