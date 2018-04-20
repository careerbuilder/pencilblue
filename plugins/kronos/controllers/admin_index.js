const Promise = require('bluebird');
module.exports = function IndexModule(pb) {
    Promise.promisifyAll(pb);

    class AdminIndex extends pb.BaseController {

        async render (cb) {
            this.vueModelService = this.createService('VueModelRegistrationService', 'kronos');

            this.vueModelService.add({
                cluster: await pb.ServerRegistration.getInstance().getClusterStatusAsync(),
                adminNav: pb.AdminNavigation.get(this.session, ['dashboard'], this.localizationService, this.site)
            });
            return this.ts.loadAsync('/admin_index')
                .then(content => cb({content}))
                .catch(err => cb({content: err}));
        }

        createService(serviceName, pluginName) {
            return new (pb.PluginService.getService(serviceName, pluginName, this.site))(this.getServiceContext());
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
                }
            ]);
        };
    }
    return AdminIndex;
};
