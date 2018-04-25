const _ = require('lodash');
module.exports = function (pb) {

    class PluginSettingsActionController extends require('../admin_base_action_controller')(pb) {

        async updatePluginSettings (cb) {
            let pluginUid = this.pathVars.id;
            let newSettings = this.body.settings;
            let settings = {};
            try {
                settings = await this.pluginService.getSettingsAsync(pluginUid);
            } catch (err) {
                return this.sendServerError(err.message, cb);
            }
            if(!settings) {
                return this.sendClientError(this.ls.g('generic.INVALID_UID'),cb);
            }

            let mergedSettings = _.merge([], settings, newSettings.filter(setting => !setting.isHeading));

            try {
                if(!(await this.pluginService.setSettingsAsync(mergedSettings, pluginUid))) {
                    throw new Error('no result from settings update attempt');
                }
                return this.sendResponse(this.ls.g('generic.SAVE_PLUGIN_SETTINGS_SUCCESS'), cb);
            } catch (err) {
                pb.log.error(err);
                return this.sendServerError(this.ls.g('generic.SAVE_PLUGIN_SETTINGS_FAILURE'), cb);
            }
        }

        static getRoutes(cb) {
            cb(null, [{
                method: 'post',
                path: '/actions/kronos/plugins/:id/settings',
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
