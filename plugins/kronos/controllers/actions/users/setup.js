module.exports = function (pb) {

    class SetupActionController extends require('../../admin_base_controller')(pb) {

        init(context, cb) {
            super.init(context, () => {
                this.userService = new pb.UserService({site: pb.SiteService.GLOBAL_SITE});
                this.contentService = new pb.ContentService();

                cb(null, true);
            });
        }

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
            return this.doSetup(cb);
        }

        get requiredParams() {
            return ['username', 'email', 'password', 'confirm_password'];
        }

        async doSetup(cb) {
            let message = this.hasRequiredParams(this.body, this.requiredParams);
            if (message) {
                return this.formError(message, '/setup', cb);
            }

            //set the access level (role)
            let data = Object.assign({}, {
                admin: pb.SecurityService.ACCESS_ADMINISTRATOR,
                locale: this.ls.language
            });

            try {
                await this._doStartupTasks(data);
            } catch (err) {
                let message = err.stack || err.message || err;
                pb.log.error(`An error occurred while attempting to perform setup: ${message}`);
                return this.formError(err, '/setup', cb);
            }

            this.session.success = this.ls.g('login.READY_TO_USE');
            this.redirect('/kronos/login', cb);
        };

        async _doStartupTasks(data) {
            await this.userService.addAsync(data)
                .catch(() => {
                    throw this.ls.g('generic.ERROR_CREATING_USER')
                });
            await pb.settings.setAsync('active_theme', pb.RequestHandler.DEFAULT_THEME)
                .catch(() => {
                    throw this.ls.g('generic.ERROR_SETTING_ACTIVE_THEME')
                });
            await this.contentService.getSettingsAsync()
                .catch(() => {
                    throw this.ls.g('generic.ERROR_SETTING_CONTENT_SETTINGS')
                });
            await  pb.settings.setAsync('system_initialized', true)
                .catch(() => {
                    throw this.ls.g('generic.ERROR_SETTING_SYS_INITIALIZED')
                });
        }

        static getRoutes(cb) {
            cb(null, [
                {
                    method: 'post',
                    path: "/actions/kronos/setup",
                    access_level: 0,
                    auth_required: false,
                    setup_required: false,
                    inactive_site_access: true,
                    handler: 'checkIfSetup',
                    request_body: ['application/x-www-form-urlencoded', 'application/json'],
                    content_type: 'text/html'
                }]);
        }
    }

    return SetupActionController;

};
