jest.dontMock("../Link");

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import Link from "../Link";

let linkProps = {
  text: "test text",
  url: "http://example.com"
};

describe("Link", () => {
  it("calls processClick() when clicked", () => {
    let mockProcessClick = jest.genMockFunction();

    class SpecificLink extends Link<any> {
      href() {
        return "test href";
      }

      processClick() {
        mockProcessClick(this.props.url);
      }
    }

    let link = TestUtils.renderIntoDocument(
      <SpecificLink {...linkProps} />
    ) as SpecificLink;

    let element = TestUtils.findRenderedDOMComponentWithTag(link, "a");
    TestUtils.Simulate.click(element);

    expect(mockProcessClick.mock.calls.length).toBe(1);
    expect(mockProcessClick.mock.calls[0][0]).toBe("http://example.com");
    expect(element.getAttribute("href")).toBe("test href");
    expect(element.textContent).toBe("test text");
  });
});