"use strict";
var download = function (blob, filename, mimeType) {
    window.__downloadjsBlob = blob;
    window.__downloadjsFilename = filename;
    window.__downloadjsMimeType = mimeType;
};
download.getBlob = function () { return window.__downloadjsBlob; };
download.getFilename = function () { return window.__downloadjsFilename; };
download.getMimeType = function () { return window.__downloadjsMimeType; };
module.exports = download;
