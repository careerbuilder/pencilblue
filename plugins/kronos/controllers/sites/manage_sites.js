module.exports = function (pb) {

    class SiteIndexController extends require('../admin_base_controller')(pb) {
        async render(cb) {
            let siteService = new pb.SiteService();
            // TODO: Remove the sitemap stuff but hey
            let siteMap = await siteService.getSiteMapAsync();

            this.vueModelService.add({
                navigation: this.AdminNavigationService.get(this.session, ['site_entity'], this.ls, this.site),
                pills: this.pills,
                siteType: 'active',
                activeMaxPageNumber: siteMap.active.length,
                inactiveMaxPageNumber: siteMap.inactive.length,
            });
            return this.load('/sites/manage_sites', cb);
        }

        get pills() {
            return [{
                name: 'home',
                title: this.ls.g('generic.HOME'),
                icon: 'home',
                href: '/kronos'
            },
                {
                    name: 'manage_sites',
                    title: this.ls.g('admin.MANAGE_SITES'),
                    icon: 'refresh',
                    href: '/kronos/sites'
                },
                {
                    name: 'new_site',
                    title: '',
                    icon: 'plus',
                    href: '/kronos/sites/new'
                }];
        }

        static getRoutes(cb) {
            return cb(null, [{
                method: 'get',
                path: '/kronos/sites',
                access_level: pb.SecurityService.ACCESS_MANAGING_EDITOR,
                auth_required: true,
                inactive_site_access: true,
                content_type: 'text/html'
            }])
        }
    }

    return SiteIndexController;
};
