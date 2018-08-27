module.exports = (pb) => {
    class BaseService {
        constructor(context) {
            this.serviceContext = context;
            this.site = context.site;
            this.ls = context.ls;
            this.ts = context.ts;

            this.queryService = context.queryService || new pb.SiteQueryService({site: this.site, onlyThisSite: true});
        }

        createService (serviceName, pluginName) {
            if(!pluginName) { // If no plugin name is given, assuming core service
                return new pb[serviceName](this.serviceContext);
            }

            let Service = pb.PluginService.getService(serviceName, pluginName, this.site);
            return new Service(this.serviceContext);
        }
    }

    return BaseService;
};
