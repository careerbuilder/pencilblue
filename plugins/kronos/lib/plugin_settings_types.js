module.exports = {
    determineType: function (value) {
        if (value === true || value === false) {
            return 'checkbox';
        } else if (typeof(value) === 'string' && value) {
            return 'text';
        } else if (!isNaN(value)) {
            return 'number';
        }
        return null;
    },
    validateValue: function (value, type) {
        switch (type) {
            case 'boolean':
            case 'checkbox':
                return typeof(value) === 'boolean';
            case 'text':
            case 'string':
                return value && typeof(value) === 'string';
            case 'number':
                return !isNaN(value);
        }
        return false;
    }
};
