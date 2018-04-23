const Promise = require('bluebird');
module.exports = function (pb) {
    Promise.promisifyAll(pb);

    class AdminBaseController extends pb.BaseController {
        async init(context, cb) {
            super.init(context, () => {
                this.vueModelService = this.createService('VueModelRegistrationService', 'kronos');
                this.AdminNavigationService = this.getServiceClass('AdminNavigationService', 'kronos');
                this.pluginService = new pb.PluginService(this.getServiceContext());

                this.ls.get = this.ls.g;
                this.locale = this.ls.language;

                cb(null, true);
            });
        }

        createService(serviceName, pluginName) {
            return new (this.getServiceClass(serviceName, pluginName))(this.getServiceContext());
        }

        getServiceClass(serviceName, pluginName) {
            return pb.PluginService.getService(serviceName, pluginName, this.site);
        }

        _clone(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
        load (template, cb) {
            return this.ts.loadAsync(template)
                .then(content => cb({content}))
                .catch(err => cb({content: err}));
        }
        static getRoutes(cb) {
            cb(null, []);
        }
    }

    return AdminBaseController;
};

