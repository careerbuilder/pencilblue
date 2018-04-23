module.exports = (pb) => ({
    PLUGINS_NAV: Object.freeze({
        id: 'plugins',
        title: 'admin.PLUGINS',
        icon: 'puzzle-piece',
        href: '#',
        access: pb.SecurityService.ACCESS_ADMINISTRATOR,
        children: [
            {
                divider: true,
                id: 'manage',
                title: 'generic.MANAGE',
                icon: 'upload',
                href: '/kronos/plugins'
            },
            {
                id: 'themes',
                title: 'admin.THEMES',
                icon: 'magic',
                href: '/admin/themes'
            }
        ]
    })
});
