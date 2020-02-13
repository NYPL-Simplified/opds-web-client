import { expect } from "chai";

import OpenSearchDescriptionParser from "../OpenSearchDescriptionParser";

describe("OpenSearchDescriptionParser", () => {
  let parser: OpenSearchDescriptionParser;

  beforeEach(() => {
    parser = new OpenSearchDescriptionParser();
  });

  it("parses open search description with absolute url", done => {
    parser
      .parse(
        `
        <OpenSearchDescription>
          <Description>d</Description>
          <ShortName>s</ShortName>
          <Url template="http://example.com/{searchTerms}" />
        </OpenSearchDescription>
        `,
        "http://example.com"
      )
      .then(result => {
        expect(result.searchData?.description).to.equal("d");
        expect(result.searchData?.shortName).to.equal("s");
        expect(result.searchData?.template("test")).to.equal(
          "http://example.com/test"
        );
        done();
      })
      .catch(err => done(err));
  });

  it("parses open search description with relative url", done => {
    parser
      .parse(
        `
        <OpenSearchDescription>
          <Description>d</Description>
          <ShortName>s</ShortName>
          <Url template="/{searchTerms}" />
        </OpenSearchDescription>
        `,
        "http://example.com"
      )
      .then(result => {
        expect(result.searchData?.description).to.equal("d");
        expect(result.searchData?.shortName).to.equal("s");
        expect(result.searchData?.template("test")).to.equal(
          "http://example.com/test"
        );
        done();
      })
      .catch(err => done(err));
  });
});
