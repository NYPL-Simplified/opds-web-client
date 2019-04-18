"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var React = require("react");
var prop_types_1 = require("prop-types");
var enzyme_1 = require("enzyme");
var OPDSCatalog_1 = require("../OPDSCatalog");
var Root_1 = require("../Root");
var store_1 = require("../../store");
var routing_1 = require("./routing");
describe("OPDSCatalog", function () {
    var props = {
        collectionUrl: "collection url",
        bookUrl: "book url",
        proxyUrl: "proxy url",
        navigate: sinon_1.stub(),
        pathFor: function (collectionUrl, bookUrl) { return "path"; },
        bookData: {
            id: "book id",
            title: "book title",
            url: "book url"
        },
        pageTitleTemplate: function (c, b) { return "test title"; },
        epubReaderUrlTemplate: function (a) { return "test reader url"; }
    };
    var context = routing_1.mockRouterContext();
    it("creates a store for Root if not given one", function () {
        var wrapper = enzyme_1.shallow(React.createElement(OPDSCatalog_1.default, __assign({}, props)), { context: context,
            childContextTypes: {
                router: prop_types_1.PropTypes.object,
                pathFor: prop_types_1.PropTypes.func
            }
        });
        var root = wrapper.find(Root_1.default);
        chai_1.expect(root.props().store).to.be.ok;
    });
    it("passes state to Root if given one", function () {
        var store = store_1.default();
        var state = store.getState();
        var wrapper = enzyme_1.shallow(React.createElement(OPDSCatalog_1.default, __assign({}, props, { initialState: state })), { context: context,
            childContextTypes: {
                router: prop_types_1.PropTypes.object,
                pathFor: prop_types_1.PropTypes.func
            }
        });
        var root = wrapper.find(Root_1.default);
        chai_1.expect(root.props().store.getState()).to.deep.equal(state);
    });
    it("passes props to Root", function () {
        var wrapper = enzyme_1.shallow(React.createElement(OPDSCatalog_1.default, __assign({}, props)), { context: context,
            childContextTypes: {
                router: prop_types_1.PropTypes.object,
                pathFor: prop_types_1.PropTypes.func
            }
        });
        var root = wrapper.find(Root_1.default);
        Object.keys(props).forEach(function (key) {
            chai_1.expect(root.props()[key]).to.equal(props[key]);
        });
    });
});
