import { generateFilename } from "./../file";
import { expect } from "chai";

describe("file utils", () => {
  /**
   * All lowercase
   * Appends the extension
   * Replaces characters
   * handles empty extension
   * handles empty filename
   */

  describe("generateFilename", () => {
    const str = "MyFileNameWoopee";
    const ext = ".pdf";

    it("appends extension", () => {
      const result = generateFilename(str, ext);
      expect(result).to.equal("myfilenamewoopee.pdf");
    });

    it("converts to lowercase", () => {
      const result = generateFilename(str, ext);
      expect(result).to.equal("myfilenamewoopee.pdf");
    });

    it("replaces non a-z 0-9 chars with -", () => {
      const result = generateFilename(
        "this!file*is%gonna$fail#unless:these@are^all)removed",
        ".pdf"
      );
      expect(result).to.equal(
        "this-file-is-gonna-fail-unless-these-are-all-removed.pdf"
      );
    });

    it("removes trailing and leading -s ", () => {
      const result = generateFilename("-test-", ".pdf");
      expect(result).to.equal("test.pdf");
    });

    it("handles empty filename", () => {
      const result = generateFilename("", ".ext");
      expect(result).to.equal(".ext");
    });

    it("handles empty extension", () => {
      const result = generateFilename("test", "");
      expect(result).to.equal("test");
    });
  });
});
