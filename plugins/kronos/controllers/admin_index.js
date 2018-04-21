module.exports = function (pb) {

    class AdminIndex extends require('./admin_base_controller')(pb) {

        async render (cb) {
            this.vueModelService.add({
                cluster: await pb.ServerRegistration.getInstance().getClusterStatusAsync(),
                adminNav: this.AdminNavigationService.get(this.session, ['dashboard'], this.localizationService, this.site)
            });

            return this.load('/admin_index', cb);
        }

        static getRoutes (cb) {
            cb(null, [
                {
                    method: 'get',
                    path: '/kronos',
                    auth_required: true,
                    inactive_site_access: true,
                    access_level: pb.SecurityService.ACCESS_WRITER,
                    content_type: 'text/html'
                },
                {
                    method: 'get',
                    path: '/admin',
                    auth_required: true,
                    inactive_site_access: true,
                    access_level: pb.SecurityService.ACCESS_WRITER,
                    content_type: 'text/html'
                }
            ]);
        };
    }
    return AdminIndex;
};
