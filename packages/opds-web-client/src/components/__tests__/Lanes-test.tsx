jest.autoMockOff();

import * as React from "react";
import { shallow, mount } from "enzyme";

import ConnectedLanes, { Lanes } from "../Lanes";
import Lane from "../Lane";
import { groupedCollectionData } from "./collectionData";
import spinner from "../../images/spinner";
import { buildCollectionStore } from "../../store";

describe("Lanes", () => {
  let wrapper;
  let hiddenBookIds = ["book id"];

  beforeEach(() => {
    wrapper = shallow(
      <Lanes
        url={groupedCollectionData.url}
        lanes={groupedCollectionData.lanes}
        isFetching={true}
        hideMoreLinks={true}
        hiddenBookIds={hiddenBookIds}
        />
    );
  });

  it("shows lanes in order", () => {
    let lanes = wrapper.find(Lane);

    lanes.forEach((lane, i) => {
      expect(lane.props().lane).toBe(groupedCollectionData.lanes[i]);
      expect(lane.props().collectionUrl).toEqual(groupedCollectionData.url);
      expect(lane.props().hideMoreLink).toBe(true);
      expect(lane.props().hiddenBookIds).toBe(hiddenBookIds);
    });
  });

  it("shows spinner", () => {
    let spinnerImage = wrapper.find("img.lanesSpinner");
    expect(spinnerImage.props().src).toBe(spinner);
  });

  it("fetches collection on mount", () => {
    let fetchCollection = jest.genMockFunction();
    wrapper = shallow(
      <Lanes
        url={groupedCollectionData.url}
        lanes={[]}
        fetchCollection={fetchCollection}
        />
    );

    expect(fetchCollection.mock.calls.length).toBe(1);
    expect(fetchCollection.mock.calls[0][0]).toBe(groupedCollectionData.url);
  });

  it("clears collection on unmount", () => {
    let clearCollection = jest.genMockFunction();
    wrapper = shallow(
      <Lanes
        url={groupedCollectionData.url}
        lanes={[]}
        clearCollection={clearCollection}
        />
    );
    wrapper.instance().componentWillUnmount();
    expect(clearCollection.mock.calls.length).toBe(1);
  });
});