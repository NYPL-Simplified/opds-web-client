"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SAML_AUTH_TYPE = "http://librarysimplified.org/authtype/SAML-2.0";
function generateCredentials(username, password) {
    var btoaStr = btoa(username + ":" + password);
    return "Basic " + btoaStr;
}
exports.generateCredentials = generateCredentials;
function flattenSamlProviders(providers) {
    return providers.reduce(function (flattened, provider) {
        if (exports.isServerSamlProvider(provider)) {
            return __spreadArrays(flattened, serverToClientSamlProviders(provider));
        }
        return __spreadArrays(flattened, [provider]);
    }, []);
}
exports.flattenSamlProviders = flattenSamlProviders;
function serverToClientSamlProviders(provider) {
    return provider.method.links.map(function (idp) {
        var _a;
        return ({
            method: {
                href: idp.href,
                type: provider.method.type,
                description: (_a = exports.getEnglishValue(idp.display_names), (_a !== null && _a !== void 0 ? _a : "Unknown SAML Provider"))
            },
            id: idp.href,
            plugin: provider.plugin
        });
    });
}
exports.getEnglishValue = function (arr) { var _a; return (_a = arr.find(function (item) { return item.language === "en"; })) === null || _a === void 0 ? void 0 : _a.value; };
exports.isServerSamlProvider = function (provider) {
    return provider.id === exports.SAML_AUTH_TYPE && "links" in provider.method;
};
