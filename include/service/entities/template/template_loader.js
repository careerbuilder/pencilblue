module.exports = function (pb) {

    class TemplateLoader {
        constructor () {
            var objType = 'template';
            var services = [];

            var options = {
                objType: objType,
                timeout: pb.config.templates.memory_timeout
            };

            //add in-memory service
            if (pb.config.templates.use_memory) {
                services.push(new pb.MemoryEntityService(options));
            }

            //add cache service
            if (pb.config.templates.use_cache) {
                services.push(new pb.CacheEntityService(options));
            }

            //always add fs service
            services.push(new pb.TemplateEntityService());

             new pb.SimpleLayeredService(services, 'TemplateService');
        }
    }

    return TemplateLoader;
}
