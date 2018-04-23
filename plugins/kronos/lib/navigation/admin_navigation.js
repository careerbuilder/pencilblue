
module.exports = (pb) => {
    const contentNav = require('./content_admin_navigation')(pb);
    const coreNav = require('./core_admin_navigation')(pb);
    const userNav = require('./user_management_navigation')(pb);
    const pluginNav = require('./plugin_admin_navigation')(pb);
    const siteNav = require('./site_admin_navigation')(pb);
    return Object.assign({},
        siteNav,
        contentNav,
        pluginNav,
        userNav,
        coreNav
    );
};




