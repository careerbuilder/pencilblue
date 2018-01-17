const Promise = require('bluebird');
const _ = require('lodash');

module.exports = function(pb) {

    class ErrorViewController extends pb.BaseController {
        promisedInit (context) {
            this.error = context.error || this.error;
            this.status = _.get(this, 'this.error.code', 500);
            this.contentSettingService = new pb.ContentService(this.getServiceContext());
            this.topMenuService = new pb.TopMenuService(this.getServiceContext());
            this.setPageName(`${this.status}`);
        }

        async render () {
            let data = {};
            try {
                data = await this._gatherData();
            } catch (err) {
                //to prevent loops we just bury the error
                pb.log.error(`ErrorController: ${err.stack}`);
                data = { navItems: {} };
            }

            this._registerLocals(data);
            try {
                return {content: await this.ts.load(this.templatePath), code: this.status};
            } catch (err) {
                return {content: _.get(this, 'this.error.stack', 'Something went horribly wrong')};
            }
        }
        _gatherData () {
            let contentSettings = this.contentSettingService.getSettings();
            let navItems = this.topMenuService.getNavItems({
                ls: this.ls,
                activeTheme: this.activeTheme,
                session: this.session,
                currUrl: this.req.url
            });
            return Promise.props({contentSettings, navItems});
        };

        _registerLocals (data) {
            this.ts.registerModel({
                navigation: new pb.TemplateValue(data.navItems.navigation, false),
                account_buttons: new pb.TemplateValue(data.navItems.accountButtons, false),
                angular_objects: new pb.TemplateValue(pb.ClientJs.getAngularController(this.getAngularObjects()), false),
                status: this.status,
                error_message: this.errorMessage,
                error_stack: this.error && pb.config.logging.showErrors ? this.error.stack : ''
            });
        }

        getAngularObjects(data) {
            return {
                navigation: data.navItems.navigation,
                contentSettings: data.contentSettings,
                loggedIn: pb.security.isAuthenticated(this.session),
                accountButtons: data.navItems.accountButtons
            }
        }
        get errorMessage () {
            return this.error ? this.error.message : this.ls.g('error.ERROR');
        }
        get templatePath () {
            return 'error/default';
        };
    }

    return ErrorViewController;
};
