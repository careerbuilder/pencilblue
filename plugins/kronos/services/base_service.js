const Promise = require('bluebird');

module.exports = function (pb) {
    Promise.promisifyAll(pb);

    class BaseService {
        constructor (context) {
            this.context = context;
            this.site = context.site || pb.SiteService.GLOBAL_SITE;
            this.ts = context.ts;
            this.ls = context.ls;
        }
        static init (cb) {
            cb(null, true);
        }
        static getName() {
            return this.name;
        }

        getServiceClass(serviceName, pluginName) {
            return pb.PluginService.getService(serviceName, pluginName, this.site);
        }
        createService(serviceName, pluginName) {
            return new (this.getServiceClass(serviceName, pluginName))(this.context);
        }
    }

    return BaseService;
};
