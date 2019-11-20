import { expect } from "chai";
import { stub } from "sinon";

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
    borrow = stub().returns(
      new Promise((resolve, reject) =>
        resolve({ blob: "blob", mimeType: "mime/type" })
      )
    );
    style = { border: "100px solid black" };
    wrapper = shallow(
      <BorrowButton style={style} borrow={borrow}>
        Borrow
      </BorrowButton>
    );
  });

  it("shows button", () => {
    let button = wrapper.find("button");
    expect(button.props().style).to.deep.equal(style);
    expect(button.text()).to.equal("Borrow");
  });

  it("borrows when clicked", () => {
    let button = wrapper.find("button");
    button.simulate("click");
    expect(borrow.callCount).to.equal(1);
  });
});
