import { expect } from "chai";
import { stub } from "sinon";

import * as download from "../download";
const downloadMock = require("../../__mocks__/downloadjs");

import * as React from "react";
import { shallow } from "enzyme";

import DownloadButton from "../DownloadButton";

describe("DownloadButton", () => {
  let wrapper;
  let fulfill;
  let indirectFulfill;
  let style;
  let downloadStub;

  beforeEach(() => {
    downloadStub = stub(download, "default").callsFake(downloadMock);

    fulfill = stub().returns(new Promise((resolve, reject) => resolve("blob")));
    indirectFulfill = stub().returns(
      new Promise((resolve, reject) => resolve("web reader url"))
    );
    style = { border: "100px solid black" };
    wrapper = shallow(
      <DownloadButton
        style={style}
        url="download url"
        mimeType="application/epub+zip"
        fulfill={fulfill}
        indirectFulfill={indirectFulfill}
        title="title"
      />
    );
  });

  afterEach(() => {
    downloadStub.restore();
  });

  it("shows button", () => {
    let button = wrapper.find("button");
    expect(button.props().style).to.deep.equal(style);
    expect(button.text()).to.equal("Download ePub");
  });

  it("shows plain link if specified", () => {
    wrapper.setProps({ isPlainLink: true });
    let link = wrapper.find("a");
    expect(link.props().style).to.deep.equal(style);
    expect(link.props().href).to.equal("download url");
    expect(link.text()).to.equal("Download ePub");
  });

  it("fulfills when clicked", () => {
    let button = wrapper.find("button");
    button.simulate("click");
    expect(fulfill.callCount).to.equal(1);
    expect(fulfill.args[0][0]).to.equal("download url");
  });

  it("downloads after fulfilling", done => {
    let button = wrapper.find("button");
    button
      .props()
      .onClick()
      .then(() => {
        expect(downloadMock.getBlob()).to.equal("blob");
        expect(downloadMock.getFilename()).to.equal(
          wrapper.instance().generateFilename("title")
        );
        expect(downloadMock.getMimeType()).to.equal(
          wrapper.instance().mimeType()
        );
        done();
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });

  it("fulfills OPDS-based indirect links", () => {
    let streamingType =
      "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
    wrapper.setProps({
      mimeType: "application/atom+xml;type=entry;profile=opds-catalog",
      indirectType: streamingType
    });
    let button = wrapper.find("button");
    button.simulate("click");
    expect(indirectFulfill.callCount).to.equal(1);
    expect(indirectFulfill.args[0][0]).to.equal("download url");
    expect(indirectFulfill.args[0][1]).to.equal(streamingType);
  });

  it("fulfills ACSM-based indirect links", () => {
    wrapper.setProps({
      mimeType: "vnd.adobe/adept+xml",
      indirectType: "application/epub+zip"
    });
    let button = wrapper.find("button");
    button.simulate("click");
    expect(fulfill.callCount).to.equal(1);
    expect(fulfill.args[0][0]).to.equal("download url");
  });

  it("opens indirect fulfillment link in new tab", done => {
    wrapper.setProps({
      mimeType: "application/atom+xml;type=entry;profile=opds-catalog",
      indirectType: "some/type"
    });
    let windowOpenStub = stub(window, "open");
    let button = wrapper.find("button");
    button
      .props()
      .onClick()
      .then(() => {
        expect(windowOpenStub.callCount).to.equal(1);
        expect(windowOpenStub.args[0][0]).to.equal("web reader url");
        expect(windowOpenStub.args[0][1]).to.equal("_blank");
        done();
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  });
});
