module.exports = function (pb) {

    class AdminIndex extends require('../admin_base_controller')(pb) {

        async renderUserLogin (cb) {
            await this._renderLogin(cb);
        }
        async renderAdminLogin (cb) {
            this.postQuery = '?admin_attempt=1';
            await this._renderLogin(cb);
        }
        async _renderLogin (cb) {

            if(pb.security.isAuthorized(this.session, {authenticated: true, admin_level: pb.SecurityService.ACCESS_WRITER})) {
                return this.redirect('/admin', cb);
            }
            else if(pb.security.isAuthenticated(this.session)) {
                return this.redirect('/', cb);
            }

            this.vueModelService.add({'postQuery': this.postQuery || ''});

            this.setPageName(`${this.ls.g('generic.LOGIN')}`);
            return this.load('/login', cb);
        }

        static getRoutes (cb) {
            cb(null, [
                {
                    method: 'get',
                    path: '/kronos/login',
                    handler: 'renderAdminLogin',
                    inactive_site_access: true,
                    content_type: 'text/html'
                },
                {
                    method: 'get',
                    path: '/kronos/user/login',
                    handler: 'renderUserLogin',
                    inactive_site_access: true,
                    content_type: 'text/html'
                }
            ]);
        };
    }
    return AdminIndex;
};


