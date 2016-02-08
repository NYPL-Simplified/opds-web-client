import { feedToCollection } from "./OPDSDataAdapter";
import OPDSParser from "opds-feed-parser";
import * as request from "request";

export function fetchOPDSData(feedUrl, callback) {
  let parser = new OPDSParser;
  fetchData(feedUrl, (response) => {
    parser.parse(response).then((opdsFeed) => {
      let collectionData = feedToCollection(opdsFeed, feedUrl);
      callback(collectionData);
    });
  });
}

export default function fetchData(url, callback) {
  let httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = () => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        return callback(httpRequest.responseText);
      }
    }
  }

  httpRequest.open('POST', "/proxy", true);
  httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpRequest.send("url=" + url);
}