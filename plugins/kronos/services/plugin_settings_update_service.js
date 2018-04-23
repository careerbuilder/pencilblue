const SettingTypes = require('../lib/plugin_settings_types');

module.exports = function (pb) {

    class PluginSettingsUpdateService extends require('./base_service')(pb) {

        updateSetting(data, currentItem) {
            let newVal = data[currentItem.name];
            let type = SettingTypes.determineType(currentItem.value);

            if (!newVal && newVal !== false) {
                return new Error(`The ${currentItem.name} setting must be provided`);
            }

            //validate the value
            if (!SettingTypes.validateValue(newVal, type)) {
                return new Error(`The value [${newVal}] for setting ${currentItem.name} is not a valid ${type}`);
            }

            //set the new value
            currentItem.value = this._formatValue(newVal, type);
        }

        _formatValue(value, type) {
            if (!value && value !== false && value !== 0) {
                throw new Error("Value and type must be provided");
            }

            value += '';
            if (type === 'boolean') {
                return value == true || value.toLowerCase() === 'true'; // We want to use == here.
            }
            else if (type === 'string') {
                return value;
            }
            else if (type === 'number') {
                return Number(value);
            }
            return null;
        }
    }

    return PluginSettingsUpdateService;
};
