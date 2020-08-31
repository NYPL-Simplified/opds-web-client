"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xml2js = require("xml2js");
var url = require("url");
var xmlParser = new xml2js.Parser({ xmlns: true });
/** Converts an open search description document into the application's internal
    representation. */
var OpenSearchDescriptionParser = /** @class */ (function () {
    function OpenSearchDescriptionParser() {
    }
    OpenSearchDescriptionParser.prototype.parse = function (xml, descriptionUrl) {
        return new Promise(function (resolve, reject) {
            xmlParser.parseString(xml, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    if (result.OpenSearchDescription) {
                        var root = result.OpenSearchDescription;
                        var description = root["Description"][0]["_"];
                        var shortName = root["ShortName"][0]["_"];
                        var templateString_1 = root["Url"][0]["$"].template.value;
                        var template = function (s) {
                            return url.resolve(descriptionUrl, templateString_1.replace("{searchTerms}", s));
                        };
                        resolve({
                            searchData: {
                                description: description,
                                shortName: shortName,
                                template: template
                            }
                        });
                    }
                }
            });
        });
    };
    return OpenSearchDescriptionParser;
}());
exports.default = OpenSearchDescriptionParser;
