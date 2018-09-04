'use strict';

module.exports = function ClientJsModule(pb) {

    /**
     * Service for creating JavaScript tags
     *
     * @deprecated since v 0.9.0 will be removed in 1.0.0
     * @module Services
     * @class ClientJs
     * @constructor
     */
    class ClientJs {
        static getAngularController (objects, modules, directiveJS) {
            if(!util.isArray(modules) || modules.length === 0) {
                modules = ['ngRoute'];
            }

            let angularController = `var pencilblueApp = angular.module("pencilblueApp", ${JSON.stringify(modules)})`;
            if(directiveJS) {
                angularController += `.directive("onFinishRender", function($timeout) {return {restrict: "A", link: function(scope, element, attr) {if (scope.$last === true){$timeout(function() {${directiveJS}})}}}})`;
            }

            let scopeString = ClientJs.getAngularObjects(objects);
            angularController += `.controller("PencilBlueController", function($scope, $sce) { ${scopeString } });\n`;
            angularController += 'pencilblueApp.config(["$compileProvider",function(e) {e.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript):/)}]);';
            return ClientJs.getJSTag(angularController);
        }
        static getAngularObjects (objects) {
            return Object.keys.reduce((key, acc) => {
                let isNotFunctionDirective = pb.util.isString(objects[key]) && !objects[key].includes('function(');
                let scopeString = isNotFunctionDirective ? objects[key] : JSON.stringify(objects[key]);

                return acc + `$scope.${key} = ${scopeString};\n`;
            }, '');
        }
        static includeJS (url) {
            return new pb.TemplateValue(`<script type="text/javascript" src="${url}"></script>`, false);
        };
        static getJSTag (jsCode) {
            return new pb.TemplateValue(`<script type="text/javascript">\n${jsCode}\n</script>`, false);
        };
    }

    //exports
    return ClientJs;
};
