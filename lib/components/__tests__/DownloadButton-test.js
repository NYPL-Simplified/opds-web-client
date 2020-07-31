"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var sinon_1 = require("sinon");
var download = require("../download");
var downloadMock = require("../../__mocks__/downloadjs");
var React = require("react");
var enzyme_1 = require("enzyme");
var react_redux_1 = require("react-redux");
var file_1 = require("../../utils/file");
var DownloadButton_1 = require("../DownloadButton");
var store_1 = require("../../store");
var ActionsContext_1 = require("../context/ActionsContext");
var actions_1 = require("../../actions");
var DataFetcher_1 = require("../../DataFetcher");
describe("DownloadButton", function () {
    var wrapper;
    var fulfill;
    var indirectFulfill;
    var actionFulfillStub;
    var acctionIndirectFulfillStub;
    var style;
    var downloadStub;
    var store = store_1.default();
    var fetcher = new DataFetcher_1.default();
    var actions = new actions_1.default(fetcher);
    /**
     * Function to render a component wrapped in the Redux and Actions providers.
     **/
    var providerWrapper = function (component) { return (React.createElement(react_redux_1.Provider, { store: store },
        React.createElement(ActionsContext_1.ActionsContext.Provider, { value: { actions: actions, fetcher: fetcher } }, component))); };
    var mimeType = "application/epub+zip";
    var title = "title";
    var link = {
        type: mimeType,
        url: "download url"
    };
    var fulfillmentLink = {
        type: mimeType,
        url: "download url",
        indirectType: "indirect type"
    };
    beforeEach(function () {
        downloadStub = sinon_1.stub(download, "default").callsFake(downloadMock);
        fulfill = sinon_1.stub().returns(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return resolve("blob"); })];
        }); }); });
        indirectFulfill = sinon_1.stub().returns(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return resolve("web reader url"); })];
        }); }); });
        actionFulfillStub = sinon_1.stub(actions, "fulfillBook").callsFake(fulfill);
        acctionIndirectFulfillStub = sinon_1.stub(actions, "indirectFulfillBook").callsFake(indirectFulfill);
        style = { border: "100px solid black" };
        var downloadButton = providerWrapper(React.createElement(DownloadButton_1.default, { style: style, title: title, link: link }));
        wrapper = enzyme_1.mount(downloadButton);
    });
    afterEach(function () {
        actionFulfillStub.restore();
        acctionIndirectFulfillStub.restore();
        downloadStub.restore();
    });
    it("shows button", function () {
        var button = wrapper.find("button");
        chai_1.expect(button.props().style).to.deep.equal(style);
        chai_1.expect(button.text()).to.equal("Download EPUB");
    });
    it("shows plain link if specified", function () {
        var downloadButton = providerWrapper(React.createElement(DownloadButton_1.default, { style: style, title: "title", isPlainLink: true, link: link }));
        wrapper = enzyme_1.mount(downloadButton);
        var linkWrapper = wrapper.find("a");
        chai_1.expect(linkWrapper.props().style).to.deep.equal(style);
        chai_1.expect(linkWrapper.props().href).to.equal("download url");
        chai_1.expect(linkWrapper.text()).to.equal("Download EPUB");
    });
    it("fulfills when clicked", function () {
        var button = wrapper.find("button");
        button.simulate("click");
        chai_1.expect(fulfill.callCount).to.equal(1);
        chai_1.expect(fulfill.args[0][0]).to.equal("download url");
    });
    it("downloads after fulfilling", function () { return __awaiter(void 0, void 0, void 0, function () {
        var button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    button = wrapper.find("button");
                    return [4 /*yield*/, button.props().onClick()];
                case 1:
                    _a.sent();
                    chai_1.expect(downloadMock.getBlob()).to.equal("blob");
                    chai_1.expect(downloadMock.getFilename()).to.equal(file_1.generateFilename(title, file_1.typeMap[mimeType].extension));
                    chai_1.expect(downloadMock.getMimeType()).to.equal(mimeType);
                    return [2 /*return*/];
            }
        });
    }); });
    it("fulfills OPDS-based indirect links", function () { return __awaiter(void 0, void 0, void 0, function () {
        var streamingLink, downloadButton, button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    streamingLink = __assign(__assign({}, fulfillmentLink), { type: "application/atom+xml;type=entry;profile=opds-catalog", indirectType: "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media" });
                    downloadButton = providerWrapper(React.createElement(DownloadButton_1.default, { style: style, title: "title", link: streamingLink }));
                    wrapper = enzyme_1.mount(downloadButton);
                    button = wrapper.find("button");
                    return [4 /*yield*/, button.simulate("click")];
                case 1:
                    _a.sent();
                    chai_1.expect(indirectFulfill.callCount).to.equal(1);
                    chai_1.expect(indirectFulfill.args[0][0]).to.equal("download url");
                    chai_1.expect(indirectFulfill.args[0][1]).to.equal(streamingLink.indirectType);
                    return [2 /*return*/];
            }
        });
    }); });
    it("fulfills ACSM-based indirect links", function () { return __awaiter(void 0, void 0, void 0, function () {
        var ascmLink, downloadButton, button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ascmLink = {
                        url: "download url",
                        type: "vnd.adobe/adept+xml",
                        indirectType: "application/epub+zip"
                    };
                    downloadButton = providerWrapper(React.createElement(DownloadButton_1.default, { style: style, title: "title", link: link }));
                    wrapper = enzyme_1.mount(downloadButton);
                    button = wrapper.find("button");
                    return [4 /*yield*/, button.simulate("click")];
                case 1:
                    _a.sent();
                    chai_1.expect(fulfill.callCount).to.equal(1);
                    chai_1.expect(fulfill.args[0][0]).to.equal("download url");
                    return [2 /*return*/];
            }
        });
    }); });
    it("opens indirect fulfillment link in new tab", function () { return __awaiter(void 0, void 0, void 0, function () {
        var windowStub, indirectLink, downloadButton, button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    windowStub = sinon_1.stub(window, "open");
                    indirectLink = {
                        type: "application/atom+xml;type=entry;profile=opds-catalog",
                        url: "web reader url",
                        indirectType: "some/type"
                    };
                    downloadButton = providerWrapper(React.createElement(DownloadButton_1.default, { style: style, title: "title", link: indirectLink }));
                    wrapper = enzyme_1.mount(downloadButton);
                    button = wrapper.find("button");
                    return [4 /*yield*/, button.props().onClick()];
                case 1:
                    _a.sent();
                    chai_1.expect(windowStub.callCount).to.equal(1);
                    chai_1.expect(windowStub.args[0][0]).to.equal("web reader url");
                    chai_1.expect(windowStub.args[0][1]).to.equal("_blank");
                    windowStub.restore();
                    return [2 /*return*/];
            }
        });
    }); });
});
