module.exports = function (pb) {

    class PluginSettingsActionController extends require('../admin_base_action_controller')(pb) {

        init(context, cb) {
            super.init(context, () => {
                this.pluginSettingsUpdateService = this.createService('PluginSettingsUpdateService', 'kronos');
                cb(null, true);
            })
        }

        async updatePluginSettings (cb) {
            let pluginUid = this.pathVars.id;
            let settings = {};
            try {
                settings = await this.pluginService.getSettingsAsync(pluginUid);
            } catch (err) {
                return this.sendServerError(err, cb);
            }
            if(!settings) {
                return this.sendClientError(new Error(this.ls.g('generic.INVALID_UID')));
            }

            let errors = settings
                .map(setting => this.pluginSettingsUpdateService.updateSetting(this.data, setting))
                .filter(err => !!err);

            if(errors.length) {
                return this.sendClientError(errors.reduce((fullMessage, curr) => `${fullMessage}${curr.message}\n`), cb);
            }

            try {
                if(!(await this.pluginService.setSettingsAsync(settings, pluginUid))) {
                    throw new Error('no result from settings update attempt');
                }
                return this.sendResponse(this.ls.g('generic.SAVE_PLUGIN_SETTINGS_SUCCESS'), cb);
            } catch (err) {
                pb.log.error(err);
                return this.sendServerError(this.ls.g('generic.SAVE_PUGIN_SETTINGS_FAILURE'), cb); // TODO: Fix this typo
            }
        }

        static getRoutes(cb) {
            cb(null, [{
                method: 'post',
                path: '/kronos/plugins/:id/settings',
                handler: 'updatePluginSettings',
                auth_required: true,
                inactive_site_access: true,
                access_level: pb.SecurityService.ACCESS_MANAGING_EDITOR,
                content_type: 'application/json',
                request_body: ['application/json']
            }])
        }
    }

    return PluginSettingsActionController;
};
