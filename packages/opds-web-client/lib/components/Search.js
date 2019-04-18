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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var prop_types_1 = require("prop-types");
/** Search box. */
var Search = /** @class */ (function (_super) {
    __extends(Search, _super);
    function Search(props) {
        var _this = _super.call(this, props) || this;
        _this.onSubmit = _this.onSubmit.bind(_this);
        return _this;
    }
    Search.prototype.render = function () {
        return (React.createElement("div", { className: "search", role: "search" }, this.props.searchData && (React.createElement("form", { onSubmit: this.onSubmit, className: this.props.className || "form-inline" },
            React.createElement("input", { className: "form-control", ref: "input", type: "text", name: "search", title: this.props.searchData.shortName, placeholder: this.props.searchData.shortName }),
            "\u00A0",
            React.createElement("button", { className: "btn btn btn-default", type: "submit" }, "Search")))));
    };
    Search.prototype.componentWillMount = function () {
        if (this.props.url) {
            this.props.fetchSearchDescription(this.props.url);
        }
    };
    Search.prototype.componentWillUpdate = function (props) {
        if (props.url && props.url !== this.props.url) {
            props.fetchSearchDescription(props.url);
        }
    };
    Search.prototype.onSubmit = function (event) {
        var searchTerms = encodeURIComponent(this.refs["input"]["value"]);
        var url = this.props.searchData.template(searchTerms);
        if (this.props.allLanguageSearch) {
            url += "&language=all";
        }
        this.context.router.push(this.context.pathFor(url, null));
        event.preventDefault();
    };
    Search.contextTypes = {
        router: prop_types_1.PropTypes.object.isRequired,
        pathFor: prop_types_1.PropTypes.func.isRequired
    };
    return Search;
}(React.Component));
exports.default = Search;
