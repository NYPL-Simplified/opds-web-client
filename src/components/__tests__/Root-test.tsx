jest.dontMock("../Root");
jest.dontMock("../LoadingIndicator");
jest.dontMock("../ErrorMessage");
jest.dontMock("../Collection");
jest.dontMock("../UrlForm");
jest.dontMock("../BookDetails");
jest.dontMock("./collectionData");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import { Root } from "../Root";
import Collection from "../Collection";
import UrlForm from "../UrlForm";
import BookDetails from "../BookDetails";
import { groupedCollectionData } from "./collectionData";

describe("Root", () => {
  it("shows a collection if props include collectionData", () => {
    let collectionData: CollectionProps = groupedCollectionData;
    let root = TestUtils.renderIntoDocument(
      <Root collectionData={collectionData} />
    );

    let collections = TestUtils.scryRenderedComponentsWithType(root, Collection);
    expect(collections.length).toBe(1);
    expect(collections[0].props.title).toBe(collectionData.title);
  });


  it("shows a url form if props do not include collectionData", () => {
    let root = TestUtils.renderIntoDocument(
      <Root />
    );

    let urlForms = TestUtils.scryRenderedComponentsWithType(root, UrlForm);
    expect(urlForms.length).toBe(1);
  });

  it("fetches a start url", () => {
    let startUrl = "http://feedbooks.github.io/opds-test-catalog/catalog/acquisition/blocks.xml";
    let fetchCollection = jest.genMockFunction();
    let root = TestUtils.renderIntoDocument(
      <Root startUrl={startUrl} fetchCollection={fetchCollection} />
    );

    expect(fetchCollection.mock.calls.length).toBe(1);
    expect(fetchCollection.mock.calls[0][0]).toBe(startUrl);
  });

  it("shows loading message", () => {
    let root = TestUtils.renderIntoDocument(
      <Root isFetching={true} />
    );

    let loading = TestUtils.findRenderedDOMComponentWithClass(root, "loading");
    expect(loading.textContent).toBeTruthy;
  });

  it("shows error message", () => {
    let root = TestUtils.renderIntoDocument(
      <Root error={"test error"} />
    );

    let error = TestUtils.findRenderedDOMComponentWithClass(root, "error");
    expect(error.textContent).toContain("test error");
  });

  it("shows book detail", () => {
    let bookData = groupedCollectionData.lanes[0].books[0];
    let root = TestUtils.renderIntoDocument(
      <Root book={bookData} />
    );
    let book = TestUtils.findRenderedDOMComponentWithClass(root, "bookDetails");

    expect(book.textContent).toContain(bookData.title);
    expect(book.textContent).toContain(bookData.authors.join(", "));
  });
});