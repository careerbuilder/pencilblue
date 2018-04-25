const SettingTypes = require('../lib/plugin_settings_types');

module.exports = function (pb) {

    class PluginSettingsRenderingService extends require('./base_service')(pb) {
        constructor(context) {
            super(context);
            this.pluginService = new pb.PluginService(this.context);
        }
        async buildSettingsObject(pluginUid) {
            let settings = await this.pluginService.getSettingsAsync(pluginUid);
            if (!settings) {
                // tODO: Throw error so we should 404
                return this.reqHandler.serve404();
            }

            settings = this.clone(settings);

            let processed = settings.map(setting => Object.assign(setting, {
                id: setting.name.split(' ').join('_'),
                group: this._deriveLabel(setting.group, (setting.group || 'default')),
                displayName: this._deriveLabel(setting.displayName, setting.name),
                type: this._determineTypeOfData(setting)
            }));

            // First sort the settings alphabetically, then by heading/group
            processed.sort(this._sortOn('displayName'));
            processed.sort(this._sortOn('group'));

            return this._insertGroupHeadings(processed);
        }

        _determineTypeOfData(item) {
            return SettingTypes.determineType(item.value);
        }

        _sortOn(property) {
            return function (a, b) {
                // Forces default heading to appear at the top of the sets of grouped settings
                if (property === 'group' && a[property] === 'default') {
                    return -1;
                } else if (a[property] < b[property]) {
                    return -1;
                } else if (a[property] > b[property]) {
                    return 1;
                } else {
                    return 0;
                }
            };
        }

        _getHeadingObj(heading) {
            return {
                id: heading, // TODO: Do we need this or can we derive this?
                isHeading: true,
                heading: heading
            }
        }

        _insertGroupHeadings(settings = []) {
            if (!settings.length) {
                return settings;
            }

            let items = [];
            let previous = {};
            settings.forEach(setting => {
                if (previous.group !== setting.group) {
                    items.push(this._getHeadingObj(setting.group));
                }
                items.push(setting);
                previous = setting;
            });
            return items;
        };

        _deriveLabel(override = '', fallback) {
            let label = this.ls.g(override || fallback);

            if (!label || label === override || label === fallback) {
                label = label.split('_').join(' ');
                label = `${label.charAt(0).toUpperCase()}${label.slice(1)}`;
            }

            return label;
        }
    }

    return PluginSettingsRenderingService;
};
