import { expect } from "chai";
import { stub } from "sinon";

import * as React from "react";
import { shallow } from "enzyme";

import { Lanes } from "../Lanes";
import Lane from "../Lane";
import { groupedCollectionData } from "./collectionData";
import spinner from "../../images/spinner";

describe("Lanes", () => {
  let wrapper;
  let hiddenBookIds = ["book id"];
  let updateBook;
  let fulfillBook;
  let indirectFulfillBook;

  beforeEach(() => {
    updateBook = stub();
    fulfillBook = stub();
    indirectFulfillBook = stub();
    wrapper = shallow(
      <Lanes
        url={groupedCollectionData.url}
        lanes={groupedCollectionData.lanes}
        isFetching={true}
        hideMoreLinks={true}
        hiddenBookIds={hiddenBookIds}
        updateBook={updateBook}
      />
    );
  });

  it("shows lanes in order", () => {
    let lanes = wrapper.find(Lane);

    lanes.forEach((lane, i) => {
      expect(lane.props().lane).to.equal(groupedCollectionData.lanes[i]);
      expect(lane.props().collectionUrl).to.equal(groupedCollectionData.url);
      expect(lane.props().hideMoreLink).to.equal(true);
      expect(lane.props().hiddenBookIds).to.equal(hiddenBookIds);
    });
  });

  it("shows spinner", () => {
    let spinnerImage = wrapper.find(".spinner img");
    expect(spinnerImage.props().src).to.equal(spinner);
  });

  it("fetches collection on mount", () => {
    let fetchCollection = stub();
    wrapper = shallow(
      <Lanes
        url={groupedCollectionData.url}
        lanes={[]}
        fetchCollection={fetchCollection}
        updateBook={updateBook}
      />
    );

    expect(fetchCollection.callCount).to.equal(1);
    expect(fetchCollection.args[0][0]).to.equal(groupedCollectionData.url);
  });

  it("fetches new collection on componentWillReceiveProps if there's a new url", () => {
    let clearCollection = stub();
    let fetchCollection = stub();
    wrapper = shallow(
      <Lanes
        url={"test1"}
        lanes={[]}
        clearCollection={clearCollection}
        fetchCollection={fetchCollection}
        updateBook={updateBook}
      />
    );
    expect(clearCollection.callCount).to.equal(0);
    expect(fetchCollection.callCount).to.equal(1);

    wrapper.instance().componentWillReceiveProps({ url: "test1" });
    expect(clearCollection.callCount).to.equal(0);
    expect(fetchCollection.callCount).to.equal(1);

    wrapper.instance().componentWillReceiveProps({ url: "test2" });
    expect(clearCollection.callCount).to.equal(1);
    expect(fetchCollection.callCount).to.equal(2);
    expect(fetchCollection.args[1][0]).to.equal("test2");
  });

  it("clears collection on unmount", () => {
    let clearCollection = stub();
    wrapper = shallow(
      <Lanes
        url={groupedCollectionData.url}
        lanes={[]}
        clearCollection={clearCollection}
        updateBook={updateBook}
      />
    );
    wrapper.instance().componentWillUnmount();
    expect(clearCollection.callCount).to.equal(1);
  });
});
