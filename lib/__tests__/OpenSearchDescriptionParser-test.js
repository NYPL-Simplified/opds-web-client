"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var OpenSearchDescriptionParser_1 = require("../OpenSearchDescriptionParser");
describe("OpenSearchDescriptionParser", function () {
    var parser;
    beforeEach(function () {
        parser = new OpenSearchDescriptionParser_1.default();
    });
    it("parses open search description with absolute url", function (done) {
        parser
            .parse("\n        <OpenSearchDescription>\n          <Description>d</Description>\n          <ShortName>s</ShortName>\n          <Url template=\"http://example.com/{searchTerms}\" />\n        </OpenSearchDescription>\n        ", "http://example.com")
            .then(function (result) {
            var _a, _b, _c;
            chai_1.expect((_a = result.searchData) === null || _a === void 0 ? void 0 : _a.description).to.equal("d");
            chai_1.expect((_b = result.searchData) === null || _b === void 0 ? void 0 : _b.shortName).to.equal("s");
            chai_1.expect((_c = result.searchData) === null || _c === void 0 ? void 0 : _c.template("test")).to.equal("http://example.com/test");
            done();
        })
            .catch(function (err) { return done(err); });
    });
    it("parses open search description with relative url", function (done) {
        parser
            .parse("\n        <OpenSearchDescription>\n          <Description>d</Description>\n          <ShortName>s</ShortName>\n          <Url template=\"/{searchTerms}\" />\n        </OpenSearchDescription>\n        ", "http://example.com")
            .then(function (result) {
            var _a, _b, _c;
            chai_1.expect((_a = result.searchData) === null || _a === void 0 ? void 0 : _a.description).to.equal("d");
            chai_1.expect((_b = result.searchData) === null || _b === void 0 ? void 0 : _b.shortName).to.equal("s");
            chai_1.expect((_c = result.searchData) === null || _c === void 0 ? void 0 : _c.template("test")).to.equal("http://example.com/test");
            done();
        })
            .catch(function (err) { return done(err); });
    });
});
