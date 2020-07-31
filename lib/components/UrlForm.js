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
var PropTypes = require("prop-types");
/** Page for entering the URL of an OPDS feed that's shown when no feed
    is specified in the URL. Submitting the form adds the feed to the URL. */
var UrlForm = /** @class */ (function (_super) {
    __extends(UrlForm, _super);
    function UrlForm(props) {
        var _this = _super.call(this, props) || this;
        _this.inputRef = React.createRef();
        _this.onSubmit = _this.onSubmit.bind(_this);
        return _this;
    }
    UrlForm.prototype.render = function () {
        var placeholder = "e.g. http://feedbooks.github.io/opds-test-catalog/catalog/root.xml";
        return (React.createElement("div", { className: "url-form" },
            React.createElement("h2", null, "View OPDS Feed"),
            React.createElement("form", { onSubmit: this.onSubmit, className: "form-inline" },
                React.createElement("label", { htmlFor: "opds-input" }, "Enter OPDS feed URL"),
                React.createElement("input", { id: "opds-input", ref: this.inputRef, name: "collection", type: "text", className: "form-control input-lg", defaultValue: this.props.collectionUrl, placeholder: placeholder }),
                React.createElement("button", { type: "submit", className: "btn btn-lg btn-default" }, "Go"))));
    };
    UrlForm.prototype.onSubmit = function (event) {
        var _a;
        event.preventDefault();
        var url = this.inputRef.current && this.inputRef.current.value;
        if (url !== "") {
            (_a = this.context.router) === null || _a === void 0 ? void 0 : _a.push(this.context.pathFor(url, null));
        }
    };
    UrlForm.contextTypes = {
        router: PropTypes.object.isRequired,
        pathFor: PropTypes.func.isRequired
    };
    return UrlForm;
}(React.Component));
exports.default = UrlForm;
