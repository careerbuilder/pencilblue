module.exports = (pb) => {

    class AdminIPFilter {
        static addFilter (filter) {
            AdminIPFilter.filters.push(filter);
        }
        static async requestIsAuthorized (req) {
            if(!AdminIPFilter.filters.length) {
                return true;
            }

            let ip = req.connections.remoteAddress;
            let ipList = [];
            let xForwardedFor = pb.util.get(req, 'headers.x-forwarded-for');
            if(xForwardedFor) {
                let xForwardedForIps = xForwardedFor.split(/[\s,]+/);
                ipList = ipList.concat(xForwardedForIps);
            }

            if (ipList.length) {
                ip = ipList[0];
            }
            // TODO: PromisifyAll Filter in filters
            let ipFilterChecks = AdminIPFilter.filters
                .map(async (filter) => await Promise.promisifyAll(filter).isIpAuthorizedAsync(ip));

            let results = await Promise.all(ipFilterChecks);
            return results.some(res => !!res);
        }
    }
    AdminIPFilter.filters = [];

    return AdminIPFilter;
};
