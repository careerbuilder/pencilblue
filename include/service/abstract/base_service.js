
module.exports = function BaseServiceModule (pb) {
    class BaseService {
        static init (cb) {
            cb(null, true);
        }

        constructor (context = {}) {
            this.context = context;
            this.site = context.site;
            this.log = context.log || pb.log;
        }

        createService (name, plugin) {
            return new (pb.PluginService.getService(name, plugin, this.site))(this.context);
        }
    }

    return BaseService;
};
