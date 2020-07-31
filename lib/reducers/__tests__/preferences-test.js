"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var preferences_1 = require("../preferences");
var DataFetcher_1 = require("../../DataFetcher");
var actions_1 = require("../../actions");
var OPDSDataAdapter_1 = require("../../OPDSDataAdapter");
var fetcher = new DataFetcher_1.default({ adapter: OPDSDataAdapter_1.adapter });
var actions = new actions_1.default(fetcher);
describe("preferences reducer", function () {
    var initState = {};
    it("returns the initial state", function () {
        chai_1.expect(preferences_1.default(undefined, {})).to.deep.equal(initState);
    });
    it("handles SET_PREFERENCE", function () {
        var action = actions.setPreference("key", "value");
        var newState = __assign(__assign({}, initState), { key: "value" });
        chai_1.expect(preferences_1.default(initState, action)).to.deep.equal(newState);
    });
});
