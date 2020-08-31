"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var file_1 = require("./../file");
var chai_1 = require("chai");
describe("file utils", function () {
    /**
     * All lowercase
     * Appends the extension
     * Replaces characters
     * handles empty extension
     * handles empty filename
     */
    describe("generateFilename", function () {
        var str = "MyFileNameWoopee";
        var ext = ".pdf";
        it("appends extension", function () {
            var result = file_1.generateFilename(str, ext);
            chai_1.expect(result).to.equal("myfilenamewoopee.pdf");
        });
        it("converts to lowercase", function () {
            var result = file_1.generateFilename(str, ext);
            chai_1.expect(result).to.equal("myfilenamewoopee.pdf");
        });
        it("replaces non a-z 0-9 chars with -", function () {
            var result = file_1.generateFilename("this!file*is%gonna$fail#unless:these@are^all)removed", ".pdf");
            chai_1.expect(result).to.equal("this-file-is-gonna-fail-unless-these-are-all-removed.pdf");
        });
        it("removes trailing and leading -s ", function () {
            var result = file_1.generateFilename("-test-", ".pdf");
            chai_1.expect(result).to.equal("test.pdf");
        });
        it("handles empty filename", function () {
            var result = file_1.generateFilename("", ".ext");
            chai_1.expect(result).to.equal(".ext");
        });
        it("handles empty extension", function () {
            var result = file_1.generateFilename("test", "");
            chai_1.expect(result).to.equal("test");
        });
    });
});
