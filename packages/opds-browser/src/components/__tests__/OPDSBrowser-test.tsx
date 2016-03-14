jest.autoMockOff();

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as TestUtils from "react-addons-test-utils";

import OPDSBrowser from "../OPDSBrowser";
import Root from "../Root";

class TestContainer extends React.Component<BookDetailsContainerProps, any> {
  render(): JSX.Element {
    return (
      <div className="container">
        {this.props.children}
      </div>
    );
  }
  testMethod() {
    return "test";
  }
}

describe("OPDSBrowser", () => {
  let browser;
  let props: RootProps = {
    collectionUrl: "collection url",
    bookUrl: "book url",
    proxyUrl: "proxy url",
    onNavigate: function() {},
    pathFor: function(collectionUrl: string, bookUrl: string): string { return "path"; },
    BookDetailsContainer: TestContainer,
    bookData: {
      id: "book id",
      title: "book title",
      url: "book url"
    }
  };

  beforeEach(() => {
    browser = TestUtils.renderIntoDocument(
      <OPDSBrowser {...props} />
    );
  });

  it("passes a store to Root", () => {
    let root = TestUtils.findRenderedComponentWithType(browser, Root);
    expect(root.props.store).toBeTruthy();
  });

  it("passes props to Root", () => {
    let root = TestUtils.findRenderedComponentWithType(browser, Root);

    Object.keys(props).forEach(key => {
      expect(root.props[key]).toEqual(props[key]);
    });
  });

  it("puts Root in a 'root' ref", () => {
    Object.keys(props).forEach(key => {
      expect(browser.root.props[key]).toEqual(props[key]);
    });
  });

  it("provides access to the BookDetailsContainer component", () => {
    let root = TestUtils.findRenderedComponentWithType(browser, Root) as any;
    let container = browser.getBookDetailsContainer();
    expect(container).toBeTruthy();
    expect(container.constructor.name).toBe("TestContainer");
    expect(container.testMethod()).toBe("test");
  });
});

