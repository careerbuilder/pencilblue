const Promise = require('bluebird');
module.exports = function IndexModule(pb) {
    Promise.promisifyAll(pb);

    class AdminIndex extends pb.BaseController {

        async _getDummyServerClusterData () {
            return pb.ServerRegistration.getInstance()
                .getClusterStatusAsync();
            // return [{
            //     ip: '127.0.0.1',
            //     port: '8080',
            //     process_type: 'worker',
            //     mem_usage: {
            //         heapUsed: 100000
            //     }
            // }];
        }
        _getDummyAdminNav () {
            return [
                {text: 'Content', icon: 'fa-quote-right', link: '/admin/content'},
                {text: 'Plugins', icon: 'fa-puzzle-piece', link: '/admin/plugins', children: [
                        {text: "plugins", icon: 'fa-upload', link: '/admin/plugins'},
                        {text: "themes", icon: 'fa-magic', link: '/admin/theme'}
                    ]},
                {text: 'Users', icon: 'fa-users', link: '/admin/users'},
                {text: 'Settings', icon: 'fa-cogs', link: '/admin/settings'},
                {text: 'View Site', icon: 'fa-desktop', link: '/'},
                {text: 'Logout', icon: 'fa-power-off', link: '/actions/logout'}
            ]
        }
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
