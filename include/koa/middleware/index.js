module.exports = function(pb) {
    const { startTime, endTime } = require('./timing')(pb);
    const { errorHandler } = require('./errors')(pb);
    const { openSession, closeSession } = require('./session')(pb); // TODO: Deprecate?
    const { parseUrl, checkPublicRoute, checkModuleRoute, systemSetupCheck, setMimeType } = require('./system')(pb);
    const { deriveSite, deriveActiveTheme, deriveRoute, inactiveAccessCheck } = require('./routing')(pb);
    const { requiresAuthenticationCheck, authorizationCheck, ipFilterCheck } = require('./auth')(pb);
    const { localizedRouteCheck, initializeLocalization } = require('./localization')(pb);
    const { instantiateController, initializeController, render, writeResponse } = require('./controller')(pb);

    const stack = [
        startTime,
        parseUrl,
        checkModuleRoute,
        checkPublicRoute,
        errorHandler,
        openSession,
        deriveSite,
        deriveActiveTheme,
        deriveRoute,
        localizedRouteCheck,
        inactiveAccessCheck,
        systemSetupCheck,
        requiresAuthenticationCheck,
        authorizationCheck,
        ipFilterCheck,
        instantiateController,
        initializeLocalization,
        initializeController,
        render,
        writeResponse,
        setMimeType,
        endTime,
        closeSession
    ];

    return {
        getAll: () => stack.map(fn => ({
            name: fn.name,
            action: fn
        }))
    }
};
