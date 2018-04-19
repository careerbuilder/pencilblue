module.exports = function IndexModule(pb) {

    class AdminIndex extends pb.BaseController {

        _getDummyServerClusterData () {
            return [{
                ip: '127.0.0.1',
                port: '8080',
                process_type: 'worker',
                mem_usage: {
                    heapUsed: 100000
                }
            }];
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
        render (cb) {
            this.vueModelService = new (pb.PluginService.getService('VueModelRegistrationService', 'kronos', this.site))({ts: this.ts});

            this.vueModelService.add({cluster: this._getDummyServerClusterData()});
            this.vueModelService.add({adminNav: this._getDummyAdminNav()});

            this.ts.load('/admin_index', (err, data) => {
                cb({content: data});
            });
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
