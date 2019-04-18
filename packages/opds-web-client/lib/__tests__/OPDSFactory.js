"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var opds_feed_parser_1 = require("opds-feed-parser");
/*
Utilities for obtaining instances of classes from opds-feed-parser.
Most of the constructor arguments use the class as their type,
so casting arguments to the class lets us avoid including
required arguments for properties we aren't testing.
*/
function acquisitionLink(props) {
    return new opds_feed_parser_1.OPDSAcquisitionLink(props);
}
exports.acquisitionLink = acquisitionLink;
function collectionLink(props) {
    return new opds_feed_parser_1.OPDSCollectionLink(props);
}
exports.collectionLink = collectionLink;
function artworkLink(props) {
    return new opds_feed_parser_1.OPDSArtworkLink(props);
}
exports.artworkLink = artworkLink;
function facetLink(props) {
    return new opds_feed_parser_1.OPDSFacetLink(props);
}
exports.facetLink = facetLink;
function shelfLink(props) {
    return new opds_feed_parser_1.OPDSShelfLink(props);
}
exports.shelfLink = shelfLink;
function searchLink(props) {
    return new opds_feed_parser_1.SearchLink(props);
}
exports.searchLink = searchLink;
function entry(props) {
    return new opds_feed_parser_1.OPDSEntry(props);
}
exports.entry = entry;
function acquisitionFeed(props) {
    return new opds_feed_parser_1.AcquisitionFeed(props);
}
exports.acquisitionFeed = acquisitionFeed;
function link(props) {
    return new opds_feed_parser_1.OPDSLink(props);
}
exports.link = link;
function navigationFeed(props) {
    return new opds_feed_parser_1.NavigationFeed(props);
}
exports.navigationFeed = navigationFeed;
function contributor(props) {
    return new opds_feed_parser_1.Contributor(props);
}
exports.contributor = contributor;
function summary(props) {
    return new opds_feed_parser_1.Summary(props);
}
exports.summary = summary;
function category(props) {
    return new opds_feed_parser_1.Category(props);
}
exports.category = category;
