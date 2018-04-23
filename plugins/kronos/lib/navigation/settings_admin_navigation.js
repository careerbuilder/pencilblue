module.exports = (site, pb) => {

    const settingsNav = {
        id: 'settings',
        title: 'admin.SETTINGS',
        icon: 'cogs',
        href: '#',
        access: pb.SecurityService.ACCESS_ADMINISTRATOR,
        children: [
            {
                id: 'site_settings',
                title: 'admin.SITE_SETTINGS',
                icon: 'cog',
                href: '/admin/site_settings',
                access: pb.SecurityService.ACCESS_ADMINISTRATOR
            },
            {
                id: 'content_settings',
                title: 'admin.CONTENT',
                icon: 'quote-right',
                href: '/admin/site_settings/content',
                access: pb.SecurityService.ACCESS_ADMINISTRATOR
            },
            {
                id: 'email_settings',
                title: 'users.EMAIL',
                icon: 'envelope',
                href: '/admin/site_settings/email',
                access: pb.SecurityService.ACCESS_ADMINISTRATOR
            }
        ]
    };

    if (pb.SiteService.isGlobal(site)) {
        settingsNav.children.push({
            id: 'library_settings',
            title: 'site_settings.LIBRARIES',
            icon: 'book',
            href: '/admin/site_settings/libraries',
            access: pb.SecurityService.ACCESS_ADMINISTRATOR
        });
    }
    return Object.freeze(settingsNav);
};
