module.exports = (pb) => {

    class ContextLogger {
        constructor (log, getContext) {
            this.getContext = getContext;
            Object.keys(log.levels).forEach(level => {
                this[level] = (msg, err) => {
                    log[level](this._format(msg, err));
                };
            });
        }

        _formatKeys (obj) {
            const sections = Object.keys(obj).map(key => {
                const val = obj[key];
                return `[${key}] ${val || '?'}`;
            });
            return sections.join(' ');
        }

        _format (msg, err) {
            if (!util.isObject(msg)) {
                msg = { 'Message': msg };
            }
            if (err) {
                msg['Error'] = err.stack;
            }
            return this._formatKeys(Object.assign(this.getContext(), msg));
        }
    }

    return ContextLogger;
};
