const Koa = require('koa');
const Router = require('koa-router');
const Session = require('../koa/Session')();
const bodyParser = require('koa-body');
const Cookies = require('koa-cookie').default;
const Passport = require('../koa/authentication/Passport')();
const https = require('https');
const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');

module.exports = function(pb) {

    class PencilblueRouter {

        constructor() {
            this.app = new Koa();
            this.app.keys = ['9011fa34-41a6-4a4d-8ad7-d591c5d3ca01']; // Random GUID
            this.app._requestsServed = this.app._requestsServed || 0;
            this.app.proxy = true;
            
            this.router = new Router();

            this.app.use(bodyParser({
                multipart: true,
                // formidable: { uploadDir: path.join(__dirname, 'tmp') }
            }));
            let passport = Passport(pb);
            this.app.use(Session(this.app));
            this.app.use(Cookies());
            this.app.use(passport.initialize());
            this.app.use(passport.session());
        }

        static registerRoute(routeDescriptor) {
            this.internalRouteList.push(routeDescriptor);
        }

        static addMiddlewareAfter(name, middleware) {
            let index = this._indexOfMiddleware(name);
            if (index >= 0) {
                return this._addMiddlewareAt(index + 1, middleware);
            }
            return false;
        }
        static addMiddlewareAfterAll(middleware) {
            return this._addMiddlewareAt(this.internalMiddlewareStack.length, middleware);
        }

        static addMiddlewareBefore(name, middleware) {
            let index = this._indexOfMiddleware(name);
            if (index >= 0) {
                return this._addMiddlewareAt(index, middleware);
            }
            return false;
        }
        static addMiddlewareBeforeAll(middleware) {
            return this._addMiddlewareAt(0, middleware);
        }

        static replaceMiddleware(name, middleware) {
                let index = this._indexOfMiddleware(name);
                if (index >= 0 && middleware) {
                    this.internalMiddlewareStack[index] = middleware;
                }
            }
            /*****
             * Internal Helper Functions
             */
        static get internalMiddlewareStack() {
            if (this._internalMiddlewareStack) {
                return this._internalMiddlewareStack;
            }
            this._internalMiddlewareStack = [];
            return this._internalMiddlewareStack;
        }
        static get internalRouteList() {
            if (this._internalRouteList) {
                return this._internalRouteList;
            }
            this._internalRouteList = [];
            return this._internalRouteList;
        }

        static _addMiddlewareAt(index, middleware) {
            if (this._isValidName(middleware.name)) {
                this.internalMiddlewareStack.splice(index, 0, middleware);
                return true;
            }
            return false;
        }
        static _indexOfMiddleware(name) {
            return this.internalMiddlewareStack.findIndex(middleware => middleware.name === name);
        }
        static _getMiddlewareByName(name) {
            return this.internalMiddlewareStack.find(middleware => middleware.name === name);
        }
        static _isValidName(name) {
            return this.internalMiddlewareStack
                .filter(middleware => middleware.name === name).length === 0;
        }

        static _getMiddlewareListForRoutes() {
            return this.internalMiddlewareStack.map(middleware => middleware.action);
        }

        _loadInMiddleware() {
            PencilblueRouter.internalRouteList.forEach(route => {
                Object.keys(route.descriptors).forEach(method => {
                    let routeDescriptor = route.descriptors[method];
                    this.router[method](routeDescriptor.path, async(ctx, next) => {
                        this.app._requestsServed++;
                        ctx.routeDescription = routeDescriptor;
                        await next();
                    }, ...PencilblueRouter._getMiddlewareListForRoutes());
                });
            });
        }
        _loadPublicRoutes() {
            let routeParserMiddleware = PencilblueRouter._getMiddlewareByName('parseUrl');
            let publicRouteHandlerMiddleware = PencilblueRouter._getMiddlewareByName('checkPublicRoute');
            let mimeTypeMiddleware = PencilblueRouter._getMiddlewareByName('setMimeType');
            pb.RouterLoader.publicRoutes.forEach(route => {
                this.router.get(route, routeParserMiddleware.action, mimeTypeMiddleware.action, publicRouteHandlerMiddleware.action);
            });

            let nodeModuleMiddleware = PencilblueRouter._getMiddlewareByName('checkModuleRoute');
            this.router.get('/node_modules/*', routeParserMiddleware.action, mimeTypeMiddleware.action, nodeModuleMiddleware.action);
        }
        _addDefaultMiddleware() {
            // Add middleware stack for those routes that are unknown
            this.app.use(async(ctx, next) => {
                this.app._requestsServed++;
                await next();
            });
            PencilblueRouter._getMiddlewareListForRoutes()
                .forEach(middleware => this.app.use(middleware));
        }

        useSSL() {
            console.log("--------------------");
            console.log(pb.config.server.ssl.key);
            console.log(pb.config.server.ssl.cert);
            console.log("--------------------");
            const hasKeyAndCert = pb.config.server && pb.config.server.ssl && pb.config.server.ssl.key && pb.config.server.ssl.cert;
            return process.env.USE_SSL === '1' && hasKeyAndCert;
        }

        startSSLServer(port) {
            const config = {
                https: {
                    port,
                    options: {
                        key: fs.readFileSync(pb.config.server.ssl.key, 'utf8'),
                        cert: fs.readFileSync(pb.config.server.ssl.cert, 'utf8')
                    }
                }
            };
            const serverCallback = this.app.callback();
            const httpsServer = https.createServer(config.https.options, serverCallback);
            this.__server = httpsServer
                .listen(config.https.port, pb.config.siteIP, function(err) {
                    if (!!err) {
                        pb.log.error('PencilBlue is not ready!');
                    } else {
                        pb.log.info('PencilBlue is ready!');
                    }
                });
        }
        startSSLServerV2 () {
         let config = {
                http: {
                    domain: pb.config.server.ssl.handoff_ip,
                    port: pb.config.server.ssl.handoff_port,
                },
                https: {
                    domain: pb.config.siteIP,
                    port: '8080',//pb.config.sitePort,
                    options: {
                        key: fs.readFileSync(pb.config.server.ssl.key, 'utf8'),
                        cert: fs.readFileSync(pb.config.server.ssl.cert, 'utf8')
                    }
                },
            };

            function onHandoffRequest (req, res) {
                var host = req.headers.host;
                if (host) {
                    var index = host.indexOf(':');
                    if (index >= 0) {
                        host = host.substring(0, index);
                    }
                }
                if (pb.config.server.ssl.use_handoff_port_in_redirect) {
                    host += ':'+pb.config.sitePort;
                }

                res.writeHead(301, { "Location": "https://" + host + req.url });
                res.end();
            }
            let serverCallback = this.app.callback();
            if (process.env.START_HANDOFF_SERVER === '1') {
                try {
                    var httpServer = http.createServer(onHandoffRequest);
                    this.__handoffServer = httpServer
                        .listen(config.http.port, function(err) {
                            if (!!err) {
                                pb.log.error('HTTP server FAIL: ', err, (err && err.stack));
                            }
                            else {
                                pb.log.info('PencilBlue Handoff Server is ready!');
                                pb.log.info(`HTTP  server OK: http://${config.http.domain}:${config.http.port}`);
                            }
                        });
               }
               catch (ex) {
                   console.error('Failed to start HTTP server\n', ex, (ex && ex.stack));
               }
            }
            try {
                var httpsServer = https.createServer(config.https.options, serverCallback);
                pb.log.info(`Starting server on port ${pb.config.sitePort} | ${config.https.port}`);
                exec('lsof -i :8080', (err, stdout, stderr) => {
                pb.log.info(`LSOF pre ssl server start ${stdout}`);
                this.__server = httpsServer
                    .listen(config.https.port, function(err) {
                        if (!!err) {
                            pb.log.error('HTTPS server FAIL: ', err, (err && err.stack));
                        }
                        else {
                            pb.log.info('PencilBlue with SSL is ready!');
                            pb.log.info(`HTTPS server OK: http://${config.https.domain}:${config.https.port}`);
                        }
                    });
                });
            }
            catch (ex) {
                console.error('Failed to start HTTPS server\n', ex, (ex && ex.stack));
            }
        }

        /***
         * Listen function that starts the server
         * @param port
         */
        listen() {
            let port = pb.config.sitePort;
            if (!this.calledOnce) {
                this._loadPublicRoutes(); // Loads PB public routes, not regular public routes. -- Need to remove eventually
                this._loadInMiddleware();

                this.app
                    .use(this.router.routes())
                    .use(this.router.allowedMethods());

                this._addDefaultMiddleware();
                if (this.useSSL()) {
                    this.startSSLServerV2(port);
                } else {
                    this.__server = this.app.listen(port, () => {
                        pb.log.info('PencilBlue is ready!');
                    });
                }

                this.calledOnce = 1;
            } else {
                pb.log.error(`Listen function was called twice on the same server instance`);
            }
        }
        get requestsServed() {
            return this.app._requestsServed;
        }
    }

    return PencilblueRouter;
};
