const Promise = require('bluebird');
module.exports = function IndexModule(pb) {
    Promise.promisifyAll(pb);

    class AdminIndex extends pb.BaseController {

        async render (cb) {
            this.vueModelService = new (pb.PluginService.getService('VueModelRegistrationService', 'kronos', this.site))({ts: this.ts});

            this.vueModelService.add({
                cluster: await pb.ServerRegistration.getInstance().getClusterStatusAsync(),
                adminNav: pb.AdminNavigation.get(this.session, ['dashboard'], this.localizationService, this.site)
            });
            return this.ts.loadAsync('/admin_index')
                .then(content => cb({content}))
                .catch(err => cb({content: err}));
        }
        static getRoutes (cb) {
            cb(null, [
                {
                    method: 'get',
                    path: '/kronos',
                    auth_required: false,
                    content_type: 'text/html'
                }
            ]);
        };
    }
    return AdminIndex;
};
