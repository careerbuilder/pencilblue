module.exports = (pb) => ({
    MULTISITE_NAV: Object.freeze({
        id: 'site_entity',
        title: 'admin.MANAGE_SITES',
        icon: 'sitemap',
        href: '/admin/sites',
        access: pb.SecurityService.ACCESS_ADMINISTRATOR
    })
});
