jest.dontMock("../DownloadButton");
jest.dontMock("./collectionData");
jest.dontMock("../../__mocks__/downloadjs");

const download = require("../../__mocks__/downloadjs");
jest.setMock("downloadjs", download);

import * as React from "react";
import { shallow } from "enzyme";

import DownloadButton from "../DownloadButton";
import { ungroupedCollectionData } from "./collectionData";

describe("DownloadButton", () => {
  let wrapper;
  let fulfill;
  let style;

  beforeEach(() => {
    fulfill = jest.genMockFunction();
    fulfill.mockReturnValue(
      new Promise((resolve, reject) => resolve("blob"))
    );
    style = { border: "100px solid black" };
    wrapper = shallow(
      <DownloadButton
        style={style}
        url="download url"
        mimeType="application/epub+zip"
        fulfill={fulfill}
        title="title"
        />
    );
  });

  it("shows button", () => {
    let button = wrapper.find("button");
    expect(button.props().style).toBe(style);
    expect(button.text()).toBe("Download EPUB");
  });

  it("shows plain link if specified", () => {
    wrapper.setProps({ isPlainLink: true });
    let link = wrapper.find("a");
    expect(link.props().style).toBe(style);
    expect(link.props().href).toBe("download url");
    expect(link.text()).toBe("Download EPUB");
  });

  it("fulfills when clicked", () => {
    let button = wrapper.find("button");
    button.simulate("click");
    expect(fulfill.mock.calls.length).toBe(1);
  });

  it("downloads after fulfilling", (done) => {
    let button = wrapper.find("button");
    button.props().onClick().then(() => {
      expect(download.getBlob()).toBe("blob");
      expect(download.getFilename()).toBe(
        wrapper.instance().generateFilename("title")
      );
      expect(download.getMimeType()).toBe(
        wrapper.instance().mimeType()
      );
      done();
    }).catch(done.fail);
  });
});