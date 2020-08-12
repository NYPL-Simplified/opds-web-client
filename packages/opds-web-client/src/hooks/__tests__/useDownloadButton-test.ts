import { expect } from "chai";
import * as sinon from "sinon";
import { renderHook } from "@testing-library/react-hooks";
import useDownloadButton from "../useDownloadButton";
import {
  MediaLink,
  MediaType,
  FulfillmentLink,
  ATOM_MEDIA_TYPE,
  AXIS_NOW_WEBPUB_MEDIA_TYPE
} from "./../../interfaces";
import makeWrapper from "../../test-utils/makeWrapper";
import { typeMap } from "../../utils/file";
import * as download from "../../components/download";

const pdfMediaLink: MediaLink = {
  url: "/media-url",
  type: "application/pdf"
};

describe("useDownloadButton", () => {
  it("provides full details", () => {
    const { result } = renderHook(
      () => useDownloadButton(pdfMediaLink, "pdf-title"),
      { wrapper: makeWrapper().wrapper }
    );

    expect(result.current.downloadLabel).to.equal("Download PDF");
    expect(result.current.fileExtension).to.equal(".pdf");
    expect(result.current.mimeType).to.equal("application/pdf");
    expect(typeof result.current.fulfill).to.equal("function");
  });

  it("fixes incorrect adobe mimeType", () => {
    const pdfMediaLink: MediaLink = {
      url: "/bad-mimetype-url",
      type: "vnd.adobe/adept+xml"
    };
    const { result } = renderHook(
      () => useDownloadButton(pdfMediaLink, "pdf-title"),
      {
        wrapper: makeWrapper().wrapper
      }
    );

    expect(result.current.downloadLabel).to.equal("Download ACSM");
    expect(result.current.fileExtension).to.equal(".acsm");
    expect(result.current.mimeType).to.equal("application/vnd.adobe.adept+xml");
    expect(typeof result.current.fulfill).to.equal("function");
  });

  it("correctly maps all direct media types", () => {
    const { result, rerender } = renderHook(
      (link: MediaLink | FulfillmentLink | undefined) =>
        useDownloadButton(link, "book-title"),
      {
        wrapper: makeWrapper().wrapper,
        initialProps: undefined
      }
    );
    expect(result.current).to.equal(null);

    for (const mediaType in typeMap) {
      // don't test this for the read online media types
      if (
        mediaType === AXIS_NOW_WEBPUB_MEDIA_TYPE ||
        mediaType === ATOM_MEDIA_TYPE
      )
        return;
      // also don't test for the one type we need to fix, test that separately
      if (mediaType === "vnd.adobe/adept+xml") return;

      if (mediaType === "application/vnd.librarysimplified.axisnow+json")
        return;

      const link: MediaLink = {
        url: "/media-url",
        type: mediaType as MediaType
      };
      rerender(link);

      expect(result.current?.downloadLabel).to.equal(
        `Download ${typeMap[mediaType].name}`
      );
      expect(result.current?.fileExtension).to.equal(
        typeMap[mediaType].extension
      );
      expect(result.current?.mimeType).to.equal(mediaType);
      expect(typeof result.current?.fulfill).to.equal("function");
    }
  });

  it("provides correct details for ATOM type", () => {
    const link: FulfillmentLink = {
      url: "/media-url",
      type: "application/atom+xml;type=entry;profile=opds-catalog",
      indirectType:
        'text/html;profile="http://librarysimplified.org/terms/profiles/streaming-media"'
    };

    const { result } = renderHook(() => useDownloadButton(link, "pdf-title"), {
      wrapper: makeWrapper().wrapper
    });

    expect(result.current.downloadLabel).to.equal("Read Online");
    expect(result.current.fileExtension).to.equal("");
    expect(result.current.mimeType).to.equal(
      "application/atom+xml;type=entry;profile=opds-catalog"
    );
    expect(typeof result.current.fulfill).to.equal("function");
  });

  it("provides correct details for AxisNow type", () => {
    const link: FulfillmentLink = {
      url: "/media-url",
      type: "application/vnd.librarysimplified.axisnow+json",
      indirectType: ""
    };

    const { result } = renderHook(() => useDownloadButton(link, "pdf-title"), {
      wrapper: makeWrapper().wrapper
    });

    expect(result.current.downloadLabel).to.equal("Read Online");
    expect(result.current.fileExtension).to.equal(".json");
    expect(result.current.mimeType).to.equal(
      "application/vnd.librarysimplified.axisnow+json"
    );
    expect(typeof result.current.fulfill).to.equal("function");
  });

  it("returns null when link is undefined", () => {
    const { result } = renderHook(
      () => useDownloadButton(undefined, "book-title"),
      {
        wrapper: makeWrapper().wrapper
      }
    );
    expect(result.current).to.equal(null);
  });

  it("fulfills and downloads direct links", async () => {
    const downloadStub = sinon.stub(download, "default");
    const fulfillBookStub = sinon.stub();
    const dispatchStub = sinon.stub();
    const { wrapper, actions, store } = makeWrapper();
    actions.fulfillBook = fulfillBookStub;
    store.dispatch = dispatchStub;

    const { result } = renderHook(
      () => useDownloadButton(pdfMediaLink, "book-title"),
      {
        wrapper
      }
    );

    // call fulfill
    await result.current.fulfill();
    expect(fulfillBookStub.callCount).to.equal(1);
    sinon.assert.calledWith(fulfillBookStub, "/media-url");
    expect(dispatchStub.callCount).to.equal(1);
    expect(downloadStub.callCount).to.equal(1);
    sinon.assert.calledWith(
      downloadStub,
      undefined,
      "book-title.pdf",
      "application/pdf"
    );
  });

  it("fulfills and opens indirect links", async () => {
    const indirectLink: FulfillmentLink = {
      url: "/indirect-url",
      type: "application/atom+xml;type=entry;profile=opds-catalog",
      indirectType:
        'text/html;profile="http://librarysimplified.org/terms/profiles/streaming-media"'
    };
    const indirectFulfillStub = sinon.stub();
    const dispatchStub = sinon.stub();
    const { wrapper, actions, store } = makeWrapper();
    actions.indirectFulfillBook = indirectFulfillStub;
    store.dispatch = dispatchStub.returns(indirectLink.url);

    const windowOpenStub = sinon.stub();
    global["window"].open = windowOpenStub;

    const { result } = renderHook(
      () => useDownloadButton(indirectLink, "indirect-book-title"),
      {
        wrapper
      }
    );

    // call fulfill
    await result.current.fulfill();
    sinon.assert.calledOnceWithExactly(
      indirectFulfillStub,
      "/indirect-url",
      indirectLink.indirectType
    );
    sinon.assert.calledOnce(dispatchStub);
    sinon.assert.calledOnceWithExactly(
      windowOpenStub,
      "/indirect-url",
      "_blank"
    );
  });
});
