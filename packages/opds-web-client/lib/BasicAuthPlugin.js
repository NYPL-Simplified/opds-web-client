"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BasicAuthForm_1 = require("./components/BasicAuthForm");
var BasicAuthButton_1 = require("./components/BasicAuthButton");
var BasicAuthPlugin = {
    type: "http://opds-spec.org/auth/basic",
    lookForCredentials: function () { },
    formComponent: BasicAuthForm_1.default,
    buttonComponent: BasicAuthButton_1.default
};
exports.default = BasicAuthPlugin;
