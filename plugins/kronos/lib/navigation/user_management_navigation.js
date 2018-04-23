module.exports = (pb) => ({
    USERS_NAV: Object.freeze({
        id: 'users',
        title: 'admin.USERS',
        icon: 'users',
        href: '#',
        access: pb.SecurityService.ACCESS_EDITOR,
        children: [
            {
                id: 'manage',
                title: 'generic.MANAGE',
                icon: 'users',
                href: '/admin/users',
                access: pb.SecurityService.ACCESS_EDITOR
            },
            {
                id: 'permissions',
                title: 'generic.PERMISSIONS',
                icon: 'lock',
                href: '/admin/users/permissions',
                access: pb.SecurityService.ACCESS_ADMINISTRATOR
            }
        ]
    })
});
