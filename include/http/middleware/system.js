const path = require('path');
const util = require('util');
const url = require('url');
const readFile = util.promisify(require('fs').readFile);

const publicRoutes = ['/js/', '/css/', '/fonts/', '/img/', '/localization/', '/favicon.ico', '/docs/'];
const modulePattern = /^\/node_modules\/(.*)/

async function servePublicContent(ctx, path) {
    let content = {};
    try {
        content = await readFile(path);
    } catch (err) {
        ctx.status = 404;
    }

    ctx.body = content;
}
module.exports = pb => ({
    parseUrl: async (ctx, next) => {
        ctx.req.hostname = ctx.req.headers.host;
        ctx.req.urlObj = url.parse(ctx.req.url, true);
        ctx.req.url = url.parse(ctx.req.url, true);
        await next();
    },
    checkSSL: async (ctx, next) => {
        //check to see if we should inspect the x-forwarded-proto header for SSL
        //load balancers use this for SSL termination relieving the stress of SSL
        //computation on more powerful load balancers.
        pb.log.silly('Incoming request: ' + ctx.req.headers.host + ' | ' + ctx.req.url);

        // if (ctx.req.headers['x-forwarded-proto'] === 'https') {
        if(!pb.config.server.ssl.use_x_forwarded || ctx.req.headers['x-forwarded-proto'] === 'https') {
            return await next();
        }

        let host = ctx.req.headers.host;
        if (host) {
            let index = host.indexOf(':');
            if (index >= 0) {
                host = host.substring(0, index);
            }
        }
        if (pb.config.server.ssl.use_handoff_port_in_redirect) {
            host += `:${pb.config.sitePort}`;
        }

        ctx.status = 301;
        ctx.redirect(`https://${host}${ctx.req.url}`);
        ctx.body = 'Redirecting http to https';
        pb.log.silly(`Redirecting HTTP request to HTTPS - ${host}${ctx.req.url}`);
    },
    sessionCheck: async (ctx, next) => {
        ctx.session.uid = ctx.session.uid || pb.util.uniqueId();
        ctx.session.authentication = ctx.session.authentication || {};
        await next();
    },
    checkPublicRoute: async (ctx, next) => {
        let req = ctx.req;
        const pathname = req.url.pathname;
        if (publicRoutes.some(prefix => pathname.startsWith(prefix))) {
            return servePublicContent(ctx, path.join(pb.config.docRoot, 'public', pathname));
        }
        await next();
    },
    checkModuleRoute: async (ctx, next) => { // WTF why is this a thing?
        let req = ctx.req;
        const pathname = req.url.pathname;
        const match = modulePattern.exec(pathname);
        if (match) {
            let modulePath = '';
            try {
                modulePath = require.resolve(match[1])
            } catch(_) {
                ctx.status = 404;
                return;
            }
            return servePublicContent(ctx, modulePath);
        }
        await next();
    },
    systemSetupCheck: async (ctx, next) => {
        let req = ctx.req;
        let route = req.route; // TODO: Figure out what this should be, probably routeDescriptor

        if (!req.route.setup_required) { // TODO: fix this
             return next();
        }
        let isSetup = false;
        try {
            isSetup = await pb.settings.getAsync('system_initialized');
            if(!isSetup) {
                throw new Error('Not Setup');
            }
        } catch (err) {
            ctx.status = 301;
            ctx.redirect('/setup');
            ctx.body = 'Redirecting to setup';
            return;
        }
        await next();
    },
    setMimeType: async (ctx, next) => {
        if(ctx.req.url.pathname && ctx.req.url.pathname.includes('.css')) {
            ctx.type = 'text/css';
        }
        await next();
    }
});
