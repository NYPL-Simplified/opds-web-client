jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import BookCover from "../BookCover";

describe("BookCover", () => {
  describe("with no image url", () => {
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

  describe("with image url", () => {
    let wrapper;
    let bookData = {
      id: "test id",
      title: "test book",
      authors: ["paperback writer", "brilliant recluse"],
      imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/crrmnr9/cover.jpg"
    };

    beforeEach(() => {
      wrapper = shallow(
        <BookCover book={bookData} />
      );
    });

    it("shows the book cover with empty alt", () => {
      let image = wrapper.find("img");
      expect(image.props().src).toBe(bookData.imageUrl);
      expect(image.props().alt).toBe("");
    });

    it("shows the placeholder cover on image error", () => {
      let image = wrapper.find("img");
      image.simulate("error");

      let title = wrapper.childAt(0);
      expect(title.text()).toBe(bookData.title);

      let authors = wrapper.childAt(1);
      expect(authors.text()).toBe(bookData.authors.join(", "));

      // The placeholder is cleared when there are new props.
      let newBookData = {
        id: "new book",
        imageUrl: "https://dlotdqc6pnwqb.cloudfront.net/3M/abcdefg/cover.jpg"
      };
      wrapper.setProps({ book: newBookData });
      image = wrapper.find("img");
      expect(image.props().src).toBe(newBookData.imageUrl);
    });
  });
});