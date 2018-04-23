module.exports = (pb) => ({
    VIEW_SITE_NAV: Object.freeze({
        id: 'view_site',
        title: 'admin.VIEW_SITE',
        icon: 'desktop',
        href: '/',
        access: pb.SecurityService.ACCESS_WRITER
    }),
    LOGOUT_NAV: Object.freeze({
        id: 'logout',
        title: 'generic.LOGOUT',
        icon: 'power-off',
        href: '/actions/kronos/logout',
        access: pb.SecurityService.ACCESS_WRITER
    })
});
