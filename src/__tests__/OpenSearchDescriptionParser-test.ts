jest.dontMock("../OpenSearchDescriptionParser");

import OpenSearchDescriptionParser from "../OpenSearchDescriptionParser";

describe("OpenSearchDescriptionParser", () => {
  let parser: OpenSearchDescriptionParser;

  beforeEach(() => {
    parser = new OpenSearchDescriptionParser;
  });

  it("parses open search description with absolute url", (done) => {
    parser.parse(`
        <OpenSearchDescription>
          <Description>d</Description>
          <ShortName>s</ShortName>
          <Url template="http://example.com/{searchTerms}" />
        </OpenSearchDescription>
        `, "http://example.com").then((result) => {
      expect(result.data.description).toEqual("d");
      expect(result.data.shortName).toEqual("s");
      expect(result.data.template("test")).toEqual("http://example.com/test");
      done();
    }).catch(done);
  });

  it("parses open search description with relative url", (done) => {
    parser.parse(`
        <OpenSearchDescription>
          <Description>d</Description>
          <ShortName>s</ShortName>
          <Url template="/{searchTerms}" />
        </OpenSearchDescription>
        `, "http://example.com").then((result) => {
      expect(result.data.description).toEqual("d");
      expect(result.data.shortName).toEqual("s");
      expect(result.data.template("test")).toEqual("http://example.com/test");
      done();
    }).catch(done);
  });
});