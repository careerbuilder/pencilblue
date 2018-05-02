module.exports = function (pb) {

    class SiteDetailsController extends require('../admin_base_controller')(pb) {

        extendedInit(context) {
            super.extendedInit(context);
            this.dao = new pb.DAO();
        }

        async render(cb) {
            this.siteData = await this.getSiteData();

            this.vueModelService.add({
                navigation: this.AdminNavigationService.get(this.session, ['site_entity'], this.ls, this.site),
                pills: this.pills,
                singleSiteMode: pb.config.multisite.enabled,
                site: this.siteData,
                themeData: await this.getActiveTheme(),
                availableLocales: this.availableLocales
            });

            return this.load('/sites/site_details', cb);
        }

        get pills() {
            let pills = [{
                name: 'admin_home',
                title: this.ls.get('generic.HOME'),
                icon: 'home',
                href: '/kronos'
            }];

            if (pb.config.multisite.enabled) { // Only show manage all if in multi site mode
                pills.push({
                    name: 'manage_sites',
                    title: this.ls.get('sites.MANAGE_SITES'),
                    icon: 'chevron-left',
                    href: '/kronos/sites'
                });
            }
            if (this.pathVars.siteid) { // if not a new site, show current site nav pill
                pills.push({
                    name: 'site_details',
                    title: this.ls.get('sites.SITE_DETAILS'),
                    icon: 'sitemap',
                    href: `/kronos/sites/${this.siteData.uid}`
                });
            }
            pills.push({ // always show new site pill
                name: 'new_site',
                title: '',
                icon: 'plus',
                href: '/kronos/sites/new'
            });

            return pills;
        }

        async getActiveTheme () {
            let settings = pb.SettingServiceFactory.getServiceBySite(this.siteData.uid, true);
            let pluginService = new pb.PluginService({site: this.siteData.uid});
            let [installedThemes, activeTheme] = await Promise.all([
                pluginService.getPluginsWithThemesBySiteAsync(),
                settings.getAsync('active_theme')
            ]);

            let themeOptions = this._clone(installedThemes);
            themeOptions.push({ // TODO: one day this wont be needed.
                uid: pb.config.plugins.default,
                name: 'PencilBlue'
            });

            return {
                themeOptions,
                activeTheme
            };
        }
        async getSiteData() {
            if (this._siteData) {
                return this._siteData;
            }
            else if (!this.pathVars.siteid) {
                let defaultLocale = pb.Localization.getDefaultLocale();
                return {
                    supportedLocales: [{[defaultLocale]: true}],
                    default: defaultLocale
                };
            }
            this._siteData = await this.dao.loadByValueAsync('uid', this.pathVars.siteid, 'site');

            return this._siteData;
        }

        get availableLocales() {
            let available = Object.keys(pb.Localization.supportedLookup).map(locale => ({
                name: locale,
                selected: !!this.siteData.supportedLocales[locale]
            }));

            available.forEach(locale => locale.name === this.siteData.default ? locale.selected = true : '');

            return available;
        }

        static getRoutes(cb) {
            return cb(null, [{
                method: 'get',
                path: "/kronos/sites/new",
                access_level: pb.SecurityService.ACCESS_MANAGING_EDITOR,
                auth_required: true,
                inactive_site_access: true,
                content_type: 'text/html'
            },
            {
                method: 'get',
                path: "/kronos/sites/:siteid",
                access_level: pb.SecurityService.ACCESS_ADMINISTRATOR,
                auth_required: true,
                inactive_site_access: true,
                content_type: 'text/html'
            }]);
        }
    }

    return SiteDetailsController;
};
