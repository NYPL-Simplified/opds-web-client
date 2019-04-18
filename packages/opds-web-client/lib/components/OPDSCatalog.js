"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var prop_types_1 = require("prop-types");
var Root_1 = require("./Root");
var store_1 = require("../store");
var BasicAuthPlugin_1 = require("../BasicAuthPlugin");
/** The main application component. */
var OPDSCatalog = /** @class */ (function (_super) {
    __extends(OPDSCatalog, _super);
    function OPDSCatalog(props, context) {
        var _this = _super.call(this, props) || this;
        _this.store = store_1.default(_this.props.initialState || undefined, _this.props.authPlugins || [BasicAuthPlugin_1.default], context.pathFor);
        return _this;
    }
    OPDSCatalog.prototype.render = function () {
        var props = Object.assign({}, this.props, {
            store: this.store
        });
        return (React.createElement(Root_1.default, __assign({}, props)));
    };
    OPDSCatalog.contextTypes = {
        router: prop_types_1.PropTypes.object.isRequired,
        pathFor: prop_types_1.PropTypes.func.isRequired
    };
    return OPDSCatalog;
}(React.Component));
exports.default = OPDSCatalog;
