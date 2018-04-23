module.exports = (pb) => ({
    CONTENT_NAV: Object.freeze({
        id: 'content',
        title: 'generic.CONTENT',
        icon: 'quote-right',
        href: '#',
        access: pb.SecurityService.ACCESS_WRITER,
        children: [
            {
                id: 'navigation',
                title: 'generic.NAVIGATION',
                icon: 'th-large',
                href: '/admin/content/navigation',
                access: pb.SecurityService.ACCESS_EDITOR
            },
            {
                id: 'pages',
                title: 'admin.PAGES',
                icon: 'file-o',
                href: '/admin/content/pages',
                access: pb.SecurityService.ACCESS_EDITOR
            },
            {
                id: 'media',
                title: 'admin.MEDIA',
                icon: 'camera',
                href: '/admin/content/media',
                access: pb.SecurityService.ACCESS_WRITER
            },
            {
                id: 'custom_objects',
                title: 'admin.CUSTOM_OBJECTS',
                icon: 'cubes',
                href: '/admin/content/objects/types',
                access: pb.SecurityService.ACCESS_EDITOR
            }
        ]
    })

});
