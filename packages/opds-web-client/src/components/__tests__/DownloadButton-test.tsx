import { expect } from "chai";
import { stub } from "sinon";

import * as download from "../download";
const downloadMock = require("../../__mocks__/downloadjs");

import * as React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { generateFilename, typeMap } from "../../utils/file";

import DownloadButton from "../DownloadButton";
import buildStore from "../../store";
import { ActionsContext } from "../context/ActionsContext";
import ActionCreator from "../../actions";
import DataFetcher from "../../DataFetcher";
import { MediaLink, FulfillmentLink } from "../../interfaces";

describe("DownloadButton", () => {
  let wrapper;
  let fulfill;
  let indirectFulfill;
  let actionFulfillStub;
  let acctionIndirectFulfillStub;
  let style;
  let downloadStub;
  let store = buildStore();
  let fetcher = new DataFetcher();
  let actions = new ActionCreator(fetcher);
  /**
   * Function to render a component wrapped in the Redux and Actions providers.
   **/
  const providerWrapper: React.FC<React.ReactNode> = component => (
    <Provider store={store}>
      <ActionsContext.Provider value={{ actions, fetcher }}>
        {component}
      </ActionsContext.Provider>
    </Provider>
  );

  const mimeType = "application/epub+zip";
  const title = "title";

  const link: MediaLink = {
    type: mimeType,
    url: "download url"
  };
  const fulfillmentLink: FulfillmentLink = {
    type: mimeType,
    url: "download url",
    indirectType: "indirect type"
  };

  beforeEach(() => {
    downloadStub = stub(download, "default").callsFake(downloadMock);
    fulfill = stub().returns(
      async () => new Promise((resolve, reject) => resolve("blob"))
    );
    indirectFulfill = stub().returns(
      async () => new Promise((resolve, reject) => resolve("web reader url"))
    );
    actionFulfillStub = stub(actions, "fulfillBook").callsFake(fulfill);
    acctionIndirectFulfillStub = stub(actions, "indirectFulfillBook").callsFake(
      indirectFulfill
    );
    style = { border: "100px solid black" };
    let downloadButton = providerWrapper(
      <DownloadButton style={style} title={title} link={link} />
    );
    wrapper = mount(downloadButton);
  });

  afterEach(() => {
    actionFulfillStub.restore();
    acctionIndirectFulfillStub.restore();
    downloadStub.restore();
  });

  it("shows button", () => {
    let button = wrapper.find("button");
    expect(button.props().style).to.deep.equal(style);
    expect(button.text()).to.equal("Download EPUB");
  });

  it("shows plain link if specified", () => {
    let downloadButton = providerWrapper(
      <DownloadButton
        style={style}
        title="title"
        isPlainLink={true}
        link={link}
      />
    );
    wrapper = mount(downloadButton);
    let linkWrapper = wrapper.find("a");
    expect(linkWrapper.props().style).to.deep.equal(style);
    expect(linkWrapper.props().href).to.equal("download url");
    expect(linkWrapper.text()).to.equal("Download EPUB");
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
    expect(downloadMock.getFilename()).to.equal(
      generateFilename(title, typeMap[mimeType].extension)
    );
    expect(downloadMock.getMimeType()).to.equal(mimeType);
  });

  it("fulfills OPDS-based indirect links", async () => {
    const streamingLink: FulfillmentLink = {
      ...fulfillmentLink,
      type: "application/atom+xml;type=entry;profile=opds-catalog",
      indirectType:
        'text/html;profile="http://librarysimplified.org/terms/profiles/streaming-media"'
    };
    let downloadButton = providerWrapper(
      <DownloadButton style={style} title="title" link={streamingLink} />
    );
    wrapper = mount(downloadButton);
    let button = wrapper.find("button");
    await button.simulate("click");
    expect(indirectFulfill.callCount).to.equal(1);
    expect(indirectFulfill.args[0][0]).to.equal("download url");
    expect(indirectFulfill.args[0][1]).to.equal(streamingLink.indirectType);
  });

  it("fulfills ACSM-based indirect links", async () => {
    const ascmLink: FulfillmentLink = {
      url: "download url",
      type: "vnd.adobe/adept+xml",
      indirectType: "application/epub+zip"
    };
    let downloadButton = providerWrapper(
      <DownloadButton style={style} title="title" link={link} />
    );
    wrapper = mount(downloadButton);
    let button = wrapper.find("button");
    await button.simulate("click");
    expect(fulfill.callCount).to.equal(1);
    expect(fulfill.args[0][0]).to.equal("download url");
  });

  it("opens indirect fulfillment link in new tab", async () => {
    let windowStub = stub(window, "open");
    const indirectLink: FulfillmentLink = {
      type: "application/atom+xml;type=entry;profile=opds-catalog",
      url: "web reader url",
      indirectType:
        'text/html;profile="http://librarysimplified.org/terms/profiles/streaming-media"'
    };
    let downloadButton = providerWrapper(
      <DownloadButton style={style} title="title" link={indirectLink} />
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
