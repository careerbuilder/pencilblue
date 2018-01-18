module.exports = function(pb) {

    let TemplateLoader = null;

    const CUSTOM_PATH_PREFIX = path.join(pb.config.plugins.directory) + path.sep;

    class TemplateService extends pb.BaseService {
        constructor(context) {
            super(context);

            this.ls = context.ls;
            this.activeTheme = context.activeTheme;

            this._registeredTemplates = {};

            TemplateService._createTemplateLoader();

            this.reprocess = false;
            this.unregisteredFlagHandler = null;

            this.site = pb.SiteService.getCurrentSite(context.site);
            this.settingService = pb.SettingServiceFactory.getServiceBySite(this.site);
            this.pluginService = new pb.PluginService(this.context);

            this.init();
        }

        init() {
            this.registerLocal('year', (new Date()).getFullYear());

            this.registerLocal('site_icon', (err, callback) => this.pluginService.getActiveIcon(callback));
            this.registerLocal('site_logo', (err, callback) => {
                return this.settingService.get('site_logo', (err, logo) => callback(err, logo || '/img/pb_logo.png'));
            });

        }

        static _createTemplateLoader() {
            TemplateLoader = TemplateLoader || new pb.TemplateLoader(this.context); // TODO: attach to pb and fix it
        }


        registerLocal(flag, callbackFunctionOrValue) {
            this._registeredTemplates[flag] = callbackFunctionOrValue || '';
        }

        getRegisteredLocal(flag) {
            return this._registeredTemplates[flag] || null;
        }

        setReprocess(reprocess) { // TODO: Make this just not a feature that is
            this.reprocess = !!reprocess;
        };


        static isFlag(content, flag) {
            return !content || content === `^${flag}^`;
        }

        static isTemplateBlacklisted (theme, relativePath) {
            return TEMPLATE_MIS_CACHE[theme + '|' + relativePath];
        }

        static blacklistTemplate (theme, relativePath) {
            pb.log.silly(`TemplateService: Blacklisting template THEME=${theme} PATH=${relativePath}`);
            return (TEMPLATE_MIS_CACHE[theme + '|' + relativePath] = true);
        };
    }
    //constants
    var TEMPLATE_PREFIX = 'tmp_';
    var TEMPLATE_PREFIX_LEN = TEMPLATE_PREFIX.length;
    var LOCALIZATION_PREFIX = 'loc_';
    var LOCALIZATION_PREFIX_LEN = LOCALIZATION_PREFIX.length;

    var TEMPLATE_LOADER = null;

    var TEMPLATE_PIECE_STATIC = 'static';
    var TEMPLATE_PIECE_FLAG = 'flag';

    /**
     * Tracks the template keys that do not exist on disk.  This allows us to
     * skip disk reads after the first request for a non-existent template
     * @private
     * @static
     * @property MIS_CACHE
     * @type {Object}
     */
    var TEMPLATE_MIS_CACHE = {};

    /**
     * The absolute path to the plugins directory
     * @private
     * @static
     * @property CUSTOM_PATH_PREFIX
     * @type {String}
     */

    /**
     * A container that provides the mapping for global call backs.  These should
     * only be added to at the start of the application or on plugin install/update.
     *
     * @private
     * @property
     */
    var GLOBAL_CALLBACKS = {
        site_root: pb.config.siteRoot,
        site_name: pb.config.siteName,
        site_menu_logo: '/img/logo_menu.png',
        version: pb.config.version
    };

    /**
     * The default handler for unregistered flags.  It outputs the flag back out.
     * @property unregisteredFlagHandler
     * @type {Function}
     */
    TemplateService.unregisteredFlagHandler = function (flag, cb) {
        cb(null, '^' + flag + '^');
    };


    /**
     * Retrieves the active theme.  When not provided the service retrieves it
     * from the settings service.
     * @private
     * @method _getActiveTheme
     * @param {Function} cb
     */
    TemplateService.prototype._getActiveTheme = function (cb) {
        if (this.activeTheme) {
            return cb(null, this.activeTheme);
        }
        this.settingService.get('active_theme', cb);
    };

    /**
     * Retrieves the raw template based on a priority.  The path to the template is
     * derived from the specified relative path and the following order of
     * directories:
     * <ol>
     * <li>The theme provided by "getTheme" if not null</li>
     * <li>The globally set active_theme</li>
     * <li>Iterates over the list of active plugins looking for the template</li>
     * <li>The system template directory</li>
     * </ol>
     *
     * @method getTemplateContentsByPriority
     * @param {string} relativePath
     * @param {function} cb Callback function
     */
    TemplateService.prototype.getTemplateContentsByPriority = function (relativePath, cb) {
        var self = this;

        //build set of paths to search through
        var paths = [];
        var hintedTheme = this.getTheme();
        if (hintedTheme && !TemplateService.isTemplateBlacklisted(hintedTheme, relativePath)) {
            paths.push({
                plugin: hintedTheme,
                path: TemplateService.getCustomPath(hintedTheme, relativePath)
            });
        }

        this._getActiveTheme(function (err, activeTheme) {

            if (activeTheme !== null && !TemplateService.isTemplateBlacklisted(activeTheme, relativePath)) {
                paths.push({
                    plugin: activeTheme,
                    path: TemplateService.getCustomPath(activeTheme, relativePath)
                });
            }

            var activePlugins = self.pluginService.getActivePluginNames();
            for (var i = 0; i < activePlugins.length; i++) {
                if (!TemplateService.isTemplateBlacklisted(activePlugins[i], relativePath) &&
                    hintedTheme !== activePlugins[i] && pb.config.plugins.default !== activePlugins[i]) {

                    paths.push({
                        plugin: activePlugins[i],
                        path: TemplateService.getCustomPath(activePlugins[i], relativePath)
                    });
                }
            }

            //now add the default if appropriate
            if (!TemplateService.isTemplateBlacklisted(pb.config.plugins.default, relativePath)) {
                paths.push({
                    plugin: pb.config.plugins.default,
                    path: TemplateService.getCustomPath(pb.config.plugins.default, relativePath)
                });
            }

            //iterate over paths until a valid template is found
            var j = 0;
            var doLoop = true;
            var template = null;
            async.whilst(
                function () {
                    return j < paths.length && doLoop;
                },
                function (callback) {

                    //attempt to load template
                    TEMPLATE_LOADER.get(paths[j].path, function (err, templateData) {
                        template = templateData;
                        doLoop = util.isError(err) || !util.isObject(template);
                        if (doLoop) {
                            TemplateService.blacklistTemplate(paths[j].plugin, relativePath);
                        }

                        j++;
                        callback();
                    });
                },
                function (err) {
                    cb(err, template);
                }
            );
        });
    };

    /**
     * Loads a template file along with any encountered sub-template files and
     * processes any flags.  The call back provides any error encountered and a
     * second parameter that is the transformed content.
     *
     * @method load
     * @param {string}   templateLocation The relative location of the template file.
     * @param {function} cb               Callback function
     */
    TemplateService.prototype.load = function (templateLocation, cb) {
        if (!util.isFunction(cb)) {
            throw new Error('cb parameter must be a function');
        }

        var self = this;
        this.getTemplateContentsByPriority(templateLocation, function (err, templateContents) {
            if (util.isError(err)) {
                return cb(err, null);
            }
            if (!templateContents) {
                return cb(new Error('Failed to find a matching template for location: ' + templateLocation), null);
            }

            self.process(templateContents, cb);
        });
    };

    /**
     * Scans the template for flags.  The callback provides any error and a second
     * parameter that is the populated template with any registered flags replaced.
     *
     * @method process
     * @param {Object} content The raw content to be inspected for flags
     * @param {function} cb Callback function
     */
    TemplateService.prototype.process = function (content, cb) {
        if (!util.isObject(content)) {
            return cb(new Error("TemplateService: A valid content object is required in order for the template engine to process the value. Content=" + util.inspect(content)), content);
        }
        else if (!util.isFunction(cb)) {
            throw new Error('cb parameter must be a function');
        }

        //iterate parts
        var self = this;
        var isSilly = pb.log.isSilly();
        var tasks = util.getTasks(content.parts, function (parts, i) {
            return function (callback) {

                //callback with static content
                var part = parts[i];
                if (part.type === TEMPLATE_PIECE_STATIC) {
                    return callback(null, part.val);
                }
                else if (part.type === TEMPLATE_PIECE_FLAG) {

                    self.processFlag(part.val, function (err, subContent) {
                        if (isSilly) {
                            var str = subContent;
                            if (util.isString(str) && str.length > 20) {
                                str = str.substring(0, 17) + '...';
                            }
                            pb.log.silly("TemplateService: Processed flag [%s] Content=[%s]", part.val, str);
                        }
                        callback(err, subContent);
                    });
                }
                else {
                    pb.log.error('An invalid template part type was provided: %s', part.type);
                    callback(new Error('An invalid template part type was provided: ' + part.type));
                }
            };
        });
        async.series(tasks, function (err, results) {
            cb(err, util.isArray(results) ? results.join('') : '');
        });
    };

    /**
     * Called when a flag is encountered by the processing engine.  The function is
     * responsible for delegating out the responsibility of the flag to the
     * registered entity.  Some flags are handled by default (although they can
     * always be overriden locally or globally).  The following flags are considered
     * "baked in" and will be handled automatically unless overriden:
     * <ul>
     * <li>^loc_xyz^ - A localization flag.  When provided, the Localization
     * instance will have its "get" function called in an attempt to retrieve the
     * properly translated value for the key (the part betwee "^loc_" and the ending
     * "^").
     * </li>
     * <li>^tmp_somedir=someotherdir=templatefileminusext^ - Specifies a
     * sub-template that should be loaded processed.  The file is expected to have
     * a .html extension.
     * </li>
     * </ul>
     *
     * @method processFlag
     * @param {string} flag The flag to be processed. The value should NOT contain
     * the carrot (^) prefix or postfix.
     * @param {function} cb Callback function
     */
    TemplateService.prototype.processFlag = function (flag, cb) {
        var self = this;

        //check local
        var doFlagProcessing = function (flag, cb) {
            var tmp;
            if ((tmp = self._registeredTemplates[flag]) !== undefined) {//local callbacks
                return self.handleReplacement(flag, tmp, cb);
            }
            else if ((tmp = GLOBAL_CALLBACKS[flag]) !== undefined) {//global callbacks
                return self.handleReplacement(flag, tmp, cb);
            }
            else if (flag.indexOf(LOCALIZATION_PREFIX) === 0 && self.localizationService) {//localization
                var model = {};
                var params = flag.split('/')[1];
                if (params) {
                    params = params.split(',');
                    for (var i = 0; i < params.length; i++) {
                        var paramParts = params[i].split(':');
                        model[paramParts[0]] = paramParts[1];
                    }
                }

                //TODO how do we express params?  Other template vars?
                var key = flag.substring(LOCALIZATION_PREFIX_LEN, flag.indexOf('/') !== -1 ? flag.indexOf('/') : flag.length);
                var opts = {
                    site: self.site,
                    plugin: self.activeTheme,
                    defaultVal: null,
                    params: model
                };
                var val = self.localizationService.g(key, opts);
                if (!util.isString(val)) {
                    //TODO this is here to be backwards compatible. Remove in 1.0
                    val = self.localizationService.get(key);
                }

                return cb(null, val);
            }
            else if (flag.indexOf(TEMPLATE_PREFIX) === 0) {//sub-templates
                self.handleTemplateReplacement(flag, function (err, template) {
                    cb(null, template);
                });
            }
            else {

                //log result
                if (pb.log.isSilly()) {
                    pb.log.silly("TemplateService: Failed to process flag [%s]", flag);
                }

                //the flag was not registered.  Hand it off to a handler for any
                //catch-all processing.
                if (util.isFunction(self.unregisteredFlagHandler)) {
                    self.unregisteredFlagHandler(flag, cb);
                }
                else {
                    TemplateService.unregisteredFlagHandler(flag, cb);
                }
            }
        };
        doFlagProcessing(flag, cb);
    };

    /**
     * When a sub-template flag is encountered by the processing engine this
     * function is called to parse the flag and delegate out the loading and
     * processing of the sub-template.
     *
     * @method handleTemplateReplacement
     * @param {string} flag The sub-template flag
     * @param {function} cb Callback function
     */
    TemplateService.prototype.handleTemplateReplacement = function (flag, cb) {
        var pattern = flag.substring(TEMPLATE_PREFIX_LEN);
        var templatePath = pattern.replace(/=/g, path.sep);

        if (pb.log.isSilly()) {
            pb.log.silly("Template Serice: Loading Sub-Template. FLAG=[%s] Path=[%s]", flag, templatePath);
        }
        this.load(templatePath, function (err, template) {
            cb(err, template);
        });
    };

    /**
     * Called when the processing engine encounters a non-sub-template flag.  The
     * function delegates the content transformation out to either the locally or
     * globally registered function.  In the event that a value was registered and not
     * a function then the value is used as the second parameter in the callback.
     * During template re-assembly the value will be converted to a string.
     *
     * @method handleReplacement
     * @param {string} flag The flag to transform
     * @param {*} replacement The value can either be a function to handle the
     * replacement or a value.
     * @param {function} cb Callback function
     */
    TemplateService.prototype.handleReplacement = function (flag, replacement, cb) {
        var self = this;
        var handler = function (err, content) {

            //check for special condition
            if (content instanceof TemplateValue) {
                content = content.val();
            }
            else if (util.isObject(content) || util.isString(content)) {
                content = HtmlEncoder.htmlEncode(content.toString());
            }

            //prevent infinite loops
            if (!self.reprocess || TemplateService.isFlag(content, flag)) {
                cb(err, content);
            }
            else {
                content = {
                    parts: TemplateService.compile(content)
                };
                self.process(content, cb);
            }
        };

        //do replacement
        if (typeof replacement === 'function') {
            replacement(flag, handler);
        }
        else {
            handler(null, replacement);
        }
    };

    /**
     * Registers a value or function for the specified
     *
     * @method registerLocal
     * @param {string} flag The flag name to map to the value when encountered in a
     * template.
     * @param {*} callbackFunctionOrValue The function to execute to perform the
     * transformation or the value to substitute in place of the flag.
     * @return {Boolean} TRUE when registered successfully, FALSE if not
     */
    TemplateService.prototype.registerLocal = function (flag, callbackFunctionOrValue) {
        this._registeredTemplates[flag] = callbackFunctionOrValue || '';
        return true;
    };

    /**
     * Registers a model with the template service.  It processes each
     * key/value pair in the object and creates a dot notated string
     * registration.  For the object { key: 'value' } with a model name of
     * "item" would result in 1 local value registration in which the key would
     * be "item.key".  If no model name existed the registered key would be:
     * "key". The algorithm fails fast.  On the first bad registeration the
     * algorithm stops registering keys and returns.  Additionally, if a bad
     * model object is pass an Error object is thrown.
     * @method registerModel
     * @param {Object} model The model is inspect
     * @param {String} [modelName] The optional name of the model.  The name
     * will prefix all of the model's keys.
     * @return {Boolean} TRUE when all keys were successfully registered.
     * FALSE if a single items fails to register.
     */
    TemplateService.prototype.registerModel = function (model, modelName) {
        if (!util.isObject(model)) {
            throw new Error('The model parameter is required');
        }
        if (!util.isString(modelName)) {
            modelName = '';
        }

        //load up the first set of items
        var queue = [];
        util.forEach(model, function (val, key) {
            queue.push({
                key: key,
                prefix: modelName,
                value: val
            });
        });

        //create the processing function
        var self = this;
        var register = function (prefix, key, value) {

            var flag = (prefix ? prefix + '.' : prefix) + key;
            if (util.isObject(value) && !(value instanceof TemplateValue)) {

                util.forEach(value, function (value, key) {
                    queue.push({
                        key: key,
                        prefix: flag,
                        value: value
                    });
                });
                return true;
            }
            return self.registerLocal(flag, value);
        };

        //process the queue until it is empty
        var completedResult = true;
        while (queue.length > 0 && completedResult) {
            var item = queue.shift();
            completedResult = completedResult && register(item.prefix, item.key, item.value);
        }
        return completedResult;
    };

    /**
     * Creates an instance of Template service based
     * @method getChildInstance
     * @return {TemplateService}
     */
    TemplateService.prototype.getChildInstance = function () {

        var opts = {
            ls: this.localizationService,
            activeTheme: this.activeTheme,
            site: this.site
        };
        var childTs = new TemplateService(opts);
        childTs.theme = this.theme;
        childTs._registeredTemplates = util.merge(this._registeredTemplates, {});
        childTs.reprocess = this.reprocess;
        childTs.unregisteredFlagHandler = this.unregisteredFlagHandler;
        return childTs;
    };

    /**
     * Retrieves the content templates that are available for use to render
     * Articles and pages.
     * @deprecated
     * @method getAvailableContentTemplates
     * @param site
     * @return {Array} An array of template definitions
     */
    TemplateService.getAvailableContentTemplates = function (site) {
        var templates = pb.PluginService.getActiveContentTemplates(site);
        templates.push(
            {
                theme_uid: pb.config.plugins.default,
                theme_name: 'PencilBlue',
                name: "Default",
                file: "index"
            }
        );
        return templates;
    };

    /**
     * Retrieves the path to a template file based on the assumption that
     * the provided path is relative to the pencilblue/plugins/[themeName]/templates/ directory.
     *
     * @static
     * @method getCustomPath
     * @param {string} themeName
     * @param {string} templateLocation
     * @return {string} The absolute path
     */
    TemplateService.getCustomPath = function (themeName, templateLocation) {
        return CUSTOM_PATH_PREFIX + themeName + '/templates/' + templateLocation + '.html';
    };

    /**
     * Compiles the content be eagerly searching for flags/directives.  The static
     * content is also placed into an object.  Whether static or a flag, an object
     * is created and pushed into an array.  Each object has two properties: "type"
     * that describes the type of template part it is (static, flag).  "val" the
     * string value of the part.
     * @static
     * @method compile
     * @param {String} text The template text to compile
     * @param {String} [start='^'] The starting flag marker
     * @param {String} [end='^'] The ending flag marker
     * @return {Array} The array template parts
     */
    TemplateService.compile = function (text, start, end) {
        if (!pb.ValidationService.isNonEmptyStr(text, true)) {
            pb.log.silly('TemplateService: Cannot parse the content because it is not a valid string: ' + text);
            return [];
        }
        if (!pb.ValidationService.isNonEmptyStr(start, true)) {
            start = '^';
        }
        if (!pb.ValidationService.isNonEmptyStr(end, true)) {
            end = '^';
        }

        //generates the proper part form
        var genPiece = function (type, val) {
            return {
                type: type,
                val: val
            };
        };

        var i;
        var flag = null;
        var staticContent = null;
        var compiled = [];
        while ((i = text.indexOf(start)) >= 0) {

            var start_pos = i + start.length;
            var end_pos = text.indexOf(end, start_pos);
            if (end_pos >= 0) {

                //determine precursing static content & flag
                flag = text.substring(start_pos, end_pos);
                staticContent = text.substring(0, start_pos - start.length);

                //add the static content
                if (staticContent) {
                    compiled.push(genPiece(TEMPLATE_PIECE_STATIC, staticContent));
                }

                //add the flag
                if (flag) {
                    compiled.push(genPiece(TEMPLATE_PIECE_FLAG, flag));
                }

                //cut the text down to after the current flag
                text = text.substring(end_pos + end.length);
                if (!text) {
                    break;
                }
            }
            else {
                break;
            }
        }

        //add what's left
        if (text) {
            compiled.push(genPiece(TEMPLATE_PIECE_STATIC, text));
        }
        return compiled;
    };

    return TemplateService;
};
