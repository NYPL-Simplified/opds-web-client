"use strict";
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
var useDownloadButton_1 = require("./../useDownloadButton");
var chai_1 = require("chai");
var sinon = require("sinon");
var react_hooks_1 = require("@testing-library/react-hooks");
var useDownloadButton_2 = require("../useDownloadButton");
var makeWrapper_1 = require("../../test-utils/makeWrapper");
var file_1 = require("../../utils/file");
var download = require("../../components/download");
var pdfMediaLink = {
    url: "/media-url",
    type: "application/pdf"
};
describe("useDownloadButton", function () {
    it("provides full details", function () {
        var result = react_hooks_1.renderHook(function () { return useDownloadButton_2.default(pdfMediaLink, "pdf-title"); }, { wrapper: makeWrapper_1.default().wrapper }).result;
        chai_1.expect(result.current.downloadLabel).to.equal("Download PDF");
        chai_1.expect(result.current.fileExtension).to.equal(".pdf");
        chai_1.expect(result.current.isIndirect).to.equal(false);
        chai_1.expect(result.current.mimeType).to.equal("application/pdf");
        chai_1.expect(typeof result.current.fulfill).to.equal("function");
    });
    it("fixes incorrect adobe mimeType", function () {
        var pdfMediaLink = {
            url: "/bad-mimetype-url",
            type: "vnd.adobe/adept+xml"
        };
        var result = react_hooks_1.renderHook(function () { return useDownloadButton_2.default(pdfMediaLink, "pdf-title"); }, {
            wrapper: makeWrapper_1.default().wrapper
        }).result;
        chai_1.expect(result.current.downloadLabel).to.equal("Download ACSM");
        chai_1.expect(result.current.fileExtension).to.equal(".acsm");
        chai_1.expect(result.current.isIndirect).to.equal(false);
        chai_1.expect(result.current.mimeType).to.equal("application/vnd.adobe.adept+xml");
        chai_1.expect(typeof result.current.fulfill).to.equal("function");
    });
    it("correctly maps all direct media types", function () {
        var _a, _b, _c, _d, _e;
        var _f = react_hooks_1.renderHook(function (link) {
            return useDownloadButton_2.default(link, "book-title");
        }, {
            wrapper: makeWrapper_1.default().wrapper,
            initialProps: undefined
        }), result = _f.result, rerender = _f.rerender;
        chai_1.expect(result.current).to.equal(null);
        for (var mediaType in file_1.typeMap) {
            // don't test this for the one indirect media type
            if (mediaType === useDownloadButton_1.STREAMING_MEDIA_LINK_TYPE)
                return;
            // also don't test for the one type we need to fix, test that separately
            if (mediaType === "vnd.adobe/adept+xml")
                return;
            if (mediaType === "application/vnd.librarysimplified.axisnow+json")
                return;
            var link = {
                url: "/media-url",
                type: mediaType
            };
            rerender(link);
            chai_1.expect((_a = result.current) === null || _a === void 0 ? void 0 : _a.downloadLabel).to.equal("Download " + file_1.typeMap[mediaType].name);
            chai_1.expect((_b = result.current) === null || _b === void 0 ? void 0 : _b.fileExtension).to.equal(file_1.typeMap[mediaType].extension);
            chai_1.expect((_c = result.current) === null || _c === void 0 ? void 0 : _c.isIndirect).to.equal(false);
            chai_1.expect((_d = result.current) === null || _d === void 0 ? void 0 : _d.mimeType).to.equal(mediaType);
            chai_1.expect(typeof ((_e = result.current) === null || _e === void 0 ? void 0 : _e.fulfill)).to.equal("function");
        }
    });
    it("provides correct details for streaming media type", function () {
        var link = {
            url: "/media-url",
            type: "application/atom+xml;type=entry;profile=opds-catalog",
            indirectType: "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media"
        };
        var result = react_hooks_1.renderHook(function () { return useDownloadButton_2.default(link, "pdf-title"); }, {
            wrapper: makeWrapper_1.default().wrapper
        }).result;
        chai_1.expect(result.current.downloadLabel).to.equal("Read Online");
        chai_1.expect(result.current.fileExtension).to.equal("");
        chai_1.expect(result.current.isIndirect).to.equal(true);
        chai_1.expect(result.current.mimeType).to.equal("application/atom+xml;type=entry;profile=opds-catalog");
        chai_1.expect(typeof result.current.fulfill).to.equal("function");
    });
    it("provides correct details for AxisNow type", function () {
        var link = {
            url: "/media-url",
            type: "application/vnd.librarysimplified.axisnow+json",
            indirectType: ""
        };
        var result = react_hooks_1.renderHook(function () { return useDownloadButton_2.default(link, "pdf-title"); }, {
            wrapper: makeWrapper_1.default().wrapper
        }).result;
        chai_1.expect(result.current.downloadLabel).to.equal("Read Online");
        chai_1.expect(result.current.fileExtension).to.equal(".json");
        chai_1.expect(result.current.isIndirect).to.equal(false);
        chai_1.expect(result.current.mimeType).to.equal("application/vnd.librarysimplified.axisnow+json");
        chai_1.expect(typeof result.current.fulfill).to.equal("function");
    });
    it("returns null when link is undefined", function () {
        var result = react_hooks_1.renderHook(function () { return useDownloadButton_2.default(undefined, "book-title"); }, {
            wrapper: makeWrapper_1.default().wrapper
        }).result;
        chai_1.expect(result.current).to.equal(null);
    });
    it("fulfills and downloads direct links", function () { return __awaiter(void 0, void 0, void 0, function () {
        var downloadStub, fulfillBookStub, dispatchStub, _a, wrapper, actions, store, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    downloadStub = sinon.stub(download, "default");
                    fulfillBookStub = sinon.stub();
                    dispatchStub = sinon.stub();
                    _a = makeWrapper_1.default(), wrapper = _a.wrapper, actions = _a.actions, store = _a.store;
                    actions.fulfillBook = fulfillBookStub;
                    store.dispatch = dispatchStub;
                    result = react_hooks_1.renderHook(function () { return useDownloadButton_2.default(pdfMediaLink, "book-title"); }, {
                        wrapper: wrapper
                    }).result;
                    // call fulfill
                    return [4 /*yield*/, result.current.fulfill()];
                case 1:
                    // call fulfill
                    _b.sent();
                    chai_1.expect(fulfillBookStub.callCount).to.equal(1);
                    sinon.assert.calledWith(fulfillBookStub, "/media-url");
                    chai_1.expect(dispatchStub.callCount).to.equal(1);
                    chai_1.expect(downloadStub.callCount).to.equal(1);
                    sinon.assert.calledWith(downloadStub, undefined, "book-title.pdf", "application/pdf");
                    return [2 /*return*/];
            }
        });
    }); });
    it("fulfills and opens indirect links", function () { return __awaiter(void 0, void 0, void 0, function () {
        var indirectLink, indirectFulfillStub, dispatchStub, _a, wrapper, actions, store, windowOpenStub, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    indirectLink = {
                        url: "/indirect-url",
                        type: "application/atom+xml;type=entry;profile=opds-catalog",
                        indirectType: "text/html;profile=http://librarysimplified.org/terms/profiles/streaming-media"
                    };
                    indirectFulfillStub = sinon.stub();
                    dispatchStub = sinon.stub();
                    _a = makeWrapper_1.default(), wrapper = _a.wrapper, actions = _a.actions, store = _a.store;
                    actions.indirectFulfillBook = indirectFulfillStub;
                    store.dispatch = dispatchStub.returns(indirectLink.url);
                    windowOpenStub = sinon.stub();
                    global["window"].open = windowOpenStub;
                    result = react_hooks_1.renderHook(function () { return useDownloadButton_2.default(indirectLink, "indirect-book-title"); }, {
                        wrapper: wrapper
                    }).result;
                    // call fulfill
                    return [4 /*yield*/, result.current.fulfill()];
                case 1:
                    // call fulfill
                    _b.sent();
                    sinon.assert.calledOnceWithExactly(indirectFulfillStub, "/indirect-url", indirectLink.indirectType);
                    sinon.assert.calledOnce(dispatchStub);
                    sinon.assert.calledOnceWithExactly(windowOpenStub, "/indirect-url", "_blank");
                    return [2 /*return*/];
            }
        });
    }); });
});
