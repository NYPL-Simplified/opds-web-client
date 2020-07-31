"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var React = require("react");
var enzyme_1 = require("enzyme");
var FacetGroup_1 = require("../FacetGroup");
var CatalogLink_1 = require("../CatalogLink");
describe("FacetGroup", function () {
    it("shows facet group label", function () {
        var facetGroup = {
            label: "Availability",
            facets: []
        };
        var wrapper = enzyme_1.shallow(React.createElement(FacetGroup_1.default, { facetGroup: facetGroup }));
        var label = wrapper.find(".facet-group-label");
        chai_1.expect(label.text()).to.equal(facetGroup.label);
    });
    it("shows facets", function () {
        var facetGroup = {
            label: "Availability",
            facets: [
                {
                    label: "Available now",
                    href: "available href",
                    active: true
                },
                {
                    label: "All",
                    href: "all href",
                    active: false
                }
            ]
        };
        var wrapper = enzyme_1.shallow(React.createElement(FacetGroup_1.default, { facetGroup: facetGroup }));
        var links = wrapper.find(CatalogLink_1.default);
        chai_1.expect(links.length).to.equal(2);
        chai_1.expect(links.map(function (facet) {
            return facet
                .children()
                .at(0)
                .text();
        })).to.deep.equal(facetGroup.facets.map(function (facet) { return facet.label; }));
    });
});
