const Cookies = require('cookies');

module.exports = function (pb) {

    const SecurityService = pb.SecurityService;

    class LogoutController extends require('../../admin_base_controller')(pb) {

        async logout(cb) {
            try {
                await pb.session.endAsync(this.session);
            } catch (e) {
                return cb(e);
            }

            this._resetCookie();
            this.redirect(this.redirectLink, cb);
        };

        _resetCookie() {
            let cookies = new Cookies(this.req, this.res);
            let cookie = pb.SessionHandler.getSessionCookie(this.session);
            cookie.expires = new Date();
            cookie.overwrite = true;
            cookies.set(pb.SessionHandler.COOKIE_NAME, null, cookie);
        }

        get redirectLink() {
            if (SecurityService.isAuthorized(this.session, {admin_level: SecurityService.ACCESS_WRITER})) {
                return '/kronos/login';
            }

            let redirect = this.req.headers.referer; // Check if refer has a redirect in it

            return redirect || '/';
        };


        static getRoutes(cb) {
            cb(null, [
                {
                    method: 'get',
                    path: '/actions/kronos/logout',
                    handler: 'logout',
                    auth_required: true,
                    inactive_site_access: true,
                    access_level: 0,
                    content_type: 'text/html'
                },
                {
                    method: 'get',
                    path: '/actions/user/logout',
                    handler: 'logout',
                    auth_required: true,
                    inactive_site_access: true,
                    access_level: 0,
                    content_type: 'text/html'
                }
            ]);
        };
    }

    return LogoutController;
};
