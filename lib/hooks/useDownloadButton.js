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
var interfaces_1 = require("./../interfaces");
var ActionsContext_1 = require("../components/context/ActionsContext");
var download_1 = require("../components/download");
var file_1 = require("../utils/file");
function fixMimeType(mimeType) {
    return mimeType === "vnd.adobe/adept+xml"
        ? "application/vnd.adobe.adept+xml"
        : mimeType;
}
exports.fixMimeType = fixMimeType;
function isReadOnlineLink(link) {
    return ((link.type === "application/atom+xml;type=entry;profile=opds-catalog" &&
        link.indirectType === interfaces_1.ATOM_MEDIA_TYPE) ||
        link.type === interfaces_1.AXIS_NOW_WEBPUB_MEDIA_TYPE);
}
function useDownloadButton(link, title) {
    var _this = this;
    var _a, _b, _c;
    var _d = ActionsContext_1.useActions(), actions = _d.actions, dispatch = _d.dispatch;
    if (!link) {
        return null;
    }
    var mimeTypeValue = fixMimeType(link.type);
    // this ?? syntax is similar to x || y, except that it will only
    // fall back if the predicate is undefined or null, not if it
    // is falsy (false, 0, etc). Called nullish-coalescing
    var fileExtension = (_b = (_a = file_1.typeMap[mimeTypeValue]) === null || _a === void 0 ? void 0 : _a.extension, (_b !== null && _b !== void 0 ? _b : ""));
    var fulfill = function () { return __awaiter(_this, void 0, void 0, function () {
        var action, url, action, blob;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isReadOnlineLink(link)) return [3 /*break*/, 2];
                    action = actions.indirectFulfillBook(link.url, link.indirectType);
                    return [4 /*yield*/, dispatch(action)];
                case 1:
                    url = _a.sent();
                    window.open(url, "_blank");
                    return [3 /*break*/, 4];
                case 2:
                    action = actions.fulfillBook(link.url);
                    return [4 /*yield*/, dispatch(action)];
                case 3:
                    blob = _a.sent();
                    download_1.default(blob, file_1.generateFilename((title !== null && title !== void 0 ? title : "untitled"), fileExtension), mimeTypeValue);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var isReadOnline = isReadOnlineLink(link);
    var typeName = (_c = file_1.typeMap[mimeTypeValue]) === null || _c === void 0 ? void 0 : _c.name;
    var downloadLabel = isReadOnline
        ? "Read Online"
        : "Download" + (typeName ? " " + typeName : "");
    return {
        fulfill: fulfill,
        isReadOnline: isReadOnline,
        downloadLabel: downloadLabel,
        mimeType: mimeTypeValue,
        fileExtension: fileExtension
    };
}
exports.default = useDownloadButton;
