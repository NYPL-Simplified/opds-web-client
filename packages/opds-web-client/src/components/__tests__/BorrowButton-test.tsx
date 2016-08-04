jest.dontMock("../BorrowButton");
jest.dontMock("./collectionData");

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
        borrow={borrow}>
        Borrow
      </BorrowButton>
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
  });
});
