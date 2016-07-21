jest.dontMock("../BorrowButton");
jest.dontMock("./collectionData");

const download = jest.genMockFunction();
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
    download.mockClear();
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
      expect(download.mock.calls.length).toBe(2);
      expect(download.mock.calls[0][0]).toBe("blob");
      expect(download.mock.calls[0][1]).toBe(
        wrapper.instance().generateFilename(bookData.title)
      );
      // TODO: expect "mime/type" once we fix the link type in our OPDS entries
      // and update BorrowButton to use the dynamic mimeType
      expect(download.mock.calls[0][2]).toBe("application/vnd.adobe.adept+xml");
      done();
    }).catch(done.fail);
  });
});