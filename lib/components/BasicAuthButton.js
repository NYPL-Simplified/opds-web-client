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
/** Button for selecting a basic authentication provider. */
var BasicAuthButton = /** @class */ (function (_super) {
    __extends(BasicAuthButton, _super);
    function BasicAuthButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BasicAuthButton.prototype.render = function () {
        var _a;
        var label = ((_a = this.props.provider) === null || _a === void 0 ? void 0 : _a.method.description) ? "Log in with " + this.props.provider.method.description
            : "Log in";
        return (React.createElement("input", { type: "submit", className: "btn btn-default", value: label, onClick: this.props.onClick }));
    };
    return BasicAuthButton;
}(React.Component));
exports.default = BasicAuthButton;
