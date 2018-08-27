module.exports = (pb) => {
    class BaseViewController extends pb.BaseController {
        async init(ctx) {
            super.init(ctx);
            this.pageName = '';

            this.ts = this._getTemplateServiceInstance(ctx); // TODO: figured this out
        }

        _getTemplateServiceInstance() {
            let ts = new pb.TemplateService(this.serviceContext);

            // preload common flags
            var model = {
                meta_lang: this.locale,
                error_success: (flag, cb) => {
                    this._displayErrorOrSuccessCallback(flag, cb);
                },
                page_name: (flag, cb) => {
                    cb(null, this.pageName);
                },
                localization_script: (flag, cb) => {
                    let val = this.requiresClientLocalization() ?
                        pb.ClientJs.includeJS('/api/localization/script') : '';
                    cb(null, new pb.TemplateValue(val, false));
                },
                analytics: (flag, cb) => {
                    pb.AnalyticsManager.onPageRender(this.req, this.session, this.ls, cb);
                },
                wysiwyg: (flag, cb) => {
                    let wysiwygId = pb.util.uniqueId();

                    this.ts.registerLocal('wys_id', wysiwygId);
                    try {
                        let data = this.ts.loadAsync('admin/elements/wysiwyg');
                        cb(null, new pb.TemplateValue(data, false));
                    } catch (err) {
                        cb(err,null);
                    }
                },
                site_root: this.hostname,
                site_name: this.siteName,
                localized_alternate: (flag, cb) => {
                    cb(null, this._onLocalizedAlternateFlagFound(this.routeLocalized));
                }
            };
            ts.registerModel(model);
            return ts;
        };
        // TODO: move to localization service of some sort
        _onLocalizedAlternateFlagFound (routeLocalized) {
            if (!routeLocalized) {
                return '';
            }

            let pathLocale = this.pathVars.locale || '';
            let path = this.req.url;// TODO: Make sure this is the string version
            let alternativeLocales = Object.keys(this.siteObj.supportedLocales)
                .reduce((result, currentLocale) => {
                    if (this.locale === currentLocale && !pathLocale) {
                        return;//skip current language.  We don't need to list it as an alternate
                    }
                    let relationship = this.locale === currentLocale ? 'canonical' : 'alternate';

                    let urlOpts = {
                        hostname: self.hostname,
                        locale: undefined
                    };
                    if (this.locale === currentLocale) {
                        path = path.replace(`${currentLocale}/`, '').replace(currentLocale, '');
                    }
                    else if (pathLocale) {
                        path = path.replace(pathLocale, currentLocale);
                    }
                    else {
                        urlOpts.locale = currentLocale;
                    }
                    let url = pb.UrlService.createSystemUrl(path, urlOpts);
                    return `${res}<link rel="${relationship}" hreflang="${currentLocale}" href="${url}" />\n`;
                });
            return new pb.TemplateValue(alternativeLocales, false);
        };

        _displayErrorOrSuccessCallback (flag, cb) {
            if(!this.session.error && !this.session.success) {
                return cb(null, '');
            }
            let message = this.session.error || this.session.success || '';
            let cssClass = this.session.error ? 'alert-danger' : 'alert-success';

            delete this.session.success;
            delete this.session.error;

            cb(null, `<div class="alert ${cssClass} error_success">
                                ${this.ls.get(message)}<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                             </div>`);
        }
    }

    return BaseViewController;
};
