const Promise = require('bluebird');
module.exports = function (pb) {
    Promise.promisifyAll(pb);
    Promise.promisifyAll(pb.security);

    const FormAuthentication = pb.FormAuthentication;

    class LoginActionController extends pb.BaseController {

        async login (cb) {
            let options = Object.assign({}, this.body, {
                access_level: this.isAdminAttempt ? pb.SecurityService.ACCESS_WRITER : pb.SecurityService.ACCESS_USER,
                site: this.site
            });

            try {
                if(!await pb.security.authenticateSessionAsync(this.session, options, new FormAuthentication())) {
                    throw new Error('');
                }
            } catch (err) {
                this.session.error = this.ls.g('login.INVALID_LOGIN');
                return cb({content: { error: this.ls.g('login.INVALID_LOGIN')}});
            }
            cb({content: {url: this.redirectLink}});
        }
        get redirectLink () {
            if(this._link) {
                return this._link;
            }
            this._link = '/';
            if (this.session.on_login) {
                this._link = this.session.on_login;
                delete this.session.on_login;
            } else if(this.isAdminAttempt) {
                this._link = '/kronos';
            }
            return this._link;
        }

        get errorRedirectLink () {
            if(this.isAdminAttempt) {
                return '/kronos/login';
            }
            return '/user/login';
        }
        get isAdminAttempt () {
            return this.query.admin_attempt;
        }

        static getRoutes (cb) {
            cb(null, [
                {
                    method: 'post',
                    path: '/actions/kronos/login',
                    handler: 'login',
                    access_level: 0,
                    auth_required: false,
                    inactive_site_access: true,
                    request_body: ['application/x-www-form-urlencoded', 'application/json'],
                    content_type: 'text/html'
                }
            ]);
        }
    }

    return LoginActionController;
};
