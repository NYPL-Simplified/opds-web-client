jest.autoMockOff();

import * as React from "react";
import { shallow } from "enzyme";

import BookCover from "../BookCover";

describe("BookCover", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <BookCover
        style={{ width: "100px", height: "200px" }}
        text="More Testing"
        />
    );
  });

  it("applies style from props", () => {
    let element = wrapper.find(".bookCover");
    expect(element.prop("style").width).toBe("100px");
    expect(element.prop("style").height).toBe("200px");
  });

  it("shows text split between lines", () => {
    expect(wrapper.text()).toBe("MoreTesting"); // text() doesn't include line break
  });
});