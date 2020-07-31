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
var CatalogLink_1 = require("./CatalogLink");
/** Renders a single facet group in the left sidebar of a collection, such as
    options for sorting or filtering. */
var FacetGroup = /** @class */ (function (_super) {
    __extends(FacetGroup, _super);
    function FacetGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FacetGroup.prototype.render = function () {
        return (React.createElement("div", { className: "facet-group" },
            React.createElement("h3", { className: "facet-group-label" }, this.props.facetGroup.label),
            React.createElement("ul", { "aria-label": this.props.facetGroup.label + " options", className: "subtle-list" }, this.props.facetGroup.facets.map(function (facet) { return (React.createElement("li", { key: facet.label, className: facet.active ? "active" : undefined },
                React.createElement(CatalogLink_1.default, { className: "facetLink", collectionUrl: facet.href }, facet.label))); }))));
    };
    return FacetGroup;
}(React.Component));
exports.default = FacetGroup;
