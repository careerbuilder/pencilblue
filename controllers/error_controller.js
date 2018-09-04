//dependencies
module.exports = function(pb) {

    class BaseErrorViewController extends pb.BaseViewController {
        async init(ctx) {
            this.error = ctx.error || this.error;
            this.status = ctx.status || ctx.error.code || 500;
            this.pageName = `${this.status}`;
            this.contentSettingService = new pb.ContentService(this.serviceContext);
            this.topMenuService = new pb.TopMenuService(this.serviceContext);
        }
        async render () {
            this.navItems = {};

            try {
                this.contentSettings = await this.contentSettingService.getSettingsAsync();
                this.navItems = await this.topMenuService.getNavItemsAsync(this.serviceContext);
            } catch (err) {
                pb.log.error(`ErrorController: ${err.stack}`);
            }

            let angularController = pb.ClientJs.getAngularController(this.angularContext);
            this._registerTemplateData(angularController, this.navItems);

            return this._loadTemplate();
        }
        get templatePath () {
            return 'error/default';
        }
        get angularContext () {
            return {
                navigation: this.navItems.navigation,
                contentSettings: this.contentSettings,
                loggedIn: pb.SecurityService.isAuthenticated(this.session),
                accountButtons: this.navItems.accountButtons
            };
        }
        get errorMessage () {
            return this.error ? this.error.message : this.ls.get('error.ERROR');
        }
        get serviceContext () {
            return Object.assign({}, super.serviceContext, {currUrl: this.req.url});
        }

        async _loadTemplate() {
            let content = '';
            try {
                content = await this.ts.loadAsync(this.templatePath);
            } catch (err) {
                this._logError(err);
                content = err.message;
            }

            return { content, code: this.status };
        }
        _logError(err) { // TODO: remove once context logger is implemented at base level
            pb.log.error(`${this.constructor.name}: ${err}`);
        }
        _registerTemplateData (angularContext, navItems) {
            let model = {
                navigation: new pb.TemplateValue(navItems.navigation, false),
                account_buttons: new pb.TemplateValue(navItems.accountButtons, false),
                angular_objects: new pb.TemplateValue(angularContext, false),
                status: this.status,
                error_message: this.errorMessage,
                error_stack: this.error && pb.config.logging.showErrors ? this.error.stack : ''
            };
            this.ts.registerModel(model);
        }
    }

    return BaseErrorViewController;
};
