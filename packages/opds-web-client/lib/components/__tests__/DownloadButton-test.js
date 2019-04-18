"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var download = require("../download");
var downloadMock = require("../../__mocks__/downloadjs");
var React = require("react");
var enzyme_1 = require("enzyme");
var DownloadButton_1 = require("../DownloadButton");
describe("DownloadButton", function () {
    var wrapper;
    var fulfill;
    var indirectFulfill;
    var style;
    var downloadStub;
    beforeEach(function () {
        downloadStub = sinon_1.stub(download, "default").callsFake(downloadMock);
        fulfill = sinon_1.stub().returns(new Promise(function (resolve, reject) { return resolve("blob"); }));
        indirectFulfill = sinon_1.stub().returns(new Promise(function (resolve, reject) { return resolve("web reader url"); }));
        style = { border: "100px solid black" };
        wrapper = enzyme_1.shallow(React.createElement(DownloadButton_1.default, { style: style, url: "download url", mimeType: "application/epub+zip", fulfill: fulfill, indirectFulfill: indirectFulfill, title: "title" }));
    });
    afterEach(function () {
        downloadStub.restore();
    });
    it("shows button", function () {
        var button = wrapper.find("button");
        chai_1.expect(button.props().style).to.deep.equal(style);
        chai_1.expect(button.text()).to.equal("Download EPUB");
    });
    it("shows plain link if specified", function () {
        wrapper.setProps({ isPlainLink: true });
        var link = wrapper.find("a");
        chai_1.expect(link.props().style).to.deep.equal(style);
        chai_1.expect(link.props().href).to.equal("download url");
        chai_1.expect(link.text()).to.equal("Download EPUB");
    });
    it("fulfills when clicked", function () {
        var button = wrapper.find("button");
        button.simulate("click");
        chai_1.expect(fulfill.callCount).to.equal(1);
        chai_1.expect(fulfill.args[0][0]).to.equal("download url");
    });
    it("downloads after fulfilling", function (done) {
        var button = wrapper.find("button");
        button.props().onClick().then(function () {
            chai_1.expect(downloadMock.getBlob()).to.equal("blob");
            chai_1.expect(downloadMock.getFilename()).to.equal(wrapper.instance().generateFilename("title"));
            chai_1.expect(downloadMock.getMimeType()).to.equal(wrapper.instance().mimeType());
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
    it("fulfills OPDS-based indirect links", function () {
        var streamingType = "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media";
        wrapper.setProps({
            mimeType: "application/atom+xml;type=entry;profile=opds-catalog",
            indirectType: streamingType
        });
        var button = wrapper.find("button");
        button.simulate("click");
        chai_1.expect(indirectFulfill.callCount).to.equal(1);
        chai_1.expect(indirectFulfill.args[0][0]).to.equal("download url");
        chai_1.expect(indirectFulfill.args[0][1]).to.equal(streamingType);
    });
    it("fulfills ACSM-based indirect links", function () {
        wrapper.setProps({
            mimeType: "vnd.adobe/adept+xml",
            indirectType: "application/epub+zip"
        });
        var button = wrapper.find("button");
        button.simulate("click");
        chai_1.expect(fulfill.callCount).to.equal(1);
        chai_1.expect(fulfill.args[0][0]).to.equal("download url");
    });
    it("opens indirect fulfillment link in new tab", function (done) {
        wrapper.setProps({
            mimeType: "application/atom+xml;type=entry;profile=opds-catalog",
            indirectType: "some/type"
        });
        var windowOpenStub = sinon_1.stub(window, "open");
        var button = wrapper.find("button");
        button.props().onClick().then(function () {
            chai_1.expect(windowOpenStub.callCount).to.equal(1);
            chai_1.expect(windowOpenStub.args[0][0]).to.equal("web reader url");
            chai_1.expect(windowOpenStub.args[0][1]).to.equal("_blank");
            done();
        }).catch(function (err) { console.log(err); throw (err); });
    });
});
