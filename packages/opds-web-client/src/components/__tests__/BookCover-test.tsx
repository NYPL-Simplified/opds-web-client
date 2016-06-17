jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import BookCover from "../BookCover";

describe("BookCover", () => {
  let wrapper;
  let bookData = {
    id: "test id",
    title: "test book",
    authors: ["paperback writer", "brilliant recluse"]
  };

  beforeEach(() => {
    wrapper = shallow(
      <BookCover book={bookData} />
    );
  });

  it("shows title and authors", () => {
    let title = wrapper.childAt(0);
    expect(title.text()).toBe(bookData.title);

    let authors = wrapper.childAt(1);
    expect(authors.text()).toBe(bookData.authors.join(", "));
  });
});