module.exports = function (pb) {

    class SetupController extends require('../admin_base_controller')(pb) {

        async checkIfSetup(cb) {
            let isSetup = false;

            try {
                isSetup = await pb.settings.getAsync('system_initialized');
            } catch (err) {
                return cb(err);
            }

            if (isSetup) {
                return this.redirect('/', cb);
            }
            return this.render(cb);
        }
        render(cb) {
            this.setPageName('Setup');

            let siteRoot = pb.config.multisite.enabled ? pb.config.multisite.globalRoot : pb.config.siteRoot;
            this.ts.registerLocal('global_root', pb.SiteService.getHostWithProtocol(siteRoot));

            return this.load('setup', cb);
        };

        static getRoutes(cb) {
            return cb(null, [{
                method: 'get',
                path: '/kronos/setup',
                handler: 'checkIfSetup',
                access_level: 0,
                auth_required: false,
                setup_required: false,
                inactive_site_access: true,
                content_type: 'text/html'
            }]);
        }
    }

    return SetupController;
};
