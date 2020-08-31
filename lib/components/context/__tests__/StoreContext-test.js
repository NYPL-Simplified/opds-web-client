"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var chai_1 = require("chai");
var enzyme_1 = require("enzyme");
var react_redux_1 = require("react-redux");
var store_1 = require("../../../store");
var StoreContext_1 = require("../StoreContext");
var PathForContext_1 = require("../PathForContext");
// import { mockRouterContext } from "../../../routing";
/**
 *  Testing the StoreContext component. Based on old OPDSCatalog Tests
 *    - if not given state, it will build state on its own
 *      (seems like this should be a test of buildStore maybe?)
 *    - if given a state, it will use it and pass it down.
 *    - passes props down
 *    - test that the context really is available through old and new APIs (and it's the same?)
 *
 *    * pathFor must be available in context. Use the pathForProvider to wrap tests
 */
var pathFor = function (collectionUrl, bookUrl) {
    return "path";
};
var PathForContext = function (_a) {
    var children = _a.children;
    return React.createElement(PathForContext_1.default, { pathFor: pathFor }, children);
};
describe("StoreContext", function () {
    var props = {
        initialState: undefined,
        authPlugins: undefined
    };
    var Child = /** @class */ (function (_super) {
        __extends(Child, _super);
        function Child() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Child.prototype.render = function () {
            return React.createElement("div", null, "I should have access to context");
        };
        Child.contextType = react_redux_1.ReactReduxContext;
        return Child;
    }(React.Component));
    // provide it as a wrapping component to the test
    var CombinedContext = function (_a) {
        var children = _a.children, otherProps = __rest(_a, ["children"]);
        return (React.createElement(PathForContext, null,
            React.createElement(StoreContext_1.default, __assign({}, props, otherProps), children)));
    };
    it("passes store down via new API", function () {
        var wrapper = enzyme_1.mount(React.createElement(Child, null), { wrappingComponent: CombinedContext });
        // now we need to see if child has access to context via new api
        chai_1.expect(wrapper.context().store).to.be.ok;
        chai_1.expect(wrapper.context().store).to.have.property("dispatch");
    });
    it("creates a new store if not given a state", function () {
        var wrapper = enzyme_1.mount(React.createElement(Child, null), { wrappingComponent: CombinedContext });
        // now we need to see if child has access to context via new api
        chai_1.expect(wrapper.context().store).to.be.ok;
        chai_1.expect(wrapper.context().store).to.have.property("dispatch");
    });
    it("uses provided state if given one", function () {
        // set up an initial state
        var store = store_1.default();
        var state = store.getState();
        var wrapper = enzyme_1.mount(React.createElement(Child, null), {
            // pass the initial state in to the context wrapper
            wrappingComponent: function (_a) {
                var children = _a.children;
                return (React.createElement(CombinedContext, { initialState: state }, children));
            }
        });
        // check that the store state equals passed in state
        chai_1.expect(wrapper.context().store).to.be.ok;
        chai_1.expect(wrapper.context().store.getState()).to.deep.equal(state);
    });
});
