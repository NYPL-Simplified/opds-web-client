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
var sinon_1 = require("sinon");
var React = require("react");
var PropTypes = require("prop-types");
var enzyme_1 = require("enzyme");
var OPDSCatalog_1 = require("../OPDSCatalog");
var routing_1 = require("../../__mocks__/routing");
describe("OPDSCatalog", function () {
    var props = {
        collectionUrl: "collection url",
        bookUrl: "book url",
        proxyUrl: "proxy url",
        navigate: sinon_1.stub(),
        pathFor: function (collectionUrl, bookUrl) {
            return "path";
        },
        bookData: {
            id: "book id",
            title: "book title",
            url: "book url"
        },
        pageTitleTemplate: function (c, b) { return "test title"; },
        epubReaderUrlTemplate: function (a) { return "test reader url"; }
    };
    var context = routing_1.mockRouterContext();
    it("passes props to Root", function () {
        var wrapper = enzyme_1.shallow(React.createElement(OPDSCatalog_1.default, __assign({}, props)), {
            context: context,
            childContextTypes: {
                router: PropTypes.object,
                pathFor: PropTypes.func
            }
        });
        /**
         * This is painfully fragile, but must be done to make
         * enzyme render the child function beneath ReactReduxContext.Consumer
         */
        var root = wrapper
            .dive()
            .dive()
            .dive()
            .dive();
        // test that all of the props we passed in are present there
        Object.keys(props).forEach(function (key) {
            chai_1.expect(root.props()[key]).to.equal(props[key]);
        });
    });
});
