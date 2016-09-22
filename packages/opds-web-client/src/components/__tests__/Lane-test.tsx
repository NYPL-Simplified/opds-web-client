import { expect } from "chai";

import * as React from "react";
import { shallow, mount } from "enzyme";

import Lane from "../Lane";
import Book from "../Book";
import CatalogLink from "../CatalogLink";
import LaneMoreLink from "../LaneMoreLink";
import { LaneData, BookData } from "../../interfaces";
import { mockRouterContext } from "./routing";

let books: BookData[] = [1, 2, 3].map((i) => {
  return {
    id: `test book id ${i}`,
    title: `test book title ${i}`,
    authors: [`test author ${i}`],
    summary: `test summary ${i}`,
    imageUrl: `https://example.com/testimage${i}`,
    publisher: `test publisher ${i}`
  };
});
let laneData: LaneData = {
  title: "test lane",
  books: books,
  url: "http://example.com/testlane"
};

describe("Lane", () => {
  let wrapper;

  describe("rendering", () => {
    beforeEach(() => {
      wrapper = shallow(
        <Lane lane={laneData} collectionUrl="test collection" />
      );
    });

    it("shows the lane title in a CatalogLink", () => {
      let titleLink = wrapper.find(CatalogLink);
      expect(titleLink.first().children().get(0)).to.equal(laneData.title);
    });

    it("shows Books", () => {
      let bookComponents = wrapper.find(Book);
      let bookDatas = bookComponents.map(book => book.props().book);
      let uniqueCollectionUrls = Array.from(new Set(bookComponents.map(book => book.props().collectionUrl)));

      expect(bookComponents.length).to.equal(books.length);
      expect(bookDatas).to.deep.equal(books);
      expect(uniqueCollectionUrls).to.deep.equal(["test collection"]);
    });

    it("shows more link", () => {
      let moreLink = wrapper.find(LaneMoreLink);
      expect(moreLink.prop("lane")).to.equal(laneData);
    });

    it("hides more link", () => {
      wrapper.setProps({ hideMoreLink: true });
      let moreLink = wrapper.find(LaneMoreLink);
      expect(moreLink.length).to.equal(0);
    });

    it("hides books by id", () => {
      wrapper.setProps({ hiddenBookIds: ["test book id 1"] });
      let bookComponents = wrapper.find(Book);
      expect(bookComponents.length).to.equal(books.length - 1);
      expect(bookComponents.at(0).props().book).to.equal(books[1]);
    });

    it("shows left scroll button when it's not all the way left", () => {
      wrapper.setState({ atLeft: false });
      let button = wrapper.find(".scroll-button.left");
      expect(button.length).to.equal(1);
    });

    it("hides left scroll button when it is all the way left", () => {
      wrapper.setState({ atLeft: true });
      let button = wrapper.find(".scroll-button.left");
      expect(button.length).to.equal(0);
    });

    it("shows right scroll button when it's not all the way right", () => {
      wrapper.setState({ atRight: false });
      let button = wrapper.find(".scroll-button.right");
      expect(button.length).to.equal(1);
    });

    it("hides right scroll button when it is all the way right", () => {
      wrapper.setState({ atRight: true });
      let button = wrapper.find(".scroll-button.right");
      expect(button.length).to.equal(0);
    });
  });

  describe("behavior", () => {
    beforeEach(() => {
      let context = mockRouterContext();
      wrapper = mount(
        <Lane lane={laneData} collectionUrl="test collection" />,
        {
          context,
          childContextTypes: {
            router: React.PropTypes.object,
            pathFor: React.PropTypes.func
          }
        }
      );
    });

    it("scrolls back", () => {
      wrapper.setState({ atLeft: false, atRight: true, marginLeft: -2000 });
      wrapper.instance().getContainerWidth = () => 200;
      let button = wrapper.find(".scroll-button.left");
      button.simulate("click");
      expect(wrapper.state().atLeft).to.be.false;
      expect(wrapper.state().atRight).to.be.false;
      expect(wrapper.state().marginLeft).to.be.above(-2000);
    });

    it("stops at left edge when scrolling back", () => {
      wrapper.setState({ atLeft: false, atRight: true, marginLeft: -50 });
      wrapper.instance().getContainerWidth = () => 200;
      let button = wrapper.find(".scroll-button.left");
      button.simulate("click");
      expect(wrapper.state().atLeft).to.be.true;
      expect(wrapper.state().atRight).to.be.false;
      expect(wrapper.state().marginLeft).to.equal(0);
    });

    it("scrolls forward", () => {
      wrapper.setState({ atLeft: true, atRight: false, marginLeft: 0 });
      wrapper.instance().getContainerWidth = () => 200;
      wrapper.instance().getScrollWidth = () => 2000;
      let button = wrapper.find(".scroll-button.right");
      button.simulate("click");
      expect(wrapper.state().atLeft).to.be.false;
      expect(wrapper.state().atRight).to.be.false;
      expect(wrapper.state().marginLeft).to.be.below(0);
    });

    it("stops at right edge when scrolling forward", () => {
      wrapper.setState({ atLeft: true, atRight: false, marginLeft: -1700 });
      wrapper.instance().getContainerWidth = () => 200;
      wrapper.instance().getScrollWidth = () => 2000;
      let button = wrapper.find(".scroll-button.right");
      button.simulate("click");
      expect(wrapper.state().atLeft).to.be.false;
      expect(wrapper.state().atRight).to.be.true;
      expect(wrapper.state().marginLeft).to.equal(-1800);
    });
  });
});