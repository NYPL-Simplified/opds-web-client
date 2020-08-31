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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var PropTypes = require("prop-types");
var enzyme_1 = require("enzyme");
var RouterContext_1 = require("../RouterContext");
var routing_1 = require("../../../__mocks__/routing");
var router = routing_1.mockRouter(sinon_1.stub());
var WrappedRouterProvider = function (_a) {
    var children = _a.children;
    return React.createElement(RouterContext_1.default, { router: router }, children);
};
describe("RouterContext", function () {
    it("passes router down via legacy API", function () {
        /**
         * unfortunately enzyme doesn't provide a clear way to test for
         * access to context via legacy or new api that I can find.
         * This is a somewhat hacky way to do it by testing for the context
         * in a custom child component and then putting text in the dom
         * which we will expect() on via enzyme. Not pretty, but it works.
         */
        var hasAccessProof = "does have access to context";
        var Child = /** @class */ (function (_super) {
            __extends(Child, _super);
            function Child() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Child.prototype.render = function () {
                var _a;
                // here is the meat of the test
                var hasRouterContext = ((_a = this.context) === null || _a === void 0 ? void 0 : _a.router) === router;
                return (React.createElement("div", null, hasRouterContext
                    ? hasAccessProof
                    : "doesn't have access to context"));
            };
            Child.contextTypes = {
                router: PropTypes.object.isRequired
            };
            return Child;
        }(React.Component));
        var wrapper = enzyme_1.mount(React.createElement(WrappedRouterProvider, null,
            React.createElement(Child, null)));
        chai_1.expect(wrapper.text()).to.equal(hasAccessProof);
    });
    it("passes pathFor down via new API", function () {
        var Child = /** @class */ (function (_super) {
            __extends(Child, _super);
            function Child() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Child.prototype.render = function () {
                return React.createElement("div", null, "I should have access to context");
            };
            Child.contextType = RouterContext_1.RouterContext;
            return Child;
        }(React.Component));
        var wrapper = enzyme_1.mount(React.createElement(Child, null), {
            wrappingComponent: WrappedRouterProvider
        });
        chai_1.expect(wrapper.context()).to.deep.equal(router);
    });
});
