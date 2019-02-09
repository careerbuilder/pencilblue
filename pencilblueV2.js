module.exports = (pb) => {

    class Pencilblue {
        constructor(config) {
            this.config = config;
            this.pb = pb;

            this.router = new pb.Router();
        }
        async startup() {
                    exec('lsof -i :8080', (err, stdout, stderr) => {
                pb.log.info(`LSOF on Startup ${stdout}`);
            });
            pb.LocalizationService.init();
            await pb.Localization.initAsync();
            exec('lsof -i :8080', (err, stdout, stderr) => {
                pb.log.info(`LSOF post Localization ${stdout}`);
            });
            // Start the Database connections and readers
            await this._initDBConnections();
            await this._initDBIndices();
            exec('lsof -i :8080', (err, stdout, stderr) => {
                pb.log.info(`LSOF on Post DB ${stdout}`);
            });

            await this.pb.ServerRegistry.getInstance().init();
            this.pb.CommandService.getInstance().init(function(err, data) {});
            exec('lsof -i :8080', (err, stdout, stderr) => {
                pb.log.info(`LSOF on Post Command Service ${stdout}`);
            });
            
            // Setup Routing and Middleware
            this._initMiddleware();
            this._initCoreRoutes();

            exec('lsof -i :8080', (err, stdout, stderr) => {
                pb.log.info(`LSOF on Post Routring and Middleware ${stdout}`);
            });
            
            // Load in Plugins and Sites
            await this._initPlugins();
            await this._initSites();
            exec('lsof -i :8080', (err, stdout, stderr) => {
                pb.log.info(`LSOF on Post Site ${stdout}`);
            });

            this._registerMetrics();
            exec('lsof -i :8080', (err, stdout, stderr) => {
                pb.log.info(`LSOF on Post Metrics ${stdout}`);
            });

            this._addRoutesToRouter();
            exec('lsof -i :8080', (err, stdout, stderr) => {
                pb.log.info(`Result of LSOF 1 ${stdout}`);
            });
            this.router.listen(8080);
            exec('lsof -i :8080', (err, stdout, stderr) => {
                pb.log.info(`Result of LSOF 2: ${stdout}`);
            });
        }
        async startupReal() {
            pb.LocalizationService.init();
            await pb.Localization.initAsync();

            // Start the Database connections and readers
            await this._initDBConnections();
            await this._initDBIndices();

            await this.pb.ServerRegistry.getInstance().init();
            this.pb.CommandService.getInstance().init(function(err, data) {});

            // Setup Routing and Middleware
            this._initMiddleware();
            this._initCoreRoutes();

            // Load in Plugins and Sites
            await this._initPlugins();
            await this._initSites();

            this._registerMetrics();

            this._addRoutesToRouter();

            this.router.listen();
        }

        /******************************
         * Database Connections
         */
        async _initDBConnections() {
            //setup database connection to core database
            let dbName = pb.config.db.name;
            let result = await pb.dbm.getDbAsync(dbName) || {};
            if (!result.databaseName) {
                throw new Error(`Failed to establish a connection to: ${dbName}`);
            }
            pb.log.info(`PencilBlue: Established connection to DB: ${result.databaseName}`);
        };
        async _initDBIndices() {
            let skipIndex = pb.config.db.skip_index_check;
            let indices = pb.config.db.indices;
            let indexIsNotArray = !pb.util.isArray(indices);
            if (skipIndex || indexIsNotArray) {
                return pb.log.info('PencilBlue: Skipping ensurance of indices');
            }

            pb.log.info('PencilBlue: Ensuring indices...');
            await pb.dbm.processIndicesAsync(indices);
            pb.log.info('PencilBlue: Finished indices check...');
        };

        /******************************
         * Middleware and Routing
         */
        _initMiddleware() {
            return pb.Middleware.getAll()
                .forEach((middleware) => pb.Router.addMiddlewareAfterAll(middleware));
        }

        _initCoreRoutes() {
            pb.RouterLoader.registerCoreRoutes();
        }
        _addRoutesToRouter() {
            let routes = pb.RouterLoader.getRoutesForRouter();
            Object.keys(routes).forEach(plugin => {
                Object.keys(routes[plugin]).forEach(path => {
                    pb.Router.registerRoute(routes[plugin][path]);
                })
            });
        }

        /******************************
         * Sites and Plugins
         */
        async _initSites() {
            pb.SiteService.init(); // Register job runner events
            let siteService = new pb.SiteService();
            return siteService.initSites();
        }

        async _initPlugins() {
            pb.PluginService.init(); // initialize command listeners
            let pluginService = new pb.PluginService();
            return pluginService.initPlugins(); // initialize all plugins
        }

        /**********
         * Server Metrics
         */
        _registerMetrics() {
            //total number of requests served
            pb.ServerRegistry.addItem('requests', () => this.router.requestsServed);

            //current requests
//             pb.ServerRegistry.addItem('currentRequests', () => {
//                 return new Promise((resolve, reject) => {
//                     // This should not be needed, but is causing server crashes.  Add diagonostics for now.
//                     if(!this.router || !this.router.__server || !this.router.__server.getConnections) {
//                         pb.log.error('Failed to get server when registerting current requests.');
//                         resolve(true);
//                         return;
//                     }
//                     this.router.__server.getConnections((err, data) => {
//                         if (err) {
//                             return reject(err);
//                         }
//                         resolve(data);
//                     });
//                 }).catch(err => console.log(err));
//             });

            //analytics average
            pb.ServerRegistry.addItem('analytics', () => pb.AnalyticsManager.getStats());
        };
    }

    return Pencilblue;
};
