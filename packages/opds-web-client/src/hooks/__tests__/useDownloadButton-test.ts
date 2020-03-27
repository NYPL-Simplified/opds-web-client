import { expect } from "chai";
import { stub } from "sinon";
import { renderHook } from "@testing-library/react-hooks";
import useDownloadButton from "../useDownloadButton";
import { MediaLink } from "./../../interfaces";
import makeWrapper from "../../test-utils/makeWrapper";

const pdfMediaLink: MediaLink = {
  url: "/media-url",
  type: "application/pdf"
};

describe("useDownloadButton", () => {
  it("provides full details", () => {
    const { result } = renderHook(
      () => useDownloadButton(pdfMediaLink, "pdf-title"),
      { wrapper: makeWrapper() }
    );

    expect(result.current.downloadLabel).to.equal("Download PDF");
    expect(result.current.fileExtension).to.equal(".pdf");
    expect(result.current.isIndirect).to.equal(false);
    expect(result.current.mimeType).to.equal("application/pdf");
    expect(typeof result.current.fulfill).to.equal("function");
  });

  it("provides full details", () => {
    const { result } = renderHook(
      () => useDownloadButton(pdfMediaLink, "pdf-title"),
      {
        wrapper: makeWrapper()
      }
    );

    expect(result.current.downloadLabel).to.equal("Download PDF");
    expect(result.current.fileExtension).to.equal(".pdf");
    expect(result.current.isIndirect).to.equal(false);
    expect(result.current.mimeType).to.equal("application/pdf");
    expect(typeof result.current.fulfill).to.equal("function");
  });
});
