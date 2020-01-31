import { expect } from "chai";
import { stub } from "sinon";

import * as download from "../download";
const downloadMock = require("../../__mocks__/downloadjs");

import * as React from "react";
import { mount, shallow } from "enzyme";
import { Provider } from "react-redux";

import DownloadButton from "../DownloadButton";
import buildStore from "../../store";
import { ActionsContext } from "../context/ActionsContext";
import ActionCreator from "../../actions";
import DataFetcher from "../../DataFetcher";

describe("DownloadButton", () => {
  let wrapper;
  let fulfill;
  let indirectFulfill;
  let acFStub;
  let acIFStub;
  let style;
  let downloadStub;
  let store = buildStore();
  let fetcher = new DataFetcher();
  let actions = new ActionCreator(fetcher);
  let wrapperFn = component => (
    <Provider store={store}>
      <ActionsContext.Provider value={actions}>
        {component}
      </ActionsContext.Provider>
    </Provider>
  );

  beforeEach(() => {
    downloadStub = stub(download, "default").callsFake(downloadMock);
    fulfill = stub().returns(
      async () => new Promise((resolve, reject) => resolve("blob"))
    );
    indirectFulfill = stub().returns(
      async () => new Promise((resolve, reject) => resolve("web reader url"))
    );
    acFStub = stub(actions, "fulfillBook").callsFake(fulfill);
    acIFStub = stub(actions, "indirectFulfillBook").callsFake(indirectFulfill);
    style = { border: "100px solid black" };
    let downloadButton = wrapperFn(
      <DownloadButton
        style={style}
        url="download url"
        mimeType="application/epub+zip"
        title="title"
      />
    );
    wrapper = mount(downloadButton);
  });

  afterEach(() => {
    acFStub.restore();
    acIFStub.restore();
    downloadStub.restore();
  });

  it("shows button", () => {
    let button = wrapper.find("button");
    expect(button.props().style).to.deep.equal(style);
    expect(button.text()).to.equal("Download EPUB");
  });

  it("shows plain link if specified", () => {
    let downloadButton = wrapperFn(
      <DownloadButton
        style={style}
        url="download url"
        mimeType="application/epub+zip"
        title="title"
        isPlainLink={true}
      />
    );
    wrapper = mount(downloadButton);
    let link = wrapper.find("a");
    expect(link.props().style).to.deep.equal(style);
    expect(link.props().href).to.equal("download url");
    expect(link.text()).to.equal("Download EPUB");
  });

  it("fulfills when clicked", () => {
    let button = wrapper.find("button");
    button.simulate("click");
    expect(fulfill.callCount).to.equal(1);
    expect(fulfill.args[0][0]).to.equal("download url");
  });

  it("downloads after fulfilling", async () => {
    let button = wrapper.find("button");
    await button.props().onClick();
    expect(downloadMock.getBlob()).to.equal("blob");
    expect(downloadMock.getFilename()).to.equal("title.epub");
    expect(downloadMock.getMimeType()).to.equal("application/epub+zip");
  });

  it("fulfills OPDS-based indirect links", async () => {
    let streamingType =
      "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
    let downloadButton = wrapperFn(
      <DownloadButton
        style={style}
        url="download url"
        mimeType="application/atom+xml;type=entry;profile=opds-catalog"
        indirectType={streamingType}
        title="title"
      />
    );
    wrapper = mount(downloadButton);
    let button = wrapper.find("button");
    await button.simulate("click");
    expect(indirectFulfill.callCount).to.equal(1);
    expect(indirectFulfill.args[0][0]).to.equal("download url");
    expect(indirectFulfill.args[0][1]).to.equal(streamingType);
  });

  it("fulfills ACSM-based indirect links", async () => {
    let downloadButton = wrapperFn(
      <DownloadButton
        style={style}
        url="download url"
        mimeType="vnd.adobe/adept+xml"
        indirectType="application/epub+zip"
        title="title"
      />
    );
    wrapper = mount(downloadButton);
    let button = wrapper.find("button");
    await button.simulate("click");
    expect(fulfill.callCount).to.equal(1);
    expect(fulfill.args[0][0]).to.equal("download url");
  });

  it("opens indirect fulfillment link in new tab", async () => {
    let windowStub = stub(window, "open");
    let downloadButton = wrapperFn(
      <DownloadButton
        style={style}
        url="web reader url"
        mimeType="application/atom+xml;type=entry;profile=opds-catalog"
        indirectType="some/type"
        title="title"
      />
    );
    wrapper = mount(downloadButton);
    let button = wrapper.find("button");

    await button.props().onClick();

    expect(windowStub.callCount).to.equal(1);
    expect(windowStub.args[0][0]).to.equal("web reader url");
    expect(windowStub.args[0][1]).to.equal("_blank");

    windowStub.restore();
  });
});
