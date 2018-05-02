module.exports = function(pb) {

    class ThemeManagerController extends require('../admin_base_controller')(pb) {

        extendedInit(context) {
            super.extendedInit(context);
            this.settings = pb.SettingServiceFactory.getServiceBySite(this.site, true);
        }

        async _getSiteLogo() {
            let logo = '';
            try {
                logo = await this.settings.get('site_logo');
            } catch (err) {
                pb.log.error("ManageThemes: Failed to retrieve site logo: " + err.stack);
            }

            // TODO: this needs some localhost consideration
            // take logo, determine if it has http, if not add it otherwise use it
            if (logo && logo.indexOf('http') !== -1) {
                logo = `https://${logo}`;
            }

            return logo;
        }

        async render(cb) {
            // TODO: how to handle errors
            let [installedThemes, activeTheme] = await Promise.all([
                this.pluginService.getPluginsWithThemesBySiteAsync(),
                this.settings.getAsync('active_theme')
            ]);

           let themeOptions = this._clone(installedThemes);
           themeOptions.push({
                uid: pb.config.plugins.default,
                name: 'PencilBlue'
            });

            this.vueModelService.add({
                navigation: this.AdminNavigationService.get(this.session, ['plugins', 'themes'], this.ls, this.site),
                pills: this.pills,
                installedThemes,
                themeOptions,
                activeTheme
            });

            return this.load('/plugins/theme_index', cb);
        }

        get pills() {
            return [
                {
                    name: 'home',
                    title: this.ls.g('generic.HOME'),
                    icon: 'home',
                    href: '/kronos'
                },
                {
                    name: 'manage_plugins',
                    title: this.ls.g('themes.MANAGE_THEMES'),
                    icon: 'refresh',
                    href: '/kronos/themes'
                }
            ];
        }

        static getRoutes(cb) {
            cb(null, [{
                method: 'get',
                path: '/kronos/themes',
                auth_required: true,
                inactive_site_access: true,
                access_level: pb.SecurityService.ACCESS_MANAGING_EDITOR,
                content_type: 'text/html'
            }
            ]);
        }
    }

    return ThemeManagerController;
};
