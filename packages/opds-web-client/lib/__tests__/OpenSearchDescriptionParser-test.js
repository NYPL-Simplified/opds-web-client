"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var OpenSearchDescriptionParser_1 = require("../OpenSearchDescriptionParser");
describe("OpenSearchDescriptionParser", function () {
    var parser;
    beforeEach(function () {
        parser = new OpenSearchDescriptionParser_1.default;
    });
    it("parses open search description with absolute url", function (done) {
        parser.parse("\n        <OpenSearchDescription>\n          <Description>d</Description>\n          <ShortName>s</ShortName>\n          <Url template=\"http://example.com/{searchTerms}\" />\n        </OpenSearchDescription>\n        ", "http://example.com").then(function (result) {
            chai_1.expect(result.searchData.description).to.equal("d");
            chai_1.expect(result.searchData.shortName).to.equal("s");
            chai_1.expect(result.searchData.template("test")).to.equal("http://example.com/test");
            done();
        }).catch(function (err) { return done(err); });
    });
    it("parses open search description with relative url", function (done) {
        parser.parse("\n        <OpenSearchDescription>\n          <Description>d</Description>\n          <ShortName>s</ShortName>\n          <Url template=\"/{searchTerms}\" />\n        </OpenSearchDescription>\n        ", "http://example.com").then(function (result) {
            chai_1.expect(result.searchData.description).to.equal("d");
            chai_1.expect(result.searchData.shortName).to.equal("s");
            chai_1.expect(result.searchData.template("test")).to.equal("http://example.com/test");
            done();
        }).catch(function (err) { return done(err); });
    });
});
