jest.dontMock("../BorrowButton");
jest.dontMock("./collectionData");
jest.dontMock("../../__mocks__/downloadjs");

const download = require("../../__mocks__/downloadjs");
jest.setMock("downloadjs", download);

import * as React from "react";
import { shallow } from "enzyme";

import BorrowButton from "../BorrowButton";
import { ungroupedCollectionData } from "./collectionData";


describe("BorrowButton", () => {
  let wrapper;
  let borrow;
  let style;
  let bookData = ungroupedCollectionData.books[0];
  bookData.borrowUrl = "borrow url";

  beforeEach(() => {
    borrow = jest.genMockFunction();
    borrow.mockReturnValue(
      new Promise((resolve, reject) => resolve({ blob: "blob", mimeType: "mime/type" }))
    );
    style = { border: "100px solid black" };
    wrapper = shallow(
      <BorrowButton
        style={style}
        book={bookData}
        borrow={borrow} />
    );
  });

  it("shows button", () => {
    let button = wrapper.find("button");
    expect(button.props().style).toBe(style);
    expect(button.text()).toBe("Borrow");
  });

  it("borrows when clicked", () => {
    let button = wrapper.find("button");
    button.simulate("click");
    expect(borrow.mock.calls.length).toBe(1);
    expect(borrow.mock.calls[0][0]).toBe(bookData.borrowUrl);
  });

  it("downloads after borrowing", (done) => {
    let button = wrapper.find("button");
    button.props().onClick().then(() => {
      expect(download.getBlob()).toBe("blob");
      expect(download.getFilename()).toBe(
        wrapper.instance().generateFilename(bookData.title)
      );
      // TODO: expect "mime/type" once we fix the link type in our OPDS entries
      // and update BorrowButton to use the dynamic mimeType
      expect(download.getMimeType()).toBe("application/vnd.adobe.adept+xml");
      done();
    }).catch(done.fail);
  });
});
