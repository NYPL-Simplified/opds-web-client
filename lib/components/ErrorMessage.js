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
/** Shows an error message dialog when a request fails. */
var ErrorMessage = /** @class */ (function (_super) {
    __extends(ErrorMessage, _super);
    function ErrorMessage() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ErrorMessage.prototype.render = function () {
        return (React.createElement("div", { className: "error", role: "dialog", "aria-labelledby": "error" },
            React.createElement("div", null,
                React.createElement("h1", { id: "error" }, "Error"),
                React.createElement("div", { className: "message" }, this.props.message),
                React.createElement("br", null),
                this.props.retry && (React.createElement("button", { className: "retry-button btn btn-default", onClick: this.props.retry }, "Try again")),
                this.props.close && (React.createElement("button", { className: "close-button btn btn-default", onClick: this.props.close }, "Close")))));
    };
    ErrorMessage.prototype.maxWordLength = function () {
        if (typeof this.props.message !== "string") {
            return 0;
        }
        var words = this.props.message.split("/s/");
        if (words.length > 0) {
            return words.sort(function (word) { return -word.length; })[0].length;
        }
        else {
            return 0;
        }
    };
    return ErrorMessage;
}(React.Component));
exports.default = ErrorMessage;
